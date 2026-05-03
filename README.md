# VoterNexus v2.0

> **An inclusive, AI-powered civic technology platform** that empowers every Indian citizen with accessible voting information, real-time fact-checking, and interactive civic tools — across 13 Indian languages.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://voternexus-om55-eyizhliu1-vinit-majethiyas-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Google Gemini](https://img.shields.io/badge/Gemini-AI-orange?style=for-the-badge&logo=google)](https://deepmind.google/technologies/gemini/)

🔗 **Live Deployment:** [voternexus-om55-eyizhliu1-vinit-majethiyas-projects.vercel.app](https://voternexus-om55-eyizhliu1-vinit-majethiyas-projects.vercel.app)

---

## Overview

VoterNexus is a **phase-aware civic platform** that adapts its UI and feature prominence based on where India currently is in the election calendar — from pre-election readiness tools to real-time Election Day utilities.

```
Phase Detection → UI Theme → Feature Prominence
─────────────────────────────────────────────────
Pre-Election  (>60 days) → Blue    → Readiness tools front
Campaign      (14–60d)   → Amber   → Affidavit Decoder + Misinfo Shield
Election Week (0–7d)     → Orange  → Booth Locator + EVM Sandbox
Election Day  (today)    → Green   → Live Queue + I Voted Badge
Post-Election            → Grey    → Archive + results links
```

---

## Features

| Feature | Description |
|---|---|
| 🗳️ **EVM/VVPAT Simulator** | Interactive, step-by-step simulation of the Indian voting machine with VVPAT slip animation |
| 📄 **Affidavit Decoder** | AI-powered (Gemini) extraction of candidate financial & criminal data from ECI affidavit PDFs |
| 🛡️ **Misinfo Shield** | Real-time election claim fact-checking with AI verdict + grounded web sources |
| 📍 **Booth Locator** | Google Maps–powered booth finder with accessibility filters and live queue status |
| ✅ **Eligibility Quiz** | Multi-step voter eligibility checker with ECI deep-links |
| 📋 **Document Checklist** | ECI-accepted voter ID checklist with session persistence |
| 🗓️ **Timeline Tracker** | Constituency-specific election milestone countdown |
| 🏅 **Voted Badge Generator** | Shareable "I Voted" badge via Fabric.js canvas — fully client-side |
| ♿ **Universal Accessibility Suite** | TTS, dyslexia fonts, high contrast, dwell-click, switch access, ISL video panel |
| 🌐 **13 Indian Languages** | Full UI localization: Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu |
| 📲 **PWA** | Installable Progressive Web App with offline service worker |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + Framer Motion |
| AI — Civic Tools | Google Generative AI (Gemini 1.5 Flash) |
| AI — Affidavit / Fact-check | Anthropic Claude Haiku |
| Cloud APIs | Google Cloud Text-to-Speech, Google Cloud Translate |
| Maps | Google Maps JS API Loader |
| PDF Parsing | pdf-parse + Tesseract.js (OCR fallback) |
| State Management | Zustand |
| Caching | Upstash Redis |
| i18n | next-intl |
| PWA | @ducanh2912/next-pwa |
| Testing | Vitest + @testing-library/react |

---

## Architecture

```
app/
├── [locale]/
│   ├── (marketing)/page.tsx     # Landing page
│   └── (app)/
│       ├── readiness/           # Eligibility quiz, document checklist, timeline
│       ├── learn/               # EVM simulator, affidavit decoder, misinfo shield
│       └── dday/                # Booth locator, queue reporter, voted badge
├── api/
│   ├── affidavit/               # PDF → AI extraction pipeline
│   ├── factcheck/               # Claim → AI verdict pipeline
│   ├── gemini/                  # Gemini-specific routes (compare, factcheck, vision)
│   ├── translate/               # Google Cloud Translate proxy (with Redis cache)
│   ├── tts/                     # Google Cloud TTS proxy
│   ├── queue/                   # Upstash Redis queue reporting
│   └── calendar/                # ical-generator calendar export
components/civic/                # All feature components
lib/                             # API clients, prompts, utilities
messages/                        # Translation files (13 locales)
```

---

## Getting Started

### Prerequisites
- Node.js 20 LTS
- npm 10+

### Installation

```bash
git clone https://github.com/VinitMajethiya/Voternexus.git
cd Voternexus
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
# Google AI
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT=your_google_cloud_project_id

# Anthropic Claude (for Affidavit Decoder & Misinfo Shield)
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Upstash Redis (for translation cache & queue reporting)
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token

# Google Maps (for Booth Locator)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Tests

```bash
npm test
```

### Production Build

```bash
npm run build
npm start
```

---

## Deployment

This project is deployed on **Vercel**. All API routes are served as Vercel Serverless Functions — no separate backend is required.

**To deploy your own instance:**
1. Fork this repository
2. Connect it to Vercel
3. Add your environment variables in the Vercel dashboard under *Project Settings → Environment Variables*
4. Deploy

---

## Core Principles

1. **Political Neutrality** — No political party names, colors, or symbols anywhere in the UI. Candidate data is always treated as raw, unedited facts.
2. **Privacy First** — No PII (voter IDs, names, location) is stored or logged. All sensitive data is session-scoped or processed server-side without persistence.
3. **Accessibility** — Every interactive component is keyboard-navigable and screen-reader compatible.

---

## License

MIT License. Open source and free forever.
