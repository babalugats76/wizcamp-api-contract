// packages/api-contract/src/catalog/index.ts
//
// Wizcamp catalog domain types — the Wizcamp view of the Square product catalog.
// These types are returned by the /camps endpoint and consumed by wizcamp-web
// for camp browsing, cohort selection, and checkout UI.

// ─── Enums ────────────────────────────────────────────────────────────────────

export const CohortFormat = {
  Flex: 'flex',
  Boot: 'boot',
} as const;
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];

export const CohortStatus = {
  Completed: 'completed',
  InProgress: 'in-progress',
  Upcoming: 'upcoming',
  Inactive: 'inactive',
} as const;
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];

export const CampStatus = {
  UPCOMING:    'upcoming',
  IN_PROGRESS: 'in-progress',
  CONCLUDED:   'concluded',
} as const;
export type CampStatus = (typeof CampStatus)[keyof typeof CampStatus];

/**
 * Client-computed display state for a camp cohort.
 * Returned by getCampPhase() in lib/date.ts.
 * Never sent over the wire — computed in the browser from startDate/endDate.
 */
export type CampPhase = {
  status: CampStatus;
  label: string;    // e.g. "Starts Tomorrow", "in 3 days", "in progress", "concluded"
  isActive: boolean;
};

// ─── Catalog types ────────────────────────────────────────────────────────────

/** A single cohort (session/run) of a camp, as returned by the /camps endpoint. */
export type Cohort = {
  id: string;
  name: string;
  sku: string;
  amount: number;
  price: string;
  displayPrice: string;
  currency: string;
  imageUrls: string[];
  status: CohortStatus;
  active?: boolean;
  startDate?: string;
  endDate?: string;
  meetingTimes?: string[];
  format?: CohortFormat;
  instructor?: string;
  resourceIds: string[];
  emailImageUrl?: string;
};

/** A camp with its available cohorts, as returned by the /camps endpoint. */
export type Camp = {
  name: string;
  category: string;
  rootCategory: string;
  descriptionHtml: string;
  imageUrls: string[];
  emailImageUrl?: string;
  cohorts: Cohort[];
  program?: string;
  track?: string;
};
