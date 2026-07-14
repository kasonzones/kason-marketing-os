# 技能映射表 — MarketingSkills → 飞书 Kason Marketing OS

## 映射说明

| 原始技能 | 飞书技能 | 飞书分类 | 触发方式 | 依赖多维表 |
|---------|---------|---------|---------|-----------|
| product-marketing | `/product-context` | strategy | @机器人 /产品定位 | skills_registry |
| copywriting | `/write-copy` | content | @机器人 /写文案 | content, campaigns |
| copy-editing | `/edit-copy` | content | @机器人 /编辑文案 | content |
| content-strategy | `/content-strategy` | content | @机器人 /内容策略 | content, analytics |
| programmatic-seo | `/pseo-generate` | content | @机器人 /程序化SEO | content, seo_data |
| free-tools | `/free-tool-plan` | content | @机器人 /免费工具 | content, campaigns |
| lead-magnets | `/lead-magnet` | content | @机器人 /引导磁力 | campaigns, leads |
| seo-audit | `/seo-audit` | seo | Workflow 定时 | analytics, content |
| ai-seo | `/ai-seo` | seo | @机器人 /AI搜索引擎优化 | content, seo_data |
| schema | `/add-schema` | seo | @机器人 /添加结构化数据 | content |
| site-architecture | `/site-plan` | seo | @机器人 /网站架构 | content |
| aso | `/aso-audit` | seo | @机器人 /应用商店优化 | campaigns |
| ads | `/ad-manage` | advertising | @机器人 /广告管理 | campaigns, analytics |
| ad-creative | `/ad-creative` | advertising | @机器人 /广告创意 | campaigns, content |
| cro | `/cro-audit` | conversion | @机器人 /转化优化 | campaigns, analytics |
| popups | `/popup-optimize` | conversion | @机器人 /弹窗优化 | campaigns |
| signup | `/signup-optimize` | conversion | @机器人 /注册优化 | campaigns, analytics |
| paywalls | `/paywall-design` | conversion | @机器人 /付费墙 | campaigns, leads |
| offers | `/offer-design` | conversion | @机器人 /报价设计 | campaigns |
| emails | `/email-sequence` | email | Workflow 触发 | campaigns, leads |
| cold-email | `/cold-email` | email | @机器人 /冷邮件 | leads |
| sms | `/sms-campaign` | email | @机器人 /短信营销 | campaigns, leads |
| social | `/social-post` | social | @机器人 /社交媒体内容 | content, campaigns |
| community-marketing | `/community` | social | @机器人 /社区营销 | campaigns |
| marketing-loops | `/marketing-loop` | growth | Workflow 定时 | analytics, campaigns |
| churn-prevention | `/churn-prevent` | growth | Workflow 触发 | leads, analytics |
| referrals | `/referral-plan` | growth | @机器人 /推荐计划 | campaigns, leads |
| onboarding | `/onboarding-plan` | growth | @机器人 /用户引导 | campaigns, leads |
| directory-submissions | `/directory-submit` | growth | @机器人 /目录提交 | campaigns |
| analytics | `/setup-analytics` | analytics | @机器人 /分析设置 | analytics |
| ab-testing | `/ab-test` | analytics | @机器人 /AB测试 | analytics, campaigns |
| revops | `/revops` | analytics | @机器人 /营收运营 | leads, analytics |
| marketing-plan | `/marketing-plan` | strategy | @机器人 /营销计划 | campaigns, analytics |
| pricing | `/pricing` | strategy | @机器人 /定价策略 | campaigns |
| launch | `/launch-plan` | strategy | @机器人 /产品发布 | campaigns, content |
| competitor-profiling | `/competitor-report` | strategy | @机器人 /竞品分析 | campaigns |
| customer-research | `/customer-insight` | strategy | @机器人 /客户洞察 | leads |
| competitors | `/vs-page` | strategy | @机器人 /竞品对比页 | content, campaigns |
| sales-enablement | `/sales-tools` | strategy | @机器人 /销售赋能 | campaigns, leads |
| marketing-ideas | `/ideas` | strategy | @机器人 /营销创意 | campaigns |
| marketing-psychology | `/psychology` | strategy | @机器人 /营销心理学 | campaigns |
| prospecting | `/prospect` | strategy | @机器人 /客户挖掘 | leads |
| public-relations | `/pr` | strategy | @机器人 /公共关系 | campaigns |
| co-marketing | `/co-marketing` | strategy | @机器人 /联合营销 | campaigns |
| marketing-council | `/council` | strategy | @机器人 /营销顾问 | campaigns |
| image | `/gen-image` | content | @机器人 /生成图片 | content |
| video | `/gen-video` | content | @机器人 /生成视频 | content |

## 优先级分层

### P0 (核心必装, 10个)
产品定位、写文案、SEO审计、广告管理、转化优化、邮件序列、社交媒体、营销计划、分析设置、AB测试

### P1 (推荐安装, 20个)
编辑文案、内容策略、程序化SEO、AI SEO、广告创意、弹窗优化、注册优化、冷邮件、社区营销、营销循环、流失预防、推荐计划、营收运营、定价策略、产品发布、竞品分析、客户洞察、销售赋能、客户挖掘、生成图片

### P2 (按需安装, 17个)
免费工具、引导磁力、Schema、网站架构、应用商店优化、付费墙、报价设计、短信营销、引导优化、目录提交、竞品对比页、营销创意、营销心理学、公共关系、联合营销、营销顾问、生成视频
