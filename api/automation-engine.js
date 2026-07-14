/**
 * Kason Marketing OS — 自动化引擎
 * 
 * 6个核心工作流，由 Express 服务驱动，通过飞书 Webhook 触发
 * 部署: node server.js (自动加载本模块)
 */

const fetch = globalThis.fetch;

class AutomationEngine {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.appToken = null;
  }

  setAppToken(token) { this.appToken = token; }

  async getToken() {
    const r = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: this.appId, app_secret: this.appSecret })
    });
    const d = await r.json();
    if (d.code !== 0) throw new Error(d.msg);
    return d.tenant_access_token;
  }

  async api(method, path, body) {
    const token = await this.getToken();
    const opts = { method, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } };
    if (body) opts.body = JSON.stringify(body);
    const r = await fetch(`https://open.feishu.cn/open-apis${path}`, opts);
    return r.json();
  }

  async getRecords(tableId, filter) {
    let all = [];
    let pageToken = null;
    do {
      const d = await this.api('GET', `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records?page_size=500${pageToken ? '&page_token=' + pageToken : ''}${filter ? '&filter=' + encodeURIComponent(filter) : ''}`);
      if (d.data && d.data.items) all = all.concat(d.data.items);
      pageToken = d.data?.has_more ? d.data.page_token : null;
    } while (pageToken);
    return all;
  }

  async updateRecord(tableId, recordId, fields) {
    return this.api('PUT', `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/${recordId}`, { fields });
  }

  async createRecord(tableId, fields) {
    const d = await this.api('POST', `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records`, { fields });
    return d.data?.record;
  }

  async deleteRecord(tableId, recordId) {
    return this.api('DELETE', `/bitable/v1/apps/${this.appToken}/tables/${tableId}/records/${recordId}`);
  }

  async sendMessage(receiveIdType, receiveId, content) {
    return this.api('POST', '/im/v1/messages', {
      receive_id: receiveId,
      msg_type: 'interactive',
      content: JSON.stringify(content)
    }, { 'receive_id_type': receiveIdType });
  }

  // ==================== Workflow 1: 内容发布自动化 ====================
  async workflow_content_publish(record) {
    const fields = record.fields;
    const content = fields['正文'] || fields['内容'] || '';
    const title = fields['标题'] || '';
    const wpUrl = process.env.WP_SITE_URL + '/wp-json/wp/v2/posts';
    const auth = Buffer.from(`${process.env.WP_USERNAME}:${process.env.WP_APP_PASSWORD}`).toString('base64');

    try {
      const r = await fetch(wpUrl, {
        method: 'POST',
        headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title,
          content: content,
          status: 'publish',
          meta: {
            _yoast_wpseo_title: fields['SEO标题'] || title,
            _yoast_wpseo_metadesc: fields['SEO描述'] || ''
          }
        })
      });
      const wpData = await r.json();

      await this.updateRecord('tblSEJz5u8sgun0Y', record.record_id, {
        '状态': '已发布',
        'WP文章ID': wpData.id,
        'WP链接': wpData.link,
        '发布日期': Date.now()
      });

      console.log(`[Workflow1] 发布成功: ${title} → ${wpData.link}`);
      return { success: true, wpUrl: wpData.link };

    } catch (e) {
      console.error(`[Workflow1] 发布失败: ${e.message}`);
      return { success: false, error: e.message };
    }
  }

  // ==================== Workflow 2: 线索评分 + 通知 ====================
  SCORING_RULES = {
    '来源': { '展会': 20, '推荐': 20, '广告': 15, '官网表单': 10, '落地页': 8, '邮件': 5, '社交媒体': 5 },
    '行业': { '4S店': 25, '加油站': 20, '商场': 15, '酒店': 12, '车队': 18, '停车场': 8, '住宅小区': 6, '独立洗车店': 10 },
    '预算范围': { '>30万': 20, '15-30万': 15, '5-15万': 8 },
    '公司规模': { '企业': 15, '大型': 12, '中型': 8 }
  };

  async workflow_lead_nurturing(record) {
    const f = record.fields;
    let score = 0;
    const details = [];

    // 来源评分
    const srcScore = this.SCORING_RULES['来源'][f['来源']] || 0;
    if (srcScore) { score += srcScore; details.push(`来源+${srcScore}`); }

    // 行业评分
    const indScore = this.SCORING_RULES['行业'][f['行业']] || 0;
    if (indScore) { score += indScore; details.push(`行业+${indScore}`); }

    // 预算评分
    const budScore = this.SCORING_RULES['预算范围'][f['预算范围']] || 0;
    if (budScore) { score += budScore; details.push(`预算+${budScore}`); }

    // 规模评分
    const sizeScore = this.SCORING_RULES['公司规模'][f['公司规模']] || 0;
    if (sizeScore) { score += sizeScore; details.push(`规模+${sizeScore}`); }

    const company = f['公司名称'] || '未知公司';
    const contact = f['联系人'] || '未知';

    // 更新评分
    await this.updateRecord('tbl8W2yRkt7phoI2', record.record_id, {
      '线索评分': score,
      '生命周期': score >= 70 ? 'MQL' : '线索',
      '状态': '新建'
    });

    console.log(`[Workflow2] ${company} 评分: ${score} (${details.join(', ')})`);

    // 高意向：创建跟进任务
    if (score >= 70) {
      await this.createRecord('tblywAffxdwFKH31', {
        '任务名称': `跟进高意向 - ${company}`,
        '任务类型': '客户跟进',
        '状态': '待开始',
        '优先级': score >= 85 ? 'P0' : 'P1',
        '执行人': f['负责人'] ? [{ id: f['负责人'][0]?.id }] : undefined,
        '截止日期': Date.now() + 86400000,
        '任务描述': `线索评分: ${score}/100\n${details.join(', ')}\n联系人: ${contact}`
      });
      console.log(`[Workflow2] 高意向任务已创建: ${company}`);
    }

    return { score, details, isHighIntent: score >= 70 };
  }

  // ==================== Workflow 3: SEO 定期审计 ====================
  async workflow_seo_audit() {
    const records = await this.getRecords('tblSEJz5u8sgun0Y', 'CurrentValue.[状态]="已发布"');
    const lowScore = records.filter(r => (r.fields['SEO评分'] || 0) < 70 && r.fields['发布日期']);

    console.log(`[Workflow3] SEO审计: ${records.length}篇已发布, ${lowScore.length}篇需优化`);

    let created = 0;
    for (const r of lowScore.slice(0, 10)) {
      await this.createRecord('tblywAffxdwFKH31', {
        '任务名称': `SEO优化 - ${r.fields['标题']}`,
        '任务类型': 'SEO',
        '状态': '待开始',
        '优先级': 'P2',
        '执行人': r.fields['作者'] ? [{ id: r.fields['作者'][0]?.id }] : undefined,
        '截止日期': Date.now() + 3 * 86400000,
        '任务描述': `当前SEO评分: ${r.fields['SEO评分']}/100`
      });
      created++;
    }

    // 写入数据指标
    const avgScore = records.length > 0
      ? Math.round(records.reduce((s, r) => s + (r.fields['SEO评分'] || 0), 0) / records.length)
      : 0;

    await this.createRecord('tblDVRJ2WIiBwwi4', {
      '日期': Date.now(),
      '指标类别': 'SEO',
      '指标名称': 'avg_seo_score',
      '指标标签': '平均SEO评分',
      '指标值': avgScore,
      '数据源': 'weekly-seo-audit'
    });

    return { totalPublished: records.length, lowScore: lowScore.length, tasksCreated: created, avgScore };
  }

  // ==================== Workflow 4: 邮件序列触发 ====================
  async workflow_email_sequence(record) {
    const f = record.fields;
    const email = f['邮箱'];

    if (!email) {
      console.log('[Workflow4] 跳过: 无邮箱');
      return { skipped: true, reason: '无邮箱' };
    }

    const tasks = [
      { name: `发送邮件1-欢迎 - ${f['公司名称']}`, due: Date.now() },
      { name: `发送邮件2-案例 - ${f['公司名称']}`, due: Date.now() + 3 * 86400000 },
      { name: `发送邮件3-方案 - ${f['公司名称']}`, due: Date.now() + 7 * 86400000 },
      { name: `发送邮件4-跟进 - ${f['公司名称']}`, due: Date.now() + 14 * 86400000 },
    ];

    for (const t of tasks) {
      await this.createRecord('tblywAffxdwFKH31', {
        '任务名称': t.name,
        '任务类型': '邮件发送',
        '状态': '待开始',
        '优先级': 'P2',
        '截止日期': t.due,
      });
    }

    await this.updateRecord('tbl8W2yRkt7phoI2', record.record_id, {
      '最后联系': Date.now(),
      '下次跟进': Date.now() + 3 * 86400000
    });

    console.log(`[Workflow4] 邮件序列已创建: ${f['公司名称']} (${email})`);
    return { success: true, email };
  }

  // ==================== Workflow 5: 数据汇总 ====================
  async workflow_daily_summary() {
    const now = Date.now();
    const today = Math.floor(now / 86400000) * 86400000;

    // 汇总基本统计
    const leads = await this.getRecords('tbl8W2yRkt7phoI2');
    const contents = await this.getRecords('tblSEJz5u8sgun0Y');

    const newLeadsToday = leads.filter(r => {
      const c = r.fields['最后联系'];
      return c && c >= today;
    }).length;

    const mqlCount = leads.filter(r => r.fields['生命周期'] === 'MQL').length;
    const publishedToday = contents.filter(r => r.fields['状态'] === '已发布' && r.fields['发布日期'] && r.fields['发布日期'] >= today).length;

    // 写入指标
    await this.createRecord('tblDVRJ2WIiBwwi4', { '日期': today, '指标类别': '转化', '指标名称': 'new_leads', '指标标签': '今日新增线索', '指标值': newLeadsToday, '单位': '个' });
    await this.createRecord('tblDVRJ2WIiBwwi4', { '日期': today, '指标类别': '转化', '指标名称': 'mql_count', '指标标签': '当前MQL数', '指标值': mqlCount, '单位': '个' });
    await this.createRecord('tblDVRJ2WIiBwwi4', { '日期': today, '指标类别': '内容', '指标名称': 'published_today', '指标标签': '今日发布内容', '指标值': publishedToday, '单位': '篇' });

    console.log(`[Workflow5] 日汇总: 线索+${newLeadsToday}, MQL=${mqlCount}, 内容+${publishedToday}`);
    return { newLeads: newLeadsToday, mqlCount, publishedToday };
  }

  // ==================== Workflow 6: 每周周报 ====================
  async workflow_weekly_report() {
    const now = Date.now();
    const weekAgo = now - 7 * 86400000;

    const leads = await this.getRecords('tbl8W2yRkt7phoI2');
    const contents = await this.getRecords('tblSEJz5u8sgun0Y');
    const tasks = await this.getRecords('tblywAffxdwFKH31');

    const newLeadsWeek = leads.filter(r => {
      const c = r.fields['最后联系'] || r.fields['创建时间'];
      return c && c >= weekAgo;
    }).length;

    const closedWeek = leads.filter(r => {
      return r.fields['状态'] === '已成交';
    }).length;

    const publishedWeek = contents.filter(r => {
      return r.fields['状态'] === '已发布' && r.fields['发布日期'] && r.fields['发布日期'] >= weekAgo;
    }).length;

    const completedTasksWeek = tasks.filter(r => {
      return r.fields['状态'] === '已完成';
    }).length;

    const report = {
      period: '本周',
      newLeads: newLeadsWeek,
      closed: closedWeek,
      published: publishedWeek,
      completedTasks: completedTasksWeek,
      totalLeads: leads.length,
      totalMQL: leads.filter(r => r.fields['生命周期'] === 'MQL').length,
      totalSQL: leads.filter(r => r.fields['生命周期'] === 'SQL').length,
    };

    console.log(`[Workflow6] 周报: 线索+${newLeadsWeek}, 成交=${closedWeek}, 内容+${publishedWeek}, 任务=${completedTasksWeek}`);
    return report;
  }

  // ==================== 主调度器 ====================
  async handleWebhook(eventType, data) {
    console.log(`[Automation] 收到事件: ${eventType}`);

    switch (eventType) {
      // 线索管理表 → 新记录
      case 'leads.created':
        return this.workflow_lead_nurturing(data);

      // 线索管理表 → 变为 MQL
      case 'leads.became_mql':
        return this.workflow_email_sequence(data);

      // 内容资产表 → 变为 已通过
      case 'content.approved':
        return this.workflow_content_publish(data);

      // 定时: SEO审计
      case 'schedule.seo_audit':
        return this.workflow_seo_audit();

      // 定时: 每日汇总
      case 'schedule.daily_summary':
        return this.workflow_daily_summary();

      // 定时: 每周周报
      case 'schedule.weekly_report':
        return this.workflow_weekly_report();

      default:
        return { error: 'Unknown event type' };
    }
  }
}

module.exports = AutomationEngine;
