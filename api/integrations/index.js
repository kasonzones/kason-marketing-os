/**
 * Kason Marketing OS — 第三方集成索引
 * 
 * 统一管理所有外部平台的 API 集成
 */

const WordPressClient = require('../wordpress/wp-client');
const ContentSync = require('../wordpress/content-sync');

// 集成状态管理
class IntegrationManager {
  constructor() {
    this.integrations = new Map();
    this.wpClient = null;
    this.contentSync = null;
  }

  /**
   * 初始化 WordPress 集成
   */
  async initWordPress() {
    const config = require('../wordpress/config');
    this.wpClient = new WordPressClient(config);
    // 验证连接
    await this.wpClient.getCurrentUser();
    this.contentSync = new ContentSync(this.wpClient);
    console.log('[Integration] WordPress 连接成功');
    return { wpClient: this.wpClient, contentSync: this.contentSync };
  }

  /**
   * 初始化邮件平台
   * 支持: Mailchimp, Resend, SendGrid
   */
  async initEmail(platform) {
    switch (platform) {
      case 'resend':
        // Resend API
        this.integrations.set('email', {
          provider: 'resend',
          send: async (params) => {
            const response = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(params)
            });
            return response.json();
          }
        });
        break;
      case 'mailchimp':
        this.integrations.set('email', {
          provider: 'mailchimp',
          // Mailchimp Marketing API v3
          apiBase: `https://${process.env.MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0`
        });
        break;
    }
  }

  /**
   * 初始化分析平台
   */
  async initAnalytics() {
    if (process.env.GA4_MEASUREMENT_ID) {
      this.integrations.set('analytics', {
        provider: 'ga4',
        measurementId: process.env.GA4_MEASUREMENT_ID
      });
    }
  }

  /**
   * 获取集成状态
   */
  getStatus() {
    const status = {};
    for (const [key, integration] of this.integrations) {
      status[key] = {
        provider: integration.provider,
        configured: true
      };
    }
    if (this.wpClient) {
      status.wordpress = { configured: true };
    }
    return status;
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    const results = {};
    if (this.wpClient) {
      try {
        await this.wpClient.getCurrentUser();
        results.wordpress = 'healthy';
      } catch (e) {
        results.wordpress = 'unhealthy: ' + e.message;
      }
    }
    return results;
  }
}

module.exports = IntegrationManager;
