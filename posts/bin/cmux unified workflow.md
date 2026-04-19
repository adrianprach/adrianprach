---
title: "cmux: browsing and notification workflow"
pinned: true
tags:
  - cli
  - cmux
draft: false
category: post
type: post
date: 2026-04-19
---
TIL:  using basic [cmux](https://cmux.com/) for terminal browsing, quick query, and notification.
- `cmo`: open file as cmux browser
- `cmf`: open current directory as fzf and open selected file in cmux browser (required fzf)
- `cmg`: quick search stuff with cmux browser, f.g `cmg "who is my laplace demon?`
- `cmn`: easily add notification using `|` after each command, f.g  `ping -c 5 google.com | tail -n 2 | cmn "pinging done!"`
## gist

```bash
cmo() {
  # Check if a file argument was provided
  if [ -z "$1" ]; then
    echo "Usage: cbo <filename>"
    return 1
  fi

  # Get the absolute path of the file
  local ABS_PATH=$(realpath "$1")

  # Use cmux to open the file with the proper prefix
  cmux browser open "file://$ABS_PATH"
}

# Fuzzy search current directory and open in cmux browser
cmf() {
  # 1. Find files in current dir, pipe to fzf
  # (Hidden files excluded by default, change -type f to include what you need)
  local FILE=$(find . -maxdepth 3 -type f | fzf --prompt="Open in cmux > ")

  # 2. If a file was selected (not empty)
  if [ -n "$FILE" ]; then
    # 3. Convert to absolute path so cmux doesn't get confused
    local ABS_PATH=$(realpath "$FILE")
    
    # 4. Open in cmux
    cmux browser open "file://$ABS_PATH"
  fi
}

cmg() {
  local QUERY="${*:-$(pbpaste)}"
  # URL encode the query (replaces spaces with +)
  local ENCODED_QUERY=$(echo "$QUERY" | tr ' ' '+')
  cmux browser open-split "https://www.google.com/search?q=$ENCODED_QUERY"
}

cmn() {
  # 1. Read the piped input
  local INPUT=$(cat -)
  
  if [ -z "$INPUT" ]; then
    return 1
  fi

  # 2. Print the full output to terminal
  echo "$INPUT"

  # 3. Copy full output to macOS clipboard
  echo -n "$INPUT" | pbcopy

  # Extract the first non-empty line to use as a fallback title
  local FIRST_LINE=$(echo "$INPUT" | sed '/^$/d' | head -n 1)

  # 4. Extract the last non-empty line for the notification body
  local LAST_LINE=$(echo "$INPUT" | sed '/^$/d' | tail -n 1)

  # 5. Handle the Title: Use the first argument if provided, 
  # otherwise use a default "Copied" title
  local TITLE="${1:-$FIRST_LINE}"

  # 6. Trigger cmux notification
  # We use the last line of the output as the 'body'
  cmux notify --title "$TITLE" --body "$LAST_LINE"
}
```