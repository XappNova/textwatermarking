# 🔐 TextWatermarking MCP Server

[![npm version](https://img.shields.io/npm/v/@textwatermarking/mcp-server.svg)](https://www.npmjs.com/package/@textwatermarking/mcp-server)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Downloads](https://img.shields.io/npm/dt/@textwatermarking/mcp-server.svg)](https://www.npmjs.com/package/@textwatermarking/mcp-server)
[![Package Size](https://img.shields.io/bundlephobia/min/@textwatermarking/mcp-server.svg)](https://bundlephobia.com/result?p=@textwatermarking/mcp-server)

A Unicode-based text watermarking MCP (Model Context Protocol) server that embeds invisible watermarks using variation selectors. Perfect for AI applications, content protection, and text authentication.

> **📦 This is the standalone NPX package.** For the full project documentation and source code, visit the [main repository](https://github.com/XappNova/textwatermarking/issues).

## 🤖 **New to MCP? Start Here!**

**Model Context Protocol (MCP)** is a way to connect AI tools like Cursor, Claude Desktop, and other applications with external services. Think of it as a bridge that lets your AI assistant access new capabilities.

### **What This Package Does:**
- **Adds watermarking superpowers** to your AI tools
- **Embeds invisible messages** in any text you create
- **Protects your content** without changing how it looks
- **Works seamlessly** with Cursor AI and Claude Desktop

### **Perfect For:**
- 📝 **Content creators** who want to protect their writing
- 👨‍💻 **Developers** building AI-powered applications  
- 🏢 **Teams** who need content authentication
- 🎓 **Students/Researchers** working with AI-generated text

### **5-Minute Setup:**
1. Get your free API token from [TextWatermarking.com](https://textwatermarking.com)
2. Run: `npx @textwatermarking/mcp-server --token YOUR_TOKEN`
3. Add to Cursor AI (instructions below)
4. Start watermarking! ✨

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

### 🎯 **Step-by-Step: Adding to Cursor AI**

**New to Cursor MCP setup?** Follow these exact steps:

#### **Step 1: Create MCP Configuration File**
1. Open Cursor AI
2. Press `Cmd/Ctrl + Shift + P` → Type "MCP" → Select "Open MCP Settings"
3. This creates/opens your `mcp.json` file

#### **Step 2: Add Watermarking Server**
Copy this configuration into your `mcp.json`:

```json
{
  "mcpServers": {
    "text-watermarking": {
      "command": "npx",
      "args": [
        "@textwatermarking/mcp-server", 
        "--token", 
        "YOUR_API_TOKEN"
      ],
      "description": "🔐 Invisible text watermarking for content protection"
    }
  }
}
```

#### **Step 3: Replace YOUR_API_TOKEN**
- Replace `YOUR_API_TOKEN` with your actual token from TextWatermarking.com
- Save the file (`Cmd/Ctrl + S`)

#### **Step 4: Restart Cursor**
- Close and reopen Cursor AI
- The watermarking tools will now be available in your AI chat!

#### **Step 5: Test It!**
Ask Cursor: *"Can you watermark the text 'Hello World' with the hidden message 'secret'?"*

You should see something like: `H󠅄󠅘󠅙󠅣󠄐󠅙󠅣󠄐󠅑󠄐󠅣󠅕󠅓󠅢󠅕󠅤`

✨ **That's it! You're now watermarking with AI!**

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

#### Method 1: Environment File (Recommended for Development)
```bash
# Copy the template and add your token
cp env.template .env
# Edit .env and replace 'your_api_token_here' with your actual token
vi .env

# Then run the server
watermark-mcp
```

#### Method 2: Command Line (Recommended for Cursor)
```bash
watermark-mcp --token YOUR_API_TOKEN
```

#### Method 3: Environment Variable
```bash
export USER_API_TOKEN="YOUR_API_TOKEN"
watermark-mcp
```

#### Method 4: Cursor MCP Configuration
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

**🔒 Security Note**: Never commit your `.env` file or hardcode tokens in your code. The package includes `env.template` as a starting point.

### Available Options

```bash
watermark-mcp [options]

Options:
  --token, -t <token>    API token for authentication
  --api-url, -u <url>    API base URL (default: https://textwatermarking.com/docs/overview.html)
  --help, -h             Show help message
```

## 🛠️ Available Tools

### Fast Encoding/Decoding
- **`fast_encode`**: Quick watermark embedding
- **`fast_decode`**: Quick watermark extraction

### Robust Encoding/Decoding  
- **`robust_encode`**: Advanced watermarking with stealth levels
- **`robust_decode`**: Extract robust watermarks

### 💡 **Real-World Examples for Cursor AI**

Once set up, you can ask Cursor AI things like:

**📝 Content Protection:**
> *"Watermark this blog post with my author signature"*
> 
> *"Add invisible copyright to this code documentation"*

**🔍 Content Verification:**
> *"Check if this text has any hidden watermarks"*
> 
> *"Decode any secret messages from this document"*

**🛡️ Team Collaboration:**
> *"Watermark this draft with 'Review needed by John'"*
> 
> *"Add invisible tracking to this proposal"*

**🎓 Academic Use:**
> *"Watermark my research notes with the source"*
> 
> *"Add invisible attribution to this summary"*

### 🔧 **Technical Usage (for developers)**

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
- **API Documentation**: [https://textwatermarking.com/docs/overview.html](https://textwatermarking.com/docs/overview.html)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

For major changes or questions about the overall system, do not hesistate to open [Issues](https://github.com/XappNova/textwatermarking/issues) :)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **NPM Package**: [@textwatermarking/mcp-server](https://www.npmjs.com/package/@textwatermarking/mcp-server)
- **API Documentation**: [https://textwatermarking.com/docs/overview.html](https://textwatermarking.com/docs/overview.html)
- **Support**: [support@textwatermarking.com](mailto:support@textwatermarking.com)
- **Issues**: [GitHub Issues](https://github.com/XappNova/textwatermarking/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

Made with ❤️ by the TextWatermarking Team 