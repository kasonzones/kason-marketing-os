---
name: 营销计划生成
category: strategy
version: 1.0.0
triggers:
  - /营销计划
  - /marketing-plan
  - /制定计划
parameters:
  - name: timeframe
    type: string
    required: false
    description: 时间范围 (90天/6个月/12个月)
  - name: budget
    type: string
    required: false
    description: 营销预算 (元/月)
  - name: goals
    type: string
    required: false
    description: 核心目标 (如: 线索增长30%)
output:
  format: card + file
  description: 13节完整营销计划 + 飞书文档
---

# /营销计划 — AARRR 全链路营销计划

## 功能描述
基于产品定位，生成13节AARRR结构的综合性营销计划。覆盖从市场研究、获客、激活、留存、推荐到营收的全链路策略。

## 使用方法
```
/营销计划 90天 预算50000 目标线索增长30%
```

## 执行流程

**阶段一: 研究 INIT (~2分钟)**
1. 读取产品定位 (skills_registry)
2. 提取市场数据 (竞品信息、行业趋势)
3. 客户研究快速扫描

**阶段二: 交互生成 REVIEW (~5分钟)**
逐节生成13节内容:
1. 执行摘要 — 关键发现和战略方向
2. 战略框架 — OKR + 核心策略
3. 现状分析 — SWOT + 竞争态势
4. 获客策略 (Acquisition) — 渠道矩阵 + 预算分配
5. 激活策略 (Activation) — 引导流程 + Aha时刻
6. 留存策略 (Retention) — 用户粘性 + 流失预防
7. 推荐策略 (Referral) — 病毒系数 + 推荐计划
8. 营收策略 (Revenue) — 定价优化 + 升级路径
9. 90天路线图 — 分周执行计划
10. 12个月展望 — 长期增长路径
11. 营销运营栈 — 工具选型 + 集成方案
12. 策略创意库 — 包含交叉引用的 139 条已验证创意
13. 衡量体系 — KPI + RACI矩阵 + 待定决策

**阶段三: 发布 FINALIZE**
- 汇总为完整报告
- 写入多维表 campaigns
- 生成飞书文档

## 输出示例
```
📊 营销计划: AutoWash Pro X1 (90天)

🎯 核心目标: 线索增长30%, 转化率提升15%

📈 预算分配:
- 内容营销: 40% (¥20,000)
- 付费广告: 30% (¥15,000)  
- SEO:      15% (¥7,500)
- 社交:     10% (¥5,000)
- 其他:      5% (¥2,500)

📅 本月关键里程碑:
Week 1: SEO审计 + 内容策略
Week 2: 落地页优化 + Google Ads启动
Week 3: 社交媒体内容矩阵
Week 4: 第一次A/B测试 + 周报

📄 完整计划文档: [查看飞书文档]
```

## 相关技能
- /产品定位 (前置依赖)
- /客户洞察
- /竞品分析
- /内容策略
