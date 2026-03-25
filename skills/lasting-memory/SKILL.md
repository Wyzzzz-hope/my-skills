---
name: lasting-memory
description: 管理用户记忆的存储和读取。当用户说"存储记忆"、"记录一下"、"记住这个"、"保存偏好"、"记下来"等需要存储信息时使用；当用户说"读取记忆"、"查看记忆"、"之前的偏好是什么"等需要读取历史记忆时使用。支持按类别存储，包括代码审查、代码风格、代码习惯、项目配置等。存储路径由 --storage-path 参数指定，根据工具类型（Qoder、Claude Code 等）自动设置。
version: 2.0
---

# 记忆管理器

管理用户记忆的存储、读取、更新和删除。存储路径由 `--storage-path` 参数指定，根据工具类型自动设置（Qoder 默认为项目目录下的 `.qoder/memories`）。记忆按类别存储在不同 JSON 文件中，每个类别对应一个文件。

## 记忆结构

```typescript
interface Memory {
  id: string;           // 唯一标识符 (UUID)
  category: string;     // 记忆类别
  title: string;        // 记忆标题
  content: string;      // 记忆内容
  keywords: string[];   // 关键词标签
  createdAt: string;    // 创建时间 (ISO 8601)
  updatedAt: string;    // 更新时间 (ISO 8601)
}
```

## 使用场景

- **代码审查 (code-review)**：存储用户的审查偏好、拒绝的建议及原因
- **代码简化 (code-simplify)**：记录用户对代码简化风格的偏好（如是否偏好箭头函数、解构赋值等）
- **组件复用 (component-reuse)**：保存用户对组件拆分粒度的偏好、复用策略
- **代码规范 (lint)**：记录用户对 lint 规则的态度（哪些规则可以忽略、哪些必须修复）
- **代码风格 (code-habits)**：存储用户的编码习惯和风格偏好（命名风格、文件组织、注释习惯等）
- **项目配置 (project-config)**：保存项目特定的约定和规则
- **用户偏好 (user-preference)**：记录通用的开发习惯和偏好
- **学到的知识 (learned-skill)**：从用户处学到的技能和最佳实践

## 存储结构

记忆按类别分散存储在 `--storage-path` 指定的目录下：

```
<storage-path>/
├── code-review.json      # 代码审查相关记忆
├── code-simplify.json    # 代码简化相关记忆
├── component-reuse.json  # 组件复用相关记忆
├── lint.json             # 代码规范相关记忆
├── code-style.json       # 代码风格相关记忆
├── project-config.json   # 项目配置相关记忆
├── user-preference.json  # 用户通用偏好
└── learned-skill.json    # 学到的知识
```

**默认存储路径**：
- Qoder: 项目目录下的 `.qoder/memories`
- Claude Code: `~/.claude/memories`

## 命令接口

**重要**：所有命令都需要 `--storage-path` 参数，由调用方根据工具类型设置存储路径：
- Qoder: 项目目录下的 `.qoder/memories`
- Claude Code: `~/.claude/memories`
- 其他工具根据实际情况设置

### 创建记忆

<command>node scripts/create.cjs --storage-path <存储路径> --category <类别> --title <标题> --content <内容> --keywords <关键词1,关键词2></command>

**示例（Qoder）：**
<command>node scripts/create.cjs --storage-path .qoder/memories --category code-review --title "用户偏好：不使用 console.log" --content "用户在代码审查中表示不喜欢使用 console.log" --keywords "code-review,偏好"</command>

### 读取记忆

<command>node scripts/read.cjs --storage-path <存储路径> [--id <ID>] [--category <类别>] [--keywords <关键词>]</command>

**按类别读取（推荐）：**
<command>node scripts/read.cjs --storage-path .qoder/memories --category code-review</command>

**跨类别搜索（较慢）：**
<command>node scripts/read.cjs --storage-path .qoder/memories --keywords "前端,性能"</command>

### 更新记忆

<command>node scripts/update.cjs --storage-path <存储路径> --category <类别> --id <ID> [--title <新标题>] [--content <新内容>] [--keywords <新关键词>]</command>

**示例：**
<command>node scripts/update.cjs --storage-path .qoder/memories --category code-review --id abc-123 --content "更新后的内容"</command>

### 删除记忆

<command>node scripts/delete.cjs --storage-path <存储路径> --category <类别> --id <ID></command>

### 列出所有记忆

<command>node scripts/list.cjs --storage-path <存储路径> [--category <类别>]</command>

**列出特定类别：**
<command>node scripts/list.cjs --storage-path .qoder/memories --category code-review</command>

**列出所有类别统计：**
<command>node scripts/list.cjs --storage-path .qoder/memories</command>

## 类别规范

建议使用的类别：

| 类别 | 用途 | 示例 |
|------|------|------|
| `code-review` | 代码审查相关的偏好和反馈 | "用户拒绝：不使用 useMemo 优化" |
| `code-simplify` | 代码简化风格的偏好 | "用户偏好：优先使用箭头函数" |
| `component-reuse` | 组件复用策略和粒度偏好 | "用户偏好：小组件优先，不强制复用" |
| `lint` | 代码规范规则的态度 | "用户忽略：允许 console.log 在开发环境" |
| `code-style` | 代码习惯和风格偏好 | "用户习惯：变量命名使用 camelCase，常量使用 UPPER_SNAKE_CASE" |
| `project-config` | 项目特定的配置和约定 | "本项目使用单引号而非双引号" |
| `user-preference` | 用户的通用偏好设置 | "用户偏好：使用 TypeScript 严格模式" |
| `learned-skill` | 从用户处学到的技能和知识 | "用户教授：使用 custom hook 封装逻辑" |

## 工作流程

### 存储用户反馈的标准流程

1. **识别需要记忆的信息**（如用户拒绝了某个建议）
2. **确定类别**（根据建议类型选择：code-review / code-simplify / component-reuse / lint 等）
3. **确定存储路径**（根据当前工具类型设置）
4. **执行创建命令**：
   <command>node scripts/create.cjs --storage-path <存储路径> --category code-review --title <标题> --content <内容> --keywords <关键词></command>
5. **确认存储成功**（检查返回的 JSON 中 success 为 true）

### 读取历史记忆的标准流程

1. **确定存储路径**（根据当前工具类型设置）
2. **确定相关类别**（如进行代码审查时，读取 code-review、code-simplify、lint 等类别）
3. **逐个类别读取**：
   <command>node scripts/read.cjs --storage-path <存储路径> --category code-review</command>
   <command>node scripts/read.cjs --storage-path <存储路径> --category code-simplify</command>
4. **将记忆内容融入当前任务上下文**

### 最佳实践

- **存储路径**：根据工具类型设置，Qoder 使用项目目录下的 `.qoder/memories`
- **写入时**：始终指定明确的类别，便于后续分类读取
- **读取时**：优先按类别读取，比跨类别搜索更快
- **更新时**：必须指定类别，以便定位正确的文件
