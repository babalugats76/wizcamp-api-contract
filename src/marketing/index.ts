// packages/api-contract/src/marketing/index.ts
//
// Wizcamp marketing domain types — Anti-Corruption Layer for external marketing platforms.
// All types express Wizcamp business concepts; no platform terminology leaks through.
// Platform-specific internals stay in src/services/ and are never exposed to the frontend.

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

// ─── Event Registration ───────────────────────────────────────────────────────

/** What wizcamp-web POSTs to /events/:eventSlug/register. */
export type EventRegistrationInput = {
  eventSlug: string;
  fullName: string;
  email: string;
  attendeeRole?: 'parent' | 'student';
};

/** What the /events/:eventSlug/register endpoint returns on success. */
export type EventRegistrationResponse = {
  success: true;
  alreadyRegistered: boolean;
};
