"use strict";
// packages/api-contract/src/common/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CohortFormat = exports.CampStatus = exports.CampLevelColor = void 0;
exports.CampLevelColor = {
    EMERALD: 'emerald',
    SKY: 'sky',
    AMBER: 'amber',
    ROSE: 'rose',
    VIOLET: 'violet',
};
// ─── Camp phase ─────────────────────────────────────────────────────────────
// Moved from catalog/index.ts — consumed by wizcamp-web for client-side phase
// derivation. Never sent over the wire.
exports.CampStatus = {
    UPCOMING: 'upcoming',
    IN_PROGRESS: 'in-progress',
    CONCLUDED: 'concluded',
};
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
//# sourceMappingURL=index.js.map