/**
 * Content Sync Engine
 *
 * Bidirectional synchronization between a Feishu content table and WordPress.
 * Designed to be used as part of a marketing content pipeline — editors compose
 * in Feishu, and this engine publishes / updates / pulls from WordPress.
 *
 * The engine accepts a WordPressClient instance and a "data store" object that
 * abstracts the Feishu table operations. This keeps the sync logic testable and
 * decoupled from any specific Feishu SDK version.
 */

'use strict';

const WordPressClient = require('./wp-client');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Log prefix with timestamp.
 * @returns {string}
 */
function logPrefix() {
  return `[ContentSync ${new Date().toISOString()}]`;
}

// ---------------------------------------------------------------------------
// ContentSync
// ---------------------------------------------------------------------------

class ContentSync {
  /**
   * Create a content sync engine.
   *
   * @param {object} options
   * @param {WordPressClient} options.wpClient  - Configured WordPress client
   * @param {object}          options.dataStore - Feishu data access object with:
   *   - getRecord(tableName, recordId) → record | null
   *   - updateRecord(tableName, recordId, fields) → updated record
   *   - listRecords(tableName, filter) → { records: [], total: number }
   *   - createRecord(tableName, fields) → new record
   *   - deleteRecord(tableName, recordId) → void
   * @param {object} [options.fieldMap] - Custom field name mapping from Feishu → WP
   * @param {string} [options.contentTable] - Name of the Feishu content table (default: 'content')
   */
  constructor({ wpClient, dataStore, fieldMap, contentTable } = {}) {
    if (!wpClient) {
      throw new Error('ContentSync: wpClient is required');
    }
    if (!dataStore) {
      throw new Error('ContentSync: dataStore is required');
    }

    /** @type {WordPressClient} */
    this.wp = wpClient;

    /** @type {object} */
    this.store = dataStore;

    /** Custom field mapping (Feishu → WordPress post fields) */
    this.fieldMap = {
      title: 'title',
      content: 'content',
      status: 'status',
      wp_post_id: 'wp_post_id',
      wp_url: 'wp_url',
      meta_title: 'meta_title',
      meta_description: 'meta_description',
      categories: 'categories',
      tags: 'tags',
      slug: 'slug',
      excerpt: 'excerpt',
      featured_image: 'featured_image',
      ...(fieldMap || {}),
    };

    /** Name of the Feishu content table */
    this.contentTable = contentTable || 'content';
  }

  // -----------------------------------------------------------------------
  // Sync: Feishu → WordPress
  // -----------------------------------------------------------------------

  /**
   * Publish or update a single Feishu content record to WordPress.
   *
   * If the record already has a `wp_post_id`, the existing WP post is updated.
   * Otherwise a new post is created, and the record is enriched with the
   * resulting post ID and URL.
   *
   * @param {object} contentRecord - A row from the Feishu content table.
   *   Expected fields (key names depend on fieldMap):
   *     - record_id        : Feishu record identifier
   *     - title            : Post title
   *     - content          : HTML post content
   *     - status           : 'draft' | 'publish' | 'pending'
   *     - wp_post_id       : (optional) Existing WP post ID
   *     - meta_title       : Yoast SEO title override
   *     - meta_description : Yoast SEO meta description
   *     - categories       : Comma-separated category names or IDs
   *     - tags             : Comma-separated tag names or IDs
   *     - slug             : Custom URL slug
   *     - excerpt          : Post excerpt
   *     - featured_image   : URL or attachment ID for featured image
   *
   * @returns {Promise<{
   *   success: boolean,
   *   action: 'created'|'updated'|'skipped'|'error',
   *   recordId: string,
   *   wpPostId: number|null,
   *   wpUrl: string|null,
   *   error: string|null
   * }>}
   */
  async syncPostToWP(contentRecord) {
    const recordId = contentRecord.record_id || contentRecord.id;
    if (!recordId) {
      console.error(`${logPrefix()} syncPostToWP: record has no identifier`);
      return this._result('error', null, null, null, 'Record has no identifier');
    }

    // --- Read existing WP post ID ---
    const existingPostId = contentRecord[this.fieldMap.wp_post_id];

    // WordPres 不允许 title 或 content 为空
    const title = contentRecord[this.fieldMap.title];
    const content = contentRecord[this.fieldMap.content];
    if (!title || !content) {
      console.warn(
        `${logPrefix()} syncPostToWP: record ${recordId} missing title or content, skipping`
      );
      return this._result('skipped', recordId, existingPostId || null, null, 'Missing title or content');
    }

    // Build post payload
    const status = contentRecord[this.fieldMap.status] || 'draft';
    const slug = contentRecord[this.fieldMap.slug];
    const excerpt = contentRecord[this.fieldMap.excerpt];
    const categories = this._parseIdList(contentRecord[this.fieldMap.categories]);
    const tags = this._parseIdList(contentRecord[this.fieldMap.tags]);
    const featuredMedia = contentRecord[this.fieldMap.featured_image];
    const metaTitle = contentRecord[this.fieldMap.meta_title];
    const metaDescription = contentRecord[this.fieldMap.meta_description];

    // Build meta object (Yoast SEO)
    const meta = {};
    if (metaTitle) meta._yoast_wpseo_title = metaTitle;
    if (metaDescription) meta._yoast_wpseo_metadesc = metaDescription;

    let result;

    if (existingPostId) {
      // --- Update existing post ---
      console.log(
        `${logPrefix()} Updating WP post ${existingPostId} from record ${recordId}`
      );

      const updatePayload = { title, content, status };
      if (slug) updatePayload.slug = slug;
      if (excerpt) updatePayload.excerpt = excerpt;
      if (categories.length) updatePayload.categories = categories;
      if (tags.length) updatePayload.tags = tags;
      if (featuredMedia) updatePayload.featured_media = featuredMedia;
      if (Object.keys(meta).length) updatePayload.meta = meta;

      result = await this.wp.updatePost(existingPostId, updatePayload);

      if (result.code >= 200 && result.code < 300) {
        const wpUrl = result.data?.link || null;
        await this._saveWpRef(recordId, existingPostId, wpUrl);
        return this._result('updated', recordId, existingPostId, wpUrl);
      }

      return this._result(
        'error',
        recordId,
        existingPostId,
        null,
        `WP update failed: ${result.message}`
      );
    }

    // --- Create new post ---
    console.log(
      `${logPrefix()} Creating new WP post from record ${recordId}`
    );

    const createPayload = { title, content, status };
    if (slug) createPayload.slug = slug;
    if (excerpt) createPayload.excerpt = excerpt;
    if (categories.length) createPayload.categories = categories;
    if (tags.length) createPayload.tags = tags;
    if (featuredMedia) createPayload.featured_media = featuredMedia;
    if (Object.keys(meta).length) createPayload.meta = meta;

    result = await this.wp.createPost(createPayload);

    if (result.code >= 200 && result.code < 300 && result.data) {
      const wpPostId = result.data.id;
      const wpUrl = result.data.link || null;

      await this._saveWpRef(recordId, wpPostId, wpUrl);
      return this._result('created', recordId, wpPostId, wpUrl);
    }

    return this._result(
      'error',
      recordId,
      null,
      null,
      `WP create failed: ${result.message}`
    );
  }

  // -----------------------------------------------------------------------
  // Sync: WordPress → Feishu
  // -----------------------------------------------------------------------

  /**
   * Pull WordPress posts into the Feishu content table.
   *
   * Fetches posts (optionally filtered and paginated) and creates or updates
   * corresponding Feishu records. Uses `wp_post_id` as the deduplication key.
   *
   * @param {object} [options]
   * @param {string} [options.status]   - WP post status filter
   * @param {number} [options.per_page] - Posts per page (default: 50)
   * @param {number} [options.page]     - Page number (default: 1)
   * @returns {Promise<{
   *   success: boolean,
   *   synced: number,
   *   skipped: number,
   *   errors: number,
   *   total: number,
   *   results: Array
   * }>}
   */
  async syncPostsFromWP(options = {}) {
    const perPage = options.per_page || 50;
    const page = options.page || 1;

    console.log(
      `${logPrefix()} Fetching WP posts page=${page} per_page=${perPage}`
    );

    const listResult = await this.wp.listPosts({
      status: options.status || 'publish',
      per_page: perPage,
      page,
    });

    if (!(listResult.code >= 200 && listResult.code < 300) || !Array.isArray(listResult.data)) {
      console.error(`${logPrefix()} Failed to fetch WP posts: ${listResult.message}`);
      return {
        success: false,
        synced: 0,
        skipped: 0,
        errors: listResult.data ? listResult.data.length : 0,
        total: 0,
        results: [],
      };
    }

    const posts = listResult.data;
    const results = [];
    let synced = 0;
    let skipped = 0;
    let errors = 0;

    for (const post of posts) {
      try {
        // Check if a Feishu record already references this WP post
        const existingRecords = await this.store.listRecords(
          this.contentTable,
          { field: this.fieldMap.wp_post_id, value: post.id }
        );

        const fields = {
          [this.fieldMap.title]: post.title?.rendered || '',
          [this.fieldMap.content]: post.content?.rendered || '',
          [this.fieldMap.status]: post.status || 'publish',
          [this.fieldMap.wp_post_id]: post.id,
          [this.fieldMap.wp_url]: post.link || '',
          [this.fieldMap.slug]: post.slug || '',
          [this.fieldMap.excerpt]: post.excerpt?.rendered || '',
        };

        if (existingRecords && existingRecords.records && existingRecords.records.length > 0) {
          // Update existing record
          await this.store.updateRecord(
            this.contentTable,
            existingRecords.records[0].record_id || existingRecords.records[0].id,
            fields
          );
          skipped++;
        } else {
          // Create new record
          await this.store.createRecord(this.contentTable, fields);
          synced++;
        }

        results.push({ wpPostId: post.id, action: 'synced' });
      } catch (err) {
        console.error(
          `${logPrefix()} Error syncing WP post ${post.id} to Feishu: ${err.message}`
        );
        errors++;
        results.push({ wpPostId: post.id, action: 'error', error: err.message });
      }
    }

    console.log(
      `${logPrefix()} WP→Feishu sync complete: ${synced} created, ${skipped} updated, ${errors} errors`
    );

    return {
      success: errors === 0,
      synced,
      skipped,
      errors,
      total: posts.length,
      results,
    };
  }

  // -----------------------------------------------------------------------
  // Batch sync
  // -----------------------------------------------------------------------

  /**
   * Batch synchronize multiple Feishu records to WordPress.
   *
   * Processes records sequentially to avoid hitting WordPress rate limits.
   * For large batches, consider adding configurable concurrency.
   *
   * @param {object[]} records - Array of Feishu content records
   * @returns {Promise<{
   *   success: boolean,
   *   total: number,
   *   created: number,
   *   updated: number,
   *   skipped: number,
   *   errors: number,
   *   results: Array
   * }>}
   */
  async syncBulk(records) {
    if (!Array.isArray(records) || records.length === 0) {
      console.warn(`${logPrefix()} syncBulk: no records provided`);
      return {
        success: true,
        total: 0,
        created: 0,
        updated: 0,
        skipped: 0,
        errors: 0,
        results: [],
      };
    }

    console.log(`${logPrefix()} Starting bulk sync of ${records.length} records`);

    const results = [];
    let created = 0;
    let updated = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      console.log(`${logPrefix()} Bulk sync [${i + 1}/${records.length}]`);

      const result = await this.syncPostToWP(record);

      switch (result.action) {
        case 'created':
          created++;
          break;
        case 'updated':
          updated++;
          break;
        case 'skipped':
          skipped++;
          break;
        case 'error':
          errors++;
          break;
      }

      results.push(result);
    }

    console.log(
      `${logPrefix()} Bulk sync complete: ` +
        `${created} created, ${updated} updated, ${skipped} skipped, ${errors} errors`
    );

    return {
      success: errors === 0,
      total: records.length,
      created,
      updated,
      skipped,
      errors,
      results,
    };
  }

  // -----------------------------------------------------------------------
  // Update WP from Feishu changes
  // -----------------------------------------------------------------------

  /**
   * Update a WordPress post when its source Feishu content record has changed.
   *
   * This is a convenience wrapper around syncPostToWP — it always treats the
   * Feishu record as the source of truth and overwrites the WP post.
   *
   * @param {object} contentRecord - Feishu content record (must include wp_post_id)
   * @returns {Promise<{
   *   success: boolean,
   *   action: string,
   *   recordId: string|null,
   *   wpPostId: number|null,
   *   wpUrl: string|null,
   *   error: string|null
   * }>}
   */
  async updatePostFromFeishu(contentRecord) {
    const recordId = contentRecord.record_id || contentRecord.id;
    const wpPostId = contentRecord[this.fieldMap.wp_post_id];

    if (!wpPostId) {
      console.warn(
        `${logPrefix()} updatePostFromFeishu: record ${recordId} has no wp_post_id — will create instead`
      );
      return this.syncPostToWP(contentRecord);
    }

    console.log(
      `${logPrefix()} Updating WP post ${wpPostId} from Feishu record ${recordId}`
    );

    // Force update regardless of local state
    return this.syncPostToWP(contentRecord);
  }

  // -----------------------------------------------------------------------
  // Delete / Trash
  // -----------------------------------------------------------------------

  /**
   * Trash (or permanently delete) a WordPress post.
   *
   * Optionally also removes the WP reference from the corresponding Feishu
   * record if a `contentRecord` is provided.
   *
   * @param {number} postId          - WordPress post ID
   * @param {object} [options]
   * @param {boolean} [options.force] - Permanently delete (skip trash)
   * @param {object} [options.contentRecord] - Feishu record to clear wp_post_id from
   * @returns {Promise<{success: boolean, wpPostId: number, error: string|null}>}
   */
  async deletePostFromWP(postId, options = {}) {
    if (!postId) {
      return { success: false, wpPostId: null, error: 'Post ID is required' };
    }

    console.log(
      `${logPrefix()} Deleting WP post ${postId} (force=${!!options.force})`
    );

    const result = await this.wp.deletePost(postId, options.force || false);

    if (!(result.code >= 200 && result.code < 300)) {
      return { success: false, wpPostId: postId, error: result.message };
    }

    // Clear WP reference from Feishu record if provided
    if (options.contentRecord) {
      const recordId =
        options.contentRecord.record_id || options.contentRecord.id;
      try {
        await this.store.updateRecord(this.contentTable, recordId, {
          [this.fieldMap.wp_post_id]: null,
          [this.fieldMap.wp_url]: null,
        });
      } catch (err) {
        console.error(
          `${logPrefix()} Failed to clear WP ref from record ${recordId}: ${err.message}`
        );
      }
    }

    return { success: true, wpPostId: postId, error: null };
  }

  // -----------------------------------------------------------------------
  // Stats
  // -----------------------------------------------------------------------

  /**
   * Get post statistics (view count, etc.).
   *
   * Uses the WordPress REST API post endpoint to return basic post data and
   * attempts to read view counts from common plugins (e.g. WP-PostViews stores
   * count in post meta `post_views_count`).
   *
   * For advanced analytics (Jetpack Stats / WordPress.com Stats), a separate
   * WordPress.com API integration would be needed.
   *
   * @param {number} postId - WordPress post ID
   * @returns {Promise<{
   *   success: boolean,
   *   postId: number,
   *   stats: object|null,
   *   error: string|null
   * }>}
   */
  async getPostStats(postId) {
    if (!postId) {
      return { success: false, postId: null, stats: null, error: 'Post ID is required' };
    }

    console.log(`${logPrefix()} Getting stats for WP post ${postId}`);

    const postResult = await this.wp.getPost(postId);

    if (!(postResult.code >= 200 && postResult.code < 300) || !postResult.data) {
      return {
        success: false,
        postId,
        stats: null,
        error: `Failed to get post: ${postResult.message}`,
      };
    }

    const post = postResult.data;
    const stats = {
      // Basic post metadata
      title: post.title?.rendered || '',
      status: post.status || 'unknown',
      date: post.date || null,
      modified: post.modified || null,
      slug: post.slug || '',
      link: post.link || '',

      // Comment count (always available from WP REST API)
      commentCount: typeof post.comment_count !== 'undefined' ? post.comment_count : 0,

      // Attempt to read view count from common plugins via meta
      viewCount: post.meta?.post_views_count || post.meta?.views || null,
    };

    return { success: true, postId, stats, error: null };
  }

  /**
   * Get a summary of posts by status.
   * @returns {Promise<{success: boolean, summary: object|null, error: string|null}>}
   */
  async getPostSummary() {
    console.log(`${logPrefix()} Getting post summary`);

    const statuses = ['publish', 'draft', 'pending', 'private', 'trash'];
    const summary = {};

    for (const status of statuses) {
      const result = await this.wp.listPosts({ status, per_page: 1 });
      // WordPress returns total count in the X-WP-Total header
      // Since we can't read headers from our client easily, we estimate
      if (result.code >= 200 && result.code < 300 && Array.isArray(result.data)) {
        summary[status] = result.data.length > 0 ? 'has_posts' : 'no_posts';
      }
    }

    return { success: true, summary, error: null };
  }

  // -----------------------------------------------------------------------
  // Internal helpers
  // -----------------------------------------------------------------------

  /**
   * Save WordPress post ID and URL back to the Feishu content record.
   * @param {string} recordId
   * @param {number} wpPostId
   * @param {string|null} wpUrl
   * @returns {Promise<void>}
   * @private
   */
  async _saveWpRef(recordId, wpPostId, wpUrl) {
    try {
      await this.store.updateRecord(this.contentTable, recordId, {
        [this.fieldMap.wp_post_id]: wpPostId,
        [this.fieldMap.wp_url]: wpUrl || '',
      });
      console.log(
        `${logPrefix()} Saved WP ref to record ${recordId}: postId=${wpPostId}`
      );
    } catch (err) {
      console.error(
        `${logPrefix()} Failed to save WP ref to record ${recordId}: ${err.message}`
      );
    }
  }

  /**
   * Parse a comma-separated or array list of IDs into a number array.
   * @param {string|number[]|undefined} value
   * @returns {number[]}
   * @private
   */
  _parseIdList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.map(Number).filter((n) => !isNaN(n));
    return String(value)
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !isNaN(n));
  }

  /**
   * Build a standardized result object.
   * @param {string} action
   * @param {string|null} recordId
   * @param {number|null} wpPostId
   * @param {string|null} wpUrl
   * @param {string|null} error
   * @returns {{success: boolean, action: string, recordId: string|null, wpPostId: number|null, wpUrl: string|null, error: string|null}}
   * @private
   */
  _result(action, recordId, wpPostId, wpUrl, error = null) {
    return {
      success: action !== 'error',
      action,
      recordId,
      wpPostId,
      wpUrl,
      error,
    };
  }
}

module.exports = ContentSync;
