# 飞书 Workflow 配置指南 — Kason Marketing OS V3.0

本文档提供所有自动化工作流的详细配置步骤，可直接在飞书「工作流」中按步骤创建。

---

## 前置准备

1. 飞书企业版，已开通「工作流」功能
2. 已创建 7 个多维表
3. Webhook 服务器已部署（Node.js 后端）
4. 飞书机器人已配置消息推送权限

---

## Workflow 1: 内容发布自动化

### 触发条件
- 类型: 记录变更触发
- 数据表: `content` (内容资产)
- 触发字段: `status`
- 触发条件: 当 `status` 从任意值 → "已通过"

### 步骤配置

**步骤1: 获取记录详情**
- 动作: 获取记录
- 数据表: content
- 记录ID: `{{trigger.record_id}}`

**步骤2: 调用 WordPress 发布 API**
- 动作: 发送 HTTP 请求 (Webhook)
- 方法: POST
- URL: `https://your-server.com/api/content/publish`
- Headers: `Content-Type: application/json`, `Authorization: Bearer {{env.API_KEY}}`
- Body (JSON):
```json
{
  "title": "{{record.title}}",
  "content": "{{record.body}}",
  "status": "publish",
  "meta": {
    "seo_title": "{{record.meta_title}}",
    "seo_description": "{{record.meta_description}}"
  },
  "categories": ["{{record.content_type}}"]
}
```

**步骤3: 更新 content 记录**
- 动作: 更新记录
- 数据表: content
- 记录ID: `{{trigger.record_id}}`
- 更新字段:
  - `status` → "已发布"
  - `wp_post_id` → `{{step2.response.data.id}}`
  - `wp_url` → `{{step2.response.data.link}}`
  - `publish_date` → `{{current_time}}`

**步骤4: 条件判断 — SEO评分**
- 动作: 条件分支
- 条件: `record.seo_score` < 70
- 如果为真 → 执行步骤4a

**步骤4a: 创建 SEO 优化任务**
- 动作: 新增记录
- 数据表: tasks
- 字段:
  - `task_name` → "SEO优化 - {{record.title}}"
  - `task_type` → "SEO"
  - `status` → "待开始"
  - `priority` → "P2"
  - `assignee` → "{{record.author}}"
  - `due_date` → `{{current_time + 3 days}}`
  - `campaign_id` → "{{record.campaign_id}}"
  - `description` → "文章SEO评分 {{record.seo_score}}/100，需优化以提升搜索排名"

**步骤5: 发送成功通知**
- 动作: 发送飞书消息
- 接收人: `{{record.author}}`
- 消息类型: 卡片消息
- 卡片内容:
```json
{
  "title": "✅ 内容已发布",
  "content": "**{{record.title}}**\n链接: {{step3.wp_url}}\nSEO评分: {{record.seo_score}}/100"
}
```

**步骤6: 记录工作流日志**
- 动作: 新增记录
- 数据表: workflow_log
- 字段:
  - `workflow_name` → "content-publishing"
  - `trigger_type` → "record_change"
  - `status` → "success"
  - `start_time` → `{{trigger.time}}`
  - `end_time` → `{{current_time}}`
  - `skill_used` → "write-copy"
  - `campaign_id` → "{{record.campaign_id}}"

### 所需权限
- content 表: 读取、更新
- tasks 表: 创建
- workflow_log 表: 创建
- 消息推送: 是

---

## Workflow 2: 线索培育自动化

### 触发条件
- 类型: Webhook 触发
- Webhook URL: 自动生成，需配置到网站表单

### 步骤配置

**步骤1: 解析 Webhook 数据**
- 动作: 设置变量
- 从 webhook body 提取: company_name, contact_name, email, phone, source, industry, message

**步骤2: 创建线索记录**
- 动作: 新增记录
- 数据表: leads
- 字段:
  - `company_name` → `{{var.company_name}}`
  - `contact_name` → `{{var.contact_name}}`
  - `email` → `{{var.email}}`
  - `phone` → `{{var.phone}}`
  - `source` → `{{var.source}}`
  - `industry` → `{{var.industry}}`
  - `lifecycle_stage` → "线索"
  - `status` → "新建"
  - `last_contact` → `{{current_time}}`
  - `notes` → `{{var.message}}`

**步骤3: 线索自动评分**
- 动作: 发送 HTTP 请求
- 方法: POST
- URL: `https://your-server.com/api/leads/score`
- Body:
```json
{
  "industry": "{{var.industry}}",
  "company_size": "{{var.company_size}}",
  "source": "{{var.source}}",
  "lead_data": "{{var.message}}"
}
```

**步骤4: 更新线索评分**
- 动作: 更新记录
- 数据表: leads
- 记录ID: `{{step2.record_id}}`
- 字段:
  - `lead_score` → `{{step3.response.data.score}}`

**步骤5: 条件判断 — 高意向线索**
- 条件: `{{step3.response.data.score}}` >= 70
- 如果为真:

**步骤5a: 发送高意向通知**
- 动作: 发送飞书消息
- 接收人: 销售团队群
- 卡片:
```json
{
  "title": "🔔 高意向新线索",
  "content": "公司: **{{var.company_name}}**\n联系人: {{var.contact_name}}\n行业: {{var.industry}}\n评分: {{step3.response.data.score}}/100"
}
```

**步骤5b: 创建跟进任务**
- 动作: 新增记录
- 数据表: tasks
- 字段:
  - `task_name` → "跟进高意向线索 - {{var.company_name}}"
  - `task_type` → "客户跟进"
  - `status` → "待开始"
  - `priority` → "P0"
  - `assignee` → "销售负责人"
  - `due_date` → `{{current_time + 1 day}}`

**步骤6: 记录日志**
- 动作: 新增记录 → workflow_log

### 所需权限
- leads 表: 创建、更新
- tasks 表: 创建
- 消息推送: 是

---

## Workflow 3: SEO 定期审计

### 触发条件
- 类型: 定时触发
- 频率: 每周一 09:00 (CST)
- 表达式: `0 9 * * 1`

### 步骤配置

**步骤1: 查询待优化内容**
- 动作: 查找记录
- 数据表: content
- 过滤条件:
  - `publish_date` ≥ `{{current_time - 7 days}}`
  - `seo_score` < 70
  - `status` = "已发布"

**步骤2: 循环处理 — 批量创建 SEO 任务**
- 动作: 循环 (遍历步骤1的结果)
- 对每条记录:
  - 动作: 新增记录 → tasks
  - 字段:
    - `task_name` → "SEO优化 - {{loop_item.title}}"
    - `task_type` → "SEO"
    - `priority` → "P2"
    - `assignee` → "{{loop_item.author}}"
    - `due_date` → `{{current_time + 3 days}}`

**步骤3: 调用 SEO 审计 API**
- 动作: 发送 HTTP 请求
- 方法: POST
- URL: `https://your-server.com/api/seo/weekly-audit`
- Body:
```json
{
  "urls": [提取步骤1中所有 wp_url],
  "site": "yourdomain.com"
}
```

**步骤4: 批量更新 SEO 评分**
- 动作: 循环
- 遍历 `{{step3.response.data.results}}`
- 更新 content 表: `seo_score` → `{{loop_item.score}}`

**步骤5: 写入数据指标**
- 动作: 新增记录
- 数据表: analytics
- 字段:
  - `date` → `{{current_date}}`
  - `metric_category` → "SEO"
  - `metric_name` → "avg_seo_score"
  - `metric_label` → "平均SEO评分"
  - `metric_value` → 步骤4的平均值
  - `source` → "weekly-audit"

**步骤6: 发送周报**
- 动作: 发送飞书消息到团队群
- 卡片:
```json
{
  "title": "📊 本周SEO审计报告",
  "content": "审计页面: {{step1.count}}个\n平均评分: {{avg_score}}\n已创建优化任务: {{step2.count}}个"
}
```

---

## Workflow 4: 邮件序列触发

### 触发条件
- 类型: 记录变更触发
- 数据表: leads
- 触发字段: `lifecycle_stage`
- 触发条件: 变更为 "MQL"

### 步骤配置

**步骤1: 检查邮箱**
- 动作: 条件分支
- 条件: `record.email` 不为空
- 如果为空 → 终止

**步骤2: 确定邮件序列**
- 动作: 发送 HTTP 请求 → 后端判断序列类型
- URL: `https://your-server.com/api/email/determine-sequence`
- Body: `{"industry": "{{record.industry}}", "source": "{{record.source}}"}`

**步骤3: 发送第一封邮件**
- 动作: 发送 HTTP 请求
- 方法: POST
- URL: `https://your-server.com/api/email/send`
- Body:
```json
{
  "to": "{{record.email}}",
  "name": "{{record.contact_name}}",
  "sequence_type": "{{step2.response.data.sequence_type}}",
  "email_index": 1
}
```

**步骤4: 创建后续邮件任务**
- 动作: 批量新增 → tasks
- 3条记录:
  - 邮件2: due_date = `{{current_time + 3 days}}`
  - 邮件3: due_date = `{{current_time + 7 days}}`
  - 邮件4: due_date = `{{current_time + 14 days}}`

**步骤5: 更新线索**
- 动作: 更新记录 → leads
- 字段: `last_contact` → `{{current_time}}`

**步骤6: 记录日志**
- 动作: 新增记录 → workflow_log

---

## Workflow 5: 每日数据汇总

### 触发条件
- 类型: 定时触发
- 频率: 每日 08:00

### 步骤配置

**步骤1: 聚合昨日数据**
- 动作: 发送 HTTP 请求
- URL: `https://your-server.com/api/analytics/daily-summary`
- 方法: POST
- Body: `{"date": "{{yesterday}}"}`

**步骤2: 写入数据指标表**
- 动作: 批量新增 → analytics
- 字段映射: 流量、线索、转化率等

**步骤3: 异常检测**
- 动作: 条件分支
- 对每个关键指标:
  - 如果 `growth_rate` < -20% → 发送告警消息

**步骤4: 记录日志**

---

## Workflow 6: 每周营销周报

### 触发条件
- 类型: 定时触发
- 频率: 每周五 17:00

### 步骤配置

**步骤1: 汇总周数据**
- 动作: 发送 HTTP 请求
- URL: `https://your-server.com/api/reports/weekly`
- 方法: POST

**步骤2: 生成飞书文档**
- 动作: 创建飞书文档
- 模板: 周报模板
- 填充数据: 来自步骤1

**步骤3: 发送周报到群**
- 动作: 发送飞书消息
- 卡片: 包含关键KPI和文档链接

**步骤4: 创建下周任务模板**
- 动作: 新增记录 → tasks (重复性任务)

**步骤5: 记录日志**

---

## Webhook 服务端配置参考

```javascript
// Webhook 接收端点 (Express.js)
const express = require('express');
const app = express();
app.use(express.json());

// 飞书 Webhook 验证
app.post('/webhook/feishu', async (req, res) => {
  const { challenge, token } = req.body;
  if (challenge) return res.json({ challenge });
  
  // 处理工作流回调
  // ...
  res.json({ code: 0 });
});

// WordPress 发布接口
app.post('/api/content/publish', async (req, res) => {
  const { title, content, meta } = req.body;
  // 调用 WordPressClient
  const result = await wpClient.createPost({ title, content, meta });
  res.json({ code: 0, data: result });
});

app.listen(3000);
```
