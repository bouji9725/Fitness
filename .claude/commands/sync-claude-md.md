Analyze the current project state and update CLAUDE.md to reflect any changes since it was last written.

Steps:
1. Run `git status` and `git log --oneline -10` to understand what has changed recently
2. Read the current CLAUDE.md
3. Compare the live project structure against what is documented — check for:
   - New or removed files in `app/`, `components/`, `lib/`, `types/`
   - New or changed API routes
   - New or changed TypeScript types
   - New or removed lib functions or stores
   - Any architecture changes
4. Update only the sections that are outdated. Do not rewrite sections that are still accurate.
5. Always refresh the "Current branch status" section with live git state (branch name, modified files, last 5 commits)
6. If CLAUDE.md was changed, commit it: `git add CLAUDE.md && git commit -m "docs: sync CLAUDE.md with current project state"`

Be surgical — only change what has actually drifted from reality.
