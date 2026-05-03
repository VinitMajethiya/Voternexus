# VoterNexus: The Interactive Election Companion
## Product Requirements Document (PRD)

**Version:** 1.0.0  
**Status:** Draft — Engineering Ready  
**Author:** Product & Civic Tech Team  
**Last Updated:** April 22, 2026  
**Classification:** Public / Open Source

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Goals](#2-product-vision--goals)
3. [Monetization & Sustainability Model](#3-monetization--sustainability-model)
4. [User Personas](#4-user-personas)
5. [Feature Set — The 3-Phase Journey](#5-feature-set--the-3-phase-journey)
   - [Phase 1: Readiness & Onboarding](#phase-1-readiness--onboarding)
   - [Phase 2: Education & Simulation](#phase-2-education--simulation)
   - [Phase 3: D-Day & Beyond](#phase-3-d-day--beyond)
   - [Bonus: Misinformation Shield](#bonus-feature-misinformation-shield)
6. [UX / Design Philosophy](#6-ux--design-philosophy)
7. [Technical Architecture](#7-technical-architecture)
8. [Security & Privacy](#8-security--privacy)
9. [Accessibility Requirements](#9-accessibility-requirements)
10. [Roadmap](#10-roadmap)
11. [Success Metrics & KPIs](#11-success-metrics--kpis)
12. [Open Questions & Risks](#12-open-questions--risks)
13. [Appendix](#13-appendix)

---

## 1. Executive Summary

VoterNexus is a **100% free, open-source, civic-tech web application** that transforms the intimidating complexity of Indian electoral participation into an interactive, personalized, and joyful experience. It is not a static information portal — it is a **living UI** that dynamically shifts its interface across three distinct phases of the election cycle: **Readiness**, **Education**, and **D-Day Utility**.

The platform addresses three root causes of voter disengagement:

| Root Cause | VoterNexus Solution |
|---|---|
| "I don't know if I'm even registered." | Interactive Eligibility Quiz + Document Checklist |
| "I don't understand how EVM/VVPAT works." | Gamified Voting Sandbox Simulator |
| "I can't tell fact from fake news." | AI-powered Misinformation Shield |
| "I don't know where my booth is." | Live Booth Locator with Maps Integration |
| "Candidate affidavits are 80 pages long." | AI Affidavit Decoder → Bento Summary Cards |

**Target geography:** India (Election Commission of India data), with an architecture that supports future expansion to other democratic systems.

---

## 2. Product Vision & Goals

### 2.1 Mission Statement

> *"Bridge the gap between legal complexity and voter action — making every eligible citizen feel informed, prepared, and empowered on election day."*

### 2.2 Strategic Goals

| # | Goal | Measurable Outcome |
|---|---|---|
| G1 | Increase first-time voter readiness | 70%+ quiz completion among 18–22 age group |
| G2 | Improve voting machine familiarity | 80%+ EVM Sandbox session completion |
| G3 | Reduce misinformation spread | 50,000+ fact-check queries in first election cycle |
| G4 | Boost civic participation | Measurable via "I Voted" badge social shares |
| G5 | Be universally accessible | WCAG 2.1 AA compliance, 3+ regional languages at launch |

### 2.3 Non-Goals (v1.0)

- VoterNexus does **not** collect or store PII beyond session-scoped location for booth search.
- VoterNexus does **not** recommend or campaign for any political party or candidate.
- VoterNexus does **not** replace official Election Commission of India (ECI) portals; it supplements them.
- VoterNexus does **not** offer a native mobile app in v1.0 (PWA-first approach instead).

---

## 3. Monetization & Sustainability Model

VoterNexus operates on a **zero-cost, public-service model**. There are no ads, no paywalls, no freemium tiers.

### 3.1 Funding Strategy

| Stream | Description | Priority |
|---|---|---|
| **Open Source / GitHub Sponsors** | Community and corporate sponsors via GitHub | Primary |
| **Government / ECI Grants** | Digital India, Election Commission CSR funds | Primary |
| **Foundation Grants** | Mozilla Foundation, Knight Foundation, Open Society | Secondary |
| **NGO Partnerships** | CSDS, ADR (Association for Democratic Reforms) | Secondary |
| **University Research Grants** | Tied to civic-tech research programs | Tertiary |

### 3.2 License

All source code is released under the **MIT License**. Data from ECI is used under public-domain access provisions. AI model usage (for Affidavit Decoder and Misinformation Shield) is powered by open-weight models self-hosted or via free API tiers.

---

## 4. User Personas

### Persona 1 — "Aisha, the First-Timer" 🎓

| Attribute | Detail |
|---|---|
| Age | 18 years old |
| Background | Engineering student, Pune |
| Tech Comfort | High (uses Instagram, YouTube daily) |
| Pain Points | "I just turned 18. I don't know if I'm registered. I've never seen an EVM before. My college friends share a lot of election memes — I can't tell what's real." |
| Needs | Simple eligibility check, EVM practice, fact-checking tool, shareable badge |
| Accessibility | Standard — needs mobile-first UI |

---

### Persona 2 — "Ramaiah, the Senior Citizen" 🧓

| Attribute | Detail |
|---|---|
| Age | 68 years old |
| Background | Retired schoolteacher, Bengaluru |
| Tech Comfort | Low (uses WhatsApp, gets confused by small text) |
| Pain Points | "Someone told me my voter ID is no longer valid. I don't know which documents to carry. I can't read the small print on candidate affidavits." |
| Needs | High-contrast UI, large text, voice assistance, simplified document checklist |
| Accessibility | **Critical** — WCAG AA, font scaling, voice readout |

---

### Persona 3 — "Priya, the Concerned Activist" 📣

| Attribute | Detail |
|---|---|
| Age | 31 years old |
| Background | Journalist and community organizer, Delhi |
| Tech Comfort | Very High |
| Pain Points | "Misinformation spreads faster than facts. I need a tool I can trust and share with my community to debunk viral claims instantly." |
| Needs | Robust Misinformation Shield, shareable fact-check results, API access for embedding |
| Accessibility | Standard |

---

## 5. Feature Set — The 3-Phase Journey

> The application detects the **current election phase** (Pre-Election, Active Campaign, Election Day, or Post-Election) based on ECI API data and **dynamically re-skins the UI** — showing relevant tools front-and-center for each phase.

---

### Phase 1: Readiness & Onboarding

#### Feature 1.1 — Interactive Eligibility Quiz

**Description:** A guided 3-question conversational flow that confirms voter registration eligibility and links to the Voter Portal if action is needed.

**User Flow:**

```
START
  ↓
Q1: "Are you 18 years or older?" → [Yes / No]
  ↓ (Yes)
Q2: "Are you an Indian citizen?" → [Yes / No]
  ↓ (Yes)
Q3: "Have you registered on voters.eci.gov.in?" → [Yes / No / Not Sure]
  ↓
[Not Sure / No] → "Let's check!" → Redirect to ECI Voter Search with pre-filled state selector
[Yes] → "You're all set! 🎉" → Proceed to Document Checklist
```

**Acceptance Criteria:**

- [ ] Quiz completes in under 60 seconds
- [ ] "Not Sure" path deep-links directly to ECI's National Voter Services Portal (NVSP)
- [ ] Progress is stored in session (not persisted to server)
- [ ] Fully keyboard-navigable
- [ ] Readable by screen readers (ARIA labels on each question step)

---

#### Feature 1.2 — Document Checklist

**Description:** A visual, icon-rich checklist of valid photo ID documents accepted at polling booths, per ECI official guidelines.

**Accepted IDs to Display (as of 2024 ECI Guidelines):**

| # | Document | Icon |
|---|---|---|
| 1 | Voter ID Card (EPIC) | 🪪 |
| 2 | Aadhaar Card | 🪪 |
| 3 | Passport | 📘 |
| 4 | Driving License | 🚗 |
| 5 | PAN Card | 📋 |
| 6 | MNREGA Job Card | 📄 |
| 7 | Smart Card issued by RGI | 📱 |
| 8 | Bank / Post Office Passbook with Photo | 🏦 |
| 9 | Health Insurance Smart Card | 💊 |
| 10 | Pension Document with Photo | 📑 |
| 11 | NPR Smart Card | 🗂️ |
| 12 | Official identity document issued by a competent authority | 🏛️ |

**UI Spec:**

- Ghibli/friendly illustration style icons (custom SVG set)
- Each card is **checkable** — user can tick off what they have
- A "You're ready!" state triggers when at least 1 document is checked
- "Lost your ID?" CTA → triggers the **Triage Flow** (see Feature 1.3)

---

#### Feature 1.3 — Step-by-Step Triage Flow

**Description:** A branching-logic decision tree for voters facing last-minute problems (lost ID, wrong polling station, name not on list, etc.).

**Trigger Points:**

| Problem | Entry Point |
|---|---|
| "I lost my Voter ID" | Document Checklist → "Lost your ID?" button |
| "My name isn't on the voter list" | Quiz → "Not Sure" path |
| "I moved to a new address" | Timeline Tracker alert |
| "I'm disabled / need assistance" | Always-visible accessibility help icon |

**Sample Branch — "I lost my Voter ID":**

```
Step 1: Check if you have any of the 11 alternate documents → [See List]
Step 2: If none available → Apply for eEPIC (digital voter ID) at voters.eci.gov.in
Step 3: Download and print eEPIC → It is officially valid
Step 4: Still stuck? → Contact your ERO (Electoral Registration Officer)
         → [Find your ERO] button (uses constituency data)
```

**Acceptance Criteria:**

- [ ] Every branch terminates with either an actionable link or a contact resource
- [ ] Maximum depth of 5 steps per branch
- [ ] "Start Over" always visible
- [ ] Triage state shareable via URL fragment (for activists sharing with community members)

---

#### Feature 1.4 — Personalized Election Timeline Tracker

**Description:** A "Road to the Booth" progress bar/timeline component showing key dates personalized to the user's **constituency and state**, fetched from ECI data.

**Key Milestones Displayed:**

```
[Nomination Deadline] → [Withdrawal Deadline] → [Voter Registration Cutoff]
→ [Campaign Period End / Model Code of Conduct] → [Polling Day] → [Counting Day]
```

**Data Source:** ECI Schedule API (or scraped from official ECI press releases, stored in a managed JSON dataset updated by maintainers).

**UI Spec:**

- Horizontal scrolling timeline on mobile, full-width on desktop
- Past dates are **greyed out**
- Current phase is **highlighted with a pulsing indicator**
- Countdown timer for the next key milestone (e.g., "3 days until voter registration closes")
- State/constituency selector to personalize (no login required)

---

### Phase 2: Education & Simulation

#### Feature 2.1 — EVM & VVPAT Simulator ("The Voting Sandbox")

**Description:** A gamified, interactive replica of the Indian Electronic Voting Machine that allows first-time voters to practice the full voting flow before election day.

**Simulation Flow:**

```
1. Presiding Officer stamps your Voter Slip → [Click to Stamp]
2. Walk to the Ballot Unit → [Animated transition]
3. Select your candidate by pressing the blue button → [Click any candidate button]
4. Green light + "Beep" sound effect confirms vote registered
5. VVPAT panel opens (3-second window) → Paper slip shown with party symbol + serial number
6. VVPAT slip drops into sealed compartment → Slot closes
7. ✅ "Your vote has been cast successfully!"
```

**Technical Spec:**

- Built as an isolated React component
- Candidate names/party symbols in simulation are **fictional** (e.g., "Party A — Sun Symbol", "Party B — Moon Symbol") to avoid political bias
- Sound effects are optional and respect system audio preferences
- VVPAT animation uses CSS keyframes (no heavy libraries)
- Accessible: full keyboard simulation available; screen reader announces each step

**Gamification:**

- "First Vote" badge unlocked on completion
- Optional: "Vote Again" to try different choices and see the same outcome (reinforces that the process is private and verifiable)
- Share prompt: "I just practiced voting! Have you? 🗳️ #VoterNexus"

---

#### Feature 2.2 — AI Affidavit Decoder

**Description:** An LLM-powered feature that accepts a candidate's official affidavit PDF (from ECI/MyNeta) and transforms it into structured, readable "Bento Summary Cards."

**Input Methods:**

1. **URL Input** — Paste a MyNeta.info or ECI affidavit URL → system fetches and parses PDF
2. **File Upload** — Upload affidavit PDF directly (max 10 MB)
3. **Quick Search** — Search candidate name + constituency → system auto-fetches from MyNeta API

**Output Card Structure:**

Each decoded affidavit renders as a **Bento Grid** of 6 cards:

| Card | Content |
|---|---|
| 💰 **Assets** | Total declared assets (movable + immovable) in plain INR |
| 📉 **Liabilities** | Total declared liabilities |
| ⚖️ **Criminal Cases** | Number of pending cases, nature (IPC section plain-language), status |
| 🎓 **Education** | Highest qualification declared |
| 👔 **Profession** | Declared profession and prior employment |
| 📊 **Trend** | Change from previous election affidavit (if available) — "Assets ↑ 40%" |

**AI Prompt Contract (internal):**

```
System: You are a neutral civic information assistant. Given the following affidavit text,
extract ONLY factual data. Do not editorialize. Do not make political statements.
Output ONLY valid JSON matching the schema below. Do not hallucinate values —
if a field is absent in the document, return null.

Schema: { assets_inr, liabilities_inr, criminal_cases: [{section, description, status}],
          education, profession, source_url, confidence_score }
```

**Confidence Score Display:**

- High (>85%): Green indicator — "Parsed with high confidence"
- Medium (60–85%): Yellow — "Some fields may be approximate — verify at source"
- Low (<60%): Red — "PDF may be scanned/image-based — manual review recommended"

**Acceptance Criteria:**

- [ ] Processing time < 15 seconds for standard PDF
- [ ] Output always includes a "View Original" link to the official ECI/MyNeta source
- [ ] Disclaimer displayed: "This is an automated summary. Always verify with the official affidavit."
- [ ] No affidavit data stored server-side beyond the session

---

### Phase 3: D-Day & Beyond

#### Feature 3.1 — Live Booth Assistant

**Description:** Displays the user's assigned polling booth on a map with walking/driving directions and a community-sourced queue wait time indicator.

**Components:**

**3.1a — Booth Locator:**

- Input: Voter ID number OR auto-detect location (GPS)
- Data Source: ECI Booth Voter Search API (`electoralsearch.eci.gov.in`)
- Output: Booth name, address, and pinned location on embedded Google Maps / OpenStreetMap
- "Get Directions" deep-link to Google Maps / Apple Maps

**3.1b — Queue Time Estimator:**

- Community-reported wait times (anonymous submission: "Currently waiting — 10 mins / 30 mins / 60+ mins")
- Displayed as a **heat-indicator** badge on the booth pin (🟢 Short / 🟡 Moderate / 🔴 Long)
- Data decays automatically — reports older than 45 minutes are dropped
- No login required to submit; rate-limited by IP + browser fingerprint (no PII stored)

**3.1c — Accessibility Filter:**

- Filter booths by: ♿ Wheelchair accessible | 🚗 Vehicle access | 🏥 Medical assistance available
- Data sourced from ECI's published accessible booth list (updated each election cycle)

---

#### Feature 3.2 — Digital "I Voted" Badge

**Description:** A creative social sharing feature that generates a personalized, shareable "I Voted" card to encourage peer participation.

**User Flow:**

```
1. User clicks "Generate My Badge"
2. Selects a style: Classic / Retro / Glassmorphism / Watercolor
3. Optionally enters their first name (not stored)
4. Badge auto-generates as a 1080×1080 PNG (Instagram-ready)
5. One-tap share to: Instagram Stories / WhatsApp / Twitter-X / Download
```

**Badge Design Requirements:**

- All designs include the official "Voter" motif (Indelible Ink finger)
- ECI logo included with attribution
- Tagline options: "Mera Vote, Meri Awaaz" / "I Voted Today" / "Democracy in My Hands"
- **No party colors or symbols** on any design

**Technical Spec:**

- Generated client-side using HTML Canvas API (no server rendering)
- No image data uploaded to server

---

### Bonus Feature: Misinformation Shield

#### Feature 4.1 — AI Fact-Checker for Election Claims

**Description:** Users paste a viral claim (WhatsApp forward, tweet, news headline) and VoterNexus cross-references it against official ECI rules, the Representation of the People Act, and verified news sources to return a structured fact-check verdict.

**Input:** Free-text claim (max 500 characters)

**Processing Pipeline:**

```
[User Input]
    ↓
Preprocessing: Language detection → Translation to English (if needed)
    ↓
LLM Analysis: Extract claim type → Match against knowledge base
    ↓
Web Grounding: Search ECI official site + PIB + fact-check APIs (FactCheck.in, Boom Live)
    ↓
Verdict Generation
```

**Output Verdict Cards:**

| Verdict | Label | Color |
|---|---|---|
| Claim is accurate | ✅ TRUE | Green |
| Claim is partially accurate | ⚠️ PARTIALLY TRUE | Amber |
| Claim is false | ❌ FALSE | Red |
| Cannot be verified | 🔍 UNVERIFIED | Grey |
| Opinion, not a factual claim | 💬 OPINION | Blue |

**Each verdict includes:**

- Plain-language explanation (2–3 sentences)
- Official source link(s) cited
- Confidence level
- "Report this claim" button (feeds moderation queue)
- Shareable fact-check card (same Canvas-based generator as Badge feature)

**Acceptance Criteria:**

- [ ] Response in < 10 seconds
- [ ] Always cites at least one official government or verified press source
- [ ] Never makes political judgment — only factual assessment
- [ ] Disclaimer: "This is an AI-assisted check. Exercise independent judgment."
- [ ] Supports input in: English, Hindi, Marathi, Tamil, Telugu, Bengali, Kannada, Malayalam (Phase 1 languages)

---

## 6. UX / Design Philosophy

### 6.1 Visual Language

| Principle | Implementation |
|---|---|
| **Bento Grid Layouts** | Feature cards organized in asymmetric bento grids (inspired by Apple Keynote 2023 aesthetic) |
| **Gen Z Minimalism** | Clean white/dark surfaces, accent gradients, no decorative clutter |
| **Friendly Civic Tone** | Ghibli/Disney-inspired illustrated mascot ("Nexus") — a small animated ink-drop character that guides users |
| **Motion Design** | Subtle micro-animations on state changes (Framer Motion); no autoplay videos |
| **Dark Mode** | System-preference detected; manually toggleable |

### 6.2 Phase-Based UI Theming

| Election Phase | Primary Color Accent | Dominant Feature Shown |
|---|---|---|
| Pre-Election (>60 days) | Calm Blue | Readiness Quiz + Timeline |
| Active Campaign (14–60 days) | Warm Amber | Affidavit Decoder + Misinformation Shield |
| Election Week (0–7 days) | Energetic Orange-Red | Booth Locator + EVM Sandbox |
| Election Day | Bold Green | Live Queue Times + I Voted Badge |
| Post-Election | Neutral Grey | Results links + Civic education archive |

### 6.3 Component Library

- **Framework:** React + Tailwind CSS
- **Component Library:** Shadcn/ui as base, custom-themed
- **Icons:** Custom SVG set (civic-themed) + Lucide React for utility icons
- **Illustrations:** Custom Ghibli-inspired SVG character set (open-licensed)

---

## 7. Technical Architecture

### 7.1 Frontend Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14 (App Router) | SSR for SEO, ISR for election data pages |
| Language | TypeScript | Type safety for complex election data structures |
| Styling | Tailwind CSS + CSS Variables | Rapid development, design token support |
| State Management | Zustand | Lightweight, no boilerplate |
| Animation | Framer Motion | Smooth phase transitions and micro-interactions |
| PWA | next-pwa | Offline capability for booth locator and EVM Sandbox |
| Maps | Leaflet.js + OpenStreetMap | Open-source, no API cost |
| Canvas | Fabric.js | Badge and fact-check card generation |

### 7.2 Backend Stack

| Layer | Technology | Rationale |
|---|---|---|
| API Runtime | Next.js Route Handlers (Edge) | Serverless, low-latency |
| AI Gateway | Anthropic Claude API (claude-haiku for speed) | Affidavit Decoder + Misinformation Shield |
| PDF Parsing | pdf-parse + Tesseract.js (OCR fallback) | Handles scanned affidavit PDFs |
| Translation | LibreTranslate (self-hosted) | Open-source, no per-request cost |
| Cache | Upstash Redis | Queue time data + rate limiting |
| Hosting | Vercel (free tier) + Cloudflare CDN | Zero-cost, global edge |

### 7.3 External API Integration Strategy

| Data Need | Source | Access Method |
|---|---|---|
| Voter Registration Check | ECI NVSP Portal | Deep-link redirect (no API key needed) |
| Booth Location | ECI Elector Search | ECI public API (`electoralsearch.eci.gov.in`) |
| Candidate Affidavits | MyNeta.info (ADR) | Public data, programmatic PDF fetch |
| Election Schedule | ECI Press Releases | Maintainer-managed JSON dataset (versioned in repo) |
| Fact-Check Verification | PIB Fact Check, FactCheck.in | Web scraping / RSS feeds |
| Maps & Directions | OpenStreetMap + Nominatim | Free, no key required |

### 7.4 Architecture Diagram (Simplified)

```
                        ┌─────────────────────────────────┐
                        │        VoterNexus Frontend        │
                        │       (Next.js / Vercel Edge)     │
                        └────────────┬────────────────────┘
                                     │
               ┌─────────────────────┼──────────────────────┐
               │                     │                      │
    ┌──────────▼───────┐  ┌──────────▼──────────┐  ┌───────▼──────────┐
    │  ECI Data Layer  │  │  AI Processing Layer │  │  Community Layer │
    │                  │  │                      │  │                  │
    │ • Booth Search   │  │ • Affidavit Decoder  │  │ • Queue Reports  │
    │ • Schedule JSON  │  │ • Misinfo Shield     │  │ • Upstash Redis  │
    │ • MyNeta PDFs    │  │ • Translation        │  │ • Rate Limiting  │
    └──────────────────┘  └──────────────────────┘  └──────────────────┘
```

---

## 8. Security & Privacy

### 8.1 Data Handling Principles

| Principle | Implementation |
|---|---|
| **No PII Storage** | Zero server-side storage of names, voter IDs, or addresses |
| **Session-Scoped State** | All user progress stored in browser `sessionStorage` only |
| **Location Privacy** | GPS coordinates used only to find nearby booths — never logged or transmitted to server in identifiable form |
| **AI Input Sanitization** | All PDF content and user text inputs are sanitized before LLM submission; PII detected and redacted before processing |
| **No Tracking** | No Google Analytics, no Meta Pixel. Plausible.io (privacy-first, self-hosted) for aggregated analytics only |
| **Open Source Audit** | All AI prompts and data pipelines are public in the repository for community audit |

### 8.2 Queue Time Reporting — Anti-Abuse

- IP-based rate limiting: max 1 report per booth per 15 minutes per IP
- Browser fingerprint (non-identifying hash) secondary rate limit
- Outlier detection: reports that deviate >3σ from rolling average are flagged for moderation
- No user accounts required or created

### 8.3 Affidavit Processing Security

- PDFs fetched server-side (user never exposes their IP to third-party document servers)
- Fetched PDFs are processed in-memory and discarded — not stored on disk or in object storage
- LLM receives only extracted text, never the raw PDF bytes

---

## 9. Accessibility Requirements

VoterNexus targets **WCAG 2.1 Level AA** compliance at launch.

| Requirement | Specification |
|---|---|
| **Color Contrast** | Minimum 4.5:1 for normal text, 3:1 for large text |
| **Font Scaling** | All UI functional at 200% browser zoom; fluid typography using `clamp()` |
| **Keyboard Navigation** | All interactive elements reachable and operable via keyboard alone |
| **Screen Reader Support** | ARIA labels on all form elements, live regions for dynamic content updates (quiz steps, map updates) |
| **Focus Indicators** | Visible, high-contrast focus rings on all interactive elements |
| **Alt Text** | All informational images have descriptive alt text; decorative images are `aria-hidden` |
| **Motion** | All animations respect `prefers-reduced-motion` media query |
| **Language** | `lang` attribute set correctly; language switcher always accessible |

### 9.1 Multilingual Support (Phase 1)

| Language | Coverage |
|---|---|
| English | 100% |
| Hindi | 100% |
| Marathi | 100% |
| Tamil | 80% (EVM Sandbox + Checklist) |
| Telugu | 80% |
| Bengali | 80% |
| Kannada | 60% (core features) |
| Malayalam | 60% (core features) |

Translation managed via `i18next` with community-maintained translation JSON files. Contributors onboarded via the open-source repo.

---

## 10. Roadmap

### MVP — Phase 1 (Weeks 1–8): Core Readiness Tools

| Week | Deliverable | Owner |
|---|---|---|
| 1–2 | Project scaffolding (Next.js, Tailwind, CI/CD on Vercel) | Engineering |
| 2–3 | Eligibility Quiz + Document Checklist | Frontend |
| 3–4 | Election Timeline Tracker (static JSON data) | Frontend + Content |
| 4–5 | EVM & VVPAT Simulator | Frontend (React) |
| 5–6 | Triage Flow (branching logic) | Frontend |
| 6–7 | WCAG 2.1 audit + fixes | QA |
| 7–8 | Hindi + Marathi translations | Content |
| **8** | **🚀 MVP Launch** | All |

---

### Phase 2 (Weeks 9–16): AI Features

| Week | Deliverable | Owner |
|---|---|---|
| 9–11 | AI Affidavit Decoder (PDF → Bento Cards) | AI + Backend |
| 11–13 | Misinformation Shield (Fact-Checker) | AI + Backend |
| 13–14 | Booth Locator (OpenStreetMap + ECI data) | Frontend + Backend |
| 14–15 | Queue Time Reporting system | Backend |
| 15–16 | "I Voted" Badge generator | Frontend |
| **16** | **🚀 Full Feature Launch** | All |

---

### Phase 3 (Post-Launch): Scale & Expand

- Tamil, Telugu, Bengali language packs
- API endpoints for NGO/journalist embedding
- Native PWA offline-first experience
- ECI partnership for official data integration
- Expand to other South Asian democracies (Bangladesh, Nepal, Sri Lanka)

---

## 11. Success Metrics & KPIs

### 11.1 Literacy & Engagement KPIs

| KPI | Target (1st Election Cycle) | Measurement Method |
|---|---|---|
| EVM Sandbox completion rate | ≥ 80% of sessions that start | Session analytics (Plausible) |
| Eligibility Quiz completion rate | ≥ 90% | Funnel analysis |
| Affidavit Decoder queries | 10,000+ | Server request logs |
| Misinformation Shield queries | 50,000+ | Server request logs |
| "I Voted" badges generated | 100,000+ | Canvas generation events |
| Bounce rate | < 35% | Plausible |

### 11.2 Accessibility & Inclusion KPIs

| KPI | Target | Measurement Method |
|---|---|---|
| Mobile traffic share | ≥ 70% | Plausible |
| Non-English session share | ≥ 40% | Language detection in i18n |
| Accessibility audit score | WCAG 2.1 AA | Quarterly axe-core audit |

### 11.3 Trust & Accuracy KPIs

| KPI | Target | Measurement Method |
|---|---|---|
| Misinformation Shield accuracy | ≥ 85% confirmed correct | Community flagging + editor review |
| Affidavit Decoder confidence score average | ≥ 80% | Model output logging |
| Zero data breach incidents | 100% | Security audit logs |

---

## 12. Open Questions & Risks

| # | Risk | Severity | Mitigation |
|---|---|---|---|
| R1 | ECI API downtime on election day | High | Cache booth data 48 hours prior; fallback to static district-level data |
| R2 | LLM hallucination in Affidavit Decoder | High | Confidence scoring + mandatory "Verify at source" CTA; community flagging |
| R3 | Misuse of Misinformation Shield to legitimize false claims | Medium | Rate limiting; always cite sources; human moderation queue |
| R4 | Affidavit PDFs are scanned images (not text-extractable) | Medium | Tesseract.js OCR fallback; confidence score drops to warn user |
| R5 | Scalability on election day (traffic spike) | Medium | Vercel Edge + Cloudflare CDN; incremental static regeneration for booth pages |
| R6 | Political pressure / content disputes | Low | All AI prompts are open-source; no editorial team; purely factual output with citations |
| R7 | Map data inaccuracy for booth locations | Low | ECI is authoritative source; "Report incorrect booth" button feeds correction queue |

---

## 13. Appendix

### A. Glossary

| Term | Definition |
|---|---|
| ECI | Election Commission of India |
| EVM | Electronic Voting Machine |
| VVPAT | Voter Verifiable Paper Audit Trail |
| EPIC | Elector Photo Identity Card (Voter ID) |
| NVSP | National Voter Services Portal |
| ERO | Electoral Registration Officer |
| MyNeta | Public platform by ADR listing candidate affidavits |
| ADR | Association for Democratic Reforms |
| eEPIC | Digital (downloadable) version of the Voter ID card |
| MCC | Model Code of Conduct (election campaign rules) |

---

### B. Key External Links

| Resource | URL |
|---|---|
| ECI Official Portal | https://www.eci.gov.in |
| Voter Registration (NVSP) | https://voters.eci.gov.in |
| Booth Voter Search | https://electoralsearch.eci.gov.in |
| Candidate Affidavits (MyNeta) | https://www.myneta.info |
| PIB Fact Check | https://factcheck.pib.gov.in |
| eEPIC Download | https://www.nvsp.in |

---

### C. Design System Tokens (Preliminary)

```css
/* Color Tokens */
--color-primary:       #1A56DB;   /* Civic Blue */
--color-accent:        #FF6B2C;   /* Election Orange */
--color-success:       #18A96F;   /* Verified Green */
--color-warning:       #F59E0B;   /* Caution Amber */
--color-danger:        #EF4444;   /* Alert Red */
--color-surface:       #FFFFFF;
--color-surface-dark:  #0F172A;
--color-muted:         #64748B;

/* Typography */
--font-display:        'Plus Jakarta Sans', sans-serif;
--font-body:           'Inter', sans-serif;
--font-mono:           'JetBrains Mono', monospace;

/* Spacing Scale (4px base) */
--space-1: 4px;  --space-2: 8px;  --space-4: 16px;
--space-6: 24px; --space-8: 32px; --space-12: 48px;
--space-16: 64px;

/* Border Radius */
--radius-sm: 8px;   --radius-md: 16px;
--radius-lg: 24px;  --radius-full: 9999px;
```

---

### D. Contribution Guide (Summary)

VoterNexus is open-source and welcomes contributions in four areas:

1. **Code** — Feature development, bug fixes, accessibility improvements
2. **Content** — Fact-checking the Misinformation Shield knowledge base, updating election schedules
3. **Translation** — Adding or improving regional language packs
4. **Design** — Improving illustrations, UI components, and the mascot character set

All contributors must adhere to the **Civic Tech Code of Conduct**: no partisan content, no undisclosed sponsorships, factual accuracy above all.

---

*VoterNexus PRD v1.0 — For internal engineering and design use.*  
*This document is versioned in the project repository and updated each election cycle.*  
*Questions? Open a GitHub Discussion in the VoterNexus repo.*
