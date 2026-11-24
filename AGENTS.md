# Project agent instructions

## Supabase MCP workflow

- Keep the Supabase MCP project-scoped to `zcovzkbocbtbhjdkssnf`.
- For a requested remote Supabase change, handle access-mode switching without asking the user to edit MCP settings:
  1. Temporarily remove `read_only=true` from the Supabase MCP URL.
  2. Reconnect if required, then apply the requested migration or change.
  3. Verify the resulting database or Storage state.
  4. Restore `read_only=true` before finishing the task.
- Never report the task complete until the read-only setting has been restored or clearly report why restoration could not be completed.
- Keep schema changes in versioned files under `supabase/migrations/` before applying them remotely.
