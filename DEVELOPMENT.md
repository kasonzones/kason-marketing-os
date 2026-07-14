# Kason Marketing OS V3.0 — 开发规范

## 一、命名规范

### 文件命名
- 飞书技能: `{category}-{skill-name}.md` (全小写, 连字符分隔)
- 多维表配置: `{table-name}.json` (全小写, 下划线分隔)
- 工作流配置: `{flow-name}.yml` (全小写, 连字符分隔)
- API模块: `{module-name}.js` (全小写, 连字符分隔)

### 变量命名
- JavaScript: camelCase (`userName`, `campaignId`)
- JSON字段: snake_case (`campaign_id`, `lead_score`)
- 飞书字段: 中文命名 (`营销活动名称`, `线索评分`)

### 分支命名
```
feat/skill-name      # 新技能
fix/issue-description # Bug修复
docs/update-topic     # 文档更新
```

## 二、目录规范

```
每新增一个技能，需在 feishu/skills/{category}/ 下创建:
  - {skill-name}.md          # 技能指令文件
  - {skill-name}-config.json # 技能配置文件 (可选)

每新增一个集成，需在 api/integrations/ 下创建:
  - {platform-name}/
    - index.js               # 主模块
    - config.js              # 配置
    - types.js               # 类型定义
```

## 三、飞书技能开发规范

### 技能文件格式

每个技能必须包含以下部分:

```markdown
---
name: 技能名称
category: 技能分类
version: 版本号
triggers:
  - 触发词1
  - 触发词2
parameters:
  - name: 参数名
    type: string|number|boolean|array
    required: true|false
    description: 参数说明
output:
  format: text|table|card|file
  description: 输出说明
---

# 技能名称

## 功能描述
简要描述技能的功能和应用场景。

## 使用方法
- 触发方式: /命令 或 @机器人
- 输入格式: 参数说明
- 输出示例: 输出格式示例

## 执行流程
1. 步骤一: 描述
2. 步骤二: 描述
3. 步骤三: 描述

## 配置要求
- 必需的多维表: 列出依赖的数据表
- 必需的API: 列出依赖的外部API

## 注意事项
- 注意事项列表
```

### 技能分类标准

| 分类目录 | 涵盖技能 | 关键词 |
|---------|---------|--------|
| content | copywriting, copy-editing, content-strategy, programmatic-seo, free-tools, lead-magnets | 内容、文案、博客、落地页 |
| advertising | ads, ad-creative | 广告、投放、创意 |
| seo | seo-audit, ai-seo, schema, site-architecture, aso | SEO、搜索、排名、结构化数据 |
| conversion | cro, popups, signup, paywalls, offers | 转化、弹窗、注册、付费 |
| email | emails, cold-email, sms | 邮件、EDM、短信 |
| social | social, community-marketing | 社交、社区、LinkedIn |
| growth | marketing-loops, churn-prevention, referrals, onboarding, directory-submissions | 增长、流失、推荐、引导 |
| analytics | analytics, ab-testing, revops | 数据、分析、测试、营收 |
| strategy | marketing-plan, pricing, launch, competitor-profiling, customer-research, product-marketing, co-marketing, competitors, sales-enablement, marketing-ideas, marketing-psychology, prospecting, public-relations, marketing-council | 策略、规划、竞品、定价 |

## 四、多维表设计规范

### 字段命名
- 主键字段: `_id` (自动编号)
- 关联字段: `{关联表名}_id` (单向关联)
- 状态字段: `status` (单选, 统一枚举值)
- 时间字段: `created_at`, `updated_at` (日期时间)

### 统一状态枚举
```
DRAFT       # 草稿
IN_REVIEW   # 审核中
APPROVED    # 已通过
PUBLISHED   # 已发布
PAUSED      # 已暂停
COMPLETED   # 已完成
ARCHIVED    # 已归档
```

### 视图命名
```
全部数据     # 默认视图
进行中       # 过滤进行中的记录
本月         # 过滤本月记录
看板视图     # 按状态分组的看板
日历视图     # 按日期展示的日历
```

## 五、工作流规范

### 命名规则
```
{触发类型}-{业务场景}-{动作}
示例: webhook-content-publish, schedule-weekly-report
```

### 配置结构
```yaml
name: 工作流名称
trigger:
  type: webhook|schedule|record_change|button
  config:
    # 触发器配置
conditions:
  - field: 字段名
    operator: eq|ne|gt|lt|contains
    value: 值
actions:
  - type: send_message|update_record|create_record|call_api|run_skill
    config:
      # 动作配置
```

## 六、API 开发规范

### 统一响应格式
```json
{
  "code": 0,
  "message": "success",
  "data": {},
  "timestamp": 1234567890
}
```

### 错误码定义
```
0     - 成功
1001  - 参数错误
1002  - 认证失败
1003  - 权限不足
2001  - 数据不存在
2002  - 数据冲突
3001  - 外部API调用失败
5000  - 系统内部错误
```

### 请求日志
所有API调用必须记录到 workflow_log 多维表:
- 请求时间、API名称、请求参数
- 响应状态、耗时、错误信息

## 七、代码质量

### 必须遵守
1. 所有公开函数必须有 JSDoc 注释
2. 禁止硬编码凭证 (使用环境变量)
3. 每个模块必须有错误处理
4. 异步操作必须有超时控制 (默认30s)
5. 所有API调用必须重试机制 (最多3次)

### 测试要求
- 核心模块: 单元测试覆盖率 > 80%
- API对接: 集成测试
- 工作流: E2E测试

## 八、环境变量

```env
# 飞书
FEISHU_APP_ID=xxx
FEISHU_APP_SECRET=xxx
FEISHU_BITABLE_TOKEN=xxx
FEISHU_WEBHOOK_URL=xxx

# WordPress
WP_SITE_URL=https://yoursite.com
WP_USERNAME=xxx
WP_APP_PASSWORD=xxx

# 邮件
MAILCHIMP_API_KEY=xxx
RESEND_API_KEY=xxx

# 分析
GA4_PROPERTY_ID=xxx
GA4_MEASUREMENT_ID=xxx

# 广告
GOOGLE_ADS_CUSTOMER_ID=xxx
META_ACCESS_TOKEN=xxx

# AI
AI_MODEL=default
AI_TEMPERATURE=0.7
```

## 九、部署规范

### 开发环境
- 本地 Node.js 运行
- 飞书沙箱环境测试

### 生产环境
- 推荐: 云函数 (SCF/CloudBase) 或自有服务器
- 飞书正式应用
- 监控报警配置

### 发布流程
1. 代码审查 (Code Review)
2. 单元测试通过
3. 飞书沙箱验证
4. 发布上线
5. 飞书群通知

## 十、版本管理

遵循语义化版本: MAJOR.MINOR.PATCH
- MAJOR: 架构变更、不兼容的API修改
- MINOR: 新增技能/功能、向后兼容
- PATCH: Bug修复、性能优化
