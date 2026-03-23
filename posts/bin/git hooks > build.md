---
title: git hooks > build
pinned: false
tags:
  - git
draft: false
category: post
type: post
date:
---
I often experiment with static site generators for my website. Lately, I've been really enjoying Lume (which uses Deno). Everything was running smoothly on Vercel until recently, when my builds suddenly started failing.

I wasted a lot of time trying to fix it—retrying builds, tweaking build commands, you name it. But there was a silver lining! As a Git beginner, I stumbled upon Git hooks. I ended up creating a pre-commit hook that generates all my HTML files _before_ I even commit them. Now I can completely skip the build step on Vercel! (ヽ(。_°)ノ)

If you're thinking of doing something similar, here's how. Create a file in your repo at `.git/hooks/pre-commit` and add the following content:

```bash
#!/bin/sh
set -e
/Users/ur_user/.deno/bin/deno task build
git add _site/*
exit 0
```

Save the file and run `chmod +x .git/hooks/pre-commit` to make it executable. Note that I had to use the full path to Deno for Obsidian Git to work (I'm not going to spend any more time debugging that, either (╯°□°)╯︵ ┻━┻)).
