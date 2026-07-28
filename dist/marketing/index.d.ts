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
/** What wizcamp-web POSTs to /newsletter. */
export type NewsletterSubscription = {
    email: string;
    name?: string;
};
/** What the /newsletter endpoint returns on success. */
export type NewsletterResponse = {
    success: true;
};
//# sourceMappingURL=index.d.ts.map