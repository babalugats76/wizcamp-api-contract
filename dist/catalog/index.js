"use strict";
// packages/api-contract/src/catalog/index.ts
//
// Wizcamp catalog domain types — the Wizcamp view of the Square product catalog.
// These types are returned by the /camps endpoint and consumed by wizcamp-web
// for camp browsing, cohort selection, and checkout UI.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampStatus = exports.CohortStatus = exports.CohortFormat = void 0;
// ─── Enums ────────────────────────────────────────────────────────────────────
exports.CohortFormat = {
    Flex: 'flex',
    Boot: 'boot',
};
exports.CohortStatus = {
    Completed: 'completed',
    InProgress: 'in-progress',
    Upcoming: 'upcoming',
    Inactive: 'inactive',
};
exports.CampStatus = {
    UPCOMING: 'upcoming',
    IN_PROGRESS: 'in-progress',
    CONCLUDED: 'concluded',
};
//# sourceMappingURL=index.js.map