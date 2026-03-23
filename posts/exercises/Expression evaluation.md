---
title: 
pinned: false
tags: 
draft: true
category: post
type: post
date:
---
## attempt

```rust
#[derive(Debug)]
enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
}

#[derive(Debug)]
enum Expression {
    Op {
        op: Operation,
        left: Box<Expression>,
        right: Box<Expression>,
    },
    Value(i64),
}

fn eval(exp: &Expression) -> i64 {
    match exp {
        Expression::Op { op, left, right } => {
            return match op {
                Operation::Add => eval(left) + eval(right),
                Operation::Subtract => eval(left) - eval(right),
                Operation::Divide => eval(left) / eval(right),
                Operation::Multiply => eval(left) * eval(right),
            };
        }
        Expression::Value(val) => {
            return *val;
        }
    };
}

fn main() {
    let exp = Expression::Op {
        op: Operation::Add,
        left: Box::new(Expression::Op {
            op: Operation::Multiply,
            left: Box::new(Expression::Value(10)),
            right: Box::new(Expression::Value(2)),
        }),
        right: Box::new(Expression::Value(5)),
    };
    let result = eval(&exp);
    dbg!(exp);
    dbg!(result);
}
```


## solution
```rust
fn eval(e: Expression) -> i64 {
    match e {
        Expression::Op { op, left, right } => {
            let left = eval(*left);
            let right = eval(*right);
            match op {
                Operation::Add => left + right,
                Operation::Sub => left - right,
                Operation::Mul => left * right,
                Operation::Div => left / right,
            }
        }
        Expression::Value(v) => v,
    }
}
```


## preference
```rust

fn eval(exp: &Expression) -> i64 {
    match exp {
        Expression::Op { op, left, right } => {
            let (left, right) = (eval(left), eval(right));
            dbg!(left, right);
            match op {
                Operation::Add => left + right,
                Operation::Subtract => left - right,
                Operation::Divide => left / right,
                Operation::Multiply => left * right,
            }
        }
        Expression::Value(val) => *val,
    }
}
```