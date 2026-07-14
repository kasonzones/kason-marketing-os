---
name: 发布计划
category: strategy
version: 1.0.0
triggers:
  - /发布计划
  - /launch-plan
parameters:
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: target_audience
    type: string
    required: true
    description: 目标受众描述
  - name: launch_date
    type: date
    required: false
    description: 目标发布日期
  - name: phase
    type: string
    required: false
    default: full
    description: 指定生成的阶段（full/internal/alpha/beta/early-access/ga）
output:
  format: markdown
  sections:
    - 发布总览时间线
    - 五阶段详细计划
    - ProductHunt 策略
    - ORB 渠道矩阵
    - 风险预案
---

# 发布计划（Launch Plan）

## 功能描述

为新产品的市场发布制定完整的五阶段发布计划。覆盖从内部测试到全面上市的完整生命周期，融合 ProductHunt 发布策略和 ORB（Owned-Rented-Bought）多渠道矩阵框架，确保产品发布有条不紊、节奏清晰、效果可衡量。

适用于 SaaS 产品、硬件设备（如自动洗车机）、实体消费品等各类产品的发布策划。

## 使用示例

**示例 1：自动洗车机新品发布**
```
/发布计划
产品名称：SmartWash X9 全自动洗车机
目标受众：加油站运营商、停车场管理公司、连锁汽修店
发布日期：2026年9月15日
```

**示例 2：仅生成 ProductHunt 策略**
```
/launch-plan
产品名称：CarWash Cloud SaaS
目标受众：洗车店老板
阶段：producthunt
```

## 执行流程

### 第一步：产品分析与受众定义
分析产品核心卖点、目标受众画像、竞品格局，确定发布定位和核心信息。

### 第二步：五阶段时间线规划
按 Internal → Alpha → Beta → Early Access → GA 五个阶段，制定每个阶段的目标、关键动作、参与人员和成功指标。
- **Internal（内部测试）**：团队内部验证产品稳定性，收集第一轮反馈
- **Alpha（封闭内测）**：邀请 10-20 位核心用户/合作伙伴深度试用
- **Beta（公开测试）**：开放 50-200 名用户注册，收集使用数据和反馈
- **Early Access（抢先体验）**：限时/限量开放购买，制造稀缺感
- **GA（正式发布）**：全面开放，配合营销活动推向市场

### 第三步：ProductHunt 发布策略
制定 ProductHunt 上线的完整方案：预告贴、Maker 简介、首日评论互动策略、社交媒体联动、投票动员方案。

### 第四步：ORB 渠道矩阵配置
规划 Owned（官网、公众号、邮件列表）、Rented（社交媒体、行业论坛）、Bought（付费广告、KOL 合作）三类渠道的组合打法。

### 第五步：风险预案与发布检查清单
列出潜在风险点（服务器承压、负面评论、竞品应对）及对应的应急预案，生成发布前最终检查清单。

## 输出示例

```markdown
# SmartWash X9 发布计划

## 📅 发布总览
| 阶段 | 时间 | 目标用户 | 核心指标 |
|------|------|----------|----------|
| 🔒 Internal | 8/1-8/15 | 内部团队 | Bug 修复率 > 90% |
| 🧪 Alpha | 8/16-8/31 | 10家合作加油站 | NPS > 40 |
| 🅱️ Beta | 9/1-9/10 | 50家洗车店 | 日活用户留存 > 70% |
| 🎫 Early Access | 9/11-9/14 | 前100名购买者 | 转化率 > 15% |
| 🚀 GA | 9/15 | 全市场 | 首月销售额 > 200万 |

## 📱 ProductHunt 策略
- 预告帖发布时间：9月10日
- Maker Hunt 互动方案：1小时内回复所有评论
- 社交媒体联动矩阵：Twitter + LinkedIn + 微信朋友圈

## 📡 ORB 渠道矩阵
| 渠道类型 | 渠道名称 | 内容形式 | 预算占比 |
|----------|----------|----------|----------|
| Owned | 官网落地页 | 产品视频+案例 | 10% |
| Rented | 行业公众号投稿 | 测评文章 | 30% |
| Bought | 加油站行业垂类广告 | 信息流广告 | 60% |
```

## 关联技能

- `/销售工具` — 发布后需要的销售材料
- `/竞品对比` — 发布前的竞品分析
- `/公共关系` — 媒体发布与记者联络
- `/市场营销创意` — 各阶段的创意营销点子
- `/营销心理学` — 发布文案的心理学策略

## 配置要求

- 需配置目标产品的核心参数（名称、受众、日期）
- 建议提前准备产品截图和演示视频素材
- 如需 ProductHunt 发布，需提前注册 Maker 账号并了解当周发布日历
