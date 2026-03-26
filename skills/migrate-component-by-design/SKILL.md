---
name: migrate-component-by-design
description: 根据用户提供的设计稿截图和功能简述，从组件列表中选择对应的组件，迁移到指定目录下，生成 mock 数据和测试组件，确保样式、功能和交互与源项目完全一致。
---

# 根据设计稿迁移组件

## 目标

将与设计稿对应的组件及其依赖文件从当前源项目中抽离并迁移到目标项目目录（`<PROJECT_DIR>/`）下，确保：
- **样式完全一致**：保留所有相关样式规则，包括全局样式依赖
- **功能完全一致**：保留所有业务逻辑和交互行为
- **独立可运行**：自动处理路径适配和依赖解析
- **Mock 数据完整**：生成真实可用的 mock 数据，便于预览和测试
- **清晰文档输出**：提供完整的目录结构、依赖安装和使用说明

---

## 工作流程

### Step 0：确认目标项目目录

首先查看当前工作区中除了 `audience-insights-frontend` 之外的所有项目目录，然后引导用户选择目标目录：

**操作步骤**：

1. **列出可用目录**：
   ```bash
   ls -d /Users/wyz/Desktop/nex-workspace/*/ | grep -v audience-insights-frontend | xargs -n1 basename
   ```
   将结果展示给用户，例如：
   ```
   当前工作区中可用的项目目录：
   - micro-tb-search-result-audit
   - [其他项目目录...]

   请选择你要迁移组件到的目标项目目录名称。
   ```

2. **用户选择目录**：收到用户选择的目录名称后（以下用 `<PROJECT_DIR>` 表示），直接进入 Step 0-C 进行基础环境补全

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
| `src/utils/` 目录 | 检查目录是否存在 | 工具函数统一存放位置 |
| `src/types/` 目录 | 检查目录是否存在 | TypeScript 类型定义统一存放位置 |
| `src/services/` 目录 | 检查目录是否存在 | 接口调用统一存放位置 |
| `src/demo/` 目录 | 检查目录是否存在 | 测试组件存放位置 |

**补全原则**：
- **只补充缺失项，不覆盖已有配置**：脚手架已生成的配置优先保留，只在其基础上追加缺失内容
- **`package.json`**：追加所有组件用到的依赖（含内部包），不替换整个文件。所有依赖都保留声明，由用户手动安装
- **`ice.config.mts`**：在现有配置基础上追加 `@/` 路径别名、less 支持等，不覆盖原文件
  - ⚠️ **ESM 模式下 `__dirname` 问题**：`ice.config.mts` 是 ES Module 文件，不支持 CommonJS 的 `__dirname` 全局变量。若配置中使用了 `__dirname`（如 `path.resolve(__dirname, 'src')`），必须替换为 ESM 等效写法：
    ```ts
    import { fileURLToPath } from 'url';
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    ```
- **`src/app.ts`**：追加 `import 'antd/dist/antd.compact.css'` 和全局 less reset 引入
- **`src/typings.d.ts`**：若不存在则创建，声明 `.less`、`.css`、图片等资源模块类型
- **目录创建**：若不存在则创建以下目录
  - `mkdir -p <PROJECT_DIR>/src/mock`
  - `mkdir -p <PROJECT_DIR>/src/components`
  - `mkdir -p <PROJECT_DIR>/src/utils`
  - `mkdir -p <PROJECT_DIR>/src/types`
  - `mkdir -p <PROJECT_DIR>/src/services`
  - `mkdir -p <PROJECT_DIR>/src/demo`

源项目关键全局配置参考（用于补全内容）：
- **antd compact 模式**：`config.ts` 中 `antd: { compact: true }`，效果为 `@font-size-base: 12px`、`@height-base: 28px` 等
- **全局样式**：`src/global.less` 中 `@import '~antd/es/style/themes/default.less'`（迁移时去掉 `~`）、`body { -webkit-font-smoothing: antialiased }`、`ul,ol { list-style: none }` 等
- **viewport**：`initial-scale=1`，无 rem/vw 自适应，所有尺寸固定 px

完成后告知用户基础环境已就绪，然后进入 Step 1。

### Step 1：确认目标迁移组件

1. **询问平台**：首先询问用户要迁移的目标平台，提供以下选项：
   - 淘宝
   - 京东
   - 拼多多

   用户选择平台后，后续步骤中只处理该平台的代码，删除其他平台的无关代码。

2. **询问组件信息**：要求用户提供设计稿截图与想要迁移的目标组件名称。

### Step 2：从组件列表中选择对应组件

1. **读取组件列表**：读取 `./docs/COMPONENTS.md` 文件，了解所有可迁移的组件
2. **根据用户提供的信息选择组件**：根据用户提供的设计稿和功能描述，选择对应的组件

**可用组件**：
- **搜索筛选组件（FilterCardHeader）**：搜索框 + 排序筛选栏 + 图文标签栏
- **商品瀑布流组件（CompareDoubleRichItem）**：商品卡片瀑布流 + 商品详情浮层
- **顶部导航栏组件（SearchSceneNav）**：query 展示 + Switch 控件
- **信息面板组件（AgentTabs）**：信息 Tab + 反馈按钮
- **做题区组件（QuestionArea）**：问卷表单 + 提交按钮

### Step 3：读取源组件代码

使用 Read 工具读取组件的所有源文件。

### Step 4：抽离并迁移组件代码

**核心原则**：
- ✅ 原样复制源代码，不重写、不重构
- ✅ 只删除无关平台代码，保留当前平台的部分
- ✅ 将内联样式抽离到 Less 文件中
- ✅ Service 文件必须 Mock 化并放在 `src/services/` 目录
- ✅ 工具函数、类型定义统一管理

**目录结构**：

```
<PROJECT_DIR>/
├── src/
│   ├── components/
│   │   └── [ComponentName]/          ← 根据功能语义化命名
│   │       ├── index.tsx              ← 组件主文件
│   │       ├── index.module.less      ← 组件样式文件
│   │       └── SubComponent/          ← 子组件（如有）
│   │           ├── index.tsx
│   │           └── index.module.less
│   ├── utils/
│   │   └── [utilName].ts              ← 工具函数统一放这里
│   ├── types/
│   │   └── [typeName].ts              ← 类型定义统一放这里
│   ├── services/
│   │   └── [serviceName].ts           ← 接口调用统一放这里（必须实现 IS_MOCK）
│   ├── mock/
│   │   └── [ComponentName].ts         ← Mock 数据
│   └── demo/
│       └── demo-[component-name].tsx  ← 测试组件
```

### Step 5：生成 Mock 数据

为组件的 Props 和 API 接口生成真实可用的 mock 数据。

### Step 6：生成测试组件

在 `<PROJECT_DIR>/src/demo/` 中生成测试组件，用于预览组件效果。

**测试组件要求**：
- ✅ 只引入迁移后的组件并传入 mock 数据
- ✅ 直接渲染组件，不包裹额外的样式容器
- ❌ 禁止添加带样式的 div 容器（如 `display: flex`、`backgroundColor`、`boxShadow` 等）
- ❌ 禁止添加占位内容和文字说明（如"👆 上方是筛选区组件"、"商品列表区域"等）

**正确示例**：
```tsx
import React from 'react';
import { ComponentName } from '@/components/ComponentName';
import { mockComponentNameProps } from '@/mock/ComponentName';

const DemoComponentName: React.FC = () => {
  return <ComponentName {...mockComponentNameProps} />;
};

export default DemoComponentName;
```

### Step 7：输出迁移文档

输出完整的迁移总结、目录结构、依赖列表和快速开始指南。

---

## 核心约束

### 🚫 绝对禁止
- ❌ 禁止根据设计稿自行编写代码
- ❌ 禁止添加源项目不存在的功能
- ❌ 禁止保留无关平台代码
- ❌ 禁止 Service 文件放在组件目录下
- ❌ 禁止保留 HTML 元素的内联 style

### ✅ 必须执行
- ✅ 从组件列表中选择组件
- ✅ 原样复制源代码
- ✅ 删除无关平台代码
- ✅ 实现 Service Mock 化
- ✅ 抽离内联样式到 Less
