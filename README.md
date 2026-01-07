# Pixel Czar v7 - Personal Portfolio

> Born in Figma, raised in Cursor, assembled pixel-by-pixel in Beverly, MA.

A modern, animated portfolio website built with Next.js 14, featuring custom cursor interactions, smooth page transitions, and a dark/light theme toggle.

## 🚀 Features

- **Custom Cursor** - Magnetic interactions with navigation elements
- **Smooth Page Transitions** - Staggered element animations with Framer Motion
- **Dark/Light Theme** - Persistent theme toggle with smooth transitions
- **Responsive Design** - Mobile-first approach with hamburger menu
- **SEO Optimized** - Open Graph tags, JSON-LD structured data, sitemap
- **Performance** - Built with Next.js App Router for optimal performance
- **Typography** - Custom font pairing with Adobe Typekit (Lust)

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Fonts:** Archivo (Google Fonts) + Lust (Adobe Typekit)
- **Deployment:** [Your deployment platform]

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/[your-username]/pixelczar-v7.git

# Navigate to project directory
cd pixelczar-v7

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 🔌 MCP (Model Context Protocol) Setup

This project includes MCP server configuration for enhanced AI-assisted development. MCP servers allow Cursor to interact with external services like Figma, Sanity, Firebase, and Supabase.

### Quick Setup

1. **Figma MCP** (Official Support):
   - See `MCP_QUICK_START.md` for quick setup instructions
   - Full guide: `MCP_SETUP_GUIDE.md`

2. **Sanity MCP** (Official Support):
   - Quick install: [Add Sanity MCP to Cursor](https://cursor.sh/mcp?url=https://mcp.sanity.io)
   - See `MCP_QUICK_START.md` for quick setup instructions
   - Full guide: `MCP_SETUP_GUIDE.md`

3. **Firebase, Supabase**:
   - These platforms don't have official MCP servers yet
   - Use their SDKs directly
   - See `MCP_SETUP_GUIDE.md` for details

### Configuration Files

- `.cursor-mcp-config.json` - Reference MCP configuration template
- `MCP_SETUP_GUIDE.md` - Complete setup instructions
- `MCP_QUICK_START.md` - Quick reference guide

## 📁 Project Structure

```
pixelczar-v7/
├── app/                    # Next.js App Router pages
│   ├── about/             # About page
│   ├── work/              # Work/portfolio page
│   ├── archive/           # Archive page
│   ├── layout.tsx         # Root layout with metadata
│   ├── template.tsx       # Page transition wrapper
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── custom-cursor.tsx # Custom cursor implementation
│   ├── header.tsx        # Navigation header
│   ├── footer.tsx        # Footer with social links
│   └── ...
├── lib/                  # Utility functions and data
│   ├── data.ts          # Work experience data
│   └── utils.ts         # Helper functions
└── public/              # Static assets
    └── images/          # Images and icons
```

## 🎨 Customization

### Update Personal Information

1. **Work Experience:** Edit `lib/data.ts`
2. **About Content:** Edit `app/about/page.tsx`
3. **Social Links:** Edit `components/footer.tsx`
4. **Images:** Replace images in `public/images/`

### Theme Colors

Colors are defined in `app/globals.css` using CSS variables:

```css
:root {
  --accent: ...;
  --foreground: ...;
  --background: ...;
}
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

Build the production bundle:

```bash
npm run build
npm start
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Design inspiration from modern portfolio websites
- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)

---

**Made with ❤️ by Will Smith in Beverly, MA**

