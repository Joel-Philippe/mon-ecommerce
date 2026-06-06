# Build Failure Playbook

## Goal

This playbook defines the mandatory process Hermes must follow when a build fails.

The goal is to fix build failures safely, one error at a time, without introducing unrelated changes.

---

## Core Rule

Never fix multiple errors at once.

Always:
- identify the first real error
- identify the file and line involved
- inspect the file before editing
- apply one targeted fix
- validate the fix
- repeat only if the build reveals another error

---

## Standard Commands

Always work from the repository root.

Use:

```bash
git branch --show-current
git status --short
npm run build
git restore package-lock.json
git diff --check
git diff -- <file>
```

## Step 1 - Prepare

Ensure you are in the root of the repository and on the correct branch.

## Step 2 - Run Build

Execute the build command to see the errors.

## Step 3 - Identify First Real Error

Always target the first real error. Look for the earliest error message in the build output.

## Step 4 - Diagnose Before Editing

Examine the code based on the error message before making changes.

## Step 5 - Apply One Fix Only

Make only one correction per build cycle. This simplifies validation.

## Step 6 - Validate The Fix

After making your corrections, run the build again to ensure the fix works.

## Step 7 - Repeat Until Build Is Green

Continue this process until the build completes successfully.

## package-lock.json Rule

Do not modify package-lock.json unless explicitly directed. If it is altered due to a build, restore it with `git restore package-lock.json`.

## Reporting Format

When reporting to the team, provide:
- A summary of the first real error
- Affected file and line number

## Forbidden Actions

- Never commit/push/merge without human validation.
- Never modify the `main` or `fastfood` branches directly.

## Final Checklist Before Pull Request

Before creating a Pull Request:
- Ensure the build is green.
- Confirm all changes are validated by the team.

