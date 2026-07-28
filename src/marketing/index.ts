// packages/api-contract/src/marketing/index.ts
//
// Wizcamp marketing domain types — Anti-Corruption Layer for Mailerlite.
// All types express Wizcamp business concepts; no Mailerlite terminology leaks through.
// Mailerlite internals (MailerLiteSubscriber, MailerLiteGroup, etc.) stay in
// src/services/mailerlite.ts and are never exposed to the frontend.

// ─── Waitlist ─────────────────────────────────────────────────────────────────

/** What wizcamp-web POSTs to /waitlist. */
export type WaitlistEntry = {
  email: string;
  name?: string;
  campName?: string;
};

/** What the /waitlist endpoint returns on success. */
export type WaitlistResponse = {
  success: true;
};

// ─── Newsletter ───────────────────────────────────────────────────────────────

/** What wizcamp-web POSTs to /newsletter. */
export type NewsletterSubscription = {
  email: string;
  name?: string;
};

/** What the /newsletter endpoint returns on success. */
export type NewsletterResponse = {
  success: true;
};
