# ResumeToPortfolio

Upload your resume (PDF or DOCX) and instantly generate a beautiful, responsive portfolio website — powered by AI.

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Claude AI](https://img.shields.io/badge/Claude_AI-D97757?style=flat-square&logo=anthropic&logoColor=white)

## How It Works

1. **Upload** — Drag and drop your resume (PDF or DOCX) onto the upload page
2. **Extract** — The backend parses the file and sends the text to Claude AI, which extracts structured data (name, skills, experience, projects, etc.)
3. **Generate** — A polished, self-contained portfolio website is built from the extracted data
4. **Download** — Preview your portfolio live in the browser and download it as a single HTML file you can host anywhere

## Features

- **Drag-and-drop upload** with file type and size validation
- **AI-powered extraction** using Claude Haiku 4.5 for fast, accurate resume parsing
- **Beautiful portfolio template** — dark/light mode, sticky navbar, scroll animations, timeline layout, project cards
- **Fully self-contained HTML** — the downloaded file works standalone with no external dependencies (except Google Fonts)
- **Responsive design** — looks great on phones, tablets, and desktops
- **Graceful handling** — missing resume sections are simply omitted, no empty placeholders
- **Animated loading states** with step-by-step progress indicators

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| PDF Parsing | pdf-parse |
| DOCX Parsing | mammoth |
| AI Extraction | Anthropic Claude API (@anthropic-ai/sdk) |

## Getting Started

### Prerequisites

- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/archit2901/resume-to-portfolio.git
cd resume-to-portfolio
npm install
```

### Configuration

Create a `.env.local` file in the project root:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx                — Upload page with drag-and-drop
  preview/page.tsx        — Live preview with download button
  api/generate/route.ts   — File parsing + Claude AI extraction
  api/template/route.ts   — JSON → HTML portfolio generation
components/
  UploadZone.tsx          — Drag-and-drop upload component
  LoadingSteps.tsx        — Multi-step animated progress
  PortfolioPreview.tsx    — iframe-based live preview
  ActionBar.tsx           — Floating download/upload bar
lib/
  types.ts                — TypeScript interfaces for resume data
  parseResume.ts          — PDF and DOCX text extraction
  extractWithGemini.ts    — Claude AI structured extraction
  generatePortfolio.ts    — Template system wrapper
templates/
  modern.ts               — Self-contained HTML portfolio template
```

## Portfolio Template

The generated portfolio includes:

- **Hero** — Name, title, location badge, contact links (email, LinkedIn, GitHub)
- **About** — Professional summary
- **Skills** — Grouped chips/tags by category with hover effects
- **Experience** — Vertical timeline with roles, companies, and bullet points
- **Education** — Card layout with institution, degree, GPA
- **Projects** — Card grid with descriptions, tech stack tags, and links
- **Certifications / Awards / Languages** — Additional section
- **Contact** — Footer with all contact methods
- **Dark/Light mode toggle** — persisted via localStorage
- **Smooth scroll navigation** — sticky navbar with active section highlighting
- **Scroll-triggered animations** — fade-in and slide-up effects

## License

MIT
