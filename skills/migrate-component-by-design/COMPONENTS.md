# 可迁移组件列表

> 本文档列出了所有可供迁移的组件及其对应的源文件路径。用户提供设计稿后，从此列表中选择对应的组件进行迁移。

---

## 组件列表

### 1. 搜索筛选组件（FilterCardHeader）

**功能说明**：搜索结果页顶部区域，包含搜索框、排序筛选栏（综合/销量/价格/品牌/筛选）和图文导航标签栏（百亿补贴/元旦大促/五星好店等）

**源文件路径**：
- 主组件：`src/components/FilterCardHeader/index.tsx`
- 样式文件：`src/components/FilterCardHeader/index.module.less`
- 接口服务：`src/components/FilterCardHeader/services.ts`
- 子组件：`src/components/Abbr/` （文本省略组件）

**参考文档**：`./docs/filter.md`

**迁移说明**：
- 包含筛选弹窗、标签栏展开/收起等交互逻辑

---

### 2. 商品瀑布流组件（CompareDoubleRichItem）

**功能说明**：商品卡片瀑布流区域，支持双栏/单栏布局，点击卡片可选中，悬停可查看商品详情

**源文件路径**：
- 主组件：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareDoubleRichItem.tsx`
- 商品卡片（双栏）：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/doubleItem.tsx`
- 商品卡片（单栏）：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/singleItem.tsx`
- 商品详情浮层：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/detail.tsx`

**参考文档**：`./docs/feed.md`

**迁移说明**：
- 包含商品卡片点击选中、商品详情浮层、SKU 选择面板等完整交互
- 需要处理图片轮播、规格选择等子功能
- 商品详情浮层包含完整的商品信息展示和 SKU 选择

---

### 3. 顶部导航栏组件（SearchSceneNav）

**功能说明**：位于商品瀑布流区域上方，左侧展示当前 query，右侧包含若干 Switch 控件（同步滑动、展示广告、查看debug信息、作业视图）

**源文件路径**：
- 主文件：`src/pages/task/components/render_item_detail/search_sbs_all_scene.tsx`（顶部导航栏部分，约 `:1123~1209` 和 `:1644~1710`）

**参考文档**：`./docs/nav.md`

**迁移说明**：
- 包含多个 Switch 控件的联动逻辑
- 需要从完整的页面文件中抽离导航栏部分

---

### 4. 信息面板组件（AgentTabs）

**功能说明**：做题区右侧的信息面板，通过展开/收起按钮控制显示，内含多个 Tab（query辅助信息、辅助信息、AI答案推荐解析、用户信息）

**源文件路径**：
- 主组件：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/components/agentTabs/index.tsx`
- 展开/收起按钮：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/components/agentSwitch/index.tsx`
- 反馈按钮组件：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtons.tsx`
- query 反馈按钮：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtonQuery.tsx`

**参考文档**：`./docs/info.md`

**迁移说明**：
- 包含多个 Tab 的切换逻辑
- 包含"有帮助/没帮助"反馈按钮
- 需要处理 Tab 内容的条件渲染

---

### 5. 做题区组件（QuestionArea）

**功能说明**：页面最右侧的做题区域，用于对当前选中坑位的商品进行评估作答，包含坑位题/整页题切换、问卷表单、提交按钮等

**源文件路径**：
- 主文件：`src/pages/task/components/render_item_detail/search_sbs_all_scene.tsx`（做题区部分）
- 问卷按钮组件：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/questionButton.tsx`
- 打回弹窗：`src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/backModal/index.tsx`
- 问卷渲染：`src/pages/task/components/render_item_detail/render_common_questions.tsx`
- 表单项组件：`src/pages/task/components/render_item_detail/question/form-item.tsx`

**参考文档**：`./docs/question.md`

**迁移说明**：
- 包含坑位题/整页题两种模式的切换
- 包含上一坑/下一坑、提交、提交并下一题等按钮逻辑
- 包含质检模式、groupKey 模式等多种业务场景
- 问卷表单包含 Radio、TextArea、Checkbox 等多种题型

---

## 差异说明文档（非组件）

以上的组件列表为拼多多的组件列表，其中大部分组件内容，在淘宝、京东平台是同一套代码逻辑。
以下文档描述的是拼多多与其他（淘宝、京东）平台的交互差异点，不对应具体组件，只在选择不同平台时提供参考：

- `./docs/jd.md` - 京东与拼多多的差异交互点
- `./docs/taobao.md` - 淘宝与拼多多的差异交互点

---

## 使用说明

**迁移流程**：
1. 用户提供设计稿截图和功能简述
2. 从上述组件列表中选择对应的组件
3. 读取对应的源文件路径
4. 抽离当前指定平台（淘宝/京东/拼多多）相关代码，删除其他平台代码
5. 生成 mock 数据和测试组件
6. 输出完整的迁移文档

**注意事项**：
- 所有组件迁移时必须只保留当前平台的代码
- 必须完整保留样式和交互逻辑，不得简化或重写
- 必须将内联样式抽离到 Less 文件中
- Service 文件必须实现 Mock 化并放在 `src/services/` 目录下
