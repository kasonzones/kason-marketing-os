---
name: site-plan
category: seo
version: 1.0.0
---

# /网站架构 (site-plan)

规划网站页面层级、导航结构、URL 设计和内部链接体系。输出 ASCII 树形图、Mermaid 站点地图、URL 映射表和导航规范文件，确保信息架构清晰、爬虫友好、用户体验优秀。

## 触发词

`/网站架构` `/site-plan`

## 使用示例

```
/网站架构 --domain autowashpro.com --products "X1,X2,Pro" --solutions "加油站,商场,4S店" --locales "en,ar,fr"
```
```
/site-plan --audit-current https://www.autowashpro.com --recommend-improvements
```

> 示例：为 AutoWash Pro 规划全球站群架构，涵盖产品线（X1/X2/Pro）、行业方案（加油站/商场/4S店）和多语言（英/阿/法）站点。

## 执行流程

### 第一步：业务需求分析
- 梳理产品线、解决方案、目标受众
- 确定多语言/多地区需求
- 分析竞品网站架构
- 定义核心转化路径

### 第二步：URL 结构设计
- 设计扁平化 URL 层级（≤3 层）
- 确定多语言 URL 策略（子目录/子域名/独立域名）
- 规范命名约定（小写/连字符/语义化）
- 预留未来扩展空间

### 第三步：导航体系规划
- 设计主导航（一级菜单 ≤7 项）
- 规划页脚导航与辅助导航
- 定义面包屑路径规则
- 设计内容中心/资源库结构

### 第四步：内部链接网络
- 构建话题簇（Pillar-Cluster）模型
- 设计上下文交叉链接规则
- 规划相关产品/推荐链接模块
- 建立分面导航的 SEO 安全策略

### 第五步：文档交付
- 生成 ASCII 树形图
- 绘制 Mermaid 站点地图
- 输出 URL 映射表（含重定向规则）
- 编写导航规范文档

## 输出示例

```
🏗️ AutoWash Pro 全球站架构规划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📁 ASCII 树形图:

autowashpro.com/
├── /en/
│   ├── /products/
│   │   ├── /x1/          ← 旗舰隧道式
│   │   ├── /x2/          ← 中型触点式
│   │   └── /pro/         ← 重型卡车专用
│   ├── /solutions/
│   │   ├── /gas-station/
│   │   ├── /shopping-mall/
│   │   └── /car-dealership/
│   ├── /resources/
│   │   ├── /blog/
│   │   ├── /case-studies/
│   │   └── /faq/
│   └── /company/
│       ├── /about/
│       └── /contact/
├── /ar/   ← 阿拉伯语镜像
└── /fr/   ← 法语镜像

🌐 Mermaid 站点地图:

graph TD
    A[autowashpro.com] --> B[/en/]
    A --> C[/ar/]
    A --> D[/fr/]
    B --> E[Products]
    B --> F[Solutions]
    B --> G[Resources]
    B --> H[Company]
    E --> E1[X1]
    E --> E2[X2]
    E --> E3[Pro]
    F --> F1[Gas Station]
    F --> F2[Mall]
    F --> F3[Dealership]
    G --> G1[Blog]
    G --> G2[Case Studies]
    G --> G3[FAQ]

📊 URL 映射表:

| 源 URL (旧)                    | 目标 URL (新)                      | 状态 |
|--------------------------------|------------------------------------|------|
| /autowash-x1.html              | /en/products/x1/                   | 301  |
| /products/truck-wash/          | /en/products/pro/                  | 301  |
| /cn/                           | (新建中文站)                        | --   |

🧭 导航规范:
├── 主导航: Products | Solutions | Resources | About | Contact
├── 面包屑: Home > Category > Sub-category > Page
├── URL 规范: 小写 / 连字符 / ≤3级 / 含关键词
└── 内部链接: Pillar-Cluster 模型 / 每页 ≥3 上下文链接
```
