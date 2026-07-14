---
name: 竞品对比
category: strategy
version: 1.0.0
triggers:
  - /对比页
  - /vs-page
parameters:
  - name: product_name
    type: string
    required: true
    description: 我方产品名称
  - name: competitor_names
    type: array
    required: true
    description: 竞品名称列表
  - name: page_type
    type: string
    required: true
    description: 对比页类型（landing-vs/why-us/alternative/blog-comparison）
  - name: honest_positioning
    type: boolean
    required: false
    default: true
    description: 是否采用诚实定位策略（承认竞品优势）
output:
  format: markdown
  sections:
    - 对比总览表
    - 分维度深度对比
    - 选择建议
    - 诚实声明
---

# 竞品对比（VS Page）

## 功能描述

创建专业、诚实的竞品对比页面。支持四种类型的对比内容生成：

1. **Landing vs 页面（landing-vs）**：落地页级别的竞品对比，简洁有力，快速帮助访客判断"谁更适合我"
2. **Why Us 页面（why-us）**：突出自身差异化优势，回答"为什么选我们而不是竞品"
3. **替代品页面（alternative）**：针对特定竞品的替代方案，吸引正在搜索"XXX 替代品"的潜在客户
4. **博客对比文章（blog-comparison）**：深度测评风格的长文对比，适合 SEO 内容营销

核心理念为"诚实定位"：客观承认竞品在某些维度的优势，坦诚我方更适合的场景，建立信任而非贬低对手。这种策略在 B2B 领域尤其有效——买家更信任能够客观评估竞品的供应商。

## 使用示例

**示例 1：Landing vs 页面**
```
/对比页
产品名称：SmartWash X9 全自动洗车机
竞品名称：洗车王 Pro, TurboWash 3000
页面类型：landing-vs
诚实定位：true
```

**示例 2：博客对比文章**
```
/vs-page
产品名称：CloudCarWash SaaS
竞品名称：WashOS, CarClean Pro
页面类型：blog-comparison
```

## 执行流程

### 第一步：竞品信息收集
收集各竞品的核心参数：价格、功能列表、目标客户、市场定位、用户口碑。可通过公开资料、评测网站、用户评论等渠道获取。

### 第二步：对比维度定义
根据产品类型和页面目的，定义 8-12 个关键对比维度（如价格、功能完整性、易用性、售后服务、扩展性等）。

### 第三步：诚实评分与差异化分析
对每个维度进行客观评分，明确指出我方和竞品各自的优势和劣势。识别 2-3 个"不战而胜"的差异化维度。

### 第四步：内容生成
按照选定页面类型生成对比内容：包含对比总览表、分维度详解、选择建议、诚实声明。

## 输出示例

```markdown
# SmartWash X9 vs 洗车王 Pro vs TurboWash 3000

## 📊 对比总览

| 维度 | SmartWash X9 | 洗车王 Pro | TurboWash 3000 |
|------|-------------|-----------|----------------|
| 💰 设备价格 | ¥180,000 | ¥150,000 | ¥210,000 |
| ⚡ 单次洗车耗时 | 3分钟 | 4分钟 | 2.5分钟 |
| 🔧 维护频率 | 低（季度保养） | 中（月度保养） | 低（季度保养） |
| 📊 数据后台 | ✅ 完整 | ✅ 基础 | ❌ 需额外购买 |
| 🌐 远程运维 | ✅ 标配 | ❌ 不支持 | ✅ 付费模块 |
| 🎯 适合场景 | 中型站点 | 小型站点 | 大型站点 |

## 🏆 诚实声明
- **TurboWash 3000 更快**：单次洗车仅需 2.5 分钟，适合超大规模场地。如果你日均洗车量超过 300 台，它可能是更好选择。
- **洗车王 Pro 更便宜**：入门价格低 3 万元。如果你的预算是首要考虑因素且洗车量不大，它值得考虑。
- **SmartWash X9 最均衡**：在速度、价格、智能化和运维成本之间取得最佳平衡。

## 🎯 选择建议
→ 如果你经营中型加油站（日均洗车 50-150 台），SmartWash X9 是 ROI 最优解。
```

## 关联技能

- `/销售赋能` — 对比结果可用于竞争战卡（Battle Card）
- `/发布计划` — 竞品对比是发布前市场调研的重要输入
- `/市场营销创意` — 对比内容可转化为社交媒体素材
- `/公共关系` — 对比数据可用于媒体评测素材

## 配置要求

- 需提供竞品名称和至少 5 个关键参数（价格、核心功能、目标客群等）
- 建议从官网、评测平台、用户评价等多渠道交叉验证竞品信息
- 对比数据需注明更新时间，避免因信息过时引发争议
