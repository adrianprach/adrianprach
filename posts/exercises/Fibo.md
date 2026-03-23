---
title: 
pinned: false
tags: 
draft: true
category: post
type: post
date:
---
## Recursive

```rust
fn fibo(num: u32) -> u32 {
    if num < 2 {
        return num;
    }
    return fibo(num - 1) + fibo(num - 2);
}
```

## Using loop
