# Branching Strategy

This repository follows a lightweight trunk-based workflow suited to a small test-automation project.

## Branches

- **`main`** — always green. Only merged-in, CI-passing work lands here. The GitHub Actions workflow runs on every push and pull request targeting `main`, and the Allure report is deployed to GitHub Pages only from `main`.
- **`feature/<short-description>`** — one branch per piece of work (a new test, a selector fix, a CI change). Branched off `main`, merged back via pull request.

## Workflow

1. Branch off `main`:
   ```bash
   git checkout main
   git pull
   git checkout -b feature/short-description
   ```
2. Commit focused, descriptive changes on the branch.
3. Push the branch and open a pull request into `main`.
4. CI runs automatically on the PR (`pull_request` trigger in `.github/workflows/e2e-tests.yml`) — the suite must pass before merging.
5. Merge via the PR once CI is green. Delete the branch after merge.

## Example from this project

- `main` — initial suite (POM structure, Allure reporting, CI workflow, assumptions documentation).
- `feature/ci-pages-deploy` — this branch: documents the branching strategy and is merged back via PR as a demonstration of the workflow above.

No commits are made directly to `main` outside of the initial scaffold; all subsequent changes go through a feature branch and PR.
