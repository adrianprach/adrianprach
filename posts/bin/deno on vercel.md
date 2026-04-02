---
title: deploying deno on vercel
pinned: true
tags:
  - vercel
  - deno
draft: false
category: post
type: post
date: 2026-03-26
---

Vercel’s build image is aimed at Node workflows, so Deno is not on `PATH` by default. Install it once at the start of the build, then run whatever you have in `deno.json` (for example `deno task build` for Lume or other static pipelines).

## `build.sh` at the repo root

```sh
#!/bin/sh
set -eu

export DENO_INSTALL="${DENO_INSTALL:-$HOME/.deno}"
curl -fsSL https://deno.land/install.sh | sh
"$DENO_INSTALL/bin/deno" task build
```

On Vercel, `HOME` is usually `/vercel`, so this ends up as `/vercel/.deno` same idea as hard-coding that path, but it still works if the environment changes.

Make it executable if you want to call it as `./build.sh`:

```sh
chmod +x build.sh
```

## Vercel project settings

In **Project → Settings → Build and Deployment**:

1. **Build Command**: `sh build.sh` (or `./build.sh` if executable).
2. **Output Directory**: set to whatever your build actually writes (for Lume, often `_site`; for something else, check your config). This only matters for static output; serverless or SSR setups follow their own rules.

![](assets/Pasted%20image%2020260326235355.png)

If builds are flaky on network, pin a Deno version in the install step ([Deno manual: installing specific versions](https://docs.deno.com/runtime/getting_started/installation/)) instead of relying on the default latest from `install.sh`.
