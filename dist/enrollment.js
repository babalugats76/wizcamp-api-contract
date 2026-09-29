"use strict";
// LMS / operational domain: enrollment lifecycle, the flat Enrollment join type and enrollment mutation/response shapes.
// Exports EnrollmentStatus, ENROLLMENT_TRANSITIONS, Enrollment, EnrollmentSummary, CohortRoster and related inputs.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENROLLMENT_TRANSITIONS = exports.EnrollmentStatus = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
exports.EnrollmentStatus = {
    PENDING_ONBOARDING: 'pending_onboarding',
    ACTIVE: 'active',
    REMOVED: 'removed',
};
// ─── Lookup maps ──────────────────────────────────────────────────────────────
/**
 * Valid status transitions for an enrollment.
 * Mirrors the server-side ALLOWED_TRANSITIONS in wizcamp-backend.
 */
exports.ENROLLMENT_TRANSITIONS = {
    [exports.EnrollmentStatus.PENDING_ONBOARDING]: [exports.EnrollmentStatus.ACTIVE, exports.EnrollmentStatus.REMOVED],
    [exports.EnrollmentStatus.ACTIVE]: [exports.EnrollmentStatus.REMOVED],
    [exports.EnrollmentStatus.REMOVED]: [exports.EnrollmentStatus.ACTIVE],
};
//# sourceMappingURL=enrollment.js.map