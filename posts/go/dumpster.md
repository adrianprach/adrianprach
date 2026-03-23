---
title: common go func
pinned: false
tags:
draft: true
category: post
type: post
date:
---
## str to int

```go
test, err := strconv.Atoi("12")
if err != nil {
	fmt.Println("Error converting string to integer:", err)
}
// test: 12
```