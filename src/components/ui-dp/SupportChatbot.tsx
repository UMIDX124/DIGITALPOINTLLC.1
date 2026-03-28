"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, X, Send, FileText, ChevronLeft } from "lucide-react";
import { matchFAQ } from "@/lib/ai-chatbot/faq";

// ─── Types ───────────────────────────────────────────────────────────────────
interface TicketForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  priority: "normal" | "high";
}

// ─── Constants ──────────────────────────────────────────────────────────────
const GREETING_TEXT = "Hi, I'm Digital Point's AI assistant. I can help you learn about our services, pricing, process, and more.\n\nAsk me anything or create a support ticket if you need human help.";

const GREETING_MESSAGE: UIMessage = {
  id: "greeting",
  role: "assistant",
  parts: [{ type: "text", text: GREETING_TEXT }],
};

const QUICK_ACTIONS = [
  "What services do you offer?",
  "How does pricing work?",
  "Tell me about the team",
  "Book a free audit",
  "Create a ticket",
];

// ─── Helper: extract text from UIMessage parts ─────────────────────────────
function getMessageText(msg: UIMessage): string {
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

// ─── Simple Markdown Renderer ────────────────────────────────────────────────
function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Bold
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');

    // Bullet points
    if (line.match(/^- /)) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1">
          <span className="text-zinc-500 shrink-0">&#x2022;</span>
          <span dangerouslySetInnerHTML={{ __html: line.slice(2) }} />
        </div>
      );
      continue;
    }

    // Numbered lists
    const numMatch = line.match(/^(\d+)\.\s/);
    if (numMatch) {
      elements.push(
        <div key={i} className="flex gap-2 ml-1">
          <span className="text-zinc-500 shrink-0 font-semibold">{numMatch[1]}.</span>
          <span dangerouslySetInnerHTML={{ __html: line.slice(numMatch[0].length) }} />
        </div>
      );
      continue;
    }

    // Empty lines = spacer
    if (line.trim() === "") {
      elements.push(<div key={i} className="h-2" />);
      continue;
    }

    // Regular text
    elements.push(
      <span key={i} dangerouslySetInnerHTML={{ __html: line }} />
    );
    if (i < lines.length - 1 && lines[i + 1].trim() !== "") {
      elements.push(<br key={`br-${i}`} />);
    }
  }

  return <>{elements}</>;
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function SupportChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const [ticketSuccess, setTicketSuccess] = useState(false);
  const [ticketError, setTicketError] = useState("");
  const [ticketForm, setTicketForm] = useState<TicketForm>({
    name: "",
    email: "",
    subject: "",
    message: "",
    priority: "normal",
  });
  const [aiEnabled, setAiEnabled] = useState(true);
  const [fallbackMessages, setFallbackMessages] = useState<UIMessage[]>([GREETING_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Session ID
  const [sessionId] = useState(() => {
    if (typeof window === "undefined") return "ssr";
    const existing = sessionStorage.getItem("dp-chat-session");
    if (existing) return existing;
    const id = crypto.randomUUID();
    sessionStorage.setItem("dp-chat-session", id);
    return id;
  });

  const {
    messages: aiMessages,
    status,
    sendMessage: sendAiMessage,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    }),
    messages: [GREETING_MESSAGE],
    onError: () => {
      setAiEnabled(false);
    },
  });

  const isStreaming = status === "streaming" || status === "submitted";
  const messages = aiEnabled ? aiMessages : fallbackMessages;

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isStreaming, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !showTicketForm) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen, showTicketForm]);

  // ─── Send Message ──────────────────────────────────────────────────────
  const handleSendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      const trimmed = text.trim();

      const lower = trimmed.toLowerCase();
      if (
        lower.includes("create a ticket") ||
        lower.includes("create ticket") ||
        lower.includes("open ticket") ||
        lower.includes("make a ticket")
      ) {
        if (aiEnabled) {
          sendAiMessage({ text: trimmed });
        } else {
          setFallbackMessages((prev) => [
            ...prev,
            { id: `user-${Date.now()}`, role: "user", parts: [{ type: "text", text: trimmed }] },
            { id: `bot-${Date.now()}`, role: "assistant", parts: [{ type: "text", text: "Sure! I'll open the ticket form for you right now." }] },
          ]);
        }
        setTimeout(() => setShowTicketForm(true), 500);
        return;
      }

      if (aiEnabled) {
        sendAiMessage({ text: trimmed });
      } else {
        const userMsg: UIMessage = { id: `user-${Date.now()}`, role: "user", parts: [{ type: "text", text: trimmed }] };
        setFallbackMessages((prev) => [...prev, userMsg]);

        setTimeout(() => {
          const response = matchFAQ(trimmed);
          const botMsg: UIMessage = { id: `bot-${Date.now()}`, role: "assistant", parts: [{ type: "text", text: response }] };
          setFallbackMessages((prev) => [...prev, botMsg]);
        }, 600 + Math.random() * 800);
      }
    },
    [aiEnabled, sendAiMessage]
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(inputValue);
    setInputValue("");
  };

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitting(true);
    setTicketError("");

    try {
      const res = await fetch("/api/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ticketForm),
      });
      const data = await res.json();

      if (data.success) {
        setTicketSuccess(true);
        setTicketForm({ name: "", email: "", subject: "", message: "", priority: "normal" });
        setTimeout(() => {
          setShowTicketForm(false);
          setTicketSuccess(false);
          if (!aiEnabled) {
            setFallbackMessages((prev) => [
              ...prev,
              { id: `bot-${Date.now()}`, role: "assistant", parts: [{ type: "text", text: "Your ticket has been submitted successfully! Our team will get back to you soon. Is there anything else I can help you with?" }] },
            ]);
          }
        }, 2000);
      } else {
        setTicketError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setTicketError("Network error. Please check your connection and try again.");
    } finally {
      setTicketSubmitting(false);
    }
  };

  return (
    <>
      {/* ── Floating Chat Button — clean, minimal ── */}
      <div className="fixed bottom-[4.5rem] md:bottom-6 right-4 md:right-6 z-[60] flex flex-col items-end gap-3">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 bg-violet-600 shadow-lg shadow-black/30"
          aria-label={isOpen ? "Close support chat" : "Open support chat"}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
          )}
        </button>
      </div>

      {/* ── Chat Window ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[8rem] md:bottom-24 right-4 md:right-6 z-[60] w-[380px] max-w-[calc(100vw-2rem)] h-[460px] md:h-[560px] max-h-[calc(100vh-10rem)] rounded-xl overflow-hidden flex flex-col shadow-2xl shadow-black/40"
            style={{
              background: "#111113",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* ── Header ── */}
            <div className="shrink-0 px-5 py-4 flex items-center gap-3 border-b border-white/[0.06] bg-[#161618]">
              <div className="w-8 h-8 rounded-full bg-violet-600/20 flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-violet-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-white font-display">
                  Support
                </h3>
                <p className="text-xs text-zinc-500">
                  {isStreaming ? "Typing..." : "Digital Point LLC"}
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-600 hover:text-zinc-400 transition-colors p-1"
                aria-label="Minimize chat"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="7" width="12" height="2" rx="1" />
                </svg>
              </button>
            </div>

            {/* ── Messages Area or Ticket Form ── */}
            <AnimatePresence mode="wait">
              {showTicketForm ? (
                <motion.div
                  key="ticket-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1 overflow-y-auto custom-scrollbar p-4"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <button
                      onClick={() => { setShowTicketForm(false); setTicketSuccess(false); setTicketError(""); }}
                      className="text-zinc-500 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <h4 className="text-sm font-semibold text-white font-display">
                      Create Support Ticket
                    </h4>
                  </div>

                  {ticketSuccess ? (
                    <div className="flex flex-col items-center gap-3 py-8">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <p className="text-sm text-white font-medium text-center">Ticket submitted!</p>
                      <p className="text-xs text-zinc-500 text-center">Our team will get back to you soon.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleTicketSubmit} className="flex flex-col gap-3">
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Name *</label>
                        <input
                          type="text"
                          required
                          maxLength={100}
                          value={ticketForm.name}
                          onChange={(e) => setTicketForm((p) => ({ ...p, name: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0a0c] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Email *</label>
                        <input
                          type="email"
                          required
                          maxLength={200}
                          value={ticketForm.email}
                          onChange={(e) => setTicketForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0a0c] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="you@company.com"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Subject *</label>
                        <input
                          type="text"
                          required
                          maxLength={200}
                          value={ticketForm.subject}
                          onChange={(e) => setTicketForm((p) => ({ ...p, subject: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0a0c] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                          placeholder="Brief description of your issue"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1 block">Message *</label>
                        <textarea
                          required
                          maxLength={2000}
                          rows={3}
                          value={ticketForm.message}
                          onChange={(e) => setTicketForm((p) => ({ ...p, message: e.target.value }))}
                          className="w-full px-3 py-2 rounded-lg text-sm bg-[#0a0a0c] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
                          placeholder="Tell us more..."
                        />
                      </div>
                      <div>
                        <label className="text-xs text-zinc-500 mb-1.5 block">Priority</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setTicketForm((p) => ({ ...p, priority: "normal" }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                              ticketForm.priority === "normal"
                                ? "bg-violet-500/10 border-violet-500/30 text-violet-400"
                                : "bg-[#0a0a0c] border-white/[0.06] text-zinc-500 hover:border-white/[0.1]"
                            }`}
                          >
                            Normal
                          </button>
                          <button
                            type="button"
                            onClick={() => setTicketForm((p) => ({ ...p, priority: "high" }))}
                            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                              ticketForm.priority === "high"
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                : "bg-[#0a0a0c] border-white/[0.06] text-zinc-500 hover:border-white/[0.1]"
                            }`}
                          >
                            High Priority
                          </button>
                        </div>
                      </div>

                      {ticketError && (
                        <p className="text-xs text-red-400 bg-red-400/10 rounded-lg px-3 py-2">{ticketError}</p>
                      )}

                      <button
                        type="submit"
                        disabled={ticketSubmitting}
                        className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {ticketSubmitting ? "Submitting..." : "Submit Ticket"}
                      </button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="chat-messages"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 overflow-y-auto custom-scrollbar p-4 flex flex-col gap-3"
                >
                  {messages.map((msg) => {
                    const text = getMessageText(msg);
                    if (!text) return null;

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed ${
                            msg.role === "user"
                              ? "rounded-2xl rounded-br-sm text-white bg-violet-600"
                              : "rounded-2xl rounded-bl-sm text-zinc-300 bg-white/[0.04] border border-white/[0.06]"
                          }`}
                        >
                          {renderMarkdown(text)}
                        </div>
                      </div>
                    );
                  })}

                  {isStreaming && (
                    <div className="flex justify-start">
                      <div className="px-4 py-3 rounded-2xl rounded-bl-sm bg-white/[0.04] border border-white/[0.06] text-zinc-500 text-sm">
                        ...
                      </div>
                    </div>
                  )}

                  {/* Quick actions */}
                  {messages.length === 1 && !isStreaming && (
                    <div className="flex flex-wrap gap-2 mt-1">
                      {QUICK_ACTIONS.map((action) => (
                        <button
                          key={action}
                          onClick={() => handleSendMessage(action)}
                          className="text-xs px-3 py-1.5 rounded-md border border-white/[0.06] text-zinc-500 hover:text-zinc-300 hover:border-white/[0.1] transition-all bg-white/[0.02]"
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input Bar ── */}
            {!showTicketForm && (
              <div className="shrink-0 px-4 py-3 flex items-center gap-2 border-t border-white/[0.06] bg-[#0e0e10]">
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="shrink-0 p-2 rounded-lg text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.04] transition-all"
                  aria-label="Create support ticket"
                  title="Create Ticket"
                >
                  <FileText className="w-4 h-4" />
                </button>
                <form onSubmit={handleFormSubmit} className="flex-1 flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Ask me anything..."
                    maxLength={500}
                    className="flex-1 px-3 py-2 rounded-lg text-sm bg-[#0a0a0c] border border-white/[0.06] text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500/50 transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue?.trim() || isStreaming}
                    className="shrink-0 p-2 rounded-lg transition-all disabled:opacity-20 bg-violet-600 disabled:bg-transparent"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
