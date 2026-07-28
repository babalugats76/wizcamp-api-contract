/** The student attending camp. */
export type Enrollee = {
    firstName: string;
    lastName: string;
    email: string;
    nickname?: string;
    age?: number;
};
/** The parent/guardian completing the registration. */
export type Registrant = {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
};
/**
 * Billing address collected during checkout.
 * Field names are normalized — the backend maps to Square's API names as needed.
 * Also used by the Square Web Payments SDK for buyer verification on the frontend.
 */
export type BillingAddress = {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
};
/**
 * Card tokenization result from the Square Web Payments SDK.
 * `cardToken` maps to Square's `sourceId` in the backend handler.
 */
export type PaymentToken = {
    cardToken: string;
    verificationToken?: string;
    idempotencyKey: string;
    locationId: string;
};
/**
 * Everything needed to complete a camp registration/purchase.
 * Renamed from RegistrationRequest in #668 to align with Payment* naming family.
 */
export type PaymentRequest = {
    /** The Square catalog item variation ID identifying the cohort offering being purchased.
     *  The backend maps this to Square's catalogObjectId for order creation. */
    catalogItemId: string;
    enrollee: Enrollee;
    registrant: Registrant;
    billing: BillingAddress;
    payment: PaymentToken;
};
export type PaymentConfirmation = {
    /** Square payment ID — surfaced as the order reference number. */
    confirmationNumber: string;
    amount: number;
    currency: string;
    /** Link to the Square-hosted payment receipt. */
    receiptUrl: string;
    createdAt: string;
};
/**
 * Synchronous response from POST /payment.
 * Contains only what the payment processor returned — no enrollment state.
 * Enrollment happens asynchronously via Square webhook → SQS queue → handleEnroll.ts.
 */
export type PaymentResponse = {
    confirmation: PaymentConfirmation;
};
/** @deprecated Use PaymentRequest instead. */
export type RegistrationRequest = PaymentRequest;
/** @deprecated Use PaymentConfirmation instead. */
export type RegistrationConfirmation = PaymentConfirmation;
/** @deprecated Use PaymentResponse instead. */
export type RegistrationResponse = PaymentResponse;
//# sourceMappingURL=index.d.ts.map