"use strict";
// Zero-import leaf module holding the cohort-level enums that camp, enrollment, meeting and cohort all depend on.
// Exports CohortFormat and CohortStatus; cohort.ts re-exports both for consumer compatibility.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortStatus = exports.CohortFormat = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** How a cohort is delivered. */
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
/** Cohort lifecycle. */
exports.CohortStatus = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CONCLUDED: 'concluded',
};
//# sourceMappingURL=primitives.js.map