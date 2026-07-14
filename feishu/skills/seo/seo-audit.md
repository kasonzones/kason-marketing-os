---
name: seo-audit
category: seo
version: 1.0.0
---

# /SEO审计 (seo-audit)

对网站进行全方位 SEO 健康检查，按优先级输出问题清单和修复建议。覆盖 5 个层级：可爬取/索引 → 技术 SEO → 页面 SEO → 内容质量 → 权威/链接。同时包含 Core Web Vitals 检测、国际化 SEO（hreflang/canonical）和 E-E-A-T 信号评估。

## 触发词

`/SEO审计` `/seo-audit`

## 使用示例

```
/SEO审计 https://www.autowashpro.com/products/x1
```
```
/seo-audit https://autowashpro.com --check-core-web-vitals --hreflang
```

> 示例：对 AutoWash Pro X1 产品页面执行全量 SEO 审计，同步检测 Core Web Vitals 和国际化配置。

## 执行流程

### 第一步：可爬取性与索引分析
- 检查 robots.txt 是否误拦截关键页面
- 验证 XML Sitemap 是否提交至 Google Search Console
- 检测 noindex/nofollow 标签的误用情况
- 分析抓取预算分配是否合理

### 第二步：技术 SEO 检测
- 扫描 HTTP 状态码（404/301/302/500）
- 检测重复内容与 canonical 标签配置
- 验证结构化数据标记完整性
- 检查 HTTPS/SSL 证书有效性

### 第三步：页面 SEO 审查
- 标题标签（title）长度与关键词分布
- Meta description 吸引力与 CTR 优化
- 标题层级（H1-H6）语义结构
- 图片 alt 属性与压缩优化
- URL 结构规范性

### 第四步：内容质量评估
- E-E-A-T 信号评分（经验/专业/权威/信任）
- 内容原创性、完整性、时效性
- 关键词密度与语义相关性
- 多语言内容（hreflang）配置

### 第五步：权威度与链接分析
- 内部链接结构健康度
- 外链质量与锚文本分布
- Core Web Vitals 实测数据（LCP/FID/CLS）
- 移动端适配评分

## 输出示例

```
🔍 AutoWash Pro X1 产品页 SEO 审计报告
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 综合评分: 72/100

🔴 严重问题 (3)
├── P1 | robots.txt 误拦截 /products/* → 立即修复
├── P1 | 缺失 hreflang 标签 (en/ar/fr) → 影响国际站排名
└── P2 | LCP 3.8s 超标 → 优化 Hero 图片加载

🟡 待改进 (5)
├── P2 | Meta description 超过 160 字符
├── P2 | 3 张图片缺少 alt 属性
├── P3 | 内部链接锚文本过度优化
├── P3 | H2 层级缺少语义关键词
└── P3 | E-E-A-T 缺少作者信息页

🟢 表现良好 (12)
├── HTTPS 启用 ✅
├── 移动端适配 ✅
├── Schema.org 标记完整 ✅
└── ...

📋 修复优先级建议
  [立即] 修复 robots.txt → 预计恢复索引覆盖
  [本周] 添加 hreflang 配置 → 多语言站群同步
  [本月] 优化 Core Web Vitals → 排名提升预期 5-12%
```
