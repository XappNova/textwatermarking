// src/index.ts – generic MCP version
import dotenv from "dotenv";
dotenv.config({ override: true });

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
// Assuming CallToolResult is the correct type for the handler's return value.
// If specific types for handler parameters (like a context object) are needed beyond inferred args,
// they would be imported here or defined.
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

/* ──── Configuration Setup ───────────────────────────────────────── */
function parseArguments() {
  const args = process.argv.slice(2);
  const config: { token?: string; apiUrl?: string } = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--token':
      case '-t':
        config.token = args[i + 1];
        i++; // Skip next arg since it's the token value
        break;
      case '--api-url':
      case '-u':
        config.apiUrl = args[i + 1];
        i++; // Skip next arg since it's the URL value
        break;
      case '--help':
      case '-h':
        console.error('Usage: watermark-mcp [options]');
        console.error('Options:');
        console.error('  --token, -t <token>    API token for authentication');
        console.error('  --api-url, -u <url>    API base URL (default: https://api.textwatermarking.com)');
        console.error('  --help, -h             Show this help message');
        console.error('');
        console.error('Environment Variables:');
        console.error('  USER_API_TOKEN         API token (overridden by --token)');
        console.error('  API_BASE_URL           API base URL (overridden by --api-url)');
        process.exit(0);
        break;
    }
  }
  
  return config;
}

const config = parseArguments();

/* ──── Environment Configuration ─────────────────────────────────── */
// Priority: Command line args > Environment variables > Defaults
const API_BASE_URL = config.apiUrl || process.env.API_BASE_URL || "https://api.textwatermarking.com";
const USER_API_TOKEN = config.token || process.env.USER_API_TOKEN;

// Log configuration source for debugging (to stderr, not stdout)
if (config.token) {
  console.error("[Config] Using API token from command line argument");
} else if (process.env.USER_API_TOKEN) {
  console.error("[Config] Using API token from environment variable");
} else {
  console.error("[Config] No API token provided");
}

if (config.apiUrl) {
  console.error("[Config] Using API URL from command line argument:", API_BASE_URL);
} else if (process.env.API_BASE_URL) {
  console.error("[Config] Using API URL from environment variable:", API_BASE_URL);
} else {
  console.error("[Config] Using default API URL:", API_BASE_URL);
}

/* ــ Helper ---––––––––––––– */
async function callApi(path: string, payload: unknown, toolName: string) {
  console.log(`[callApi] Attempting to call tool '${toolName}' at path '${path}'`);
  try {
    const r = await axios.post(`${API_BASE_URL}${path}`, payload, {
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Token ${USER_API_TOKEN}` // Corrected to Token
      },
      timeout: 15000 // 15 second timeout
    });
    return r.data;
  } catch (error: any) {
    console.error(`[${toolName}] API Error:`, error.isAxiosError ? error.message : error);
    if (axios.isAxiosError(error) && error.response) {
      console.error(`[${toolName}] API Error Response Data:`, error.response.data);
      console.error(`[${toolName}] API Error Response Status:`, error.response.status);
      throw new Error(`API Error for ${toolName} (${error.response.status}): ${JSON.stringify(error.response.data) || error.message}`);
    }
    throw new Error(`API Error for ${toolName}: ${error.message || "Unknown error"}`);
  }
}

/* ــ Create server ---–––––– */
const server = new McpServer(
  { name: "TextWatermarkingMCP", version: "1.0.0" },
  { capabilities: { tools: { listChanged: true } } } 
);

/* ــ Register tools ---––––– */

// 1) fast_encode
const fastEncodeInputSchema = z.object({
  visible_text: z.string().describe("Text shown to users"),
  hidden_text:  z.string().describe("Secret text to embed"),
});
server.tool(
  "fast_encode",
  fastEncodeInputSchema.shape,
  { description: "Embed hidden_text inside visible_text using the fast algorithm" },
  async (args: z.infer<typeof fastEncodeInputSchema>): Promise<CallToolResult> => {
    console.log("[fast_encode] Tool handler invoked with args:", args);
    try {
      const { encoded } = await callApi("/api/watermark/encode", {
        text: args.visible_text,
        secret: args.hidden_text,
      }, "fast_encode");
      return { content: [{ type: "text", text: encoded }] };
    } catch (error: any) {
      return {
        content: [],
        error: {
          code: -32000,
          message: `Tool 'fast_encode' failed: ${error.message}`
        }
      }
    }
  }
);

// 2) fast_decode
const fastDecodeInputSchema = z.object({
  input_text: z.string().describe("Text that may contain a hidden watermark (fast)"),
});
server.tool(
  "fast_decode",
  fastDecodeInputSchema.shape,
  { description: "Extract a hidden watermark using the fast algorithm" },
  async (args: z.infer<typeof fastDecodeInputSchema>): Promise<CallToolResult> => {
    try {
      const { decoded } = await callApi("/api/watermark/decode", {
        text: args.input_text,
      }, "fast_decode");
      return { content: [{ type: "text", text: decoded }] };
    } catch (error: any) {
      return {
        content: [],
        error: {
          code: -32000,
          message: `Tool 'fast_decode' failed: ${error.message}`
        }
      }
    }
  }
);

// 3) robust_encode
const robustEncodeInputSchema = z.object({
  visible_text: z.string().describe("Text shown to users"),
  hidden_text:  z.string().describe("Secret text to embed"),
  distribution: z.string().optional().describe("Distribution strategy (e.g., 'even', 'random')"),
  stealth_level: z.enum(["standard", "high", "maximum"]).optional().describe("Stealth level (must be one of: standard, high, maximum)"),
});
server.tool(
  "robust_encode",
  robustEncodeInputSchema.shape,
  { description: "Embed hidden_text inside visible_text using the robust algorithm" },
  async (args: z.infer<typeof robustEncodeInputSchema>): Promise<CallToolResult> => {
    try {
      const payload: any = {
        visible_text: args.visible_text,
        hidden_text: args.hidden_text,
      };
      if (args.distribution) payload.distribution = args.distribution;
      if (args.stealth_level) payload.stealth_level = args.stealth_level;
      
      const { watermarked } = await callApi("/api/watermark/encode-robust", payload, "robust_encode");
      return { content: [{ type: "text", text: watermarked }] };
    } catch (error: any) {
      return {
        content: [],
        error: {
          code: -32000,
          message: `Tool 'robust_encode' failed: ${error.message}`
        }
      }
    }
  }
);

// 4) robust_decode
const robustDecodeInputSchema = z.object({
  input_text: z.string().describe("Text that may contain a hidden watermark (robust)"),
});
server.tool(
  "robust_decode",
  robustDecodeInputSchema.shape,
  { description: "Extract a hidden watermark using the robust algorithm" },
  async (args: z.infer<typeof robustDecodeInputSchema>): Promise<CallToolResult> => {
    try {
      const { decoded } = await callApi("/api/watermark/decode-robust", {
        text: args.input_text,
      }, "robust_decode");
      return { content: [{ type: "text", text: decoded }] };
    } catch (error: any) {
      return {
        content: [],
        error: {
          code: -32000,
          message: `Tool 'robust_decode' failed: ${error.message}`
        }
      }
    }
  }
);

/* ــ Expose via stdio ---––– */
async function startServer() {
  console.log("[startServer] Initializing server...");
  
  // Validate required configuration
  if (!API_BASE_URL) {
    console.error("CRITICAL ERROR: Missing API_BASE_URL. Please set the environment variable or use --api-url");
    process.exit(1);
  }
  
  if (!USER_API_TOKEN) {
    console.error("CRITICAL ERROR: Missing USER_API_TOKEN. Please provide it via:");
    console.error("  1. Command line: --token <your-token>");
    console.error("  2. Environment variable: USER_API_TOKEN=<your-token>");
    console.error("  3. Cursor MCP config with args: ['--token', '<your-token>']");
    process.exit(1);
  }
  
  try {
    const transport = new StdioServerTransport();
    console.log("[startServer] Connecting transport...");
    await server.connect(transport);
    console.log("[startServer] Transport connected successfully.");
  } catch (error) {
    console.error("Failed to start MCP server:", error);
    process.exit(1);
  }
}

startServer(); 