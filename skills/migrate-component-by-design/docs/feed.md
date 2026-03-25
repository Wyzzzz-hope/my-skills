# PDD 搜索结果页 · 商品瀑布流交互文档

**涉及文件**：
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareDoubleRichItem.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/doubleItem.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/singleItem.tsx`
- `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/detail.tsx`

---

## 目录

| # | 交互名称 | 触发方式 | 代码位置 |
|---|---------|---------|---------|
| 1 | 点击商品卡片（双栏布局） | `onClick` | `compareDoubleRichItem.tsx:1480` |
| 2 | 点击商品卡片（单栏布局） | `onClick` | `compareDoubleRichItem.tsx:1574` |
| 3 | 悬停 → 点击「查看商品详情」浮层（双栏） | `onClick` | `compareDoubleRichItem.tsx:1529` |
| 4 | 悬停 → 点击「查看商品详情」浮层（单栏） | `onClick` | `compareDoubleRichItem.tsx:1659` |
| 5 | PDD 商品详情浮层打开（自动加载数据） | `useEffect` | `detail.tsx:74` |
| 6 | 详情页 → 切换商品图片（左箭头） | `onClick` | `detail.tsx:123` |
| 7 | 详情页 → 切换商品图片（右箭头） | `onClick` | `detail.tsx:142` |
| 8 | 详情页 → 点击底部按钮打开 SKU 面板 | `onClick` | `detail.tsx:1998` |
| 9 | SKU 面板 → 点击关闭按钮 | `onClick` | `detail.tsx:2339` |
| 10 | SKU 面板 → 点击规格选项 | `onClick` | `detail.tsx:2381` |
| 11 | SKU 面板 → 点击「确定」按钮关闭面板 | `onClick` | `detail.tsx:2400` |
| 12 | 详情页 → 点击右上角关闭按钮 | `onClick` | `detail.tsx:2531` |
| 13 | 点击 Iframe 预览浮层的「关闭」按钮 | `onClick` | `compareDoubleRichItem.tsx:2449` |
| 14 | 详情页 → 点击图片轮播指示器小圆点 | `onClick` | `detail.tsx:119`（Carousel 内置） |

---

## 交互 1：点击商品卡片（双栏布局）

| 字段 | 内容 |
|------|------|
| **触发元素** | 双栏瀑布流中的单个商品卡片容器 `div.box` |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:1480` |
| **前置条件** | 当前为双栏布局（`PddDoubleItem`），`envType === 'pdd'` |

**执行流程**：
1. 调用 `setCurrentItem({ ...item, envIndex, envType, index: newIndex })`，将当前商品记录为选中状态
2. 调用 `setPos(item?.pos || item?.expPos)`，同步当前坑位号
3. 根据 `envIndex`：若为 0 调用 `setShowIframeItem1`，否则调用 `setShowIframeItem2`，记录 iframe 展示的商品信息

**UI 变化**：
- 被选中的商品卡片外边框变为蓝色（`1px solid #8BC5FF`），其他卡片边框透明
- 做题区联动展示该商品相关信息

---

## 交互 2：点击商品卡片（单栏布局）

| 字段 | 内容 |
|------|------|
| **触发元素** | 单栏瀑布流中的单个商品卡片容器 `div.box` |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:1574` |
| **前置条件** | 当前为单栏布局（`PddSingleItem`），`envType === 'pdd'` |

**执行流程**：
1. 调用 `setCurrentItem({ ...item, envIndex, envType, index: newIndex })`，记录当前选中商品
2. 调用 `setPos(item?.pos)`，同步坑位号
3. 根据 `keyIndex`：若为 0 调用 `setShowIframeItem1`，否则调用 `setShowIframeItem2`

**UI 变化**：
- 被选中卡片外边框变为蓝色（`1px solid #8BC5FF`），其余透明
- 做题区联动更新

---

## 交互 3：悬停商品卡片 → 点击「查看商品详情」浮层（双栏 PDD）

| 字段 | 内容 |
|------|------|
| **触发元素** | 双栏 PDD 商品卡片上的悬停浮层 `div.box-hoverLayer` |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:1529` |
| **前置条件** | `envType === 'pdd'`，双栏布局，鼠标悬停在商品卡片上后浮层出现 |

**执行流程**：
1. 判断 `envIndex`：为 0 时调用 `setDetailOpen1(true)`，否则调用 `setDetailOpen2(true)`

**UI 变化**：
- 打开对应侧的 PDD 商品详情浮层（`PddDetail` 组件覆盖在该列 Iframe 上方，`open` prop 变为 `true`）

---

## 交互 4：悬停商品卡片 → 点击「查看商品详情」浮层（单栏 PDD）

| 字段 | 内容 |
|------|------|
| **触发元素** | 单栏 PDD 商品卡片上的悬停浮层 `div.box-hoverLayer` |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:1659` |
| **前置条件** | `envType === 'pdd'`，单栏布局，鼠标悬停在商品卡片上后浮层出现 |

**执行流程**：
1. 判断 `envIndex`：为 0 时调用 `setDetailOpen1(true)`，否则调用 `setDetailOpen2(true)`

**UI 变化**：
- 打开对应侧的 PDD 商品详情浮层（`PddDetail` 组件以绝对定位覆盖在该列 Iframe 上，`zIndex: 11`）

---

## 交互 5：PDD 商品详情浮层打开（自动加载数据）

| 字段 | 内容 |
|------|------|
| **触发元素** | 详情浮层打开时自动触发（非用户点击，属于打开详情的后续行为） |
| **事件** | `useEffect`（依赖 `[item_id, ds, open]`） |
| **代码位置** | `detail.tsx:74` |
| **前置条件** | `open === true` 且 `item_id` 与 `ds` 均存在 |

**执行流程**：
1. 调用 `getPDDDetailDataByItemId({ itemId: item_id, ds })` 异步拉取详情数据
2. 成功：调用 `setPddDetailData(data)`，并设置默认选中规格 `setCurSku(spec_value)`
3. 失败：调用 `message.error()` 提示错误，同时调用 `onClose()` 关闭浮层

**UI 变化**：
- 详情页各区块（价格、标题、SKU、评论等）渲染真实数据

---

## 交互 6：详情页 → 切换商品图片（左箭头）

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderImg` 组件中的 `<LeftOutlined />` |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:123` |
| **前置条件** | 详情浮层已打开，商品图片数量 > 1 |

**执行流程**：
1. 调用 `carouselRef.current?.prev()`，Carousel 切换到上一张图片

**UI 变化**：
- 图片轮播区向左滑动，展示上一张主图

---

## 交互 7：详情页 → 切换商品图片（右箭头）

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderImg` 组件中的 `<RightOutlined />` |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:142` |
| **前置条件** | 详情浮层已打开，商品图片数量 > 1 |

**执行流程**：
1. 调用 `carouselRef.current?.next()`，Carousel 切换到下一张图片

**UI 变化**：
- 图片轮播区向右滑动，展示下一张主图

---

## 交互 8：详情页 → 点击底部按钮打开 SKU 面板

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderBottomButton` 组件中的按钮 `div`（左侧 / 右侧按钮，均复用同一组件） |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:1998` |
| **前置条件** | 详情浮层已打开，`pddDetailData?.newBottomSection?.left_button` 或 `right_button` 存在 |

**执行流程**：
1. 调用 `setShowSku(true)`，展开 SKU 选择面板

**UI 变化**：
- 底部弹出 SKU 规格选择面板（`RenderSkuDetail`），覆盖在详情页下方

---

## 交互 9：SKU 面板 → 点击关闭按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderSkuDetail` 组件顶部的 `<CloseOutlined />` |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:2339` |
| **前置条件** | SKU 面板已展开（`showSku === true`） |

**执行流程**：
1. 调用 `setShowSku(false)`，收起 SKU 面板

**UI 变化**：
- SKU 面板收起，详情页底部按钮重新可见

---

## 交互 10：SKU 面板 → 点击规格选项

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderSkuDetail` 中的规格选项 `div`（如颜色、尺寸等） |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:2381` |
| **前置条件** | SKU 面板已展开，规格列表已渲染 |

**执行流程**：
1. 调用 `setCurSku(text)`，记录当前选中的规格值
2. 调用 `setSelectedTextMap((prev) => ({ ...prev, [key]: index }))`，更新各维度已选规格的映射

**UI 变化**：
- 对应规格选项高亮显示为选中状态

---

## 交互 11：SKU 面板 → 点击「确定」按钮关闭面板

| 字段 | 内容 |
|------|------|
| **触发元素** | `RenderSkuDetail` 底部的红色「确定」按钮 `div` |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:2400` |
| **前置条件** | SKU 面板已展开 |

**执行流程**：
1. 调用 `setShowSku(false)`，收起 SKU 面板

**UI 变化**：
- SKU 面板收起，当前选中规格保持不变

---

## 交互 12：详情页 → 点击右上角关闭按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | 详情页右上角的关闭图标 `img`（`closeIcon`）所在的 `div` |
| **事件** | `onClick` |
| **代码位置** | `detail.tsx:2531` |
| **前置条件** | PDD 商品详情浮层已打开 |

**执行流程**：
1. 调用 `onClose()`，通知父组件关闭详情浮层
2. 父组件（`compareDoubleRichItem.tsx`）将 `detailOpen1` 或 `detailOpen2` 置为 `false`

**UI 变化**：
- 详情浮层关闭，该列 Iframe 重新完整显示

---

## 交互 13：点击 Iframe 预览浮层的「关闭」按钮

| 字段 | 内容 |
|------|------|
| **触发元素** | Iframe 预览浮层右上角的「关闭」文字按钮 |
| **事件** | `onClick` |
| **代码位置** | `compareDoubleRichItem.tsx:2449` |
| **前置条件** | Iframe 预览浮层已展开（`showIframe1 === true` 或 `showIframe2 === true`） |

**执行流程**：
1. 根据 `index`：若为 0 调用 `setShowIframe1(false)`，否则调用 `setShowIframe2(false)`

**UI 变化**：
- Iframe 预览浮层隐藏（`display: none`），商品卡片恢复正常显示

---

## 交互 14：详情页 → 点击图片轮播指示器小圆点

| 字段 | 内容 |
|------|------|
| **触发元素** | 商品详情浮层中图片轮播区域底部的 Carousel 指示器小圆点 |
| **事件** | `onClick`（Ant Design Carousel 内置） |
| **代码位置** | `detail.tsx:119~161`（`RenderImg` 组件中的 `<Carousel>`） |
| **涉及组件** | `src/pages/task/components/render_item_detail/SearchSbsAllSenceComponents/compareComponent/pdd/detail.tsx` |
| **前置条件** | PDD 商品详情浮层已打开，商品图片数量 > 1 |

**执行流程**：
1. 用户点击 Carousel 底部的某个指示器小圆点
2. Ant Design Carousel 内部调用 `goTo(index)`，跳转到对应索引的图片
3. 当前激活的小圆点样式高亮（背景色变深）

**UI 变化**：
- 图片轮播区切换到对应索引的图片（淡入淡出过渡动画）
- 指示器小圆点切换高亮状态：当前页圆点为深色，其余为浅色
- 若图片数量超过 5 张，指示器会显示省略号「...」

**注意事项**：
- 指示器小圆点的显示逻辑由 Ant Design Carousel 组件内置控制
- 除了点击小圆点外，用户也可以通过左右箭头或滑动手势切换图片
