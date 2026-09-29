// src/media.ts
// Cross-domain transport primitives for public media resources.
// Used by both curriculum content (curriculum.ts) and Camp listings (camp.ts).

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
  durationSeconds?: number; // always seconds — display formatting ("3:45") is a UI concern
};
