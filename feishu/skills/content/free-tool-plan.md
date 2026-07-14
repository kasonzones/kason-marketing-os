---
name: free-tool-plan
category: content
version: 1.0.0
triggers:
  - /免费工具
  - /free-tool-plan
parameters:
  - name: tool_type
    type: string
    required: true
    description: 工具类型
    enum:
      - calculator
      - generator
      - analyzer
      - tester
      - configurator
      - quiz
  - name: product_name
    type: string
    required: true
    description: 关联产品名称
  - name: tool_idea
    type: string
    required: true
    description: 工具概念描述
  - name: target_audience
    type: string
    required: true
    description: 目标用户
  - name: value_proposition
    type: string
    required: true
    description: 工具为用户解决什么具体问题
  - name: capture_strategy
    type: string
    required: false
    description: 线索捕获策略
    default: partial-gate
    enum:
      - full-gate
      - partial-gate
      - no-gate
  - name: tech_preference
    type: string
    required: false
    description: 技术实现偏好
    default: web-based
    enum:
      - web-based
      - spreadsheet
      - chatbot
      - mini-program
output:
  type: object
  properties:
    tool_concept:
      type: object
      properties:
        name:
          type: string
        tagline:
          type: string
        description:
          type: string
        uniqueness:
          type: string
    user_flow:
      type: array
      items:
        type: object
        properties:
          step:
            type: string
          input:
            type: string
          output:
            type: string
          emotion:
            type: string
    capture_design:
      type: object
      properties:
        strategy:
          type: string
        gate_placement:
          type: string
        form_fields:
          type: array
        value_exchange_copy:
          type: string
        post_capture_flow:
          type: string
    technical_spec:
      type: object
      properties:
        inputs:
          type: array
        formula:
          type: string
        output_format:
          type: string
        data_sources:
          type: array
        frontend_stack:
          type: string
    launch_plan:
      type: object
      properties:
        landing_page_elements:
          type: array
        promotion_channels:
          type: array
        kpis:
          type: array
    mockup:
      type: string
      description: 工具界面线框描述
---

# /免费工具 (free-tool-plan)

## 功能描述

为企业规划免费线上工具的设计与发布方案。支持计算器、生成器、分析器、测试器、配置器、测评六种工具类型，覆盖三种线索捕获策略（全门控/半门控/无门控），输出完整的产品方案、用户流程和技术规格。

免费工具的黄金公式：**一个极具体的痛点 × 一个3秒出结果的工具 × 一个自然的线索捕获点 = 持续稳定的高质量线索来源**

---

## 工具类型速览

| 类型 | 示例 | 最佳场景 | 开发复杂度 |
|------|------|----------|------------|
| Calculator 计算器 | ROI计算器、TCO计算器、节水量计算器 | B2B高客单价决策 | 中 |
| Generator 生成器 | 洗车店名称生成器、标语生成器 | 创意类需求 | 低 |
| Analyzer 分析器 | 洗车机运营诊断、场地适配分析 | 效果评估需求 | 中 |
| Tester 测试器 | 洗车机选型测试、投资准备度测试 | 决策辅助 | 低 |
| Configurator 配置器 | 洗车机配置推荐、场地方案生成 | 产品定制需求 | 高 |
| Quiz 测评 | "你的场地适合哪种洗车机？" | 互动教育 | 低 |

---

## 使用示例

### 示例 1：ROI 计算器

```
/免费工具
tool_type: calculator
product_name: AutoWash Pro X1 全自动洗车机
tool_idea: 洗车机投资回报计算器——输入场地信息、洗车定价、客流量，自动计算回本周期和年利润
target_audience: 考虑投资洗车机的加油站/停车场老板
value_proposition: 不需要找财务算账，3分钟知道自己能不能赚钱
capture_strategy: partial-gate
```

### 示例 2：洗车机选型测评

```
/免费工具
tool_type: quiz
product_name: AutoWash Pro X1
tool_idea: "你的场地最适合哪种洗车机？"——5道题测评，根据场地大小、预算、客流量推荐最佳机型
target_audience: 对洗车机不了解的首次购买者
value_proposition: 比销售说100句都管用，自己做题选最合适的
capture_strategy: full-gate
```

### 示例 3：洗车店名称生成器

```
/免费工具
tool_type: generator
product_name: AutoWash Pro X1
tool_idea: 输入行业/地区/偏好风格，自动生成20个洗车店名称建议（含域名可用性检查）
target_audience: 准备开洗车店的创业者
value_proposition: 帮你想好店名+域名，开洗车店第一步不再纠结
capture_strategy: no-gate
```

---

## 执行流程

### 第一步：工具定位与差异化

挖掘工具的核心定位，确保不是"又一个计算器"：

```
🎯 工具定位画布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

工具名: 洗车机投资回报速算器

一句话: 输入4个数字，3秒看到你能赚多少钱

用户当前行为: 开Excel算、问同行、找财务、凭感觉猜
            ↓
工具替代方案: 一个页面，4个滑块，即时出结果
            ↓
差异化: 不是"理论ROI"，是基于1,200+站点真实数据的预测

竞品分析:
  ❌ 竞品A: 需要填写15个字段 → 放弃率 80%
  ❌ 竞品B: 结果太简单，只有回本周期 → 不够有说服力
  ✅ 我们: 4个输入 + 详细收益拆解 + 可下载PDF报告
```

### 第二步：用户流程设计

绘制完整的用户旅程，标注每个节点的输入、输出和情绪：

```
👤 用户流程
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: 进入页面
  📥 看到: "你的加油站装洗车机能赚多少钱？3分钟知道答案"
  😊 情绪: 好奇、怀疑
  → 点击"开始计算"

Step 2: 填写参数 (4个问题)
  📥 输入:
    ① 日均加油车辆数 ▓▓▓▓▓░░░░ 200辆
    ② 洗车定价 ▓▓▓▓▓░░░ 25元/次
    ③ 场地可用面积 ▓▓▓▓▓░░░ 50㎡
    ④ 所在城市等级 ▓▓▓▓▓░░░ 二线城市
  😊 情绪: "这也太简单了吧"
  → 点击"查看结果"

Step 3: 即时结果 (部分门控)
  📤 展示:
    预测月洗车量: 2,400 辆
    预测月营收: ¥60,000
    预测回本周期: 8.3 个月
    预测年净利润: ¥420,000
  📧 如需详细报告（含成本拆解/风险分析/同城案例）:
    输入邮箱 → 发送PDF报告
  😊 情绪: 兴奋 + 想知道更多

Step 4: 邮件跟进
  📤 发送详细PDF报告 + AutoWash产品资料
  📲 24小时后：销售电话跟进
  😊 情绪: 被重视、愿意进一步了解
```

### 第三步：线索捕获策略设计

根据 `capture_strategy` 设计门控方案：

```
🚪 线索捕获策略对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

策略: Partial-Gate (半门控) ← 推荐
┌────────────────────────────────────────┐
│ [免费可见]                              │
│ ├─ 核心计算结果（回本周期/月营收）        │
│ ├─ 可视化图表（收益柱状图/回本曲线）       │
│ └─ 分享按钮（"给别人也算算"）             │
│                                         │
│ [门控 — 需提交邮箱]                      │
│ ├─ 详细PDF报告（含成本拆解表）            │
│ ├─ 同城案例对比（你们城市的同行赚了多少）   │
│ ├─ 个性化建议（"你的场地建议选X1机型"）    │
│ └─ 产品资料 + 专属优惠码                  │
└────────────────────────────────────────┘

表单字段: 姓名 + 手机号 + 公司名
         （字段越少转化率越高，3个是最优平衡点）

价值交换文案: "解锁完整报告，包含同城真实案例和专属方案"
```

### 第四步：技术规格与数据源

定义输入参数、计算公式和数据来源：

```
⚙️ 技术规格 — 洗车机ROI计算器
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入参数:
┌──────────────────┬────────┬────────┬──────┐
│ 参数              │ 类型    │ 范围    │ 默认  │
├──────────────────┼────────┼────────┼──────┤
│ 日均加油车辆数    │ slider │ 50-1000│ 200  │
│ 洗车定价          │ slider │ 15-50  │ 25   │
│ 场地面积          │ select │ S/M/L  │ M    │
│ 城市等级          │ select │ 1-5线   │ 2线  │
└──────────────────┴────────┴────────┴──────┘

计算公式 (核心):
  日均洗车量 = MIN(日均加油车辆数 × 0.15, 场地最大容量)
  月营收 = 日均洗车量 × 洗车定价 × 30
  月运营成本 = 水费 + 电费 + 耗材 + 维护摊销
  月净利润 = 月营收 - 月运营成本
  回本周期(月) = 设备总价 ÷ 月净利润

数据源:
  ├─ 转化率基准: 行业调研数据 (15%加油转洗车)
  ├─ 成本基准: 设备实测数据 (水电/耗材/维护)
  ├─ 设备价格: AutoWash 官方定价表
  └─ 场地容量: 机型规格对照表
```

### 第五步：发布计划与营销

制定工具发布的全链路计划：

```
🚀 发布计划
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

着陆页结构:
  [Hero] "你的加油站装洗车机能赚多少？"
  [Tool] 嵌入式计算器交互区
  [Social Proof] "已有 3,847 位老板算过了"
  [FAQ] 计算逻辑透明化（增加信任）
  [Bottom CTA] 未门控用户的最后捕获机会

推广渠道:
  ├─ 官网导航栏置顶 "💰 ROI计算器"
  ├─ 公众号推文: "我帮3000个加油站老板算了笔账"
  ├─ 知乎: "开一个全自动洗车店需要多少钱？" → 嵌入工具
  ├─ 抖音: 15秒演示视频 → "你的场地能赚多少？点链接算"
  └─ 销售物料: 名片上印计算器二维码

核心KPI:
  ├─ 工具页面UV: 目标 5,000/月
  ├─ 工具使用率: 目标 40% (使用/访问)
  ├─ 门控转化率: 目标 25% (提交/使用)
  ├─ 线索→商机转化: 目标 15%
  └─ 工具分享率: 目标 8% (分享/使用)
```

---

## 关联技能

| 技能 | 关系 | 说明 |
|------|------|------|
| `/内容策略` (content-strategy) | 上游 | 策略中识别的工具内容需求 |
| `/引导磁力` (lead-magnet) | 平行 | 免费工具是引导磁力的一种形式 |
| `/写文案` (write-copy) | 下游 | 为工具着陆页撰写文案 |
| `/生成图片` (gen-image) | 下游 | 为工具页面生成配图和演示图 |
| `/程序化SEO` (pseo-generate) | 下游 | 工具页面可通过程序化SEO放大 |

---

## 配置要求

| 配置项 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| `product_data` | object | 是 | 产品规格/价格/成本数据（计算器公式需要） |
| `industry_benchmarks` | object | 是 | 行业基准数据（转化率/回本周期等） |
| `crm_integration` | object | 否 | CRM对接配置（线索自动录入） |
| `email_service` | object | 否 | 邮件服务配置（报告自动发送） |
| `analytics` | object | 否 | 分析工具配置（工具使用行为追踪） |
