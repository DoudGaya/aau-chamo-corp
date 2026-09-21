"use client";

import { Bot, Send, X } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const welcome: Message = {
  role: "assistant",
  content: "Hello. I can explain A.A.U Chamo services, guide an enquiry, or help you reach a staff member. I never confirm prices, availability or bookings without authorised verification.",
};

export function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcome]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    const nextMessages = [...messages, { role: "user" as const, content: message }];
    setMessages(nextMessages);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, history: nextMessages.slice(-8) }),
      });
      const body = await response.json() as { answer?: string };
      setMessages((current) => [...current, { role: "assistant", content: body.answer || "I could not complete that request. Please use the enquiry form or contact our team." }]);
    } catch {
      setMessages((current) => [...current, { role: "assistant", content: "The assistant is temporarily unavailable. Please use Book / Enquire or the WhatsApp handover button." }]);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    void send(input);
  }

  return (
    <>
      {open ? (
        <section className="assistant-panel" aria-label="A.A.U Chamo customer assistant">
          <div className="assistant-head">
            <div><strong>A.A.U Assist</strong><span>Service guidance · enquiry support</span></div>
            <button type="button" className="icon-button" onClick={() => setOpen(false)} aria-label="Close assistant"><X size={18} /></button>
          </div>
          <div className="assistant-messages" ref={scroller} aria-live="polite">
            {messages.map((message, index) => <div className={`message ${message.role}`} key={`${message.role}-${index}`}>{message.content}</div>)}
            {busy ? <div className="message assistant">Reviewing the approved service information…</div> : null}
          </div>
          <div className="assistant-quick">
            {[
              "I want to send cargo",
              "Help with a flight enquiry",
              "Tell me about Umrah",
            ].map((item) => <button key={item} type="button" onClick={() => void send(item)}>{item}</button>)}
          </div>
          <form className="assistant-form" onSubmit={submit}>
            <label className="sr-only" htmlFor="assistant-message">Message</label>
            <input id="assistant-message" value={input} onChange={(event) => setInput(event.target.value)} maxLength={600} placeholder="Ask about a service…" />
            <button type="submit" disabled={busy} aria-label="Send message"><Send size={17} /></button>
          </form>
        </section>
      ) : null}
      <button className="assistant-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-label="Open A.A.U Assist" aria-expanded={open}>
        <Bot size={23} />
      </button>
    </>
  );
}
