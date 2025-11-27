# MCP (Model Context Protocol) Setup Guide

This guide will help you set up MCP servers for Figma, Sanity, Firebase, and Supabase in Cursor.

## 📋 Overview

MCP (Model Context Protocol) servers allow AI assistants to interact with external services and tools, providing context and capabilities directly in your development environment.

## 🎨 Figma MCP Server

Figma has official MCP server support with two options:

### Option 1: Desktop MCP Server (Recommended for Local Development)

**Prerequisites:**
- Figma Desktop App installed and updated to the latest version

**Setup Steps:**

1. **Enable the Desktop MCP Server:**
   - Open the Figma desktop app
   - Open any Figma Design file
   - Toggle to Dev Mode using `Shift + D` or the toolbar switch
   - In the right sidebar, click "Enable desktop MCP server"
   - A confirmation will show the server is running at `http://127.0.0.1:3845/mcp`

2. **Configure in Cursor:**
   - Open Cursor Settings (`Cmd + ,` or `Ctrl + ,`)
   - Navigate to the **MCP** tab
   - Click **"Add Custom MCP"**
   - Enter the following configuration:
     ```json
     {
       "mcpServers": {
         "figma-desktop": {
           "url": "http://127.0.0.1:3845/mcp"
         }
       }
     }
     ```
   - Save the configuration
   - Restart Cursor if needed

### Option 2: Remote MCP Server (Browser-Based)

**Setup Steps:**

1. **Access Figma in Browser:**
   - Open a Figma Design file in your web browser
   - Toggle to Dev Mode (`Shift + D`)
   - In the right sidebar, click "Set up an MCP client"

2. **Configure in Cursor:**
   - Click the Figma MCP server deep link provided in Figma
   - In Cursor, click **"Install"** under "Install MCP Server?"
   - Click **"Connect"** next to Figma to begin authentication
   - Allow access when prompted

   Or manually add to Cursor settings:
   ```json
   {
     "mcpServers": {
       "figma": {
         "url": "https://mcp.figma.com/mcp"
       }
     }
   }
   ```

**Using Figma MCP:**
- Select a frame or layer in Figma and prompt Cursor to implement it
- Copy a Figma link and use it in your prompts for design context
- Generate code that matches your Figma designs

## 📝 Sanity MCP Server

Sanity has official MCP server support! The Sanity MCP server provides AI assistants with direct, authenticated access to your Sanity projects.

**Prerequisites:**
- A Sanity account and project
- MCP-compatible client (Cursor or Claude Code)

**Setup Steps:**

1. **Quick Install (Recommended for Cursor):**
   - Use the direct install link: [Add Sanity MCP to Cursor](https://cursor.sh/mcp?url=https://mcp.sanity.io)
   - Click **"Install"** under "Install MCP Server?"
   - Click **"Connect"** next to Sanity to begin authentication
   - Allow access when prompted

2. **Manual Configuration:**
   - Open Cursor Settings (`Cmd + ,` or `Ctrl + ,`)
   - Navigate to the **MCP** tab
   - Click **"Add Custom MCP"**
   - Enter the following configuration:
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
   - Save the configuration
   - Authenticate with your Sanity credentials when prompted

3. **Using API Token (Alternative to OAuth):**
   - Create an API token from [sanity.io/manage](https://sanity.io/manage) or using `sanity tokens` CLI command
   - Configure with Authorization header:
     ```json
     {
       "mcpServers": {
         "Sanity": {
           "url": "https://mcp.sanity.io",
           "headers": {
             "Authorization": "Bearer sk..."
           }
         }
       }
     }
     ```

**Using Sanity MCP:**
Once configured, you can use natural language to work with Sanity:
- "Run a GROQ query for all articles written by Mark"
- "Add localization to my article document type"
- "Help me migrate existing content to a new schema shape"
- "List all releases in this dataset"
- "Create a new document from this markdown content"

**Available Tools:**
The Sanity MCP server provides tools for:
- **Content Operations**: Create, update, patch, delete, publish/unpublish documents
- **Schema Exploration**: Get schema information, list workspace schemas
- **GROQ Queries**: Execute GROQ queries directly
- **Project Management**: List projects, datasets, create datasets, manage API keys
- **Releases**: Create, schedule, publish, and manage content releases
- **Versioning**: Create versions, replace document versions
- **AI Features**: Transform documents, translate content, transform/generate images
- **Migration**: Get guidance for migrating projects to Sanity
- **Documentation**: Search and read Sanity documentation

**Current Sanity Setup:**
- Project ID: Set in `NEXT_PUBLIC_SANITY_PROJECT_ID` (see `.env.local`)
- Dataset: `production` (configured in `sanity.config.ts`)
- Studio: Available at `http://localhost:3000/studio`

**Documentation:**
- [Sanity MCP Server Documentation](https://www.sanity.io/docs/compute-and-ai/mcp-server)

## 🔥 Firebase MCP Server

Firebase doesn't have an official MCP server. However, you can:

1. **Use Firebase Admin SDK** (Server-side):
   - Install Firebase Admin SDK: `npm install firebase-admin`
   - Configure with service account credentials
   - Access Firebase services programmatically

2. **Use Firebase Client SDK** (Client-side):
   - Install Firebase: `npm install firebase`
   - Configure Firebase in your app
   - Access Firestore, Auth, Storage, etc.

3. **Future MCP Support:**
   - Monitor [Firebase GitHub](https://github.com/firebase) for MCP server announcements
   - Check community MCP servers on npm: `@modelcontextprotocol/server-*`

**To Set Up Firebase:**
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Get your Firebase config (API keys, project ID, etc.)
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

## 🗄️ Supabase MCP Server

Supabase doesn't have an official MCP server yet. You can:

1. **Use Supabase Client** (Already available):
   - Install Supabase: `npm install @supabase/supabase-js`
   - Configure Supabase client with your project URL and anon key
   - Access database, auth, storage, etc.

2. **Future MCP Support:**
   - Monitor [Supabase GitHub](https://github.com/supabase) for MCP server announcements
   - Check community implementations

**To Set Up Supabase:**
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Project Settings → API
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## 🔧 Cursor MCP Configuration

To manually configure MCP servers in Cursor:

1. **Open Cursor Settings:**
   - Press `Cmd + ,` (macOS) or `Ctrl + ,` (Windows/Linux)
   - Or: Command Palette → "Cursor: Open Settings"

2. **Navigate to MCP Tab:**
   - Click on the **MCP** tab in settings

3. **Add Servers:**
   - Click **"Add Custom MCP"**
   - Enter server configuration (see examples above)
   - Save and restart Cursor if needed

## 📝 Configuration Template

Here's a complete MCP configuration template you can use in Cursor:

```json
{
  "mcpServers": {
    "figma-desktop": {
      "url": "http://127.0.0.1:3845/mcp",
      "description": "Figma Desktop MCP Server (requires Figma desktop app)"
    },
    "figma": {
      "url": "https://mcp.figma.com/mcp",
      "description": "Figma Remote MCP Server (browser-based)"
    },
    "Sanity": {
      "url": "https://mcp.sanity.io",
      "type": "http",
      "description": "Sanity MCP Server - Official support for Sanity CMS"
    }
  }
}
```

**Note:** Only add the servers you'll actually use. You don't need both Figma servers.

## ✅ Verification

To verify MCP servers are working:

1. **In Cursor Chat:**
   - Open the chat (`Cmd + L` or `Ctrl + L`)
   - Ask: "What MCP servers are available?"
   - The AI should list configured MCP servers

2. **For Figma:**
   - Select a frame in Figma
   - In Cursor, ask: "Generate code for the selected Figma design"
   - The AI should be able to access Figma context

3. **For Sanity:**
   - In Cursor, ask: "List all projects in my Sanity workspace"
   - Or: "Run a GROQ query for all documents of type 'project'"
   - The AI should be able to interact with your Sanity project

## 🔗 Useful Links

- [Figma MCP Documentation](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server)
- [Sanity MCP Server Documentation](https://www.sanity.io/docs/compute-and-ai/mcp-server)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Sanity Documentation](https://www.sanity.io/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

## 🐛 Troubleshooting

**Figma MCP not connecting:**
- Ensure Figma desktop app is running and Dev Mode is enabled
- Check that the MCP server is enabled in Figma (should show confirmation)
- Verify the URL in Cursor settings matches: `http://127.0.0.1:3845/mcp`
- Try restarting both Figma and Cursor

**MCP servers not appearing:**
- Restart Cursor after adding MCP servers
- Check Cursor settings → MCP tab to verify configuration
- Ensure JSON syntax is correct (no trailing commas)

**Authentication issues:**
- For remote Figma MCP, ensure you've completed the OAuth flow
- For Sanity MCP, ensure you have valid Sanity credentials and necessary permissions
- Sessions expire after 7 days. Your client should automatically refresh tokens when needed
- If authentication fails, try: Command Palette → "Cursor: Clear All MCP Tokens", then restart the server
- Check browser permissions if authentication popup was blocked

---

**Last Updated:** 2025-01-27

