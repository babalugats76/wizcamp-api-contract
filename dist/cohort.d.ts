import type { CohortFormat, CohortStatus } from './primitives';
import type { MediaImage, MediaVideo } from './media';
import type { CampLevel } from './camp';
import type { ProgressSummary, StudentCurriculumUnit, PageViewDetail, UnitLabel } from './curriculum';
import type { EnrollmentCounts, EnrollmentSummary } from './enrollment';
import type { MeetingSlot } from './meeting';
import type { Student } from './auth';
/** Regex that defines a valid cohort slug. */
export declare const SLUG_REGEX: RegExp;
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
    enrollmentCounts: EnrollmentCounts;
};
/** Admin operational view of a cohort. */
export type CohortDetail = {
    cohort: Cohort;
    unitCount: number;
    enrollmentCounts: EnrollmentCounts;
};
export type StudentCurriculum = {
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'unitLabel' | 'status'>;
    units: StudentCurriculumUnit[];
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
export declare function toStudentProgress(curriculum: ProgressInput): StudentProgress;
export { CohortFormat, CohortStatus } from './primitives';
//# sourceMappingURL=cohort.d.ts.map