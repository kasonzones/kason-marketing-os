---
name: add-schema
category: seo
version: 1.0.0
---

# /添加Schema (add-schema)

为目标页面添加或修复 schema.org 结构化数据标记（JSON-LD 格式）。支持 10 种核心类型：Organization、WebSite、Article、Product、SoftwareApplication、FAQPage、HowTo、BreadcrumbList、LocalBusiness、Event。生成的代码可直接嵌入页面 `<head>` 或 `<body>`。

## 触发词

`/添加Schema` `/add-schema`

## 使用示例

```
/添加Schema --type Product --page https://www.autowashpro.com/products/x1 --include-review
```
```
/add-schema --type FAQPage --generate-from "AutoWash Pro X1 常见问题"
```

> 示例：为 AutoWash Pro X1 产品页面生成 Product Schema（含评分），同时创建 FAQPage Schema 提升搜索结果的富文本展示。

## 执行流程

### 第一步：页面分析与类型匹配
- 读取目标页面 URL 内容
- 分析页面性质（产品页/文章/企业站/活动页）
- 推荐匹配的 Schema 类型组合
- 检查是否已存在 Schema 标记

### 第二步：数据采集与验证
- 提取页面已有结构化信息（价格/评分/作者/日期）
- 补充缺失的必要字段
- 验证数据格式（日期 ISO 8601 / 价格币种 / URL 绝对路径）
- 确保必填字段完整

### 第三步：JSON-LD 代码生成
- 生成标准 JSON-LD 格式代码块
- 添加 @context 和 @type 声明
- 嵌套关联类型（如 Product 内嵌 Offer、Review、AggregateRating）
- 输出可直接复制的代码片段

### 第四步：Schema 有效性测试
- 通过 Google Rich Results Test 验证
- 使用 Schema.org Validator 二次校验
- 检测字段冲突与冗余标记
- 预览搜索结果富文本展示效果

### 第五步：部署与监控
- 提供页面嵌入位置建议（推荐 `<head>` 内）
- 提交 Google Search Console 重新索引
- 监控富文本展示率变化
- 设置 Schema 健康度定期巡检

## 输出示例

```
🏷️ AutoWash Pro X1 结构化数据生成报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 推荐 Schema 组合
├── Product (主类型)
├── AggregateRating (评分)
├── Offer (价格)
├── BreadcrumbList (面包屑)
└── FAQPage (常见问题)

📝 生成的 JSON-LD 代码:

{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "AutoWash Pro X1 全自动洗车机",
  "description": "专业级隧道式全自动洗车机，每小时清洗 60+ 辆车...",
  "sku": "AWP-X1-2024",
  "brand": {
    "@type": "Brand",
    "name": "AutoWash Pro"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "247"
  },
  "offers": {
    "@type": "Offer",
    "price": "29999",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  }
}

✅ Google Rich Results Test: 通过
✅ Schema.org Validator: 0 错误 / 0 警告
📊 预期富文本展示: 
├── 评分星标 ⭐⭐⭐⭐⭐ (4.8/247评价)
├── 价格展示 $29,999
└── FAQ 手风琴展示
```
