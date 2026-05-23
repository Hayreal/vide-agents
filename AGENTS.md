# AGENTS.md

## 项目概述

[在这里描述你的项目]

## 编码规范

- 优先简洁，避免不必要的抽象
- 遵循已有代码风格
- 不添加未要求的功能

## OpenCode 工作流

- 本项目通过 GitHub Actions + OpenCode + DeepSeek 实现自动化编码工作流
- 在 Issue 或评论中使用 `/opencode` 或 `/oc` 可触发 OpenCode
- 使用 `[frontend]`、`[backend]`、`[test]` 标题前缀或同名 label 路由到对应 agent
- Agent 必须遵守 Issue 中的 `Allowed Scope`，避免越权修改
