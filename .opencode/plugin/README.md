# Glootie OpenCode Plugin

This is the OpenCode version of the glootie-cc Claude plugin, providing:

- MCP server integration (glootie, playwright, vexify)
- Development workflow automation
- Git status checking
- Eval test running
- Environment protection

## Installation

1. Install dependencies:
```bash
cd .opencode/plugin
npm install
```

2. Configure OpenCode to use the MCP servers by adding to your `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "glootie": {
      "type": "local",
      "command": ["node", "${OPENCODE_PLUGIN_ROOT}/node_modules/mcp-glootie/src/index.js"],
      "enabled": true,
      "timeout": 360000
    },
    "playwright": {
      "type": "local", 
      "command": ["node", "${OPENCODE_PLUGIN_ROOT}/node_modules/@playwright/mcp/cli.js"],
      "enabled": true,
      "timeout": 360000
    },
    "vexify": {
      "type": "local",
      "command": ["node", "${OPENCODE_PLUGIN_ROOT}/node_modules/vexify/lib/bin/cli.js", "mcp"],
      "enabled": true,
      "timeout": 360000
    }
  }
}
```

## Available Tools

- `glootie_context`: Get development workflow rules
- `run_eval`: Run eval.js or evals directory tests
- `git_status`: Check git status for commits ahead/behind

## Features

- Automatic session start context loading
- Git sync validation before session end
- .env file protection
- MCP server integration
- Development workflow enforcement