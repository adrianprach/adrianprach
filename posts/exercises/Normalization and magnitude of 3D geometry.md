---
title: 
pinned: false
tags: 
draft: true
category: post
type: post
date:
---

```rust
fn magnitude(v: [f32; 3]) -> f32 {
    let [x, y, z] = v;
    return (x.powi(2) + y.powi(2) + z.powi(2)).sqrt();
}

fn normalize(v: [f32; 3]) -> [f32; 3] {
    let mag = magnitude(v);
    return [v[0] / mag, v[1] / mag, v[2] / mag];
}

fn main() {
    let a = [3f32, 4f32, 12f32];
    dbg!(magnitude(a));
    dbg!(normalize(a));
}
```

## attempt 2

```rust
fn magnitude(v: &[f32; 3]) -> f32 {
    let [x, y, z] = v;
    return (x.powi(2) + y.powi(2) + z.powi(2)).sqrt();
}

fn normalize(v: &mut [f32; 3]) {
    let mag = magnitude(v);
    v[0] = v[0] / mag;
    v[1] = v[1] / mag;
    v[2] = v[2] / mag;
}

fn main() {
    let mut a = [3f32, 4f32, 12f32];
    dbg!(magnitude(&a), a);
    normalize(&mut a);
    dbg!(magnitude(&a), a);
}
```

### attempt 3

```rust
fn magnitude(v: &[f32; 3]) -> f32 {
    let [x, y, z] = v;
    return (x.powi(2) + y.powi(2) + z.powi(2)).sqrt();
}

fn normalize(v: &mut [f32; 3]) {
    let mag = magnitude(v);
    v[0] = v[0] / mag;
    v[1] = v[1] / mag;
    v[2] = v[2] / mag;
}

fn main() {
    let mut a = [1.0, 2.0, 9.0];
    dbg!(magnitude(&a), a);
    normalize(&mut a);
    dbg!(magnitude(&a), a);
}
```


### solution

```rust
/// Calculate the magnitude of the given vector.
fn magnitude(vector: &[f64; 3]) -> f64 {
    let mut mag_squared = 0.0;
    for coord in vector {
        mag_squared += coord * coord;
    }
    mag_squared.sqrt()
}

/// Change the magnitude of the vector to 1.0 without changing its direction.
fn normalize(vector: &mut [f64; 3]) {
    let mag = magnitude(vector);
    for item in vector {
        *item /= mag;
    }
}

fn main() {
    println!("Magnitude of a unit vector: {}", magnitude(&[0.0, 1.0, 0.0]));

    let mut v = [1.0, 2.0, 9.0];
    println!("Magnitude of {v:?}: {}", magnitude(&v));
    normalize(&mut v);
    println!("Magnitude of {v:?} after normalization: {}", magnitude(&v));
}
```