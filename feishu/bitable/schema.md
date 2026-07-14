# Kason Marketing OS — 飞书多维表完整Schema

本文档定义所有核心多维表的设计规格，可直接在飞书中创建。

---

## 总览关系图

```
skills_registry ──────────────────────────────────────────┐
   │ (技能注册)                                             │
   │                                                       │
campaigns ─────────────────────────────────────┐           │
   │ (营销活动)                                  │           │
   ├──→ content (内容资产)                       │           │
   ├──→ leads (线索管理)                         │           │
   ├──→ tasks (任务管理)                         │           │
   ├──→ analytics (数据指标)                     │           │
   └──→ workflow_log (工作流日志)                │           │
                                                          │
leads ──→ analytics ◄── campaigns                        │
tasks ──→ campaigns                                       │
workflow_log ──→ campaigns, tasks                        │
                                           skills_registry│
analytics ──→ campaigns                                   │
```

---

## 表1: campaigns (营销活动)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 | 选项/格式 |
|--------|------|------|------|-----------|
| _id | 自动编号 | ✓ | 活动ID | AUTO-001 |
| campaign_name | 文本 | ✓ | 活动名称 | "2026Q3 SEO提升计划" |
| campaign_type | 单选 | ✓ | 活动类型 | SEO/内容营销/付费广告/邮件营销/社交媒体/产品发布/品牌推广/其他 |
| status | 单选 | ✓ | 状态 | 规划中/进行中/已暂停/已完成/已归档 |
| priority | 单选 | ✓ | 优先级 | P0-紧急/P1-高/P2-中/P3-低 |
| objective | 多行文本 | ✓ | 活动目标 | "提升自然流量30%，获取50个SQL" |
| budget | 数字 | | 预算(元) | 50000 |
| spent | 数字 | | 已花费(元) | 12500 |
| start_date | 日期 | ✓ | 开始日期 | 2026-07-01 |
| end_date | 日期 | | 结束日期 | 2026-09-30 |
| owner | 人员 | ✓ | 负责人 | @张三 |
| channel | 多选 | | 渠道 | 官网/Google/Meta/LinkedIn/邮件/微信/抖音/其他 |
| target_audience | 文本 | | 目标受众 | "加油站老板 30-55岁" |
| kpi_target | 多行文本 | | KPI目标 | JSON格式的目标指标 |
| kpi_actual | 多行文本 | | 实际KPI | JSON格式的实际数据 |
| roi | 公式 | | ROI | 自动计算: (收益-花费)/花费*100% |
| content_count | 关联 | | 关联内容 | → content表 (多对多) |
| lead_count | 关联 | | 关联线索 | → leads表 (一对多) |
| notes | 多行文本 | | 备注 | |

### 视图配置

| 视图名 | 类型 | 过滤条件 | 排序 | 分组 |
|--------|------|----------|------|------|
| 📋 全部活动 | 表格 | 无 | start_date 降序 | status |
| 🔥 进行中 | 表格 | status=进行中 | priority 升序 | owner |
| 📅 本月活动 | 表格 | start_date 本月 | start_date 升序 | campaign_type |
| 📊 看板视图 | 看板 | 无 | - | status |
| 🗓️ 时间线 | 甘特图 | 无 | start_date 升序 | owner |
| 💰 预算概览 | 表格 | budget>0 | budget 降序 | campaign_type |

---

## 表2: content (内容资产)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 内容ID |
| title | 文本 | ✓ | 标题 |
| content_type | 单选 | ✓ | 类型: 博客文章/落地页/产品页/案例研究/白皮书/社交媒体/邮件/视频/信息图/其他 |
| status | 单选 | ✓ | 状态: 草稿/审核中/已通过/已发布/需更新/已归档 |
| campaign_id | 关联 | | 关联活动 → campaigns |
| target_keyword | 文本 | | 目标关键词 |
| seo_score | 数字 | | SEO评分(0-100) |
| word_count | 数字 | | 字数 |
| author | 人员 | ✓ | 作者 |
| reviewer | 人员 | | 审核人 |
| wp_post_id | 数字 | | WordPress文章ID |
| wp_url | URL | | WordPress链接 |
| publish_date | 日期 | | 发布日期 |
| scheduled_date | 日期 | | 计划发布日期 |
| meta_title | 文本 | | SEO标题 |
| meta_description | 多行文本 | | SEO描述 |
| schema_type | 单选 | | Schema类型: Article/FAQ/HowTo/Product/None |
| featured_image | 附件 | | 特色图片 |
| traffic | 数字 | | 访问量 |
| conversions | 数字 | | 转化数 |
| engagement | 数字 | | 互动数 |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📝 全部内容 | 表格 | - | publish_date 降序 |
| ✍️ 内容日历 | 日历 | - | scheduled_date |
| 📊 看板 | 看板 | - | status |
| 🔍 SEO优化 | 表格 | seo_score<70 | seo_score 升序 |
| 📈 表现最佳 | 表格 | traffic>0 | traffic 降序 |
| 🎯 按类型 | 表格 | - | content_type 分组 |

---

## 表3: leads (线索管理)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 线索ID |
| company_name | 文本 | | 公司名称 |
| contact_name | 文本 | ✓ | 联系人 |
| email | 邮箱 | | 邮箱 |
| phone | 电话 | | 电话 |
| source | 单选 | ✓ | 来源: 官网表单/落地页/广告/邮件/社交媒体/展会/推荐/其他 |
| campaign_id | 关联 | | 来源活动 → campaigns |
| lead_score | 数字 | | 线索评分(0-100) |
| lifecycle_stage | 单选 | ✓ | 阶段: 订阅者/线索/MQL/SQL/商机/客户/品牌传播者 |
| status | 单选 | ✓ | 状态: 新建/已联系/已回复/演示中/报价中/已成交/已流失 |
| industry | 单选 | | 行业: 加油站/商场/4S店/酒店/停车场/住宅小区/独立洗车店/车队/其他 |
| company_size | 单选 | | 规模: 小型/中型/大型/企业 |
| budget_range | 单选 | | 预算: <5万/5-15万/15-30万/>30万 |
| interest_product | 多选 | | 感兴趣产品 |
| pain_points | 多行文本 | | 痛点 |
| last_contact | 日期 | | 最后联系日期 |
| next_followup | 日期 | | 下次跟进日期 |
| owner | 人员 | ✓ | 负责人 |
| notes | 多行文本 | | 备注 |
| deal_value | 数字 | | 预期成交额 |
| deal_probability | 进度 | | 成交概率(%) |
| pipeline_value | 公式 | | 管道价值 = deal_value * deal_probability |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📋 全部线索 | 表格 | - | _id 降序 |
| 🔥 高意向 | 表格 | lead_score≥70 | lead_score 降序 |
| 🎯 本月SQL | 表格 | lifecycle_stage=SQL | _id 降序 |
| 📊 销售漏斗 | 看板 | - | lifecycle_stage |
| 📅 待跟进 | 表格 | next_followup≤今天+3 | next_followup 升序 |
| 💰 管道视图 | 表格 | deal_value>0 | pipeline_value 降序 |

---

## 表4: tasks (任务管理)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 任务ID |
| task_name | 文本 | ✓ | 任务名称 |
| task_type | 单选 | ✓ | 类型: 内容创作/设计/开发/SEO/广告优化/邮件发送/数据分析/客户跟进/审核/其他 |
| status | 单选 | ✓ | 状态: 待开始/进行中/已完成/已取消 |
| priority | 单选 | ✓ | 优先级: P0/P1/P2/P3 |
| campaign_id | 关联 | | 关联活动 → campaigns |
| assignee | 人员 | ✓ | 执行人 |
| due_date | 日期 | ✓ | 截止日期 |
| estimated_hours | 数字 | | 预估工时 |
| actual_hours | 数字 | | 实际工时 |
| dependencies | 关联 | | 前置任务 → tasks(自关联) |
| skill_used | 关联 | | 使用技能 → skills_registry |
| description | 多行文本 | | 任务描述 |
| checklist | 多行文本 | | 检查清单(JSON) |
| result | 多行文本 | | 完成结果 |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📋 全部任务 | 表格 | - | due_date 升序 |
| 🔥 我的任务 | 表格 | assignee=当前用户, status≠已完成 | priority 升序 |
| ⚠️ 逾期任务 | 表格 | due_date<今天, status≠已完成 | due_date 升序 |
| 📊 看板 | 看板 | - | status |
| 📅 日历视图 | 日历 | - | due_date |

---

## 表5: analytics (数据指标)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 记录ID |
| date | 日期 | ✓ | 日期 |
| metric_category | 单选 | ✓ | 类别: 流量/转化/营收/广告/SEO/邮件/社交/产品 |
| metric_name | 文本 | ✓ | 指标名称: "organic_traffic" |
| metric_label | 文本 | ✓ | 指标标签: "自然流量" |
| metric_value | 数字 | ✓ | 指标值 |
| metric_unit | 单选 | | 单位: 次/人/元/%/个/封/条 |
| target_value | 数字 | | 目标值 |
| variance | 公式 | | 偏差 = metric_value - target_value |
| previous_value | 数字 | | 上期值 |
| growth_rate | 公式 | | 增长率 = (metric_value-previous_value)/previous_value*100% |
| campaign_id | 关联 | | 关联活动 → campaigns |
| source | 文本 | | 数据源: GA4/Google Ads/Facebook/邮件平台/CRM |
| notes | 多行文本 | | 备注 |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📊 全部数据 | 表格 | - | date 降序 |
| 📈 趋势视图 | 表格 | - | date 升序, metric_category 分组 |
| 🎯 KPI仪表盘 | 表格 | target_value>0 | metric_category 分组 |
| 📅 本月数据 | 表格 | date 本月 | metric_name |
| ⚠️ 异常指标 | 表格 | variance<0 | variance 升序 |

---

## 表6: skills_registry (技能注册表)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 技能ID |
| skill_name | 文本 | ✓ | 技能名称: "copywriting" |
| skill_label | 文本 | ✓ | 技能标签: "文案撰写" |
| category | 单选 | ✓ | 分类: content/advertising/seo/conversion/email/social/growth/analytics/strategy |
| triggers | 多行文本 | ✓ | 触发词(JSON数组) |
| description | 多行文本 | ✓ | 功能描述 |
| version | 文本 | ✓ | 版本号 |
| status | 单选 | ✓ | 状态: active/inactive/deprecated |
| priority_level | 单选 | ✓ | 优先级: P0核心/P1推荐/P2可选 |
| dependencies | 多选 | | 依赖的多维表 |
| api_dependencies | 多行文本 | | 依赖的外部API(JSON) |
| last_used | 日期 | | 最后使用日期 |
| usage_count | 数字 | | 使用次数 |
| avg_rating | 数字 | | 平均评分(1-5) |
| skill_file_path | 文本 | | 技能文件路径 |
| output_example | 多行文本 | | 输出示例 |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📋 全部技能 | 表格 | - | category, skill_name |
| ⭐ P0核心 | 表格 | priority_level=P0 | category |
| 📊 按分类 | 表格 | - | category 分组 |
| 🔥 高频使用 | 表格 | usage_count>10 | usage_count 降序 |
| 💤 未使用 | 表格 | last_used 为空 | skill_name |

---

## 表7: workflow_log (工作流日志)

### 字段定义

| 字段名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| _id | 自动编号 | ✓ | 日志ID |
| workflow_name | 文本 | ✓ | 工作流名称 |
| trigger_type | 单选 | ✓ | 触发类型: webhook/schedule/manual/record_change/button |
| status | 单选 | ✓ | 执行状态: success/failed/running/pending |
| start_time | 日期时间 | ✓ | 开始时间 |
| end_time | 日期时间 | | 结束时间 |
| duration_ms | 数字 | | 耗时(毫秒) |
| skill_used | 文本 | | 使用的技能名 |
| input_params | 多行文本 | | 输入参数(JSON) |
| output_result | 多行文本 | | 输出结果(JSON) |
| error_message | 多行文本 | | 错误信息 |
| campaign_id | 关联 | | 关联活动 → campaigns |
| task_id | 关联 | | 关联任务 → tasks |
| triggered_by | 人员 | | 触发人 |
| retry_count | 数字 | | 重试次数 |

### 视图配置

| 视图名 | 类型 | 过滤 | 排序 |
|--------|------|------|------|
| 📋 全部日志 | 表格 | - | start_time 降序 |
| ❌ 失败记录 | 表格 | status=failed | start_time 降序 |
| ⏱️ 慢查询 | 表格 | duration_ms>30000 | duration_ms 降序 |
| 📊 今日日志 | 表格 | start_time 今天 | start_time 降序 |
| 🔍 按工作流 | 表格 | - | workflow_name 分组 |
