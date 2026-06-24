# Zamili Studio

Open-source AI video studio for building vertical reels, cinematic explainers, and social content with Remotion, React, Cursor agents, local SQLite, and provider-backed media libraries.

Zamili Studio is designed for developers who want a self-hosted creative tool: prompt a video idea, preview it live, render an MP4, and keep projects on your own machine.

## Links

- Landing page: `https://guidatetest.github.io/zamili-studio/`
- GitHub repo: `https://github.com/GuidateTest/zamili-studio`
- Local landing page: `http://localhost:3000/`
- Local Studio app: `http://localhost:3000/studio`

## Why Star This Repo

- Enterprise-style React landing page with Remotion-generated WebM motion assets
- AI reel generator with live Remotion preview
- Prompt-to-project workflow powered by Cursor SDK / Cursor Agent
- Local-first SQLite project database
- Render and download MP4 exports from the browser
- Media library connected to local manifests, Pexels, and ElevenLabs
- Brand assets and voiceover management pages
- Production-minded defaults: secrets ignored, generated media ignored, local data ignored
- Modern SaaS UI built with React, Vite, Framer Motion, and Remotion Player

## Screens

The app includes:

- Dashboard with project/export/AI generation metrics
- Projects list with persisted local projects
- AI Reel Generator with timeline, preview, render, and download controls
- Media Library for stock/video/audio/animation assets
- Brand Assets for logos and product media
- Voiceovers for ElevenLabs master tracks and scene segments
- Exports page for completed render jobs
- Settings for API key and asset health checks

## Tech Stack

- React 19
- Vite 6
- Remotion 4
- Remotion Player
- Framer Motion
- SQLite via `better-sqlite3`
- Cursor SDK / Cursor Agent bridge
- ElevenLabs voiceover and SFX integration
- Pexels stock video search

## Quick Start

```bash
git clone https://github.com/GuidateTest/zamili-studio.git
cd zamili-studio
npm install
```

Create your local environment:

```bash
cp .env.example .env
```

Add only the keys you need:

```env
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here
CURSOR_API_KEY=your_cursor_api_key_here
CURSOR_AUTO_AGENT=true
```

Run the Studio:

```bash
npm run dev
```

Open `http://localhost:3000`.

The landing page is served at `/`. The Studio app is served at `/studio`.

## Core Workflow

1. Open **AI Reel Generator**.
2. Enter a detailed video prompt.
3. Click **Generate with AI**.
4. Watch the live preview and timeline.
5. Click **Render MP4**.
6. Download from the editor or the **Exports** page.

The Studio stores projects locally in SQLite and render jobs under ignored local folders.

## Commands

```bash
npm run dev                 # Start Zamili Studio UI
npm run build:studio        # Build the Studio UI
npm run build:pages         # Build for GitHub Pages
npm run dev:engine          # Open Remotion Studio
npm run render:reel         # Render AIProjectReel
npm run render:landing      # Render landing WebM loops
npm run deploy:check        # Render, lint, and build production outputs
npm run audio               # Generate voiceover + SFX
npm run setup               # Initialize local setup
npm run lint                # ESLint + TypeScript
```

## Project Structure

```text
src/
  landing/          Public landing page and Remotion WebM animations
  engine/           Remotion compositions, player, render metadata
  studio/           SaaS app UI, hooks, API client, design system
  scenes/           Scene implementations
  components/       Shared Remotion visual components
server/
  routes.mjs        Local Vite API routes
  db.mjs            SQLite data layer
  assets.mjs        Media/brand/voiceover asset indexer
  render-jobs.mjs   Render job runner and download API
scripts/
  cursor-bridge.mjs Cursor inbox bridge
  cursor-agent-run.mjs hidden Cursor SDK worker
public/
  landing/          Tracked generated WebM loops for the landing page
  logo.png
  zamili-studios.png
```

## Landing Page

The landing page is designed to communicate the platform at a professional, enterprise level: premium hero section, slick generated animation loops, developer CTAs, workflow explanation, stack proof, and deployment documentation.

See `docs/LANDING_PAGE.md` for:

- tools used
- generated animation assets
- deployment commands
- GitHub Pages setup
- local routes and public links

## API Routes

The local Vite server exposes:

- `GET /api/studio/health`
- `GET /api/studio/projects`
- `POST /api/studio/projects`
- `PATCH /api/studio/projects/:id`
- `GET /api/studio/assets`
- `GET /api/studio/assets/brand`
- `GET /api/studio/assets/voiceovers`
- `POST /api/studio/cursor-prompt`
- `POST /api/studio/renders`
- `GET /api/studio/renders`
- `GET /api/studio/renders/:id`
- `GET /api/studio/renders/:id/download`

These routes are intended for local development/self-hosting. Add authentication before exposing them publicly.

## Security And Privacy

This repo is configured to avoid publishing private data:

- `.env` and local env files are ignored
- SQLite databases under `data/` are ignored
- render outputs under `out/` are ignored
- Cursor inbox runtime prompts are ignored
- generated audio/video assets are ignored
- only generic landing loops under `public/landing/*.webm` are tracked
- private Zamili media under `public/zamili/` is ignored
- large local ChatGPT image drops are ignored

Before publishing, run:

```bash
git status --short
git diff --cached --name-only
```

Never commit API keys, customer data, private media, local databases, rendered MP4s, or personal images.

## Cursor Agent Bridge

Zamili Studio can send prompts to Cursor:

- inbox mode writes prompts into `.cursor/studio-inbox/`
- SDK mode runs a hidden worker with `CURSOR_AUTO_AGENT=true`
- progress is stored in ignored local run files

If you see SDK instability on Windows, set:

```env
CURSOR_AUTO_AGENT=false
```

The app will still queue prompts for Cursor.

## Media Providers

Supported:

- Pexels: stock video search
- ElevenLabs: voiceover and voice previews
- local manifests: videos, SFX, Lottie, brand assets
- optional placeholders for Pixabay and Freesound keys

Provider keys are optional. The app falls back to local assets when keys are missing.

## Rendering

Browser rendering starts a hidden local Remotion job:

- output folder: `out/studio-renders/`
- job metadata: `data/render-jobs/`
- download route: `/api/studio/renders/:id/download`

Both folders are ignored so large MP4s do not enter Git.

## SEO Keywords

AI video generator, Remotion studio, AI reel generator, open source video editor, React video editor, Cursor SDK app, local-first creative studio, AI content creation, prompt to video, vertical video generator, social media automation, ElevenLabs Remotion, Pexels video generator.

## Contributing

1. Fork the repo.
2. Create a feature branch.
3. Run `npm run lint` and `npm run build:studio`.
4. Open a pull request.

## License

MIT.

Built by Zamili Studio.
