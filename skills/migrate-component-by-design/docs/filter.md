# PDD 搜索结果页 · 筛选区交互文档

**涉及组件**：`src/components/FilterCardHeader/index.tsx`（PDD 分支）

---

## 目录

| # | 交互名称 | 触发方式 | 代码位置 |
|---|---------|---------|---------|
| 1 | 点击「筛选」按钮 | `onClick` | `index.tsx:432` |
| 2 | 点击筛选标签栏中某个筛选 Tag | `onClick` | `index.tsx:1111` |
| 3 | 点击「展开所有筛选」↓ 按钮 | `onClick` | `index.tsx:1155` |
| 4 | 点击「收起所有筛选」↑ 按钮 | `onClick` | `index.tsx:1148` |
| 5 | 在「展开全部筛选」面板中点击某个 Tag | `onClick` | `index.tsx:1187` |
| 6 | 点击全部筛选弹窗中「确认」按钮 | `onClick` | `index.tsx:1334` |
| 7 | 点击筛选弹窗内「更多」Tag | `onClick` | `index.tsx:69` |
| 8 | 点击筛选弹窗内「收起」按钮 | `onClick` | `index.tsx:187` |
| 9 | 点击图文场景导航区 Tab 切换 | antd Tabs 内置 | `index.tsx:1253` |
| 10 | 点击图文场景导航区「展开 ↓」按钮 | `onClick` | `index.tsx:1267` |
| 11 | 点击图文场景导航区「收起 ↑」按钮 | `onClick` | `index.tsx:1260` |
| 12 | 点击遮罩层关闭展开面板 | `onClick` | `index.tsx:1205` |

---

## 交互 1：点击「筛选」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 排序栏中红色「筛选 ☰」div |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:432` |
| **前置条件** | 无 |

**执行流程**：
1. `filterModOpen = true`（`:434`）

**UI 变化**：
- 全屏遮罩 + 从底部弹出全部筛选面板（`renderPDDFilterMod`，`:1296`）
- 面板内展示价格区间 + 属性标签分组列表

---

## 交互 2：点击筛选标签栏中某个筛选 Tag

| 字段 | 内容 |
|------|------|
| **触发元素** | 横向滚动筛选栏中的各 tag div（`renderPDDFilterItem`） |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1111` |
| **前置条件** | `filterMod` 已挂载（PDD 分支由 prop 传入） |

**执行流程**：
1. `allFilterOpen = false`（收起展开全部面板）
2. 若点击的是当前已选中项（`filterItem.name === selectedFilter.name`）：
   - `filtersOpen = false`，`selectedFilter = null`（取消选中，收起子列表）
3. 若点击新 tag：
   - `selectedFilter = filterItem`
   - 若该 tag 有 `items`（子选项）→ `filtersOpen = true`（展开子列表面板）
   - 若无 `items` → `filtersOpen = false`

**UI 变化**：
- Tag 高亮选中样式切换（`selected` / `sub-selected`，`:1125`）
- Tag 内图标切换为 selected 图（`:1074`）
- 若有子选项：Tag 右侧箭头由 ↓ 变 ↑，下方展开 `filtersOpen` 面板（`:1166`），显示子 item 列表
- 同时出现半透明遮罩层（`:1205`）

---

## 交互 3：点击「展开所有筛选」↓ 按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 筛选栏右侧 `DownOutlined` 图标 |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1155` |
| **前置条件** | `allFilterOpen === false`（当前处于收起状态才显示此按钮） |

**执行流程**：
1. `selectedFilter = null`
2. `filtersOpen = false`
3. `allFilterOpen = true`

**UI 变化**：
- 筛选栏下方展开「展开全部筛选 tag」面板（`pdd-filter-popover`，`:1179`）
- 图标切换为 `UpOutlined`
- 同时出现半透明遮罩层（`:1205`）

---

## 交互 4：点击「收起所有筛选」↑ 按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 筛选栏右侧 `UpOutlined` 图标 |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1148` |
| **前置条件** | `allFilterOpen === true` |

**执行流程**：
1. `filtersOpen = false`
2. `allFilterOpen = false`

**UI 变化**：
- 展开的全部筛选面板收起
- 遮罩层消失

---

## 交互 5：在「展开全部筛选」面板中点击某个 Tag

| 字段 | 内容 |
|------|------|
| **触发元素** | `pdd-filter-popover` 内的筛选 tag div |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1187` |
| **前置条件** | `allFilterOpen === true`（面板展开状态） |

**执行流程**：
1. `allFilterOpen = false`（关闭展开面板）
2. `selectedFilter = filterItem`
3. 若该 item 有 `items` → `filtersOpen = true`
4. 若无 `items` → `filtersOpen = false`

**UI 变化**：
- 展开全部面板关闭
- 对应 tag 在横向筛选栏中高亮选中
- 若有子选项，子列表面板展开

---

## 交互 6：点击全部筛选弹窗中「确认」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | `renderPDDFilterMod` 内的「确认」Button |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1334` |
| **前置条件** | `filterModOpen === true`（弹窗已打开） |

**执行流程**：
1. `filterModOpen = false`

**UI 变化**：
- 全部筛选弹窗关闭，遮罩消失

---

## 交互 7：点击筛选弹窗内「更多」Tag

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderFilterModItems` 内的「更多」tag div |
| **事件** | `onClick` → `() => setHidden(false)` |
| **代码位置** | `FilterCardHeader/index.tsx:69` |
| **前置条件** | `hidden === true` 且该分组 items 数量 > 8 |

**执行流程**：
1. `hidden = false`

**UI 变化**：
- 展示该分组的所有 tag（隐藏态下最多展示 8 个）
- 「更多」按钮消失，出现「收起」按钮

---

## 交互 8：点击筛选弹窗内「收起」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderFilterModItems` 内的「收起」div |
| **事件** | `onClick` → `() => setHidden(true)` |
| **代码位置** | `FilterCardHeader/index.tsx:187` |
| **前置条件** | `hidden === false` |

**执行流程**：
1. `hidden = true`

**UI 变化**：
- 该分组超出 8 个的 tag 收起
- 「收起」按钮消失，恢复「更多」按钮

---

## 交互 9：点击图文场景导航区 Tab 切换

| 字段 | 内容 |
|------|------|
| **触发元素** | `Tabs` 组件的 Tab 标签（`renderPddSceneHeader`） |
| **事件** | antd Tabs 内置切换逻辑（`defaultActiveKey="0"`，无自定义 `onChange`） |
| **代码位置** | `FilterCardHeader/index.tsx:1253` |
| **前置条件** | `sceneHeader` 数据存在且有多个 Tab |

**执行流程**：
1. antd Tabs 内部切换当前 `activeKey`

**UI 变化**：
- 切换场景导航图文列表内容

---

## 交互 10：点击图文场景导航区「展开 ↓」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | Tabs 右侧 `DownOutlined` |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1267` |
| **前置条件** | `allSceneOpen === false` |

**执行流程**：
1. `filtersOpen = false`
2. `selectedFilter = null`
3. `allSceneOpen = true`

**UI 变化**：
- 场景图文区展开为多行（`.expand` 样式，`:1285`）
- 全局遮罩 `.popover-mask` 出现（`:1378`）

---

## 交互 11：点击图文场景导航区「收起 ↑」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | Tabs 右侧 `UpOutlined` |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1260` |
| **前置条件** | `allSceneOpen === true` |

**执行流程**：
1. `filtersOpen = false`
2. `allSceneOpen = false`

**UI 变化**：
- 图文区恢复单行，遮罩消失

---

## 交互 12：点击遮罩层关闭展开面板

| 字段 | 内容 |
|------|------|
| **触发元素** | 半透明遮罩层 `div.popover-mask`（覆盖在筛选栏下方，背景色 `rgba(0, 0, 0, 0.1)`） |
| **事件** | `onClick` |
| **代码位置** | `FilterCardHeader/index.tsx:1205`、`search_sbs_all_scene.tsx:1378` |
| **涉及组件** | `src/components/FilterCardHeader/index.tsx` |
| **前置条件** | 筛选栏子选项面板、展开全部筛选面板、或图文场景导航展开时，页面上会出现半透明遮罩 |

**执行流程**：
1. 用户点击遮罩层空白区域（非面板内容区域）
2. 根据当前状态调用对应的关闭函数：
   - 若 `filtersOpen === true`（子选项面板展开）→ 调用 `setFiltersOpen(false)`、`setSelectedFilter(null)`
   - 若 `allFilterOpen === true`（展开全部筛选面板）→ 调用 `setAllFilterOpen(false)`、`setFiltersOpen(false)`
   - 若 `allSceneOpen === true`（图文场景展开）→ 调用 `setAllSceneOpen(false)`、`setFiltersOpen(false)`

**UI 变化**：
- 展开的面板收起（无论是子选项面板、全部筛选面板还是图文场景面板）
- 遮罩层消失（`display: none`）
- 筛选栏恢复初始状态（无选中 tag）

**注意事项**：
- 遮罩层的 `zIndex` 为 `10`，低于面板内容（面板 `zIndex` 为 `11`），确保点击面板内容不会触发关闭
- 遮罩层采用固定定位（`position: fixed`），覆盖整个视口
- 遮罩层的显示条件为 `filtersOpen || allFilterOpen || allSceneOpen`，任一面板展开时遮罩即显示
