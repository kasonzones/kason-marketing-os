---
name: write-copy
category: content
version: 1.0.0
triggers:
  - /写文案
  - /write-copy
parameters:
  - name: page_type
    type: string
    required: true
    description: 页面类型（首页/落地页/定价页/功能页）
    enum:
      - homepage
      - landing-page
      - pricing-page
      - feature-page
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: target_audience
    type: string
    required: true
    description: 目标受众描述
  - name: core_benefits
    type: array
    required: true
    description: 核心卖点列表
    items:
      type: string
  - name: tone
    type: string
    required: false
    description: 文案风格（专业/活泼/极简/情感化）
    default: professional
    enum:
      - professional
      - playful
      - minimal
      - emotional
  - name: language
    type: string
    required: false
    description: 输出语言
    default: zh-CN
  - name: competitor_references
    type: array
    required: false
    description: 竞品参考（用于差异化定位）
    items:
      type: string
output:
  type: object
  properties:
    hero_section:
      type: object
      properties:
        headline:
          type: string
        subheadline:
          type: string
        cta_primary:
          type: string
        cta_secondary:
          type: string
        social_proof_badge:
          type: string
    value_proposition:
      type: array
      items:
        type: object
        properties:
          benefit:
            type: string
          feature:
            type: string
          proof_point:
            type: string
    sections:
      type: array
      items:
        type: object
        properties:
          section_name:
            type: string
          headline:
            type: string
          body:
            type: string
          visual_suggestion:
            type: string
    pricing_section:
      type: object
      properties:
        strategy:
          type: string
        tiers:
          type: array
        anchor_note:
          type: string
      condition: page_type == "pricing-page"
    feature_block:
      type: array
      items:
        type: object
        properties:
          feature_name:
            type: string
          description:
            type: string
          icon_suggestion:
            type: string
          benefit_tag:
            type: string
      condition: page_type == "feature-page"
    alternatives:
      type: array
      items:
        type: object
        properties:
          section:
            type: string
          variant:
            type: string
          note:
            type: string
    meta_content:
      type: object
      properties:
        title_tag:
          type: string
        meta_description:
          type: string
        og_title:
          type: string
        og_description:
          type: string
    readability_score:
      type: string
      description: 可读性评分及建议
---

# /写文案 (write-copy)

## 功能描述

面向营销页面的专业文案生成技能。严格遵循 **清晰度 > 巧妙度**、**好处 > 功能** 两大核心原则，为不同页面类型输出结构化文案方案，包含多版本备选和元内容。

本技能适用于需要快速产出高质量营销文案的场景——首页的金句标语、落地页的转化引导、定价页的价值锚定、功能页的特性说明，均可一键生成。

---

## 使用示例

### 示例 1：生成产品首页文案

```
/写文案
page_type: homepage
product_name: AutoWash Pro X1 全自动洗车机
target_audience: 加油站/停车场运营商，关注效率和投资回报率
core_benefits:
  - 3分钟完成一辆车，支持24小时无人值守
  - 水电消耗比传统洗车降低40%
  - 月营收可达8-15万元
  - 德国进口毛刷，不伤车漆
tone: professional
```

### 示例 2：生成定价页文案

```
/写文案
page_type: pricing-page
product_name: AutoWash Pro X1
target_audience: 中小型加油站老板，预算敏感但重视品质
core_benefits:
  - 设备终身免费软件升级
  - 1年整机保修 + 48小时上门维修
  - 提供0首付金融租赁方案
language: zh-CN
```

### 示例 3：生成功能页文案（英文）

```
/write-copy
page_type: feature-page
product_name: AutoWash Pro X1
target_audience: International car wash distributors
core_benefits:
  - Brushless touch-free technology
  - IoT remote monitoring dashboard
  - 15,000+ washes per year capacity
language: en
tone: professional
```

---

## 执行流程

### 第一步：需求拆解与受众画像

解析 `page_type`、`product_name`、`target_audience` 参数，构建受众画像卡片。

- 提炼受众的核心痛点（3-5条）
- 提炼受众的决策驱动因素（价格/效率/品质/服务）
- 确定信息层级：最想传达的 1 件事 → 支撑论据 → 行动号召

```
🎯 受众画像：中小加油站老板
  └─ 痛点：洗车业务人力成本高、设备故障率高、客户投诉多
  └─ 驱动：投资回收周期 < 12个月、运营省心、差异化竞争
  └─ 核心信息：AutoWash Pro X1 = 最低风险的洗车自动化投资
```

### 第二步：核心信息架构

基于 **好处 > 功能** 原则，将每个 `core_benefits` 转化为"好处陈述"：

| 功能 (Feature) | 好处 (Benefit) | 证明点 (Proof) |
|---|---|---|
| 3分钟/车，24h无人值守 | 老板睡大觉，机器自己赚钱 | 实测数据：日均洗车80-120辆 |
| 水电节省40% | 每洗一辆车多赚6块钱 | 第三方能耗检测报告 |
| 德国进口毛刷 | 零刮痕投诉，客户复购率↑30% | TÜV认证 + 1000+安装案例 |

根据 `page_type` 确定信息架构：
- **homepage**: 品牌主张 → 核心价值 → 社会证明 → 行动号召
- **landing-page**: 痛点共鸣 → 解决方案 → 功能支撑 → 紧迫感 → 行动号召
- **pricing-page**: 价值锚定 → 套餐对比 → 消除顾虑 → 行动号召
- **feature-page**: 特性分类 → 逐一展开 → 使用场景 → 行动号召

### 第三步：分模块撰写

按页面类型逐模块生成文案，每个模块提供：

1. **主推版本** — 经过精炼的推荐文案
2. **备选版本** — 不同角度/风格的替代方案
3. **视觉建议** — 配图/图标/排版建议

```
📝 Hero Section — 主推版本
  标题: 3分钟洗一辆车，24小时自己赚钱
  副标题: AutoWash Pro X1 全自动洗车机 · 让你的加油站多一条印钞线
  CTA: 🔘 获取投资回报测算 →  🔘 预约实地考察
  社会证明: 已服务全球 1,200+ 站点 · 平均 7.3 个月回本

  📋 备选版本 A (数据驱动):
  标题: ROI 189% — 为什么1,200家加油站选择了AutoWash
  ...

  📋 备选版本 B (情感共鸣):
  标题: 不再为招不到洗车工发愁
  ...
```

### 第四步：可读性审查

对输出文案执行可读性检查：

- 标题字数 ≤ 20字（中文）/ 12词（英文）
- 段落 ≤ 3句话
- 避免行业黑话和模糊形容词（"卓越"、"领先"、"一流"）
- 每 150 字至少包含一个具体数字或事实
- 检查行动号召是否明确、可量化

```
✅ 可读性审查通过
  ├─ 标题字数: 16字 ✓
  ├─ 平均段落长度: 2.1句 ✓
  ├─ 具体数据密度: 7个数字/500字 ✓
  └─ 行动号召明确性: 高（"立即获取投资回报测算"） ✓
```

### 第五步：元内容打包

生成完整的 SEO 元数据和交付清单：

```
📦 输出清单
  ├─ 页面文案完整版 (Markdown)
  ├─ 备选方案集 (2-3套)
  ├─ SEO 元数据 (Title / Description / OG)
  ├─ 视觉建议文档
  └─ A/B测试建议（推荐先测哪些变量）
```

---

## 输出示例

```
╔══════════════════════════════════════════╗
║     AutoWash Pro X1 首页文案方案         ║
╚══════════════════════════════════════════╝

🎯 HERO SECTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
标题: 不是每台洗车机，都能让你睡着觉赚钱

副标题: AutoWash Pro X1 · 3分钟全自动洗车 · 24小时无人值守 · 日均营收 2,400元+

[ 获取专属投资回报测算 ]  [ 预约实地考察 ]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💎 VALUE PROPOSITIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┌─────────────────────────────────────────┐
│ ⚡ 快的不只是洗车，是回本速度            │
│ 3分钟/辆 ≠ 快                          │
│ 3分钟/辆 = 日均120辆 × 365天           │
│           = 年营收 87.6万               │
│           = 平均 7.3个月收回全部投资     │
│ → 查看 1,200+ 站点真实回本数据          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 💧 洗得干净不算本事，省出来的才是利润    │
│ 传统洗车: 水费占营收 18%               │
│ AutoWash: 水费占营收 6%                │
│ 每洗一辆车，多赚 6.8 元                 │
│ 按日均100辆算 → 一年多赚 24.8万         │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ 🇩🇪 德国毛刷的秘密：零投诉不是运气       │
│ B2级杜邦丝 + 智能压力感应              │
│ 压力>3.5kg自动抬起 → 永不伤漆          │
│ → 观看 200万次高压水流测试视频          │
└─────────────────────────────────────────┘

🏆 SOCIAL PROOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"装了AutoWash之后，洗车业务从成本中心变成了利润中心。
 去年光洗车这一项净赚了97万。" —— 山东中石化某站

 1,200+  站点正在使用   |   99.7%  正常运行时间   |   4.9/5  客户满意度

📋 SEO META
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title: AutoWash Pro X1 全自动洗车机 | 3分钟无人值守智能洗车
Meta: AutoWash Pro X1全自动洗车机，3分钟完成一辆车，24小时无人值守。德国进口毛刷不伤车漆，水电节省40%，平均7.3个月回本。1,200+站点验证。
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/编辑文案` (edit-copy) | 下游 | 文案产出后可送编辑审查优化 |
| `/内容策略` (content-strategy) | 上游 | 确定内容策略后再撰写具体页面文案 |
| `/生成图片` (gen-image) | 下游 | 文案中的视觉建议可用于图片生成 |
| `/程序化SEO` (pseo-generate) | 平行 | 大规模落地页批量生成场景 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `brand_voice_guide` | object | 否 | 品牌语调指南（禁用词、偏好表达、品牌人设） |
| `competitor_swipe_file` | array | 否 | 竞品文案参考库 |
| `copy_templates` | object | 否 | 预置文案模板（按行业/页面类型） |
| `ai_model` | string | 否 | 默认文案生成模型（推荐 Claude 或 GPT-4 级别） |
