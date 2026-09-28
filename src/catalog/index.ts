// packages/api-contract/src/catalog/index.ts
//
// Wizcamp catalog domain types — the Wizcamp view of the Square product catalog.
// These types are returned by the /camps endpoint and consumed by wizcamp-web
// for camp browsing, cohort selection, and checkout UI.

import { CohortFormat } from '../common';

// ─── Catalog types ────────────────────────────────────────────────────────────

/** A single cohort (session/run) of a camp, as returned by the /camps endpoint. */
export type Cohort = {
  id: string; // Square ITEM_VARIATION id — the purchasable session
  name: string;
  sku: string;
  amount: number;
  price: string;
  displayPrice: string;
  currency: string;
  imageUrls: string[];
  bookable: boolean;
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
  id: string; // Square ITEM id — stable join key for CMS content
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
