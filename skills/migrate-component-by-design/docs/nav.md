# PDD 搜索结果页 · 顶部导航栏交互文档

**涉及文件**：
- `src/pages/task/components/render_item_detail/search_sbs_all_scene.tsx`

> 顶部导航栏位于商品瀑布流区域上方，左侧展示当前 query，右侧包含若干 Switch 控件。根据渲染分支不同，导航栏有两套略有差异的实现：
> - **双栏主视图**（`isDouble && envListType === 'main'`）：代码位于 `:1123~1209`
> - **非双栏视图**（`isShowQuery` 条件下）：代码位于 `:1644~1710`

---

## 目录

| # | 交互名称 | 触发方式 | 代码位置 |
|---|---------|---------|---------|
| 1 | 切换「同步滑动」Switch | `onChange` | `:1153`（双栏）/ `:1685`（非双栏） |
| 2 | 切换「展示广告」Switch | `onChange` | `:1182`（双栏）/ `:1701`（非双栏） |
| 3 | 切换「查看debug信息」Switch | `onChange` | `:1167`（双栏） |
| 4 | 切换「作业视图」Switch | `onChange` | `:1200`（双栏） |

---

## Switch 显示条件汇总

| Switch 标签 | 状态变量 | 显示条件 |
|------------|---------|---------|
| `同步滑动` | `checked` | `!viewOpen`（作业视图关闭时才显示） |
| `查看debug信息` | `featureOpen` | `!viewOpen` 且 `featureList.length > 0`（仅双栏分支有此 Switch） |
| `展示广告` | `showAd` | `!viewOpen` |
| `作业视图` | `viewOpen` | `task.skuSnapshot === 1`（任务级配置，不是所有任务都有） |

---

## 交互 1：切换「同步滑动」Switch

| 字段 | 内容 |
|------|------|
| **触发元素** | 导航栏右侧「同步滑动」`Switch`（`size="small"`） |
| **事件** | `onChange` |
| **代码位置** | `:1153`（双栏主视图）、`:1685`（非双栏，带 `checkedChildren="开启同步滑动"` / `unCheckedChildren="关闭同步滑动"` 标签） |
| **前置条件** | `!viewOpen`（作业视图未开启时才显示此 Switch） |

**执行流程**：
1. 切换时调用 `setChecked((pre) => !pre)`，翻转 `checked` 状态
2. `checked` 通过 `props` 传入商品瀑布流容器，控制左右两列是否同步滚动

**UI 变化**：
- Switch 切换开/关状态
- 开启时：两列商品瀑布流联动同步滚动；关闭时：两列独立滚动

---

## 交互 2：切换「展示广告」Switch

| 字段 | 内容 |
|------|------|
| **触发元素** | 导航栏右侧「展示广告」`Switch`（`size="small"`） |
| **事件** | `onChange` |
| **代码位置** | `:1182`（双栏主视图）、`:1701`（非双栏视图） |
| **前置条件** | `!viewOpen`（作业视图未开启时才显示） |

**执行流程**：
1. 切换时调用 `setShowAd((pre) => !pre)`，翻转 `showAd` 状态
2. `showAd` 传入商品卡片渲染逻辑，控制广告商品是否展示

**UI 变化**：
- Switch 切换开/关状态
- 开启时商品列表中的广告坑位可见，关闭时隐藏

---

## 交互 3：切换「查看debug信息」Switch

| 字段 | 内容 |
|------|------|
| **触发元素** | 导航栏右侧「查看debug信息」`Switch`（`size="small"`） |
| **事件** | `onChange` |
| **代码位置** | `:1167`（仅双栏主视图分支） |
| **前置条件** | `!viewOpen` 且 `featureList.length > 0`（有 debug 特征数据时才显示） |

**执行流程**：
1. 切换时调用 `setFeatureOpen(true)`（注意：只能开启，没有 toggle，`onChange` 固定调用 `setFeatureOpen(true)`）
2. `featureOpen` 为 `true` 时，打开「选取特征分数」Modal（`:1619`），Modal 内展示 `featureList` 的 `Checkbox.Group`

**UI 变化**：
- 点击后弹出「选取特征分数」Modal
- Modal 内可多选特征，点「保存」关闭（`setFeatureOpen(false)`），点「清空」清除已选项

---

## 交互 4：切换「作业视图」Switch

| 字段 | 内容 |
|------|------|
| **触发元素** | 导航栏右侧「作业视图」`Switch`（`size="small"`） |
| **事件** | `onChange` |
| **代码位置** | `:1200`（双栏主视图分支） |
| **前置条件** | `task.skuSnapshot === 1`（任务配置中 `skuSnapshot` 为 1 时才渲染此 Switch） |

**执行流程**：
1. 切换时调用 `setViewOpen((pre) => !pre)`，翻转 `viewOpen` 状态
2. `viewOpen` 同时传入子组件（`:946`）控制作业视图的渲染模式

**UI 变化**：
- 开启（`viewOpen = true`）：
  - 「同步滑动」「查看debug信息」「展示广告」三个 Switch 全部隐藏（`:1150` `!viewOpen` 条件）
  - 商品瀑布流区域 `minWidth` 从 `fit-content` 变为 `inherit`（`:1120`），区域可自适应拉伸
  - 商品列表切换为作业视图布局（由子组件内部处理）
- 关闭（`viewOpen = false`）：恢复正常评估视图，其余三个 Switch 重新显示
