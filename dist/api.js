"use strict";
// src/api.ts
//
// The HTTP wire envelope. Every request and response in this system goes
// through this shape — on both success and failure, with zero exceptions.
//
// TWO TYPES, NOT ONE:
//
// `APIResponse<T>` is the wire shape — what hono-envelope.ts serializes.
// `Envelope<T>` is the client-side parsed and classified form. It is NEVER
// serialized. `reason` does not exist on the wire — it is information the
// client adds while narrowing a failure into "the backend rejected this"
// vs "we could not reach the backend at all." Do not merge these two types.
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIResponseSchema = exports.APIErrorResponseSchema = exports.APISuccessResponseSchema = void 0;
exports.parseEnvelope = parseEnvelope;
const zod_1 = require("zod");
const APISuccessResponseSchema = (dataSchema) => zod_1.z.object({
    success: zod_1.z.literal(true),
    data: dataSchema,
    statusCode: zod_1.z.number(),
    message: zod_1.z.string(),
});
exports.APISuccessResponseSchema = APISuccessResponseSchema;
exports.APIErrorResponseSchema = zod_1.z.object({
    success: zod_1.z.literal(false),
    message: zod_1.z.string(),
    statusCode: zod_1.z.number(),
    service: zod_1.z.string().optional(),
    fields: zod_1.z.array(zod_1.z.string()).optional(),
});
exports.APIResponseSchema = zod_1.z.discriminatedUnion('success', [
    (0, exports.APISuccessResponseSchema)(zod_1.z.unknown()),
    exports.APIErrorResponseSchema,
]);
/**
 * Parses a fetch Response into an Envelope<T>. Never throws.
 *
 * RSC fetch paths MUST go through this function — the backend always returns
 * HTTP 200 for application-level errors, so `res.ok` is never false for a
 * business error. Checking `res.ok` alone and casting `.data` is a live bug.
 */
async function parseEnvelope(res) {
    let json;
    try {
        json = await res.json();
    }
    catch {
        return {
            success: false,
            statusCode: res.status,
            message: res.ok ? 'Malformed response from server' : `Upstream error (${res.status})`,
            reason: 'transport',
        };
    }
    const parsed = exports.APIResponseSchema.safeParse(json);
    if (parsed.success) {
        const env = parsed.data;
        if (env.success)
            return { success: true, data: env.data };
        return {
            success: false,
            statusCode: env.statusCode,
            message: env.message,
            reason: 'rejected',
            ...(env.service && { service: env.service }),
            ...(env.fields && { fields: env.fields }),
        };
    }
    if (!res.ok) {
        return {
            success: false,
            statusCode: res.status,
            message: 'Request failed',
            reason: 'transport',
        };
    }
    // 2xx but did not match the schema — treat raw body as payload.
    // Compatibility branch for any endpoint not yet wrapped in the envelope.
    // Delete once every route is confirmed enveloped.
    return { success: true, data: json };
}
//# sourceMappingURL=api.js.map