---
name: gen-video
category: content
version: 1.0.0
triggers:
  - /生成视频
  - /gen-video
parameters:
  - name: video_type
    type: string
    required: true
    description: 视频类型
    enum:
      - product-demo
      - customer-testimonial
      - explainer
      - social-short
      - tutorial
      - brand-story
      - comparison
      - factory-tour
      - event-highlight
      - ad-spot
  - name: approach
    type: string
    required: true
    description: 制作方式
    enum:
      - coded
      - ai-generated
      - ai-avatar
      - editing-repurpose
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: target_audience
    type: string
    required: true
    description: 目标受众
  - name: core_message
    type: string
    required: true
    description: 核心传达信息
  - name: duration
    type: string
    required: false
    description: 目标时长
    default: "60s"
  - name: platform
    type: string
    required: false
    description: 发布平台
    default: multi-platform
  - name: source_material
    type: string
    required: false
    description: 已有素材（editing-repurpose模式必填）
  - name: language
    type: string
    required: false
    description: 视频语言
    default: zh-CN
output:
  type: object
  properties:
    creative_brief:
      type: object
      properties:
        hook:
          type: string
        story_arc:
          type: string
        key_frames:
          type: array
        emotional_target:
          type: string
    script:
      type: object
      properties:
        scenes:
          type: array
        voiceover:
          type: string
        text_overlays:
          type: array
        total_duration:
          type: string
    approach_spec:
      type: object
      properties:
        selected_approach:
          type: string
        rationale:
          type: string
        tools:
          type: array
        cost_estimate:
          type: string
        production_timeline:
          type: string
    technical_spec:
      type: object
      properties:
        resolution:
          type: string
        aspect_ratio:
          type: string
        frame_rate:
          type: string
        audio_spec:
          type: string
    ai_prompt:
      type: object
      properties:
        scene_prompts:
          type: array
        style_reference:
          type: string
        negative_prompt:
          type: string
      condition: approach == "ai-generated"
    code_snippet:
      type: string
      description: 代码片段（Remotion/Hyperframes）
      condition: approach == "coded"
    cta_design:
      type: object
      properties:
        type:
          type: string
        placement:
          type: string
        copy:
          type: string
    platform_variants:
      type: array
      items:
        type: object
        properties:
          platform:
            type: string
          duration:
            type: string
          aspect_ratio:
            type: string
          edit_notes:
            type: string
    distribution_plan:
      type: object
      properties:
        channels:
          type: array
        schedule:
          type: string
        thumbnail_suggestions:
          type: array
---

# /生成视频 (gen-video)

## 功能描述

为营销视频提供完整的制作方案。覆盖四种制作方式：代码驱动（Remotion/Hyperframes）、AI生成（Veo/Sora/Runway）、AI数字人（HeyGen/Synthesia/D-ID）、剪辑再创作（Descript/CapCut），根据视频类型和目标输出从创意脚本到技术方案的全链路设计。

本技能是 **制片人 + 编剧 + 技术顾问** 的结合体：帮你选对制作方式、写好脚本、给出精准的AI提示词或代码片段。

---

## 四种制作方式速览

| 方式 | 适用场景 | 成本 | 周期 | 灵活性 |
|------|----------|------|------|--------|
| **Coded** 代码驱动 | 数据可视化、产品演示、可复制系列 | 低（边际成本） | 1-3天初始 + 分钟级迭代 | 极高 |
| **AI Generated** AI生成 | 概念视频、创意短片、快速原型 | 中 | 几小时-2天 | 高（提示词迭代） |
| **AI Avatar** AI数字人 | 培训视频、FAQ、多语言版本 | 中 | 几小时 | 中（脚本驱动） |
| **Editing/Repurpose** 剪辑再创作 | 长内容切短、多平台分发 | 低 | 几小时-1天 | 高 |

---

## 使用示例

### 示例 1：产品演示视频（代码驱动）

```
/生成视频
video_type: product-demo
approach: coded
product_name: AutoWash Pro X1 全自动洗车机
target_audience: 海外经销商
core_message: AutoWash Pro X1的3大技术革新——智能水循环、德国毛刷、IoT远程管理
duration: "90s"
language: en
```

### 示例 2：社交媒体短视频（AI生成）

```
/生成视频
video_type: social-short
approach: ai-generated
product_name: AutoWash Pro X1
target_audience: 抖音/快手用户——中小商户老板
core_message: 一台机器=一个员工，不请假不离职不涨工资
duration: "30s"
platform: douyin
```

### 示例 3：客户见证视频（AI数字人）

```
/生成视频
video_type: customer-testimonial
approach: ai-avatar
product_name: AutoWash Pro X1
target_audience: 考虑采购的加油站集团决策层
core_message: 真实加油站老板讲述：装了AutoWash半年，洗车营收97万
duration: "120s"
language: zh-CN
```

### 示例 4：长视频剪辑再创作

```
/生成视频
video_type: social-short
approach: editing-repurpose
product_name: AutoWash Pro X1
target_audience: 小红书/抖音用户
core_message: 从工厂到加油站——一台洗车机的诞生之旅
source_material: 工厂参观30分钟纪录片素材
duration: "60s"
platform: xiaohongshu
```

---

## 执行流程

### 第一步：创意简报

确定视频的核心创意框架：

```
🎬 创意简报 — AutoWash Pro X1 产品演示视频
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Hook (前3秒抓住注意力):
  "一台洗车机一年能赚多少钱？答案是：87万。"

故事弧线 [0:00 → 1:30]:
  开篇 [0:00-0:08]: Hook — 震撼数字 + 快节奏剪辑
  问题 [0:08-0:20]: 传统洗车的三大痛点（人工贵/效率低/投诉多）
  方案 [0:20-0:45]: AutoWash Pro X1 — 3大技术革新逐一展示
    ├─ 智能水循环: 水流对比动画
    ├─ 德国毛刷: 微距慢镜头
    └─ IoT管理: 手机屏幕录制
  证明 [0:45-1:05]: 真实数据 + 客户证言（快速切换画面）
  行动 [1:05-1:15]: 清晰的下一步指引
  品牌 [1:15-1:30]: Logo展示 + 品牌标语

情绪目标:
  开篇: 惊讶 → 中间: 信任 → 结尾: 冲动（"我也想要"）

关键帧清单:
  ① 震撼数字全屏大字 "¥870,000"
  ② 水流对比分屏动画
  ③ 毛刷微距慢镜头（120fps）
  ④ 手机屏幕IoT仪表盘录屏
  ⑤ 多站点营收数据微动图表
  ⑥ 品牌Logo + CTA
```

### 第二步：脚本撰写

以场景为单位撰写完整脚本：

```
📜 完整脚本 (90秒)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scene 1 [0:00-0:08] HOOK
  画面: 全屏大字 "¥870,000" 从模糊到清晰，背景是洗车机运转的模糊影像
  旁白: "一年87万——这是AutoWash Pro X1给一家普通加油站带来的额外收入。"
  字幕: ¥870,000 | 年营收数据来自真实站点

Scene 2 [0:08-0:20] 痛点
  画面: 快速剪辑——人工洗车场景（慢/累/脏），叠红色滤镜
  旁白: "传统洗车：人工贵、效率低、客户永远在催。"
  文字叠层: 人工成本占营收45% | 高峰期排队1小时 | 差评3.2分

Scene 3 [0:20-0:35] 革新1 — 智能水循环
  画面: 3D水流循环动画，蓝色水流在管道中循环，标注"节省40%"
  旁白: "革新一：智能水循环系统。水不是用完就排掉的——"
  文字叠层: 每车节水120L | 年省水费2.4万+

Scene 4 [0:35-0:50] 革新2 — 德国毛刷
  画面: 超慢镜头——毛刷与车漆接触的瞬间，柔软弯曲但有效清洁
  旁白: "革新二：德国B2级杜邦丝毛刷。软到不伤车漆，硬到洗得干净。"
  文字叠层: TÜV认证 | 零刮痕投诉 | 50,000次耐久测试

Scene 5 [0:50-1:05] 革新3 — IoT远程管理
  画面: 手机屏幕录制——点开App，实时数据面板，一键故障诊断
  旁白: "革新三：躺着管。手机上看营收、故障预警、远程重启——"
  文字叠层: 远程诊断 | 营收实时看板 | 多站点一键管理

Scene 6 [1:05-1:15] 社会证明 + CTA
  画面: 快速切换多个加油站站点实拍 + 老板笑脸（或用数据卡片代替）
  旁白: "全球1,200+站点已上线。平均7.3个月回本。"
  文字叠层: 1,200+ 站点 | 99.7% 正常运行 | 4.9/5 满意度

Scene 7 [1:15-1:30] 品牌结尾
  画面: AutoWash Logo 渐显 + 品牌色背景
  旁白: "AutoWash Pro X1。让机器替你赚钱。"
  文字叠层: 官网链接 | 预约演示 | 400电话
  CTA: "👇 点击下方链接，获取你的专属回本测算"
```

### 第三步：制作方式方案

根据选择的 `approach` 输出具体的制作方案：

```
⚙️ 制作方案 — coded 方式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

选择理由:
  ✅ 产品演示需要精确控制每帧画面
  ✅ 数据可视化需要编程实现（动效图表）
  ✅ 制作成模板后可快速本地化（多语言/多产品线）
  ✅ 边际成本趋近于零（改参数重新渲染即可）

推荐工具栈:
  ├─ 渲染引擎: Remotion (React-based)
  ├─ 动画库: Framer Motion / GSAP
  ├─ 3D场景: Three.js / R3F (如果需要3D产品展示)
  ├─ 图表: Nivo / D3.js
  └─ 音频: 后期在 DaVinci Resolve / Premiere 添加

成本估算: 初始开发 3-5 天，之后每次迭代 < 1 小时
制作周期: 7 天（含2轮修改）

技术规格:
  分辨率: 1920×1080 (横版) + 1080×1920 (竖版)
  帧率: 30fps
  编码: H.265 / ProRes 422
  音频: 48kHz, 16bit, 立体声
```

```
🤖 制作方案 — ai-generated 方式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

选择理由:
  ✅ 短视频追求视觉新颖感
  ✅ 不需要精确的产品操作演示
  ✅ 快速试错，大量迭代
  ✅ 适合社交媒体传播

推荐工具:
  ├─ 主生成器: Runway Gen-3 / Kling / Sora
  ├─ 辅助: Midjourney → Runway 图生视频（场景建立）
  ├─ 剪辑: CapCut / DaVinci Resolve
  └─ 音乐: Suno / Udio (AI生成BGM)

场景提示词:

Scene 1 — Hook "¥870,000":
  Cinematic close-up of glowing golden numbers "870,000" floating
  above a modern automatic car wash machine in operation, blue ambient
  lighting, particles of water spray catching light, sleek futuristic
  industrial aesthetic, 4K, shallow depth of field --ar 9:16

Scene 3 — 智能水循环:
  Abstract 3D animation of water flowing in a closed loop system,
  crystal clear blue water, energy efficiency visualization, clean
  modern tech aesthetic, smooth looping motion, volumetric lighting --ar 9:16

Scene 4 — 德国毛刷:
  Extreme macro slow motion of soft microfiber brush filaments gently
  touching a glossy car surface, water droplets suspended mid-air,
  cinematic lighting, product photography quality, 120fps aesthetic --ar 9:16

Negative Prompt:
  text overlay, watermarks, low quality, blurry, distorted faces,
  unrealistic physics, cartoon, anime, 3D render look, plastic looking
  materials, fake glossy look, overexposed

成本估算: $50-200 (AI生成费用) + 2小时素材筛选和剪辑
```

### 第四步：平台适配方案

```java
📱 多平台变体
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────┬──────────┬──────────┬──────────────────────┐
│ 平台          │ 时长      │ 比例      │ 剪辑要点              │
├─────────────┼──────────┼──────────┼──────────────────────┤
│ YouTube      │ 90s 完整  │ 16:9     │ 原版，加章节标记       │
│ TikTok       │ 30s       │ 9:16     │ 只保留Hook+革新1+CTA  │
│ Douyin       │ 45s       │ 9:16     │ 前3秒字幕加大，节奏更快 │
│ Instagram    │ 60s       │ 4:5      │ 中速剪辑，加更多文字叠层│
│ LinkedIn     │ 60s       │ 1:1      │ 更专业的语调，去娱乐化 │
│ 微信视频号    │ 60s       │ 16:9     │ 加中文字幕（必须）     │
│ 官网Hero     │ 15s 静音  │ 16:9     │ 去掉旁白，纯视觉+大字   │
└─────────────┴──────────┴──────────┴──────────────────────┘
```

### 第五步：分发计划与缩略图

```
📊 分发计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

发布节奏:
  Day 1: YouTube + 官网 (完整版)
  Day 2: LinkedIn + 微信公众号
  Day 3: TikTok + Douyin (短视频版本)
  Day 5: Instagram Reels + 小红书
  Day 7: 广告投放版本（添加CTA overlay）

缩略图建议:
  ┌─────────────────────────────────────────┐
  │ 方案A: "数字冲击"                        │
  │ 大字 ¥870,000 占画面60%，背景虚化洗车机   │
  │ 适合: YouTube / 公众号                   │
  ├─────────────────────────────────────────┤
  │ 方案B: "对比冲击"                        │
  │ 分屏对比——左人工洗车(黑白) / 右AutoWash(彩)│
  │ 适合: TikTok / Douyin                   │
  ├─────────────────────────────────────────┤
  │ 方案C: "权威感"                          │
  │ CEO或客户老板的近景人像 + 数据卡片        │
  │ 适合: LinkedIn                           │
  └─────────────────────────────────────────┘

KPI目标:
  ├─ YouTube: 观看量 5,000+ | CTR 8%+ | 平均观看时长 45s+
  ├─ TikTok/Douyin: 播放量 100K+ | 完播率 25%+
  ├─ LinkedIn: 展示量 20K+ | 互动率 5%+
  └─ 官网: 嵌入页面停留时长 +35%
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/写文案` (write-copy) | 上游 | 产品定位和卖点输入到视频脚本 |
| `/生成图片` (gen-image) | 平行 | 视频缩略图、关键帧、封面图生成 |
| `/内容策略` (content-strategy) | 上游 | 策略层确定视频内容方向 |
| `/编辑文案` (edit-copy) | 上游 | 审查视频脚本和文案 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `ai_video_tools` | object | 是 | AI视频工具API配置（Runway/Kling/Sora/HeyGen） |
| `brand_kit` | object | 是 | 品牌视觉规范（Logo/色彩/字体/片头片尾动画） |
| `product_assets` | object | 是 | 产品素材库（视频/照片/3D模型/工程文件） |
| `audio_library` | object | 否 | 背景音乐/音效素材库 |
| `code_templates` | object | 否 | Remotion/Hyperframes模板代码（coded方式） |
| `avatar_profiles` | object | 否 | AI数字人形象库（ai-avatar方式） |
