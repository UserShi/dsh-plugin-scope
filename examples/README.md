# Examples

These examples use the local API at `http://127.0.0.1:58588/api/dsh-plugin-scope`.
Replace `SESSION` with a live session id from `GET /state`.

## 1. On-demand plugin, enabled manually for one conversation

```bash
# Plugin is on-demand globally
curl -s -X POST "$API/plugin" -H 'content-type: application/json' \
  -d '{"name":"dsh-ai-diagrams","scope":"on-demand","profiles":[]}'

# Enable only in this conversation
curl -s -X POST "$API/session/plugin" -H 'content-type: application/json' \
  -d '{"sessionId":"SESSION","name":"dsh-ai-diagrams","enabled":true}'
```

## 2. Workspace scope

```bash
curl -s -X POST "$API/workspace" -H 'content-type: application/json' \
  -d '{"cwd":"/path/to/project","profileId":"all","mode":"on-demand"}'
```

`mode` accepts `global`, `on-demand`, `off`. Use `/workspace/delete` to clear it.

## 3. Tag group + auto-match

```bash
curl -s -X POST "$API/tag" -H 'content-type: application/json' \
  -d '{"action":"create","name":"diagram"}'
curl -s -X POST "$API/tags" -H 'content-type: application/json' \
  -d '{"name":"dsh-ai-diagrams","tags":["diagram"]}'
curl -s -X POST "$API/tag-rule" -H 'content-type: application/json' \
  -d '{"tag":"diagram","keywords":["画图","diagram","流程图"],"enabled":true}'
curl -s -X POST "$API/settings" -H 'content-type: application/json' \
  -d '{"autoMatchTags":true}'
```

The next user message containing a keyword adds the plugin to that session's overrides.

## 4. Inspect per-turn usage

```bash
curl -s "$API/stats?session=SESSION&refresh=1" | jq '.session.turnDetails[-1]'
```

Each turn includes `calls`, `tokens`, `usage.total`, `plugins[].calls`,
`plugins[].tokens` and `plugins[].tools` for mapped tool detail.

## 5. Profile preset isolation (experimental)

Requires the Host patch in [docs/host-patch/app-boot-preset-bundles.patch](../docs/host-patch/app-boot-preset-bundles.patch).

```json
{
  "dsh": {
    "profile": {
      "bundles": ["@deepseek-ai/dsh-base", "@deepseek-ai/dsh-web-app", "dsh-plugin-scope", "dsh-ai-diagrams"],
      "presetBundles": ["dsh-ai-diagrams"]
    }
  }
}
```

Restart the profile. Check:

```bash
curl -s "$API/state?session=SESSION" | jq '.diagnostics.presetIsolation'
curl -s "$API/tools?session=SESSION" | jq '[.tools[].name | select(startswith("diagram_"))]'
```

Expected: root `dsh-ai-diagrams` row is `enabled=false`; a new blank conversation has the
preset and diagram tools.

## 6. Read mapping diagnostics

```bash
curl -s "$API/state?session=SESSION" | jq '.plugins[] | {name, mappingDiagnostics}'
```

`staleTools` / `staleSkills` indicate mappings that no longer exist;
`duplicateTools` / `duplicateSkills` indicate conflicting ownership.
