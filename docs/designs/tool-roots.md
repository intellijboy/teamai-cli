# Relocated tool roots (`toolRoots`)

> Status: Implemented

Claude Code reads everything from `CLAUDE_CONFIG_DIR`, Codex from `CODEX_HOME`,
and Cursor CLI its transcripts from `CURSOR_DATA_DIR` and its config from
`CURSOR_CONFIG_DIR`. A member who sets one of these is running the tool from a
directory teamai would otherwise never write to, so `teamai init` records the
value in `toolRoots` and every later run resolves the tool's paths through it.
`init` is the only command that reads the variable: hooks, cron jobs and other
terminals do not have it, and the sync target must not depend on who started
the process. `teamai doctor` reports a recorded value that no longer matches.

## The two spellings of a value

`toolPaths` values are HOME-relative segments (`.claude/skills`), and every
writer resolves them against the scope root. `toolRootPrefix` turns a recorded
root into the prefix those values carry:

- a root **inside** HOME becomes a HOME-relative segment (`~/.claude-work` →
  `.claude-work`), as it always has;
- a root **outside** HOME keeps its absolute form (`E:\repositories\.claude_home`).

The absolute form is not a preference. `path.relative` between two drives on
Windows yields an absolute path, so no segment can express such a root, and a
value joined onto HOME would land somewhere else entirely.

Everywhere a base and a `toolPaths` value meet, the value is resolved with
`resolveToolPath(baseDir, value)` — `path.resolve`, where an absolute value wins
over the base. For a relative value this is exactly what `path.join` did, so an
unrelocated tool and a root inside HOME behave as before. `resolveToolRootDir`,
`ResourceHandler.isToolInstalled` and the co-author, hook, MCP, skills, rules,
agents and commands writers all go through it.

The same representation already existed for source-install destinations outside
the scope root (`src/source.ts`), whose tool homes are listed in
`externalToolHomes`.

## Roots that are still refused

`toolRootRejection` keeps the shape rule for a root inside HOME (one segment
other than `.config`, or anything under `~/.config/<name>`), which is what lets
the "is this tool installed?" gate tell a tool's directory apart from an
unrelated one. Outside HOME that heuristic has nothing to decide, so only the
shapes that cannot be a tool's own directory are refused:

- the home directory itself;
- a filesystem root (`E:\`, `/`);
- a directory that contains the home directory.

## Cursor

`cursor` is deliberately not relocatable: `toolPaths.cursor` has to stay at
`~/.cursor` whatever the variables say, since Cursor reaches a user-scope rules
file only by walking up from the workspace root. Only the two roots that do move
are recorded, under `cursor-data` and `cursor-config`.
