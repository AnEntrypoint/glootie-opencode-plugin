# Installation Guide

## Quick Install (Recommended)

### Option 1: One-line Installer
```bash
curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/glootie-opencode-plugin/main/install.sh | bash
```

### Option 2: Manual Clone
```bash
cd /path/to/your/project
git clone https://github.com/AnEntrypoint/glootie-opencode-plugin.git .opencode/plugin
cd .opencode/plugin && npm install
```

## Global Installation

For use across multiple projects:

```bash
# Install globally
curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/glootie-opencode-plugin/main/install.sh | bash

# Use in any project
git clone ~/.config/opencode/plugin .opencode/plugin
```

## NPM Package (Coming Soon)

```bash
npm install -g @anentrypoint/glootie-opencode-plugin
```

## Verification

After installation, start OpenCode:

```bash
opencode
```

The plugin should load automatically and you'll see:
- MCP tools available: `glootie`, `playwright`, `vexify`
- Development workflow enforcement active
- Git validation running

## Configuration

The installer creates `opencode.json` with MCP server configuration. You can customize:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "glootie": {
      "type": "local",
      "command": ["npx", "-y", "mcp-glootie"],
      "enabled": true,
      "timeout": 360000
    }
  }
}
```

## Troubleshooting

### Plugin Not Loading
1. Check `.opencode/plugin` directory exists
2. Verify `npm install` completed successfully
3. Check OpenCode logs for errors

### MCP Tools Not Available
1. Ensure MCP servers are enabled in `opencode.json`
2. Check internet connection for `npx` downloads
3. Verify Node.js version >= 16.0.0

### Git Validation Issues
1. Ensure remote origin is set: `git remote add origin <url>`
2. Push/pull to sync with remote
3. Check network connectivity

## Development

For local development:

```bash
git clone https://github.com/AnEntrypoint/glootie-opencode-plugin.git
cd glootie-opencode-plugin
npm install
```

Then symlink to your project:

```bash
ln -s /path/to/glootie-opencode-plugin/.opencode/plugin /path/to/project/.opencode/plugin
```