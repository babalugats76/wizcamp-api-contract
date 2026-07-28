// packages/api-contract/src/common/index.ts

/**
 * Generic utilities shared across all domains.
 * These types are domain-agnostic and have no surface-specific meaning.
 */

// ─── Base media primitives ────────────────────────────────────────────────────────────────────────────────
//
// Serializable references to public media resources. These types are shared
// across wizcamp-lms, wizcamp-backend, and wizcamp-web. They intentionally do
// NOT extend DOM interfaces (HTMLImageElement, HTMLVideoElement) which carry
// behavioral properties meaningless in a JSON payload.
//
// Naming follows the Media namespace to avoid collision with React/Next.js
// component names (Image, Video) and DOM types.

/** A serializable reference to a public image resource. */
export type MediaImage = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** A serializable reference to a public video resource. */
export type MediaVideo = {
  url: string;
  posterUrl?: string;
  title?: string;
  durationSeconds?: number;  // always seconds — display formatting ("3:45") is a UI concern
};

// ─── Camp level ──────────────────────────────────────────────────────────────────────────────────────

/** Difficulty level number — 1 (beginner) through 5 (advanced). */
export type CampLevelNumber = 1 | 2 | 3 | 4 | 5;

export const CampLevelColor = {
  EMERALD: 'emerald',
  SKY:     'sky',
  AMBER:   'amber',
  ROSE:    'rose',
  VIOLET:  'violet',
} as const;
export type CampLevelColor = (typeof CampLevelColor)[keyof typeof CampLevelColor];

/**
 * Structured camp difficulty level — serializable, no React component references.
 * The display icon is resolved client-side from the `level` number and is never
 * stored or transmitted.
 */
export type CampLevel = {
  level: CampLevelNumber;
  name: string;    // e.g. "Builder"
  tagline: string; // e.g. "Time to create."
  color: CampLevelColor;
};

// ─── Pagination + API response wrappers ──────────────────────────────────────────────────────────────
export type Paginated<T> = {
  items: T[];
  count: number;
  lastKey?: string;
};

export type APISuccessResponse<T> = {
  success: true;
  data: T;
  statusCode: number;
  message: string;
};

export type APIErrorResponse = {
  success: false;
  message: string;
  statusCode: number;
  service?: string;
  fields?: string[];
};

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;
