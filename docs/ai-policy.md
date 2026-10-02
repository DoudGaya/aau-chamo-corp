# AI Assistant — Policy & Retention Document

**System:** A.A.U Chamo Corporate Website AI Assistant  
**Effective date:** 29 September 2026  
**Owner:** Nillar Softwares (technical); A.A.U. Chamo (operational)

---

## 1. What the assistant does

The AI assistant is a conversational widget on the A.A.U. Chamo website. It:

- Answers questions about services, locations, and the enquiry process using a grounded system prompt built from approved company content.
- Collects structured enquiry details from visitors and submits them to the enquiry pipeline with explicit customer consent.
- Escalates to WhatsApp or the enquiry form when it cannot help.

It does **not** confirm bookings, quote prices, state delivery timelines, or guarantee availability.

---

## 2. Data handling

| Data type | Where stored | Retention |
|---|---|---|
| Conversation messages | Browser memory only (React state) | Cleared on page refresh / tab close |
| Submitted enquiry (after consent) | PostgreSQL `website_enquiries` table | Per company data retention policy |
| IP rate-limit bucket | Server process memory | Cleared on cold start — not persisted |
| OpenAI conversation context | Not stored (`store: false`) | Never — OpenAI receives but does not store per API Terms |
| Analytics events | Google Analytics | Per GA4 data retention settings (default 14 months) |

**No conversation transcript is stored server-side.** The assistant is stateless between page loads.

---

## 3. What is never sent to analytics

The following are **never** included in any analytics event payload:
- Customer name, email, phone number, message text or chat content
- Enquiry reference numbers
- Any personally identifiable information

---

## 4. Safety filters

The assistant applies keyword-based safety checks on both input and output:

| Filter | Purpose |
|---|---|
| `unsafeRequest` | Blocks questions about prices, availability, confirmed bookings |
| `currencyClaim` | Prevents the model stating any currency amounts |
| `confirmationClaim` | Prevents claiming a booking has been confirmed |
| `exactTimelineClaim` | Prevents specific delivery timeline commitments |

---

## 5. Consent

Before the assistant submits an enquiry, the customer must have given explicit consent in the conversation. Consent version `v1` and timestamp are stored in the `website_enquiries` record.

---

## 6. Spend cap

A soft monthly spend cap is configurable via `OPENAI_MONTHLY_BUDGET_USD`. At 80% of cap, a server-side warning is logged. At 100%, the assistant falls back to local knowledge. A **hard limit must also be set in the OpenAI dashboard** for guaranteed protection.

---

## 7. Disclosure obligation

The assistant UI makes clear to visitors that they are interacting with an automated AI system, not a human. Do not remove or obscure this disclosure.

---

## 8. Incident response

1. To disable AI immediately: set `OPENAI_API_KEY` to empty in production (triggers local-knowledge fallback).
2. Notify Nillar Softwares for investigation.
3. Review server logs for the safety identifier hash and approximate time.
4. Apply a fix and re-enable after review.

