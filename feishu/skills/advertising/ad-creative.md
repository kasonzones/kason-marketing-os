---
name: ad-creative
category: advertising
version: 1.0.0
description: >
  付费广告创意规模化生成技能。支持从零生成、数据驱动迭代、批量素材延展、创意策略循环四种模式。
  覆盖标题、描述、正文、CTA 等文案元素，以及 15 套静态模板、iMessage/ChatGPT 视频、
  动态视频等视觉资产。内置平台素材规格参考与首 3 秒钩子系统。
triggers:
  - /广告创意
  - /ad-creative
  - /广告素材
  - /ad-copy
modes:
  - generate_from_scratch
  - iterate_from_data
  - scale_static_batch
  - creative_strategy_loop
platforms:
  - google
  - meta
  - linkedin
  - tiktok
  - twitter
---

# /广告创意 (ad-creative)

## 功能概述

付费广告创意规模化生产引擎。支持四大创作模式：从零生成、基于投放数据迭代优化、输入语料库（爆款广告/评论/评价）批量延展、创意策略循环。覆盖 Google/Meta/LinkedIn/TikTok/Twitter 全平台素材规格，集成首 3 秒钩子系统与 15 套静态广告模板。

---

## 四大创作模式

### 模式 1：从零生成 `--mode=generate`

根据产品信息、目标受众、平台要求，从零生成完整广告创意。

```
输入: 产品信息 + 受众画像 + 平台
输出: 标题组 + 描述组 + 正文 + CTA + 视觉方向建议
```

### 模式 2：数据驱动迭代 `--mode=iterate`

基于现有投放数据（CTR/CVR/ROAS），优化高潜创意、淘汰低效元素。

```
输入: 现有创意 + 投放数据 (CTR/CVR/CPA)
输出: 优化版创意 + A/B 测试方案 + 淘汰建议
```

### 模式 3：批量语料延展 `--mode=scale`

输入爆款广告文案、用户评论、产品评价等语料库，规模化批量生成变体。

```
输入: 语料库 (winning ads / reviews / comments / testimonials)
输出: 50-200 条创意变体，按平台分组
```

### 模式 4：创意策略循环 `--mode=strategy`

分析目标市场、竞品创意、受众偏好，制定系统化创意策略。

```
输入: 市场分析 + 竞品创意库 + 受众调研
输出: 创意策略文档 + 内容日历 + 素材需求清单
```

---

## 创意元素生成结构

### 文案元素

```
┌─────────────────────────────────────────────────────┐
│  Headlines        │  标题 (30-90字符)               │
│  Descriptions     │  描述 (90-500字符)              │
│  Primary Text     │  正文 (125-5,000字符，按平台)   │
│  CTA              │  行动号召 (2-5词)               │
│  Ad Copy Variants │  文案变体 (A/B 测试用)          │
└─────────────────────────────────────────────────────┘
```

### 视觉元素

```
┌──────────────────────────────────────────────────────┐
│  Static Ads    │  15 套模板 (详见模板库)             │
│  Video - iMsg  │  iMessage/ChatGPT 风格模仿视频      │
│  Video - Motion│  动态视频 (产品展示/场景/动画)      │
│  Carousel      │  轮播卡片 (3-10 张)                 │
│  Collection    │  商品集合 (Meta 专属)               │
└──────────────────────────────────────────────────────┘
```

---

## 首 3 秒钩子系统 (Hook System)

视频/动态广告的前 3 秒决定 70% 的观看率。内置 12 种钩子模式：

| # | 钩子类型 | 模式 | AutoWash Pro X1 示例 |
|---|----------|------|----------------------|
| 1 | 痛点戳穿 | "Struggling with...?" | "每月人工洗车人工成本超 ¥20k?" |
| 2 | 数据冲击 | "X% increase in..." | "洗车效率提升 300%，人工减少 80%" |
| 3 | 对比冲击 | "Before vs After" | 手工洗车 30min → AutoWash X1 3min 对比 |
| 4 | 反问挑战 | "Why are you still...?" | "2026年了还在用人工洗车?" |
| 5 | 结果展示 | "See what happened..." | X1 洗完一台 SUV 的真实过程 (15s) |
| 6 | 权威背书 | "As seen in..." | 沙特某 500 强加油站实拍 |
| 7 | 好奇心缺口 | "The secret to..." | "中东洗车行业无人告诉你的秘密" |
| 8 | 假设情景 | "Imagine if..." | "想象每辆车 3 分钟洗完，24h 不停" |
| 9 | 直接挑战 | "I bet you..." | "我打赌你的洗车方式正在亏钱" |
| 10| 紧迫感 | "Limited time..." | "X1 首发特惠，仅剩 7 天" |
| 11| 用户生成 | "Our customer said..." | 客户实录："It paid for itself in 6 weeks" |
| 12| 产品演示 | "Watch this..." | X1 无接触洗车 360° 旋转展示 |

---

## 15 套静态广告模板

### 模板矩阵

| # | 模板名称 | 适用平台 | 视觉风格 | 最佳场景 |
|---|----------|----------|----------|----------|
| T1 | Hero Product | 全平台 | 产品居中 + 纯色背景 | 品牌认知 / 新品发布 |
| T2 | Before & After | Meta/TikTok | 左右分屏对比 | 效果证明 |
| T3 | Stat Card | LinkedIn/Google | 数据卡片 + 图标 | B2B 决策推动 |
| T4 | Testimonial | 全平台 | 真实客户照片 + 引语 | 信任建设 |
| T5 | Feature Grid | LinkedIn/Google | 3-4 功能网格 | 产品详情页引流 |
| T6 | Problem/Solution | Meta/TikTok | 痛点文案 + 解决方案 | 需求唤醒 |
| T7 | Comparison Table | LinkedIn | 对比表格 | 竞品截获 |
| T8 | Discount/Promo | 全平台 | 大号折扣数 + 倒计时 | 促销活动 |
| T9 | Behind the Scenes | TikTok/Meta | 工厂/安装实拍 | 信任与真实感 |
| T10| FAQ Card | LinkedIn/Google | Q&A 卡片 | 克服异议 |
| T11| Case Study Snap | LinkedIn | 迷你案例 + ROI 数字 | B2B 高意向 |
| T12| Social Proof Bar | Meta | 5星评价 + 客户数 | 从众心理 |
| T13| How It Works | TikTok/Meta | 3 步骤图解 | 降低认知门槛 |
| T14| Founder's Story | LinkedIn/Meta | 创始人照片 + 品牌故事 | 品牌人格化 |
| T15| Location Shot | Google Display | 安装场景实拍 | 本地化信任 |

---

## iMessage / ChatGPT 视频广告模板

### iMessage 风格视频

模拟手机短信对话界面，以 "客户咨询 → 客服回复" 对话形式展示产品价值。

```
视觉: iPhone 消息界面录屏
时长: 15-30s
对话结构:
  👤 "I need a car wash machine for my gas station"
  🤖 "Depends — how many cars per day?"
  👤 "About 200"
  🤖 "You need AutoWash Pro X1, it can handle 300+/day"
  👤 "Price?"
  🤖 "Way less than you think — ROI in 6 months"
  👤 "Send details"

适用平台: TikTok, Instagram Reels, YouTube Shorts
```

### ChatGPT 风格视频

模拟 AI 对话界面，用问答形式输出产品信息，营造"客观中立"感。

```
视觉: ChatGPT 网页/App 界面录屏
时长: 15-30s
对话结构:
  🧑 "best automatic car wash machine for gas station 2026"
  🤖 (逐字输出产品优势、规格、价格区间)
  
适用平台: TikTok, LinkedIn, Twitter/X
```

---

## 平台素材规格速查

### Google Ads

| 格式 | 规格 |
|------|------|
| RSA 标题 | 15 条, 每条 ≤30 字符 (中文 ≤15 字) |
| RSA 描述 | 4 条, 每条 ≤90 字符 (中文 ≤45 字) |
| 展示广告 | 300×250 / 336×280 / 728×90 / 160×600 / 320×50 / 300×600 |
| 发现广告 | 1.91:1 (1200×628) / 1:1 (1200×1200) / 4:5 (960×1200) |
| YouTube 插播 | 6s (不可跳过) / 15-30s (可跳过 5s 后) |

### Meta (Facebook / Instagram)

| 格式 | 规格 |
|------|------|
| Feed 图片 | 1.91:1 (1080×1080 推荐) |
| Feed 视频 | 1:1 / 4:5 / 16:9, ≤2min (推荐 15-30s) |
| Story | 9:16 (1080×1920), ≤15s |
| Reels | 9:16 (1080×1920), ≤90s |
| Carousel | 1:1, 2-10 张卡片 |
| Collection | 封面 1:1 + 商品图 1:1 |

### LinkedIn

| 格式 | 规格 |
|------|------|
| Sponsored Content | 1.91:1 (1200×627), 正文 ≤150 字符 |
| Message Ads | 正文 ≤500 字符, CTA 按钮 |
| Video Ads | 16:9 / 1:1 / 9:16, 3s-30min (推荐 ≤30s) |
| Carousel | 1:1 (1080×1080), 2-10 张 |

### TikTok

| 格式 | 规格 |
|------|------|
| In-Feed 视频 | 9:16 (1080×1920), 5-60s (推荐 21-34s) |
| Spark Ads | 同 In-Feed, 使用原生帖子 |
| TopView | 9:16, 5-60s |
| 轮播 | 9:16 / 1:1 / 16:9, 2-35 张 |

### Twitter/X

| 格式 | 规格 |
|------|------|
| 推文正文 | ≤280 字符 |
| 图片 | 16:9 (1200×675) / 1:1 (1200×1200) |
| 视频 | 16:9 / 1:1, ≤2min20s (推荐 ≤15s) |
| 轮播 | 2-4 张, 同图片规格 |

---

## 使用示例

### 示例 1：从零生成 Google RSA 广告

```
/广告创意 --mode=generate \
  --platform=google_rsa \
  --product=AutoWash_Pro_X1 \
  --target_audience="沙特加油站业主，25-55岁，关注效率和成本" \
  --language=ar+en
```

**示例输出：**

```
🤖 Google RSA 创意已生成

═══════════════════════════════════════

📝 标题 (15条 – 英文 + 阿拉伯语)

EN Titles:
━━━━━━━━━━━━━━━━━━━━━━
1. AutoWash Pro X1 | 3 Min/Car
2. Automatic Car Wash Machine
3. Cut Labor Costs 80% – X1
4. 300 Cars/Day | No Downtime
5. Best ROI Car Wash Machine 2026
6. Touchless Wash | Zero Damage
7. AutoWash X1 | Free Demo
8. German Engineering – X1
9. From ¥28,000/mo to ¥5,000/mo
10. X1 – Made for Gas Stations
11. 24/7 Operation | AutoWash X1
12. Install in 2 Days | See ROI
13. AutoWash Pro X1 | GCC Authorized
14. Smart Car Wash | App Control
15. Get Quote Today | X1 Series

AR Titles:
━━━━━━━━━━━━━━━━━━━━━━
1. AutoWash Pro X1 | 3 دقائق/سيارة
2. ماكينة غسيل سيارات أوتوماتيكية
3. خفض تكاليف العمالة 80% – X1
4. 300 سيارة/يوم | بدون توقف
5. أفضل عائد استثماري 2026

📄 描述 (4条)
━━━━━━━━━━━━━━━━━━━━━━
1. Germany-engineered automatic car wash machine.
   3 min/car. 80% lower labor cost. 300+ cars/day.
   Free installation assessment. Quote now.

2. Transform your gas station with AutoWash Pro X1.
   Touchless system. Zero paint damage. 24/7 operation.
   Payback <6 months. GCC delivery in 2 weeks.

3. AutoWash Pro X1 saves gas station owners ¥280K+/year
   in labor costs. Automatic, touchless, smart. Book a
   free demo — WhatsApp +971-XX-XXX-XXXX

4. #1 automatic car wash for Middle East gas stations.
   50+ installed in KSA/UAE. German quality, local service.
   Get your quote in 24 hours.

🖱️ CTA 推荐
━━━━━━━━━━━━━━━━━━━━━━
  Get Quote  |  Book Demo  |  WhatsApp Now  |  Learn More

🎨 视觉方向建议
━━━━━━━━━━━━━━━━━━━━━━
  [模板 T1 – Hero Product]
  X1 45° 角摆放，深蓝渐变背景
  副标题: "German Engineering. GCC Standard."

📐 下一步:
  • 生成配套展示广告素材: /广告创意 –mode=generate –platform=google_display
  • 预览所有组合: /广告创意 –preview –campaign_id=xxx
```

---

### 示例 2：批量语料延展

```
/广告创意 --mode=scale \
  --platform=meta \
  --corpus=winning_ads.csv \
  --corpus=top_reviews_en.csv \
  --corpus=customer_testimonials_ar.csv \
  --variants=100 \
  --product=AutoWash_Pro_X1
```

**示例输出：**

```
📦 批量创意延展完成

═══════════════════════════════════════

📊 语料分析
━━━━━━━━━━━━━━━━━━━━━━
📥 输入语料: 3 个来源, 共 87 条原始内容
🔍 提取主题:
  ██████████ 省钱/ROI        (34%)
  ████████░░ 效率/速度       (28%)
  ██████░░░░ 可靠性/低维护   (18%)
  ████░░░░░░ 易操作/智能     (12%)
  ██░░░░░░░░ 客户服务        (8%)

🔄 生成结果: 100 条创意变体
━━━━━━━━━━━━━━━━━━━━━━

✅ Feed 静态广告: 42 条
   ├─ 主题"省钱": 14 条
   ├─ 主题"效率": 12 条
   ├─ 主题"可靠": 9 条
   └─ 主题"智能": 7 条

✅ Story 广告: 25 条 (9:16)
✅ Reels 脚本: 18 条 (15-30s)
✅ Carousel: 15 套 (2-5 张卡片)

🌟 Top 5 高潜创意 (基于语料情感分 + 关键词密度)
━━━━━━━━━━━━━━━━━━━━━━

#1 🔥 情感分 94
  🎯 平台: Meta Feed
  📝 Headline: "Paid for Itself in 6 Weeks"
  💬 Body: "I was skeptical about switching from manual to
  automatic. But after installing AutoWash Pro X1, my gas station
  now washes 200+ cars/day with ZERO extra labor. The numbers
  don't lie."
  🔘 CTA: See Real Customer Results →
  🏷️ 标签: testimonial | roi | gas_station
  🎨 模板: T4 Testimonial

#2 🔥 情感分 91
  🎯 平台: IG Reels
  🎬 Hook: "Stop losing money every time a car leaves
  without washing"
  📹 脚本: 15s – 痛点数据 → X1解决方案 → CTA
  🎨 模板: T6 Problem/Solution (动态版)

#3 🔥 情感分 88
  🎯 平台: Meta Carousel
  Card 1: "Before: 8 workers, 20 cars/hour"
  Card 2: "After: 1 operator, 20 cars/hour"
  Card 3: "Savings: ¥23,000/month in labor"
  Card 4: "Get Your Calculation →"
  🎨 模板: T2 Before & After

#4 🔥 情感分 85
  🎯 平台: IG Story
  📝 "The wash quality so good, customers drive extra miles
  to your station"
  🎨 模板: T5 Feature Grid (竖版)

#5 🔥 情感分 82
  🎯 平台: TikTok Spark Ad
  🎬 Hook: "Watch this BMW get washed in 3 minutes flat"
  🎨 格式: 实拍 + 速度计时叠加

💾 输出文件
━━━━━━━━━━━━━━━━━━━━━━
📄 ad_creative_batch_20260713.csv
📄 ad_creative_batch_20260713.json
📄 creative_brief_variants.md
```

---

### 示例 3：创意策略循环

```
/广告创意 --mode=strategy \
  --product=AutoWash_Pro_X1 \
  --market="沙特阿拉伯，加油站渠道" \
  --competitor_analysis=competitors.csv \
  --audience_insight="中东加油站业主偏好: 低维护、快速安装、德国品质"
```

**示例输出：**

```
🧠 创意策略循环 – AutoWash Pro X1 沙特市场

═══════════════════════════════════════

📈 竞品创意分析
━━━━━━━━━━━━━━━━━━━━━━
🔴 竞品 A (Istobal): 主打"欧洲品质"，创意以蓝色调工厂实拍为主
🟡 竞品 B (PDQ): 主打"快速安装"，创意偏技术参数
🟢 市场空白: 缺乏面向加油站业主的 ROI 计算器类创意
🟢 市场空白: 缺乏阿拉伯语本地化的客户见证视频

🎯 创意策略
━━━━━━━━━━━━━━━━━━━━━━

🗓️ 月创意日历

Week 1 – 品牌认知 (Awareness)
  星期一: 视频 – "沙特加油站升级之路" (T1 Hero Product)
  星期三: 图片 – 德国工程团队实拍 (T9 Behind the Scenes)
  星期五: 视频 – iMessage 风格 "询价对话" (ChatGPT 模板)

Week 2 – 价值证明 (Consideration)
  星期一: 轮播 – "Before 人工 → After AutoWash X1" (T2)
  星期三: 图片 – ROI 计算器结果卡片 (T3 Stat Card)
  星期五: 视频 – 客户见证 "Payback in 6 months" (T4)

Week 3 – 信任建设 (Trust)
  星期一: 图片 – "50+ 中东加油站已选择" (T12 Social Proof)
  星期三: 视频 – 安装过程延时 (T13 How It Works)
  星期五: 轮播 – 迷你案例研究 (T11 Case Study Snap)

Week 4 – 转化驱动 (Conversion)
  星期一: 图片 – "仅剩 X1 7月配额" (T8 Discount/Promo)
  星期三: 视频 – ChatGPT 风格 "客观测评" (ChatGPT 模板)
  星期五: 图片 – FAQ "投资多久回本?" (T10 FAQ Card)

📊 素材需求清单
━━━━━━━━━━━━━━━━━━━━━━
📸 需拍摄素材:
  ☐ X1 产品 45° 白底/场景图 (3张)
  ☐ 工厂/团队实拍 (5张)
  ☐ 沙特/阿联酋已安装现场 (5张)
  ☐ 洗车前/后对比 (3组)
  ☐ 操作面板/App 界面截图 (3张)

🎬 需制作视频:
  ☐ 30s 产品展示 (15s × 2版本)
  ☐ 客户见证访谈 (60s + 15s cut)
  ☐ 安装过程延时 (30s)
  ☐ iMessage 风格对话视频 (15s × 3主题)
  ☐ Hook 测试集 (3s × 12种钩子模式)

🔬 测试矩阵
━━━━━━━━━━━━━━━━━━━━━━
Hook     × 受众     × 格式     = 总变体
12种钩子  × 3层受众  × 2种格式 = 72 组测试

优先级: 先测试 Top 3 钩子 (痛点戳穿/数据冲击/反问挑战)
          × TOF 受众
          × Reels + Feed

🔄 迭代节奏
━━━━━━━━━━━━━━━━━━━━━━
Week 1-2: 72 组测试投放，收集数据
Week 3:   淘汰 CTR<1% 组合，加预算给 Top 20%
Week 4:   Top 5 组合放量，启动新一轮创意

🎯 下一步命令:
  /广告创意 –mode=generate –platform=meta –format=reels
  /广告创意 –mode=scale –corpus=supporting_materials.csv
```
