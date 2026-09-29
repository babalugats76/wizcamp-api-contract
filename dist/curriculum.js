"use strict";
// src/curriculum.ts
// LMS / operational domain — curriculum, page, and media types.
Object.defineProperty(exports, "__esModule", { value: true });
exports.DURATION_RE = exports.MediaKind = exports.VideoSourceType = exports.PageLayout = exports.PageStatus = exports.UnitLabel = void 0;
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
/** m:ss duration — unpadded minutes, zero-padded seconds capped at 59 (e.g. '3:07'). */
exports.DURATION_RE = /^\d+:[0-5]\d$/;
//# sourceMappingURL=curriculum.js.map