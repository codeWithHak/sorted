---
id: "0007"
title: Enhance Configuring Better Auth Skill
stage: misc
date: 2026-02-06
surface: agent
model: claude-opus-4-6
feature: 005-auth
branch: 004-database-setup
user: hak
command: /configuring-better-auth (skill enhancement)
labels: ["better-auth", "skill", "jwt", "authentication"]
links:
  spec: specs/005-auth/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - /home/hak/.claude/skills/configuring-better-auth/SKILL.md
  - /home/hak/.claude/skills/configuring-better-auth/references/email-password-jwt-setup.md
  - /home/hak/.claude/skills/configuring-better-auth/scripts/verify.py
tests:
  - python3 scripts/verify.py (PASS)
---

## Prompt

Done now everything you learned in this session and everything you did, researched figuredout after fixing bugs, everything, every little details you know add it in the /configuring-better-auth skill, i need this skill to be very solid so next time i just have to use this skill and my agent knows how to configure better auth in a perfect way what to do what not do and for creating or modifying skills have a look at /skill-creator-enhanced and use it to modify /configuring-better-auth skill, do not remove the old skill just add relevant new info as i said, make it a solid and overpowered skill.

## Response snapshot

Enhanced the configuring-better-auth skill from 286 lines (OAuth/OIDC only) to 426 lines covering both email/password + JWT and OAuth/OIDC SSO patterns. Created comprehensive reference file `references/email-password-jwt-setup.md` with 13 sections covering complete implementation (dependencies, env vars, migration SQL, server config, client config, route handler, API proxy, middleware, API client, backend JWT verification with FastAPI, auth pages, testing checklist, security notes). Added 9 battle-tested pitfalls with exact error messages and fixes: snake_case field mappings, UUID generateId function, Next.js API proxy conflict, PyJWT audience verification, user table name mismatch, BETTER_AUTH_URL pointing to frontend, database URL format differences, .gitignore blocking .env.example, pydantic extra fields. Updated verify.py to check for all 3 reference files. Verification passes.

## Outcome

- ✅ Impact: Skill now covers both major Better Auth patterns with battle-tested pitfalls preventing all errors encountered during 005-auth implementation
- 🧪 Tests: verify.py passes (checks all 3 reference files exist)
- 📁 Files: 3 files modified/created (SKILL.md updated, email-password-jwt-setup.md new, verify.py updated)
- 🔁 Next prompts: /sp.git.commit_pr to commit auth implementation
- 🧠 Reflection: Real implementation experience produces far more valuable skill content than documentation alone. The 9 pitfalls documented would save hours on future Better Auth setups.

## Evaluation notes (flywheel)

- Failure modes observed: None — skill enhancement completed successfully
- Graders run and results (PASS/FAIL): verify.py PASS, SKILL.md under 500 lines PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Add social login / email verification patterns when those features are implemented
