---
title: 
pinned: false
tags: 
draft: true
category: post
type: post
date:
---

All positive number under this calculation wiill go back to 4, 2, 1.

> Given any positive number
> 	if even:  n/ 2 
> 	   odd:  (n * 3) + 1
>    repeat until result just 1.
## Side

Cannot we use the limit to find out if all numebr really going back to one?

## First attempt 

```rust
fn collatz_do(num: i32) -> i32 {
    if num == 1 {
        return 1;
    }
    if num % 2 == 0 {
        return num / 2;
    }
    return (num * 3) + 1;
}

fn collatz_length(num: i32) {
    let mut curr = num;
    let mut seq = 1;
    while curr != 1 {
        curr = collatz_do(curr);
        seq += 1;
        println!("Curr: {curr}, Seq: {seq}")
    }
    println!("Ended!")
}

fn main() {
    let x = collatz_length(11);
    dbg!(x);
}
```


## Second attempt 

```rust
fn collatz(num: i32, seq: i8) -> i8 {
    if num == 1 {
        return seq;
    }
    if num % 2 == 0 {
        return collatz(num / 2, seq + 1);
    }
    return collatz((num * 3) + 1, seq + 1);
}

fn main() {
    let x = collatz(11, 1);
    dbg!(x);
}
```

## Third attempt
```rust
fn collatz_length(mut num: i32) -> i8 {
    let mut seq: i8 = 1;
    while num > 1 {
        if num % 2 == 0 {
            num /= 2;
        } else {
            num = (num * 3) + 1;
        }
        seq += 1;
    }
    return seq;
}

fn main() {
    let x = collatz_length(2 ^ 117);
    dbg!(x);
}
```

## Cleaner
```rust
fn collatz_length(mut num: i32) -> u8 {
    let mut seq: u8 = 1;
    while num > 1 {
        num = if num % 2 == 0 { num / 2 } else { (num * 3) + 1 };
        seq += 1;
    }
    return seq;
}

fn main() {
    let x = collatz_length(11);
    dbg!(x);
}
```