# Host patch: profile preset bundles

This patch is the DSH Host prerequisite for Plugin Scope's experimental Profile Preset Engine.

## Apply

Against DSH source tag `dsh-v0.2.2-rc.5`:

```bash
cd deepseek-harness
git apply /path/to/plugin-scope/docs/host-patch/app-boot-preset-bundles.patch
pnpm install
pnpm build
```

The patch changes `packages/boot/app-boot/src/profile.ts`:

- adds `presetLayers` to `Profile`;
- reads `dsh.profile.presetBundles`;
- moves matching bundle layers out of root composition.

## Profile configuration

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

Restart the profile after editing.

## Verify

```bash
curl -s "$API/state?session=SESSION" | jq '.diagnostics.presetIsolation'
curl -s "$API/tools?session=SESSION" | jq '[.tools[].name | select(startswith("diagram_"))]'
```

Expected:

- root row `dsh-ai-diagrams` has `enabled=false`;
- a new blank conversation has preset `scope:profile` and diagram tools.

## Scope

Prototype for `dsh-v0.2.2-rc.5`. It is not a DSH upstream release; apply only
to a source build you control.
