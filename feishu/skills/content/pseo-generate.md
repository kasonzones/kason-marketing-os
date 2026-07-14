---
name: pseo-generate
category: content
version: 1.0.0
triggers:
  - /程序化SEO
  - /pseo-generate
parameters:
  - name: playbook
    type: string
    required: true
    description: 12种程序化SEO策略之一
    enum:
      - templates
      - curation
      - conversions
      - comparisons
      - examples
      - locations
      - personas
      - integrations
      - glossary
      - translations
      - directory
      - profiles
  - name: product_name
    type: string
    required: true
    description: 产品名称
  - name: data_sources
    type: array
    required: false
    description: 数据源（定位于locations/comparisons等策略）
    items:
      type: object
  - name: target_keywords
    type: array
    required: true
    description: 目标关键词列表
    items:
      type: string
  - name: page_scale
    type: number
    required: false
    description: 预计生成页面数量
    default: 50
  - name: language
    type: string
    required: false
    description: 输出语言
    default: zh-CN
  - name: template_variables
    type: object
    required: false
    description: 模板变量数据
output:
  type: object
  properties:
    playbook_summary:
      type: string
      description: 所选策略说明
    page_template:
      type: object
      properties:
        url_pattern:
          type: string
        title_pattern:
          type: string
        h1_pattern:
          type: string
        meta_pattern:
          type: string
        content_structure:
          type: array
        internal_linking_rules:
          type: array
    sample_pages:
      type: array
      items:
        type: object
        properties:
          url:
            type: string
          title:
            type: string
          meta:
            type: string
          snippet:
            type: string
    data_requirements:
      type: array
      items:
        type: string
    quality_rules:
      type: array
      items:
        type: object
        properties:
          rule:
            type: string
          check_method:
            type: string
    deployment_guide:
      type: object
      properties:
        cms_setup:
          type: string
        indexing_strategy:
          type: string
        monitoring_metrics:
          type: array
---

# /程序化SEO (pseo-generate)

## 功能描述

基于12种程序化SEO策略（Programmatic SEO Playbooks），系统化地批量生成高质量着陆页。每种策略针对不同的搜索意图和数据模式，通过"模板定义 + 数据变量 + 质量规则"三步法，实现大规模内容覆盖而不牺牲质量。

程序化SEO的本质：**不是AI瞎写，而是人类设计模板，AI填充变量，规则保证质量。**

---

## 12 种策略速览

| # | Playbook | 核心逻辑 | 适用场景 | 搜索意图 |
|---|----------|----------|----------|----------|
| 1 | Templates | 模板化页面结构 | 产品系列页、方案页 | 信息/商业 |
| 2 | Curation | 策展/聚合内容 | 资源列表、工具推荐 | 信息 |
| 3 | Conversions | 单位/格式转换 | 计算器、换算工具 | 工具 |
| 4 | Comparisons | A vs B 对比 | 竞品对比、方案对比 | 商业 |
| 5 | Examples | 案例/示例集合 | 客户案例、应用场景 | 信息/商业 |
| 6 | Locations | 地理位置 + 服务 | 区域服务页、网点页 | 导航/商业 |
| 7 | Personas | 角色/人群定制 | 行业方案、角色方案 | 商业 |
| 8 | Integrations | 集成/组合方案 | 软件集成、设备组合 | 商业 |
| 9 | Glossary | 术语/百科词条 | 行业百科、知识库 | 信息 |
| 10 | Translations | 多语言版本 | 国际化 SEO | 信息 |
| 11 | Directory | 目录/黄页 | 供应商目录、产品库 | 导航 |
| 12 | Profiles | 档案/卡片 | 人物介绍、公司档案 | 信息 |

---

## 使用示例

### 示例 1：Locations 策略 — 区域服务页

```
/程序化SEO
playbook: locations
product_name: AutoWash Pro X1 全自动洗车机
target_keywords:
  - 全自动洗车机
  - 洗车机安装
  - 洗车设备供应商
data_sources:
  - type: cities
    format: csv
    fields: [city, province, population, gdp_rank]
    count: 300
page_scale: 300
```

### 示例 2：Comparisons 策略 — 竞品对比页

```
/程序化SEO
playbook: comparisons
product_name: AutoWash Pro X1
target_keywords:
  - AutoWash vs WashTec
  - AutoWash vs Istobal
  - AutoWash vs 国内品牌
data_sources:
  - type: competitor_data
    fields: [name, origin, price_range, key_features, pros, cons]
    count: 15
page_scale: 15
```

### 示例 3：Personas 策略 — 行业方案页

```
/程序化SEO
playbook: personas
product_name: AutoWash Pro X1
target_keywords:
  - 加油站洗车方案
  - 商场洗车方案
  - 小区洗车方案
data_sources:
  - type: industry_personas
    fields: [industry, pain_points, budget_range, decision_factors]
    count: 12
page_scale: 12
```

### 示例 4：Integrations 策略 — 设备组合页

```
/pseo-generate
playbook: integrations
product_name: AutoWash Pro X1
target_keywords:
  - 洗车机+水处理
  - 洗车机+支付系统
  - 洗车加油站一体化方案
data_sources:
  - type: integration_pairs
    fields: [integration_name, description, benefit]
    count: 20
language: zh-CN
```

---

## 执行流程

### 第一步：策略选择与数据准备

根据 `playbook` 参数激活对应策略模板，校验 `data_sources` 完整性。

```
📋 策略激活: Locations
  数据要求:
    ✅ city (城市名)
    ✅ province (省份)
    ✅ population (人口)
    ⚠️ gdp_rank (可选，缺省不显示)
  
  模板变量:
    {{city}} {{province}} {{product_name}} {{year}}
  
  准备就绪 → 进入模板设计
```

### 第二步：页面模板设计

设计 URL 模式、标题模板、内容结构、内部链接规则：

```
🏗️ Locations 模板设计
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

URL 模式:
  /{{city}}-automatic-car-wash-machine

标题模板:
  {{city}}全自动洗车机 | {{product_name}} {{province}}指定经销商

H1 模板:
  {{city}}加油站/停车场全自动洗车机安装服务

Meta Description 模板:
  为{{city}}提供{{product_name}}全自动洗车机安装服务。
  覆盖{{province}}全境，48小时上门安装。获取{{city}}专属报价→

内容结构:
  [Hero] {{city}}专业洗车设备供应商
  [Section 1] 为什么{{city}}的加油站都在装全自动洗车机？
    - 城市数据卡片（人口、车辆保有量、加油站数量）
    - 市场趋势
  [Section 2] {{city}}客户案例
    - 从数据库匹配最近的地理位置客户
    - 显示距离和营收数据
  [Section 3] {{product_name}} 在{{province}}的服务网络
    - 周边城市链接（内部链接集群）
  [Section 4] {{city}}专属报价与安装方案
    - 表单/CTA

内部链接规则:
  - 链接到同一省份的 5 个相邻城市页面
  - 链接到产品主页面
  - 链接到省份聚合页面 /{{province}}-automatic-car-wash/
  - 禁止链接到无关城市（跨省份距离>500km）
```

### 第三步：样本页面生成

生成 3-5 个样本页面用于人工审核，确保模板质量：

```
📄 样本页面 #1: 成都
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL: /chengdu-automatic-car-wash-machine
Title: 成都全自动洗车机 | AutoWash Pro X1 四川省指定经销商
H1: 成都加油站/停车场全自动洗车机安装服务

Snippet:
成都作为四川省会，机动车保有量超600万辆，洗车市场需求巨大。
AutoWash Pro X1 已在成都服务47家站点...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 样本页面 #2: 武汉
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
URL: /wuhan-automatic-car-wash-machine
Title: 武汉全自动洗车机 | AutoWash Pro X1 湖北省指定经销商
H1: 武汉加油站/停车场全自动洗车机安装服务

Snippet:
武汉作为中部交通枢纽，加油站密度全国前列。AutoWash Pro X1
已在武汉服务32家站点...
```

### 第四步：质量规则设定

定义自动质量检查规则，防止生成低质量或重复页面：

```
🛡️ 质量规则矩阵
┌──────────────────────────────┬─────────────────────────────┐
│ 规则                          │ 检查方法                     │
├──────────────────────────────┼─────────────────────────────┤
│ 1. 标题唯一性                │ 所有生成的Title去重检查      │
│ 2. 内容相似度 < 70%          │ 页面间TF-IDF余弦相似度       │
│ 3. 关键元素完整性            │ H1/H2/Meta/CTA 非空检测      │
│ 4. 城市数据准确性            │ 城市-省份关系校验             │
│ 5. 文案最低字数 > 300        │ 纯文本字数控检测              │
│ 6. 内部链接有效              │ 链接路径是否存在校验          │
│ 7. 无占位符残留              │ 检测 {{ 和 }} 标记           │
│ 8. Schema 标记完整性         │ JSON-LD 结构化数据校验        │
└──────────────────────────────┴─────────────────────────────┘
```

### 第五步：部署与索引策略

产出部署指南和索引策略：

```
🚀 部署指南
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CMS 设置:
  - 类型: 静态生成 / WordPress Custom Post Type / Webflow CMS
  - 建议: 300页以下用 Webflow，300页以上用 Next.js SSG

索引策略:
  - 批次发布: 每批 50 页，间隔 3 天
  - XML Sitemap: 按省份分拆 sitemap（sitemap-sichuan.xml）
  - 内链锚文本: 所有内链使用 "{{city}}全自动洗车机" 作为锚文本
  - 避免: 一次性发布所有页面（触发沙盒）

监控指标:
  ├─ 页面收录率 (目标: >90%)
  ├─ 页面平均排名 (目标: 前20)
  ├─ 页面跳出率 (目标: <70%)
  ├─ 页面转化率 (目标: >2%)
  └─ 每页面平均自然流量 (目标: >50 UV/月)
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/内容策略` (content-strategy) | 上游 | 策略层确定关键词和主题后再执行程序化生成 |
| `/写文案` (write-copy) | 上游 | 程序化模板中的核心文案可先用写文案生成 |
| `/编辑文案` (edit-copy) | 上游 | 样本页面先经编辑审查再批量生成 |
| `/引导磁力` (lead-magnet) | 下游 | 程序化页面中嵌入引导磁力下载入口 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `cms_config` | object | 是 | CMS/建站平台配置（Webflow/WordPress/自定义） |
| `geo_database` | object | 是 | 地理位置数据库（locations策略必填） |
| `seo_tool_api` | object | 是 | SEO监测工具（用于收录/排名监控） |
| `translation_api` | object | 否 | 翻译API（translations策略使用） |
| `quality_thresholds` | object | 否 | 自定义质量阈值（覆盖默认规则） |
