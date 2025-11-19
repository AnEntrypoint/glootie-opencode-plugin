#!/bin/bash

# Installation script for glootie-opencode-plugin
# Usage: curl -fsSL https://raw.githubusercontent.com/AnEntrypoint/glootie-opencode-plugin/main/install.sh | bash

set -e

PLUGIN_DIR=".opencode/plugin"
REPO_URL="https://github.com/AnEntrypoint/glootie-opencode-plugin.git"

echo "🚀 Installing Glootie OpenCode Plugin..."

# Check if we're in a project directory
if [ ! -d ".git" ] && [ ! -f "package.json" ]; then
    echo "⚠️  Warning: Not in a project directory. Plugin will be installed globally."
    GLOBAL_INSTALL=true
else
    GLOBAL_INSTALL=false
fi

# Create plugin directory
if [ "$GLOBAL_INSTALL" = true ]; then
    PLUGIN_DIR="$HOME/.config/opencode/plugin"
    mkdir -p "$PLUGIN_DIR"
else
    mkdir -p "$PLUGIN_DIR"
fi

# Clone the plugin
echo "📥 Downloading plugin..."
if [ -d "$PLUGIN_DIR/.git" ]; then
    echo "Plugin directory exists, updating..."
    cd "$PLUGIN_DIR"
    git pull origin main
else
    git clone "$REPO_URL" "$PLUGIN_DIR"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd "$PLUGIN_DIR"
npm install

# Configure opencode.json if not global
if [ "$GLOBAL_INSTALL" = false ]; then
    if [ ! -f "opencode.json" ]; then
        echo "⚙️  Creating opencode.json configuration..."
        cat > opencode.json << 'EOF'
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
EOF
        echo "✅ opencode.json created with MCP server configuration"
    else
        echo "ℹ️  opencode.json already exists. Please manually add MCP server configuration."
    fi
fi

echo "🎉 Installation complete!"
echo ""
if [ "$GLOBAL_INSTALL" = false ]; then
    echo "📋 Next steps:"
    echo "   1. Run 'opencode' in this directory"
    echo "   2. The plugin will automatically load"
    echo "   3. MCP tools: glootie, playwright, vexify"
else
    echo "📋 Next steps:"
    echo "   1. Plugin installed globally"
    echo "   2. Clone to project directories: git clone $HOME/.config/opencode/plugin .opencode/plugin"
fi
echo ""
echo "📚 Documentation: https://github.com/AnEntrypoint/glootie-opencode-plugin"