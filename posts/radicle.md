---
title: radicle commands
pinned: false
tags:
draft: true
category: post
type: post
date:
---
## commands

**initialize identity**
```bash
rad auth
```
**start peer node**
```bash
rad node start
```
**initialize rad**
```bash
rad init
```
**rad identity**
```bash
rad .
```
**rad inspect**
```bash
rad inspect --payload
```
**check sync node**
```bash
rad sync status
```
**fetch repo data from seeds**
```
rad sync -f
```
**check rad remote**
```bash
git remote show rad
```
**clone repo**
```bash
rad clone rid:identity
```
**push change to repo**
```bash
git push rad [git-branch-name]
```
**creating issue**
```bash
rad issue open
```
**list issue**
```bash
rad issue
```
**show issue**
```
rad issue show [cob/generated id]
```
**comment on issue**
```bash
rad issue comment [cob/half of cob] --message "message here"
```
**list inbox**
```bash
rad inbox
```
**show inbox detail**
```bash
rad inbox show [num]
```
**assign issue**
```
rad issue assign [cob] --add did:key:userid
```
**working on issue**
```bash
git checkout -b [branch]
git add .
git commit -m "change"
git push rad HEAD:refs/patches

# if need to modify should use amend and force
```
**show patch**
```bash
rad patch show [patchid]
```
**checkout patch**
```bash
rad patch checkout [patchid]
```
**diff with patch**
```bash
rad patch diff e5f0a5a
```
**resolving merge**
```bash
git rebase main
```
**merge patch**
```
git checkout main
git merge patch/[patchid]
git push rad [branch]
```
**sync**
```bash
rad sync --fetch
git pull
```
**make private**
```bash
rad id update --title "Make private" --visibility private
```
