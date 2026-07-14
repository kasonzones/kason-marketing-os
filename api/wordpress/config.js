/**
 * WordPress API Configuration Module
 *
 * Reads connection parameters from environment variables.
 * All WordPress env vars are optional - if not provided, WordPress features are disabled.
 *
 * Optional environment variables (all 3 required for WP features):
 *   WP_SITE_URL     - Full WordPress site URL (e.g. https://example.com)
 *   WP_USERNAME     - WordPress username for Basic Auth
 *   WP_APP_PASSWORD - WordPress Application Password (NOT login password)
 */

'use strict';

// ---------------------------------------------------------------------------
// Optional environment variables - WordPress is disabled if not set
// ---------------------------------------------------------------------------

const wpVars = ['WP_SITE_URL', 'WP_USERNAME', 'WP_APP_PASSWORD'];
const missing = wpVars.filter((key) => !process.env[key]);
const wpEnabled = missing.length === 0;

if (!wpEnabled) {
  console.log(`[WordPress] 暂未配置 (缺少: ${missing.join(', ')}), 相关功能已禁用`);
}

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const WP_SITE_URL = wpEnabled ? process.env.WP_SITE_URL.replace(/\/+$/, '') : null;
const WP_API_BASE = WP_SITE_URL ? `${WP_SITE_URL}/wp-json/wp/v2` : null;
const WP_USERNAME = process.env.WP_USERNAME || null;
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || null;
const WP_AUTH_HEADER = wpEnabled
  ? 'Basic ' + Buffer.from(`${WP_USERNAME}:${WP_APP_PASSWORD}`).toString('base64')
  : null;

// HTTP & retry settings
const API_TIMEOUT_MS = 30_000;
const RETRY = {
  maxRetries: 3,
  baseDelayMs: 1_000,
  retryableStatuses: [408, 429, 500, 502, 503, 504],
};

module.exports = {
  enabled: wpEnabled,
  WP_SITE_URL,
  WP_API_BASE,
  WP_USERNAME,
  WP_APP_PASSWORD,
  WP_AUTH_HEADER,
  API_TIMEOUT_MS,
  RETRY,
};
