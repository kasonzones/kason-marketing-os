---
name: gen-image
category: content
version: 1.0.0
triggers:
  - /生成图片
  - /gen-image
parameters:
  - name: image_type
    type: string
    required: true
    description: 图片类型
    enum:
      - blog-header
      - social-graphic
      - product-mockup
      - profile-banner
      - brand-asset
      - og-image
      - infographic
      - ad-creative
      - email-banner
      - presentation-slide
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: brand_colors
    type: object
    required: true
    description: 品牌色
    properties:
      primary:
        type: string
      secondary:
        type: string
      accent:
        type: string
      background:
        type: string
  - name: content_context
    type: string
    required: true
    description: 使用场景/上下文描述
  - name: style
    type: string
    required: false
    description: 视觉风格
    default: modern-clean
    enum:
      - modern-clean
      - tech-futuristic
      - industrial-bold
      - warm-natural
      - minimalist-luxury
      - corporate-professional
  - name: platform
    type: string
    required: false
    description: 发布平台（影响尺寸和风格）
  - name: dimensions
    type: string
    required: false
    description: 自定义尺寸 (W×H px)
  - name: copy_text
    type: string
    required: false
    description: 图片上需要展示的文字
output:
  type: object
  properties:
    image_spec:
      type: object
      properties:
        type:
          type: string
        dimensions:
          type: string
        format:
          type: string
        max_size:
          type: string
    design_brief:
      type: object
      properties:
        concept:
          type: string
        composition:
          type: string
        color_palette:
          type: array
        typography:
          type: object
        key_elements:
          type: array
    ai_prompt:
      type: object
      properties:
        prompt_v1:
          type: string
          description: 精准提示词
        prompt_v2:
          type: string
          description: 备选风格提示词
        negative_prompt:
          type: string
        seed_suggestions:
          type: array
    generation_settings:
      type: object
      properties:
        tool:
          type: string
        model:
          type: string
        aspect_ratio:
          type: string
        quality:
          type: string
    variants:
      type: array
      items:
        type: object
        properties:
          variant_name:
            type: string
          description:
            type: string
          prompt_modifier:
            type: string
    platform_adaptations:
      type: array
      items:
        type: object
        properties:
          platform:
            type: string
          dimensions:
            type: string
          crop_notes:
            type: string
    usage_guide:
      type: object
      properties:
        file_naming:
          type: string
        alt_text:
          type: string
        responsive_variants:
          type: array
---

# /生成图片 (gen-image)

## 功能描述

为营销场景生成AI图片的设计方案和提示词。覆盖博客头图、社交图、产品合成、个人页横幅、品牌资产、OG分享图等10种图片类型，输出精准的AI提示词、设计简报、多平台适配方案。

本技能的定位是 **创意总监 + 提示词工程师**：不直接生成图片（生成由AI模型完成），但确保每一张图的创意方向、视觉语言、品牌一致性都是对的。

---

## 图片类型与规格速览

| 类型 | 推荐尺寸 | 格式 | 用途 |
|------|----------|------|------|
| Blog Header | 2400×1260 | PNG/JPG | 博客文章头图 |
| Social Graphic | 1080×1080 / 1080×1350 | PNG | 社交媒体图文 |
| Product Mockup | 2400×1800 | PNG | 产品场景合成 |
| Profile Banner | 1500×500 / 1584×396 | PNG | 社媒个人页封面 |
| Brand Asset | 可缩放 | SVG/PNG | 品牌元素/图标 |
| OG Image | 1200×630 | JPG | 社交分享预览图 |
| Infographic | 800×2000+ | PNG | 信息图/长图 |
| Ad Creative | 1200×628 / 1080×1080 | JPG | 广告素材 |
| Email Banner | 600×300 | JPG/PNG | 邮件营销横幅 |
| Presentation Slide | 1920×1080 | PNG | 演示文稿页面 |

---

## 使用示例

### 示例 1：博客头图

```
/生成图片
image_type: blog-header
product_name: AutoWash Pro X1 全自动洗车机
brand_colors:
  primary: "#1A56DB"
  secondary: "#10B981"
  accent: "#F59E0B"
  background: "#F8FAFC"
content_context: 博客文章《2025年开一家全自动洗车店需要多少钱？完整成本拆解》
style: modern-clean
dimensions: 2400x1260
copy_text: "开一家洗车店要多少钱？\n2025完整成本拆解指南"
```

### 示例 2：社交图文（LinkedIn/朋友圈）

```
/生成图片
image_type: social-graphic
product_name: AutoWash Pro X1
brand_colors:
  primary: "#1A56DB"
  secondary: "#10B981"
  accent: "#F59E0B"
  background: "#F8FAFC"
content_context: 客户案例——某加油站安装AutoWash后月营收增长300%
platform: linkedin
copy_text: "从月亏2万到月赚15万\n这家加油站做对了什么？"
style: modern-clean
```

### 示例 3：产品场景合成图

```
/生成图片
image_type: product-mockup
product_name: AutoWash Pro X1
brand_colors:
  primary: "#1A56DB"
  secondary: "#10B981"
  accent: "#F59E0B"
  background: "#F8FAFC"
content_context: 产品官网首页Hero区域——展示AutoWash Pro X1在中东加油站安装的实景效果
style: industrial-bold
dimensions: 2400x1800
```

### 示例 4：OG分享图

```
/gen-image
image_type: og-image
product_name: AutoWash Pro X1
brand_colors:
  primary: "#1A56DB"
  secondary: "#10B981"
  accent: "#F59E0B"
  background: "#F8FAFC"
content_context: ROI计算器工具页面——"你的场地装洗车机能赚多少钱？"
copy_text: "3分钟算清你的洗车机回报率"
```

---

## 执行流程

### 第一步：场景分析与视觉策略

基于内容上下文和目标平台，确定视觉方向：

```
🎨 视觉策略卡 — Blog Header
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

文章主题: 开一家洗车店要多少钱？成本拆解
核心情绪: 信任感 + 数据驱动 + 专业但不冰冷
视觉方向: 现代简洁，信息图为灵感，财务感但不枯燥

要传达的潜意识信息:
  ✅ "这里有可靠的数据"
  ✅ "不忽悠，算给你看"
  ✅ "专业但易读"

要避免的:
  ❌ 过于冷冰冰的财务图表
  ❌ 花哨的营销感
  ❌ 与洗车行业无关的库存图
```

### 第二步：设计简报

产出详细的视觉设计指令：

```
📐 设计简报
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

构图方案:
  主视觉: 左侧60%——洗车机正面轮廓剪影/半透明叠在成本数据可视化图表上
  文字区: 右侧40%——标题左对齐，品牌色衬底
  装饰: 底部有细微的几何装饰线（呼应汽车轮廓）

配色方案:
  主色: #1A56DB (品牌蓝) — 标题、主CTA区域
  辅色: #10B981 (品牌绿) — 数据高亮
  点缀: #F59E0B (品牌金) — 关键数字强调
  底色: #F8FAFC (浅灰白) — 背景

字体:
  标题: 粗体无衬线，字号占画面高度 18-22%
  副标题: 常规无衬线，字号占 8-10%
  品牌名: 小号，左下角或右下角

关键元素:
  ├─ 洗车机轮廓剪影（产品识别）
  ├─ 数据图表元素（柱状图/数字强调）
  ├─ 硬币/金钱符号的抽象几何化
  └─ 品牌Logo + 产品名水印
```

### 第三步：AI提示词生成

输出精准的AI图像生成提示词，包含正反向提示词和多方案：

```
🤖 AI 提示词
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工具: Midjourney / DALL-E 3 / Stable Diffusion

[主推方案 Prompt v1 — Midjourney]
A modern clean blog header for a car wash business article, 2400x1260.
Left side: silhouette of an automatic car wash machine with subtle blue
geometric data visualization overlay. Right side: clean typography space
with deep blue (#1A56DB) accent block. Color palette: navy blue, emerald
green, gold accents on light grey-white background. Style: modern tech
corporate, infographic-inspired but not busy. Abstract coin/cost symbols
as subtle decorative elements. Professional, trustworthy, data-driven
vibe. --ar 2400:1260 --style raw --v 6.1

[备选方案 Prompt v2 — 更温暖风格]
An editorial illustration style blog header about car wash business costs.
A stylized isometric view of a gas station with a car wash bay, rendered
in warm modern flat illustration style. Soft gradients, human elements
(a small figure near the machine for scale). Text accommodation space
on right. Color palette: warm navy, soft green, golden yellow.
Friendly but professional tone. --ar 2400:1260 --style raw --v 6.1

[Negative Prompt]
photorealistic, stock photo look, cluttered, messy, low quality,
watermark, text elements in the image, busy background, cartoon style,
overly corporate, boring, generic blue tones only, washed out colors

[推荐 Seed]
--seed 28473 (已验证的构图平衡性好的种子)
```

### 第四步：多方案变体

生成 3-4 个差异化变体方案：

```
🎭 变体方案
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Variant A: "数据至上" (推荐)
  风格: 数据可视化主导，洗车机剪影为背景
  适合: 中文/英文博客，严肃内容
  
  Modifier: "increase data visualization prominence, add more chart
  elements, darker navy background, more corporate"

Variant B: "场景叙事"
  风格: 加油站实景插画风格，故事感
  适合: 社交媒体推广图文
  
  Modifier: "change to isometric gas station scene illustration,
  warm lighting, storytelling composition, softer edges"

Variant C: "极简主义"
  风格: 大量留白，单一焦点元素
  适合: 高端品牌形象，LinkedIn
  
  Modifier: "minimalist, lots of negative space, single hero element
  (car wash machine silhouette in gold on dark background), luxury feel"

Variant D: "移动优先"
  风格: 色彩块 + 大字排版，适合小屏幕
  适合: 手机端博客头图，公众号
  
  Modifier: "mobile-first composition, bold color blocks, large typography
  space, simplified design, single focus element"
```

### 第五步：多平台适配与交付

生成各平台的裁剪方案和元数据：

```
📱 多平台适配
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌──────────────┬──────────────┬──────────────────────┐
│ 平台/用途      │ 尺寸          │ 裁剪说明              │
├──────────────┼──────────────┼──────────────────────┤
│ 博客头图(原图) │ 2400×1260    │ 主输出，无裁剪         │
│ 公众号封面    │ 900×383      │ 居中裁剪，文字区保留   │
│ 公众号小图    │ 200×200      │ 品牌Logo区方形裁剪    │
│ LinkedIn     │ 1200×627     │ 16:9比例，左右构图可用 │
│ Twitter/X    │ 1600×900     │ 16:9，需检查文字区不被裁│
│ OG Image     │ 1200×630     │ 标准OG比例，标题区优先  │
└──────────────┴──────────────┴──────────────────────┘

交付文件命名:
  aw-pro-x1_blog-cost-breakdown_header_2400x1260_v1.png
  aw-pro-x1_blog-cost-breakdown_header_wechat_900x383_v1.png
  aw-pro-x1_blog-cost-breakdown_header_og_1200x630_v1.png

Alt Text:
  "AutoWash Pro X1全自动洗车机博客头图——2025年开洗车店成本拆解指南"
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/写文案` (write-copy) | 上游 | 文案输出后确定配图需求和文字内容 |
| `/内容策略` (content-strategy) | 上游 | 策略层确定视觉方向 |
| `/生成视频` (gen-video) | 平行 | 图片可用于视频封面/缩略图 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `brand_kit` | object | 是 | 品牌视觉规范（Logo/字体/色彩/图形元素） |
| `ai_image_tool` | object | 是 | AI图片生成工具配置（Midjourney/DALL-E/SD密钥） |
| `product_assets` | object | 否 | 产品图片素材库（产品多角度照片/3D模型） |
| `template_library` | object | 否 | 模板库（Canva/Figma模板链接） |
| `font_assets` | object | 否 | 品牌字体文件（用于图片中的文字叠加） |
