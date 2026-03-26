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
Create a file `build.sh` in current project folder  
```sh
curl -fsSL https://deno.land/install.sh | sh && /vercel/.deno/bin/deno task build
```

Vercel's Project setting > Build and Deployment > Update `Output directory` (in case of static build): 
![](assets/Pasted%20image%2020260326235024.png)