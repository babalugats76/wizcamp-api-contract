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
    durationSeconds?: number;
};
//# sourceMappingURL=media.d.ts.map