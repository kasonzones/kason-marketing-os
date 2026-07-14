---
name: 营销创意
category: strategy
version: 1.0.0
triggers:
  - /创意
  - /ideas
parameters:
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: stage
    type: string
    required: true
    description: 产品阶段（pre-launch/early/growth/scale）
  - name: category
    type: string
    required: false
    description: 创意类别筛选
  - name: budget_level
    type: string
    required: false
    default: medium
    description: 预算水平（low/medium/high）
output:
  format: markdown
  sections:
    - 推荐创意列表
    - 创意详情卡片
    - 执行优先级矩阵
    - 效果预期评估
---

# 营销创意（Marketing Ideas）

## 功能描述

从 139 个经过验证的营销创意库中，根据产品阶段和类别筛选最适合的营销方案。创意库按 17 个类别和 4 个产品阶段组织：

### 17 个创意类别
1. 内容营销（Content Marketing）
2. 社交媒体（Social Media）
3. SEO/搜索引擎优化
4. 邮件营销（Email Marketing）
5. 视频营销（Video Marketing）
6. 网红/KOL 合作（Influencer Marketing）
7. 社区建设（Community Building）
8. 口碑营销（Referral Marketing）
9. PR/媒体公关
10. 活动营销（Event Marketing）
11. 产品内增长（Product-Led Growth）
12. 合作伙伴营销（Partner Marketing）
13. 付费广告（Paid Advertising）
14. 品牌合作（Co-Branding）
15. 直销推广（Direct Outreach）
16. 转化率优化（CRO）
17. 客户留存（Retention）

### 4 个产品阶段
- **Pre-launch（预发布）**：造势蓄水，收集早期意向用户
- **Early（早期增长）**：获取首批付费用户，验证 PMF
- **Growth（快速增长）**：规模化获客，建立增长飞轮
- **Scale（规模化）**：品牌建设，多市场扩张

## 使用示例

**示例 1：预发布阶段创意**
```
/创意
产品名称：SmartWash X9 全自动洗车机
阶段：pre-launch
预算水平：medium
```

**示例 2：增长阶段内容营销创意**
```
/ideas
产品名称：云洗车管理 SaaS
阶段：growth
类别：内容营销、社区建设
预算水平：low
```

## 执行流程

### 第一步：阶段匹配
根据产品当前阶段，从创意库中筛选适合该阶段的创意条目。

### 第二步：类别筛选
根据用户指定的类别偏好，进一步缩小创意范围。如未指定类别，按优先级权重自动推荐。

### 第三步：预算适配
根据预算水平（低/中/高）为每个创意标注执行成本评估，过滤超出预算范围的方案。

### 第四步：优先级排序
按"预期效果 × 执行难度 × 预算匹配度"计算优先级分数，生成 Top 5-10 推荐创意。

### 第五步：创意详情展开
为每个推荐创意生成执行卡片，包含：创意描述、执行步骤、所需资源、预期效果、参考案例。

## 输出示例

```markdown
# SmartWash X9 预发布阶段营销创意

## 🎯 Top 10 推荐创意（按优先级排序）

### 1. 🔥 行业痛点纪录片《加油站老板的一天》
| 维度 | 详情 |
|------|------|
| 类别 | 内容营销 / 视频营销 |
| 预算 | ¥15,000 - ¥25,000 |
| 执行难度 | ⭐⭐⭐ |
| 预期效果 | 品牌认知 + 300 个潜在客户线索 |

**执行步骤：**
1. 联系 3 家合作加油站取景
2. 拍摄老板真实工作流程，突出洗车排队痛点
3. 以 SmartWash X9 作为解决方案自然出现
4. 在抖音、视频号、行业社群分发
5. 引导观看者预约演示

### 2. 📦 神秘体验官计划
| 维度 | 详情 |
|------|------|
| 类别 | 社区建设 / KOL 合作 |
| 预算 | ¥5,000 - ¥10,000 |
| 执行难度 | ⭐⭐ |
| 预期效果 | 20 篇真实体验内容 + 社交传播 |

### 3. 🎁 "老客户推荐"种子裂变
| 维度 | 详情 |
|------|------|
| 类别 | 口碑营销 |
| 预算 | ¥3,000 - ¥8,000 |
| 执行难度 | ⭐ |
| 预期效果 | 推荐转化率 8-12% |

## 📊 优先级矩阵
     高效果 ↑
      │  纪录片  │  行业展会  │
      │  体验官  │  直播发布  │
      ├──────────┼─────────────→ 高难度
      │  推荐裂变│  SEO文章   │
      │  朋友圈  │  社群推广  │
      ↓ 低效果
```

## 关联技能

- `/发布计划` — 创意与发布阶段的时间线对齐
- `/营销心理学` — 创意背后的心理学原理
- `/销售赋能` — 创意落地后的转化承接
- `/公共关系` — PR 类创意的媒体执行方案
- `/联合营销` — 合作伙伴类创意的执行细节

## 配置要求

- 需明确产品当前所处阶段（决定创意类型）
- 建议提供产品 USP 和关键差异化描述（帮助匹配创意）
- 预算水平建议如实填写，避免推荐超出执行能力的创意
