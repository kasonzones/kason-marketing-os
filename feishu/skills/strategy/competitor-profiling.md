---
name: 竞品分析报告
category: strategy
version: 1.0.0
triggers:
  - /竞品分析
  - /competitor-report
  - /分析竞品
parameters:
  - name: competitor_urls
    type: string
    required: true
    description: 竞品网站URL列表(逗号分隔)
  - name: depth
    type: string
    required: false
    description: 分析深度: quick(快速) 或 deep(深度)
output:
  format: card + table
  description: 竞品分析对比表 + 策略建议
---

# /竞品分析 — 深度竞品研究报告

## 功能描述
从URL出发，对竞品进行全方位调研：网站内容爬取、SEO数据提取、评价分析、技术栈检测，生成结构化竞品对比报告。

## 使用方法
```
/竞品分析 https://competitor1.com,https://competitor2.com deep
```

## 执行流程

### 快速扫描 (quick)
1. 爬取竞品首页 + 定价页
2. 提取核心信息: 价值主张、定价、核心功能
3. 生成对比表

### 深度档案 (deep)
1. 全站内容爬取 + 页面分析
2. SEO数据提取 (关键词、反向链接、流量估算)
3. 评价分析 (G2/Capterra/Trustpilot)
4. 技术栈检测 (使用的工具、框架)
5. 内容策略分析 (博客频率、内容类型、SEO策略)
6. 社交媒体分析 (平台、频率、互动)
7. 生成综合对比报告 + SWOT

## 输出示例
```
🔍 竞品深度分析报告

┌──────────────┬────────────┬────────────┬────────────┐
│    维度      │   我们      │  竞品A     │  竞品B     │
├──────────────┼────────────┼────────────┼────────────┤
│ 价值主张     │ AI速洗     │ 环保洗车   │ 高端体验   │
│ 起价         │ ¥XX/月     │ ¥XX/月     │ ¥XX/月     │
│ SEO关键词    │ 1,200      │ 3,500      │ 2,100      │
│ 月流量       │ 5K         │ 25K        │ 12K        │
│ G2评分       │ 4.2        │ 4.5        │ 4.0        │
│ 技术栈       │ WordPress  │ Shopify    │ Custom     │
│ 博客频率     │ 2篇/月     │ 4篇/月     │ 1篇/月     │
└──────────────┴────────────┴────────────┴────────────┘

💡 策略建议:
1. [SEO差距] 竞品A在"商用洗车机"关键词领先3倍，建议重点优化
2. [内容机会] 竞品B博客频率低，可抢占内容空白
3. [差异化方向] 竞品都未强调AI/远程运维，这是我们的蓝海

⚠️ 需要立即行动: 补齐"商用洗车机方案"相关页面
```

## 配置要求
- 依赖: Firecrawl / DataForSEO API (网站爬取)
- 多维表: campaigns, content

## 相关技能
- /vs-page (竞品对比页)
- /seo-audit (SEO审计)
- /营销计划 (纳入计划)
