# migrate-component-by-design

基于设计稿迁移前端组件的 SKILL。

---

## 使用指南

### 1. 目录结构准备

请按以下格式组织你的开发目录：

```
root-directory/
├── audience-insights-frontend/    # 源项目（组件从此迁移）
└── <你的微模块项目>/              # 目标项目（组件迁移至此）
```

### 2. 安装 SKILL

在 <root-directory> 下安装 SKILL：

```sh
npx skills add Wyzzzz-hope/my-skills --skill migrate-component-by-design -a claude-code -y
```

### 3. 启动流程

在终端中启动 Claude Code，然后输入：

```
我要迁移组件
```

### 4. 进入流程

进入 SKILL 流程后，会依次进行：

1. **信息确认** - 确认目标项目
2. **设计稿提供** - 提供设计稿和简要描述
3. **自动迁移** - SKILL 自动完成组件迁移

---

## 注意事项

- 确保两个项目都已在本地初始化
- 迁移完成后请检查组件是否符合预期
- 实际代码和设计稿有出入，以代码为准