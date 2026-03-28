# VCS Quality Brief — Follow These Standards Exactly

> Paste this at the start of your VCS Claude Code session. This gives the AI the same quality context as the Digital Point LLC project.

## CRITICAL RULES

1. **DO NOT change the existing VCS design** — keep current colors, fonts, layout
2. **Only improve** — fix bugs, add missing features, polish what exists
3. **Keep the current design language** — just make it better

## Quality Standards (from Digital Point LLC — follow exactly)

### Performance (INP / Core Web Vitals)
- Replace ALL infinite framer-motion animations with CSS @keyframes
- Use `will-change: transform` on animated elements
- Throttle scroll handlers with `requestAnimationFrame` + `{ passive: true }`
- Convert sections that don't need interactivity to Server Components (remove 'use client')
- Wrap list items in `React.memo` (blog cards, metrics, FAQ items)
- Replace `AnimatePresence` accordions with CSS `grid-template-rows` transitions
- Replace `whileHover`/`whileTap` with CSS `hover:scale-[1.02] active:scale-[0.98]`
- NO `transition-all` — use specific properties (`transition-shadow`, `transition-transform`)

### Responsiveness (every page, every component)
- Touch targets: minimum `min-w-[44px] min-h-[44px]` on all buttons/links
- Grids: always start `grid-cols-1` then `md:grid-cols-2 lg:grid-cols-3`
- CTAs: `w-full sm:w-auto` (full-width on mobile, auto on desktop)
- Tables: wrap in `overflow-x-auto` with `min-w-[400px]`
- Text: use responsive sizes `text-2xl md:text-4xl`
- Padding: `px-4 md:px-8`
- Footer links: `flex-wrap gap-y-2`
- TOC/Sidebar: collapsible on mobile, visible on desktop
- Test every page at 375px, 768px, 1280px widths

### SEO (Google AdSense ready)
- Every page needs: `title`, `description`, `openGraph`, `twitter` metadata
- Blog posts need: `BlogPosting` JSON-LD schema with author, datePublished, publisher
- Organization JSON-LD in root layout
- FAQ Schema on pages with FAQs
- Sitemap with all pages + priority levels
- robots.ts via Next.js metadata API
- Canonical URLs on all pages
- Internal linking between related content
- ads.txt in public folder
- IndexNow for instant indexing

### Content Quality (pass AI detection)
- USE contractions everywhere: "don't", "isn't", "you're", "it's", "we've"
- NEVER use: "delve", "robust", "crucial", "pivotal", "harness", "game-changer", "cutting-edge", "seamless"
- Vary sentence structure — no two paragraphs should start the same way
- Add personality and opinions — "Here's the thing:", "Honestly,", "Look,"
- Use specific numbers instead of vague claims
- Every blog post needs unique opening sentence
- Author bios should feel personal, not corporate

### E-E-A-T Signals
- Named authors with bios, expertise tags, LinkedIn links
- Author box at end of every blog post
- About page with founder story, timeline, milestones
- Case studies with real metrics (ROAS, CAC, revenue)
- "Behind the scenes" notes on case studies
- Company credentials displayed prominently

### Required Pages
- Privacy Policy (GDPR, cookies, AdSense)
- Terms of Service (liability, IP, governing law)
- Contact page (form + email + phone, warm copy)
- About page (founder story, team, milestones)
- Cookie consent banner (Accept/Decline, localStorage)
- Case studies page
- Blog with 50+ posts minimum for AdSense

### Blog System
- Markdown files in `src/content/blog/`
- Frontmatter: title, excerpt, category, tags, date, author, featured, faqs
- Auto-generated TOC from headings
- Author box with individual bios
- Related posts section
- Mid-article CTA
- End-of-article lead magnet banner
- Category pages
- Reading time calculated from word count
- Dates spread across 6+ months (not all same date)

### Forms & API Routes
- Rate limiting on all API routes
- Input sanitization (XSS prevention)
- Email notifications (to admin + welcome email to user)
- Try/catch around database operations (graceful fallback)
- Zod validation on inputs
- CSRF protection

### Navigation
- Full-width navbar with logo left, nav pills center, CTA right
- Mobile hamburger menu with proper touch targets
- Active page indicator
- All pages linked in nav

### Footer
- Company info, service links, legal links
- Privacy Policy + Terms of Service links
- Personal tagline/mission statement
- Social media links

### Deployment
- Vercel auto-deploy from GitHub main branch
- `prisma generate` with inline DATABASE_URL in build script if using Prisma
- Dynamic import for Prisma client (lazy loading, no build crash)
- Push to correct GitHub repo that Vercel is connected to
