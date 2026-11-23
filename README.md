# Plugin Scope for DeepSeek Harness

> **v0.3.4 · Gate engine + scopes/usage/tags/sidebar + call history + mapping diagnostics** — global / on-demand / off / workspace / per-conversation plugin scopes, with token and cost stats, tag-group auto-match, and integration with **dsh-market** and the native **Plugins** page.
> Details: [DETAIL.md](DETAIL.md) · Examples: [examples/README.md](examples/README.md) · Design: [docs/DESIGN.md](docs/DESIGN.md) · Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md) · Changelog: [CHANGELOG.md](CHANGELOG.md)

## The problem

DSH plugins are global by default: every installed plugin's tool schemas ride along on every request, even in conversations that never use them.
**Plugin Scope** adds a budget layer:

- **Global** — always available, e.g. the marketplace or the skills manager.
- **On demand** — hidden by default; enable it in a conversation, or let tag keywords auto-match it. No tool-schema tokens while disabled.
- **Off** — disabled, never loaded.
- **Workspace / session** — choose Global / On-demand / Off from a dropdown; the session setting wins.

It also provides:

- A **Plugin Scope** entry in the left sidebar that opens the dedicated management page directly;
- Per-plugin tool counts and token estimates;
- Integration with **dsh-market / the native Plugins page**: scope badges and direct global/on-demand/off controls;
- A mapping drawer: assign tools, skills and prompt sections to a plugin; unmapped plugins stay Global and are never silently hidden.
- Mapping diagnostics: stale tools/skills, duplicate ownership and protected sections; the skill list filters by provider/source.
- Chinese/English UI switch, Chinese by default; the choice is stored locally.
- A top-right conversation plugin picker: global plugins, enabled plugins, available on-demand plugins and off plugins, with fuzzy search over names and descriptions and one-click per-conversation toggles.
- Workspace scopes: each working directory selects Global / On-demand / Off and its own plugin list; conversations without their own override inherit the workspace, while an explicit conversation setting wins.
- Usage stats: the conversation plugin panel shows calls, estimated tool tokens and model tokens; the plugin list, workspaces and marketplace scope list show cumulative totals.
- Each completed turn renders a plugin usage card below the conversation; the plugin panel has Manage / Call history tabs with per-turn plugin and tool detail.
- Tag list: create, rename, delete and reorder tags; renames and deletes sync to every tagged plugin. With auto-match on, a message keyword enables matching on-demand plugins (global switch + per-tag switch).
- Cost estimates: convert tokens to money at a configurable ¥/1M-token price in the conversation panel, plugin list, workspaces and plugin detail.
- The conversation panel supports collapsible groups and moves plugin descriptions to hover tooltips (known plugins follow the Chinese/English switch).

![Architecture](docs/assets/architecture.png)

## Status

- **v0.3.4 (current)**: mapping diagnostics (stale/duplicate/protected sections), skill provider/source filter, DETAIL/FAQ/examples.
- **v0.3.3**: per-turn usage cards and call history.
- **v0.3.2**: per-turn usage cards and call history.
- **v0.3.1**: added the **Plugin Scope** entry to the left sidebar, opening the management page directly.
- **v0.3.0**: scope profiles removed; workspace/conversation/plugin dropdowns select Global/On-demand/Off; the tag list supports create/rename/delete/reorder and syncs tagged plugins; usage, cost, keyword auto-match, skill/prompt mapping remain.
- **v0.2.1**: previous release (simplified on-demand activation).
- **M4b / full Preset isolation**: not started yet.

## Install

### GitHub source (available now)

    dsh plugin --profile desktop add github:UserShi/dsh-plugin-scope

### Local directory (development)

    dsh plugin --profile desktop add link:/absolute/path/to/dsh-plugin-scope

Or choose this directory in **Plugins → Add plugin**.

### GitHub release (v0.3.4)

    dsh plugin --profile desktop add https://github.com/UserShi/dsh-plugin-scope/releases/download/v0.3.4/dsh-plugin-scope-0.3.4.tgz

### npm (v0.3.4)

    dsh plugin --profile desktop add dsh-plugin-scope

0.3.4 is published on npm.

npm page: https://www.npmjs.com/package/dsh-plugin-scope

## Usage

1. Open **Plugin Scope** from the left sidebar, or use **Settings → Plugin Scope** / **Plugins → Scopes**.
2. Choose **Global / On demand / Off** from each plugin's dropdown.
3. Choose **Global / On demand / Off** for the current working directory under **Workspaces**; on-demand plugins stay hidden by default.
4. Use the **Plugin Scope** chip or the top-right **Plugins** panel to switch the conversation scope and toggle on-demand plugins.
5. Click **Map contributions** on a plugin to assign its tools and skills, and optionally its prompt-section names. Unmapped plugins stay Global: no savings, but no broken conversations.
6. Create a tag, add keywords and enable auto-match under **Tags**; click **Edit tags** on a plugin to pick from the managed list. Renaming or deleting a tag syncs every tagged plugin.
7. The top-right plugin panel, the **plugin list** and **Workspaces** rows show calls/tokens/cost; each completed turn gets a usage card, and **Call history** shows per-turn detail.
8. Adjust **Token price (¥/1M)** under **Configuration**; costs are estimates, not provider billing.

## How it works

1. Read the profile's bundles/rows through **dsh-plugin-manager** (never edit YAML by hand).
2. Map tools/skills to plugins via the built-in map, a plugin's **dsh.scope** manifest, or manual mapping.
3. On **agent/created**, apply **tools.restrict** / skill shadows / prompt-section shadows to **agent.ctx**.
4. Tool-set changes are logged by DSH as **tool-addition/removal**; sessions remain replayable.
5. Global toggles call **pluginManager.setBundleEnabled/setPluginEnabled**; HMR applies immediately, otherwise a restart is reported.

## FAQ / troubleshooting

**Why is an on-demand plugin missing?**

Check the conversation/workspace mode (`on-demand` or `off`), explicit add/remove overrides, or enable it manually from the top-right **Plugins** panel.

**Why does tag auto-match not fire?**

It requires the global auto-match switch, the tag group's own switch, a keyword hit in the user message, and an on-demand plugin that is currently hidden.

**Why are the usage card or call history empty?**

Only **mapped plugin** calls in completed turns are counted. Core tools such as `run_code`/`bash` and unmapped tools are excluded. Add mappings first.

**Why does cost differ from provider billing?**

Costs are estimates: tool tokens are estimated from argument/result JSON length, and input/output/cache share the configured price. The default is ¥2/1M tokens.

**No Plugin Scope entry in the sidebar?**

Install 0.3.1+ and restart DSH so the client re-injects the `sidebar.panellist` and `main` registrations.

**What do the mapping warnings mean?**

`stale` means a mapped tool/skill no longer exists; `duplicate` means two plugins claim the same contribution; `protected` means a protected prompt section was mapped. Warnings never delete mappings automatically.

More: [DETAIL.md](DETAIL.md) · [Troubleshooting](DETAIL.md#8-排查)

## Limitations

- Not a security sandbox: on-demand plugins still run in the Host process; v0.1/v0.2-dev still focus on **tool-schema** token savings.
- Skill/prompt-section shadows apply only where a mapping exists; the skill list comes from the current session scope, and unmapped plugins stay Global.
- **Full Preset isolation** (M4b) is not implemented yet; on-demand plugins still load their code.
- Tool tokens are JSON-length estimates of arguments/results; model tokens are provider-reported (including cacheRead). Total/workspace scans cover up to the latest 200 sessions with a 20-second cache.
- Cost = tokens / 1,000,000 × unit price; default ¥2/1M with one blended rate for input/output/cache. It is an estimate, not an exact provider bill.
- Auto-match only enables **on-demand** plugins, and requires the global switch + group switch + a keyword hit; it never enables off/global plugins.
- dsh-market Discover cards have no public per-card slot; cumulative usage appears in the Scopes plugin list, Workspaces and plugin detail, not inside Discover cards.
- No direct edits to **cordis.patch.yml**; all global changes go through **pluginManager**.
- Session scope selections live in the plugin's own JSON; model-visible changes are logged by DSH.
- Management plugins (this plugin, dsh-market, core packages) can only stay Global.

## Development

    npm test
    npm run check
    npm run pack

The repository is plain ESM JavaScript with no build step; lib/index.js is the Host half and lib/client.js is the browser half.

## License

MIT
