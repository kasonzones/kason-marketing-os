/**
 * WordPress REST API Client
 *
 * Provides a complete wrapper around the WordPress REST API (wp/v2). Handles
 * authentication via Application Passwords, automatic retries with exponential
 * backoff, structured error responses, and request logging.
 *
 * Requirements: Node.js 18+ (global `fetch` API)
 */

'use strict';

const config = require('./config');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Delay for the given number of milliseconds.
 * @param {number} ms
 * @returns {Promise<void>}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determine whether an HTTP status code warrants a retry.
 * @param {number} status
 * @returns {boolean}
 */
function isRetryable(status) {
  return config.RETRY.retryableStatuses.includes(status);
}

/**
 * Build a simple logger prefix for the client.
 * @returns {string}
 */
function logPrefix() {
  return `[WP-Client ${new Date().toISOString()}]`;
}

// ---------------------------------------------------------------------------
// WordPressClient
// ---------------------------------------------------------------------------

class WordPressClient {
  /**
   * Create a WordPress API client instance.
   * @param {object} [overrides] - Optional config overrides (merges with defaults)
   * @param {string} [overrides.apiBase] - Custom API base URL
   * @param {string} [overrides.authHeader] - Custom auth header value
   * @param {number} [overrides.timeout] - Request timeout in ms
   * @param {object} [overrides.retry] - Retry settings {maxRetries, baseDelayMs, retryableStatuses}
   */
  constructor(overrides = {}) {
    this.apiBase = overrides.apiBase || config.WP_API_BASE;
    this.authHeader = overrides.authHeader || config.WP_AUTH_HEADER;
    this.timeout = overrides.timeout || config.API_TIMEOUT_MS;
    this.retry = { ...config.RETRY, ...(overrides.retry || {}) };
  }

  // -----------------------------------------------------------------------
  // Core request method
  // -----------------------------------------------------------------------

  /**
   * Generic authenticated request with automatic retry and error handling.
   *
   * @param {string} method   - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} endpoint - API endpoint path relative to base (e.g. '/posts')
   * @param {object} [data]   - Request body for POST/PUT (sent as JSON)
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async request(method, endpoint, data = null) {
    const url = `${this.apiBase}${endpoint}`;
    const startTime = Date.now();

    let attempt = 0;
    let lastError = null;

    while (attempt <= this.retry.maxRetries) {
      attempt++;
      const attemptStart = Date.now();

      try {
        console.log(
          `${logPrefix()} REQ attempt=${attempt} ${method} ${endpoint}`
        );

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const headers = {
          Authorization: this.authHeader,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        };

        const fetchOptions = {
          method,
          headers,
          signal: controller.signal,
        };

        if (data && ['POST', 'PUT', 'PATCH'].includes(method)) {
          fetchOptions.body = JSON.stringify(data);
        }

        const response = await fetch(url, fetchOptions);
        clearTimeout(timeoutId);

        const elapsed = Date.now() - attemptStart;
        const status = response.status;

        // Parse body — may be JSON or empty
        let body = null;
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          try {
            body = await response.json();
          } catch {
            body = null;
          }
        }

        // --- Retryable status ---
        if (isRetryable(status) && attempt <= this.retry.maxRetries) {
          const backoff = this.retry.baseDelayMs * Math.pow(2, attempt - 1);
          console.warn(
            `${logPrefix()} RETRY status=${status} attempt=${attempt} ` +
              `backoff=${backoff}ms ${method} ${endpoint}`
          );
          await sleep(backoff);
          continue;
        }

        // --- Success (2xx) ---
        if (status >= 200 && status < 300) {
          console.log(
            `${logPrefix()} RESP ${status} ${elapsed}ms ${method} ${endpoint}`
          );
          return { code: status, message: 'OK', data: body };
        }

        // --- Known error codes ---
        const errorMessages = {
          400: 'Bad Request',
          401: 'Unauthorized',
          403: 'Forbidden',
          404: 'Not Found',
          405: 'Method Not Allowed',
          409: 'Conflict',
          422: 'Unprocessable Entity',
          429: 'Too Many Requests',
        };

        const msg =
          (body && (body.message || body.error)) ||
          errorMessages[status] ||
          'Unknown Error';

        console.error(
          `${logPrefix()} ERROR status=${status} ${elapsed}ms ${method} ${endpoint} - ${msg}`
        );

        return { code: status, message: msg, data: body };
      } catch (err) {
        lastError = err;

        // Network / timeout / abort errors are retryable
        if (attempt <= this.retry.maxRetries) {
          const backoff = this.retry.baseDelayMs * Math.pow(2, attempt - 1);
          console.warn(
            `${logPrefix()} NETWORK-ERR attempt=${attempt} ` +
              `backoff=${backoff}ms ${method} ${endpoint}: ${err.message}`
          );
          await sleep(backoff);
          continue;
        }
      }
    }

    // Exhausted all retries
    const totalElapsed = Date.now() - startTime;
    console.error(
      `${logPrefix()} FATAL max-retries=${this.retry.maxRetries} ` +
        `${totalElapsed}ms ${method} ${endpoint}: ${lastError?.message}`
    );

    return {
      code: 0,
      message: `Request failed after ${this.retry.maxRetries + 1} attempts: ${lastError?.message}`,
      data: null,
    };
  }

  // -----------------------------------------------------------------------
  // Posts
  // -----------------------------------------------------------------------

  /**
   * Create a new WordPress post.
   * @param {object} params
   * @param {string} params.title          - Post title
   * @param {string} params.content        - HTML content
   * @param {string} [params.status]       - 'publish' | 'draft' | 'pending' | 'private' (default: 'draft')
   * @param {number[]} [params.categories] - Array of category IDs
   * @param {number[]} [params.tags]       - Array of tag IDs
   * @param {object} [params.meta]         - Custom meta fields (Yoast SEO etc.)
   * @param {number} [params.featured_media] - Attachment ID for featured image
   * @param {string} [params.slug]         - URL slug
   * @param {string} [params.excerpt]      - Post excerpt
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async createPost({
    title,
    content,
    status = 'draft',
    categories,
    tags,
    meta,
    featured_media,
    slug,
    excerpt,
  } = {}) {
    if (!title || !content) {
      return { code: 400, message: 'title and content are required', data: null };
    }

    const body = {
      title,
      content,
      status,
    };

    if (categories) body.categories = categories;
    if (tags) body.tags = tags;
    if (meta) body.meta = meta;
    if (featured_media) body.featured_media = featured_media;
    if (slug) body.slug = slug;
    if (excerpt) body.excerpt = excerpt;

    return this.request('POST', '/posts', body);
  }

  /**
   * Update an existing WordPress post.
   * @param {number} id   - Post ID
   * @param {object} data - Fields to update (title, content, status, etc.)
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async updatePost(id, data) {
    if (!id) {
      return { code: 400, message: 'Post ID is required', data: null };
    }
    if (!data || Object.keys(data).length === 0) {
      return { code: 400, message: 'Update data is required', data: null };
    }

    return this.request('POST', `/posts/${id}`, data);
  }

  /**
   * Get a single post by ID.
   * @param {number} id - Post ID
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async getPost(id) {
    if (!id) {
      return { code: 400, message: 'Post ID is required', data: null };
    }

    return this.request('GET', `/posts/${id}`);
  }

  /**
   * List posts with optional filters and pagination.
   * @param {object} [params]
   * @param {string} [params.status]     - Post status filter
   * @param {number} [params.category]   - Category ID filter
   * @param {number} [params.per_page]   - Posts per page (default: 10, max: 100)
   * @param {number} [params.page]       - Page number
   * @param {string} [params.orderby]    - Sort field (date, title, etc.)
   * @param {string} [params.order]      - Sort order (asc, desc)
   * @param {string} [params.search]     - Search term
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async listPosts(params = {}) {
    const query = new URLSearchParams();

    if (params.status) query.set('status', params.status);
    if (params.category) query.set('categories', params.category);
    if (params.per_page) query.set('per_page', params.per_page);
    if (params.page) query.set('page', params.page);
    if (params.orderby) query.set('orderby', params.orderby);
    if (params.order) query.set('order', params.order);
    if (params.search) query.set('search', params.search);

    const qs = query.toString();
    return this.request('GET', `/posts${qs ? '?' + qs : ''}`);
  }

  /**
   * Delete (trash) a WordPress post.
   * @param {number} id - Post ID
   * @param {boolean} [force] - If true, permanently delete instead of trashing
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async deletePost(id, force = false) {
    if (!id) {
      return { code: 400, message: 'Post ID is required', data: null };
    }

    return this.request('DELETE', `/posts/${id}${force ? '?force=true' : ''}`);
  }

  // -----------------------------------------------------------------------
  // Media
  // -----------------------------------------------------------------------

  /**
   * Upload a media file (image, PDF, etc.) to the WordPress media library.
   *
   * Uses multipart/form-data encoding. The file is read from disk and streamed
   * directly to the API — suitable for files of any size.
   *
   * @param {string} filePath - Absolute path to the media file on disk
   * @param {string} [altText] - Alt text for accessibility / SEO
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async uploadMedia(filePath, altText = '') {
    const fs = require('fs');
    const path = require('path');

    if (!filePath || !fs.existsSync(filePath)) {
      return {
        code: 400,
        message: `File not found: ${filePath}`,
        data: null,
      };
    }

    const url = `${this.apiBase}/media`;
    const fileName = path.basename(filePath);
    const fileBuffer = fs.readFileSync(filePath);
    const contentType = this._guessMimeType(fileName);

    const boundary = `----WPUpload${Date.now()}${Math.random().toString(16).slice(2)}`;

    // Build multipart body manually
    const CRLF = '\r\n';
    const parts = [
      `--${boundary}`,
      `Content-Disposition: form-data; name="file"; filename="${fileName}"`,
      `Content-Type: ${contentType}`,
      '',
      '',
    ];

    const header = Buffer.from(parts.join(CRLF), 'utf-8');
    const footer = Buffer.from(`${CRLF}--${boundary}--${CRLF}`, 'utf-8');

    let body = Buffer.concat([header, fileBuffer, footer]);

    // If alt text is provided, append it as a second part
    if (altText) {
      const altHeader = Buffer.from(
        [
          `--${boundary}`,
          'Content-Disposition: form-data; name="alt_text"',
          '',
          '',
          altText,
        ].join(CRLF),
        'utf-8'
      );
      body = Buffer.concat([header, fileBuffer, Buffer.from(CRLF), altHeader, footer]);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log(
        `${logPrefix()} REQ POST /media file=${fileName} size=${fileBuffer.length}`
      );

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: this.authHeader,
          'Content-Type': `multipart/form-data; boundary=${boundary}`,
          'Content-Disposition': `attachment; filename="${fileName}"`,
          Accept: 'application/json',
        },
        body,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const status = response.status;
      let data = null;
      const ct = response.headers.get('content-type') || '';
      if (ct.includes('application/json')) {
        try { data = await response.json(); } catch { /* empty */ }
      }

      if (status >= 200 && status < 300) {
        console.log(`${logPrefix()} RESP ${status} POST /media - uploaded ${fileName}`);
        return { code: status, message: 'OK', data };
      }

      console.error(
        `${logPrefix()} ERROR ${status} POST /media - ${data?.message || 'Upload failed'}`
      );
      return {
        code: status,
        message: data?.message || 'Media upload failed',
        data,
      };
    } catch (err) {
      clearTimeout(timeoutId);
      console.error(`${logPrefix()} NETWORK-ERR POST /media: ${err.message}`);
      return {
        code: 0,
        message: `Media upload failed: ${err.message}`,
        data: null,
      };
    }
  }

  /**
   * Guess MIME type from file extension.
   * @param {string} fileName
   * @returns {string}
   * @private
   */
  _guessMimeType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const map = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      pdf: 'application/pdf',
      mp4: 'video/mp4',
      doc: 'application/msword',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xls: 'application/vnd.ms-excel',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    };
    return map[ext] || 'application/octet-stream';
  }

  // -----------------------------------------------------------------------
  // Categories
  // -----------------------------------------------------------------------

  /**
   * Create a new category.
   * @param {string} name        - Category name (required)
   * @param {string} [slug]      - URL-friendly slug
   * @param {string} [description] - Category description
   * @param {number} [parent]    - Parent category ID
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async createCategory(name, slug, description, parent) {
    if (!name) {
      return { code: 400, message: 'Category name is required', data: null };
    }

    const body = { name };
    if (slug) body.slug = slug;
    if (description) body.description = description;
    if (parent) body.parent = parent;

    return this.request('POST', '/categories', body);
  }

  /**
   * List all categories.
   * @param {object} [params] - Optional query params (per_page, page, search, etc.)
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async listCategories(params = {}) {
    const query = new URLSearchParams();

    if (params.per_page) query.set('per_page', params.per_page);
    if (params.page) query.set('page', params.page);
    if (params.search) query.set('search', params.search);
    if (params.orderby) query.set('orderby', params.orderby);
    if (params.order) query.set('order', params.order);
    if (params.hide_empty !== undefined) query.set('hide_empty', params.hide_empty);

    const qs = query.toString();
    return this.request('GET', `/categories${qs ? '?' + qs : ''}`);
  }

  // -----------------------------------------------------------------------
  // Tags
  // -----------------------------------------------------------------------

  /**
   * Create a new tag.
   * @param {string} name        - Tag name (required)
   * @param {string} [slug]      - URL-friendly slug
   * @param {string} [description] - Tag description
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async createTag(name, slug, description) {
    if (!name) {
      return { code: 400, message: 'Tag name is required', data: null };
    }

    const body = { name };
    if (slug) body.slug = slug;
    if (description) body.description = description;

    return this.request('POST', '/tags', body);
  }

  /**
   * List all tags.
   * @param {object} [params] - Optional query params (per_page, page, search, etc.)
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async listTags(params = {}) {
    const query = new URLSearchParams();

    if (params.per_page) query.set('per_page', params.per_page);
    if (params.page) query.set('page', params.page);
    if (params.search) query.set('search', params.search);
    if (params.orderby) query.set('orderby', params.orderby);
    if (params.order) query.set('order', params.order);

    const qs = query.toString();
    return this.request('GET', `/tags${qs ? '?' + qs : ''}`);
  }

  // -----------------------------------------------------------------------
  // Post Meta (Yoast SEO / custom fields)
  // -----------------------------------------------------------------------

  /**
   * Update meta fields for a post (e.g. Yoast SEO _yoast_wpseo_title, etc.)
   *
   * NOTE: The WordPress REST API requires the meta keys to be registered via
   * `register_post_meta()` or a plugin like "Custom Post Type UI" / ACF.
   *
   * @param {number} id   - Post ID
   * @param {object} meta - Key-value map of meta fields
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async updatePostMeta(id, meta) {
    if (!id) {
      return { code: 400, message: 'Post ID is required', data: null };
    }
    if (!meta || Object.keys(meta).length === 0) {
      return { code: 400, message: 'Meta data is required', data: null };
    }

    return this.request('POST', `/posts/${id}`, { meta });
  }

  /**
   * Get all meta fields for a post.
   *
   * NOTE: This requires the post meta to be exposed via the REST API (either
   * registered with `show_in_rest => true` or via a plugin).
   *
   * @param {number} id - Post ID
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async getPostMeta(id) {
    if (!id) {
      return { code: 400, message: 'Post ID is required', data: null };
    }

    const result = await this.request('GET', `/posts/${id}`);
    if (result.code >= 200 && result.code < 300 && result.data) {
      return {
        code: result.code,
        message: result.message,
        data: result.data.meta || {},
      };
    }
    return result;
  }

  // -----------------------------------------------------------------------
  // Users
  // -----------------------------------------------------------------------

  /**
   * Get the currently authenticated user profile.
   * @returns {Promise<{code: number, message: string, data: object|null}>}
   */
  async getCurrentUser() {
    return this.request('GET', '/users/me');
  }
}

module.exports = WordPressClient;
