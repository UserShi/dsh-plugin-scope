# Plugin Scope for DeepSeek Harness

> **Status: design phase (v0.1 draft)** — no installable release yet.  
> Design: [docs/DESIGN.md](docs/DESIGN.md) · Roadmap: [docs/ROADMAP.md](docs/ROADMAP.md) · Publishing: [docs/GITHUB.md](docs/GITHUB.md)

## The problem

DSH plugins are global by default: every installed plugin's tool schemas ride along on every request, even in conversations that never use them. **Plugin Scope** adds a budget layer:

- **Global** — always available, e.g. the marketplace or the skills manager.
- **On demand** — visible only in conversations/profiles that select it; no tool-schema tokens elsewhere.
- **Off** — disabled in the profile, never loaded.
- **Session** — toggle plugins for the current conversation.

It also provides:

- Scope profiles (Coding / Writing / Minimal / custom);
- Per-plugin tool counts and token estimates;
- Integration with **dsh-market / the native Plugins page**: scope badges and direct global/on-demand/off controls;
- A Scope chip in the session header.

![Architecture](docs/assets/architecture.png)

## Scope model

| State | Loaded when | Visible in | Token savings |
|---|---|---|---|
| Global | profile boot | every conversation | none |
| On demand | profile boot (v0.1 gate) | selected conversations | tool declarations |
| Off | never | none | all |
| Preset (v0.2) | selected conversations only | selected conversations | all |

> v0.1 On-demand only guarantees tool-schema savings; plugin code, routes and global skills may still be loaded.  
> True zero-load isolation is the v0.2 Preset mode, limited to preset-safe plugins.

## How it works

1. Read the profile's bundles/rows through `dsh-plugin-manager` (never edit YAML by hand).
2. Map tools/skills/sections to plugins via manifest, manual mapping, or heuristics.
3. On `agent/created`, apply `tools.restrict` / skill shadows / prompt-section shadows to `agent.ctx`.
4. Tool-set changes are logged by DSH as `tool-addition/removal`; sessions remain replayable.
5. Global toggles call `pluginManager.setBundleEnabled/setPluginEnabled`; HMR applies immediately, otherwise restart is reported.

## Planned install

```bash
# local development
dsh plugin --profile desktop add link:/absolute/path/to/dsh-plugin-scope

# GitHub release (after publishing)
dsh plugin --profile desktop add https://github.com/shihaozhan/dsh-plugin-scope/releases/download/v0.1.0/dsh-plugin-scope-0.1.0.tgz
```

Then open **Plugins → Plugin Scope** or the **Plugin Scope** sidebar page.

## Roadmap

- **M0** design (current)
- **M1** installable skeleton: inventory + read-only page
- **M2** Gate Engine + session chip + token estimates
- **M3** global switches + native Plugins / dsh-market integration
- **M4** skill/prompt gating + Preset isolation (v0.2)
- **M5** release

## Limitations

- Not a security sandbox: on-demand plugins still run in the Host process.
- Tool ownership cannot be discovered with 100% accuracy; unmapped plugins stay Global and are never silently hidden.
- v0.1 does not promise hiding every third-party prompt/skill contribution.
- No direct edits to `cordis.patch.yml`; all global changes go through `pluginManager`.
- Session scope selection lives in the plugin's own JSON; model-visible changes are logged by DSH.

## Development (planned)

This repository currently contains the design documents only; the implementation is not committed yet. The workflow below is the M1 target:

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

## License

MIT
