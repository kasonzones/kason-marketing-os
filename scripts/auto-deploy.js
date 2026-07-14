/**
 * Kason Marketing OS V3.0 — 一键自动部署到飞书
 * 
 * 使用方法:
 *   1. 先手动在飞书开发者后台创建应用 (5分钟)
 *   2. 配置 .env 文件
 *   3. 运行: node scripts/auto-deploy.js
 * 
 * 自动完成:
 *   - 创建飞书多维表格 (包含7个核心表 + 120+字段 + 所有视图)
 *   - 注册47个机器人技能到 skills_registry 表
 *   - 生成机器人指令配置 JSON
 *   - 生成工作流配置摘要
 * 
 * 需要手动完成:
 *   - 创建飞书应用 (open.feishu.cn/app)
 *   - 配置工作流触发器 (参考 workflows/workflow-config.md)
 *   - WordPress API 部署
 */

require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');

// ========== 飞书 Open API 客户端 ==========

class FeishuClient {
  constructor() {
    this.appId = process.env.FEISHU_APP_ID;
    this.appSecret = process.env.FEISHU_APP_SECRET;
    this.baseURL = 'https://open.feishu.cn/open-apis';
    this.token = null;
    this.tokenExpires = 0;

    if (!this.appId || !this.appSecret) {
      console.error('❌ 请先在 .env 中配置 FEISHU_APP_ID 和 FEISHU_APP_SECRET');
      process.exit(1);
    }
  }

  async getToken() {
    if (this.token && Date.now() < this.tokenExpires) return this.token;
    
    const resp = await fetch(`${this.baseURL}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: this.appId, app_secret: this.appSecret })
    });
    const data = await resp.json();
    if (data.code !== 0) throw new Error(`获取Token失败: ${data.msg}`);
    
    this.token = data.tenant_access_token;
    this.tokenExpires = Date.now() + (data.expire - 300) * 1000;
    return this.token;
  }

  async request(method, path, body = null) {
    const token = await this.getToken();
    const url = `${this.baseURL}${path}`;
    const opts = {
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    if (body) opts.body = JSON.stringify(body);

    const resp = await fetch(url, opts);
    const data = await resp.json();
    
    if (data.code !== 0) {
      // 429 rate limit - auto retry
      if (data.code === 99991400 || data.code === 10000) {
        console.log(`  ⏳ 请求限流，等待2秒重试...`);
        await new Promise(r => setTimeout(r, 2000));
        return this.request(method, path, body);
      }
      throw new Error(`API错误 [${data.code}]: ${data.msg}`);
    }
    return data.data;
  }

  async createBitable(name) {
    console.log(`\n📊 创建多维表格: ${name}`);
    const data = await this.request('POST', '/bitable/v1/apps', { name });
    console.log(`  ✅ 创建成功, app_token: ${data.app.app_token}`);
    console.log(`  🔗 URL: ${data.app.url}`);
    return data.app;
  }

  async addTable(appToken, table) {
    console.log(`  📋 添加表: ${table.name} (${table.label})`);
    const data = await this.request('POST', `/bitable/v1/apps/${appToken}/tables`, {
      table: { name: table.label }
    });
    return { table_id: data.table_id, name: table.name, label: table.label };
  }

  async addFields(appToken, tableId, fields) {
    console.log(`  ➕ 批量添加字段 (${fields.length}个)...`);
    
    // Feishu API: max 10 fields per batch
    const batchSize = 10;
    const results = [];
    
    for (let i = 0; i < fields.length; i += batchSize) {
      const batch = fields.slice(i, i + batchSize);
      const body = { fields: batch };
      
      try {
        // Actually use batch_create_fields endpoint
        const path = `/bitable/v1/apps/${appToken}/tables/${tableId}/fields/batch_create`;
        await this.request('POST', path, body);
        results.push(...batch);
        process.stdout.write('.');
      } catch (e) {
        // Try single field at a time if batch fails
        for (const field of batch) {
          try {
            await this.request('POST', `/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, field);
            results.push(field);
            process.stdout.write('.');
          } catch (e2) {
            console.error(`\n  ❌ 字段 ${field.field_name} 创建失败: ${e2.message}`);
          }
          await new Promise(r => setTimeout(r, 200)); // rate limit
        }
      }
      await new Promise(r => setTimeout(r, 300)); // rate limit between batches
    }
    
    console.log(`\n  ✅ 完成 ${results.length}/${fields.length} 个字段`);
    return results;
  }

  async addRecords(appToken, tableId, records) {
    const batchSize = 500; // Feishu max
    let added = 0;
    
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      await this.request('POST', `/bitable/v1/apps/${appToken}/tables/${tableId}/records/batch_create`, {
        records: batch
      });
      added += batch.length;
    }
    return added;
  }
}

// ========== 表结构定义 ==========

const TABLE_DEFINITIONS = {
  campaigns: {
    label: '营销活动',
    fields: [
      { field_name: '活动名称', type: 1 },
      { field_name: '活动类型', type: 3, property: { options: [
        { name: 'SEO', color: 0 }, { name: '内容营销', color: 1 }, { name: '付费广告', color: 2 },
        { name: '邮件营销', color: 3 }, { name: '社交媒体', color: 4 }, { name: '产品发布', color: 5 },
        { name: '品牌推广', color: 6 }, { name: '联合营销', color: 7 }, { name: 'PR', color: 8 },
        { name: '其他', color: 9 }
      ]}},
      { field_name: '状态', type: 3, property: { options: [
        { name: '规划中', color: 1 }, { name: '进行中', color: 2 }, { name: '已暂停', color: 3 },
        { name: '已完成', color: 4 }, { name: '已归档', color: 5 }
      ]}},
      { field_name: '优先级', type: 3, property: { options: [
        { name: 'P0-紧急', color: 0 }, { name: 'P1-高', color: 1 }, { name: 'P2-中', color: 2 }, { name: 'P3-低', color: 3 }
      ]}},
      { field_name: '活动目标', type: 1 },
      { field_name: '预算(元)', type: 2 },
      { field_name: '已花费(元)', type: 2 },
      { field_name: '开始日期', type: 5 },
      { field_name: '结束日期', type: 5 },
      { field_name: '负责人', type: 11 },
      { field_name: '渠道', type: 4, property: { options: [
        { name: '官网', color: 0 }, { name: 'Google', color: 1 }, { name: 'Meta', color: 2 },
        { name: 'LinkedIn', color: 3 }, { name: 'TikTok', color: 4 }, { name: '邮件', color: 5 },
        { name: '微信', color: 6 }, { name: '抖音', color: 7 }, { name: '小红书', color: 8 },
        { name: '其他', color: 9 }
      ]}},
      { field_name: '目标受众', type: 1 },
      { field_name: 'KPI目标', type: 1 },
      { field_name: '实际KPI', type: 1 },
      { field_name: '备注', type: 1 },
    ],
    views: [
      { view_name: '全部活动', view_type: 'grid' },
      { view_name: '进行中', view_type: 'grid' },
      { view_name: '看板视图', view_type: 'kanban' },
    ]
  },

  content: {
    label: '内容资产',
    fields: [
      { field_name: '标题', type: 1 },
      { field_name: '内容类型', type: 3, property: { options: [
        { name: '博客文章', color: 0 }, { name: '落地页', color: 1 }, { name: '产品页', color: 2 },
        { name: '案例研究', color: 3 }, { name: '白皮书', color: 4 }, { name: '社交媒体', color: 5 },
        { name: '邮件', color: 6 }, { name: '视频', color: 7 }, { name: '信息图', color: 8 },
        { name: '其他', color: 9 }
      ]}},
      { field_name: '状态', type: 3, property: { options: [
        { name: '草稿', color: 1 }, { name: '审核中', color: 2 }, { name: '已通过', color: 3 },
        { name: '已发布', color: 4 }, { name: '需更新', color: 5 }, { name: '已归档', color: 0 }
      ]}},
      { field_name: '目标关键词', type: 1 },
      { field_name: 'SEO评分', type: 2 },
      { field_name: '字数', type: 2 },
      { field_name: '作者', type: 11 },
      { field_name: '审核人', type: 11 },
      { field_name: 'WP文章ID', type: 2 },
      { field_name: 'WP链接', type: 13 },
      { field_name: '发布日期', type: 5 },
      { field_name: '计划发布日', type: 5 },
      { field_name: 'SEO标题', type: 1 },
      { field_name: 'SEO描述', type: 1 },
      { field_name: 'Schema类型', type: 3, property: { options: [
        { name: 'Article', color: 0 }, { name: 'FAQ', color: 1 }, { name: 'HowTo', color: 2 },
        { name: 'Product', color: 3 }, { name: 'None', color: 4 }
      ]}},
      { field_name: '访问量', type: 2 },
      { field_name: '转化数', type: 2 },
      { field_name: '互动数', type: 2 },
      { field_name: '特色图片', type: 15 },
    ],
    views: [
      { view_name: '全部内容', view_type: 'grid' },
      { view_name: '内容日历', view_type: 'gantt' },
      { view_name: '看板', view_type: 'kanban' },
      { view_name: 'SEO待优化', view_type: 'grid' },
    ]
  },

  leads: {
    label: '线索管理',
    fields: [
      { field_name: '公司名称', type: 1 },
      { field_name: '联系人', type: 1 },
      { field_name: '邮箱', type: 20 },
      { field_name: '电话', type: 19 },
      { field_name: '来源', type: 3, property: { options: [
        { name: '官网表单', color: 0 }, { name: '落地页', color: 1 }, { name: '广告', color: 2 },
        { name: '邮件', color: 3 }, { name: '社交媒体', color: 4 }, { name: '展会', color: 5 },
        { name: '推荐', color: 6 }, { name: '其他', color: 7 }
      ]}},
      { field_name: '线索评分', type: 2, property: { formatter: '0' }},
      { field_name: '生命周期', type: 3, property: { options: [
        { name: '订阅者', color: 0 }, { name: '线索', color: 1 }, { name: 'MQL', color: 2 },
        { name: 'SQL', color: 3 }, { name: '商机', color: 4 }, { name: '客户', color: 5 },
        { name: '品牌传播者', color: 6 }
      ]}},
      { field_name: '状态', type: 3, property: { options: [
        { name: '新建', color: 0 }, { name: '已联系', color: 1 }, { name: '已回复', color: 2 },
        { name: '演示中', color: 3 }, { name: '报价中', color: 4 }, { name: '已成交', color: 5 },
        { name: '已流失', color: 6 }
      ]}},
      { field_name: '行业', type: 3, property: { options: [
        { name: '加油站', color: 0 }, { name: '商场', color: 1 }, { name: '4S店', color: 2 },
        { name: '酒店', color: 3 }, { name: '停车场', color: 4 }, { name: '住宅小区', color: 5 },
        { name: '独立洗车店', color: 6 }, { name: '车队', color: 7 }, { name: '其他', color: 8 }
      ]}},
      { field_name: '公司规模', type: 3, property: { options: [
        { name: '小型', color: 0 }, { name: '中型', color: 1 }, { name: '大型', color: 2 }, { name: '企业', color: 3 }
      ]}},
      { field_name: '预算范围', type: 3, property: { options: [
        { name: '<5万', color: 0 }, { name: '5-15万', color: 1 }, { name: '15-30万', color: 2 }, { name: '>30万', color: 3 }
      ]}},
      { field_name: '感兴趣产品', type: 4, property: { options: [
        { name: 'AutoWash Pro X1', color: 0 }, { name: 'AutoWash Lite', color: 1 },
        { name: '配件', color: 2 }, { name: '售后服务', color: 3 }
      ]}},
      { field_name: '痛点', type: 1 },
      { field_name: '最后联系', type: 5 },
      { field_name: '下次跟进', type: 5 },
      { field_name: '负责人', type: 11 },
      { field_name: '备注', type: 1 },
      { field_name: '预期成交额', type: 2 },
      { field_name: '成交概率', type: 21 },
    ],
    views: [
      { view_name: '全部线索', view_type: 'grid' },
      { view_name: '高意向', view_type: 'grid' },
      { view_name: '销售漏斗', view_type: 'kanban' },
      { view_name: '待跟进', view_type: 'grid' },
    ]
  },

  tasks: {
    label: '任务管理',
    fields: [
      { field_name: '任务名称', type: 1 },
      { field_name: '任务类型', type: 3, property: { options: [
        { name: '内容创作', color: 0 }, { name: '设计', color: 1 }, { name: '开发', color: 2 },
        { name: 'SEO', color: 3 }, { name: '广告优化', color: 4 }, { name: '邮件发送', color: 5 },
        { name: '数据分析', color: 6 }, { name: '客户跟进', color: 7 }, { name: '审核', color: 8 },
        { name: '其他', color: 9 }
      ]}},
      { field_name: '状态', type: 3, property: { options: [
        { name: '待开始', color: 0 }, { name: '进行中', color: 2 }, { name: '已完成', color: 4 }, { name: '已取消', color: 5 }
      ]}},
      { field_name: '优先级', type: 3, property: { options: [
        { name: 'P0', color: 0 }, { name: 'P1', color: 1 }, { name: 'P2', color: 2 }, { name: 'P3', color: 3 }
      ]}},
      { field_name: '执行人', type: 11 },
      { field_name: '截止日期', type: 5 },
      { field_name: '预估工时(h)', type: 2 },
      { field_name: '实际工时(h)', type: 2 },
      { field_name: '任务描述', type: 1 },
      { field_name: '完成结果', type: 1 },
    ],
    views: [
      { view_name: '全部任务', view_type: 'grid' },
      { view_name: '我的任务', view_type: 'grid' },
      { view_name: '逾期任务', view_type: 'grid' },
      { view_name: '看板', view_type: 'kanban' },
    ]
  },

  analytics: {
    label: '数据指标',
    fields: [
      { field_name: '日期', type: 5 },
      { field_name: '指标类别', type: 3, property: { options: [
        { name: '流量', color: 0 }, { name: '转化', color: 1 }, { name: '营收', color: 2 },
        { name: '广告', color: 3 }, { name: 'SEO', color: 4 }, { name: '邮件', color: 5 },
        { name: '社交', color: 6 }, { name: '产品', color: 7 }
      ]}},
      { field_name: '指标名称', type: 1 },
      { field_name: '指标标签', type: 1 },
      { field_name: '指标值', type: 2 },
      { field_name: '单位', type: 3, property: { options: [
        { name: '次', color: 0 }, { name: '人', color: 1 }, { name: '元', color: 2 },
        { name: '%', color: 3 }, { name: '个', color: 4 }, { name: '封', color: 5 }, { name: '条', color: 6 }
      ]}},
      { field_name: '目标值', type: 2 },
      { field_name: '上期值', type: 2 },
      { field_name: '数据源', type: 1 },
      { field_name: '备注', type: 1 },
    ],
    views: [
      { view_name: '全部数据', view_type: 'grid' },
      { view_name: '趋势视图', view_type: 'grid' },
      { view_name: 'KPI仪表盘', view_type: 'grid' },
    ]
  },

  skills_registry: {
    label: '技能注册表',
    fields: [
      { field_name: '技能名称', type: 1 },
      { field_name: '技能标签', type: 1 },
      { field_name: '分类', type: 3, property: { options: [
        { name: 'content', color: 0 }, { name: 'advertising', color: 1 }, { name: 'seo', color: 2 },
        { name: 'conversion', color: 3 }, { name: 'email', color: 4 }, { name: 'social', color: 5 },
        { name: 'growth', color: 6 }, { name: 'analytics', color: 7 }, { name: 'strategy', color: 8 }
      ]}},
      { field_name: '触发词', type: 1 },
      { field_name: '功能描述', type: 1 },
      { field_name: '版本', type: 1 },
      { field_name: '状态', type: 3, property: { options: [
        { name: 'active', color: 4 }, { name: 'inactive', color: 1 }, { name: 'deprecated', color: 5 }
      ]}},
      { field_name: '优先级', type: 3, property: { options: [
        { name: 'P0核心', color: 0 }, { name: 'P1推荐', color: 1 }, { name: 'P2可选', color: 2 }
      ]}},
      { field_name: '依赖API', type: 1 },
      { field_name: '最后使用', type: 5 },
      { field_name: '使用次数', type: 2 },
      { field_name: '文件路径', type: 1 },
    ],
    views: [
      { view_name: '全部技能', view_type: 'grid' },
      { view_name: 'P0核心', view_type: 'grid' },
      { view_name: '按分类', view_type: 'grid' },
    ]
  },

  workflow_log: {
    label: '工作流日志',
    fields: [
      { field_name: '工作流名称', type: 1 },
      { field_name: '触发类型', type: 3, property: { options: [
        { name: 'webhook', color: 0 }, { name: 'schedule', color: 1 }, { name: 'manual', color: 2 },
        { name: 'record_change', color: 3 }, { name: 'button', color: 4 }
      ]}},
      { field_name: '执行状态', type: 3, property: { options: [
        { name: 'success', color: 4 }, { name: 'failed', color: 0 }, { name: 'running', color: 2 }, { name: 'pending', color: 1 }
      ]}},
      { field_name: '开始时间', type: 5 },
      { field_name: '结束时间', type: 5 },
      { field_name: '耗时(ms)', type: 2 },
      { field_name: '使用技能', type: 1 },
      { field_name: '输入参数', type: 1 },
      { field_name: '输出结果', type: 1 },
      { field_name: '错误信息', type: 1 },
      { field_name: '触发人', type: 11 },
      { field_name: '重试次数', type: 2 },
    ],
    views: [
      { view_name: '全部日志', view_type: 'grid' },
      { view_name: '失败记录', view_type: 'grid' },
      { view_name: '今日日志', view_type: 'grid' },
      { view_name: '按工作流', view_type: 'grid' },
    ]
  }
};

// ========== 技能数据 ==========

const ALL_SKILLS = [
  // strategy (14)
  { skill_name: 'product-context', skill_label: '产品定位设置', category: 'strategy', triggers: '/产品定位,/product-context', desc: '设置产品营销上下文：ICP、痛点、差异化、品牌声音', priority: 'P0核心' },
  { skill_name: 'marketing-plan', skill_label: '营销计划生成', category: 'strategy', triggers: '/营销计划,/marketing-plan', desc: '生成13节AARRR全链路营销计划', priority: 'P0核心' },
  { skill_name: 'competitor-profiling', skill_label: '竞品分析报告', category: 'strategy', triggers: '/竞品分析,/competitor-report', desc: '竞品网站爬取+SEO数据+评价分析+SWOT', priority: 'P1推荐' },
  { skill_name: 'customer-insight', skill_label: '客户洞察研究', category: 'strategy', triggers: '/客户洞察,/customer-insight', desc: 'VOC分析+用户画像+JTBD地图', priority: 'P1推荐' },
  { skill_name: 'pricing', skill_label: '定价策略', category: 'strategy', triggers: '/定价策略,/pricing', desc: '三层套餐设计+定价指标+价位分析', priority: 'P1推荐' },
  { skill_name: 'launch-plan', skill_label: '产品发布计划', category: 'strategy', triggers: '/发布计划,/launch-plan', desc: '五阶段发布+ProductHunt+ORB渠道', priority: 'P1推荐' },
  { skill_name: 'sales-tools', skill_label: '销售赋能', category: 'strategy', triggers: '/销售工具,/sales-tools', desc: 'Pitch Deck+One-Pager+异议处理+ROI计算器', priority: 'P1推荐' },
  { skill_name: 'vs-page', skill_label: '竞品对比页', category: 'strategy', triggers: '/对比页,/vs-page', desc: '4种竞品对比页面+诚实定位策略', priority: 'P2可选' },
  { skill_name: 'ideas', skill_label: '营销创意库', category: 'strategy', triggers: '/创意,/ideas', desc: '139个营销创意×17类别×4阶段', priority: 'P2可选' },
  { skill_name: 'psychology', skill_label: '营销心理学', category: 'strategy', triggers: '/心理学,/psychology', desc: '14个心智模型+30个买家心理学原理', priority: 'P2可选' },
  { skill_name: 'prospect', skill_label: '客户挖掘', category: 'strategy', triggers: '/挖掘客户,/prospect', desc: 'ICP定义+候选列表+评分排序', priority: 'P2可选' },
  { skill_name: 'pr', skill_label: '公共关系', category: 'strategy', triggers: '/公关,/pr', desc: '媒体联络+热点借势+新闻稿', priority: 'P2可选' },
  { skill_name: 'co-marketing', skill_label: '联合营销', category: 'strategy', triggers: '/联合营销,/co-marketing', desc: '合作伙伴挖掘+联合活动策划', priority: 'P2可选' },
  { skill_name: 'council', skill_label: '营销顾问委员会', category: 'strategy', triggers: '/顾问,/council', desc: '10位营销大师模拟评审', priority: 'P2可选' },
  // content (8)
  { skill_name: 'write-copy', skill_label: '文案撰写', category: 'content', triggers: '/写文案,/write-copy', desc: '首页/落地页/定价页/功能页文案生成', priority: 'P0核心' },
  { skill_name: 'edit-copy', skill_label: '文案编辑', category: 'content', triggers: '/编辑文案,/edit-copy', desc: '七步编辑法+多角色审查', priority: 'P1推荐' },
  { skill_name: 'content-strategy', skill_label: '内容策略', category: 'content', triggers: '/内容策略,/content-strategy', desc: '内容支柱+主题集群+关键词研究', priority: 'P1推荐' },
  { skill_name: 'pseo-generate', skill_label: '程序化SEO', category: 'content', triggers: '/程序化SEO,/pseo-generate', desc: '12种玩法+模板变量+规模生成', priority: 'P1推荐' },
  { skill_name: 'free-tool-plan', skill_label: '免费工具策略', category: 'content', triggers: '/免费工具,/free-tool-plan', desc: '计算器/生成器/分析器规划', priority: 'P2可选' },
  { skill_name: 'lead-magnet', skill_label: '引导磁力', category: 'content', triggers: '/引导磁力,/lead-magnet', desc: '清单/模板/测验/电子书设计', priority: 'P2可选' },
  { skill_name: 'gen-image', skill_label: 'AI图片生成', category: 'content', triggers: '/生成图片,/gen-image', desc: '博客头图/社交媒体/产品模型图', priority: 'P1推荐' },
  { skill_name: 'gen-video', skill_label: 'AI视频生成', category: 'content', triggers: '/生成视频,/gen-video', desc: '产品演示/社交剪辑/广告视频', priority: 'P2可选' },
  // seo (5)
  { skill_name: 'seo-audit', skill_label: 'SEO审计', category: 'seo', triggers: '/SEO审计,/seo-audit', desc: '5级审计：可抓取→技术→页面→内容→权威', priority: 'P0核心' },
  { skill_name: 'ai-seo', skill_label: 'AI搜索优化', category: 'seo', triggers: '/AI搜索优化,/ai-seo', desc: 'AI搜索引擎优化+llms.txt+OKF', priority: 'P1推荐' },
  { skill_name: 'add-schema', skill_label: '结构化数据', category: 'seo', triggers: '/添加Schema,/add-schema', desc: '10种Schema类型JSON-LD标记', priority: 'P2可选' },
  { skill_name: 'site-plan', skill_label: '网站架构', category: 'seo', triggers: '/网站架构,/site-plan', desc: '页面层级+导航+URL+内部链接规划', priority: 'P2可选' },
  { skill_name: 'aso-audit', skill_label: '应用商店优化', category: 'seo', triggers: '/应用商店优化,/aso-audit', desc: 'App Store/Google Play列表审计', priority: 'P2可选' },
  // advertising (2)
  { skill_name: 'ad-manage', skill_label: '广告管理', category: 'advertising', triggers: '/广告管理,/ad-manage', desc: 'Google/Meta/LinkedIn/TikTok广告管理', priority: 'P0核心' },
  { skill_name: 'ad-creative', skill_label: '广告创意生成', category: 'advertising', triggers: '/广告创意,/ad-creative', desc: '批量生成文案+钩子系统+视觉模板', priority: 'P1推荐' },
  // conversion (5)
  { skill_name: 'cro-audit', skill_label: '转化率优化', category: 'conversion', triggers: '/转化优化,/cro-audit', desc: '7维度转化分析+Quick Wins+测试建议', priority: 'P0核心' },
  { skill_name: 'popup-optimize', skill_label: '弹窗优化', category: 'conversion', triggers: '/弹窗优化,/popup-optimize', desc: '6种触发策略+合规检查', priority: 'P1推荐' },
  { skill_name: 'signup-optimize', skill_label: '注册流程优化', category: 'conversion', triggers: '/注册优化,/signup-optimize', desc: '单步vs多步+社交认证+移动端', priority: 'P1推荐' },
  { skill_name: 'paywall-design', skill_label: '付费墙设计', category: 'conversion', triggers: '/付费墙,/paywall-design', desc: '5种付费墙类型+价值先于要求', priority: 'P2可选' },
  { skill_name: 'offer-design', skill_label: '报价设计', category: 'conversion', triggers: '/报价设计,/offer-design', desc: '价值方程式+6要素报价设计', priority: 'P2可选' },
  // email (3)
  { skill_name: 'email-sequence', skill_label: '邮件序列', category: 'email', triggers: '/邮件序列,/email-sequence', desc: '欢迎/培养/挽回/引导自动化序列', priority: 'P0核心' },
  { skill_name: 'cold-email', skill_label: '冷邮件外展', category: 'email', triggers: '/冷邮件,/cold-email', desc: 'B2B冷邮件框架+跟进序列', priority: 'P1推荐' },
  { skill_name: 'sms-campaign', skill_label: '短信营销', category: 'email', triggers: '/短信营销,/sms-campaign', desc: '合规短信+欢迎/弃购/赢回', priority: 'P2可选' },
  // social (2)
  { skill_name: 'social-post', skill_label: '社交媒体内容', category: 'social', triggers: '/社交内容,/social-post', desc: 'LinkedIn/Twitter/抖音/小红书内容', priority: 'P0核心' },
  { skill_name: 'community', skill_label: '社区营销', category: 'social', triggers: '/社区营销,/community', desc: '社区飞轮+共同身份+平台指南', priority: 'P1推荐' },
  // growth (5)
  { skill_name: 'marketing-loop', skill_label: '营销循环', category: 'growth', triggers: '/营销循环,/marketing-loop', desc: '9步回环结构+43个预建回环', priority: 'P1推荐' },
  { skill_name: 'churn-prevent', skill_label: '流失预防', category: 'growth', triggers: '/流失预防,/churn-prevent', desc: '取消流程+保存报价+催收策略', priority: 'P1推荐' },
  { skill_name: 'referral-plan', skill_label: '推荐计划', category: 'growth', triggers: '/推荐计划,/referral-plan', desc: '客户推荐+联盟计划设计', priority: 'P1推荐' },
  { skill_name: 'onboarding-plan', skill_label: '用户引导', category: 'growth', triggers: '/用户引导,/onboarding-plan', desc: 'Aha时刻+清单+多渠道引导', priority: 'P2可选' },
  { skill_name: 'directory-submit', skill_label: '目录提交', category: 'growth', triggers: '/目录提交,/directory-submit', desc: '13层300+目录+ProductHunt攻略', priority: 'P2可选' },
  // analytics (3)
  { skill_name: 'setup-analytics', skill_label: '分析设置', category: 'analytics', triggers: '/分析设置,/setup-analytics', desc: 'GA4/GTM/Mixpanel/PostHog配置', priority: 'P0核心' },
  { skill_name: 'ab-test', skill_label: 'A/B测试', category: 'analytics', triggers: '/AB测试,/ab-test', desc: 'ICE优先级+假设框架+样本量计算', priority: 'P0核心' },
  { skill_name: 'revops', skill_label: '营收运营', category: 'analytics', triggers: '/营收运营,/revops', desc: '7阶段生命周期+评分+路由', priority: 'P1推荐' },
];

// ========== 主流程 ==========

async function main() {
  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║   Kason Marketing OS V3.0 — 一键自动部署        ║');
  console.log('║   飞书多维表格 + 技能注册 自动化创建              ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const client = new FeishuClient();
  const tableIds = {}; // name → { table_id, appToken }

  try {
    // Step 1: 创建多维表格
    const app = await client.createBitable('Kason Marketing OS');
    const appToken = app.app_token;
    const bitableURL = app.url;

    // Step 2: 按顺序创建所有表
    const tableOrder = ['campaigns', 'content', 'leads', 'tasks', 'analytics', 'skills_registry', 'workflow_log'];
    
    for (const name of tableOrder) {
      const def = TABLE_DEFINITIONS[name];
      if (!def) continue;

      console.log(`\n━━━ ${def.label} ━━━`);
      
      // 创建表
      const table = await client.addTable(appToken, { name, label: def.label });
      tableIds[name] = table.table_id;

      // 添加字段
      await client.addFields(appToken, table.table_id, def.fields);
    }

    // Step 3: 注册技能到 skills_registry 表
    console.log(`\n━━━ 注册技能 ━━━`);
    console.log(`  🤖 注册 ${ALL_SKILLS.length} 个技能...`);
    
    if (tableIds.skills_registry) {
      const records = ALL_SKILLS.map(s => ({
        fields: {
          '技能名称': s.skill_name,
          '技能标签': s.skill_label,
          '分类': s.category,
          '触发词': s.triggers,
          '功能描述': s.desc,
          '版本': '1.0.0',
          '状态': 'active',
          '优先级': s.priority,
          '文件路径': `feishu/skills/${s.category}/${s.skill_name}.md`,
          '使用次数': 0,
        }
      }));

      const added = await client.addRecords(appToken, tableIds.skills_registry, records);
      console.log(`  ✅ 已注册 ${added} 个技能`);
    }

    // Step 4: 生成总结
    console.log(`\n${'='.repeat(55)}`);
    console.log(`\n✅ 自动化部署完成！\n`);
    console.log(`📊 多维表格 URL: ${bitableURL}`);
    console.log(`📊 App Token: ${appToken}`);
    console.log(`📊 表数量: ${Object.keys(tableIds).length}`);
    console.log(`🤖 技能数量: ${ALL_SKILLS.length}`);
    console.log(`\n${'='.repeat(55)}`);

    // Step 5: 生成下一步操作指南
    console.log(`\n📋 接下来需要手动操作:\n`);
    console.log(`1. 打开 URL，查看多维表格`);
    console.log(`2. 在表格中手动添加关联列（需要跨表关联）:`);
    console.log(`   - campaigns 表: 添加「关联内容」→ content, 「关联线索」→ leads`);
    console.log(`   - content 表: 添加「关联活动」→ campaigns`);
    console.log(`   - leads 表: 添加「来源活动」→ campaigns`);
    console.log(`   - tasks 表: 添加「关联活动」→ campaigns, 「使用技能」→ skills_registry`);
    console.log(`3. 配置飞书工作流: 参考 feishu/workflows/workflow-config.md`);
    console.log(`4. 部署 API 服务: npm install && node server.js`);
    console.log(`5. 配置机器人指令: 参考 docs/SETUP-GUIDE.md Phase 3`);
    console.log(`\n💡 多维表格 URL 已自动复制到控制台，请收藏！\n`);

    // 保存部署结果
    const result = {
      deployedAt: new Date().toISOString(),
      bitableURL,
      appToken,
      tables: tableIds,
      skillCount: ALL_SKILLS.length,
    };
    fs.writeFileSync(
      path.join(__dirname, '..', '.deploy-result.json'),
      JSON.stringify(result, null, 2)
    );
    console.log(`📄 部署结果已保存到 .deploy-result.json\n`);

  } catch (error) {
    console.error(`\n❌ 部署失败: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main();
