# MCreator — Agent and Codex Review Contract

## Actual project scope
Zero-build static site/media template system with JS CLI scaffolding, config-driven media components and optional deploy targets. Preserve copyable offline template behavior and path isolation.

## Review and implementation rules
- Inspect the changed code and README before proposing changes; do not invent missing product capabilities, hidden server services or additional abstractions.
- State Intent, owner of mutable state, invariants, actual commands/evidence, and complexity justification in PR. Classify unsupported claims as NOT VERIFIED.
- Prioritize behavior-breaking defects, security trust boundaries, state/data contract regressions and user impact. Cite exact file, affected line, concrete consequence and minimal reproduction; an empty review is a legitimate result.
- Prefer the repository's existing test/build commands and technical patterns, not generic framework rewrites; preserve backwards compatibility only where real consumers exist.
- Treat security guidance in [SECURITY.md](SECURITY.md) as project-specific review context. Separate AI second-agent review from owner approval.
- ChatGPT may implement proposed changes, Codex should review PRs without pushing fixes or merging, and the owner alone authorizes formal merges, production changes, secrets and external services.
