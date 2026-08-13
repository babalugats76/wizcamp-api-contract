"use strict";
// packages/api-contract/src/lms/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenRouterKeyLimitReset = exports.ProgressStatus = exports.MeetingAudience = exports.MeetingEditScope = exports.MeetingSource = exports.MeetingType = exports.MediaKind = exports.VideoSourceType = exports.PageLayout = exports.PageStatus = exports.EnrollmentStatus = exports.UnitLabel = exports.SLUG_REGEX = exports.CohortFormat = exports.CohortStatus = exports.UserTheme = exports.StudentStatus = exports.UserRole = void 0;
exports.toStudentProgress = toStudentProgress;
// ─── Enums & Constants ───────────────────────────────────────────────────────
exports.UserRole = {
    STUDENT: 'student',
    ADMIN: 'admin',
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
exports.CohortStatus = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CONCLUDED: 'concluded',
};
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
/** Regex that defines a valid cohort slug — lowercase alphanumeric with hyphens, no leading/trailing hyphens. */
exports.SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
exports.UnitLabel = {
    SESSION: 'Session',
    WEEK: 'Week',
    MODULE: 'Module',
    DAY: 'Day',
    PART: 'Part',
    UNIT: 'Unit',
};
exports.EnrollmentStatus = {
    PENDING_ONBOARDING: 'pending_onboarding',
    ACTIVE: 'active',
    REMOVED: 'removed',
};
exports.PageStatus = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
};
exports.PageLayout = {
    DOC: 'doc',
    VIDEO: 'video',
};
exports.VideoSourceType = {
    EXTERNAL: 'external',
    HOSTED: 'hosted',
    LOOM: 'loom',
    YOUTUBE: 'youtube',
};
exports.MediaKind = {
    VIDEO: 'video',
    IMAGE: 'image',
    FILE: 'file',
};
exports.MeetingType = {
    CLASS: 'class', // scheduled instructional session
    FLEX: 'flex', // flexible/async CLASS variant — student can attend any occurrence covering same material
    OFFICE_HOURS: 'office_hours', // open Q&A / help time
    COACHING: 'coaching', // 1:1 or small group mentoring
    WORKSHOP: 'workshop', // hands-on focused session
    SOCIAL: 'social', // non-instructional gathering, community building
    WEBINAR: 'webinar', // presentation-style, potentially public-facing
    GENERAL: 'general', // catch-all
};
exports.MeetingSource = {
    ZOOM_API: 'zoom_api', // created and managed via Zoom API
    MANUAL_LINK: 'manual_link', // join URL pasted manually; no API sync available
};
exports.MeetingEditScope = {
    THIS: 'this', // update only this occurrence
    FUTURE: 'future', // update this and all future occurrences
    ALL: 'all', // update all occurrences in the series
};
exports.MeetingAudience = {
    COMMUNITY: 'COMMUNITY', // LMS-wide — all verified members; joinUrl in portal only, never public
    PUBLIC: 'PUBLIC', // open to anyone — joinUrl exposed on public marketing site
};
exports.ProgressStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    CAUGHT_UP: 'caught_up',
    COMPLETED: 'completed',
};
exports.OpenRouterKeyLimitReset = {
    NONE: 'none',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
};
/**
 * Pure isomorphic mapper — builds StudentProgress from ProgressInput.
 * No I/O; all inputs are pre-resolved by the caller.
 *
 * Status rules (evaluated in order):
 *   not_started → zero page views
 *   in_progress → some available pages unvisited
 *   caught_up   → all available pages visited, locked units remain
 *   completed   → all available pages visited, no locked units remain
 *
 * resumeTarget is always a navigable page — never a locked page.
 * Concluded camps: resumeTarget is always null.
 */
function toStudentProgress(curriculum) {
    const { cohort, units } = curriculum;
    // Unit lookup by unitId
    const unitById = new Map(units.map(u => [u.unitId, u]));
    const allPages = units.flatMap(u => u.pages);
    // Visited page IDs — firstVisitedAt is write-once (non-null = visited)
    const visitedIds = new Set(allPages.filter(p => p.firstVisitedAt !== null).map(p => p.pageId));
    // Available pages — published pages in unlocked units only (drip-aware)
    const availablePages = allPages.filter(p => !unitById.get(p.unitId)?.isLocked);
    const pagesAvailable = availablePages.length;
    const pagesVisited = availablePages.filter(p => visitedIds.has(p.pageId)).length;
    // Status
    const status = pagesVisited === 0 ? exports.ProgressStatus.NOT_STARTED :
        pagesVisited < pagesAvailable ? exports.ProgressStatus.IN_PROGRESS :
            units.some(u => u.isLocked) ? exports.ProgressStatus.CAUGHT_UP :
                exports.ProgressStatus.COMPLETED;
    // Sort available pages by unit position then page position
    const sortedAvailable = [...availablePages].sort((a, b) => (unitById.get(a.unitId)?.position ?? 0) - (unitById.get(b.unitId)?.position ?? 0) || a.position - b.position);
    // Last visited available page — scoped to unlocked units so resumeTarget
    // for CAUGHT_UP is always navigable.
    const lastVisited = availablePages
        .filter(p => p.lastVisitedAt !== null)
        .reduce((acc, p) => (!acc || p.lastVisitedAt > acc.lastVisitedAt ? p : acc), null);
    // Helper: build ResumeTarget from a CurriculumPage
    function toProgressPage(page) {
        const unit = unitById.get(page.unitId);
        return {
            slug: page.slug,
            title: page.title,
            unitTitle: unit?.title ?? '',
            unitPosition: unit?.position ?? 0,
            unitLabel: cohort.unitLabel,
            pagePosition: page.position,
        };
    }
    // resumeTarget — single navigable destination for the CTA.
    // Three cases only. The /learn/:cohortSlug router owns first-page resolution
    // for COMPLETED and CONCLUDED — toResumeTarget returns null for those.
    function toResumeTarget() {
        if (status === exports.ProgressStatus.COMPLETED) {
            return null;
        }
        if (status === exports.ProgressStatus.CAUGHT_UP) {
            const last = sortedAvailable[sortedAvailable.length - 1];
            return last ? toProgressPage(last) : null;
        }
        // NOT_STARTED + IN_PROGRESS unified: forward-scan from lastVisited,
        // fall back to beginning (handles mid-sequence inserts and zero-visits case).
        const lastIdx = lastVisited
            ? sortedAvailable.findIndex(p => p.pageId === lastVisited.pageId)
            : -1;
        const next = (lastIdx >= 0 ? sortedAvailable.slice(lastIdx + 1) : [])
            .find(p => !visitedIds.has(p.pageId))
            ?? sortedAvailable.find(p => !visitedIds.has(p.pageId))
            ?? sortedAvailable[0]; // absorbs NOT_STARTED: all pages unvisited, return first
        return next ? toProgressPage(next) : null;
    }
    return {
        status,
        resumeTarget: toResumeTarget(),
        pagesVisited,
        pagesAvailable,
        progressPct: pagesAvailable > 0 ? Math.round(pagesVisited / pagesAvailable * 100) : 0,
        dripPct: units.length > 0 ? Math.round(units.filter(u => !u.isLocked).length / units.length * 100) : 0,
    };
}
//# sourceMappingURL=index.js.map