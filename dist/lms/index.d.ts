/**
 * LMS domain types — entities, enums, and view DTOs.
 * Consumed via the LMS namespace: import type { LMS } from '@wizcamp/api-contract'
 * Or via subpath: import type { Cohort } from '@wizcamp/api-contract/lms'
 *
 * Naming conventions:
 * - Core entities: bare name (Cohort, Unit, Page)
 * - Enums & constants: bare name (CohortStatus, EnrollmentStatus, SLUG_REGEX)
 * - Admin-privileged DTOs: Admin* prefix (AdminCurriculum, AdminPreview, AdminStudent);
 * - Composed read DTOs: *View suffix (AdminCohortView, EnrolledCohort)
 * - HTTP response bodies: *Response suffix
 * - Internal operation results: *Result suffix
 * - Auth types: Auth* prefix (AuthUser)
 * - List-endpoint DTOs: *Summary suffix (CohortSummary)
 */
import type { MediaImage, MediaVideo, CampLevel } from '../common';
import { CampLevelColor } from '../common';
export type { CampLevelColor };
/** Maps Date → string for JSONB-sourced rows where pg type parsers do not run. */
export type Jsonified<T> = {
    [K in keyof T]: T[K] extends Date ? string : T[K] extends Date | null ? string | null : T[K];
};
export declare const UserRole: {
    readonly STUDENT: "student";
    readonly ADMIN: "admin";
};
export type UserRole = (typeof UserRole)[keyof typeof UserRole];
export type OAuthProvider = 'google' | 'github';
export type OnboardingMode = 'activation' | 'access';
export declare const StudentStatus: {
    readonly ACTIVE: "active";
    readonly SUSPENDED: "suspended";
};
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];
export declare const UserTheme: {
    readonly LIGHT: "light";
    readonly DARK: "dark";
    readonly SYSTEM: "system";
};
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];
export declare const CohortStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly CONCLUDED: "concluded";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
export declare const CohortFormat: {
    readonly FLEX: "flex";
    readonly BOOT: "boot";
    readonly SELF_PACED: "self-paced";
};
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];
/** Regex that defines a valid cohort slug — lowercase alphanumeric with hyphens, no leading/trailing hyphens. */
export declare const SLUG_REGEX: RegExp;
export declare const UnitLabel: {
    readonly SESSION: "Session";
    readonly WEEK: "Week";
    readonly MODULE: "Module";
    readonly DAY: "Day";
    readonly PART: "Part";
    readonly UNIT: "Unit";
};
export type UnitLabel = (typeof UnitLabel)[keyof typeof UnitLabel];
export declare const EnrollmentStatus: {
    readonly PENDING_ONBOARDING: "pending_onboarding";
    readonly ACTIVE: "active";
    readonly REMOVED: "removed";
};
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];
export declare const PageStatus: {
    readonly DRAFT: "draft";
    readonly PUBLISHED: "published";
};
export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus];
export declare const PageLayout: {
    readonly DOC: "doc";
    readonly VIDEO: "video";
};
export type PageLayout = (typeof PageLayout)[keyof typeof PageLayout];
export declare const VideoSourceType: {
    readonly EXTERNAL: "external";
    readonly HOSTED: "hosted";
    readonly LOOM: "loom";
    readonly YOUTUBE: "youtube";
};
export type VideoSourceType = (typeof VideoSourceType)[keyof typeof VideoSourceType];
export type VideoSource = {
    type: typeof VideoSourceType.EXTERNAL;
    url: string;
} | {
    type: typeof VideoSourceType.HOSTED;
    mediaId: string;
} | {
    type: typeof VideoSourceType.LOOM;
    loomVideoId: string;
} | {
    type: typeof VideoSourceType.YOUTUBE;
    youtubeVideoId: string;
};
export declare const MediaKind: {
    readonly VIDEO: "video";
    readonly IMAGE: "image";
    readonly FILE: "file";
};
export type MediaKind = (typeof MediaKind)[keyof typeof MediaKind];
export declare const MeetingType: {
    readonly CLASS: "class";
    readonly FLEX: "flex";
    readonly OFFICE_HOURS: "office_hours";
    readonly COACHING: "coaching";
    readonly WORKSHOP: "workshop";
    readonly SOCIAL: "social";
    readonly WEBINAR: "webinar";
    readonly GENERAL: "general";
};
export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];
export declare const MeetingSource: {
    readonly ZOOM_API: "zoom_api";
    readonly MANUAL_LINK: "manual_link";
};
export type MeetingSource = (typeof MeetingSource)[keyof typeof MeetingSource];
export declare const MeetingEditScope: {
    readonly THIS: "this";
    readonly FUTURE: "future";
    readonly ALL: "all";
};
export type MeetingEditScope = (typeof MeetingEditScope)[keyof typeof MeetingEditScope];
export declare const MeetingAudience: {
    readonly COMMUNITY: "COMMUNITY";
    readonly PUBLIC: "PUBLIC";
};
export declare const ProgressStatus: {
    readonly NOT_STARTED: "not_started";
    readonly IN_PROGRESS: "in_progress";
    readonly CAUGHT_UP: "caught_up";
    readonly COMPLETED: "completed";
};
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];
export declare const OpenRouterKeyLimitReset: {
    readonly NONE: "none";
    readonly DAILY: "daily";
    readonly WEEKLY: "weekly";
    readonly MONTHLY: "monthly";
};
export type OpenRouterKeyLimitReset = (typeof OpenRouterKeyLimitReset)[keyof typeof OpenRouterKeyLimitReset];
/** Fields any authenticated user can read via GET /lms/students/me/settings */
export type UserSettings = {
    openRouterKey?: string;
    theme?: UserTheme;
};
export type Student = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    avatarSourceUrl: string | null;
    oauthProvider: OAuthProvider;
    oauthProviderId: string;
    role: UserRole;
    status: StudentStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    settings?: UserSettings;
};
export type EnrollmentCounts = {
    active: number;
    pendingOnboarding: number;
    removed: number;
    total: number;
};
export type Cohort = {
    cohortSlug: string;
    cohortId?: string;
    campName: string;
    cohortName: string;
    format: CohortFormat;
    unitLabel: UnitLabel;
    /**
     * Brief camp summary — populated at cohort-creation time from camp metadata
     * (programs.ts in wizcamp-web). Admins may override per cohort.
     */
    description: string | null;
    startDate: string;
    endDate: string;
    /** Camp hero image — public CDN URL. Replaces the former imageUrl string field. */
    image: MediaImage | null;
    /** Camp promo video — public CDN URL. Optional; shown on the cohort landing page. */
    video: MediaVideo | null;
    /** Structured difficulty level — copied from camp metadata at cohort-creation time. */
    level: CampLevel | null;
    status: CohortStatus;
    createdAt: string;
    updatedAt: string;
};
/** Lean cohort row for list endpoints — carries pre-aggregated counts that are
 *  efficient to compute at list-query time but do not belong on the entity. */
export type CohortSummary = {
    cohortSlug: string;
    campName: string;
    cohortName: string;
    format: CohortFormat;
    unitLabel: UnitLabel;
    status: CohortStatus;
    startDate: string;
    endDate: string;
    unitCount: number;
    enrollmentCounts: EnrollmentCounts;
};
export type Unit = {
    unitId: string;
    cohortSlug: string;
    title: string;
    description: string | null;
    position: number;
    isLocked: boolean;
    createdAt: string;
    updatedAt: string;
};
export type Enrollment = {
    enrollmentId: string;
    cohortSlug: string;
    campName: string;
    cohortName: string;
    studentId: string | null;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string | null;
    parentEmail: string | null;
    status: EnrollmentStatus;
    externalOrderId: string | null;
    externalPaymentId: string | null;
    enrolledAt: string;
    onboardedAt: string | null;
    removedAt: string | null;
    updatedAt: string;
};
export type PageVideo = {
    sourceType: VideoSourceType;
    url?: string;
    loomVideoId?: string;
    youtubeVideoId?: string;
    posterUrl?: string;
    recommendedSpeed?: number;
    duration?: number;
    filename?: string;
    title?: string;
};
/** Lightweight video descriptor for list/TOC contexts — sourceType + duration only.
 *  Full URL resolution is unnecessary for sidebar/badge rendering. */
export type VideoMeta = {
    sourceType: VideoSourceType;
    duration?: number;
};
export type Page = {
    cohortSlug: string;
    slug: string;
    pageId: string;
    unitId: string;
    title: string;
    position: number;
    status: PageStatus;
    layout: PageLayout;
    video?: PageVideo;
    createdAt: string;
    updatedAt: string;
    version: number;
};
/** Navigation-ready page descriptor. Used in admin and student contexts.
 *  Replaces the retired PageTOCItem — named for what it models, not the UI widget that displays it.
 *  video is VideoMeta (not PageVideo) — only source type + duration needed for TOC/sidebar rendering. */
export type PageSummary = {
    pageId: string;
    slug: string;
    title: string;
    position: number;
    status: PageStatus;
    layout: PageLayout;
    video?: VideoMeta;
};
export type MediaPoster = {
    s3Key: string;
    sizeBytes: number;
};
export type Media = {
    mediaId: string;
    s3Key: string;
    kind: MediaKind;
    title: string;
    alt: string | null;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    duration: number | null;
    poster: MediaPoster | null;
    createdAt: string;
};
/** Media record resolved for client consumption — storage internals removed, URLs added. */
export type ResolvedMedia = Omit<Media, 's3Key' | 'poster' | 'createdAt'> & {
    url: string;
    posterUrl: string | null;
};
export type MeetingCohort = Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName' | 'status' | 'startDate' | 'endDate'>;
export type MeetingAudience = typeof MeetingAudience[keyof typeof MeetingAudience] | MeetingCohort;
export type Meeting = {
    meetingId: string;
    title: string;
    agenda: string | null;
    joinUrl: string;
    passcode: string | null;
    startTime: string;
    durationMinutes: number;
    meetingType: MeetingType;
    source: MeetingSource;
    providerMeetingId: string | null;
    occurrenceId: string | null;
    recordingUrl: string | null;
    recordingPasscode: string | null;
    audiences: MeetingAudience[];
    createdAt: string;
    updatedAt: string;
};
export type MeetingSlot = Pick<Meeting, 'meetingId' | 'joinUrl' | 'startTime' | 'durationMinutes' | 'title' | 'agenda' | 'meetingType' | 'recordingUrl' | 'recordingPasscode'> & {
    cohortSlug: string | null;
    campName: string | null;
};
export type PublicMeeting = Omit<Meeting, 'joinUrl' | 'passcode' | 'source' | 'providerMeetingId' | 'occurrenceId' | 'createdAt' | 'updatedAt'> & {
    joinUrl?: string;
    passcode?: string;
};
export type AuthUser = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    oauthProvider: OAuthProvider;
    role: UserRole;
    settings?: UserSettings;
    /** Present only during ephemeral student impersonation. */
    impersonation?: {
        adminStudentId: string;
        adminEmail: string;
        targetStudentId: string;
        targetEmail: string;
    };
};
export type MagicLinkValidation = {
    valid: true;
    returning: boolean;
    contactEmail: string;
    cohortName: string;
    campName: string;
    enrollmentId: string;
    cohortSlug: string;
};
/** Unified student-facing page in a cohort curriculum.
 *  Replaces StudentPage in new codepaths. firstVisitedAt is write-once (first visit);
 *  lastVisitedAt tracks the most recent visit for toStudentProgress's lastPage. */
export type CurriculumPage = PageSummary & {
    unitId: string;
    firstVisitedAt: string | null;
    lastVisitedAt: string | null;
};
/** Unified student-facing unit in a cohort curriculum.
 *  Locked units are present as descriptors; their pages carry null visit timestamps.
 *  description is optional (vs Unit's string | null) — absent means not set, never rendered. */
export type CurriculumUnit = {
    unitId: string;
    title: string;
    position: number;
    isLocked: boolean;
    description?: string;
    pages: CurriculumPage[];
};
/** Canonical student-facing curriculum for a cohort.
 *  The cohort sub-object is lean — carries only unitLabel and status beyond
 *  standard identity fields (the two fields toStudentProgress requires). */
export type CohortCurriculum = {
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName' | 'unitLabel' | 'status'>;
    units: CurriculumUnit[];
};
/** Admin curriculum tree — all units with nested pages, including drafts.
 *  Admin* justified: contains draft Page objects never visible on student surfaces. */
export type AdminCurriculum = (Unit & {
    pages: Page[];
})[];
export type ProgressSummary = {
    pagesVisited: number;
    pagesAvailable: number;
    progressPct: number;
    unlockedUnits: number;
    totalUnits: number;
    dripPct: number;
    status: ProgressStatus;
};
/** Resolved navigation target embedded in StudentProgress.
 *  Carries enough context for any surface to render a rich label
 *  (e.g. "Session 4 · Web Basics") without a local curriculum lookup.
 *  Constructed exclusively by toStudentProgress. */
export type ResumeTarget = {
    slug: string;
    title: string;
    unitTitle: string;
    unitPosition: number;
    unitLabel: string;
    pagePosition: number;
};
/** Student progress snapshot for a single cohort enrollment.
 *  Extends ProgressSummary with a computed navigation target — student-surface only.
 *  resumeTarget is derived from the full curriculum walk; it has no meaning on
 *  admin roster rows or any surface that doesn't need a CTA destination.
 *  No external curriculum lookup required at call sites. */
export type StudentProgress = ProgressSummary & {
    resumeTarget: ResumeTarget | null;
};
export declare function isStudentProgress(p: ProgressSummary | StudentProgress): p is StudentProgress;
/** Narrowed input for toStudentProgress — only the fields the function actually reads. */
export type ProgressInput = {
    cohort: {
        unitLabel: UnitLabel;
    };
    units: CurriculumUnit[];
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
export declare function toStudentProgress(curriculum: ProgressInput): StudentProgress;
/** A student's situated view of a cohort they are enrolled in.
 *  Dashboard populates progress: ProgressSummary — no classmates, no meetings.
 *  Cohort landing populates progress: StudentProgress, classmates, meetings.
 *  Consumers that need resumeTarget use isStudentProgress(progress) guard. */
export type EnrolledCohort = {
    cohort: Cohort;
    enrollment: Pick<Enrollment, 'enrollmentId' | 'status' | 'enrolledAt' | 'cohortSlug'>;
    progress: ProgressSummary | StudentProgress;
    classmates?: Pick<Student, 'firstName' | 'avatarUrl'>[];
    meetings?: MeetingSlot[];
};
/** Portal dashboard payload — GET /lms/students/me.
 *  cohorts contains EnrolledCohort views — not raw enrollment records.
 *  meetings is the full windowed meeting feed (cohort-scoped + community/public). */
export type PortalDashboard = {
    cohorts: EnrolledCohort[];
    meetings: MeetingSlot[];
};
/** One enrolled student's row in the admin cohort roster. */
export type CohortMember = {
    enrollment: Enrollment;
    progress: ProgressSummary;
};
/** Admin operational view of a cohort — GET /lms/admin/cohorts/:slug. */
export type AdminCohortView = {
    cohort: Cohort;
    units: AdminCurriculum;
    roster: CohortMember[];
};
/** Student record with full enrollment history across all cohorts. */
export type AdminStudent = Student & {
    enrollments: Enrollment[];
};
/** Response from GET /lms/admin/learn/:cohortSlug/:pageSlug — admin preview context.
 *  Carries the full curriculum tree for the preview shell sidebar. */
export type AdminPreview = {
    page: Page & {
        mdxContent: string;
        video?: PageVideo;
    };
    unit: Pick<Unit, 'unitId' | 'title' | 'position' | 'isLocked'> & {
        pages: PageSummary[];
    };
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName'>;
    curriculum: (Pick<Unit, 'unitId' | 'title' | 'position' | 'isLocked'> & {
        pages: PageSummary[];
    })[];
    resolvedMedia?: Record<string, ResolvedMedia | null>;
};
export type PageSource = Page & {
    mdxContent: string;
    /** Raw videoSource map for the editor — present when layout === 'video'. */
    videoSource?: VideoSource;
    /** Cohort display strings for breadcrumb rendering — eliminates second fetch on page editor. */
    cohort: Pick<Cohort, 'campName' | 'cohortName'>;
};
/** Slim response for student article body. Used on the student learn path.
 *  The learn chrome gets curriculum/unit metadata from the TQ cache, not this payload. */
export type PageContent = {
    page: Pick<Page, 'pageId' | 'slug' | 'title' | 'layout'> & {
        video?: PageVideo;
        mdxContent: string;
    };
    unit: Pick<Unit, 'unitId' | 'title' | 'position'>;
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName'>;
    resolvedMedia?: Record<string, ResolvedMedia | null>;
};
export type CreateMeetingInput = {
    title: string;
    agenda?: string;
    meetingType: MeetingType;
    source: MeetingSource;
    startTime: string;
    durationMinutes: number;
    joinUrl?: string;
    passcode?: string;
    audiences: string[];
};
export type CreateRecurringMeetingInput = CreateMeetingInput & {
    recurrence: {
        type: 1 | 2 | 3;
        repeatInterval: number;
        weeklyDays?: string;
        endTimes?: number;
        endDateTime?: string;
    };
};
export type CreateRecurringMeetingResponse = {
    meetings: Meeting[];
    seriesId: string;
};
/** Query parameters for GET /lms/admin/meetings */
export type MeetingListParams = {
    from?: string;
    to?: string;
    audienceId?: string;
};
export type RemoveAudienceResponse = {
    deleted: boolean;
};
/** One page view record — returned as part of CohortEngagement bulk response. */
export type PageView = {
    studentId: string;
    pageId: string;
    firstVisitedAt: string;
    lastVisitedAt: string;
    visitCount: number;
};
/** Response from GET /lms/admin/cohorts/:cohortSlug/engagement */
export type CohortEngagement = {
    cohortSlug: string;
    views: PageView[];
};
export type PresignResult = {
    presignedUrl: string;
    s3Key: string;
    mediaId: string;
};
export type MediaConfirmInput = {
    mediaId: string;
    s3Key: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    poster?: MediaPoster;
};
export type MediaSignResult = Record<string, ResolvedMedia | null>;
/** PATCH /lms/admin/media/:mediaId — updatable metadata fields. */
export type UpdateMediaInput = {
    title?: string;
    alt?: string;
};
/** Fields only the admin endpoint returns */
export type AdminOnlySettings = {
    aiModel?: string;
    aiSystemPrompt?: string;
    editorAutoSave?: 'live' | 'auto' | 'manual';
    editorValidateOnType?: boolean;
};
/** Full map — what GET /lms/admin/settings returns */
export type AdminSettings = UserSettings & AdminOnlySettings;
/**
 * Complete AI API key metadata — SDK-verified against OpenRouter GetKeyData.
 * Field names match the SDK's camelCase exactly (limit, not limitUsd).
 *
 * Returned by:
 *   GET /lms/admin/students/:studentId/ai-key
 *
 * Returns null when no key is provisioned for the student.
 */
export type OpenRouterKeyMetadata = {
    hash: string;
    name: string;
    label: string;
    usage: number;
    usageDaily: number;
    usageWeekly: number;
    usageMonthly: number;
    limit: number | null;
    limitRemaining: number | null;
    limitReset: OpenRouterKeyLimitReset;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    disabled: boolean;
};
/** PATCH /lms/admin/students/:studentId/settings/api-key — SDK-verified against UpdateKeysRequestBody. */
export type OpenRouterKeyUpdateInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    disabled?: boolean;
};
/** POST /lms/admin/students/:studentId/settings/api-key — SDK-verified against CreateKeysRequestBody. */
export type OpenRouterKeyProvisionInput = {
    name?: string;
    limit?: number | null;
    limitReset?: OpenRouterKeyLimitReset;
    expiresAt?: string | null;
};
/** POST /lms/admin/students/:studentId/settings/api-key — provision response.
 *  Extends OpenRouterKeyMetadata with the plaintext key, which is only available at
 *  creation time and is never returned again. */
export type OpenRouterKeyProvisionResult = OpenRouterKeyMetadata & {
    apiKey: string;
};
/** AI model option — used by OpenRouter (and potentially other providers) to
 *  describe an available model. The backend returns an array of these so the
 *  frontend can render a model picker without duplicating the shape. */
export type OpenRouterModelOption = {
    id: string;
    name: string;
};
/** DELETE /lms/admin/cohorts/:cohortId/units/:unitId — includes cascade counts. */
export type UnitDeleteResponse = {
    success: true;
    deletedPageCount: number;
};
/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type AdminEnrollmentCreateResponse = {
    enrollment: Enrollment;
    onboardingMode: OnboardingMode;
    tokenSent: boolean;
    emailError?: string;
};
//# sourceMappingURL=index.d.ts.map