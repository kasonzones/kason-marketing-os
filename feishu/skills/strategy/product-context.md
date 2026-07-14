---
name: 产品定位设置
category: strategy
version: 1.0.0
triggers:
  - /产品定位
  - /product-context
  - /set-positioning
parameters:
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: target_audience
    type: string
    required: true
    description: 目标受众描述
  - name: key_problem
    type: string
    required: true
    description: 核心解决的问题
  - name: competitors
    type: string
    required: false
    description: 主要竞品列表(逗号分隔)
  - name: differentiator
    type: string
    required: false
    description: 核心差异化优势
output:
  format: card
  description: 产品定位文档卡片 + 存入多维表
---

# /产品定位 — 设置产品营销上下文

## 功能描述
这是Kason Marketing OS的基础技能。设置产品定位后，所有其他技能都会基于此上下文生成内容。
一次性创建产品的完整营销上下文，包括：目标受众画像、核心痛点、竞争格局、品牌声音、差异化优势。

## 使用方法

### 基础设置
```
/产品定位
产品: [产品名称]
受众: [目标用户描述]
问题: [解决的核心问题]
```

### 完整设置
```
/产品定位
产品: AutoWash Pro X1 全自动洗车机
受众: 加油站/商场/4S店老板，30-55岁，关注效率和成本控制
问题: 传统洗车人力成本高、效率低、用户体验差
竞品: Istobal, WashTec, 竹美
差异化: AI智能识别车型、5分钟快速洗车、远程运维
```

## 执行流程

1. **解析输入** — 提取产品名称、受众、问题、竞品、差异化
2. **丰富上下文** — 基于输入扩展完整的12部分产品营销文档:
   - 产品概述 & 核心价值主张
   - 目标受众详细画像 (ICP)
   - 核心痛点 & 需求分析
   - 竞争格局 & 市场定位
   - 差异化优势 & 独特卖点
   - 品牌声音 & 语调指南
   - 定价策略概述
   - 客户旅程 & 购买决策
   - 关键营销渠道
   - 核心KPI
   - 内容支柱
   - 常见反对意见
3. **存储到多维表** — 写入 skills_registry 表
4. **返回确认卡片** — 展示完整的定位摘要

## 输出示例

```
✅ 产品定位已设置: AutoWash Pro X1

📋 核心信息:
- ICP: 加油站/商场/4S店老板 (30-55岁)
- 核心痛点: 人力成本高、效率低
- 差异化: AI识别 + 5分钟速洗 + 远程运维

📊 上下文已就绪，所有技能将基于此定位工作。
使用 /marketing-plan 开始制定营销计划。
```

## 配置要求
- 必需多维表: skills_registry
- 无外部API依赖

## 注意事项
- 产品定位是全局基础设置，修改后影响所有技能输出
- 建议在项目开始时一次性设置完整
- 可以随时用 `/产品定位 更新` 修改部分内容
