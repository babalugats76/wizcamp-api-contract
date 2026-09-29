import type { MediaImage, MediaVideo } from './media';
import type { CampLevel } from './camp';
import type { UnitLabel, StudentCurriculumUnit, StudentCurriculumPage, UnitSummary, CohortCurriculum, PageViewDetail } from './curriculum';
import type { EnrollmentSummary } from './enrollment';
import type { MeetingSlot } from './meeting';
import type { Student } from './auth';
export declare const CohortFormat: {
    readonly FLEX: "flex";
    readonly BOOT: "boot";
    readonly SELF_PACED: "self-paced";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
export declare const CohortStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly CONCLUDED: "concluded";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
/** Regex that defines a valid cohort slug. */
export declare const SLUG_REGEX: RegExp;
export declare const ProgressStatus: {
    readonly NOT_STARTED: "not_started";
    readonly IN_PROGRESS: "in_progress";
    readonly CAUGHT_UP: "caught_up";
    readonly COMPLETED: "completed";
};
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];
export type Cohort = {
    cohortSlug: string;
    campName: string;
    name: string;
    format: CohortFormat;
    unitLabel: UnitLabel;
    description: string | null;
    startDate: string;
    endDate: string;
    image: MediaImage | null;
    video: MediaVideo | null;
    level: CampLevel | null;
    status: CohortStatus;
    createdAt: string;
    updatedAt: string;
};
/** Lean cohort identity descriptor — surface-neutral. */
export type CohortSummary = Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'format' | 'unitLabel' | 'status' | 'startDate' | 'endDate'>;
/** Cohort identity plus pre-aggregated counts — admin cohort list only. */
export type CohortStats = CohortSummary & {
    unitCount: number;
    enrollmentCounts: import('./enrollment').EnrollmentCounts;
};
/** Admin operational view of a cohort. */
export type CohortDetail = {
    cohort: Cohort;
    unitCount: number;
    enrollmentCounts: import('./enrollment').EnrollmentCounts;
};
export type StudentCurriculum = {
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'unitLabel' | 'status'>;
    units: StudentCurriculumUnit[];
};
export type ProgressSummary = {
    pagesVisited: number;
    pagesAvailable: number;
    progressPct: number;
    unlockedUnits: number;
    totalUnits: number;
    dripPct: number;
    status: ProgressStatus;
};
export type ResumeTarget = {
    slug: string;
    title: string;
    unitTitle: string;
    unitPosition: number;
    unitLabel: string;
    pagePosition: number;
};
export type StudentProgress = ProgressSummary & {
    resumeTarget: ResumeTarget | null;
};
export type ProgressInput = {
    cohort: {
        unitLabel: UnitLabel;
    };
    units: StudentCurriculumUnit[];
};
export declare function toStudentProgress(curriculum: ProgressInput): StudentProgress;
export type StudentCohortLanding = {
    cohort: Cohort;
    enrollment: EnrollmentSummary;
    classmates: Pick<Student, 'firstName' | 'avatarUrl'>[];
    meetings: MeetingSlot[];
};
export type StudentDashboard = {
    cohorts: ({
        cohort: Cohort;
        enrollment: EnrollmentSummary;
        progress: ProgressSummary;
    })[];
    meetings: MeetingSlot[];
};
export type StudentEngagement = {
    cohortSlug: string;
    studentId: string;
    progress: ProgressSummary;
    lastActiveAt: string | null;
    pages: PageViewDetail[];
};
export type CreateCohortInput = {
    cohortSlug: string;
    campName: string;
    name: string;
    format?: CohortFormat;
    unitLabel?: UnitLabel;
    description?: string;
    startDate: string;
    endDate: string;
    image?: MediaImage;
    video?: MediaVideo;
    level?: CampLevel;
};
export type UpdateCohortInput = Partial<CreateCohortInput> & {
    status?: CohortStatus;
};
export type { UnitLabel, StudentCurriculumUnit, StudentCurriculumPage, UnitSummary, CohortCurriculum, PageViewDetail };
//# sourceMappingURL=cohort.d.ts.map