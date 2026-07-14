---
name: ad-manage
category: advertising
version: 1.0.0
description: >
  跨平台付费广告投放管理技能。覆盖 Google Ads（搜索/RSA/展示）、Meta（Facebook/Instagram）、
  LinkedIn B2B、TikTok、Twitter/X 五大渠道的广告系列创建、出价策略优化、受众定向、
  预算分配与效果监控。内置 B2B 付费广告作战手册，包含投放斩杀规则与盈亏平衡分析模型。
triggers:
  - /广告管理
  - /ad-manage
  - /广告投放
  - /ad-campaign
platforms:
  - google_search
  - google_rsa
  - meta
  - linkedin
  - tiktok
  - twitter
---

# /广告管理 (ad-manage)

## 功能概述

跨渠道付费广告一站式管理技能。支持 Google Ads、Meta（Facebook/Instagram）、LinkedIn、TikTok、Twitter/X 五大平台的广告系列创建、出价策略调优、受众分层与预算动态分配。集成 B2B 投放作战手册与盈亏平衡分析模型，实现从投放到 ROI 的完整闭环。

---

## 核心能力矩阵

### 1. 广告系列创建

| 参数 | 说明 | 示例 |
|------|------|------|
| `campaign_objective` | 投放目标：awareness / traffic / leads / conversions / app_installs | `leads` |
| `budget` | 预算模式与金额：daily / lifetime + 币种 | `daily ¥500` |
| `audience` | 受众定向：地域/年龄/兴趣/行为/自定义/LAL | `25-55岁 沙特/阿联酋 汽车美容兴趣` |
| `bid_strategy` | 出价策略 | `TCPA ¥80` / `Max Conversions` / `Manual CPC` |
| `platform` | 投放平台 | `google` / `meta` / `linkedin` / `tiktok` / `twitter` |

### 2. 平台专属策略引擎

#### Google Ads（搜索 + RSA + 展示）

- **意图阶梯（Intent Ladder）**：
  ```
  Level 1 (高意图): "automatic car wash machine price"
    → 精准匹配 [automatic car wash machine price]
  Level 2 (中意图): "best car wash equipment supplier"
    → 词组匹配 "car wash equipment supplier"
  Level 3 (低意图/探索): "how to start car wash business"
    → 广泛匹配 + 否定词列表
  Level 4 (品牌防守): "AutoWash Pro X1 reviews"
    → 品牌词精准匹配 + 竞品词修饰匹配
  ```
- **RSA（自适应搜索广告）**：每次投放 15 条标题 + 4 条描述，Google 自动组合测试
- **匹配类型进化**：精准 → 词组 → 广泛（配合否定词库逐级放量）
- **出价阶梯**：Manual CPC（冷启动）→ Enhanced CPC（数据积累）→ TCPA/Target ROAS（稳定期）

#### Meta（Facebook / Instagram）

- **Andromeda 算法适配**：
  - 优势事件（Advantage+）优先开启，让 Meta 自动优化人群
  - CPA 锚定策略：初始 TCPA 设为目标 CPA 的 120%，每 3 天降 5% 直至达成
  - 创意疲劳监控：CTR 连续 3 天下降 >15% 触发自动换新
- **受众分层**：
  ```
  TOF (Top of Funnel):  兴趣词 + LAL 1-3% + 广泛
  MOF (Middle of Funnel): 视频观看 50%+ / 页面互动 / 网站访问
  BOF (Bottom of Funnel): 加入购物车 / 发起结账 / 询盘提交
  ```
- **预算分配模型**：CBO（系列预算优化）为主，TOF:MOF:BOF = 40%:35%:25%

#### LinkedIn B2B

- **出价递进策略（Bid Progression）**：
  ```
  阶段1 (Day 1-3):  建议出价上限的 80%，观察 CTR
  阶段2 (Day 4-7):  提升至 100%，积累转化数据
  阶段3 (Day 8-14): 若 CPA 达标，逐步提价至 120%，扩大覆盖
  ```
- **渗透扩展（Penetration Expansion）**：
  - 初始定向：精准公司名单 + 职位 + 行业
  - 扩展策略：每两周扩大一次受众池（相似受众 → 行业泛化 → 地域泛化）
  - 阻断规则：CPL 连续 5 天超标 → 回退至上一级受众规模
- **B2B 内容矩阵**：白皮书 → 案例研究 → 产品演示 → 免费试用（对应 Awareness → Consideration → Conversion）

#### TikTok

- **Spark Ads 优先**：利用原生账号内容加热，优于新建广告
- **VBO（价值优化出价）**：电商场景优先，内容场景用 oCPM
- **素材周期**：平均 7-10 天衰减，需保持素材库持续更新

#### Twitter/X

- **Follower Campaign**：面向品牌认知阶段
- **Website Clicks**：面向流量转化阶段
- **X Ads 特殊规则**：推文长度 ≤ 280 字符，图片 16:9 最佳

---

## B2B 付费广告作战手册

### 斩杀规则（Kill Rules）

触发以下任一条件，立即暂停广告组：

| 规则 | 条件 | 动作 |
|------|------|------|
| **花费无转化** | 花费 ≥ 2× TCPA 且转化 = 0 | 🔴 立即斩杀 |
| **CPL 持续超标** | CPL > 目标 150% 连续 72h | 🔴 立即斩杀 |
| **CTR 过低** | CTR < 0.3% 且展示 > 5000 | 🟡 暂停观察 |
| **频次超标** | 频次 > 4 且 CTR 持续下降 | 🟡 暂停观察 |
| **落地页跳出** | 跳出率 > 85% 且停留 < 10s | 🔴 砍广告 + 优化落地页 |
| **ROI 击穿** | ROAS < 0.5 持续 7 天 | 🔴 立即斩杀 |

### 盈亏平衡分析（Breakeven Analysis）

```
目标 CPA = 客单价 × 毛利率 × 成交转化率

示例（AutoWash Pro X1）：
  客单价: ¥28,000
  毛利率: 45%
  询盘→成交转化率: 8%
  
  目标 CPA = ¥28,000 × 0.45 × 0.08 = ¥1,008
  
  安全线: 目标 CPA × 80% = ¥806
  警戒线: 目标 CPA × 100% = ¥1,008
  斩杀线: 目标 CPA × 150% = ¥1,512
```

### B2B 投放节奏规划

```
Week 1-2 (测试期):   5-10% 月预算, 测试受众×创意矩阵
Week 3-4 (放量期):   20-30% 月预算, 优胜组合加预算
Month 2 (稳定期):    进入稳定投放，开启再营销
Month 3+ (优化期):   重点关注 LTV 和复购，扩展新市场
```

---

## 数据监控与自动化规则

### 自动化规则模板

```yaml
# Google Ads 自动规则
- name: "高消费低转化斩杀"
  condition: "Cost > 2× target_cpa AND Conversions = 0"
  action: "pause_campaign"
  
- name: "预算日耗尽回升"
  condition: "Budget_consumed > 95% AND Hour < 18"
  action: "increase_budget_20%"

# Meta 自动规则  
- name: "创意疲劳换新"
  condition: "CTR_decline > 15% over 3 days"
  action: "rotate_creative"

- name: "高ROAS放量"
  condition: "ROAS > 3.0 over 7 days AND frequency < 3"
  action: "increase_budget_30%"
```

---

## 使用示例

### 示例 1：Google Ads 搜索广告冷启动

```
/广告管理

平台: Google Search
目标: 询盘获取 (leads)
预算: 日预算 ¥800
地域: 沙特阿拉伯、阿联酋、卡塔尔
关键词策略:
  - 精准匹配: [automatic car wash machine], [car wash equipment supplier]
  - 词组匹配: "car wash machine price", "automatic car wash system"
  - 广泛匹配+否定词: 排除 "used", "manual", "second hand"
出价策略: Manual CPC ¥15 (冷启动前2周)
产品: AutoWash Pro X1
```

**示例输出：**

```
🏗️ Google Ads 搜索系列已创建

📋 系列配置
━━━━━━━━━━━━━━━━━━━━━━
📌 系列名称: AutoWash Pro X1 – Search – GCC – Leads
💰 日预算: ¥800
🎯 出价策略: Manual CPC ¥15
📍 目标地域: 沙特阿拉伯 | 阿联酋 | 卡塔尔

🔑 关键词分组 (共 23 个)
━━━━━━━━━━━━━━━━━━━━━━
📌 品牌词组 (3个)
  • [AutoWash Pro X1] – 精准匹配
  • "AutoWash Pro X1 price" – 词组匹配
  • "AutoWash Pro X1 supplier" – 词组匹配

📌 产品词组 (8个)
  • [automatic car wash machine] – 精准匹配
  • [car wash equipment supplier] – 精准匹配
  • "car wash machine price" – 词组匹配
  • "automatic car wash system" – 词组匹配
  • "touchless car wash machine" – 词组匹配
  • "commercial car wash equipment" – 词组匹配

📌 意图词组 (7个)
  • "best car wash machine" – 词组匹配
  • "car wash business equipment" – 词组匹配
  • "how much does car wash machine cost" – 广泛匹配

📌 竞品词组 (5个) - 测试性投放
  • "istobal car wash price" – 词组匹配
  • "washtec car wash machine" – 词组匹配

🚫 否定词库 (12个)
  • used, second hand, manual, handheld, portable,
    diy, homemade, free, job, salary, repair, spare parts

📊 预估数据
━━━━━━━━━━━━━━━━━━━━━━
🔍 月搜索量: 8,200 – 12,000
👁️ 预估月展示: 45,000 – 68,000
🖱️ 预估月点击: 900 – 1,500
📈 预估 CTR: 1.8% – 2.3%
💲 预估 CPC: ¥8 – ¥18
📋 预估 CPL: ¥250 – ¥450

⚠️ 冷启动提醒
━━━━━━━━━━━━━━━━━━━━━━
• Day 1-7: 以 Manual CPC 收集搜索词数据
• Day 8: 添加否定词，优化关键词列表
• Day 14: 评估 CPL，达标后切换 Enhanced CPC
• 目标 CPA: ¥1,008 | 斩杀线: ¥1,512

🎯 下一步: /广告创意 –generate --platform=google_rsa --product=AutoWash_Pro_X1
```

---

### 示例 2：Meta 转化广告

```
/广告管理

平台: Meta (Facebook + Instagram)
目标: 转化 (询盘提交)
预算: 日预算 ¥1,200 (CBO)
受众:
  - TOF: 兴趣定向 car wash / fleet management / auto service, LAL 1-3%, 25-55岁
  - MOF: IG互动/视频观看50%+/网站访问, 重定向
  - BOF: 表单打开未提交/页面停留2分钟+
出价策略: TCPA ¥800 (初始锚定 ¥960)
产品: AutoWash Pro X1
```

**示例输出：**

```
🎯 Meta 转化系列已创建

📋 系列配置
━━━━━━━━━━━━━━━━━━━━━━
📌 系列名称: AutoWash Pro X1 – Meta – Conversions – ME
💰 日预算: ¥1,200 (CBO 系列预算优化)
🎯 优化目标: 询盘提交
💲 TCPA 锚定: ¥960 (目标 120%, 每3天降5%)
📍 地域: 沙特 | 阿联酋 | 科威特 | 阿曼 | 巴林

👥 受众分层
━━━━━━━━━━━━━━━━━━━━━━
🟢 TOF 广告组 (预算 40% = ¥480)
  受众规模: 2,800,000 – 3,500,000
  定向: 汽车美容兴趣 + 车队管理 + LAL 1-3%
  创意强调: 品牌认知 + 场景痛点

🟡 MOF 广告组 (预算 35% = ¥420)
  受众规模: 450,000 – 600,000
  定向: IG视频观看50%+ / 页面互动 / 网站访问
  创意强调: 案例展示 + 客户见证

🔴 BOF 广告组 (预算 25% = ¥300)
  受众规模: 85,000 – 120,000
  定向: 表单打开未提交 / 页面停留2min+
  创意强调: 限时优惠 + 免费咨询CTA

🔄 Andromeda 算法配置
━━━━━━━━━━━━━━━━━━━━━━
✅ Advantage+ 创意优化: 开启
✅ Advantage+ 版位: 开启
✅ Advantage+ 受众: TOF开启 / MOF&BOF关闭
❌ 多广告商广告: 关闭

📊 TCPA 降阶计划
━━━━━━━━━━━━━━━━━━━━━━
Day  1-3:  ¥960 (120% 锚定)
Day  4-6:  ¥912 (114%)
Day  7-9:  ¥864 (108%)
Day 10-12: ¥840 (105%)
Day 13-15: ¥816 (102%)
Day 16+:   ¥800 (100% 目标)

🔪 自动斩杀规则
━━━━━━━━━━━━━━━━━━━━━━
🔴 花费≥¥1,600 且转化=0 → 暂停
🔴 CPL > ¥1,200 持续 48h → 暂停
🟡 CTR < 0.5% 且展示>5,000 → 标记审查
🟡 频次 > 3.5 → 加预算或换创意

🎨 下一步: /广告创意 –platform=meta –format=static+video --product=AutoWash_Pro_X1
```

---

### 示例 3：LinkedIn B2B 渗透投放

```
/广告管理

平台: LinkedIn
目标: 询盘 + 演示预约
预算: 月预算 ¥30,000 (日约 ¥1,000)
受众: 沙特/阿联酋 — 加油站业主/汽车经销商/车队管理 — Director+
广告形式: Sponsored Content + Message Ads
出价策略: Manual CPC → Max Delivery (2周后)
产品: AutoWash Pro X1
```

**示例输出：**

```
💼 LinkedIn B2B 系列已创建

📋 系列配置
━━━━━━━━━━━━━━━━━━━━━━
📌 系列名称: AutoWash Pro X1 – LinkedIn – B2B Leads
💰 月预算: ¥30,000 | 日均 ¥1,000
🎯 目标: 询盘 + 演示预约
💲 初始出价: Manual CPC ¥45

👔 受众定向
━━━━━━━━━━━━━━━━━━━━━━
🌍 地域: 沙特 | 阿联酋
🏢 行业: 加油站运营 | 汽车零售 | 车队管理 | 酒店/商场
💼 职位: Director | VP | Owner | GM | Operations Manager
📏 公司规模: 50 – 10,000 人
👤 预估受众: 28,000 – 45,000

📈 出价递进计划
━━━━━━━━━━━━━━━━━━━━━━
Day  1-3:  CPC ¥45 (建议出价 80%)
Day  4-7:  CPC ¥56 (建议出价 100%)
Day  8-14: CPC ¥67 (建议出价 120%, 需 CPA 达标)
Day 15+:  切换 Max Delivery (自动优化)

🔍 渗透扩展路线
━━━━━━━━━━━━━━━━━━━━━━
Phase 1 (Week 1-2):  精准名单 (28K-45K)
  → 连锁加油站品牌 + 汽车经销商集团
Phase 2 (Week 3-4):  行业扩展 (80K-120K)
  → 相似行业: 停车管理/物流中心/洗车连锁
Phase 3 (Week 5-6):  职位扩展 (150K-200K)
  → 降级至 Manager + 采购/设施管理职能
Phase 4 (Week 7+):   地域扩展 (250K+)
  → 增加卡塔尔/科威特/阿曼

📋 B2B 内容矩阵
━━━━━━━━━━━━━━━━━━━━━━
📄 Awareness: 《2026中东洗车行业自动化趋势报告》
📊 Consideration: "AutoWash Pro X1 ROI 计算器"
📹 Consideration: 客户案例视频 (3min)
🎥 Conversion: 产品演示预约 + 免费试用

🎯 下一步: /广告创意 –platform=linkedin –format=sponsored+message –product=AutoWash_Pro_X1
```
