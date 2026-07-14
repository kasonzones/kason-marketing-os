---
name: setup-analytics
category: analytics
version: 1.0.0
---

# /分析设置 (Setup Analytics)

> 📊 搭建或优化分析追踪体系，让数据成为你的增长导航仪

## 触发词

`/分析设置` `/setup-analytics`

## 功能概述

从零搭建或优化现有产品分析栈，覆盖数据采集层（GTM/代码埋点）、分析层（GA4/Mixpanel/Amplitude/PostHog/Segment），以及数据应用层（报表/归因/实验）。含标准化事件库和实施指南。

## 分析栈架构

```
                            ┌──────────────────────────┐
                            │     数据应用层              │
                            │  看板 · 报表 · 归因 · 实验   │
                            └────────────┬─────────────┘
                                         │
                            ┌────────────┴─────────────┐
                            │       分析引擎层            │
                            │  GA4 · Mixpanel · Amplitude│
                            │  PostHog · Segment (CDP)   │
                            └────────────┬─────────────┘
                                         │
                            ┌────────────┴─────────────┐
                            │       数据采集层            │
                            │  GTM · SDK · API · 代码埋点 │
                            └────────────┬─────────────┘
                                         │
                            ┌────────────┴─────────────┐
                            │       数据源层              │
                            │  Web · App · 后端 · 第三方   │
                            └──────────────────────────┘
```

## 工具选型指南

| 工具 | 类型 | 最适合 | 定价 | 隐私合规 |
|------|------|--------|------|---------|
| Google Analytics 4 (GA4) | 免费 Web/App 分析 | 通用网站 + 广告投放 | 免费 | 需配置同意 |
| Google Tag Manager (GTM) | 标签管理 | 所有网站 | 免费 | — |
| Mixpanel | 产品分析 | PLG SaaS | 免费-付费 | CCPA/GDPR |
| Amplitude | 产品分析 | 企业级 SaaS | 免费-付费 | SOC2/GDPR |
| Segment | CDP (客户数据平台) | 多工具集成 | 免费-付费 | 企业合规 |
| PostHog | 开源产品分析 | 自部署需求 | 免费/自托管 | 完全控制 |
| Plausible | 轻量隐私分析 | 个人/小团队 | 付费 | 无需 Cookie |
| Matomo | 开源分析 | 完全自控 | 免费/自托管 | 完全控制 |

## GTM + GA4 标准配置

### GTM 基础设置

```yaml
GTM 容器结构:
  ┌── 变量 (Variables):
  │   ├── 内置变量: Page URL, Click Text, Form ID...
  │   └── 自定义变量:
  │       ├── 用户属性: user_id, user_type, plan_tier
  │       ├── 页面属性: page_category, content_type
  │       └── 电商属性: product_id, price, currency
  │
  ├── 触发器 (Triggers):
  │   ├── Page View: All Pages
  │   ├── Click: CTA 按钮, 导航点击, 外链
  │   ├── Form Submit: 注册, 登录, 订阅
  │   ├── Scroll Depth: 25%/50%/75%/100%
  │   ├── Timer: 页面停留 30s/60s/120s
  │   ├── Video: YouTube 嵌入播放/完成
  │   └── Custom Event: 自定义数据层推送
  │
  └── 标签 (Tags):
      ├── GA4 Configuration (所有页面)
      ├── GA4 Events (关键行为)
      ├── 转化追踪 (Google Ads, Facebook Pixel)
      ├── 热力图 (Hotjar, Microsoft Clarity)
      └── 第三方 (Intercom, 在线客服, CRM)
```

### UTM 参数规范

```yaml
UTM 强制规范:
  utm_source:    # 流量来源（必填）
    规则: 统一小写，不允许缩写
    示例: google, facebook, linkedin, newsletter, reddit
    禁止: fb, li, nl, goog

  utm_medium:    # 流量媒介（必填）
    可选值:
      - organic      # 自然搜索
      - cpc          # 付费搜索
      - social       # 社交媒体（自然）
      - social-paid  # 社交媒体（付费）
      - email        # 邮件
      - referral     # 推荐/外链
      - display      # 展示广告
      - affiliate    # 联盟营销

  utm_campaign:  # 活动名称（必填）
    格式: [活动类型]_[目标]_[日期]
    示例: launch_ph_us_202608, blackfriday_saas_202611

  utm_content:   # 内容变体（选填，A/B 测试必填）
    格式: [元素]_[变体]
    示例: cta_variant_a, hero_image_v2, headline_control

  utm_term:      # 关键词（选填，付费搜索必填）
    示例: automatic+car+wash+machine

UTM 构建工具:
  链接模板: https://autowash.pro?utm_source={{source}}&utm_medium={{medium}}&utm_campaign={{campaign}}&utm_content={{content}}

反例警告:
  ❌ utm_source=FB              → ✅ utm_source=facebook
  ❌ utm_medium=social_media    → ✅ utm_medium=social
  ❌ utm_campaign=launch        → ✅ utm_campaign=launch_ph_us_202608
  ❌ 大小写混用: LinkedIn       → ✅ 全小写: linkedin
```

### 标准化事件库

```yaml
核心事件 (所有产品):

  # 用户获取
  page_view:                 # 页面浏览
  landing_page_view:         # 落地页浏览
  signup_start:              # 开始注册
  signup_complete:           # 注册完成
  signup_method:             # 注册方式 (email/google/apple)

  # 用户激活
  onboarding_start:          # 开始引导
  onboarding_step_complete:  # 完成引导步骤
  onboarding_complete:       # 引导完成
  activation_event:          # 激活事件（产品 Aha Moment）

  # 用户参与
  feature_used:              # 功能使用
  session_start:             # 会话开始
  session_end:               # 会话结束
  search_performed:          # 搜索行为
  content_viewed:            # 内容浏览

  # 转化/收入
  trial_started:             # 开始试用
  subscription_started:      # 开始订阅
  subscription_cancelled:    # 取消订阅
  plan_upgraded:             # 套餐升级
  plan_downgraded:           # 套餐降级
  purchase_completed:        # 购买完成

  # 推荐/传播
  invite_sent:               # 发送邀请
  invite_accepted:           # 邀请被接受
  referral_link_copied:      # 复制推荐链接

事件参数规范:
  所有事件必须包含:
    - event_name: 事件名称（snake_case）
    - timestamp: 时间戳（ISO 8601）
    - user_id: 用户唯一标识
    - session_id: 会话标识
    - page_url: 当前页面 URL
    - user_agent: 浏览器/设备信息

  特定事件可选参数:
    - feature_name: 功能名称
    - plan_tier: 套餐等级
    - revenue: 收入金额
    - currency: 货币类型
    - source: 来源渠道
```

## Mixpanel / Amplitude 专业配置

### Mixpanel 最佳配置

```yaml
Mixpanel 数据结构:
  事件 (Events):
    命名: [对象]_[动作] (如 project_created, report_downloaded)
    属性 (Properties):
      - 必须: user_id, timestamp, platform, version
      - 业务: plan, team_size, feature_name
      - 营销: utm_source, utm_medium, utm_campaign

  用户画像 (User Profiles):
    核心属性:
      - $email
      - $name
      - $created
      - signup_date
      - plan_tier
      - company_name
      - industry
      - country
      - lifetime_revenue

  群组 (Cohorts):
    关键群组:
      - 新注册用户 (7/14/30 天)
      - 激活用户
      - 付费用户
      - 流失用户
      - 高价值用户 (Top 20%)
      - 功能采纳者 (按功能)

  看板 (Boards):
    必备看板:
      1. 增长指标: DAU/WAU/MAU, 新增/留存/流失
      2. 激活漏斗: 注册 → 引导 → 激活 → 付费
      3. 功能采用: 功能使用率排行
      4. 收入分析: MRR/ARR, ARPU, LTV
      5. 渠道归因: 各渠道用户质量对比

Mixpanel vs GA4 分工:
  GA4: SEO 分析 + 广告效果 + 页面分析
  Mixpanel: 用户行为 + 产品分析 + 留存/流失
```

### Segment CDP 集成

```yaml
Segment 作为数据中心:

  工作原理:
    代码/SDK → Segment → 下游工具
    (一次埋点)            (同时发送到多个工具)

  标准连接:
    Source: Web (analytics.js)
    Destinations:
      - Google Analytics 4
      - Mixpanel
      - Amplitude
      - Facebook Pixel
      - Google Ads
      - Intercom
      - HubSpot
      - Redshift / Snowflake (数据仓库)

  Identify 调用规范:
    用户登录后立即调用:
    analytics.identify(userId, {
      email: user.email,
      name: user.name,
      plan: user.plan,
      company: user.company,
      createdAt: user.createdAt
    });

  Track 调用规范:
    关键行为:
    analytics.track('Subscription Started', {
      plan: 'pro',
      revenue: 49,
      currency: 'USD',
      interval: 'monthly',
      coupon: 'LAUNCH20'
    });

  Group 调用规范:
    B2B 产品必须使用:
    analytics.group(companyId, {
      name: company.name,
      industry: company.industry,
      size: company.employeeCount,
      plan: company.plan
    });
```

## PostHog 自托管方案

```yaml
PostHog 配置:
  部署方式:
    - PostHog Cloud (免费 100 万事件/月)
    - 自托管 (Docker/K8s，完全数据控制)

  独有功能:
    - 🔥 功能开关 (Feature Flags)
    - 📊 漏斗分析
    - 🎬 会话录制 (Session Recording)
    - 🧪 A/B 测试
    - 📈 趋势分析
    - 🗺️ 用户路径分析
    - 🏷️ 群组分析

  适合场景:
    - 预算有限但需要完整产品分析能力
    - 数据隐私要求高（GDPR/HIPAA）
    - 需要功能开关 + 分析一体化
    - 开源社区/开发者优先产品
```

## AutoWash Pro X1 示例

### 示例 1：AutoWash 云平台分析实施

```yaml
项目: AutoWash Pro X1 云管理平台
阶段: 从零搭建分析体系

技术栈选择:
  理由: SaaS + IoT 硬件混合产品
  分析栈:
    - GTM → GA4 (网站 + Web App 前端分析)
    - Segment → Mixpanel (用户行为 + 产品分析)
    - PostHog 自托管 (设备端事件 + 功能开关)
    - Metabase (BI 看板，连接数据仓库)

实施步骤:

Phase 1 — 基础设置 (Week 1):
  ✅ 创建 GTM 容器
  ✅ 创建 GA4 数据流
  ✅ 安装基础 GA4 标签 (Page View)
  ✅ 配置 UTM 强制规范 + 自动化检测脚本
  ✅ 创建 Segment Workspace
  ✅ 安装 Segment Web SDK

Phase 2 — 核心事件 (Week 2):
  用户获取事件:
    - landing_page_view (按 landing_page 类型)
    - signup_start (按 utm 来源)
    - demo_requested (预约演示)
    - signup_complete (注册完成)

  设备连接事件 (IoT 独有):
    - device_scan_started (开始扫描二维码)
    - device_connected (设备连接成功)
    - device_first_wash (设备首次洗车) ← Aha Moment!
    - device_offline (设备离线告警)

  运营事件:
    - wash_started (洗车开始，含车牌/车型/套餐)
    - wash_completed (洗车完成，含时长/用水量)
    - payment_received (收款，含金额/支付方式)
    - subscription_started (订阅开始)
    - report_viewed (查看报表)

Phase 3 — 看板搭建 (Week 3):
  GA4 看板:
    - 流量渠道分析 → 优化投放预算
    - 落地页转化率 → A/B 测试落地页
    - 用户地理位置 → 确定下一个目标市场

  Mixpanel 看板:
    - 激活漏斗: 注册 → 连接设备 → 首次洗车 → Day 7 留存
    - 设备健康: 在线率 → 故障率 → 响应时间
    - 使用行为: 功能使用热力图 → 产品迭代优先级
    - 订阅分析: 套餐分布 → 升级/降级流 → ARPU

  Metabase BI 看板:
    - 收入报表: 按地区/设备/时间
    - 设备利用率: 洗车次数/小时
    - 客户健康度: 综合评分 → 流失预警
    - 零部件寿命: 预测性维护提示

Phase 4 — 进阶 (Ongoing):
  - 用户分群: 高/中/低活跃用户
  - 异常检测: 设备异常自动告警
  - 归因模型: 多触点归因 → 优化渠道预算
  - 预测模型: LTV 预测 → 流失概率预测
```

### 示例 2：事件库——AutoWash 定制事件

```yaml
设备管理事件:
  device_registered:
    properties:
      - device_id (string)
      - device_model: "Pro X1"
      - firmware_version: "2.4.1"
      - location (string)
      - installation_date (date)
    trigger: 新设备上线

  device_status_changed:
    properties:
      - device_id
      - previous_status
      - new_status: online/offline/maintenance/error
      - error_code (if error)
    trigger: 设备状态变更

  maintenance_alert:
    properties:
      - device_id
      - alert_type: filter_change/oil_refill/part_wear
      - severity: low/medium/high/critical
      - estimated_parts_replaced (int)
    trigger: 预测性维护提醒

洗车服务事件:
  wash_session_started:
    properties:
      - device_id
      - wash_package: standard/premium/ultimate
      - vehicle_type: sedan/suv/truck
      - payment_method: cash/card/app/membership
      - estimated_duration (seconds)
    trigger: 洗车开始

  wash_session_completed:
    properties:
      - device_id
      - session_id
      - actual_duration (seconds)
      - water_consumed (liters)
      - energy_consumed (kWh)
      - was_successful: true/false
      - failure_reason (if failed)
    trigger: 洗车完成

  revenue_recorded:
    properties:
      - device_id
      - session_id
      - amount
      - currency
      - payment_method
      - is_member: true/false
    trigger: 收款完成

用户行为事件:
  member_card_created:
    properties:
      - card_type: monthly/quarterly/annual
      - amount_paid
      - auto_renew: true/false
    trigger: 会员卡开卡

  chemical_refill_ordered:
    properties:
      - device_id
      - product_sku
      - quantity
      - order_value
    trigger: 耗材订购

  service_requested:
    properties:
      - device_id
      - request_type: maintenance/repair/consultation
      - priority: normal/urgent
    trigger: 提交服务请求
```

---

> 📊 **原则**: 先埋点，后分析；先定义，后度量。没有数据的产品优化是盲飞——你可以凭直觉起飞，但需要数据仪表盘来安全着陆。
