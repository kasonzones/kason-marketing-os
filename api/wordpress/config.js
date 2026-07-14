/**
 * WordPress API Configuration Module
 *
 * Reads connection parameters from environment variables and validates them
 * on module load. Exports all configuration constants used by the client.
 *
 * Required environment variables:
 *   WP_SITE_URL    - Full WordPress site URL (e.g. https://example.com)
 *   WP_USERNAME    - WordPress username for Basic Auth
 *   WP_APP_PASSWORD - WordPress Application Password (NOT login password)
 */

'use strict';

// ---------------------------------------------------------------------------
// Environment variable helpers
// ---------------------------------------------------------------------------

const requiredEnvVars = ['WP_SITE_URL', 'WP_USERNAME', 'WP_APP_PASSWORD'];

const missing = requiredEnvVars.filter((key) => !process.env[key]);

if (missing.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missing.join(', ')}. ` +
      'Set them before starting the application.'
  );
}

// Remove trailing slash from site URL for consistent base construction
const rawSiteUrl = process.env.WP_SITE_URL.replace(/\/+$/, '');

// ---------------------------------------------------------------------------
// Exported configuration
// ---------------------------------------------------------------------------

/** Full WordPress site URL (trailing slash stripped) */
const WP_SITE_URL = rawSiteUrl;

/** WordPress REST API base URL */
const WP_API_BASE = `${WP_SITE_URL}/wp-json/wp/v2`;

/** WordPress username for Basic Auth */
const WP_USERNAME = process.env.WP_USERNAME;

/** WordPress Application Password */
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD;

/** Base64-encoded Basic Auth header value (pre-computed once) */
const WP_AUTH_HEADER =
  'Basic ' +
  Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64');

// ---------------------------------------------------------------------------
// HTTP & retry settings
// ---------------------------------------------------------------------------

/** Request timeout in milliseconds */
const API_TIMEOUT_MS = 30_000;

/** Retry configuration */
const RETRY = {
  /** Maximum number of retry attempts before giving up */
  maxRetries: 3,

  /** Base delay between retries in ms (used for exponential backoff) */
  baseDelayMs: 1_000,

  /** HTTP status codes that should trigger a retry */
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

module.exports = {
  WP_SITE_URL,
  WP_API_BASE,
  WP_USERNAME,
  WP_APP_PASSWORD,
  WP_AUTH_HEADER,
  API_TIMEOUT_MS,
  RETRY,
};
