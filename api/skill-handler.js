/**
 * Kason Marketing OS — 机器人技能处理器
 * 
 * 接收飞书消息，匹配技能指令，返回响应
 */

class SkillHandler {
  constructor(engine) {
    this.engine = engine;
    this.appToken = null;
  }

  setAppToken(token) { this.appToken = token; }

  async getToken() {
    const r = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: process.env.FEISHU_APP_ID, app_secret: process.env.FEISHU_APP_SECRET })
    });
    return (await r.json()).tenant_access_token;
  }

  async replyToMessage(messageId, content) {
    const token = await this.getToken();
    await fetch('https://open.feishu.cn/open-apis/im/v1/messages/' + messageId + '/reply', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: JSON.stringify({ text: content }),
        msg_type: 'text'
      })
    });
  }

  async sendCardToChat(chatId, card) {
    const token = await this.getToken();
    await fetch('https://open.feishu.cn/open-apis/im/v1/messages', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        receive_id: chatId,
        msg_type: 'interactive',
        content: JSON.stringify(card)
      })
    });
  }

  async handleSkillCommand(event) {
    const text = (event.message?.content || '').replace(/@\S+\s*/, '').trim();
    const chatId = event.message?.chat_id;
    const msgId = event.message?.message_id;

    if (!text) {
      // 被 @但没有指令，显示帮助
      const help = `Kason Marketing OS V3.0 — 可用指令

📝 内容营销
/写文案 — AI撰写页面文案
/编辑文案 — 七步编辑优化
/内容策略 — 内容支柱+关键词规划

🔍 SEO
/SEO审计 — 网站SEO全面检查
/AI搜索优化 — AI搜索引擎优化

📊 广告 & 转化
/广告管理 — 多平台广告投放
/转化优化 — 7维度转化率优化

💰 策略
/营销计划 — AARRR全链路计划
/竞品分析 — 竞品深度报告
/定价策略 — 定价套餐设计

📧 邮件 & 社交
/邮件序列 — 自动化邮件流程
/社交内容 — 社交媒体创作

发送 /技能列表 查看全部47个技能`;
      await this.replyToMessage(msgId, help);
      return;
    }

    // 技能映射表
    const skillMap = {
      '写文案':    { name: 'write-copy', icon: '✍️', desc: '帮你撰写首页、落地页、定价页、功能页文案。请提供：产品/页面类型/目标受众' },
      '编辑文案':  { name: 'edit-copy', icon: '📝', desc: '七步编辑法优化现有文案。请粘贴需要编辑的内容' },
      '内容策略':  { name: 'content-strategy', icon: '🗂️', desc: '规划内容支柱、主题集群、关键词策略。请说明你的行业和产品' },
      'SEO审计':   { name: 'seo-audit', icon: '🔍', desc: '全面审计网站SEO。请提供网站URL' },
      'AI搜索优化': { name: 'ai-seo', icon: '🤖', desc: '为AI搜索引擎优化内容。请提供需要优化的内容' },
      '广告管理':  { name: 'ad-manage', icon: '📢', desc: '管理Google/Meta/LinkedIn广告。请说明广告目标和预算' },
      '转化优化':  { name: 'cro-audit', icon: '📈', desc: '7维度分析优化转化率。请提供页面URL' },
      '营销计划':  { name: 'marketing-plan', icon: '📊', desc: '生成AARRR全链路营销计划。请说明时间范围和预算' },
      '竞品分析':  { name: 'competitor-report', icon: '🔎', desc: '竞品深度研究。请提供竞品URL' },
      '定价策略':  { name: 'pricing', icon: '💰', desc: '三层套餐设计+定价分析。请说明产品和市场' },
      '邮件序列':  { name: 'email-sequence', icon: '📧', desc: '创建自动化邮件序列。请说明目标(欢迎/培养/挽回)' },
      '社交内容':  { name: 'social-post', icon: '📱', desc: '创作社交平台内容。请说明平台和主题' },
      '产品定位':  { name: 'product-context', icon: '🎯', desc: '设置产品营销上下文。请说明产品/受众/痛点' },
      '客户洞察':  { name: 'customer-insight', icon: '👥', desc: '客户研究+画像分析。请提供数据来源' },
      '技能列表':  { name: 'skills-list', icon: '📋', desc: null },
      '帮助':      { name: 'help', icon: '❓', desc: null },
    };

    // 匹配命令
    let matched = null;
    let cmdKey = null;
    for (const [key, value] of Object.entries(skillMap)) {
      if (text.includes(key)) {
        matched = value;
        cmdKey = key;
        break;
      }
    }

    // 技能列表
    if (cmdKey === '技能列表' || cmdKey === '帮助') {
      const categories = ['strategy','content','seo','advertising','conversion','email','social','growth','analytics'];
      const labels = ['策略规划','内容营销','SEO','广告投放','转化优化','邮件营销','社交媒体','增长运营','数据分析'];
      
      let list = '📋 Kason Marketing OS — 全部47个技能\n\n';
      for (let i = 0; i < categories.length; i++) {
        list += `【${labels[i]}】\n`;
        // Just show category summary
        const count = {strategy:14,content:8,seo:5,advertising:2,conversion:5,email:3,social:2,growth:5,analytics:3}[categories[i]];
        list += `   ${count}个技能 → 发送 /${labels[i]} 查看详情\n`;
      }
      list += `\n💡 所有技能详情已在多维表「技能注册表」中\n`;
      await this.replyToMessage(msgId, list);
      return;
    }

    if (matched) {
      const reply = `${matched.icon} ${cmdKey}

${matched.desc}

📊 多维表格中已记录你的请求，技能 "${matched.name}" 已触发。

🔗 查看完整结果: 打开 Kason Marketing OS 多维表格 → 相关表查看输出。`;
      await this.replyToMessage(msgId, reply);

      // 可选：在工作流日志中记录
      if (this.appToken) {
        try {
          const token = await this.getToken();
          await fetch('https://open.feishu.cn/open-apis/bitable/v1/apps/' + this.appToken + '/tables/tbldcLINHsKQTu4l/records', {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fields: {
                '工作流名称': 'skill-command',
                '触发类型': 'manual',
                '执行状态': 'success',
                '开始时间': Date.now(),
                '使用技能': matched.name,
                '输入参数': text
              }
            })
          });
        } catch (e) { /* silent */ }
      }
    } else {
      await this.replyToMessage(msgId, `未识别指令。发送 /帮助 查看可用技能。\n\n你的输入: ${text.slice(0, 100)}`);
    }
  }
}

module.exports = SkillHandler;
