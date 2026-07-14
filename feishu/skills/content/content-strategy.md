---
name: content-strategy
category: content
version: 1.0.0
triggers:
  - /内容策略
  - /content-strategy
parameters:
  - name: industry
    type: string
    required: true
    description: 行业/赛道
  - name: product_category
    type: string
    required: true
    description: 产品类别
  - name: target_audiences
    type: array
    required: true
    description: 目标受众列表（含描述）
    items:
      type: object
      properties:
        segment:
          type: string
        description:
          type: string
        buyer_stage:
          type: string
          enum:
            - awareness
            - consideration
            - decision
            - retention
  - name: business_goals
    type: array
    required: true
    description: 业务目标列表
    items:
      type: string
  - name: current_channels
    type: array
    required: false
    description: 现有内容渠道
    items:
      type: string
  - name: competitor_content
    type: array
    required: false
    description: 竞品内容分析
    items:
      type: object
      properties:
        competitor:
          type: string
        content_strength:
          type: string
        content_gap:
          type: string
  - name: planning_period
    type: string
    required: false
    description: 策略规划周期
    default: quarterly
    enum:
      - monthly
      - quarterly
      - yearly
output:
  type: object
  properties:
    content_pillars:
      type: array
      items:
        type: object
        properties:
          pillar_name:
            type: string
          description:
            type: string
          pillar_ratio:
            type: string
          subtopics:
            type: array
    topic_clusters:
      type: array
      items:
        type: object
        properties:
          cluster_name:
            type: string
          pillar_content:
            type: string
          cluster_pages:
            type: array
          internal_links:
            type: array
    content_mix:
      type: object
      properties:
        searchable_ratio:
          type: number
        shareable_ratio:
          type: number
        content_types:
          type: array
    keyword_strategy:
      type: object
      properties:
        awareness_keywords:
          type: array
        consideration_keywords:
          type: array
        decision_keywords:
          type: array
    content_calendar:
      type: array
      items:
        type: object
        properties:
          week:
            type: string
          topic:
            type: string
          format:
            type: string
          channel:
            type: string
          goal:
            type: string
    gap_analysis:
      type: array
      items:
        type: object
        properties:
          gap_area:
            type: string
          competitor_coverage:
            type: string
          our_opportunity:
            type: string
          priority:
            type: string
---

# /内容策略 (content-strategy)

## 功能描述

为品牌制定系统化的内容营销策略，覆盖内容支柱规划、主题集群建设、可搜索 vs 可传播内容配比、购买阶段关键词研究四大核心模块。输出可直接落地的季度/年度内容日历和差距分析。

本技能解决的问题：不是"今天写什么"，而是"未来 90 天为什么写这些、写给谁看、看完之后他们做什么"。

---

## 核心概念

### 内容支柱 (Content Pillars)
品牌的 3-5 个核心内容主题方向，所有内容围绕支柱展开。每个支柱覆盖一个受众核心关注领域。

### 可搜索 vs 可传播 (Searchable vs Shareable)
- **可搜索内容**: SEO 驱动的常青内容，通过搜索获取流量（教程、指南、对比、百科）
- **可传播内容**: 社交驱动的爆款内容，通过分享获取流量（观点、故事、数据可视化、争议）

推荐配比：**70% 可搜索 + 30% 可传播**

---

## 使用示例

### 示例 1：全自动洗车机行业季度策略

```
/内容策略
industry: 洗车设备制造
product_category: 全自动洗车机（隧道式/往复式/无接触式）
target_audiences:
  - segment: 加油站运营商
    description: 拥有加油站资源，希望增加非油业务营收
    buyer_stage: awareness
  - segment: 洗车连锁品牌采购经理
    description: 大宗采购决策者，关注TCO和售后
    buyer_stage: consideration
  - segment: 物业/商业地产管理者
    description: 为停车场/商场配套洗车服务
    buyer_stage: awareness
business_goals:
  - 季度线索量提升 40%
  - 品牌在"全自动洗车机"搜索排名进入前3
  - 沉淀 3 个标杆客户案例
planning_period: quarterly
```

### 示例 2：年度内容策略 + 竞品分析

```
/内容策略
industry: 汽车后市场设备
product_category: 智能洗车系统
target_audiences:
  - segment: 海外经销商
    description: 中东/东南亚市场的洗车设备经销商
    buyer_stage: decision
  - segment: 国内加油站集团
    description: 中石化/中石油省级采购
    buyer_stage: consideration
business_goals:
  - 海外询盘量增长 100%
  - 国内KA客户签约 5 家
competitor_content:
  - competitor: WashTec
    content_strength: 技术白皮书深度强
    content_gap: 缺少中文内容，缺少中小客户案例
  - competitor: 国内品牌A
    content_strength: SEO 覆盖广
    content_gap: 内容质量低，以产品介绍为主
planning_period: yearly
```

---

## 执行流程

### 第一步：受众与内容需求映射

基于 `target_audiences` 构建内容需求矩阵：

```
🗺️ 受众内容需求矩阵
┌─────────────────────┬──────────────┬───────────────┬──────────────┐
│ 受众                 │ 意识阶段      │ 考虑阶段       │ 决策阶段      │
├─────────────────────┼──────────────┼───────────────┼──────────────┤
│ 加油站运营商         │ "洗车机能赚   │ "哪种洗车机    │ "AutoWash    │
│                     │  钱吗？"      │  适合我？"     │  值不值？"   │
│                     │ ROI计算器     │ 类型对比指南   │ 客户案例     │
│                     │ 行业白皮书    │ 选型检查清单    │ TCO计算器    │
├─────────────────────┼──────────────┼───────────────┼──────────────┤
│ 海外经销商           │ "中国洗车机   │ "AutoWash vs  │ "代理政策     │
│                     │  靠谱吗？"    │  WashTec？"    │  和利润？"   │
│                     │ 工厂参观视频  │ 对比白皮书     │ 代理计算器   │
│                     │ 认证与专利    │ 产品拆解视频   │ 经销商案例   │
└─────────────────────┴──────────────┴───────────────┴──────────────┘
```

### 第二步：内容支柱规划

定义 3-5 个内容支柱，确保每个支柱：

1. 覆盖一个独立的受众需求域
2. 有足够的内容深度（可衍生 10+ 篇内容）
3. 与业务目标直接相关
4. 在竞品内容中存在可攻击的空白

```
🏛️ 内容支柱规划 — 自动洗车机品牌
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  🅟 支柱1: ROI与投资回报 (30%)                                    │
│    洗车机能赚钱吗？多久回本？怎么算账？                            │
│    ├─ ROI 计算器                                                 │
│    ├─ 不同场景回本分析（加油站 vs 商场 vs 独立店）                 │
│    ├─ 客户真实营收数据（脱敏）                                    │
│    └─ 金融租赁方案解读                                            │
│                                                                  │
│  🅟 支柱2: 技术与品质 (25%)                                       │
│    为什么我们的洗车机更好？技术壁垒在哪里？                        │
│    ├─ 毛刷/水泵/风干技术拆解                                      │
│    ├─ 与竞品逐项对比                                              │
│    ├─ 工厂制造工艺展示                                            │
│    └─ 测试标准与认证                                              │
│                                                                  │
│  🅟 支柱3: 运营与增长 (25%)                                       │
│    买了之后怎么运营？怎么赚更多？                                  │
│    ├─ 洗车店运营指南                                              │
│    ├─ 会员卡/定价策略                                             │
│    ├─ 营销获客技巧                                                │
│    └─ 多站点管理经验                                              │
│                                                                  │
│  🅟 支柱4: 客户故事 (20%)                                         │
│    谁在用？用得怎么样？他们说好才算好。                            │
│    ├─ 标杆客户深度案例                                            │
│    ├─ ROI 追踪报告                                                │
│    ├─ 客户访谈视频/播客                                           │
│    └─ 安装日记系列                                                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

### 第三步：主题集群构建

为每个支柱构建"支柱页 + 集群页"的主题集群架构，设计内部链接关系：

```
🔗 主题集群: "自动洗车机选购指南" (Pillar Page)
│
├── 📄 隧道式 vs 往复式 vs 无接触式: 三种洗车机怎么选？
│   └── 链接回 Pillar Page
│
├── 📄 洗车机安装场地要求全解析 (4m×8m 就够了？)
│   └── 链接回 Pillar Page
│
├── 📄 2025年洗车机价格一览: 从8万到80万，差距在哪？
│   └── 链接回 Pillar Page
│
├── 📄 洗车机采购避坑指南: 6个行家不会告诉你的秘密
│   └── 链接回 Pillar Page
│
└── 📄 买了洗车机还需要什么配套设备？
    └── 链接回 Pillar Page
```

### 第四步：关键词与内容日历

基于购买阶段构建关键词矩阵，生成内容日历：

```
📅 Q3 内容日历 (月度片段)
┌────────┬──────────────────────────────┬────────────┬──────────┐
│ 周次    │ 主题                          │ 格式        │ 渠道      │
├────────┼──────────────────────────────┼────────────┼──────────┤
│ W1     │ 洗车机投资回报深度分析         │ 长文+计算器 │ 官网+SEO │
│ W2     │ "我的加油站靠洗车赚了100万"    │ 客户故事    │ 公众号    │
│ W3     │ 洗车机选购避坑指南             │ 清单体长文  │ 官网+SEO │
│ W4     │ 洗车行业的10个反直觉真相       │ 社交图文    │ 抖音/小红书│
└────────┴──────────────────────────────┴────────────┴──────────┘

🔑 关键词矩阵
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
意识阶段 (月搜索量):
  全自动洗车机  / 洗车机多少钱  / 开洗车店赚钱吗
  
考虑阶段:
  洗车机品牌排行  / 隧道洗车机缺点  / 洗车机场地要求
  
决策阶段:
  AutoWash价格  / AutoWash评价  / 洗车机厂家直销
```

### 第五步：差距分析与优先级排序

对比竞品内容覆盖，识别内容差距并排序：

```
🎯 内容差距分析
┌──────────────────────────┬──────────┬──────────┬──────────┐
│ 内容主题                  │ 竞品覆盖  │ 我们覆盖  │ 优先级    │
├──────────────────────────┼──────────┼──────────┼──────────┤
│ ROI 计算器                │ ❌ 无    │ ❌ 无    │ 🔴 极高  │
│ 安装场地要求指南           │ ⚠️ 薄弱 │ ❌ 无    │ 🔴 高    │
│ 客户真实营收案例           │ ✅ 有   │ ❌ 无    │ 🔴 极高  │
│ 技术白皮书                 │ ✅ 强   │ ⚠️ 薄弱 │ 🟡 中    │
│ 洗车机类型对比             │ ✅ 强   │ ❌ 无    │ 🔴 高    │
│ 售后服务政策详解           │ ⚠️ 薄弱 │ ⚠️ 薄弱 │ 🟡 中    │
│ 海外经销商FAQ              │ ❌ 无    │ ❌ 无    │ 🟢 低    │
└──────────────────────────┴──────────┴──────────┴──────────┘
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/写文案` (write-copy) | 下游 | 策略确定后撰写具体页面文案 |
| `/程序化SEO` (pseo-generate) | 下游 | 根据关键词策略批量生成SEO内容 |
| `/免费工具` (free-tool-plan) | 下游 | 内容策略中识别的工具类内容需求 |
| `/引导磁力` (lead-magnet) | 下游 | 内容策略中识别的下载类内容需求 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `seo_tool_api` | object | 是 | 关键词研究工具 API（Ahrefs/SEMrush/百度关键词规划师） |
| `analytics_data` | object | 否 | 历史内容表现数据（用于内容审计） |
| `competitor_urls` | array | 否 | 竞品网站 URL 列表（用于内容差距分析） |
| `brand_guidelines` | object | 否 | 品牌内容规范（主题偏好/禁区/风格） |
| `content_calendar_template` | object | 否 | 内容日历模板（按品牌定制） |
