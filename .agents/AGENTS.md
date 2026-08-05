# Project Rules

## Git Push Policy
- **Local-First Development**: Always implement, build, and verify changes locally in the workspace first.
- **Push Criteria**: Push changes to GitHub (`origin main`) when:
  1. A feature or bug fix is fully completed, verified, and approved by the user, OR
  2. The user explicitly requests to "push", "save to git", or wrap up a session.
- **Keep Unpushed During Prototyping**: While experimenting or iterating on design options, keep all changes unpushed in the local workspace so you can test freely without polluting the Git commit history.
- **Atomic Commit Messages**: Write clear, descriptive commit messages summarizing exact features added or bugs fixed.

## Autonomous Execution Policy
- **Pre-Approved Operations**: All code edits, file creations, automated test sweeps, and build commands within the workspace are pre-approved.
- **Direct Implementation**: Implement, verify, and test changes immediately without pausing to ask for permission before modifying files.
- **Fast Execution**: Proceed directly to execution and verification for all straightforward requests, visual tweaks, bug fixes, and feature implementations.
