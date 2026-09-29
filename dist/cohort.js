"use strict";
// src/cohort.ts
// LMS / operational domain — cohort, progress, and student view types.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitLabel = exports.ProgressStatus = exports.SLUG_REGEX = exports.CohortStatus = exports.CohortFormat = void 0;
exports.toStudentProgress = toStudentProgress;
const curriculum_1 = require("./curriculum");
Object.defineProperty(exports, "UnitLabel", { enumerable: true, get: function () { return curriculum_1.UnitLabel; } });
exports.CohortFormat = {
    FLEX: 'flex',
    BOOT: 'boot',
    SELF_PACED: 'self-paced',
};
exports.CohortStatus = {
    DRAFT: 'draft',
    ACTIVE: 'active',
    CONCLUDED: 'concluded',
};
/** Regex that defines a valid cohort slug. */
exports.SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
exports.ProgressStatus = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    CAUGHT_UP: 'caught_up',
    COMPLETED: 'completed',
};
function toStudentProgress(curriculum) {
    const { cohort, units } = curriculum;
    const unitById = new Map(units.map(u => [u.unitId, u]));
    const allPages = units.flatMap(u => u.pages);
    const visitedIds = new Set(allPages.filter(p => p.firstVisitedAt !== null).map(p => p.pageId));
    const availablePages = allPages.filter(p => !unitById.get(p.unitId)?.isLocked);
    const pagesAvailable = availablePages.length;
    const pagesVisited = availablePages.filter(p => visitedIds.has(p.pageId)).length;
    const status = pagesVisited === 0 ? exports.ProgressStatus.NOT_STARTED :
        pagesVisited < pagesAvailable ? exports.ProgressStatus.IN_PROGRESS :
            units.some(u => u.isLocked) ? exports.ProgressStatus.CAUGHT_UP :
                exports.ProgressStatus.COMPLETED;
    const sortedAvailable = [...availablePages].sort((a, b) => (unitById.get(a.unitId)?.position ?? 0) - (unitById.get(b.unitId)?.position ?? 0) || a.position - b.position);
    const lastVisited = availablePages
        .filter(p => p.lastVisitedAt !== null)
        .reduce((acc, p) => (!acc || p.lastVisitedAt > acc.lastVisitedAt ? p : acc), null);
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
    function toResumeTarget() {
        if (status === exports.ProgressStatus.COMPLETED)
            return null;
        if (status === exports.ProgressStatus.CAUGHT_UP) {
            const last = sortedAvailable[sortedAvailable.length - 1];
            return last ? toProgressPage(last) : null;
        }
        const lastIdx = lastVisited
            ? sortedAvailable.findIndex(p => p.pageId === lastVisited.pageId)
            : -1;
        const next = (lastIdx >= 0 ? sortedAvailable.slice(lastIdx + 1) : [])
            .find(p => !visitedIds.has(p.pageId))
            ?? sortedAvailable.find(p => !visitedIds.has(p.pageId))
            ?? sortedAvailable[0];
        return next ? toProgressPage(next) : null;
    }
    const unlockedUnits = units.filter(u => !u.isLocked).length;
    const totalUnits = units.length;
    return {
        status,
        resumeTarget: toResumeTarget(),
        pagesVisited,
        pagesAvailable,
        progressPct: pagesAvailable > 0 ? Math.round(pagesVisited / pagesAvailable * 100) : 0,
        unlockedUnits,
        totalUnits,
        dripPct: totalUnits > 0 ? Math.round(unlockedUnits / totalUnits * 100) : 0,
    };
}
//# sourceMappingURL=cohort.js.map