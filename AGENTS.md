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
- Every implementation issue may declare upstream dependencies in a `Depends On` section using issue references such as `#12` and `#13`
- Every implementation issue may also declare `Dependency Mode` as `closed`, `pr-ready`, or `merged`
- Requirement analysis and issue decomposition should decide both the dependencies and the dependency mode before agents start working
- Use `closed` when downstream work can begin once the upstream issue is finished
- Use `pr-ready` when downstream work should start after upstream code has its own branch or PR but before merge
- Use `merged` only when downstream work must wait for upstream code to land on the main branch
- Test issues must define a narrow verification target that matches only the implemented scope of the linked dependency issues
- Test agents must not validate future features or behavior outside the current issue boundary
- Test issues may declare `Auto Trigger On Ready` as `yes` or `no`
- Use automatic triggering only when the test scope is already clearly aligned to the implemented dependency issues
