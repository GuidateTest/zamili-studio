# Landing Page Implementation

This project includes a production landing page inspired by enterprise video tooling sites like [Remotion](https://www.remotion.dev/): a strong hero, premium motion, clear developer CTAs, and documentation-first positioning.

## Public Links

- GitHub repository: `https://github.com/GuidateTest/zamili-studio`
- GitHub Pages URL after deployment: `https://guidatetest.github.io/zamili-studio/`
- GitHub Pages Studio route: `https://guidatetest.github.io/zamili-studio/?app=studio`
- Local landing page: `http://localhost:3000/`
- Local Studio app: `http://localhost:3000/studio`

## What Was Built

- React landing page at `/`
- Existing Studio app preserved at `/studio`
- Responsive enterprise-grade layout with glass panels, gradients, proof badges, and animated sections
- Three Remotion-generated `.webm` loops used in the page:
  - `public/landing/hero-loop.webm`
  - `public/landing/workflow-loop.webm`
  - `public/landing/render-loop.webm`
- SEO metadata in `index.html`
- GitHub Pages compatible build command

## Tools Used

- React 19 for the page UI
- Vite 6 for development/build output
- Framer Motion for scroll and hero animations
- Remotion 4 for generating WebM motion assets
- Lucide React for icons
- TypeScript for typed source
- GitHub Pages for static deployment

## Important Files

```text
src/landing/LandingPage.tsx        Landing page sections and copy
src/landing/landing.css            Enterprise visual design system
src/landing/LandingAnimations.tsx  Remotion animation source
src/studio/main.tsx                Routes / to landing and /studio to app
src/engine/ProjectComposer.tsx     Registers landing animation compositions
public/landing/*.webm              Rendered landing animation loops
index.html                         SEO, social, favicon metadata
```

## Commands

```bash
npm install
npm run dev
npm run render:landing
npm run build:studio
npm run build:pages
npm run deploy:check
```

## Deployment

For local production build:

```bash
npm run build:studio
```

For GitHub Pages build:

```bash
npm run build:pages
```

The GitHub Pages build uses:

```bash
vite build --base=/zamili-studio/
```

This ensures public assets resolve correctly under:

```text
https://guidatetest.github.io/zamili-studio/
```

## Regenerating WebM Assets

The landing videos are generated from code, not hand-edited media:

```bash
npm run render:landing
```

Individual renders:

```bash
npm run render:landing:hero
npm run render:landing:workflow
npm run render:landing:render
```

## Privacy

Only the generic landing motion assets in `public/landing/*.webm` are tracked. Private user reels, local render outputs, databases, runtime prompt files, generated audio, and downloaded media remain ignored.
