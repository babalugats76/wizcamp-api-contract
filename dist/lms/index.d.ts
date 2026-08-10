/**
 * LMS domain types — entities, enums, and view DTOs.
 * Consumed via the LMS namespace: import type { LMS } from '@wizcamp/api-contract'
 * Or via subpath: import type { Cohort } from '@wizcamp/api-contract/lms'
 *
 * Naming conventions:
 * - Core entities: bare name (Cohort, Unit, Page) — namespace provides domain context
 * - Enums: bare name (CohortStatus, EnrollmentStatus)
 * - Surface DTOs: surface prefix (AdminCohortDetail, StudentDashboard)
 * - Building blocks: bare name (EnrollmentCounts, MeetingSlot)
 * - Auth types: Auth prefix (AuthUser)
 */
import type { MediaImage, MediaVideo, CampLevel } from '../common';
import { CampLevelColor } from '../common';
export type { CampLevelColor };
export declare const AiKeyLimitReset: {
    readonly NONE: "none";
    readonly DAILY: "daily";
    readonly WEEKLY: "weekly";
    readonly MONTHLY: "monthly";
};
export type AiKeyLimitReset = (typeof AiKeyLimitReset)[keyof typeof AiKeyLimitReset];
export declare const CohortStatus: {
    readonly DRAFT: "draft";
    readonly ACTIVE: "active";
    readonly CONCLUDED: "concluded";
};
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];
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
export declare const EnrollmentStatus: {
    readonly PENDING_ONBOARDING: "pending_onboarding";
    readonly ACTIVE: "active";
    readonly REMOVED: "removed";
};
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];
export declare const ProgressStatus: {
    readonly NOT_STARTED: "not_started";
    readonly IN_PROGRESS: "in_progress";
    readonly CAUGHT_UP: "caught_up";
    readonly COMPLETED: "completed";
};
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];
export type OAuthProvider = 'google' | 'github';
export type OnboardingMode = 'activation' | 'access';
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
export type MeetingAudience = 'COMMUNITY' | 'PUBLIC' | MeetingCohort;
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
export declare const MediaKind: {
    readonly VIDEO: "video";
    readonly IMAGE: "image";
    readonly FILE: "file";
};
export type MediaKind = (typeof MediaKind)[keyof typeof MediaKind];
export declare const StudentRole: {
    readonly STUDENT: "student";
    readonly ADMIN: "admin";
};
export type StudentRole = (typeof StudentRole)[keyof typeof StudentRole];
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
export type Student = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    avatarSourceUrl: string | null;
    oauthProvider: OAuthProvider;
    oauthProviderId: string;
    role: StudentRole;
    status: StudentStatus;
    createdAt: string;
    updatedAt: string;
    lastLoginAt: string | null;
    settings?: UserSettings;
};
export type EnrollmentCounts = {
    active: number;
    pending_onboarding: number;
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
    unitCount: number;
    enrollmentCounts: EnrollmentCounts;
    meetings?: Meeting[];
    createdAt: string;
    updatedAt: string;
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
    studentId: string | null;
    contactEmail: string;
    studentFirstName: string;
    studentLastName: string;
    parentEmail: string | null;
    status: EnrollmentStatus;
    externalOrderId: string | null;
    externalPaymentId: string | null;
    enrolledAt: string;
    onboardedAt: string | null;
    removedAt: string | null;
    updatedAt: string;
};
/** Enrollment with joined cohort + student context (resolved by backend). */
export type AdminEnrollment = Enrollment & {
    campName: string;
    cohortName: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    /** OAuth-verified email from StudentEntity (present when student is bound). */
    studentEmail: string | null;
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
/**
 * Lightweight video descriptor for list/TOC contexts where full URL resolution
 * is unnecessary. Only carries what the curriculum sidebar needs to render
 * the video badge (source icon + duration).
 */
export type PageVideoSummary = {
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
export type AuthUser = {
    studentId: string;
    email: string;
    firstName: string;
    lastName: string;
    avatarUrl: string;
    oauthProvider: OAuthProvider;
    role: StudentRole;
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
export type AdminCohortDetail = {
    cohort: Cohort;
    units: Unit[];
    enrollmentSummary: EnrollmentCounts;
};
export type StudentCohortDetail = {
    cohort: Cohort;
    roster: Pick<Student, 'firstName' | 'avatarUrl'>[];
    enrollment: Pick<Enrollment, 'enrollmentId' | 'status' | 'enrolledAt'>;
    progress: StudentProgress;
};
export type MeetingCohort = Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName' | 'status' | 'startDate' | 'endDate'>;
export type PublicMeeting = Omit<Meeting, 'joinUrl' | 'passcode' | 'source' | 'providerMeetingId' | 'occurrenceId' | 'createdAt' | 'updatedAt'> & {
    joinUrl?: string;
    passcode?: string;
};
export type MeetingSlot = Pick<Meeting, 'meetingId' | 'joinUrl' | 'startTime' | 'durationMinutes' | 'title' | 'agenda' | 'meetingType' | 'recordingUrl' | 'recordingPasscode'>;
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
export type DashboardEnrollment = {
    enrollmentId: Enrollment['enrollmentId'];
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName' | 'startDate' | 'endDate' | 'image' | 'status' | 'unitLabel'> & {
        totalUnits: number;
        unlockedUnits: number;
    };
};
/** Meeting enriched with cohort context — used on the student dashboard. */
export type DashboardMeeting = Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName'> & MeetingSlot;
export type StudentDashboard = {
    student: Pick<Student, 'studentId' | 'firstName' | 'lastName' | 'avatarUrl' | 'email'>;
    enrollments: DashboardEnrollment[];
    meetings: DashboardMeeting[];
};
/** Navigation-ready page descriptor. Used in admin and student contexts.
 *  Base type extended by StudentPage for student-specific visit state.
 *  Replaces the retired PageTOCItem — named for what it models, not the UI widget that displays it. */
export type PageSummary = {
    pageId: string;
    slug: string;
    title: string;
    position: number;
    status: PageStatus;
    layout: PageLayout;
    video?: PageVideoSummary;
};
/** A page from a student's perspective — extends PageSummary with personal visit state.
 *  visitedAt: null = unlocked but unvisited. ISO 8601 string = timestamp of first visit.
 *  Used in AdminPreviewPage when fetched in admin preview context.
 *  Never present in student contexts — students use StudentCohortPage with firstVisitedAt/lastVisitedAt. */
export type StudentPage = PageSummary & {
    visitedAt: string | null;
};
/** Unified student-facing page in a cohort curriculum.
 *  Replaces StudentPage in new codepaths. firstVisitedAt is write-once (first visit);
 *  lastVisitedAt tracks the most recent visit for toStudentProgress's lastPage. */
export type StudentCohortPage = {
    pageId: string;
    slug: string;
    title: string;
    position: number;
    status: PageStatus;
    layout: PageLayout;
    video?: PageVideoSummary;
    firstVisitedAt: string | null;
    lastVisitedAt: string | null;
};
/** Unified student-facing unit in a cohort curriculum.
 *  Locked units are present as descriptors; their pages carry null visit timestamps. */
export type StudentCohortUnit = {
    unitId: string;
    title: string;
    position: number;
    isLocked: boolean;
    description?: string;
    pageCount: number;
    pages: StudentCohortPage[];
};
/** Canonical student-facing curriculum for a cohort.
 *  The cohort sub-object is lean — carries only unitLabel and status beyond
 *  standard identity fields (the two fields toStudentProgress requires). */
export type StudentCohortCurriculum = {
    cohort: {
        cohortSlug: string;
        campName: string;
        cohortName: string;
        unitLabel: UnitLabel;
        status: CohortStatus;
    };
    units: StudentCohortUnit[];
};
/** Response from GET /lms/admin/learn/:cohortSlug/:pageSlug — admin preview context.
 *  Carries the full curriculum tree for the preview shell sidebar. */
export type AdminPreviewPage = {
    page: Page & {
        mdxContent: string;
        video?: PageVideo;
    };
    unit: {
        unitId: string;
        title: string;
        position: number;
        isLocked: boolean;
        pages: StudentPage[];
    };
    cohort: {
        cohortSlug: string;
        campName: string;
        cohortName: string;
    };
    curriculum: {
        unitId: string;
        title: string;
        position: number;
        isLocked: boolean;
        pages: StudentPage[];
    }[];
    resolvedMedia?: Record<string, ResolvedMedia | null>;
};
/** Slim response for student article body. Used on the student learn path.
 *  The learn chrome gets curriculum/unit metadata from the TQ cache, not this payload. */
export type LearnPageContent = {
    page: {
        pageId: string;
        slug: string;
        title: string;
        layout: PageLayout;
        video?: PageVideo;
        mdxContent: string;
    };
    unit: Pick<Unit, 'unitId' | 'title' | 'position'>;
    cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'cohortName'>;
    resolvedMedia?: Record<string, ResolvedMedia | null>;
};
/** Admin curriculum tree — all units and all pages including drafts. */
export type AdminCurriculum = {
    units: Unit[];
    pages: Page[];
};
/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type AdminEnrollmentCreateResponse = {
    enrollment: AdminEnrollment;
    onboardingMode: OnboardingMode;
    tokenSent: boolean;
    emailError?: string;
};
/** DELETE /lms/admin/cohorts/:cohortId/units/:unitId — includes cascade counts. */
export type AdminUnitDeleteResponse = {
    success: true;
    deletedPageCount: number;
};
/** Student record with full enrollment history across all cohorts. */
export type AdminStudentDetail = Student & {
    enrollments: AdminEnrollment[];
};
export type AdminPresignResult = {
    presignedUrl: string;
    s3Key: string;
    mediaId: string;
};
export type AdminMediaConfirmInput = {
    mediaId: string;
    s3Key: string;
    filename: string;
    mimeType: string;
    sizeBytes: number;
    poster?: MediaPoster;
};
export type AdminMediaSignResult = Record<string, ResolvedMedia | null>;
/** PATCH /lms/admin/media/:mediaId — updatable metadata fields. */
export type UpdateMediaInput = {
    title?: string;
    alt?: string;
};
/** Query parameters for GET /lms/admin/meetings */
export type MeetingListParams = {
    from?: string;
    to?: string;
    audienceId?: string;
};
export type AdminPageDetail = Page & {
    mdxContent: string;
    /** Raw videoSource map for the editor — present when layout === 'video'. */
    videoSource?: VideoSource;
};
/** Fields any authenticated user can read via GET /lms/students/me/settings */
export type UserSettings = {
    openRouterKey?: string;
    theme?: UserTheme;
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
export type AiKeyMetadata = {
    hash: string;
    name: string;
    label: string;
    usage: number;
    usageDaily: number | null;
    usageWeekly: number | null;
    usageMonthly: number | null;
    limit: number | null;
    limitRemaining: number | null;
    limitReset: AiKeyLimitReset;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    disabled: boolean;
};
/** PATCH /lms/admin/students/:studentId/settings/api-key — SDK-verified against UpdateKeysRequestBody. */
export type AiKeyUpdateInput = {
    name?: string;
    limit?: number | null;
    limitReset?: AiKeyLimitReset;
    disabled?: boolean;
};
/** POST /lms/admin/students/:studentId/settings/api-key — SDK-verified against CreateKeysRequestBody. */
export type AiKeyProvisionInput = {
    name?: string;
    limit?: number | null;
    limitReset?: AiKeyLimitReset;
    expiresAt?: string | null;
};
/** POST /lms/admin/students/:studentId/settings/api-key — provision response.
 *  Extends AiKeyMetadata with the plaintext key, which is only available at
 *  creation time and is never returned again. */
export type AiKeyProvisionResult = AiKeyMetadata & {
    apiKey: string;
};
/** AI model option — used by OpenRouter (and potentially other providers) to
 *  describe an available model. The backend returns an array of these so the
 *  frontend can render a model picker without duplicating the shape. */
export type OpenRouterModelOption = {
    id: string;
    name: string;
};
export type RemoveAudienceResponse = {
    deleted: boolean;
};
/** One page view record — returned as part of CohortEngagement bulk response. */
export type PageViewSummary = {
    studentId: string;
    pageId: string;
    firstVisitedAt: string;
    lastVisitedAt: string;
    visitCount: number;
};
/** Response from GET /lms/admin/cohorts/:cohortSlug/engagement */
export type CohortEngagement = {
    cohortSlug: string;
    views: PageViewSummary[];
};
/** Resolved navigation target embedded in StudentProgress.
 *  Carries enough context for any surface to render a rich label
 *  (e.g. "Session 4 · Web Basics") without a local curriculum lookup.
 *  Constructed exclusively by toStudentProgress. */
export type StudentProgressPage = {
    slug: string;
    title: string;
    unitTitle: string;
    unitPosition: number;
    unitLabel: string;
    pagePosition: number;
};
/** Student progress snapshot for a single cohort enrollment.
 *  Self-contained — every value a progress bar or CTA needs is here.
 *  No external curriculum lookup required at call sites. */
export type StudentProgress = {
    status: ProgressStatus;
    resumeTarget: StudentProgressPage | null;
    pagesVisited: number;
    pagesAvailable: number;
    progressPct: number;
    dripPct: number;
};
/**
 * Pure isomorphic mapper — builds StudentProgress from StudentCohortCurriculum.
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
export declare function toStudentProgress(curriculum: StudentCohortCurriculum): StudentProgress;
//# sourceMappingURL=index.d.ts.map