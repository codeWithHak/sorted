# Data Model: Project Restructure for Phase 2

**Feature**: 003-project-restructure
**Date**: 2026-01-21

## Overview

This feature is a structural reorganization task. It does not introduce, modify, or remove any data models, entities, or database schemas.

## Entities

**None** - This feature operates on the file system and git repository structure only.

## State Transitions

**None** - No application state is affected.

## Data Flows

**None** - No data processing or transformation occurs.

## Notes

The following artifacts exist but are **not modified** by this feature:
- `apps/web/` - Next.js frontend (has its own data handling)
- `services/api/` - FastAPI backend (has its own models in `src/`)

The CLI application's data models (in `src/models/`) are removed from this branch but preserved in the `001-console-app` branch for reference.
