---
name: /邮件序列
category: email
version: 1.0.0
---

# /邮件序列 (email-sequence)

自动化邮件序列生成技能，帮助企业构建高效的生命周期邮件营销体系。支持从欢迎到召回的全流程自动化邮件编排。

## 触发词

`/邮件序列` `/email-sequence`

## 能力范围

### 1. 欢迎序列 (Welcome Sequence)
- 邮件数量：5-7 封
- 目标：新订阅者激活，建立品牌认知与信任
- 结构：欢迎首封 → 品牌故事 → 产品价值 → 社交证明 → 限时激励 → 持续价值预告
- 关键指标：打开率 > 40%，点击率 > 8%

### 2. 培育序列 (Nurture Sequence)
- 邮件数量：6-8 封
- 目标：长期价值传递，推动潜在客户到购买决策
- 结构：痛点共鸣 → 解决方案引入 → 案例展示 → 教育内容 → 对比分析 → 行业洞察 → 试用邀请 → 转化引导
- 关键指标：点击率 > 5%，转化率 > 1.5%

### 3. 再参与序列 (Re-engagement Sequence)
- 邮件数量：3-4 封
- 目标：唤醒沉睡用户，清理无效邮箱
- 结构：温情召回 → 新产品/功能亮点 → 专属回归优惠 → 最后一次尝试
- 关键指标：回流率 > 3%

### 4. 入职引导序列 (Onboarding Sequence)
- 邮件数量：5-7 封
- 目标：新客户首月留存与产品激活
- 结构：欢迎 → 快速启动指南 → 核心功能教程 → 最佳实践 → 进阶技巧 → 成功案例激励 → 反馈收集
- 关键指标：激活率 > 60%，首月留存 > 75%

## 邮件类型

| 类型 | 用途 | 适用阶段 |
|------|------|----------|
| 教育型 | 传授知识与技能 | 培育、入职 |
| 故事型 | 建立情感连接 | 欢迎、培育 |
| 案例型 | 展示效果与信任 | 培育、入职 |
| 促销型 | 驱动直接转化 | 欢迎、召回 |
| 交易型 | 订单/账户通知 | 入职 |
| 社交证明型 | 利用口碑与评价 | 欢迎、培育 |

## 文案指南

- 主题行：控制在 30-50 字符，使用个性化标签，避免垃圾邮件词
- 预览文本：补充主题行，制造好奇心缺口
- 正文：每段 2-3 句，保持 F 型可扫描布局
- CTA：每封邮件 1 个主 CTA，1 个辅 CTA
- 移动端：主题行 < 27 字符可见，图片宽度 600px

## 集成平台

- **Mailchimp**：模板定制、受众分段、自动化触发器
- **Resend**：API 驱动发送、React 邮件模板、Webhook 事件追踪
- **SendGrid**：大规模发送、动态模板、SMTP/API 双通道

## 序列模板示例

### AutoWash Pro X1 欢迎序列

```yaml
sequence: welcome
product: AutoWash Pro X1
emails:
  - day: 0
    type: welcome
    subject: "欢迎加入 {Brand} — 让洗车更智能"
    content: |
      感谢您关注 AutoWash Pro X1！
      我们帮助全球超过 5,000 家洗车场实现自动化升级。
      接下来 7 天，我们将带您了解如何用 X1 提升效率 300%。
  - day: 2
    type: story
    subject: "从手工到全自动：{CarWash} 的蜕变之路"
    content: |
      传统洗车 20 分钟/辆 vs X1 全自动 3 分钟/辆。
      这不是魔法，是工程。
  - day: 4
    type: social_proof
    subject: "月营收增长 45% — 听听他们怎么说"
    content: |
      客户案例：某加油站安装 X1 后，洗车月营收从 $12,000 增长至 $17,400。
  - day: 6
    type: promo
    subject: "限时优惠：订购 X1 享首年免费维护"
    content: |
      现在下单 AutoWash Pro X1，享受首年免费维护 + 专业安装。
      [查看限时优惠 →]
  - day: 8
    type: nurture
    subject: "洗车行业的 3 个未来趋势"
    content: |
      无接触洗车、水循环系统、AI 故障预判 — X1 已全部内置。
```

### AutoWash Pro X1 培育序列

```yaml
sequence: nurture
product: AutoWash Pro X1
emails:
  - week: 1
    type: pain_point
    subject: "人工成本上涨 30%？这个方案帮你省下来"
  - week: 2
    type: case_study
    subject: "案例研究：如何用 X1 将人工从 6 人减到 1 人"
  - week: 3
    type: education
    subject: "全自动洗车机选购指南：5 个必看指标"
  - week: 4
    type: comparison
    subject: "X1 vs 竞品：真实数据对比"
  - week: 5
    type: insight
    subject: "2025 洗车消费行为报告：3 个关键发现"
  - week: 6
    type: trial
    subject: "邀请您参加 X1 线上实机演示"
  - week: 7
    type: conversion
    subject: "现在是升级洗车设备的最佳时机"
  - week: 8
    type: final_push
    subject: "最后一封：为什么选择 X1"
```

### AutoWash Pro X1 再参与序列

```yaml
sequence: re_engagement
product: AutoWash Pro X1
emails:
  - day: 0
    type: warm_reconnect
    subject: "好久不见 — AutoWash Pro X1 有了新变化"
  - day: 5
    type: new_feature
    subject: "X1 上线 PLC 智能控制，自动故障诊断"
  - day: 10
    type: exclusive_offer
    subject: "回归专属：返厂升级享 8 折优惠"
  - day: 15
    type: last_attempt
    subject: "我们还在，如果你想升级设备..."
```

### AutoWash Pro X1 入职引导序列

```yaml
sequence: onboarding
product: AutoWash Pro X1
emails:
  - day: 0
    type: welcome
    subject: "AutoWash Pro X1 安装完成 — 开始您的智能洗车之旅"
  - day: 1
    type: quickstart
    subject: "X1 快速启动：30 分钟上手指南"
  - day: 3
    type: core_feature
    subject: "掌握 X1 的 3 个核心功能：让效率翻倍"
  - day: 7
    type: best_practice
    subject: "最佳实践：日常维护与高峰时段调度"
  - day: 14
    type: advanced
    subject: "进阶技巧：PLC 参数调优与能耗管理"
  - day: 21
    type: success_story
    subject: "听听其他 X1 用户的效率提升故事"
  - day: 28
    type: feedback
    subject: "使用满月 — 给 X1 打分吧"
```
