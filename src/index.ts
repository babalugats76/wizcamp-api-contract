// packages/api-contract/src/index.ts

// Domain namespaces — use dot notation: LMS.Cohort, Billing.RegistrationRequest etc.
export * as LMS from './lms';
export * as Billing from './billing';
export * as Marketing from './marketing';
export * as Catalog from './catalog';

// Shared utilities — imported flat, no namespace needed
export * from './common';
