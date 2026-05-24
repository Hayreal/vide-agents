# AGENTS.md

## Project Overview

[Describe the project here]

## Coding Rules

- Prefer simple solutions over unnecessary abstraction
- Follow the existing code style
- Do not add features that were not requested
- Never commit dependency directories or generated build artifacts such as `node_modules/`, `.next/`, `dist/`, `build/`, or coverage outputs

## OpenCode Workflow

- This repository uses GitHub Actions + OpenCode + DeepSeek for automated coding work
- Use `/opencode` or `/oc` in an issue body or comment to trigger OpenCode
- Use `[frontend]`, `[backend]`, or `[test]` title prefixes or matching labels to route work to the correct agent
- Agents must obey the `Allowed Scope` section in the issue and avoid unrelated changes
- Test issues may declare upstream dependencies in a `Depends On` section using issue references such as `#12` and `#13`
- Test work should start only after the listed dependency issues are completed and closed
