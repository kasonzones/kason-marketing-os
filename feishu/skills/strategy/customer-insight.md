---
name: 客户洞察研究
category: strategy
version: 1.0.0
triggers: ["/客户洞察", "/customer-insight", "/用户研究"]
parameters:
  - name: source
    type: string
    required: false
    description: 数据来源: survey/transcript/reviews/reddit/g2
  - name: topic
    type: string
    required: false
    description: 研究主题关键词
output: {format: "card + table", description: "VOC报告 + 用户画像 + JTBD地图"}
---

# /客户洞察 — 客户研究与VOC分析

## 功能描述
两种模式：(1) 分析现有资产(调研、工单、评价) (2) 去数字水源地寻找(Reddit, G2等)。输出结构化的客户研究报告。

## 使用方法
```
/客户洞察 来源:reddit 主题:自动洗车机体验
```
或
```
/客户洞察 来源:survey 提供调研数据...
```

## 执行流程
1. 确定研究模式(分析型/探索型)
2. 从指定来源提取数据
3. 识别关键主题和模式
4. 生成VOC引语库、用户画像、JTBD地图、竞争情报摘要

## 输出示例
```
👥 客户洞察: 自动洗车机购买决策

📊 关键发现:
- 73% 的用户首要关注"投资回报周期"
- 58% 因为"设备故障率高"放弃竞品
- 决策者画像: 35-50岁，实体经营者，关注长期成本

💬 VOC关键引语:
"我买了便宜的结果修了半年" — Reddit用户
"远程运维功能是我选你们的原因" — 客户访谈

📋 JTBD地图:
当___时，我想___，以便___。
(完整地图见多维表)
```
