---
name: 定价策略
category: strategy
version: 1.0.0
triggers: ["/定价策略", "/pricing", "/定价分析"]
parameters:
  - name: current_price
    type: string
    required: false
    description: 当前定价信息
  - name: market_segment
    type: string
    required: false
    description: 目标市场: enterprise/smb/startup
output: {format: "card", description: "定价方案 + 三层套餐 + 研究建议"}
---

# /定价策略 — 定价与套餐设计

## 功能描述
设计定价策略——三层套餐结构、定价指标选择、价位分析、Van Westendorp和MaxDiff研究建议。

## 使用方法
```
/定价策略 当前价格:基础版¥29999/台 市场:中小企业
```

## 执行流程
1. 分析市场定价数据
2. 推荐定价指标(按台/按次/订阅)
3. 设计三层套餐(入门/专业/企业)
4. 给出研究建议(Van Westendorp测试)
5. 提供A/B测试方案

## 输出示例
```
💰 定价方案建议: AutoWash Pro X1

┌──────────┬──────────┬──────────┬──────────┐
│          │ 基础版    │ 专业版    │ 企业版    │
├──────────┼──────────┼──────────┼──────────┤
│ 价格     │ ¥29,999  │ ¥45,999  │ 定制     │
│ 洗车速度 │ 5min     │ 4min     │ 3.5min   │
│ AI识别   │ ✓        │ ✓        │ ✓        │
│ 远程运维 │ -        │ ✓        │ ✓        │
│ API接口  │ -        │ -        │ ✓        │
│ 保修     │ 1年      │ 2年      │ 3年      │
└──────────┴──────────┴──────────┴──────────┘

📊 建议: 专业版为主打，占预期销量60%
```
