# AI Chatbot & Lead Qualification System — Build Prompt

> Paste this into your Claude Code session to build a complete AI chatbot with multi-agent routing, lead qualification, FAQ fallback, and support ticket system.

---

## SYSTEM OVERVIEW

Build "Vico" (Your Virtual Companion) — an AI-powered customer support chatbot with:
- Multi-agent intent routing (5 agents)
- Passive lead scoring during conversation
- FAQ fallback when AI is unavailable
- Support ticket creation
- Streaming responses
- Session memory with 1-hour TTL

## TECH STACK

- **AI SDK v6** (`ai` + `@ai-sdk/react`)
- **Groq** (`@ai-sdk/groq`) — primary LLM provider (llama-3.3-70b-versatile)
- **Next.js App Router** — API routes
- **Prisma** — database (ChatMessage, ChatLead, SupportTicket models)
- **Nodemailer** — email notifications
- **Framer Motion** — chat UI animations

## INSTALL DEPENDENCIES

```bash
npm install ai @ai-sdk/react @ai-sdk/groq
```

## ENV VARIABLES NEEDED

```
GROQ_API_KEY=your_groq_api_key
CHAT_MODEL=llama-3.3-70b-versatile
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com
DATABASE_URL=file:./dev.db
```

---

## FILE STRUCTURE — Create These Files

```
src/
├── lib/
│   ├── ai-chatbot/
│   │   ├── agents/index.ts      # Intent classification + 5 agent configs
│   │   ├── orchestrator.ts      # Main AI handler (classify → score → route → stream)
│   │   ├── memory.ts            # In-memory session management
│   │   ├── faq.ts               # FAQ fallback matching
│   │   └── knowledge.ts         # Company knowledge base + bot personality
│   ├── db.ts                    # Lazy Prisma client (serverless-safe)
│   └── email.ts                 # SMTP email with retry logic
├── app/
│   └── api/
│       ├── chat/route.ts        # Main chat endpoint (streaming)
│       └── ticket/route.ts      # Support ticket creation
├── components/
│   └── ui/
│       └── SupportChatbot.tsx   # Full chat UI component
└── prisma/
    └── schema.prisma            # DB models
```

---

## ARCHITECTURE DETAILS

### 1. Intent Classification (agents/index.ts)

Create 8 intent types:
```typescript
type Intent =
  | 'greeting'           // Hello, hi, hey
  | 'service_question'   // What services do you offer?
  | 'pricing_question'   // How much does it cost?
  | 'process_question'   // How do you work?
  | 'lead_signal'        // I need help with X, my budget is Y
  | 'contact_request'    // I want to talk to someone
  | 'ticket_request'     // I have a problem, create ticket
  | 'general_chat'       // Everything else
```

Create 5 agent types, each with unique system prompt:
```typescript
type AgentType = 'conversation' | 'knowledge' | 'lead_qualification' | 'lead_capture' | 'routing'
```

**Agent selection logic:**
- `ticket_request` → routing agent
- `contact_request` AND has email → lead_capture
- `contact_request` → routing
- `lead_signal` AND score > 40 → lead_capture
- `lead_signal` → lead_qualification
- `pricing_question` / `service_question` / `process_question` → knowledge
- Default → conversation

**Intent classification prompt (fast, non-streaming):**
```
Classify this message into one intent. Reply with ONLY the intent word.
Intents: greeting, service_question, pricing_question, process_question,
lead_signal, contact_request, ticket_request, general_chat

Rules:
- Budget/spend mentions = lead_signal
- "how much" / "pricing" = pricing_question
- Wanting to talk/call/meet = contact_request
- Bug/issue/problem reports = ticket_request
```

### 2. Agent System Prompts

Each agent gets a unique personality and goal:

**Conversation Agent** (temp: 0.7, maxTokens: 300)
- Friendly, approachable
- Steer toward understanding their needs
- Ask open questions about their business

**Knowledge Agent** (temp: 0.3, maxTokens: 400)
- Answer ONLY from knowledge base
- Be precise, use bullet points
- If you don't know, say so

**Lead Qualification Agent** (temp: 0.5, maxTokens: 250)
- Ask qualifying questions naturally
- Uncover: budget, timeline, team size, current challenges
- Don't be salesy — be genuinely curious

**Lead Capture Agent** (temp: 0.4, maxTokens: 200)
- Collect name, email, company
- Offer free consultation/audit as incentive
- Be warm, not pushy

**Routing Agent** (temp: 0.3, maxTokens: 200)
- Direct to appropriate resources
- Offer ticket creation for issues
- Provide contact info for urgent matters

### 3. Orchestrator Flow (orchestrator.ts)

```
User Message →
  1. classifyIntent() — fast Groq call, extract single word
  2. scoreLead() — regex pattern matching on message
  3. extractContactInfo() — regex for email, name patterns
  4. selectAgent() — based on intent + score + contact info
  5. getAgentConfig() — get system prompt + settings
  6. streamText() — Groq streaming with selected agent
  7. storeInMemory() — save to session via onFinish callback
```

**Lead Scoring Signals (add to cumulative score):**
```
Budget/spend mention      → +15
Dollar amounts ($)        → +20
Timeline/deadline         → +10
Marketing metrics         → +15
Pain points/challenges    → +10
Business type mention     → +5
Growth intent             → +10
Proposal/quote request    → +20
Currently running ads     → +15
```

### 4. Session Memory (memory.ts)

```typescript
interface ConversationSession {
  messages: { role: string; content: string }[]  // Last 20 messages
  leadData: { name?: string; email?: string; company?: string; phone?: string; interest?: string }
  currentAgent: AgentType
  qualityScore: number  // 0-100
  lastActivity: number  // timestamp
}
```

- Store in global Map (survives hot reloads)
- 1-hour TTL, cleanup on access
- Max 20 messages per session (sliding window)
- Session ID from client (sessionStorage)

### 5. FAQ Fallback (faq.ts)

When AI is unavailable (no GROQ_API_KEY), use keyword matching:

```typescript
interface FAQ {
  keywords: string[]
  response: string
}
```

**Matching algorithm:**
- Score each FAQ by keyword overlap with user input
- Multi-word keywords score higher (2x)
- Return highest scoring FAQ
- If no match, return generic fallback directing to email/ticket

**Include FAQs for:**
- Services offered
- Pricing/free audit
- Team/founders info
- Contact information
- Process/onboarding
- Results/case studies
- Greetings/thanks
- Support ticket creation

### 6. Knowledge Base (knowledge.ts)

Export two constants:

**COMPANY_KNOWLEDGE** — All factual info:
- Company overview (1 paragraph)
- Services list with descriptions
- Process steps
- Pricing philosophy
- Free audit/consultation details
- Contact info (email, phone, social)
- Founder bios
- Key results/metrics

**COSMO_PERSONALITY** — Bot voice guidelines:
- Professional but approachable
- Use contractions ("don't", "we're")
- Concise responses (2-4 sentences)
- Use markdown formatting (bold, bullets)
- Never mention competitors
- Never make guarantees
- Always offer next step (audit, call, ticket)

### 7. Chat API Route (api/chat/route.ts)

```typescript
export const maxDuration = 30;

export async function POST(request: NextRequest) {
  // Rate limit: 30 messages per 60 seconds per IP
  // Validate message format (string or parts array)
  // If AI disabled → matchFAQ() fallback
  // If AI enabled → handleMessage() from orchestrator
  // Return streaming response via toUIMessageStreamResponse()
}
```

### 8. Ticket API Route (api/ticket/route.ts)

```typescript
export async function POST(request: NextRequest) {
  // Rate limit: 5 per hour per IP
  // Validate: name, email, subject, message required
  // Sanitize all inputs (XSS prevention)
  // Save to DB (try/catch for serverless)
  // Send email notification (priority-based routing)
  // Return ticket ID
}
```

### 9. Chat UI Component (SupportChatbot.tsx)

Build a floating chatbot with:

**Visual Elements:**
- Floating robot/avatar button (bottom-right, fixed position)
- Pulsing glow effect on button
- Tooltip beacon for first-time visitors
- Chat window with dark theme
- Header with bot name + status indicator
- Message bubbles (user = right/purple, bot = left/dark)
- Typing indicator (3 animated dots)
- Quick action buttons in initial greeting
- Input field with send button
- Toggle between chat and ticket form

**Dual Mode:**
```typescript
// AI mode
const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({ api: '/api/chat' }),
  body: { sessionId }
});

// Fallback mode (no AI)
const handleFallback = async (input) => {
  const response = matchFAQ(input);
  // Simulate typing delay
  // Add to local messages
};
```

**Ticket Form Fields:**
- Name (required)
- Email (required)
- Subject (required)
- Message (required)
- Priority: Normal / High (radio buttons)

**Smart Triggers:**
- Detect "create ticket" / "open ticket" in messages → auto-open ticket form
- Detect email in messages → extract and store
- Detect name patterns → extract and store

**Session Persistence:**
- sessionId stored in sessionStorage
- Survives page refreshes within same tab
- New session on new tab

### 10. Prisma Schema Models

```prisma
model ChatMessage {
  id        String   @id @default(cuid())
  sessionId String
  role      String   // "user" | "assistant"
  content   String
  intent    String?
  createdAt DateTime @default(now())
  @@index([sessionId])
  @@index([createdAt])
}

model ChatLead {
  id                  String   @id @default(cuid())
  sessionId           String   @unique
  name                String?
  email               String?
  company             String?
  phone               String?
  interest            String?
  qualityScore        Int      @default(0)
  status              String   @default("new")
  conversationSummary String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  @@index([email])
  @@index([status])
  @@index([createdAt])
}

model SupportTicket {
  id        String   @id @default(cuid())
  name      String
  email     String
  subject   String
  message   String
  priority  String   @default("normal")
  status    String   @default("open")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@index([email])
  @@index([priority])
  @@index([status])
  @@index([createdAt])
}
```

---

## IMPORTANT IMPLEMENTATION NOTES

1. **Groq is FREE** — Get API key at console.groq.com (fast, free tier is generous)
2. **Fallback is critical** — Site must work even without AI key
3. **Rate limiting** — MUST have rate limits on both endpoints
4. **Input sanitization** — Escape ALL user input before email/DB
5. **Lazy Prisma init** — Use dynamic import + proxy pattern for serverless compatibility
6. **Session cleanup** — Remove sessions older than 1 hour on every access
7. **Email retry** — 2 attempts with 2-second delay
8. **Message limit** — Keep only last 20 messages per session (sliding window)
9. **Temperature varies by agent** — Conversation=0.7, Knowledge=0.3, etc.
10. **Don't expose API key** — All AI calls happen server-side only

---

## CUSTOMIZATION CHECKLIST

Replace these with YOUR business info:

- [ ] Company name, description, services in knowledge.ts
- [ ] FAQ answers in faq.ts
- [ ] Contact email addresses in ticket route
- [ ] Bot name (Vico → your choice)
- [ ] Color scheme in SupportChatbot.tsx
- [ ] Lead scoring signals relevant to YOUR business
- [ ] Agent system prompts with YOUR value props
- [ ] Prisma models if you need different fields

---

## DATA FLOW DIAGRAM

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  User types  │────►│  /api/chat   │────►│  orchestrator   │
│  message     │     │  (rate limit)│     │  .handleMessage │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┤
                    ▼                               ▼
            ┌──────────────┐              ┌─────────────────┐
            │ classifyIntent│              │ scoreLead()     │
            │ (fast Groq)  │              │ (regex patterns)│
            └──────┬───────┘              └────────┬────────┘
                   │                               │
                   ▼                               ▼
            ┌──────────────┐              ┌─────────────────┐
            │ selectAgent() │◄────────────│ extractContact() │
            │ (logic)       │              │ (regex)         │
            └──────┬───────┘              └─────────────────┘
                   │
                   ▼
            ┌──────────────┐     ┌─────────────────┐
            │ streamText() │────►│ memory.ts       │
            │ (Groq stream)│     │ (store response)│
            └──────┬───────┘     └─────────────────┘
                   │
                   ▼
            ┌──────────────┐
            │ Client UI    │
            │ (streaming)  │
            └──────────────┘

FALLBACK (no AI key):
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  User types  │────►│  matchFAQ()  │────►│  Response    │
│  message     │     │  (keywords)  │     │  (instant)   │
└─────────────┘     └──────────────┘     └─────────────┘
```
