"use strict";
// Curriculum domain: units, pages, video providers, media records and student-facing curriculum views.
// Exports UnitLabel, PageStatus, PageLayout, VideoProvider, MediaKind, ProgressStatus, DURATION_REGEX and the related shapes.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressStatus = exports.MediaKind = exports.VideoProvider = exports.PageLayout = exports.PageStatus = exports.UnitLabel = exports.DURATION_REGEX = void 0;
// ─── Constants ────────────────────────────────────────────────────────────────
/** m:ss duration — unpadded minutes, zero-padded seconds capped at 59 (e.g. '3:07'). */
exports.DURATION_REGEX = /^\d+:[0-5]\d$/;
exports.UnitLabel = {
    SESSION: 'session',
    WEEK: 'week',
    MODULE: 'module',
    DAY: 'day',
    PART: 'part',
    UNIT: 'unit',
};
exports.PageStatus = {
    DRAFT: 'draft',
    PUBLISHED: 'published',
};
exports.PageLayout = {
    DOC: 'doc',
    VIDEO: 'video',
};
exports.VideoProvider = {
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
exports.ProgressStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    CAUGHT_UP: 'caught_up',
    COMPLETED: 'completed',
};
//# sourceMappingURL=curriculum.js.map