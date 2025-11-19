# Glootie OpenCode Plugin

Advanced OpenCode plugin with WFGY integration, MCP tools, and automated development workflow enforcement.

## Features

- **MCP Server Integration**: Built-in support for glootie, playwright, and vexify MCP servers
- **Development Workflow**: Automated enforcement of coding standards and practices
- **Git Validation**: Prevents sessions when git is out of sync with remote
- **Environment Protection**: Blocks access to .env files
- **Session Hooks**: Context loading and validation on session start/end

## Installation

### Option 1: Direct Clone (Recommended for development)

```bash
cd /path/to/your/project
git clone https://github.com/AnEntrypoint/glootie-opencode-plugin.git .opencode/plugin
```

### Option 2: NPM Package (Coming soon)

```bash
npm install -g glootie-opencode-plugin
```

## Setup

1. **Install dependencies**:
```bash
cd .opencode/plugin
npm install
```

2. **Configure OpenCode** - Add to your `opencode.json`:
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "glootie": {
      "type": "local",
      "command": ["npx", "-y", "mcp-glootie"],
      "enabled": true,
      "timeout": 360000
    },
    "playwright": {
      "type": "local",
      "command": ["npx", "-y", "@playwright/mcp"],
      "enabled": true,
      "timeout": 360000
    },
    "vexify": {
      "type": "local",
      "command": ["npx", "-y", "vexify", "mcp"],
      "enabled": true,
      "timeout": 360000
    }
  }
}
```

3. **Start OpenCode**:
```bash
opencode
```

## Available MCP Tools

Once configured, these MCP tools are available:

- **glootie**: Code execution and development tools
- **playwright**: Browser automation and testing
- **vexify**: Vector database and semantic search

## Development Workflow Rules

The plugin enforces strict development practices:

- No temporary/mock/simulation files
- Single primary implementations (no fallbacks)
- Clear error logging without hiding failures
- 200-line file size limit
- No hardcoded values
- Continuous refactoring for clean architecture
- Real execution over assumptions

## Usage Examples

### Using MCP Tools

```
Use the glootie tool to execute this JavaScript code
Use playwright to test this web page
Use vexify to search for similar code patterns
```

### Git Validation

The plugin will block sessions if:
- You have commits ahead of origin/HEAD (need to push)
- You have commits behind origin/HEAD (need to pull)

### Environment Protection

The plugin automatically blocks attempts to read .env files.

## Configuration

### Customizing MCP Servers

You can modify the MCP server commands in `opencode.json`:

```json
{
  "mcp": {
    "glootie": {
      "type": "local",
      "command": ["node", "/path/to/custom/glootie.js"],
      "enabled": true
    }
  }
}
```

### Disabling MCP Servers

```json
{
  "tools": {
    "glootie": false,
    "playwright": false
  }
}
```

## Development

### Local Development

```bash
git clone https://github.com/AnEntrypoint/glootie-opencode-plugin.git
cd glootie-opencode-plugin
npm install
```

### Testing

```bash
# Test plugin loading
node .opencode/plugin/index.js

# Test with OpenCode
opencode
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the development workflow rules in `start.md`
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

- Create an issue on GitHub
- Join the OpenCode Discord
- Check the [OpenCode documentation](https://opencode.ai/docs)