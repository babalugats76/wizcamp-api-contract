// packages/api-contract/src/lms/index.ts

/**
 * LMS domain types — entities, enums, and view DTOs.
 * Consumed via the LMS namespace: import type { LMS } from '@wizcamp/api-contract'
 * Or via subpath: import type { Cohort } from '@wizcamp/api-contract/lms'
 *
 * Naming conventions:
 * - Core entities: bare name (Cohort, Unit, Page)
 * - Enums & constants: bare name (CohortStatus, EnrollmentStatus, SLUG_REGEX)
 * - Cohort* prefix: authored source / admin view — no per-student state (CohortCurriculum, CohortDetail)
 * - Student* prefix: per-student derived view — always carries enrollment or visit state
 *     (StudentCurriculum, StudentCurriculumUnit, StudentCurriculumPage, StudentCohortLanding,
 *      StudentPageContent, StudentProgress, StudentDashboard, StudentEngagement, StudentEnrollments)
 * - *Summary suffix: lean nav descriptors, surface-neutral — shared by admin and student (PageSummary, UnitSummary, CohortSummary)
 * - Composed read DTOs: *Detail suffix (CohortDetail) or descriptive noun (CohortRoster)
 * - Flat compound join types: bare name (Enrollment — enrollment + cohort + student identity)
 * - HTTP response bodies: *Response suffix
 * - Internal operation results: *Result suffix
 * - Auth types: Auth* prefix (AuthUser)
 */

import type { MediaImage, MediaVideo, CampLevel } from '../common';
import { CampLevelColor } from '../common';
export type { CampLevelColor };

// ─── Utility Types ────────────────────────────────────────────────────────────

/** Maps Date → string for JSONB-sourced rows where pg type parsers do not run. */
export type Jsonified<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends Date | null
    ? string | null
    : T[K];
};

// ─── Enums & Constants ───────────────────────────────────────────────────────

export const UserRole = {
  STUDENT: 'student',
  ADMIN:   'admin',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export type OAuthProvider = 'google' | 'github';

export type OnboardingMode = 'activation' | 'access';

export const StudentStatus = {
  ACTIVE:    'active',
  SUSPENDED: 'suspended',
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export const UserTheme = {
  LIGHT:  'light',
  DARK:   'dark',
  SYSTEM: 'system',
} as const;
export type UserTheme = (typeof UserTheme)[keyof typeof UserTheme];

export const CohortStatus = {
  DRAFT:     'draft',
  ACTIVE:    'active',
  CONCLUDED: 'concluded',
} as const;
export type CohortStatus = (typeof CohortStatus)[keyof typeof CohortStatus];

export const CohortFormat = {
  FLEX:       'flex',
  BOOT:       'boot',
  SELF_PACED: 'self-paced',
} as const;
export type CohortFormat = (typeof CohortFormat)[keyof typeof CohortFormat];

/** Regex that defines a valid cohort slug — lowercase alphanumeric with hyphens, no leading/trailing hyphens. */
export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const UnitLabel = {
  SESSION: 'Session',
  WEEK:    'Week',
  MODULE:  'Module',
  DAY:     'Day',
  PART:    'Part',
  UNIT:    'Unit',
} as const;
export type UnitLabel = (typeof UnitLabel)[keyof typeof UnitLabel];

export const EnrollmentStatus = {
  PENDING_ONBOARDING: 'pending_onboarding',
  ACTIVE:             'active',
  REMOVED:            'removed',
} as const;
export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const PageStatus = {
  DRAFT:     'draft',
  PUBLISHED: 'published',
} as const;
export type PageStatus = (typeof PageStatus)[keyof typeof PageStatus];

export const PageLayout = {
  DOC:   'doc',
  VIDEO: 'video',
} as const;
export type PageLayout = (typeof PageLayout)[keyof typeof PageLayout];

export const VideoSourceType = {
  EXTERNAL: 'external',
  HOSTED:   'hosted',
  LOOM:     'loom',
  YOUTUBE:  'youtube',
} as const;
export type VideoSourceType = (typeof VideoSourceType)[keyof typeof VideoSourceType];

export type VideoSource =
  | { type: typeof VideoSourceType.EXTERNAL; url: string }
  | { type: typeof VideoSourceType.HOSTED;   mediaId: string }
  | { type: typeof VideoSourceType.LOOM;     loomVideoId: string }
  | { type: typeof VideoSourceType.YOUTUBE;  youtubeVideoId: string };

export const MediaKind = {
  VIDEO: 'video',
  IMAGE: 'image',
  FILE:  'file',
} as const;
export type MediaKind = (typeof MediaKind)[keyof typeof MediaKind];

export const MeetingType = {
  CLASS:        'class',        // scheduled instructional session
  FLEX:         'flex',         // flexible/async CLASS variant — student can attend any occurrence covering same material
  OFFICE_HOURS: 'office_hours', // open Q&A / help time
  COACHING:     'coaching',     // 1:1 or small group mentoring
  WORKSHOP:     'workshop',     // hands-on focused session
  SOCIAL:       'social',       // non-instructional gathering, community building
  WEBINAR:      'webinar',      // presentation-style, potentially public-facing
  GENERAL:      'general',      // catch-all
} as const;
export type MeetingType = (typeof MeetingType)[keyof typeof MeetingType];

export const MeetingSource = {
  ZOOM_API:    'zoom_api',    // created and managed via Zoom API
  MANUAL_LINK: 'manual_link', // join URL pasted manually; no API sync available
} as const;
export type MeetingSource = (typeof MeetingSource)[keyof typeof MeetingSource];

export const MeetingEditScope = {
  THIS:   'this',   // update only this occurrence
  FUTURE: 'future', // update this and all future occurrences
  ALL:    'all',    // update all occurrences in the series
} as const;
export type MeetingEditScope = (typeof MeetingEditScope)[keyof typeof MeetingEditScope];

export const MeetingAudience = {
  COMMUNITY: 'COMMUNITY',  // LMS-wide — all verified members; joinUrl in portal only, never public
  PUBLIC:    'PUBLIC',     // open to anyone — joinUrl exposed on public marketing site
} as const;

export const ProgressStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  CAUGHT_UP:   'caught_up',
  COMPLETED:   'completed',
} as const;
export type ProgressStatus = (typeof ProgressStatus)[keyof typeof ProgressStatus];

export const OpenRouterKeyLimitReset = {
  NONE:    'none',
  DAILY:   'daily',
  WEEKLY:  'weekly',
  MONTHLY: 'monthly',
} as const;
export type OpenRouterKeyLimitReset = (typeof OpenRouterKeyLimitReset)[keyof typeof OpenRouterKeyLimitReset];

// ─── Core Entities ──────────────────────────────────────────────────────────

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
  cohortSlug: string;  // stable slug — primary identity
  campName: string;
  name: string;
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
  cohortSlug:       string;
  campName:         string;
  name:             string;
  format:           CohortFormat;
  unitLabel:        UnitLabel;
  status:           CohortStatus;
  startDate:        string;
  endDate:          string;
  unitCount:        number;
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

/**
 * Flat compound join type — enrollment row + cohort context + coalesced student identity.
 * Student identity fields are load-bearing: pending_onboarding enrollments exist before
 * a student row, so COALESCE(student.x, enrollment.x) is always required at the SQL seam.
 */
export type Enrollment = {
  // ─── Enrollment identity ──────────────────────────────────────────────────
  enrollmentId: string;
  cohortSlug: string;
  status: EnrollmentStatus;
  externalOrderId: string | null;
  externalPaymentId: string | null;
  enrolledAt: string;
  onboardedAt: string | null;
  removedAt: string | null;
  updatedAt: string;
  // ─── Cohort context ───────────────────────────────────────────────────────
  campName: string;
  cohortName: string;   // prefix for disambiguation
  unitLabel: UnitLabel;
  format: CohortFormat;
  description: string | null;
  startDate: string;
  endDate: string;
  image: MediaImage | null;
  video: MediaVideo | null;
  level: CampLevel | null;
  cohortStatus: CohortStatus;
  // ─── Student identity (coalesced) ─────────────────────────────────────────
  studentId: string | null;
  firstName: string;        // coalesced: student.firstName ?? enrollment.studentFirstName
  lastName: string;         // coalesced: student.lastName  ?? enrollment.studentLastName
  email: string;            // coalesced: student.email     ?? enrollment.contactEmail
  avatarUrl: string | null; // null until student claims enrollment via OAuth
  parentEmail: string | null;
};

export type PageVideo = {
  sourceType: VideoSourceType;
  url?: string;              // present for external (always), hosted (when CloudFront config is present)
  loomVideoId?: string;      // present when sourceType === 'loom'
  youtubeVideoId?: string;   // present when sourceType === 'youtube'
  posterUrl?: string;        // signed CloudFront URL — present for hosted source type
  recommendedSpeed?: number; // per-page playback speed (0.5–2), defaults to 1 when absent
  duration?: number;         // total seconds
  filename?: string;         // original upload filename — present for hosted source type only
  title?: string;            // media title — present for hosted source type only
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
  layout: PageLayout;  // backend always sets this — defaults to 'doc' via ElectroDB
  video?: PageVideo;         // present when layout === 'video'
  createdAt: string;
  updatedAt: string;
  version: number;    // OCC token - echo back on writes; never display
};

/** Navigation-ready page descriptor. Used in admin and student contexts.
 *  Replaces the retired PageTOCItem — named for what it models, not the UI widget that displays it.
 *  video is VideoMeta (not PageVideo) — only source type + duration needed for TOC/sidebar rendering. */
export type PageSummary = {
  pageId:   string;
  slug:     string;
  title:    string;
  position: number;
  status:   PageStatus;
  layout:   PageLayout;
  video?:   VideoMeta;
};

/** Lean unit nav descriptor — used in admin preview sidebar and PagePreview.curriculum.
 *  Symmetric with PageSummary. Surface-neutral: shared by admin preview and student shells. */
export type UnitSummary = Pick<Unit, 'unitId' | 'title' | 'position' | 'isLocked'> & {
  pages: PageSummary[];
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
  duration: number | null;  // seconds — extracted from video on confirm
  poster: MediaPoster | null;
  createdAt: string;
};

/** Media record resolved for client consumption — storage internals removed, URLs added. */
export type ResolvedMedia = Omit<Media, 's3Key' | 'poster' | 'createdAt'> & {
  url: string;
  posterUrl: string | null;
};

// ─── Meeting Types ───────────────────────────────────────────────────────────

export type MeetingCohort = Pick<Cohort,
  | 'cohortSlug'
  | 'campName'
  | 'name'
  | 'status'
  | 'startDate'
  | 'endDate'
>;

// An audience is either a sentinel string (derived from the MeetingAudience const) or a resolved cohort.
// typeof audience === 'string' → sentinel (MeetingAudience.COMMUNITY or .PUBLIC)
// typeof audience === 'object' → cohort (campName, name, etc. available directly)
export type MeetingAudience = typeof MeetingAudience[keyof typeof MeetingAudience] | MeetingCohort;

export type Meeting = {
  meetingId: string;
  title: string;
  agenda: string | null;
  joinUrl: string;
  passcode: string | null;
  startTime: string;           // UTC ISO 8601
  durationMinutes: number;
  meetingType: MeetingType;
  source: MeetingSource;
  providerMeetingId: string | null;  // Zoom series id (zoom_api source only)
  occurrenceId: string | null;       // Zoom occurrence_id (recurring zoom_api meetings only)
  recordingUrl: string | null;       // Zoom share_url — publicly accessible, no auth required
  recordingPasscode: string | null;  // Zoom recording_play_passcode
  audiences: MeetingAudience[];  // sentinels or resolved cohorts — never raw IDs on the read side
  createdAt: string;
  updatedAt: string;
};

export type MeetingSlot = Pick<Meeting,
  | 'meetingId'
  | 'joinUrl'
  | 'startTime'
  | 'durationMinutes'
  | 'title'
  | 'agenda'
  | 'meetingType'
  | 'recordingUrl'
  | 'recordingPasscode'
> & {
  cohortSlug: string | null;  // null for COMMUNITY / PUBLIC audience meetings
  campName:   string | null;  // null when cohortSlug is null
};

export type PublicMeeting = Omit<
  Meeting,
  'joinUrl' | 'passcode' | 'source' | 'providerMeetingId' | 'occurrenceId' | 'createdAt' | 'updatedAt'
> & {
  joinUrl?: string;   // present only for PUBLIC meetings
  passcode?: string;
};

// ─── Auth Types ─────────────────────────────────────────────────────────────

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
  cohortSlug: string;
  campName: string;
  cohortName: string;
  enrollmentId: string;
};

// ─── Curriculum Types ────────────────────────────────────────────────────────

/** Unified student-facing page in a cohort curriculum.
 *  Replaces StudentPage in new codepaths. firstVisitedAt is write-once (first visit);
 *  lastVisitedAt tracks the most recent visit for toStudentProgress's lastPage. */
export type StudentCurriculumPage = PageSummary & {
  unitId: string;
  firstVisitedAt: string | null;
  lastVisitedAt: string | null;
};

/** Unified student-facing unit in a cohort curriculum.
 *  Locked units are present as descriptors; their pages carry null visit timestamps.
 *  description is optional (vs Unit's string | null) — absent means not set, never rendered. */
export type StudentCurriculumUnit = {
  unitId:       string;
  title:        string;
  position:     number;
  isLocked:     boolean;
  description?: string;
  pages:        StudentCurriculumPage[];
};

/**
 * Student-facing curriculum tree — GET /lms/learn/:slug.
 *
 * Shared cache key (queryKeys.student.curriculum) for both the cohort landing
 * page and the learn shell. page-view-tracker patches firstVisitedAt /
 * lastVisitedAt optimistically on every page visit so TOC checkmarks and
 * progress visuals stay live on both surfaces without a refetch.
 *
 * cohort sub-object carries only the fields toStudentProgress requires
 * (unitLabel, status) plus standard identity.
 */
export type StudentCurriculum = {
  cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name' | 'unitLabel' | 'status'>;
  units: StudentCurriculumUnit[];
};

// ─── Progress Types ─────────────────────────────────────────────────────────

export type ProgressSummary = {
  pagesVisited:   number;
  pagesAvailable: number;
  progressPct:    number;
  unlockedUnits:  number;
  totalUnits:     number;
  dripPct:        number;
  status:         ProgressStatus;
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
  // ─── Navigation target ────────────────────────────────────────────────────
  // The page a CTA should link to. Always navigable — never a locked page.
  // NOT_STARTED  → first available page
  // IN_PROGRESS  → first unvisited page (forward-scan, beginning fallback)
  // CAUGHT_UP    → last visited available page
  // COMPLETED    → null (router /learn/:cohortSlug resolves destination — see #725)
  // Concluded camp → always null
  resumeTarget: ResumeTarget | null;
};

/** Narrowed input for toStudentProgress — only the fields the function actually reads. */
export type ProgressInput = {
  cohort: { unitLabel: UnitLabel };
  units: StudentCurriculumUnit[];
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
export function toStudentProgress(
  curriculum: ProgressInput,
): StudentProgress {
  const { cohort, units } = curriculum;

  // Unit lookup by unitId
  const unitById = new Map(units.map(u => [u.unitId, u]));

  const allPages = units.flatMap(u => u.pages);

  // Visited page IDs — firstVisitedAt is write-once (non-null = visited)
  const visitedIds = new Set(
    allPages.filter(p => p.firstVisitedAt !== null).map(p => p.pageId),
  );

  // Available pages — published pages in unlocked units only (drip-aware)
  const availablePages = allPages.filter(p => !unitById.get(p.unitId)?.isLocked);

  const pagesAvailable = availablePages.length;
  const pagesVisited = availablePages.filter(p => visitedIds.has(p.pageId)).length;

  // Status
  const status: ProgressStatus =
    pagesVisited === 0            ? ProgressStatus.NOT_STARTED :
    pagesVisited < pagesAvailable ? ProgressStatus.IN_PROGRESS :
    units.some(u => u.isLocked)   ? ProgressStatus.CAUGHT_UP   :
                                    ProgressStatus.COMPLETED;

  // Sort available pages by unit position then page position
  const sortedAvailable = [...availablePages].sort((a, b) =>
    (unitById.get(a.unitId)?.position ?? 0) - (unitById.get(b.unitId)?.position ?? 0) || a.position - b.position,
  );

  // Last visited available page — scoped to unlocked units so resumeTarget
  // for CAUGHT_UP is always navigable.
  const lastVisited = availablePages
    .filter(p => p.lastVisitedAt !== null)
    .reduce<StudentCurriculumPage | null>(
      (acc, p) => (!acc || p.lastVisitedAt! > acc.lastVisitedAt! ? p : acc),
      null,
    );

  // Helper: build ResumeTarget from a StudentCurriculumPage
  function toProgressPage(page: StudentCurriculumPage): ResumeTarget {
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
  function toResumeTarget(): ResumeTarget | null {
    if (status === ProgressStatus.COMPLETED) {
      return null;
    }
    if (status === ProgressStatus.CAUGHT_UP) {
      const last = sortedAvailable[sortedAvailable.length - 1];
      return last ? toProgressPage(last) : null;
    }
    // NOT_STARTED + IN_PROGRESS unified: forward-scan from lastVisited,
    // fall back to beginning (handles mid-sequence inserts and zero-visits case).
    const lastIdx = lastVisited
      ? sortedAvailable.findIndex(p => p.pageId === lastVisited.pageId)
      : -1;
    const next =
      (lastIdx >= 0 ? sortedAvailable.slice(lastIdx + 1) : [])
        .find(p => !visitedIds.has(p.pageId))
      ?? sortedAvailable.find(p => !visitedIds.has(p.pageId))
      ?? sortedAvailable[0];   // absorbs NOT_STARTED: all pages unvisited, return first
    return next ? toProgressPage(next) : null;
  }

  const unlockedUnits = units.filter(u => !u.isLocked).length;
  const totalUnits    = units.length;

  return {
    status,
    resumeTarget: toResumeTarget(),
    pagesVisited,
    pagesAvailable,
    progressPct:   pagesAvailable > 0 ? Math.round(pagesVisited / pagesAvailable * 100) : 0,
    unlockedUnits,
    totalUnits,
    dripPct:       totalUnits > 0 ? Math.round(unlockedUnits / totalUnits * 100) : 0,
  };
}

// ─── Portal DTOs ─────────────────────────────────────────────────────────────

/**
 * Student cohort landing payload — GET /lms/students/me/cohorts/:slug.
 *
 * Hero band data: cohort identity, enrollment state, progress scalars,
 * classmate strip, and schedule rail. Does NOT include the curriculum tree —
 * that is fetched separately via GET /lms/learn/:slug → StudentCurriculum and
 * cached under queryKeys.student.curriculum(cohortSlug). Both fetches fire in
 * parallel in student.service.ts so page-view-tracker can patch the curriculum
 * cache independently without invalidating this payload.
 *
 * progress: ProgressSummary scalars only — StudentProgress (resumeTarget) is
 * derived client-side from StudentCurriculum via toStudentProgress.
 * classmates: firstName + avatarUrl only — count and slice are client-side.
 * meetings: cohort-scoped slots only — community/public come from the dashboard.
 */
export type StudentCohortLanding = {
  cohort:      Cohort;
  enrollment:  Pick<Enrollment, 'enrollmentId' | 'status' | 'enrolledAt' | 'cohortSlug'>;
  progress:    ProgressSummary;
  classmates:  Pick<Student, 'firstName' | 'avatarUrl'>[];
  meetings:    MeetingSlot[];
};

/**
 * Student dashboard payload — GET /lms/students/me.
 *
 * One card per enrolled cohort plus a windowed meeting feed. cohort is the
 * full Cohort entity — no Pick needed. resumeTarget is not included; the CTA
 * links to /learn/:cohortSlug and the learn router resolves the correct page
 * server-side via toStudentProgress(StudentCurriculum).
 */
export type StudentDashboard = {
  cohorts: ({
    cohort:      Cohort;
    enrollment:  Pick<Enrollment, 'enrollmentId' | 'status' | 'enrolledAt' | 'cohortSlug'>;
    progress:    ProgressSummary;
  })[];
  meetings: MeetingSlot[];
};

// ─── Admin DTOs ──────────────────────────────────────────────────────────────

/** Admin curriculum tree — all units with nested pages, including drafts.
 *  Cohort* prefix: authored source / admin view. Contains draft Page objects
 *  never visible on student surfaces. */
export type CohortCurriculum = (Unit & { pages: Page[] })[];

/** Admin operational view of a cohort — GET /lms/admin/cohorts/:slug. */
export type CohortDetail = {
  cohort: Cohort;
  unitCount: number;
  enrollmentCounts: EnrollmentCounts;
};

/**
 * Response for GET /lms/admin/cohorts/:slug/roster.
 * Unpaginated by design — cohort sizes are bounded and the full roster is
 * needed to render the progress table and compute aggregate stats.
 * Each row is a full Enrollment extended with server-computed progress scalars
 * and last-active timestamp. lastActiveAt is null when the student has no page views.
 * Cohort identity is not included — callers already have it from CohortDetail.
 */
export type CohortRoster = (Enrollment & { progress: ProgressSummary; lastActiveAt: string | null })[];

/**
 * Student record with full enrollment history across all cohorts.
 * Admin-only — not used on student-facing surfaces.
 * Each Enrollment carries denormalized student identity fields; the overlap with
 * Student is a read-time artifact of the three-table join, not a design flaw.
 */
export type StudentEnrollments = Student & {
  enrollments: Enrollment[];
};

/** Response from GET /lms/admin/learn/:cohortSlug/:pageSlug — admin preview context.
 *  Carries the full curriculum tree for the preview shell sidebar.
 *  unit field omitted — redundant with curriculum[i]; consumers re-derive current unit by pageId. */
export type PagePreview = {
  page: Page & { mdxContent: string; video?: PageVideo };
  cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name'>;
  curriculum: UnitSummary[];
  resolvedMedia?: Record<string, ResolvedMedia | null>;
};

export type PageSource = Page & {
  mdxContent: string;
  /** Raw videoSource map for the editor — present when layout === 'video'. */
  videoSource?: VideoSource;
  /** Cohort display strings for breadcrumb rendering — eliminates second fetch on page editor. */
  cohort: Pick<Cohort, 'campName' | 'name'>;
};

/** Slim response for student article body. Used on the student learn path.
 *  The learn chrome gets curriculum/unit metadata from the TQ cache, not this payload. */
export type StudentPageContent = {
  page: Pick<Page, 'pageId' | 'slug' | 'title' | 'layout'> & { video?: PageVideo; mdxContent: string };
  unit: Pick<Unit, 'unitId' | 'title' | 'position'>;
  cohort: Pick<Cohort, 'cohortSlug' | 'campName' | 'name'>;
  resolvedMedia?: Record<string, ResolvedMedia | null>;
};

// ─── Meeting Mutations ───────────────────────────────────────────────────────

export type CreateMeetingInput = {
  title: string;
  agenda?: string;
  meetingType: MeetingType;
  source: MeetingSource;
  startTime: string;           // UTC ISO 8601 — frontend converts from wall-clock + DEFAULT_TZ
  durationMinutes: number;
  joinUrl?: string;            // required when source === 'manual_link'
  passcode?: string;
  audiences: string[];  // raw cohortIds and/or sentinel strings — resolved on read
};

export type CreateRecurringMeetingInput = CreateMeetingInput & {
  recurrence: {
    type: 1 | 2 | 3;           // 1=daily, 2=weekly, 3=monthly
    repeatInterval: number;
    weeklyDays?: string;        // comma-separated Zoom day numbers: '4' = Wednesday
    endTimes?: number;          // number of occurrences, max 60
    endDateTime?: string;       // UTC ISO 8601 — alternative to endTimes
  };
};

export type CreateRecurringMeetingResponse = {
  meetings: Meeting[];     // one Meeting per occurrence
  seriesId: string;        // providerMeetingId shared across all occurrences
};

/** Query parameters for GET /lms/admin/meetings */
export type MeetingListParams = {
  from?:       string;  // UTC ISO 8601 — start of date window (inclusive)
  to?:         string;  // UTC ISO 8601 — end of date window (inclusive)
  audienceId?: string;  // cohortId or sentinel ('COMMUNITY', 'PUBLIC')
};

// ─── Admin page editor ────────────────────────────────────────────────────────

export type RemoveAudienceResponse = {
  deleted: boolean; // true if the meeting was cascade-deleted (last audience removed), false if only unassigned
};

// ─── Engagement ─────────────────────────────────────────────────────────────

/**
 * Per-page visit record for a single student — used in StudentEngagement.
 * visitCount semantics: incremented at most once per 30-minute window per
 * student+page combination. Represents distinct visit sessions, not raw mounts.
 */
export type PageViewDetail = {
  pageId:         string;
  firstVisitedAt: string;  // UTC ISO 8601 — write-once
  lastVisitedAt:  string;  // UTC ISO 8601 — updated each session
  visitCount:     number;
};

/**
 * Per-student engagement drill-down — GET /lms/admin/cohorts/:slug/students/:studentId/engagement.
 *
 * Fetched lazily when the ProgressSheet drawer opens for a specific student.
 * progress mirrors the roster row scalar so the sheet header renders without
 * a second query. pages is the full per-page breakdown for this student in
 * this cohort only — no cross-cohort data.
 */
export type StudentEngagement = {
  cohortSlug:   string;
  studentId:    string;
  progress:     ProgressSummary;
  lastActiveAt: string | null;
  pages:        PageViewDetail[];
};

// ─── Media Operations ────────────────────────────────────────────────────────

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

// ─── Settings ────────────────────────────────────────────────────────────────

/** Fields only the admin endpoint returns */
export type AdminOnlySettings = {
  aiModel?: string;
  aiSystemPrompt?: string;
  editorAutoSave?: 'live' | 'auto' | 'manual';
  editorValidateOnType?: boolean;
};

/** Full map — what GET /lms/admin/settings returns */
export type AdminSettings = UserSettings & AdminOnlySettings;

// ─── OpenRouter ──────────────────────────────────────────────────────────────

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
  hash: string;                          // key hash — never the full key
  name: string;                          // key name set at provision time
  label: string;                         // display label
  usage: number;                         // total lifetime usage (USD)
  usageDaily: number;                    // current day usage (USD) — 0 on fresh keys
  usageWeekly: number;                   // current week usage (USD) — 0 on fresh keys
  usageMonthly: number;                  // current month usage (USD) — 0 on fresh keys
  limit: number | null;                  // credit limit (null = unlimited)
  limitRemaining: number | null;         // remaining credits (null = unlimited)
  limitReset: OpenRouterKeyLimitReset;   // reset cadence
  expiresAt: string | null;              // ISO 8601 (null = never expires)
  createdAt: string;                     // ISO 8601
  updatedAt: string;                     // ISO 8601
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

// ─── Misc Responses ─────────────────────────────────────────────────────────

/** DELETE /lms/admin/cohorts/:cohortId/units/:unitId — includes cascade counts. */
export type UnitDeleteResponse = {
  success: true;
  deletedPageCount: number;
};

/** POST /lms/admin/enrollments — enrollment + onboarding signal. */
export type EnrollmentCreateResponse = {
  enrollment: Enrollment;
  onboardingMode: OnboardingMode;
  tokenSent: boolean;
  emailError?: string;
};
