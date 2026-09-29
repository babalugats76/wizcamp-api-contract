// src/catalog/index.ts — backward-compat shim
// Types have moved to src/camp.ts. CampSession replaces Cohort.
export * from '../camp';
/** @deprecated use CampSession */
export type { CampSession as Cohort } from '../camp';
