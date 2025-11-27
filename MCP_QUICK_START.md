# MCP Quick Start Guide

Quick reference for setting up MCP servers in Cursor.

## 🚀 Quick Setup

### Figma MCP (Official Support)

**Desktop Server (Recommended):**
1. Open Figma Desktop App
2. Open a design file
3. Press `Shift + D` to enable Dev Mode
4. Click "Enable desktop MCP server" in the right sidebar
5. In Cursor: Settings → MCP → Add Custom MCP:
   ```json
   {
     "mcpServers": {
       "figma-desktop": {
         "url": "http://127.0.0.1:3845/mcp"
       }
     }
   }
   ```

**Remote Server:**
1. Open Figma in browser
2. Enable Dev Mode (`Shift + D`)
3. Click "Set up an MCP client"
4. Follow the deep link to configure in Cursor

### Sanity MCP (Official Support)

**Quick Install:**
1. Use the direct install link: [Add Sanity MCP to Cursor](https://cursor.sh/mcp?url=https://mcp.sanity.io)
2. Click **"Install"** → **"Connect"** → Allow access
3. Done! You can now use natural language to interact with Sanity

**Manual Setup:**
In Cursor: Settings → MCP → Add Custom MCP:
```json
{
  "mcpServers": {
    "Sanity": {
      "url": "https://mcp.sanity.io",
      "type": "http"
    }
  }
}
```

**Example Usage:**
- "Run a GROQ query for all projects"
- "Create a new document from this markdown"
- "List all releases in my dataset"

### Firebase, Supabase

These platforms don't have official MCP servers yet. Use their SDKs directly:

- **Firebase**: Install `firebase` or `firebase-admin` packages
- **Supabase**: Install `@supabase/supabase-js` package

See `MCP_SETUP_GUIDE.md` for full details.

## ✅ Verify Setup

In Cursor chat, ask: "What MCP servers are available?"

You should see Figma and/or Sanity MCP listed if configured correctly.

**Test Sanity MCP:**
- Ask: "List all projects in my Sanity workspace"
- Or: "What datasets are available in my Sanity project?"

