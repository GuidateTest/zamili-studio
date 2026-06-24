import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Braces,
  Check,
  Download,
  Film,
  Github,
  Layers3,
  Lock,
  Play,
  Rocket,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import "./landing.css";

const base = import.meta.env.BASE_URL;
const asset = (path: string) => `${base}${path.replace(/^\//, "")}`;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
} as const;

const capabilities = [
  {
    icon: <Bot size={22} />,
    title: "Agent-built video projects",
    text: "Send a creative brief to Cursor Agent and keep the Studio preview synced with project settings.",
  },
  {
    icon: <Film size={22} />,
    title: "Live Remotion preview",
    text: "Preview vertical reels in-browser with scene timing, captions, motion, audio, and render metadata.",
  },
  {
    icon: <Download size={22} />,
    title: "Render and download",
    text: "Queue local Remotion renders, track progress, and download finished MP4 exports from the app.",
  },
  {
    icon: <Lock size={22} />,
    title: "Local-first privacy",
    text: "Projects, render jobs, run logs, and credentials stay local by default and are ignored from Git.",
  },
];

const workflow = [
  "Write the reel prompt",
  "Agent prepares project data",
  "Preview timeline updates",
  "Render MP4 and ship",
];

const stack = [
  "React 19",
  "Vite 6",
  "Remotion 4",
  "Framer Motion",
  "SQLite",
  "Cursor SDK",
  "ElevenLabs",
  "Pexels",
];

export const LandingPage: React.FC = () => {
  return (
    <main className="landing-shell">
      <div className="landing-bg" />
      <nav className="landing-nav">
        <a className="brand" href={base}>
          <img src={asset("logo.png")} alt="Zamili Studio" />
          <span>Zamili Studio</span>
        </a>
        <div className="nav-links">
          <a href="#workflow">Workflow</a>
          <a href="#platform">Platform</a>
          <a href="#docs">Docs</a>
          <a className="nav-pill" href="https://github.com/GuidateTest/zamili-studio">
            <Github size={16} />
            GitHub
          </a>
        </div>
      </nav>

      <section className="hero-section">
        <motion.div className="hero-copy" {...fadeUp}>
          <div className="eyebrow">
            <Sparkles size={16} />
            AI video studio for builders
          </div>
          <h1>Programmatic content creation, wrapped in a premium studio.</h1>
          <p>
            Zamili Studio turns prompts into editable reels with a local-first
            workflow for previewing, rendering, and shipping video assets.
          </p>
          <div className="hero-actions">
            <a className="primary-cta" href={`${base}studio`}>
              Open Studio
              <ArrowRight size={18} />
            </a>
            <a className="secondary-cta" href="https://github.com/GuidateTest/zamili-studio">
              <Github size={18} />
              Pull the code
            </a>
          </div>
          <div className="hero-proof">
            <span>React UI</span>
            <span>Remotion rendering</span>
            <span>Cursor Agent bridge</span>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.96, y: 28 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <video
            src={asset("landing/hero-loop.webm")}
            autoPlay
            muted
            loop
            playsInline
            poster={asset("logo.png")}
          />
          <div className="floating-card top">
            <Play size={16} />
            Live preview ready
          </div>
          <div className="floating-card bottom">
            <Zap size={16} />
            Render queue: 82%
          </div>
        </motion.div>
      </section>

      <section className="logos-row" aria-label="Platform highlights">
        {stack.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </section>

      <section id="workflow" className="split-section">
        <motion.div className="section-copy" {...fadeUp}>
          <div className="section-kicker">
            <Workflow size={16} />
            Workflow
          </div>
          <h2>From prompt to export without leaving the browser.</h2>
          <p>
            The Studio keeps the creative loop tight: write a brief, let the
            agent prepare the project, preview it with Remotion Player, then
            render downloadable output locally.
          </p>
          <div className="workflow-list">
            {workflow.map((step, index) => (
              <div key={step}>
                <span>{index + 1}</span>
                {step}
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div className="media-panel" {...fadeUp}>
          <video src={asset("landing/workflow-loop.webm")} autoPlay muted loop playsInline />
        </motion.div>
      </section>

      <section id="platform" className="capabilities-section">
        <motion.div className="section-heading" {...fadeUp}>
          <div className="section-kicker">
            <Layers3 size={16} />
            Platform
          </div>
          <h2>Everything needed for a developer-ready AI content studio.</h2>
        </motion.div>
        <div className="capability-grid">
          {capabilities.map((item) => (
            <motion.article key={item.title} className="capability-card" {...fadeUp}>
              <div className="card-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="render-section">
        <motion.div className="media-panel render-panel" {...fadeUp}>
          <video src={asset("landing/render-loop.webm")} autoPlay muted loop playsInline />
        </motion.div>
        <motion.div className="section-copy" {...fadeUp}>
          <div className="section-kicker">
            <Rocket size={16} />
            Deployable
          </div>
          <h2>A landing page that sells the platform and points developers to code.</h2>
          <p>
            The public page is static, fast, and production-friendly. It links
            to the GitHub repo, documents the stack, and keeps the local Studio
            available under <code>/studio</code>.
          </p>
          <ul className="check-list">
            <li>
              <Check size={17} />
              GitHub Pages compatible Vite build
            </li>
            <li>
              <Check size={17} />
              WebM loops generated from Remotion compositions
            </li>
            <li>
              <Check size={17} />
              Private runtime data remains ignored
            </li>
          </ul>
        </motion.div>
      </section>

      <section id="docs" className="docs-section">
        <motion.div className="docs-card" {...fadeUp}>
          <div className="section-kicker">
            <Braces size={16} />
            Pull, run, extend
          </div>
          <h2>Built for developers to clone and customize.</h2>
          <p>
            The repository includes the React landing page, Studio app, local
            API layer, Remotion animation source, generated WebM assets, and
            documentation for deployment.
          </p>
          <div className="code-block">
            <span>git clone https://github.com/GuidateTest/zamili-studio.git</span>
            <span>cd zamili-studio</span>
            <span>npm install && npm run dev</span>
          </div>
          <div className="hero-actions centered">
            <a className="primary-cta" href="https://github.com/GuidateTest/zamili-studio">
              View GitHub repo
              <ArrowRight size={18} />
            </a>
            <a className="secondary-cta" href={`${base}studio`}>
              Open Studio app
            </a>
          </div>
        </motion.div>
      </section>

      <footer className="landing-footer">
        <span>Zamili Studio</span>
        <span>AI content creation platform built with React and Remotion.</span>
      </footer>
    </main>
  );
};
