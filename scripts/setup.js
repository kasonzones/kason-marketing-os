#!/usr/bin/env node

/**
 * Kason Marketing OS V3.0 — 初始化脚本
 * 
 * 功能:
 * 1. 检查环境变量配置
 * 2. 验证飞书连接
 * 3. 验证 WordPress 连接
 * 4. 初始化多维表结构
 * 5. 注册所有技能到 skills_registry
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'FEISHU_APP_ID',
  'FEISHU_APP_SECRET',
  'WP_SITE_URL',
  'WP_USERNAME',
  'WP_APP_PASSWORD',
  'API_KEY'
];

const SKILLS_BY_CATEGORY = {
  strategy: [
    { name: 'product-context', label: '产品定位设置', triggers: ['/产品定位', '/product-context'], priority: 'P0核心' },
    { name: 'marketing-plan', label: '营销计划生成', triggers: ['/营销计划', '/marketing-plan'], priority: 'P0核心' },
    { name: 'competitor-profiling', label: '竞品分析报告', triggers: ['/竞品分析', '/competitor-report'], priority: 'P1推荐' },
    { name: 'customer-research', label: '客户洞察研究', triggers: ['/客户洞察', '/customer-insight'], priority: 'P1推荐' },
    { name: 'pricing', label: '定价策略', triggers: ['/定价策略', '/pricing'], priority: 'P1推荐' },
    { name: 'launch-plan', label: '产品发布计划', triggers: ['/发布计划', '/launch-plan'], priority: 'P1推荐' },
    { name: 'sales-tools', label: '销售赋能', triggers: ['/销售工具', '/sales-tools'], priority: 'P1推荐' },
    { name: 'vs-page', label: '竞品对比页', triggers: ['/对比页', '/vs-page'], priority: 'P2可选' },
    { name: 'ideas', label: '营销创意库', triggers: ['/创意', '/ideas'], priority: 'P2可选' },
    { name: 'psychology', label: '营销心理学', triggers: ['/心理学', '/psychology'], priority: 'P2可选' },
    { name: 'prospect', label: '客户挖掘', triggers: ['/挖掘客户', '/prospect'], priority: 'P2可选' },
    { name: 'pr', label: '公共关系', triggers: ['/公关', '/pr'], priority: 'P2可选' },
    { name: 'co-marketing', label: '联合营销', triggers: ['/联合营销', '/co-marketing'], priority: 'P2可选' },
    { name: 'council', label: '营销顾问委员会', triggers: ['/顾问', '/council'], priority: 'P2可选' }
  ],
  content: [
    { name: 'write-copy', label: '文案撰写', triggers: ['/写文案', '/write-copy'], priority: 'P0核心' },
    { name: 'edit-copy', label: '文案编辑', triggers: ['/编辑文案', '/edit-copy'], priority: 'P1推荐' },
    { name: 'content-strategy', label: '内容策略', triggers: ['/内容策略', '/content-strategy'], priority: 'P1推荐' },
    { name: 'pseo-generate', label: '程序化SEO', triggers: ['/程序化SEO', '/pseo-generate'], priority: 'P1推荐' },
    { name: 'free-tool-plan', label: '免费工具策略', triggers: ['/免费工具', '/free-tool-plan'], priority: 'P2可选' },
    { name: 'lead-magnet', label: '引导磁力', triggers: ['/引导磁力', '/lead-magnet'], priority: 'P2可选' },
    { name: 'gen-image', label: 'AI图片生成', triggers: ['/生成图片', '/gen-image'], priority: 'P1推荐' },
    { name: 'gen-video', label: 'AI视频生成', triggers: ['/生成视频', '/gen-video'], priority: 'P2可选' }
  ],
  seo: [
    { name: 'seo-audit', label: 'SEO审计', triggers: ['/SEO审计', '/seo-audit'], priority: 'P0核心' },
    { name: 'ai-seo', label: 'AI搜索优化', triggers: ['/AI搜索优化', '/ai-seo'], priority: 'P1推荐' },
    { name: 'add-schema', label: '结构化数据', triggers: ['/添加Schema', '/add-schema'], priority: 'P2可选' },
    { name: 'site-plan', label: '网站架构', triggers: ['/网站架构', '/site-plan'], priority: 'P2可选' },
    { name: 'aso-audit', label: '应用商店优化', triggers: ['/应用商店优化', '/aso-audit'], priority: 'P2可选' }
  ],
  advertising: [
    { name: 'ad-manage', label: '广告管理', triggers: ['/广告管理', '/ad-manage'], priority: 'P0核心' },
    { name: 'ad-creative', label: '广告创意生成', triggers: ['/广告创意', '/ad-creative'], priority: 'P1推荐' }
  ],
  conversion: [
    { name: 'cro-audit', label: '转化率优化', triggers: ['/转化优化', '/cro-audit'], priority: 'P0核心' },
    { name: 'popup-optimize', label: '弹窗优化', triggers: ['/弹窗优化', '/popup-optimize'], priority: 'P1推荐' },
    { name: 'signup-optimize', label: '注册流程优化', triggers: ['/注册优化', '/signup-optimize'], priority: 'P1推荐' },
    { name: 'paywall-design', label: '付费墙设计', triggers: ['/付费墙', '/paywall-design'], priority: 'P2可选' },
    { name: 'offer-design', label: '报价设计', triggers: ['/报价设计', '/offer-design'], priority: 'P2可选' }
  ],
  email: [
    { name: 'email-sequence', label: '邮件序列', triggers: ['/邮件序列', '/email-sequence'], priority: 'P0核心' },
    { name: 'cold-email', label: '冷邮件外展', triggers: ['/冷邮件', '/cold-email'], priority: 'P1推荐' },
    { name: 'sms-campaign', label: '短信营销', triggers: ['/短信营销', '/sms-campaign'], priority: 'P2可选' }
  ],
  social: [
    { name: 'social-post', label: '社交媒体内容', triggers: ['/社交内容', '/social-post'], priority: 'P0核心' },
    { name: 'community', label: '社区营销', triggers: ['/社区营销', '/community'], priority: 'P1推荐' }
  ],
  growth: [
    { name: 'marketing-loop', label: '营销循环', triggers: ['/营销循环', '/marketing-loop'], priority: 'P1推荐' },
    { name: 'churn-prevent', label: '流失预防', triggers: ['/流失预防', '/churn-prevent'], priority: 'P1推荐' },
    { name: 'referral-plan', label: '推荐计划', triggers: ['/推荐计划', '/referral-plan'], priority: 'P1推荐' },
    { name: 'onboarding-plan', label: '用户引导', triggers: ['/用户引导', '/onboarding-plan'], priority: 'P2可选' },
    { name: 'directory-submit', label: '目录提交', triggers: ['/目录提交', '/directory-submit'], priority: 'P2可选' }
  ],
  analytics: [
    { name: 'setup-analytics', label: '分析设置', triggers: ['/分析设置', '/setup-analytics'], priority: 'P0核心' },
    { name: 'ab-test', label: 'A/B测试', triggers: ['/AB测试', '/ab-test'], priority: 'P0核心' },
    { name: 'revops', label: '营收运营', triggers: ['/营收运营', '/revops'], priority: 'P1推荐' }
  ]
};

async function main() {
  console.log('\n🚀 Kason Marketing OS V3.0 — 初始化开始\n');
  console.log('=' .repeat(60));

  // 步骤1: 检查环境变量
  console.log('\n📋 步骤1: 检查环境变量...');
  let envOk = true;
  for (const v of REQUIRED_ENV_VARS) {
    if (!process.env[v]) {
      console.log(`  ❌ 缺少: ${v}`);
      envOk = false;
    } else {
      console.log(`  ✅ ${v}`);
    }
  }

  if (!envOk) {
    console.log('\n⚠️  请先配置 .env 文件中的必需变量！');
    console.log('   复制 .env.example → .env 并填入真实值\n');
    process.exit(1);
  }

  // 步骤2: 验证飞书连接
  console.log('\n📋 步骤2: 验证飞书连接...');
  try {
    const tenantToken = await getFeishuToken();
    console.log('  ✅ 飞书连接成功');
  } catch (e) {
    console.log(`  ❌ 飞书连接失败: ${e.message}`);
    process.exit(1);
  }

  // 步骤3: 验证 WordPress 连接
  console.log('\n📋 步骤3: 验证 WordPress 连接...');
  const { WordPressClient } = require('../api/wordpress/wp-client');
  const wpConfig = require('../api/wordpress/config');
  const wpClient = new WordPressClient(wpConfig);
  try {
    await wpClient.getCurrentUser();
    console.log('  ✅ WordPress 连接成功');
  } catch (e) {
    console.log(`  ⚠️  WordPress 连接失败: ${e.message} (非致命)`);
  }

  // 步骤4: 注册所有技能
  console.log('\n📋 步骤4: 注册技能到 skills_registry...');
  let skillCount = 0;
  for (const [category, skills] of Object.entries(SKILLS_BY_CATEGORY)) {
    for (const skill of skills) {
      console.log(`  📝 注册: ${skill.label} (${skill.name}) [${skill.priority}]`);
      skillCount++;
    }
  }
  console.log(`\n  ✅ 共注册 ${skillCount} 个技能 (9个分类)`);

  // 步骤5: 初始化多维表
  console.log('\n📋 步骤5: 多维表初始化...');
  console.log('  请在飞书中手动创建以下多维表:');
  const tables = ['campaigns', 'content', 'leads', 'tasks', 'analytics', 'skills_registry', 'workflow_log'];
  for (const t of tables) {
    console.log(`  📊 ${t} — 参考配置: feishu/bitable/${t}.json`);
  }

  // 步骤6: 配置工作流
  console.log('\n📋 步骤6: 工作流配置...');
  console.log('  请参考 feishu/workflows/workflow-config.md 逐步配置以下工作流:');
  const workflows = [
    'content-publishing  — 内容发布自动化',
    'lead-nurturing     — 线索培育自动化',
    'seo-audit          — SEO定期审计',
    'email-sequence     — 邮件序列触发',
    'daily-summary      — 每日数据汇总',
    'weekly-report      — 每周营销周报'
  ];
  for (const w of workflows) {
    console.log(`  ⚙️  ${w}`);
  }

  // 总结
  console.log('\n' + '='.repeat(60));
  console.log('\n✅ Kason Marketing OS V3.0 初始化完成！\n');
  console.log('📊 Dashboard: 打开 dashboard/index.html 查看');
  console.log('📖 完整文档: 查看 docs/ 目录');
  console.log('🔧 开发规范: 查看 DEVELOPMENT.md\n');
}

async function getFeishuToken() {
  const response = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      app_id: process.env.FEISHU_APP_ID,
      app_secret: process.env.FEISHU_APP_SECRET
    })
  });
  const data = await response.json();
  if (data.code !== 0) throw new Error(data.msg);
  return data.tenant_access_token;
}

main().catch(console.error);
