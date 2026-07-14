/**
 * Kason Marketing OS V3.0 — 主服务入口
 * 
 * 启动: node server.js
 * 功能: Webhook接收 + 自动化引擎 + 定时任务 + WordPress同步
 */

require('dotenv').config();
const express = require('express');
const AutomationEngine = require('./api/automation-engine');
const WordPressClient = require('./api/wordpress/wp-client');
const ContentSync = require('./api/wordpress/content-sync');

// ── 环境变量验证 ──
const required = ['FEISHU_APP_ID', 'FEISHU_APP_SECRET'];
for (const key of required) {
  if (!process.env[key]) { console.error(`❌ 缺少环境变量: ${key}`); process.exit(1); }
}

const APP_TOKEN = process.env.FEISHU_BITABLE_ID || 'If5CbJEY6a5kousPKhMcDhxinxd';
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || 'kason_marketing_os_2026';

// ── 初始化引擎 ──
const engine = new AutomationEngine(process.env.FEISHU_APP_ID, process.env.FEISHU_APP_SECRET);
engine.setAppToken(APP_TOKEN);

const SkillHandler = require('./api/skill-handler');
const skillHandler = new SkillHandler(engine);
skillHandler.setAppToken(APP_TOKEN);

// ── 初始化 WordPress (可选) ──
let wpClient = null;
let contentSync = null;
const wpConfig = require('./api/wordpress/config');
if (wpConfig.enabled) {
  try {
    wpClient = new WordPressClient(wpConfig);
    contentSync = new ContentSync(wpClient);
  } catch (e) {
    console.warn('⚠️ WordPress 未配置，内容发布到WP功能不可用');
  }
}

// ── Express 服务 ──
const app = express();
app.use(express.json());

// 鉴权中间件
function auth(req, res, next) {
  const key = req.headers['x-api-key'] || req.query.api_key;
  if (key !== API_KEY) return res.status(401).json({ code: -1, message: 'Unauthorized' });
  next();
}

// ── 飞书 Webhook 接收 ──

// GET: 显示状态页 (方便浏览器查看)
app.get('/webhook/feishu', (req, res) => {
  res.send(`
    <html><head><meta charset="utf-8"><title>Kason OS Webhook</title>
    <style>body{font-family:sans-serif;max-width:500px;margin:80px auto;text-align:center}
    .ok{color:green;font-size:48px}.info{color:#666;margin-top:20px}</style></head>
    <body>
      <div class="ok">&#x2705;</div>
      <h2>Kason Marketing OS Webhook</h2>
      <p class="info">POST 端点正常运行，等待飞书事件推送...</p>
      <p class="info">Version 3.0.0 | ${new Date().toISOString()}</p>
    </body></html>
  `);
});

// 飞书事件订阅验证
app.post('/webhook/feishu', (req, res) => {
  const { challenge, token, type } = req.body;
  if (type === 'url_verification') {
    return res.json({ challenge });
  }

  // 异步处理，快速响应
  res.json({ code: 0 });

  const event = req.body.event;
  if (!event) return;

  const eventType = event.type || req.header?.event_type || '';
  console.log(`📨 飞书事件: ${eventType}`);

  // 匹配事件类型
  (async () => {
    // 消息事件 — 处理技能指令
    if (eventType === 'im.message.receive_v1' || event.message?.chat_id) {
      try {
        await skillHandler.handleSkillCommand(event);
        console.log('[Bot] 技能指令已处理');
      } catch (e) {
        console.error('[Bot] 处理失败:', e.message);
      }
      return;
    }
    try {
      if (event_type === 'bitable.record.created') {
        const tableId = event.table_id;
        if (tableId === 'tbl8W2yRkt7phoI2') {
          await engine.handleWebhook('leads.created', { fields: event.fields, record_id: event.record_id });
        }
      } else if (event_type === 'bitable.record.updated') {
        const tableId = event.table_id;
        const fields = event.fields || {};
        const recordId = event.record_id;

        if (tableId === 'tblSEJz5u8sgun0Y' && fields['状态'] === '已通过') {
          await engine.handleWebhook('content.approved', { fields, record_id: recordId });
        }
        if (tableId === 'tbl8W2yRkt7phoI2' && fields['生命周期'] === 'MQL') {
          await engine.handleWebhook('leads.became_mql', { fields, record_id: recordId });
        }
      }
    } catch (e) {
      console.error('Webhook处理错误:', e.message);
    }
  })();
});

// ── API 路由 ──

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '3.0.0' });
});

// 手动触发 SEO 审计
app.post('/api/seo/weekly-audit', auth, async (req, res) => {
  const result = await engine.handleWebhook('schedule.seo_audit');
  res.json({ code: 0, data: result });
});

// 手动触发每日汇总
app.post('/api/analytics/daily-summary', auth, async (req, res) => {
  const result = await engine.handleWebhook('schedule.daily_summary');
  res.json({ code: 0, data: result });
});

// 手动触发每周周报
app.post('/api/reports/weekly', auth, async (req, res) => {
  const result = await engine.handleWebhook('schedule.weekly_report');
  res.json({ code: 0, data: result });
});

// WordPress: 发布内容
app.post('/api/content/publish', auth, async (req, res) => {
  if (!wpClient) return res.json({ code: -1, message: 'WordPress 未配置' });
  try {
    const { title, content, meta_title, meta_description, status } = req.body;
    const result = await wpClient.createPost({ title, content, status: status || 'publish' });
    if (meta_title || meta_description) {
      const meta = [];
      if (meta_title) meta.push({ key: '_yoast_wpseo_title', value: meta_title });
      if (meta_description) meta.push({ key: '_yoast_wpseo_metadesc', value: meta_description });
      if (meta.length) await wpClient.updatePostMeta(result.id, meta);
    }
    res.json({ code: 0, data: { id: result.id, link: result.link } });
  } catch (e) {
    res.json({ code: -1, message: e.message });
  }
});

// 线索手动评分
app.post('/api/leads/score', auth, async (req, res) => {
  const { industry, company_size, source } = req.body;
  let score = 0;
  const rules = { '来源': engine.SCORING_RULES['来源'] || {}, '行业': engine.SCORING_RULES['行业'] || {}, '预算范围': engine.SCORING_RULES['预算范围'] || {}, '公司规模': engine.SCORING_RULES['公司规模'] || {} };
  if (source) score += rules['来源'][source] || 0;
  if (industry) score += rules['行业'][industry] || 0;
  if (company_size) score += rules['公司规模'][company_size] || 0;
  res.json({ code: 0, data: { score } });
});

// ── 定时任务 (node-cron 或内置 setInterval) ──
function scheduleTask(cronExpression, fn, name) {
  // 简化版: 每小时间隔检查
  // 生产环境建议用 node-cron 或操作系统的 cron
  const check = async () => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay(); // 0=Sun, 1=Mon...

    if (cronExpression === 'daily-8am' && hour === 8) {
      console.log(`⏰ 执行定时任务: ${name}`);
      await fn();
    } else if (cronExpression === 'monday-9am' && day === 1 && hour === 9) {
      console.log(`⏰ 执行定时任务: ${name}`);
      await fn();
    } else if (cronExpression === 'friday-5pm' && day === 5 && hour === 17) {
      console.log(`⏰ 执行定时任务: ${name}`);
      await fn();
    }
  };

  // 每30分钟检查一次
  setInterval(check, 30 * 60 * 1000);
  check(); // 立即检查一次
}

// 注册定时任务
scheduleTask('daily-8am', () => engine.handleWebhook('schedule.daily_summary'), '每日数据汇总');
scheduleTask('monday-9am', () => engine.handleWebhook('schedule.seo_audit'), 'SEO周审计');
scheduleTask('friday-5pm', () => engine.handleWebhook('schedule.weekly_report'), '每周营销周报');

// ── 启动服务 ──
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   Kason Marketing OS V3.0 — 服务已启动          ║
╠══════════════════════════════════════════════════╣
║  API 端口: ${String(PORT).padEnd(37)}║
║  Webhook:  /webhook/feishu${' '.repeat(22)}║
║  工作流:   6个自动化已就绪${' '.repeat(20)}║
║  定时任务: 每日08:00 / 周一09:00 / 周五17:00${' '.repeat(4)}║
${process.env.WP_SITE_URL ? '║  WordPress: ' + process.env.WP_SITE_URL.padEnd(31) + '║\n' : ''}╚══════════════════════════════════════════════════╝
`);

  console.log('📋 6个工作流:');
  console.log('  1. 内容发布  — content表 状态→已通过 时触发');
  console.log('  2. 线索评分  — leads表 新记录 时触发');
  console.log('  3. SEO审计   — 每周一 09:00 自动执行');
  console.log('  4. 邮件序列  — leads表 生命周期→MQL 时触发');
  console.log('  5. 数据汇总  — 每日 08:00 自动执行');
  console.log('  6. 周报      — 每周五 17:00 自动执行');
});
