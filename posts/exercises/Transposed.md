---
title: 
pinned: false
tags: 
draft: true
category: post
type: post
date:
---
##  attempt 1

```rust
fn transpose(matrice: [[u32; 3]; 3]) -> [[u32; 3]; 3] {
    let mut transposed: [[u32; 3]; 3] = [[0; 3]; 3];
    for i in 0..matrice.len() {
        let mut n = (matrice.len() - 1);
        while n.ge(&0) {
            transposed[i][n] = matrice[n][i];
            if n.eq(&0) {
                break;
            }
            n -= 1;
        }
    }
    transposed
}
```

## attempt 2
```rust
fn transpose(matrice: [[u32; 3]; 3]) -> [[u32; 3]; 3] {
    let mut transposed: [[u32; 3]; 3] = [[0; 3]; 3];
    for i in 0..matrice.len() {
        for n in (0..matrice.len()).rev() {
            transposed[n][i] = matrice[i][n];
        }
    }

    transposed
}
```

## solution
```rust
fn transpose(matrix: [[i32; 3]; 3]) -> [[i32; 3]; 3] {
    let mut result = [[0; 3]; 3];
    for i in 0..3 {
        for j in 0..3 {
            result[j][i] = matrix[i][j];
        }
    }
    result
}

fn main() {
    let matrix = [
        [101, 102, 103], // <-- the comment makes rustfmt add a newline
        [201, 202, 203],
        [301, 302, 303],
    ];

    dbg!(matrix);
    let transposed = transpose(matrix);
    dbg!(transposed);
}
```