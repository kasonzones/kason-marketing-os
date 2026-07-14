---
name: lead-magnet
category: content
version: 1.0.0
triggers:
  - /引导磁力
  - /lead-magnet
parameters:
  - name: magnet_type
    type: string
    required: true
    description: 引导磁力类型
    enum:
      - checklist
      - cheatsheet
      - template
      - ebook
      - quiz
      - webinar
      - calculator
      - swipe-file
      - report
      - toolkit
  - name: product_name
    type: string
    required: true
    description: 关联产品名称
  - name: target_audience
    type: string
    required: true
    description: 目标受众
  - name: audience_pain_point
    type: string
    required: true
    description: 受众的核心痛点
  - name: promised_outcome
    type: string
    required: true
    description: 下载后可获得的成果
  - name: content_angle
    type: string
    required: false
    description: 切入角度/差异化
  - name: form_fields
    type: array
    required: false
    description: 表单字段
    default:
      - name
      - email
      - phone
    items:
      type: string
  - name: language
    type: string
    required: false
    description: 输出语言
    default: zh-CN
output:
  type: object
  properties:
    magnet_concept:
      type: object
      properties:
        title:
          type: string
        subtitle:
          type: string
        format:
          type: string
        estimated_length:
          type: string
        uniqueness:
          type: string
    landing_page_copy:
      type: object
      properties:
        headline:
          type: string
        bullet_points:
          type: array
        social_proof:
          type: string
        cta_button:
          type: string
        urgency_element:
          type: string
    content_outline:
      type: array
      items:
        type: object
        properties:
          section:
            type: string
          key_takeaways:
            type: array
          product_bridge:
            type: string
    email_sequence:
      type: array
      items:
        type: object
        properties:
          email_number:
            type: number
          subject:
            type: string
          timing:
            type: string
          goal:
            type: string
    delivery_experience:
      type: object
      properties:
        thank_you_page:
          type: string
        email_content:
          type: string
        next_step_cta:
          type: string
    kpis:
      type: object
      properties:
        target_conversion_rate:
          type: string
        target_downloads:
          type: string
        target_sql_rate:
          type: string
---

# /引导磁力 (lead-magnet)

## 功能描述

为企业规划高转化的引导磁力（Lead Magnet），通过提供免费的高价值内容换取用户邮箱/手机号。覆盖清单、速查表、模板、电子书、测评、线上研讨会等10种类型，输出完整的概念方案、着陆页文案、内容大纲和邮件跟进序列。

引导磁力的本质不是"送东西"，而是**在正确的时机、用正确的内容、换取与正确的人的对话权。**

---

## 引导磁力类型速览

| 类型 | 制作周期 | 转化率 | 最佳时机 |
|------|----------|--------|----------|
| Checklist 清单 | 1天 | 中高 | 购买前的信息搜集阶段 |
| Cheatsheet 速查表 | 1天 | 高 | 工具使用/决策效率场景 |
| Template 模板 | 2天 | 高 | 用户需要输出成果时 |
| Ebook 电子书 | 3-5天 | 中 | 深度教育/品牌权威建设 |
| Quiz 测评 | 2天 | 极高 | 用户需要个性化建议时 |
| Webinar 研讨会 | 5天 | 高 | 高价/复杂产品教育 |
| Calculator 计算器 | 3天 | 极高 | 数据驱动的购买决策 |
| Swipe File 素材库 | 1天 | 中 | 创意/营销类受众 |
| Report 报告 | 3天 | 中高 | B2B行业数据和洞察 |
| Toolkit 工具包 | 3天 | 高 | 组合价值 > 单一内容 |

---

## 使用示例

### 示例 1：洗车机选购清单

```
/引导磁力
magnet_type: checklist
product_name: AutoWash Pro X1 全自动洗车机
target_audience: 第一次购买洗车机的加油站老板
audience_pain_point: 看了5个厂家，每家都说自己最好，不知道怎么选
promised_outcome: 拿着这份清单去谈，永远不会被忽悠
content_angle: 行内人不公开的12条选型标准
form_fields:
  - name
  - phone
  - station_name
  - city
```

### 示例 2：洗车店运营速查表

```
/引导磁力
magnet_type: cheatsheet
product_name: AutoWash Pro X1
target_audience: 已购买洗车机但运营效率不高的店主
audience_pain_point: 机器装好了，不知道怎么定价、怎么吸引客户
promised_outcome: 照这张表做，洗车营收30天提升30%
```

### 示例 3：洗车行业趋势报告

```
/引导磁力
magnet_type: report
product_name: AutoWash Pro X1
target_audience: 考虑投资洗车行业的房地产/加油站集团决策层
audience_pain_point: 想知道这个行业还有没有增长空间、政策风险多大
promised_outcome: 一份报告看清洗车行业未来5年的趋势和机会窗口
content_angle: 独家数据 + 行业专家解读
language: zh-CN
```

### 示例 4：线上研讨会

```
/引导磁力
magnet_type: webinar
product_name: AutoWash Pro X1
target_audience: 全国加油站加盟商/运营管理者
audience_pain_point: 不知道如何合规地增加加油站非油业务收入
promised_outcome: 1小时学会加油站增设洗车业务的完整流程和政策要点
```

---

## 执行流程

### 第一步：磁力概念验证

做三件事：验证需求真实性、验证受众愿意交换邮箱、验证与产品自然关联。

```
🧲 磁力概念验证 — 清单模式
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

概念: "洗车机选购终极清单：行内人不公开的12条选型标准"

需求验证:
  ✅ 搜索量: "洗车机怎么选" 月搜索 2,400
  ✅ 竞品缺口: 没有竞品提供此类清单
  ✅ 受众验证: 3个潜在客户访谈，100%表示"非常需要"

交换意愿验证:
  ✅ 痛点强度: 决策风险高（选错亏几十万）
  ✅ 内容稀缺性: 行业内无公开的客观选型标准
  ✅ 即刻价值: 拿到就能用，不需要学习

产品关联度:
  ✅ 清单自然覆盖 AutoWash Pro X1 的核心优势点
  ✅ 6/12条标准是 AutoWash 的差异化优势
  ✅ 不会显得"硬广塞私货"

结论: ✅ 磁力概念验证通过 → 进入设计阶段
```

### 第二步：着陆页文案

为推广此磁力的着陆页撰写文案：

```
📄 着陆页文案
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

标题: 你不需要更便宜的洗车机，你需要一份不被人坑的选型清单

要点:
  ✅ 12条参数逐项拆解：哪些是真重要，哪些是厂家吹的
  ✅ 含对比模板：拿着去跟5个厂家谈，一眼看出谁在说实话
  ✅ 附录：各品牌选型参数真实数据对照表
  ✅ 匿名收录：我们悄悄对比了市面上7个主流品牌的实际参数

CTA按钮: 📥 免费下载选型清单

紧急元素: "本周下载额外附赠《洗车机合同陷阱5条》检查清单"

社会证明: "已有 2,834 位加油站老板下载，好评率 98.6%"
```

### 第三步：内容大纲与产品桥接

设计磁力内容的结构，以及如何自然地桥接到产品：

```
📑 内容大纲 — 洗车机选购清单
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section 1: 选型之前必问自己的3个问题
  要点: 场地/预算/预期流量 ← 帮用户先理清需求
  桥接: "AutoWash提供免费场地评估服务，点击预约→"

Section 2: 核心参数逐项拆解（第1-6条）
  要点: 洗车速度、耗水耗电、毛刷材质、风干功率、控制系统、故障率
  桥接: 每条标注AutoWash Pro X1对应参数

Section 3: 容易忽视的关键参数（第7-10条）
  要点: 售后服务响应时间、软件是否收费、是否有远程诊断、备件价格
  桥接: "AutoWash承诺全系软件终身免费升级，这是我们写在合同里的"

Section 4: 厂家资质核查清单（第11-12条）
  要点: 认证资质、客户案例真实性验证方法

Section 5: 竞品参数对比模板 + 谈判话术
  要点: 空白对比表（用户自己填） + "不知道就问这5句话"
  桥接: "不管最后选谁家，先把AutoWash的价格拿去做对比基准"
```

### 第四步：邮件跟进序列

设计交付后的邮件序列，逐步推进关系：

```
📧 邮件跟进序列 (7封/14天)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Day 0 (即时): 发送磁力
  主题: 📥 你的《洗车机选购清单》到了
  内容: 交付清单 + 使用指南 + "有疑问直接回复这封邮件"

Day 2: 补充价值
  主题: 看完清单的人通常会问这3个问题
  内容: 预判用户的疑问并回答，建立权威

Day 4: 社会证明
  主题: "用你的清单谈了3家，省了8万" —— 来自一位站长
  内容: 客户使用反馈 + 真实截图

Day 7: 产品过渡
  主题: 回到清单第4条——毛刷材质的秘密
  内容: 深度展开某一个AutoWash有绝对优势的参数

Day 10: 限时激励
  主题: 本月限时：免费场地评估 + 专属优惠
  内容: CTA引导预约产品演示

Day 14: 温和关闭
  主题: 最后问一句：你还在看洗车机吗？
  内容: 无压力检查 + "不买也没关系，有问题随时问"
```

### 第五步：效果衡量

定义衡量磁力成功与否的指标：

```
📊 KPI 仪表盘
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

转化漏斗:
  着陆页访问量: → 目标 5,000/月
  页面转化率: → 目标 15% (提交/访问)
  磁力下载量: → 目标 750/月
  邮件打开率: → 目标 45%
  邮件点击率: → 目标 12%
  最终商机转化: → 目标 8% (商机/下载)

A/B 测试计划:
  测试1: 标题A (清单驱动) vs 标题B (结果驱动)
  测试2: 表单字段数 3个 vs 5个
  测试3: 即时下载 vs 邮件发送
  测试4: 有紧急元素 vs 无紧急元素
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/写文案` (write-copy) | 下游 | 为磁力着陆页撰写文案 |
| `/免费工具` (free-tool-plan) | 平行 | 计算器/测评类磁力的技术实现 |
| `/内容策略` (content-strategy) | 上游 | 策略层确定磁力内容方向 |
| `/生成图片` (gen-image) | 下游 | 为磁力设计封面图/配图 |
| `/编辑文案` (edit-copy) | 下游 | 审查着陆页和邮件文案 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `email_service` | object | 是 | 邮件营销平台 API（Mailchimp/ConvertKit/SendGrid） |
| `crm_integration` | object | 是 | CRM对接配置（线索自动录入和状态追踪） |
| `landing_page_builder` | object | 否 | 着陆页搭建工具（Unbounce/Instapage/WordPress） |
| `content_delivery` | object | 否 | 内容交付方式配置（直接下载/邮件/会员区） |
