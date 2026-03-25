# PDD 搜索结果页 · 信息面板交互文档

**涉及文件**：
- `src/pages/task/components/render_item_detail/search_sbs_all_scene.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/components/agentTabs/index.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/components/agentSwitch/index.tsx`

> 信息面板位于做题区右侧，通过展开/收起按钮控制显示，内含多个 Tab：`query辅助信息`、`辅助信息`、`AI答案推荐解析`、`用户信息`，具体显示哪些 Tab 由任务配置决定。

---

## 目录

| # | 交互名称 | 触发方式 | 代码位置 |
|---|---------|---------|---------|
| 1 | 展开/收起信息面板 | `onClick`（箭头图标） | `agentSwitch/index.tsx:20`、`agentSwitch/index.tsx:27` |
| 2 | 切换信息面板 Tab | `onChange` | `agentTabs/index.tsx:209` |
| 3 | 点击「查看query信息」按钮 | `onClick` | `search_sbs_all_scene.tsx:1669` |
| 4 | 点击「查看用户信息」按钮 | `onClick` | `search_sbs_all_scene.tsx:1665` |
| 5 | 点击「有帮助」按钮（AI答案推荐反馈） | `onClick` | `FeedbackButtons.tsx:38` |
| 6 | 点击「没帮助」按钮（AI答案推荐反馈） | `onClick` | `FeedbackButtons.tsx:76` |
| 7 | 点击「有帮助」按钮（query辅助信息反馈） | `onClick` | `FeedbackButtonQuery.tsx:36` |
| 8 | 点击「没帮助」按钮（query辅助信息反馈） | `onClick` | `FeedbackButtonQuery.tsx:63` |

---

## 交互 1：展开/收起信息面板

| 字段 | 内容 |
|------|------|
| **触发元素** | 做题区与信息面板之间的「`AgentSwitch`」箭头按钮（`LeftOutlined` / `RightOutlined` 图标） |
| **事件** | `onClick` |
| **代码位置** | `agentSwitch/index.tsx:20`（收起）、`agentSwitch/index.tsx:27`（展开） |
| **前置条件** | `configObj.needAgent` 为 `true` 时该按钮才渲染（`search_sbs_all_scene.tsx:1639`） |

**执行流程**：
1. 当面板处于展开状态（`open = true`）：显示 `RightOutlined`，点击后调用 `setOpen(false)` 收起面板
2. 当面板处于收起状态（`open = false`）：显示 `LeftOutlined`，点击后调用 `setOpen(true)` 展开面板

**UI 变化**：
- 展开时：做题区宽度从 `35%` 压缩至 `20%`，信息面板宽度从 `0` 展开为 `auto`，`overflow` 从 `hidden` 变为 `visible`（`search_sbs_all_scene.tsx:1239`）
- 商品瀑布流区域宽度同步从 `65%` 压缩至 `50%`（`search_sbs_all_scene.tsx:1118`）
- 面板内 `AgentTabs` 仅在 `open = true` 时渲染（避免无效请求）

---

## 交互 2：切换信息面板 Tab

| 字段 | 内容 |
|------|------|
| **触发元素** | 信息面板顶部的 `Tabs` 组件，各 Tab 标签 |
| **事件** | Tabs `onChange` 回调 |
| **代码位置** | `agentTabs/index.tsx:209` |
| **前置条件** | 信息面板处于展开状态（`open = true`） |

**可用 Tab 及显示条件**：

| Tab 标签 | `key` | 渲染组件 | 显示条件 |
|---------|-------|---------|---------|
| `query辅助信息` | `query` | `LLMSupQueryNew` | 项目 ID 为 `SBS_71` 时显示（`queryProps.show`） |
| `辅助信息` | `query` | `LLMSkuAgent` | 项目 ID 为 `SBS_122` 且非质检模式时显示（`skuProps.show`） |
| `AI答案推荐解析` | `cot` | `LLMSupCotSearch` / `LLMSupCotNew` | 按 `cotSearchProps.show` / `cotProps.show` 控制 |
| `用户信息` | `5` | `SbsUser` | `userProps` 非空时显示 |

**执行流程**：
1. 用户点击 Tab 标签，触发 `onChange`，调用 `setTabsActive(activeKey)` 更新当前激活 Tab
2. 切换到 `query` Tab 时：`tabsExposureLog.queryPv` 设为 `1`（记录曝光）
3. 切换到 `cot` Tab 时：向 `tabsExposureLog.positionPvModelList` 追加当前坑位的曝光记录（去重）
4. 每次 `tabsExposureLog` 变化，将其序列化写入 `form` 字段 `tabsExposureLog`，作为隐藏字段随答案一并提交

**UI 变化**：
- 选中的 Tab 标签高亮，下方显示对应内容区域

---

## 交互 3：点击「查看query信息」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 页面顶部工具栏中的「查看query信息」链接按钮（`Button type="link"`） |
| **事件** | `onClick` |
| **代码位置** | `search_sbs_all_scene.tsx:1669` |
| **前置条件** | `queryInfo` 数据不为空（`{queryInfo && ...}`），`isShowQuery` 为 `true` |

**执行流程**：
1. 调用 `setQueryVisible(true)` 将弹窗状态设为可见
2. 弹出 `Modal`（宽 900，无 `footer`），内部渲染 `QueryInfoDescriptions` 组件（`search_sbs_all_scene.tsx:1960`）
3. 点击弹窗关闭按钮：调用 `setQueryVisible(false)` 关闭弹窗

**UI 变化**：
- 弹出居中 Modal，展示 query 结构化信息（`QueryInfoDescriptions`）

---

## 交互 4：点击「查看用户信息」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 页面顶部工具栏中的「查看用户信息」链接按钮（`Button type="link"`） |
| **事件** | `onClick` |
| **代码位置** | `search_sbs_all_scene.tsx:1665` |
| **前置条件** | `isShowQuery` 为 `true` |

**执行流程**：
1. 调用 `setVisible(true)` 将弹窗状态设为可见
2. 弹出 `Modal`（宽 900），内部渲染 `SbsUser` 组件（`search_sbs_all_scene.tsx:1957`），传入 `userId` 和 `taskItemStatus`
3. 点击弹窗关闭按钮：调用 `setVisible(false)` 关闭弹窗

**UI 变化**：
- 弹出居中 Modal，展示当前任务用户的详细信息

---

## 交互 5：点击「有帮助」按钮（AI答案推荐反馈）

| 字段 | 内容 |
|------|------|
| **触发元素** | AI答案推荐解析区「辅助信息对完成本题是否有帮助？」下方的「有帮助」按钮（带 `LikeOutlined` / `LikeFilled` 图标） |
| **事件** | `onClick` |
| **代码位置** | `FeedbackButtons.tsx:38` |
| **涉及组件** | `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtons.tsx` |
| **前置条件** | 信息面板已展开，当前 Tab 为「AI答案推荐解析」，当前坑位有 AI 推荐答案 |

**执行流程**：
1. 调用 `setLikePosFn((pre) => {...})`
2. 若当前坑位（`pos`）已在 `likePos` 数组中 → 从数组中移除该坑位（取消点赞）
3. 若当前坑位未在 `likePos` 数组中 → 将该坑位号添加到数组（点赞）
4. 同时调用 `setDisLikePosFn((pre) => pre?.filter((item) => item !== pos))`，确保取消「没帮助」的选中状态（互斥）

**UI 变化**：
- 按钮图标从 `LikeOutlined`（空心）变为 `LikeFilled`（实心）
- 按钮背景色变为 `#FDEDEE`（浅红色），文字颜色变为 `#FA5353`（红色）
- 若之前点击了「没帮助」，「没帮助」按钮恢复默认样式
- 鼠标悬停时背景色变为 `#F5E6E6`，文字色变为 `#FA5353`

**数据记录**：
- `likePos` 数组记录了所有标记为「有帮助」的坑位号，提交时作为隐藏字段随表单一并提交

---

## 交互 6：点击「没帮助」按钮（AI答案推荐反馈）

| 字段 | 内容 |
|------|------|
| **触发元素** | AI答案推荐解析区「辅助信息对完成本题是否有帮助？」下方的「没帮助」按钮（带 `DislikeOutlined` / `DislikeFilled` 图标） |
| **事件** | `onClick` |
| **代码位置** | `FeedbackButtons.tsx:76` |
| **涉及组件** | `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtons.tsx` |
| **前置条件** | 信息面板已展开，当前 Tab 为「AI答案推荐解析」，当前坑位有 AI 推荐答案 |

**执行流程**：
1. 调用 `setDisLikePosFn((pre) => {...})`
2. 若当前坑位（`pos`）已在 `disLikePos` 数组中 → 从数组中移除（取消点踩）
3. 若当前坑位未在 `disLikePos` 数组中 → 将该坑位号添加到数组（点踩）
4. 同时调用 `setLikePosFn((pre) => pre?.filter((item) => item !== pos))`，确保取消「有帮助」的选中状态（互斥）

**UI 变化**：
- 按钮图标从 `DislikeOutlined`（空心）变为 `DislikeFilled`（实心）
- 按钮背景色变为 `#F5F5F5`（浅灰色），文字颜色变为 `#000000`（黑色）
- 若之前点击了「有帮助」，「有帮助」按钮恢复默认样式
- 鼠标悬停时背景色变为 `#E6E6E6`，文字色变为 `#000000`

**数据记录**：
- `disLikePos` 数组记录了所有标记为「没帮助」的坑位号，提交时随表单一并提交

---

## 交互 7：点击「有帮助」按钮（query辅助信息反馈）

| 字段 | 内容 |
|------|------|
| **触发元素** | query辅助信息区「辅助信息对完成本题是否有帮助？」下方的「有帮助」按钮 |
| **事件** | `onClick` |
| **代码位置** | `FeedbackButtonQuery.tsx:36` |
| **涉及组件** | `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtonQuery.tsx` |
| **前置条件** | 信息面板已展开，且切换到 `query辅助信息` Tab |

**执行流程**：
1. 调用 `setQueryHelp(1)`，将 `queryHelp` 状态设置为 `1`（表示有帮助）
2. 该值为整页级别的反馈（非坑位级别），每次切换只记录一个值

**UI 变化**：
- 「有帮助」按钮变为选中状态（图标实心、背景浅红 `#FDEDEE`、文字红色 `#FA5353`）
- 「没帮助」按钮恢复为未选中状态
- 鼠标悬停时背景色变为 `#F5E6E6`，文字色变为 `#FA5353`

**数据记录**：
- `queryHelp` 为 `1` 时表示用户认为该 query 的辅助信息有帮助，提交时随表单一并提交

---

## 交互 8：点击「没帮助」按钮（query辅助信息反馈）

| 字段 | 内容 |
|------|------|
| **触发元素** | query辅助信息区「辅助信息对完成本题是否有帮助？」下方的「没帮助」按钮 |
| **事件** | `onClick` |
| **代码位置** | `FeedbackButtonQuery.tsx:63` |
| **涉及组件** | `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/FeedbackButtonQuery.tsx` |
| **前置条件** | 信息面板已展开，且切换到 `query辅助信息` Tab |

**执行流程**：
1. 调用 `setQueryHelp(0)`，将 `queryHelp` 状态设置为 `0`（表示没帮助）

**UI 变化**：
- 「没帮助」按钮变为选中状态（图标实心、背景浅灰 `#F5F5F5`、文字黑色 `#000000`）
- 「有帮助」按钮恢复为未选中状态
- 鼠标悬停时背景色变为 `#E6E6E6`，文字色变为 `#000000`

**数据记录**：
- `queryHelp` 为 `0` 时表示用户认为该 query 的辅助信息没有帮助，提交时随表单一并提交
