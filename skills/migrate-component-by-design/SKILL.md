---
name: migrate-component-by-design
description: 根据用户提供的设计稿截图和功能简述，在当前项目中查找对应的 React 组件，迁移到用户提供的目录下，并输出说明文档。当用户提供 UI 截图、设计稿图片，或询问“这个界面/功能对应哪个组件”，提出“我要迁移组件”时使用此技能。
---

# 根据设计稿查找并拷贝组件

## 目标

将与设计稿对应的组件及其依赖文件迁移到用户确认的目标项目目录（`<PROJECT_DIR>/`）下，自动处理路径适配和依赖解析，mock 数据单独封装到 `<PROJECT_DIR>/src/mock/` 目录，生成可直接运行的测试页面，并输出一份说明文档。

---

## 迁移背景

本次迁移的对象是当前源项目中的**搜索结果页**组件，用户每次只迁移一个平台（淘宝 / 京东 / PDD）的某个区域，具体是哪个组件由 AI 根据截图自行搜索确定。

辅助定位视觉锚点（帮助 AI 根据截图快速判断平台）：
- **PDD**：红色渐变搜索栏、「百亿补贴」标签、红色筛选图标 ≡
- **京东**：白底搜索栏、「自营」红标、「X万+人种草」
- **淘宝**：橙色渐变搜索栏、「付款人数」文案

> 以上列表仅为参考方向，AI 仍需根据截图自行搜索确认，不得跳过搜索步骤。定位到组件后**整体迁移**，不纠结实现与截图的视觉差距。

---

## 工作流程

### Step 0：确认目标项目目录

首先询问用户目标项目的目录名称：

```
请告诉我目标项目的目录名称（如 demo-app、my-project 等），我将在当前工作区中查找或创建该目录。
```

收到目录名称后（以下用 `<PROJECT_DIR>` 表示），执行以下检查：

#### 情况 A：目录已存在且包含基础文件

若 `<PROJECT_DIR>/` 目录存在，且包含 `package.json`、`ice.config.mts`（或等效构建配置）、`src/` 等基础文件，说明项目已初始化，**直接跳到 Step 0-C 进行基础环境补全检查，然后进入 Step 1**。

#### 情况 B：目录不存在 → 使用 ice.js 脚手架创建

若目录不存在，使用以下命令创建项目：

```bash
npm create ice <PROJECT_DIR> --template @ice/lite-scaffold
```

> **注意**：此命令会在当前工作区下创建 `<PROJECT_DIR>/` 目录并生成完整的 ice.js 项目骨架。脚手架生成的所有文件（`package.json`、`ice.config.mts`、`tsconfig.json`、`src/`、`.browserslistrc` 等）**必须完整保留，不得删除或覆盖**。

创建完成后：
1. **阅读项目 README**：`read_file <PROJECT_DIR>/README.md`，了解项目的启动方式和说明
2. **检查目录结构**：`list_dir <PROJECT_DIR>/`，确认脚手架生成了哪些文件
3. 进入 Step 0-C 进行基础环境补全

#### Step 0-C：基础环境补全（在已有项目基础上补充迁移所需配置）

无论是已有项目还是新创建项目，都需要检查并补充以下迁移必需配置：

| 检查项 | 检查方式 | 说明 |
|--------|----------|------|
| antd 依赖 | 检查 `<PROJECT_DIR>/package.json` 中是否有 `antd` | 组件 UI 框架 |
| antd compact 主题 CSS | 检查入口文件是否引入 `antd/dist/antd.compact.css` | 紧凑主题，影响所有 antd 组件尺寸 |
| 全局样式 reset | 检查是否有 `global.less` 或等效全局 CSS reset | `body font-size`、`list-style: none` 等 |
| CSS Modules 支持 | 检查构建配置是否支持 `.module.less` | 组件样式隔离方案 |
| `@/` 路径别名 | 检查构建配置中是否有 `@/ → src/` 的 alias | 组件 import 路径依赖 |
| less-loader | 检查是否有 less 编译支持 | `.less` 文件编译 |
| `src/mock/` 目录 | 检查目录是否存在 | mock 数据存放位置 |
| `src/components/` 目录 | 检查目录是否存在 | 组件迁移目标目录 |

**补全原则**：
- **只补充缺失项，不覆盖已有配置**：脚手架已生成的配置优先保留，只在其基础上追加缺失内容
- **`package.json`**：仅追加缺失的依赖（`antd@^4.8.0`、`@ant-design/icons`、`classnames`、`lodash`、`umi-request` 等），不替换整个文件
- **`ice.config.mts`**：在现有配置基础上追加 `@/` 路径别名、less 支持等，不覆盖原文件
- **`src/app.ts`**：追加 `import 'antd/dist/antd.compact.css'` 和全局 less reset 引入
- **`src/typings.d.ts`**：若不存在则创建，声明 `.less`、`.css`、图片等资源模块类型
- **`src/mock/` 目录**：若不存在则 `mkdir -p <PROJECT_DIR>/src/mock`
- **`src/components/` 目录**：若不存在则 `mkdir -p <PROJECT_DIR>/src/components`

源项目关键全局配置参考（用于补全内容）：
- **antd compact 模式**：`config.ts` 中 `antd: { compact: true }`，效果为 `@font-size-base: 12px`、`@height-base: 28px` 等
- **主色调**：`primary-color: #1890ff`
- **全局样式**：`src/global.less` 中 `@import '~antd/es/style/themes/default.less'`（迁移时去掉 `~`）、`body { -webkit-font-smoothing: antialiased }`、`ul,ol { list-style: none }` 等
- **viewport**：`initial-scale=1`，无 rem/vw 自适应，所有尺寸固定 px

完成后告知用户基础环境已就绪，然后进入 Step 1。

### Step 1：引导用户提供设计稿截图

**仅询问截图**，等待用户回复后再进行下一步：

```
请提供设计稿截图，以便我准确定位对应的组件：

- 可以是页面的某个区域、某个弹窗、某个表单等局部截图
- 截图越清晰、范围越精确，查找结果越准确

（请直接粘贴图片或提供图片路径）
```

### Step 2：引导用户提供功能简述

收到截图后，再向用户询问功能描述：

```
收到截图！请再简单描述一下这部分的功能（1~3 句话即可），例如：
- "这是一个任务列表页面，支持分页、筛选和批量操作"
- "这是一个弹窗，用于编辑用户信息，包含姓名、邮箱等字段"
```

### Step 3：分析用户输入

收到截图和功能简述后，提取以下关键信息：

- **UI 类型**：列表 / 表单 / 弹窗 / 图表 / 卡片 / 导航 / 其他
- **关键功能点**：如筛选、分页、编辑、上传、导出等
- **关键词**：从功能描述/截图中提取业务关键词（如"任务"、"质检"、"报告"等）

### Step 4：在项目中搜索相关组件

按以下顺序搜索：

1. **搜索 `src/pages/` 目录**：根据功能关键词查找对应页面组件
2. **搜索 `src/components/` 目录**：查找可复用的通用组件
3. **搜索组件文件内容**：用业务关键词在 `.tsx` / `.ts` 文件中搜索

搜索时重点关注：
- 文件名与功能的匹配度
- 组件内的 JSX 结构是否与截图 UI 吻合
- 组件是否包含截图中的关键 UI 元素（Table、Form、Modal、Card 等）

### Step 5：分析依赖并按需抓取相关代码（核心步骤）

找到入口文件后，**读取源代码 → 识别相关部分 → 抽离到目标目录**，无关内容全部剪除。

> **核心约束（不可违反）**
> - **按需抓取**：只保留与目标功能直接相关的代码，无关的属性、分支、子组件、进口全部剪除
> - **纯净组件**：抓取后的组件不依赖任何源项目内部路径，可独立运行
> - **命名自由**：组件名、文件名、目录名可自行设计，不必完全与源项目一致
> - **声明源头**：每个输出文件必须在顶部注释中标注引自哪些源文件

#### 5.1 识别相关代码

阅读入口文件，明确以下内容：

1. **目标功能范围**：截图对应哪个组件 / 哪个函数 / 哪个分支（如 `envType === 'pdd'` 分支）
2. **相关依赖**：目标代码引用的 import、工具函数、类型、子组件
3. **无关内容**：其他平台分支、未使用的 props、未被调用的函数、其他平台的渲染逻辑

#### 5.2 抓取规则

| 内容类型 | 处理方式 |
|----------|----------|
| 目标组件 JSX 结构 | 保留 |
| 对应的样式规则（`.less` / `.module.less`） | 保留相关选择器，剪切无关的其他平台样式 |
| 被目标组件直接调用的工具函数 / 常量 | 保留 |
| 被目标组件直接引入的子组件 | 同样按需抓取 |
| 其他平台分支（如 `envType === 'jd'`、`envType === 'tb'`） | **剪除** |
| 未使用的 props 字段 / state 变量 | **剪除** |
| 未被调用的工具函数 | **剪除** |
| 源项目内部路径 import（如 `@/utils/xxx`） | 按需内联或转为相对路径 |
| 内部專用第三方包（如 `@ali/xxx`） | 记录为不可用依赖，提示用户手动处理 |

#### 5.3 输出文件组织

**命名原则**：根据组件功能自行设计清晰合理的命名，不必与源项目一致。

```
<PROJECT_DIR>/src/components/
└── XxxComponent/          ← 自行命名
    ├── index.tsx            ← 目标组件等抓取结果，顶部注释声明源文件
    ├── index.module.less    ← 只保留该组件相关的样式
    └── utils.ts             ← 从源项目工具文件中抓取的相关函数
```

**源文件声明格式**（每个输出文件顶部必写）：

```tsx
/**
 * 引自源文件：
 *   src/components/FilterCardHeader/index.tsx  ← 主要逻辑来源
 *   src/utils/formatPrice.ts                  ← 工具函数来源
 * 抓取范围： renderPDDFilter 函数 + 相关工具函数
 * 剪除内容： 淘宝/京东分支、envType 判断逻辑、未使用的 props
 */
```

#### 5.4 Service 处理

若组件依赖 service 调用接口，需对 service 进行 mock 化改造：

- **保留原始调用代码**（注释掉），新增同名函数返回 `Promise.resolve({ data: mockData })`
- 组件内调用方式完全不变，天然兼容 mock

```ts
// 引自源文件： src/components/XxxComponent/services.ts
import { mockXxxList } from '@/mock/XxxComponent';

// 原始接口调用（已注释）
// export async function fetchXxxList(params?: any) {
//   return request('/api/xxx/list', { params });
// }

// mock 替代
export async function fetchXxxList(params?: any) {
  return mockXxxList();
}
```

#### 5.5 完整性要求

- 抓取后的组件必须可独立编译运行，不得保留对源项目的内部路径 import
- 可调整的 TS 类型错误（如删除功能后第三方库类型不匹配）可修復
- 实际不可用的内部依赖（如 `@ali/xxx` 内部包）记录到说明文档，不强行引入

### Step 6：生成 `<PROJECT_DIR>/src/mock/` 目录下的 mock 数据

在 `<PROJECT_DIR>/src/mock/` 目录下为每个组件创建独立 mock 文件，文件名与组件名一致。

**原则**：mock 数据与组件文件完全分离，组件文件本身不做任何修改。

每个 mock 文件需包含两部分：

#### 6.1 Props mock 数据（必须提供）

读取组件的 `interface XxxProps` 或 `type XxxProps`，为每个 prop 提供合理的 mock 值，直接用于在页面中渲染组件验证样式效果：

```typescript
// 对应 XxxProps，可直接通过 props 传入组件查看样式效果
export const mockXxxProps = {
  // 按组件 interface 逐字段填充，字段名必须与 props 类型完全一致
  // 嵌套对象字段需匹配组件内部的实际取值路径（如 data?.list、item?.name 等）
  width: 800,
  query: '示例关键词',
  // ...
};
```

**注意**：嵌套结构必须通过阅读组件内部的 `.xxx?.yyy` 取值逻辑来确定，不能仅凭 interface 类型猜测字段名。

#### 6.2 接口 mock 数据（有 API 调用时提供）

mock 数据要求：
- 字段名与接口实际返回的字段**完全一致**（参考组件中的 `.data` 取值逻辑推断）
- 数据内容贴近真实业务场景，不使用无意义占位符（如 `xxx`、`test`）
- 列表类数据提供 3~5 条示例
- 若接口有分页，补充 `total`、`pageSize`、`current` 等字段
- 若有枚举状态（如 status），覆盖所有枚举值各一条

接口 mock 必须封装为**返回 Promise 的函数**，便于在 service 中通过 `IS_MOCK` 开关切换：

```typescript
// src/mock/XxxComponent.ts

// ---- Props mock 数据 ----
export const mockXxxProps = {
  // 字段名严格对应组件 interface，嵌套结构需读取组件内部取值逻辑确认
};

// ---- 接口 mock 数据 ----
// 对应接口：GET /api/xxx/list
export const mockXxxList = () =>
  Promise.resolve({
    data: [
      {
        id: 1,
        // 根据组件实际使用字段填充，贴近真实业务
      },
    ],
  });
```

### Step 7：生成测试组件

在 `<PROJECT_DIR>/src/test/` 下新建一个 `DemoXxx.tsx` 测试组件，将本次迁移的组件引入并传入 mock 数据，供用户在任意页面中直接 import 使用。

**原则**：
- 测试组件命名为 `Demo<ComponentName>`，放在 `<PROJECT_DIR>/src/test/Demo<ComponentName>.tsx`
- 组件内部仅做渲染展示，不引入任何新逻辑
- 所有 mock 数据均使用 `<PROJECT_DIR>/src/mock/` 中已生成的文件
- 如果被迁移组件需要通过 service 调接口，需将 service 中的 `IS_MOCK` 设为 `true`
- 若 `src/test/` 目录不存在，先执行 `mkdir -p <PROJECT_DIR>/src/test` 创建

```tsx
// <PROJECT_DIR>/src/test/DemoXxx.tsx
import { XxxComponent } from '@/components/XxxComponent';
import { mockXxxProps } from '@/mock/XxxComponent';

export default function DemoXxx() {
  return (
    <div style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
      <XxxComponent {...mockXxxProps} />
    </div>
  );
}
```

若本次迁移了多个组件，在同一测试组件中按设计稿顺序依次排列：

```tsx
export default function DemoSearchResult() {
  return (
    <div style={{ padding: 16, backgroundColor: '#f5f5f5' }}>
      <AaaComponent {...mockAaaProps} />
      <BbbComponent {...mockBbbProps} />
    </div>
  );
}
```

用户只需在目标页面中 `import DemoXxx from '@/test/DemoXxx'` 即可预览。

### Step 8：输出说明文档

完成后，在回复中向用户展示以下内容：

#### 8.1 目录结构及文件说明

列出 `<PROJECT_DIR>/` 目录下所有文件，每个文件附带一行功能说明：

```
<PROJECT_DIR>/
└── src/
    ├── global.less              ← 全局样式 reset（从源项目拷贝）
    ├── mock/
    │   └── XxxComponent.ts     ← Props mock + 接口 /api/xxx 的 mock 数据
    └── components/
        └── Xxx/
            ├── index.tsx        ← 主组件，负责 xxx 功能
            ├── style.less       ← 组件样式
            └── SubComponent/
                └── index.tsx   ← 子组件，负责 yyy 功能
```

#### 8.2 需安装的依赖

区分**生产依赖**和**开发依赖**，分别列出安装命令：

```bash
# 生产依赖（组件运行时必需）
npm install antd@x.x.x @ant-design/icons@x.x.x lodash classnames [其他运行时依赖]

# 开发依赖（仅构建/类型检查时需要）
npm install -D @types/lodash @types/classnames [其他类型定义/构建工具依赖]
```

判断依据：
- **生产依赖**：组件 import 直接使用的库（UI 框架、工具函数库、请求库等），运行时缺少会报错
- **开发依赖**：`@types/*` 类型定义包、构建工具插件、less/sass 预处理器等，仅开发/构建阶段需要

#### 8.3 涉及的 API 接口列表

列出所有被 mock 的接口，说明对应的 mock 文件位置：

| 接口路径 | 方法 | 对应 mock 文件 |
|----------|------|----------------|
| `/api/xxx/list` | GET | `<PROJECT_DIR>/src/mock/XxxComponent.ts → mockXxxList` |

#### 8.4 mock 数据使用方法

在说明文档中说明如何将 mock 数据接入组件：

1. **在 service 文件中通过 `IS_MOCK` 切换**：在组件对应的 service 文件顶部声明 `IS_MOCK` 变量，为 `true` 时使用 mock 数据，为 `false` 时走真实接口。

```ts
import request from 'umi-request';
import { mockXxxList } from '@/mock/XxxComponent';

const IS_MOCK = true; // true: 使用模拟数据, false: 使用真实接口

export async function fetchXxxList(params?: any) {
  if (IS_MOCK) {
    return mockXxxList();
  }
  return request('/api/xxx/list', { params });
}
```

调用方式保持不变：

```ts
fetchXxxList(params).then(res => {
  // res.data 结构与真实接口一致
});
```

2. **通过 props 传入**：对于不经过 service 的数据（如通过 props 透传的），在父组件中导入 mock 数据通过 props 传递

```tsx
import XxxComponent from '@/components/XxxComponent';
import { mockXxxProps } from '@/mock/XxxComponent';

export default function Index() {
  return <XxxComponent {...mockXxxProps} />;
}
```

3. **完整示例**：提供一个可直接运行的最小 Demo 代码片段，展示如何渲染目标组件

---

## 注意事项

- 若截图 UI 与多个组件相关，列出所有候选组件并说明差异，询问用户选择哪个
- 若未找到完全匹配的组件，列出最接近的结果，并说明差异点
- 若功能简述与截图存在明显矛盾，主动向用户确认
- **所有拓取的源代码必须真实存在**，不得猜测或编造
- **所有文件必须在完成 Step 4 的搜索定位后才操作**，确保入口文件正确
- **抓取约束**：只删除与目标功能无关的代码，不得重构逻辑、重命名变量、调整格式、修改注释、替换实现方式
- **文件命名和目录**：组件命名、文件名可自行设计，必须在文件头部注释中声明引自哪些源文件
- **不得凭空实现新逻辑**：所有输出代码均来自源项目文件的直接抓取，不得自行编写组件逻辑
