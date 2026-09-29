// Zero-import leaf module holding the cohort-level enums that camp, enrollment, meeting and cohort all depend on.
// Exports CohortFormat and CohortStatus; cohort.ts re-exports both for consumer compatibility.

// ─── Constants ────────────────────────────────────────────────────────────────

/** How a cohort is delivered. */
export const CohortFormat = {
  FLEX:       'flex',
  BOOT:       'boot',
  SELF_PACED: 'self-paced',
} as const;
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];

/** Cohort lifecycle. */
export const CohortStatus = {
  DRAFT:     'draft',
  ACTIVE:    'active',
  CONCLUDED: 'concluded',
} as const;
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
