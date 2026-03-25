# PDD 搜索结果页 · 做题区交互文档

**涉及文件**：
- `src/pages/task/components/render_item_detail/search_sbs_all_scene.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareDoubleRichItem.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/questionButton.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/backModal/index.tsx`

> 做题区位于页面最右侧，独立于商品瀑布流，用于对当前选中坑位的商品进行评估作答。

---

## 目录

| # | 交互名称 | 触发方式 | 代码位置 |
|---|---------|---------|---------|
| 1 | 切换「坑位题」/「整页题」 | `onClick` | `search_sbs_all_scene.tsx:1294` |
| 2 | 点击「上一坑」按钮（坑位题模式） | `onClick` | `compareDoubleRichItem.tsx:2286` |
| 3 | 点击「下一坑」按钮（坑位题模式） | `onClick` | `compareDoubleRichItem.tsx:2298` |
| 4 | 点击「提交」按钮 | `onClick` | `compareDoubleRichItem.tsx:2787` |
| 5 | 点击「提交并下一题」按钮 | `onClick` | `compareDoubleRichItem.tsx:2806` |
| 6 | 点击「一键NJ」按钮 | `onClick`（Popover trigger） | `compareDoubleRichItem.tsx:2773` |
| 7 | 点击「拆解」按钮（拆解问卷 Tab） | `onClick` | `compareDoubleRichItem.tsx:2937` |
| 8 | 整页题：切换「问卷」/「拆解问卷」Tab | `onChange` | `search_sbs_all_scene.tsx:1377` |
| 9 | 整页题：点击「上一坑」按钮 | `onClick` | `questionButton.tsx:517` |
| 10 | 整页题：点击「下一坑」按钮 | `onClick` | `questionButton.tsx:522` |
| 11 | 整页题（质检模式）：点击「质检通过」按钮 | `onClick` | `questionButton.tsx:558` |
| 12 | 整页题（质检模式）：点击「质检不通过」按钮 | `onClick` | `questionButton.tsx:572` |
| 13 | 整页题（groupKey 模式）：点击「一键打回」按钮 | `onClick` | `backModal/index.tsx:23` |
| 14 | 整页题（拆解问卷 Tab）：点击「拆解」按钮 | `onClick` | `search_sbs_all_scene.tsx:1505` |
| 15 | 选择相关性打分的 Radio 选项 | `onChange` | `render_common_questions.tsx:610` |
| 16 | 填写 TextArea 文本框（如无效原因） | `onChange` / `onBlur` | `form-item.tsx:150` |

---

## 交互 1：切换「坑位题」/「整页题」

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区顶部的「坑位题」/「整页题」两个切换按钮（自定义 `div`，模拟 Segmented 样式） |
| **事件** | `onClick` |
| **代码位置** | `search_sbs_all_scene.tsx:1294`（坑位题）、`search_sbs_all_scene.tsx:1309`（整页题） |
| **前置条件** | 坑位题按钮显示条件：`entireItemDetail.positionQuestions.length > 0`；整页题按钮显示条件：`entireItemDetail.normalQuestions.length > 0 && !isHideNormalQuestionCard` |

**执行流程**：
1. 点击「坑位题」→ 调用 `setActiveKey('position')`，按钮背景变蓝，下方切换为坑位问题卡片（`QuestionCard`）
2. 点击「整页题」→ 调用 `setActiveKey('normal')`，按钮背景变蓝，下方切换为整页问卷（`Tabs` 内含「问卷」Tab）

**UI 变化**：
- 被选中的按钮：背景色 `#1677FF`（蓝色），文字色 `#fff`
- 未选中的按钮：背景色 `#F2F4FA`，文字色 `#565A70`
- 下方内容区域通过 `display: block/none` 控制显示隐藏

---

## 交互 2：点击「上一坑」按钮（坑位题模式）

| 字段 | 内容 |
|------|------|
| **触发元素** | 「坑位题」模式下做题区底部的「上一坑」按钮（`PopconfirmBtn`，`btnText="上一坑"`） |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2286` |
| **前置条件** | 已选中某个商品（`currentItem` 非空），当前不是第一个坑位 |

**执行流程**：
1. 当 `currenItemFormValueChange()` 返回 `true`（当前坑位答案有未提交修改）时，`PopconfirmBtn` 弹出确认框，提示"确认修改此结论？修改后本页面相同Q_l结论均覆盖"
2. 用户确认后调用 `handlePrev()`：
   - 若存在 `efficiencyPosition` 配置，跳到上方第一个未评估的坑位（`!efficiencyPosition[pos]`）
   - 否则直接切换到 `currentItemIndex - 1` 位置
3. 调用 `setCurrentItem(...)` 更新当前选中商品
4. 调用 `setPos(...)` 更新当前坑位号
5. 调用 `scrollToElement(newIndex, ...)` 将商品卡片滚动到可视区域

**UI 变化**：
- 左侧瀑布流中高亮边框跳到上一个商品卡片
- 做题区中题目与答案内容切换为上一坑的商品

---

## 交互 3：点击「下一坑」按钮（坑位题模式）

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区底部的「下一坑」按钮（`PopconfirmBtn`，`btnText="下一坑"`） |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2298` |
| **前置条件** | 已选中某个商品（`currentItem` 非空），当前不是最后一个坑位 |

**执行流程**：
1. 当 `currenItemFormValueChange()` 返回 `true` 时，弹出确认框，逻辑同「上一坑」
2. 用户确认后调用 `handleNext()`：
   - 若存在 `efficiencyPosition` 配置，跳到下方第一个未评估的坑位
   - 否则直接切换到 `currentItemIndex + 1` 位置
   - 若已到达列表末尾，调用 `message.info('该列已经到底了')`
3. 调用 `setCurrentItem(...)`、`setPos(...)`、`scrollToElement(...)` 同步更新

**UI 变化**：
- 左侧瀑布流中高亮边框跳到下一个商品卡片
- 做题区中题目与答案内容切换为下一坑的商品

---

## 交互 4：点击「提交」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区底部的「提交」按钮（`PopconfirmBtn`，`btnText="提交"`） |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2787` |
| **前置条件** | 非快照模式（`!isSnapshot`）且非分析模式（`!isAnalyze`），表单填写完毕 |

**执行流程**：
1. 若 `flatData.hasSameQueryValid === false`，`PopconfirmBtn` 弹出二次确认框（相同 query 下有答案不一致的情况）
2. 用户确认后调用 `onFinish(form.getFieldsValue())`，不传 `type` 参数
3. `onFinish` 调用父组件传入的 `onOriginalFinish(value)`，提交当前坑位答案
4. 提交期间按钮显示 `loading` 状态（`sbsSubmitLoading.sbsSubmitSingleLoading`）

**UI 变化**：
- 「提交」按钮进入 loading 状态
- 提交成功后由父组件处理（坑位标记为已完成等）

---

## 交互 5：点击「提交并下一题」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区底部的「提交并下一题」按钮（`PopconfirmBtn`，`btnText="提交并下一题"`） |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2806` |
| **前置条件** | 非快照模式（`!isSnapshot`）且非分析模式（`!isAnalyze`） |

**执行流程**：
1. 若 `flatData.hasSameQueryValid === false`，弹出二次确认框，逻辑同「提交」
2. 用户确认后调用 `onFinish(form.getFieldsValue(), 'next')`，传入 `type = 'next'`
3. 父组件在提交成功后自动跳转到下一道题
4. 提交期间按钮显示 `loading` 状态（`sbsSubmitLoading.sbsSubmitNextLoading`）

**UI 变化**：
- 「提交并下一题」按钮进入 loading 状态
- 提交成功后页面自动跳转到下一题

---

## 交互 6：点击「一键NJ」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区底部的「一键NJ」按钮（`Button`） |
| **事件** | `onClick`（通过 `Popover` 的 `trigger="click"` 触发） |
| **代码位置** | `compareDoubleRichItem.tsx:2773` |
| **前置条件** | 非快照模式（`!isSnapshot`）且非分析模式（`!isAnalyze`），非 `groupKey` 模式（`!groupKey`） |

**执行流程**：
1. 点击按钮后，`Popover` 打开，弹出「无效原因」填写框（`TextArea`）
2. 用户在 Popover 内点击「取消」：调用 `setValidOpen(false)` 关闭 Popover，不提交
3. 用户在 Popover 内点击「确定」：
   - 调用 `form.validateFields()` 校验「无效原因」是否填写
   - 校验通过后调用 `onFinish(value, 'next', 0)`，传入 `valid = 0` 表示无效答案，并跳转到下一题
   - 调用 `setValidOpen(false)` 关闭 Popover

**UI 变化**：
- 点击后在按钮附近弹出填写无效原因的 Popover
- 确认提交后 Popover 关闭，跳转到下一题

---

## 交互 7：点击「拆解」按钮（拆解问卷 Tab，坑位题模式）

| 字段 | 内容 |
|------|------|
| **触发元素** | 坑位题模式「拆解问卷」Tab 内的「拆解」按钮（`Button`） |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2937` |
| **前置条件** | `isAnalyze` 为真（当前处于分析模式），且 `isAnalyze !== 'isSnapshot'`（非快照模式，按钮不禁用） |

**执行流程**：
1. 调用 `onFinish(form.getFieldsValue())`，提交当前拆解问卷的答案

**UI 变化**：
- 提交当前商品的拆解问卷答案，由父组件处理后续流程

---

## 整页题交互

> 整页题底部操作栏由独立的 `QuestionButton` 组件（`questionButton.tsx`）渲染，与坑位题底部逻辑分离。按钮组合根据当前模式（`mode`、`groupKey`、`isSnapshot`）动态变化：
>
> | 模式 | 底部按钮组合 |
> |------|------------|
> | 快照 / 分析模式 | 上一坑 + 下一坑 |
> | 质检模式（`!!mode`） | 上一坑 + 下一坑 + 质检通过 + 质检不通过 |
> | 普通评估（`!mode`，`!groupKey`） | 上一坑 + 下一坑 + 一键NJ + 提交 + 提交并下一题 |
> | groupKey 模式 | 上一坑 + 下一坑 + 一键打回 + 提交 + 提交并下一题 |

---

## 交互 8：整页题切换「问卷」/「拆解问卷」Tab

| 字段 | 内容 |
|------|------|
| **触发元素** | 整页题内容区顶部的 Ant Design `Tabs` 组件标签（`tab="问卷"` / `tab="拆解问卷"`） |
| **事件** | Tabs `onChange` |
| **代码位置** | `search_sbs_all_scene.tsx:1377` |
| **前置条件** | 处于整页题模式（`activeKey === 'normal'`）；「拆解问卷」Tab 仅在 `isAnalyze` 为真时渲染（`:1481`） |

**执行流程**：
1. 点击「问卷」Tab（`key="1"`）→ 下方渲染 `RenderCommonQuestions` 或 `RenderTabNormalQuestion`（整页普通问题）
2. 点击「拆解问卷」Tab（`key="2"`）→ 下方渲染 `AnalyzeRenderCommonQuestions`（拆解问卷题目），底部出现「拆解」按钮

**UI 变化**：
- Tab 标签切换高亮，下方内容区随之切换

---

## 交互 9：整页题点击「上一坑」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 整页题底部的「上一坑」按钮（`PopconfirmBtn`，`btnText="上一坑"`） |
| **事件** | `onClick` |
| **代码位置** | `questionButton.tsx:517` |
| **前置条件** | 当前不是第一个坑位 |

**执行流程**：
1. 当 `currenItemFormValueChange()` 返回 `true`（答案有未提交修改）时，`PopconfirmBtn` 弹出确认框："确认修改此结论？修改后本页面相同Q_l结论均覆盖"
2. 用户确认后调用 `handlePrev()`（`questionButton.tsx:263`）：
   - 若存在 `efficiencyPosition` 配置，跳到上方第一个未评估坑位
   - 否则直接切换到 `currentItemIndex - 1`
3. 调用 `setCurrentItem(...)`、`scrollToElement(...)` 同步更新

**UI 变化**：
- 左侧瀑布流高亮边框跳到上一个商品卡片

---

## 交互 10：整页题点击「下一坑」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 整页题底部的「下一坑」按钮（`PopconfirmBtn`，`btnText` 含 `RightOutlined` 图标） |
| **事件** | `onClick` |
| **代码位置** | `questionButton.tsx:522` |
| **前置条件** | 当前不是最后一个坑位 |

**执行流程**：
1. 当 `currenItemFormValueChange()` 返回 `true` 时，弹出确认框，逻辑同交互 9
2. 用户确认后调用 `handleNext()`（`questionButton.tsx:360`）：
   - 若存在 `efficiencyPosition` 配置，跳到下方第一个未评估坑位
   - 否则直接切换到 `currentItemIndex + 1`
   - 若已到达末尾，调用 `message.info('该列已经到底了')`
3. 调用 `setCurrentItem(...)`、`scrollToElement(...)` 同步更新

**UI 变化**：
- 左侧瀑布流高亮边框跳到下一个商品卡片

---

## 交互 11：整页题（质检模式）点击「质检通过」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 质检模式下整页题底部的「质检通过」按钮（`PopconfirmBtn`，`btnText="质检通过"`） |
| **事件** | `onClick` |
| **代码位置** | `questionButton.tsx:558` |
| **前置条件** | `!!mode`（质检模式），`!groupKey`，非快照/分析模式 |

**执行流程**：
1. 若 `flatData.hasSameQueryValid === false`，`PopconfirmBtn` 弹出二次确认框（同 query 下答案不一致），并将 `flatData.sameQueryValidArr` 写入 `hasSameQueryValidArr`
2. 用户确认后调用 `handleQaButtonOnClick()`，触发质检通过逻辑
3. `disabled={disableSubmit}` 控制按钮是否可用

**UI 变化**：
- 弹出二次确认框（如有 sameQuery 冲突）后执行质检通过

---

## 交互 12：整页题（质检模式）点击「质检不通过」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 质检模式下整页题底部的「质检不通过」按钮（`PopconfirmBtn`，`btnText="质检不通过"`） |
| **事件** | `onClick` |
| **代码位置** | `questionButton.tsx:572` |
| **前置条件** | `!!mode`（质检模式），`!groupKey`，非快照/分析模式 |

**执行流程**：
1. 若 `flatData.hasSameQueryValid === false`，弹出二次确认框，逻辑同交互 11
2. 用户确认后调用 `onFinish(form.getFieldsValue())`，提交质检不通过的结果

**UI 变化**：
- 弹出二次确认框（如有 sameQuery 冲突）后执行质检不通过提交

---

## 交互 13：整页题（groupKey 模式）点击「一键打回」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | `groupKey` 模式下整页题底部的「一键打回」按钮（`Button`，来自 `BackModal` 组件） |
| **事件** | `onClick` |
| **代码位置** | `backModal/index.tsx:23` |
| **前置条件** | `!!groupKey`（分组质检模式） |

**执行流程**：
1. 点击「一键打回」→ 调用 `setBackOpen(true)`，弹出「打回数据」Modal
2. Modal 内含两个必填 Radio 问题：
   - 「是否带答案打回」（`withAnswer`：是 / 否）
   - 「是否打回至原标注人」（`rollBackToOwner`：是 / 否）
3. 点击 Modal 「确定」：调用 `backForm.validateFields()` 校验，通过后执行 `onFinish({ ...form.getFieldsValue(), backInfo: res }, 'next')`，携带打回信息提交
4. 点击 Modal 「取消」：`backForm.resetFields()` 清空，`setBackOpen(false)` 关闭 Modal

**UI 变化**：
- 弹出带表单的 Modal，填写打回原因后提交

---

## 交互 14：整页题（拆解问卷 Tab）点击「拆解」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 整页题「拆解问卷」Tab 内的「拆解」按钮（`Button type="primary"`） |
| **事件** | `onClick` |
| **代码位置** | `search_sbs_all_scene.tsx:1505` |
| **前置条件** | 整页题模式下 `isAnalyze` 为真，`entireItemDetail.disassembleQuestions.length > 0`；`isAnalyze === 'isSnapshot'` 时按钮禁用 |

**执行流程**：
1. 调用 `onFinish(form.getFieldsValue())`，提交当前拆解问卷答案

**UI 变化**：
- 提交拆解问卷答案，由父组件处理后续流程

---

## 交互 15：选择相关性打分的 Radio 选项

| 字段 | 内容 |
|------|------|
| **触发元素** | 坑位题或整页题中的 Radio.Group 选项（如：L4-完全相关、L3-近似相关、L2-部分不相关、L1-完全不相关、nj-无效query/商品） |
| **事件** | `onChange` |
| **代码位置** | `render_common_questions.tsx:610` |
| **涉及组件** | `src/pages/task/components/render_item_detail/render_common_questions.tsx` |
| **前置条件** | 问卷已渲染，题目类型为 `radio` 或 `radio_text`（单选题） |

**执行流程**：
1. 用户点击某个 Radio 选项，触发 `Radio.Group` 的 `onChange` 事件
2. 调用 `handleRadioCheck(e, option, children)`，其中：
   - `e.target.value` 为选中的选项值（如 `"L4"`、`"L3"` 等）
   - `option` 为当前选项对象，可能包含子题目（`children`）
   - `children` 为该选项关联的子问题列表
3. 调用 `form.setFieldsValue({ [question.id]: e.target.value })`，更新表单字段值
4. 若该选项有关联子题（`children`），根据配置决定是否显示/隐藏子题，或更新子题的必填状态
5. 若该选项关联了动态影响逻辑（通过 `impactPropsRadio` 配置），可能会动态改变其他题目的显示、必填状态等

**UI 变化**：
- 被选中的 Radio 按钮高亮显示（蓝色圆点填充）
- 若该选项关联了子题，子题区域展开或收起
- 若该选项导致其他题目的必填状态变化，相关题目标题前的红色星号出现或消失
- 若该选项导致其他题目的显示/隐藏状态变化，相关题目区域动态展示或隐藏

**数据记录**：
- 选中的值写入 `form.getFieldsValue()[question.id]`，提交时随表单一并上传

**注意事项**：
- PDD 搜索结果页的相关性打分通常分为两组：
  - **相关性打分（商品详情页）**：L4-完全相关、L3-近似相关、L2-部分不相关、L1-完全不相关、nj-无效query/商品
  - **相关性打分（srp&商品）**：与上述选项相同，但作用于搜索结果页（SRP）与商品的关联评估
- 部分 Radio 选项可能触发子题联动，例如选择「L2-部分不相关」后可能要求填写不相关的具体原因

---

## 交互 16：填写 TextArea 文本框（如无效原因）

| 字段 | 内容 |
|------|------|
| **触发元素** | 问卷中的 TextArea 输入框（如填写"无效原因"等） |
| **事件** | `onChange` / `onBlur` |
| **代码位置** | `form-item.tsx:150` |
| **涉及组件** | `src/pages/task/components/render_item_detail/question/form-item.tsx` |
| **前置条件** | 问卷已渲染，题目类型为 `textarea` |

**执行流程**：
1. 用户在 TextArea 中输入内容
2. 若该题目配置了字数限制（`inputLimit.mode === 'length'`），表单会实时校验：
   - 若字数不在 `range[0]` ~ `range[1]` 范围内，输入框下方显示红色错误提示
   - 错误提示内容：`请输入 {min} 到 {max} 个字符，当前为 {length} 个`
   - 校验通过后错误提示消失
3. 输入内容实时写入 `form.getFieldsValue()[question.id]`
4. 若该题目标记为必填（`required === 1`），提交时会校验是否为空

**UI 变化**：
- 输入框获得焦点时边框变蓝（`#1890ff`）
- 字数超限时输入框下方显示红色错误文字
- 字数符合要求时错误提示消失
- 失去焦点时边框恢复默认灰色

**数据记录**：
- 用户输入的文本内容写入表单字段 `form.getFieldsValue()[question.id]`，提交时上传

**常见使用场景**：
- 填写「无效原因」（当选择「一键NJ」时弹出 Popover 中的必填字段）
- 填写「备注信息」（部分问卷中的可选文本补充字段）
