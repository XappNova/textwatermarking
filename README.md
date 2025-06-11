# 🔐 TextWatermarking MCP Server

[![npm version](https://badge.fury.io/js/%40textwatermarking%2Fmcp-server.svg)](https://badge.fury.io/js/%40textwatermarking%2Fmcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/%40textwatermarking%2Fmcp-server.svg)](https://www.npmjs.com/package/@textwatermarking/mcp-server)

A Unicode-based text watermarking MCP (Model Context Protocol) server that embeds invisible watermarks using variation selectors. Perfect for AI applications, content protection, and text authentication.

> **📦 This is the standalone NPX package.** For the full project documentation and source code, visit the [main repository](https://github.com/textwatermarking/watermark-system).

## ✨ Features

- **🔒 Invisible Watermarking**: Embed secret text using Unicode variation selectors
- **⚡ Fast & Robust Algorithms**: Multiple encoding strategies for different use cases  
- **🤖 Cursor AI Integration**: Ready-to-use MCP server for Cursor and other AI tools
- **🚀 Zero Configuration**: Works out of the box with npx
- **🔑 Secure API**: Token-based authentication
- **📱 Cross-Platform**: Works on Windows, macOS, and Linux

## 🚀 Quick Start

**📋 Prerequisites**: You'll need an API token from [TextWatermarking.com](https://textwatermarking.com) (free registration required).

### Using with npx (Recommended)

```bash
# Run with command-line token
npx @textwatermarking/mcp-server --token YOUR_API_TOKEN

# Or with environment variable
USER_API_TOKEN="your_token_here" npx @textwatermarking/mcp-server
```

### Using with Cursor AI

Add to your `mcp.json` configuration:

```json
{
  "mcpServers": {
    "watermark-mcp": {
      "command": "npx",
      "args": [
        "@textwatermarking/mcp-server",
        "--token",
        "YOUR_API_TOKEN"
      ],
      "description": "Text watermarking with invisible Unicode markers"
    }
  }
}
```

## 📦 Installation

### Global Installation
```bash
npm install -g @textwatermarking/mcp-server
```

### Local Installation
```bash
npm install @textwatermarking/mcp-server
```

## 🔧 Configuration

### Getting Your API Token

**⚠️ Important**: You need a valid API token to use this MCP server.

#### Step 1: Register for an Account
1. Visit [TextWatermarking.com](https://textwatermarking.com)
2. Create a free account or sign in to your existing account
3. Navigate to your account dashboard or API settings

#### Step 2: Generate Your API Token
1. In your account dashboard, find the "API Keys" or "API Tokens" section
2. Generate a new API token for MCP server usage
3. Copy the token securely (you'll need it for configuration)

#### Step 3: Configure the Token
Once you have your API token, configure it using one of these methods:

#### Method 1: Command Line (Recommended for Cursor)
```bash
watermark-mcp --token YOUR_API_TOKEN
```

#### Method 2: Environment Variable
```bash
export USER_API_TOKEN="YOUR_API_TOKEN"
watermark-mcp
```

#### Method 3: Cursor MCP Configuration
```json
{
  "mcpServers": {
    "watermark-mcp": {
      "command": "npx",
      "args": ["@textwatermarking/mcp-server", "--token", "YOUR_API_TOKEN"]
    }
  }
}
```

### Available Options

```bash
watermark-mcp [options]

Options:
  --token, -t <token>    API token for authentication
  --api-url, -u <url>    API base URL (default: https://api.textwatermarking.com)
  --help, -h             Show help message
```

## 🛠️ Available Tools

### Fast Encoding/Decoding
- **`fast_encode`**: Quick watermark embedding
- **`fast_decode`**: Quick watermark extraction

### Robust Encoding/Decoding  
- **`robust_encode`**: Advanced watermarking with stealth levels
- **`robust_decode`**: Extract robust watermarks

### Example Usage

```typescript
// Fast encoding
const result = await mcp.call("fast_encode", {
  visible_text: "Hello World",
  hidden_text: "Secret Message"
});

// Returns: "H󠅄󠅘󠅙󠅣󠄐󠅙󠅣󠄐󠅑󠄐󠅣󠅕󠅓󠅢󠅕󠅤"

// Fast decoding
const decoded = await mcp.call("fast_decode", {
  input_text: "H󠅄󠅘󠅙󠅣󠄐󠅙󠅣󠄐󠅑󠄐󠅣󠅕󠅓󠅢󠅕󠅤"
});

// Returns: "Secret Message"
```

## 🔍 How It Works

This MCP server uses Unicode Variation Selectors to embed invisible watermarks:

1. **Encoding**: Hidden text is converted to Unicode variation selectors
2. **Embedding**: Selectors are inserted between characters in the visible text
3. **Invisibility**: The watermarked text appears identical to the original
4. **Decoding**: Variation selectors are extracted and converted back to hidden text

## 📚 API Reference

### fast_encode
Embeds hidden text using the fast algorithm.

**Parameters:**
- `visible_text` (string): Text shown to users
- `hidden_text` (string): Secret text to embed

**Returns:** Watermarked text with invisible markers

### fast_decode
Extracts hidden text using the fast algorithm.

**Parameters:**
- `input_text` (string): Text that may contain watermarks

**Returns:** Extracted hidden text or empty if none found

### robust_encode
Advanced watermarking with configurable stealth levels.

**Parameters:**
- `visible_text` (string): Text shown to users
- `hidden_text` (string): Secret text to embed
- `stealth_level` (optional): "standard" | "high" | "maximum"
- `distribution` (optional): "even" | "random"

**Returns:** Watermarked text with robust encoding

### robust_decode
Extracts robust watermarks.

**Parameters:**
- `input_text` (string): Text with potential robust watermarks

**Returns:** Extracted hidden text

## 🚨 Troubleshooting

### Common Issues

**❌ "Authentication failed"**
- Verify your API token is correct
- Check token hasn't expired
- Ensure token is properly set via `--token` or `USER_API_TOKEN`
- If you don't have a token, register at [TextWatermarking.com](https://textwatermarking.com)

**❌ "Need help getting an API token?"**
- Visit [TextWatermarking.com](https://textwatermarking.com) to register
- Contact support at [support@textwatermarking.com](mailto:support@textwatermarking.com)
- Check the API documentation for detailed setup instructions

**❌ "Command not found: watermark-mcp"**
- Use `npx @textwatermarking/mcp-server` instead
- Or install globally: `npm install -g @textwatermarking/mcp-server`

**❌ "MCP server connection failed"**
- Ensure you're using the correct MCP configuration
- Check that all dependencies are installed
- Verify Node.js version (requires ≥18.0.0)

## 🔗 Related Projects

- **Main Repository**: [TextWatermarking System](https://github.com/textwatermarking/watermark-system) - Full project with web interface, API, and documentation
- **WebAssembly Core**: Part of the main repository - Rust-based watermarking engine
- **API Documentation**: [https://api.textwatermarking.com](https://api.textwatermarking.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For major changes or questions about the overall system, visit the [main repository](https://github.com/textwatermarking/watermark-system).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **NPM Package**: [@textwatermarking/mcp-server](https://www.npmjs.com/package/@textwatermarking/mcp-server)
- **API Documentation**: [https://api.textwatermarking.com](https://api.textwatermarking.com)
- **Support**: [support@textwatermarking.com](mailto:support@textwatermarking.com)
- **Issues**: [GitHub Issues](https://github.com/textwatermarking/mcp-server/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by the TextWatermarking Team 