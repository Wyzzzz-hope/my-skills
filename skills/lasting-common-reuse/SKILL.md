---
name: lasting-common-reuse
description: 代码复用分析工具。专注于代码复用分析，提供三类建议：1) 识别可直接复用的公共能力（组件/函数等）；2) 建议修改现有公共代码以适配新场景；3) 建议将新代码封装为公共能力（组件/函数）供未来复用。支持持久化记忆，自动读取历史偏好，避免重复建议。当用户完成开发、请求"检查复用"、"分析重复代码"、"优化代码复用"或"提取公共组件"时触发。
version: 1.0.0
---

# 代码复用分析工具

系统化的代码复用分析流程，专注于识别复用机会，提供直接复用、改进复用、封装复用三类建议，结合用户历史记忆提供个性化方案。

**核心原则**：本工具**只关注代码复用**，不检查代码质量、代码规范、安全问题等其他维度。

## 核心功能

本 Skill 提供三类复用建议：

### 🔄 类型 A：直接复用现有代码
识别可以直接使用现有公共能力的场景，避免重复实现。

### ⚙️ 类型 B：改进现有代码
发现现有公共能力"差一点点"就能复用的情况，建议修改公共代码以适配新场景。

### 📦 类型 C：封装为公共代码
识别新编写的代码具有通用性，建议封装为公共组件/函数等公共能力供未来复用。

---

## 前置检查

### Step 0: 检查 lasting-memory Skill

**【强制要求】** 分析开始前，必须检查是否已安装 lasting-memory Skill。

1. **动态检测脚本路径**：根据当前运行环境自动判断 lasting-memory Skill 的位置
   - 检查常见路径：`.qoder/skills/lasting-memory/`、`.claude/skills/lasting-memory/`、`skills/lasting-memory/` 等
   - 优先检查当前工作目录下的隐藏目录

2. **检查方式**：检查 SKILL.md 文件是否存在

**【强制流程】如果未安装 lasting-memory Skill：**

立即停止并询问用户：

```
检测到您尚未安装 lasting-memory Skill。

lasting-memory Skill 可以帮助持久化存储您的代码复用偏好，避免重复提出您已拒绝的建议。

是否需要我帮您安装 lasting-memory Skill？（推荐安装）

请回复：
- "是" — 引导用户打开网站 <url>https://pre-clawhub.alibaba-inc.com/page/skills/529563/lasting-memory</url> 进行安装
- "否" — 本次分析将在没有历史记忆的情况下进行
```

**如果已安装**：继续执行 Step 1
**如果用户拒绝安装**：跳过记忆读取，直接进行分析

---

## 分析流程

### Step 1: 读取历史记忆（可选）

**前提**：lasting-memory Skill 已安装且用户同意使用。

读取 common-reuse 类别的历史记忆：

```bash
node <lasting-memory-path>/scripts/read.cjs --category common-reuse
```

**注意**：存储路径由脚本自动检测，无需指定 `--storage-path` 参数。

解析返回的记忆内容，调整分析策略：
- 跳过用户明确拒绝过的复用建议类型
- 尊重用户的复用偏好（例如：不修改某个公共组件、偏好自己实现某类功能）
- 优先关注用户认可的复用维度
- 避免重复提出被否决的方案

### Step 2: 获取代码变更

获取待分析的代码变更：

1. **使用 git diff 查看变更**：
   ```bash
   git diff HEAD
   ```
   如果没有 staged 的变更，检查 unstaged 变更：
   ```bash
   git diff
   ```

2. **识别变更的文件类型**：
   - 前端组件（.tsx, .jsx, .vue）
   - 工具函数（utils, helpers, services）
   - 样式文件（.css, .scss, .less）
   - Hooks（use*.ts, use*.tsx）
   - 业务逻辑等

3. **确定分析范围**：
   - 重点分析新增的代码行（+ 开头的行）
   - 适当关注修改的上下文

**如果没有代码变更**：
提示用户当前没有未提交的代码变更，询问是否需要分析特定文件或目录。

### Step 3: 扫描项目结构和依赖

**3.1 扫描公共代码目录**

检查项目中常见的公共代码目录：

**公共组件目录**：
- `src/components/`
- `components/`
- `lib/components/`

**公共函数目录**：
- `src/utils/`
- `src/helpers/`
- `src/lib/`
- `src/common/`
- `src/common/utils/`
- `utils/`
- `lib/`

**业务逻辑目录**：
- `src/services/`
- `src/api/`
- `src/hooks/`
- `src/store/`

使用 Glob 和 Read 工具快速扫描这些目录，建立可复用代码清单。

**3.2 读取项目依赖**

读取 `package.json` 文件，获取项目已安装的依赖库列表。

重点关注以下类型的库：
- UI 组件库（antd, material-ui, chakra-ui, element-plus 等）
- 工具函数库（lodash, ramda, date-fns, dayjs 等）
- 表单处理（react-hook-form, formik 等）
- 状态管理（zustand, jotai, valtio 等）
- 数据请求（axios, swr, react-query 等）

**注意**：只扫描已安装的依赖，不推荐新的第三方库。

### Step 4: 三维度复用分析

根据代码变更内容，按三个维度进行复用分析：

#### 🔄 维度 A：可直接复用的代码

检查新编写的代码是否可以用现有实现替代。

**分析点**：

**UI 组件复用**：
- [ ] **基础组件** — Button, Input, Select, Checkbox 等
- [ ] **布局组件** — Container, Grid, Flex, Stack 等
- [ ] **反馈组件** — Modal, Toast, Alert, Loading, Drawer 等
- [ ] **展示组件** — Card, Table, List, Avatar, Badge, Tag 等
- [ ] **导航组件** — Tabs, Menu, Breadcrumb, Pagination 等
- [ ] **表单组件** — Form, FormItem, DatePicker, Upload 等

**公共函数复用**：
- [ ] **日期处理** — 格式化、解析、计算、相对时间
- [ ] **数据格式化** — 数字千分位、货币、百分比、文件大小
- [ ] **数据验证** — 邮箱、手机号、URL、身份证、银行卡
- [ ] **数组操作** — 去重、分组、排序、过滤、分页
- [ ] **对象操作** — 深拷贝、合并、路径取值、差异比较
- [ ] **字符串处理** — 截断、脱敏、高亮、转换（驼峰/下划线）
- [ ] **文件处理** — 上传、下载、预览、格式转换
- [ ] **加密解密** — MD5、SHA、Base64、AES
- [ ] **防抖节流** — debounce、throttle
- [ ] **随机生成** — UUID、随机字符串、随机数

**自定义 Hooks 复用**：
- [ ] **状态管理** — useLocalStorage, useSessionStorage, useToggle, useBoolean
- [ ] **数据请求** — useFetch, useQuery, useMutation, usePagination
- [ ] **UI 交互** — useModal, useToast, useDebounce, useThrottle, useHover
- [ ] **表单** — useForm, useField, useValidation
- [ ] **生命周期** — useMount, useUnmount, useUpdateEffect, useInterval
- [ ] **工具** — useCopyToClipboard, useClickOutside, useMediaQuery, useTitle

**样式复用**：
- [ ] **CSS 变量** — 颜色、字体、间距、圆角、阴影等
- [ ] **工具类** — Tailwind CSS 类、utility classes
- [ ] **动画效果** — 过渡动画、关键帧动画
- [ ] **响应式** — 断点、栅格系统

**业务逻辑复用**：
- [ ] **API 调用** — 接口封装、请求拦截、错误处理、重试逻辑
- [ ] **权限控制** — 路由守卫、按钮权限、数据权限
- [ ] **数据转换** — DTO 转换、枚举映射、格式适配
- [ ] **业务规则** — 价格计算、折扣逻辑、库存检查

**判断标准**：
- 功能是否完全覆盖新代码的需求
- API 是否易用、符合新场景
- 性能是否满足需求
- 是否存在过度设计（新实现更简洁可能更合适）

#### ⚙️ 维度 B：可改进后复用的代码

检查现有公共代码是否"差一点点"就能满足新需求，建议修改以增强通用性。

**典型场景**：

1. **功能不完整**：现有能力缺少某个关键功能
   - 示例：Button 组件不支持 loading 状态，但新场景需要
   - 建议：为 Button 添加 `loading` prop 和加载图标

2. **参数不灵活**：现有能力的参数设计不够灵活
   - 示例：formatDate 函数只支持固定格式 'YYYY-MM-DD'
   - 建议：添加 `format` 参数，允许自定义格式

3. **样式不可定制**：现有组件样式写死，无法适配新场景
   - 示例：Modal 组件宽度固定 600px
   - 建议：添加 `width` prop 或 `className` prop

4. **业务逻辑耦合**：现有函数耦合了特定业务逻辑
   - 示例：validateForm 函数内部硬编码了某个业务规则
   - 建议：将业务规则提取为参数或配置

5. **类型定义不完善**：TypeScript 类型定义过于宽泛或严格
   - 示例：组件 props 使用 `any`，导致无法获得类型提示
   - 建议：完善类型定义，使用泛型增强灵活性

**分析原则**：
- 修改必须**向后兼容**，不能破坏现有使用场景
- 修改应该**提升通用性**，而不是为单一场景定制
- 修改成本要**合理**，不要为了复用强行重构
- 修改后要**更新文档和类型定义**

**判断标准**：
- 修改后能覆盖多少个使用场景（至少 2 个）
- 修改是否会影响现有调用方（向后兼容性）
- 修改的复杂度是否可接受
- 修改后是否需要同步更新其他地方

#### 📦 维度 C：可封装为公共代码的新实现

检查新编写的代码是否具有通用性，建议封装为公共能力。

**典型场景**：

1. **重复模式**：新代码实现了一个可能在多处使用的模式
   - 示例：自定义了一个带图标的输入框
   - 建议：封装为 IconInput 公共组件

2. **通用逻辑**：新函数处理的是常见的通用问题
   - 示例：写了一个格式化手机号的函数
   - 建议：移到 utils/format.ts，作为公共函数

3. **可复用布局**：新组件定义了一个常见的布局模式
   - 示例：实现了一个"标题+内容+底部按钮"的卡片布局
   - 建议：封装为 ActionCard 公共组件

4. **通用 Hook**：新 Hook 封装了可复用的状态逻辑
   - 示例：写了一个管理弹窗开关状态的 Hook
   - 建议：提取为 useModal Hook

5. **业务逻辑抽象**：新逻辑具有跨模块复用的潜力
   - 示例：实现了商品价格计算逻辑
   - 建议：封装为 calculatePrice 公共函数

**分析原则**：
- 代码必须是**通用的**，而不是针对特定业务场景
- 接口要**设计良好**，易于理解和使用
- 要考虑**复用频率**，不要为了一次性需求过度抽象
- 要评估**维护成本**，确保封装后更易维护

**判断标准**：
- 是否有至少 2-3 个潜在使用场景
- 接口是否清晰、易用
- 是否易于测试和维护
- 是否符合项目的代码组织规范

### Step 5: 生成复用建议清单

按照建议类型和优先级生成清晰的报告。

**报告格式**：

```markdown
## 代码复用分析报告

### 📊 分析摘要
- 分析文件数：X 个
- 新增代码行数：Y 行
- 发现复用机会：Z 个
  - 可直接复用：A 个
  - 可改进后复用：B 个
  - 建议封装为公共代码：C 个
- 预估减少代码行数：N 行

---

### 🔄 类型 A：可直接复用现有代码

#### [HIGH] 高优先级

##### 1. 复用项目 Button 组件

- **新代码位置**：`src/pages/UserProfile/MyButton.tsx:10-45`
- **可复用代码**：`src/components/common/Button.tsx`
- **类型**：UI 组件
- **原因**：项目已有 Button 组件，支持 variant、size、disabled 等 props，功能完全覆盖当前实现
- **预估收益**：
  - 减少 35 行代码
  - 统一 UI 风格和交互行为
  - 自动支持主题切换和无障碍访问
- **使用方式**：
  ```tsx
  import { Button } from '@/components/common/Button'

  <Button variant="primary" size="md" onClick={handleClick}>
    点击
  </Button>
  ```

#### [MEDIUM] 中优先级

##### 2. 使用 utils 中的 formatDate 函数

- **新代码位置**：`src/pages/OrderList/utils.ts:15-25`
- **可复用代码**：`src/utils/date.ts > formatDate()`
- **类型**：公共函数
- **原因**：
  - 项目已有 formatDate 函数，支持多种日期格式
  - 当前实现功能与 formatDate 重复
- **预估收益**：减少 10 行代码，避免日期处理 bug
- **使用方式**：
  ```ts
  import { formatDate } from '@/utils/date'

  const formatted = formatDate(date, 'YYYY-MM-DD HH:mm:ss')
  ```
- **注意**：formatDate 已处理时区问题，可以直接使用

---

### ⚙️ 类型 B：建议改进现有公共代码

#### [HIGH] 高优先级

##### 3. 为 Modal 组件添加 footer 自定义支持

- **新代码位置**：`src/pages/Settings/ConfirmDialog.tsx:20-50`
- **现有公共代码**：`src/components/common/Modal.tsx`
- **当前问题**：Modal 组件的 footer 区域只支持"确定"和"取消"两个按钮，无法自定义
- **新场景需求**：需要在 footer 添加第三个"稍后处理"按钮
- **改进建议**：
  - 为 Modal 组件添加 `footer` prop，类型为 `ReactNode | null`
  - 当 `footer` 为 `null` 时不显示底部
  - 当 `footer` 为 `ReactNode` 时渲染自定义内容
  - 保留默认行为：不传 `footer` 时显示默认的"确定"和"取消"按钮
- **向后兼容性**：✅ 不影响现有调用方，默认行为保持不变
- **预估收益**：
  - 新场景可直接复用 Modal，减少 30 行代码
  - 提升 Modal 组件的灵活性，未来其他场景也能受益
- **改进实施**：
  ```tsx
  // src/components/common/Modal.tsx
  interface ModalProps {
    // ... 现有 props
    footer?: ReactNode | null // 新增
  }

  export const Modal = ({ footer, ...props }: ModalProps) => {
    return (
      <div className="modal">
        {/* ... 标题和内容 */}
        {footer === undefined ? (
          <div className="modal-footer">
            {/* 默认的确定和取消按钮 */}
          </div>
        ) : footer !== null ? (
          <div className="modal-footer">{footer}</div>
        ) : null}
      </div>
    )
  }
  ```
- **使用方式**（改进后）：
  ```tsx
  <Modal
    title="确认操作"
    footer={
      <>
        <Button onClick={handleConfirm}>确定</Button>
        <Button onClick={handleLater}>稍后处理</Button>
        <Button onClick={handleCancel}>取消</Button>
      </>
    }
  >
    内容...
  </Modal>
  ```

#### [MEDIUM] 中优先级

##### 4. 为 formatNumber 函数添加自定义分隔符参数

- **新代码位置**：`src/pages/Report/utils.ts:8-12`
- **现有公共函数**：`src/utils/format.ts > formatNumber()`
- **当前问题**：formatNumber 函数固定使用逗号作为千分位分隔符，但新场景需要使用空格
- **新场景需求**：某些国家/地区习惯用空格作为千分位分隔符（如 1 000 000）
- **改进建议**：
  - 添加可选参数 `separator`，默认值为 `','`
  - 支持自定义千分位分隔符
- **向后兼容性**：✅ 不传 `separator` 时行为不变
- **改进实施**：
  ```ts
  // src/utils/format.ts
  export function formatNumber(
    num: number,
    decimals: number = 0,
    separator: string = ',' // 新增参数
  ): string {
    return num
      .toFixed(decimals)
      .replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  }
  ```

---

### 📦 类型 C：建议封装为公共代码

#### [HIGH] 高优先级

##### 5. 将 useFormValidation Hook 封装为公共 Hook

- **新代码位置**：`src/pages/UserForm/hooks/useFormValidation.ts:1-45`
- **封装建议**：移动到 `src/hooks/useFormValidation.ts`
- **理由**：
  - 该 Hook 封装了通用的表单验证逻辑，不依赖特定业务
  - 已经有良好的接口设计，易于在其他场景使用
  - 项目中至少有 3 处表单可以复用此 Hook
- **潜在使用场景**：
  - 用户注册表单
  - 商品编辑表单
  - 设置页面的表单
- **预估收益**：
  - 未来可减少约 40-50 行重复代码（每个表单）
  - 统一表单验证逻辑和错误提示
  - 易于维护和测试
- **封装建议**：
  1. 移动文件到 `src/hooks/useFormValidation.ts`
  2. 导出清晰的 TypeScript 类型定义
  3. 添加 JSDoc 注释说明使用方法
  4. 编写单元测试（可选但推荐）

#### [MEDIUM] 中优先级

##### 6. 将价格计算逻辑封装为公共函数

- **新代码位置**：`src/pages/OrderDetail/index.tsx:80-120`
- **封装建议**：提取为 `src/utils/price.ts > calculateOrderPrice()`
- **理由**：
  - 价格计算逻辑包含折扣、运费、税费等，较为复杂
  - 该逻辑在订单详情、购物车、结算页面都可能用到
  - 封装后易于单元测试，保证计算准确性
- **接口设计建议**：
  ```ts
  interface PriceInput {
    items: Array<{ price: number; quantity: number }>
    discount?: number // 折扣率，0-1
    shippingFee?: number // 运费
    taxRate?: number // 税率，0-1
  }

  interface PriceOutput {
    subtotal: number // 小计
    discountAmount: number // 折扣金额
    shippingFee: number // 运费
    taxAmount: number // 税额
    total: number // 总价
  }

  export function calculateOrderPrice(input: PriceInput): PriceOutput
  ```

---

### 💡 第三方库使用建议

项目已安装但未充分使用的依赖库：

- **lodash**（已安装）：可用于数组和对象操作，在 `src/utils/array.ts` 中有多个函数可用 lodash 替代
- **react-hook-form**（已安装）：可用于复杂表单管理，当前项目大多数表单仍在手动管理状态

---

**注意事项**：
- 每条建议必须具体明确，包含文件路径和行号
- 类型 B（改进建议）必须说明向后兼容性
- 类型 C（封装建议）必须说明至少 2 个潜在使用场景
- 提供具体的代码示例
- 预估收益要实际可衡量

### Step 6: 征求用户意见

生成报告后，询问用户：

```
以上是本次复用分析的建议，包含三类：
- 🔄 类型 A：可直接复用现有代码（X 条）
- ⚙️ 类型 B：建议改进现有公共代码（Y 条）
- 📦 类型 C：建议封装为公共代码（Z 条）

请告诉我：

1. 你是否同意这些建议？
2. 有哪些建议你认为不需要采纳？请说明原因。
3. 是否需要我帮你实施某些建议？

回复格式示例：
- 同意全部建议，请帮我实施类型 A 的第 1、2 条
- 拒绝第 X 条，原因：xxx
- 第 Y 条需要调整，我希望 xxx
- 类型 B 的建议我自己来改，类型 C 的请你帮我封装
```

**重要**：
- 等待用户明确回复后再进行下一步
- 不要自作主张直接修改代码
- 类型 B（改进公共代码）尤其需要谨慎，必须得到用户同意

### Step 7: 存储用户反馈（可选）

**前提**：lasting-memory Skill 已安装且用户同意使用。

根据用户回复，存储反馈记忆到 common-reuse 类别：

**如果用户拒绝某条建议：**

```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "拒绝建议：<建议类型>-<简短描述>" \
  --content "类型：<A/B/C>。用户拒绝了建议：<建议内容>。原因：<用户原因>。涉及文件：<文件路径>。上下文：<相关技术栈或场景>。" \
  --keywords "<关键词,多个用逗号分隔>"
```

**示例 - 拒绝类型 A 建议**：
```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "拒绝建议：类型A-不使用公共Modal" \
  --content "类型：A（直接复用）。用户拒绝了使用公共 Modal 组件的建议。原因：当前场景需要完全自定义的样式和动画，公共 Modal 太重了。涉及文件：src/pages/Settings/CustomDialog.tsx。上下文：设置页面的轻量级确认弹窗。" \
  --keywords "Modal,组件复用,拒绝"
```

**示例 - 拒绝类型 B 建议**：
```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "拒绝建议：类型B-不修改公共Button" \
  --content "类型：B（改进公共代码）。用户拒绝了为公共 Button 组件添加 loading 状态的建议。原因：团队约定 Button 保持简单，loading 状态应该由业务层自己处理。涉及文件：src/components/common/Button.tsx。上下文：团队架构决策。" \
  --keywords "Button,组件改进,团队约定,拒绝"
```

**示例 - 拒绝类型 C 建议**：
```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "拒绝建议：类型C-不封装验证函数" \
  --content "类型：C（封装为公共代码）。用户拒绝了将 validatePhoneNumber 封装为公共函数的建议。原因：该验证逻辑包含特定业务规则（只验证中国大陆手机号），不具备通用性。涉及文件：src/pages/Register/utils.ts。上下文：用户注册场景。" \
  --keywords "验证函数,封装,业务特定,拒绝"
```

**如果用户表达偏好：**

```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "用户偏好：<偏好标题>" \
  --content "<偏好内容>" \
  --keywords "<关键词>"
```

**示例**：
```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "用户偏好：谨慎修改公共组件" \
  --content "用户表示对类型 B（改进公共代码）的建议持谨慎态度，认为修改公共组件可能影响现有功能。倾向于先复制公共组件到业务模块修改，验证稳定后再考虑合并回公共代码。" \
  --keywords "公共组件,修改策略,偏好"
```

**如果用户认可某类建议：**

```bash
node <lasting-memory-path>/scripts/create.cjs \
  --category common-reuse \
  --title "认可建议：<建议类型>-<简短描述>" \
  --content "类型：<A/B/C>。用户认可了 <具体建议>，并成功实施。后续可继续关注此类复用机会。收益：<实际收益>。" \
  --keywords "<关键词>"
```

**注意**：
- 存储路径由脚本自动检测，无需指定 `--storage-path` 参数
- 记录要包含建议类型（A/B/C），便于后续分析
- 记录要包含足够的上下文，特别是类型 B 和 C 的反馈

---

## 分析原则

### 三类建议的优先级判断

**类型 A（直接复用）> 类型 C（封装）> 类型 B（改进）**

优先级说明：
1. **类型 A**：收益最直接，风险最低，优先推荐
2. **类型 C**：提升代码质量，无破坏性风险，次优先
3. **类型 B**：需要修改公共代码，有影响现有功能的风险，最谨慎

### 复用建议的质量标准

**必须遵守**：
1. **具体明确** — 指出具体的文件、行号、可复用的代码
2. **解释原因** — 说明为什么建议复用/改进/封装
3. **提供方案** — 给出具体的代码示例
4. **评估收益** — 说明预期收益和潜在风险
5. **尊重偏好** — 参考历史记忆，避免重复建议

**权衡考虑**：
- **不要过度复用** — 复用成本高于重写时，不建议
- **不要破坏简洁性** — 现有实现更简单时，不强求复用
- **不要忽略上下文** — 考虑业务特殊性，不是所有相似代码都应复用
- **不要冒进改进** — 类型 B 建议要特别谨慎，确保向后兼容

### 类型 B（改进建议）的特殊原则

**必须满足**：
- ✅ 向后兼容，不破坏现有调用方
- ✅ 提升通用性，而非为单一场景定制
- ✅ 改进后至少覆盖 2 个以上场景
- ✅ 修改复杂度可接受，不过度重构

**避免的情况**：
- ❌ 为了适配一个场景而添加复杂参数
- ❌ 修改会破坏现有功能或 API
- ❌ 改进后反而让公共能力代码变得难以理解
- ❌ 修改需要同步更新大量调用方

### 类型 C（封装建议）的特殊原则

**必须满足**：
- ✅ 至少有 2-3 个潜在使用场景
- ✅ 接口设计清晰、易用
- ✅ 不依赖特定业务逻辑
- ✅ 易于测试和维护

**避免的情况**：
- ❌ 一次性需求，未来不太可能复用
- ❌ 逻辑过于简单，封装后反而增加复杂度
- ❌ 耦合了特定业务规则，不具备通用性
- ❌ 接口设计过于复杂，难以理解

---

## 常见场景示例

### 场景 1：类型 A - 直接复用

**情况**：用户新建了一个按钮组件，但项目已有公共 Button。

**建议**：
```
🔄 类型 A：可直接复用现有代码

复用项目 Button 组件
- 新代码：src/pages/Dashboard/MyButton.tsx
- 可复用：src/components/common/Button.tsx
- 预估收益：减少 30 行代码，统一 UI 风格
```

### 场景 2：类型 B - 改进后复用

**情况**：用户新建了一个 Modal，公共 Modal 功能类似但缺少 footer 自定义。

**建议**：
```
⚙️ 类型 B：建议改进现有公共代码

为 Modal 组件添加 footer 自定义支持
- 当前问题：公共 Modal 的 footer 固定为"确定"和"取消"
- 新场景需求：需要三个按钮
- 改进方案：添加 footer prop，支持自定义内容
- 向后兼容：✅ 不影响现有调用方
```

### 场景 3：类型 C - 封装为公共代码

**情况**：用户实现了一个表单验证 Hook，逻辑通用且设计良好。

**建议**：
```
📦 类型 C：建议封装为公共代码

将 useFormValidation Hook 封装为公共 Hook
- 新代码：src/pages/UserForm/hooks/useFormValidation.ts
- 封装位置：src/hooks/useFormValidation.ts
- 理由：逻辑通用，项目中至少 3 处表单可复用
- 预估收益：未来每个表单可减少 40-50 行代码
```

### 场景 4：三类建议同时存在

**情况**：用户实现了多个功能，同时存在可直接复用、可改进、可封装的代码。

**建议**：
```
📊 分析摘要
- 类型 A：2 条（直接复用 Button 和 formatDate）
- 类型 B：1 条（改进 Modal 组件）
- 类型 C：1 条（封装 useFormValidation Hook）

优先级建议：
1. 先处理类型 A，立即减少重复代码
2. 再处理类型 C，提升未来复用能力
3. 最后考虑类型 B，需谨慎评估影响
```

---

## 绝不要做

1. **绝不重复提出用户已拒绝的建议** — 每次分析前必须读取记忆
2. **绝不自作主张修改公共代码** — 类型 B 建议必须征得用户同意
3. **绝不忽略用户的反馈** — 所有反馈都必须记录，特别是类型 B 和 C 的反馈
4. **绝不推荐未安装的第三方库** — 只建议使用已安装的依赖
5. **绝不过度复用** — 复用应该让代码更简洁，而不是更复杂
6. **绝不冒进改进** — 类型 B 建议要确保向后兼容，不能破坏现有功能

---

## 依赖说明

本 Skill **可选依赖** **lasting-memory Skill** 实现持久化记忆功能。

**Skill 脚本路径检测**：
- 检查顺序：`.claude/skills/lasting-memory/` → `.qoder/skills/lasting-memory/` → `skills/lasting-memory/`

**存储路径**：
- 由 lasting-memory 脚本自动检测，无需手动指定 `--storage-path` 参数

**lasting-memory Skill 状态处理**：

| 状态 | 行为 |
|------|------|
| **已安装** | 读取 common-reuse 类别记忆，分析后存储用户反馈 |
| **未安装** | 征求用户同意后引导安装，用户拒绝则继续无记忆分析 |
| **用户拒绝使用** | 跳过记忆读取和存储，直接进行复用分析 |

**注意**：本 Skill 只处理 **common-reuse** 类别的记忆。