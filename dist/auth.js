"use strict";
// Authentication and user identity types: users, students, sessions, settings and onboarding.
// Exports UserRole, OAuthProvider, StudentStatus, UserTheme, OnboardingMode, EditorAutoSave and the Student/AuthUser/settings shapes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorAutoSave = exports.OnboardingMode = exports.UserTheme = exports.StudentStatus = exports.OAuthProvider = exports.UserRole = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
exports.UserRole = {
    STUDENT: 'student',
    ADMIN: 'admin',
};
exports.OAuthProvider = {
    GOOGLE: 'google',
    GITHUB: 'github',
};
exports.StudentStatus = {
    ACTIVE: 'active',
    SUSPENDED: 'suspended',
};
exports.UserTheme = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
};
/** How a student gets into the LMS after enrolling: activate a new account, or just access an existing one. */
exports.OnboardingMode = {
    ACTIVATION: 'activation',
    ACCESS: 'access',
};
exports.EditorAutoSave = {
    LIVE: 'live',
    AUTO: 'auto',
    MANUAL: 'manual',
};
//# sourceMappingURL=auth.js.map