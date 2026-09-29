"use strict";
// src/enrollment.ts
// LMS / operational domain — enrollment types.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENROLLMENT_TRANSITIONS = exports.EnrollmentStatus = void 0;
exports.EnrollmentStatus = {
    PENDING_ONBOARDING: 'pending_onboarding',
    ACTIVE: 'active',
    REMOVED: 'removed',
};
/**
 * Valid status transitions for an enrollment.
 * Mirrors the server-side ALLOWED_TRANSITIONS in wizcamp-backend.
 */
exports.ENROLLMENT_TRANSITIONS = {
    pending_onboarding: ['active', 'removed'],
    active: ['removed'],
    removed: ['active'],
};
//# sourceMappingURL=enrollment.js.map