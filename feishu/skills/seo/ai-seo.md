---
name: ai-seo
category: seo
version: 1.0.0
---

# /AI搜索优化 (ai-seo)

针对 AI 搜索引擎（Google AI Overviews、ChatGPT、Perplexity、Claude、Gemini）优化网站内容，确保品牌信息在 AI 生成回答中被引用和推荐。三大支柱：结构（可提取） + 权威（可引用） + 存在（AI 能看到你）。

## 触发词

`/AI搜索优化` `/ai-seo`

## 使用示例

```
/AI搜索优化 https://www.autowashpro.com --generate-llms-txt
```
```
/ai-seo --check-presence "AutoWash Pro X1 automatic car wash machine" --platforms chatgpt,perplexity,gemini
```

> 示例：为 AutoWash Pro X1 全自动洗车机创建 llms.txt 文件，同时在主流 AI 平台检测品牌可见度。

## 执行流程

### 第一步：AI 可见度检测
- 在 Google AI Overviews 中搜索品牌+产品词
- 检测 ChatGPT Browse/Gemini/Perplexity 是否引用品牌
- 分析竞品在 AI 答案中的露出率
- 识别 AI 搜索的引用源（Wikipedia、评测站、论坛）

### 第二步：结构化数据强化
- 生成/优化 llms.txt 文件（AI 爬虫规范）
- 创建 pricing.md（结构化定价信息）
- 检查 OKF（Open Knowledge Format）文件完整性
- 验证 schema.org 结构化标记

### 第三步：内容权威性建设
- 整理可引用的统计数据与行业报告
- 建立专家作者/机构背书体系
- 创建 FAQ 式问答内容（匹配 AI 查询模式）
- 在权威第三方平台布局品牌信息

### 第四步：语义搜索优化
- 优化自然语言查询匹配（非关键词匹配）
- 构建话题簇（Topic Cluster）而非单一页面
- 添加定义性陈述段落（"X 是什么"）
- 优化实体（Entity）关联而非关键词密度

### 第五步：监测与迭代
- 设置 AI 搜索提及监控
- 追踪 AI 推荐流量转化数据
- 每月更新 llms.txt 和关键页面
- A/B 测试不同内容结构在 AI 答案中的表现

## 输出示例

```
🤖 AutoWash Pro X1 AI 搜索优化报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 AI 可见度评分: 45/100

🗺️ 平台覆盖状态
├── Google AI Overviews  ⚠️ 未出现 → 缺结构化数据
├── ChatGPT (Browse)     ✅ 偶有引用 → 引用源: TrustPilot
├── Perplexity           ❌ 未检测到
├── Claude               ✅ 已识别品牌
└── Gemini               ⚠️ 仅引用竞品页面

📄 llms.txt 生成报告
├── 状态: ✅ 已生成 → /llms.txt
├── 包含: 产品线 / 定价 / FAQ / 技术规格
└── 大小: 12KB (推荐 <50KB)

💰 pricing.md
├── 状态: ✅ 已生成 → /pricing.md
└── 结构化: 4 款产品 / 3 种货币 / 分期方案

🔧 修复清单
├── P1 | 生成 OKF 文件 → /okf/autowash-pro.json
├── P1 | 添加 schema.org 结构化数据
├── P2 | 在 Wikipedia 引用相关页面
└── P3 | 创建 "自动洗车机选购指南" FAQ 页面

📈 预期效果
├── AI 答案露出率: 45% → 75% (30天)
└── AI 推荐流量: +200-500 UV/月
```
