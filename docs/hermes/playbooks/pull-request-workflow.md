# Pull Request Workflow

## Goal

Formalize the official procedure Hermes must follow to create a branch, commit, push, and prepare a Pull Request without directly touching main or fastfood.

---

## Core Rules

- Never work directly on main.
- Never work directly on fastfood.
- Always start from an updated main.
- Always create a dedicated branch.
- Always check `git status --short`.
- Always check `git diff --check`.
- Always run the build if code has changed.
- Never modify package-lock.json unless explicitly requested.
- Never push via SSH.
- Use HTTPS with GITHUB_TOKEN.
- Never create the PR automatically without human validation.
- Never merge without human validation.
- After merge, return to main and `pull origin main`.

---

## Step 1 - Start From Updated Main

Ensure you are on the main branch and it is up to date:

```bash
git -C /root/workspace/mon-ecommerce checkout main
git -C /root/workspace/mon-ecommerce pull origin main
```

## Step 2 - Create A Dedicated Branch

Create a new branch for your changes:

```bash
git -C /root/workspace/mon-ecommerce checkout -b <branch-name>
```

## Step 3 - Make Changes

Make all necessary changes in the code.

## Step 4 - Validate Changes

Before committing, validate your changes:

```bash
git -C /root/workspace/mon-ecommerce status --short
git -C /root/workspace/mon-ecommerce diff --check
npm --prefix /root/workspace/mon-ecommerce run build
```

## Step 5 - Commit

Once validated, add your changes and commit:

```bash
git -C /root/workspace/mon-ecommerce add <files>
git -C /root/workspace/mon-ecommerce commit -m "<message>"
```

## Step 6 - Push

Push your dedicated branch:

```bash
git -C /root/workspace/mon-ecommerce push https://x-access-token:${GITHUB_TOKEN}@github.com/Joel-Philippe/mon-ecommerce.git <branch-name>
```

## Step 7 - Create Pull Request

Create a Pull Request on GitHub.

## Step 8 - After Merge

After your Pull Request is merged, return to main and pull the latest changes:

```bash
git -C /root/workspace/mon-ecommerce checkout main
git -C /root/workspace/mon-ecommerce pull origin main
```

---

## Forbidden Actions
- Never commit, push, or merge without human validation.

## Reporting Format
- Provide a summary of changes made.
- Include any errors encountered during the process.
- Always provide the status and diff when submitting.

