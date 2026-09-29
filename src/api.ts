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

import { z } from 'zod';

export const APISuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    statusCode: z.number(),
    message: z.string(),
  });

export const APIErrorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  statusCode: z.number(),
  service: z.string().optional(),
  fields: z.array(z.string()).optional(),
});

export const APIResponseSchema = z.discriminatedUnion('success', [
  APISuccessResponseSchema(z.unknown()),
  APIErrorResponseSchema,
]);

export type APISuccessResponse<T> = {
  success: true;
  data: T;
  statusCode: number;
  message: string;
};

export type APIErrorResponse = z.infer<typeof APIErrorResponseSchema>;

export type APIResponse<T> = APISuccessResponse<T> | APIErrorResponse;

export type Envelope<T> =
  | { success: true; data: T }
  | {
      success: false;
      statusCode: number;
      message: string;
      reason: 'rejected' | 'transport';
      service?: string;
      fields?: string[];
    };

/**
 * Parses a fetch Response into an Envelope<T>. Never throws.
 *
 * RSC fetch paths MUST go through this function — the backend always returns
 * HTTP 200 for application-level errors, so `res.ok` is never false for a
 * business error. Checking `res.ok` alone and casting `.data` is a live bug.
 */
export async function parseEnvelope<T>(res: Response): Promise<Envelope<T>> {
  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return {
      success: false,
      statusCode: res.status,
      message: res.ok ? 'Malformed response from server' : `Upstream error (${res.status})`,
      reason: 'transport',
    };
  }

  const parsed = APIResponseSchema.safeParse(json);

  if (parsed.success) {
    const env = parsed.data;
    if (env.success) return { success: true, data: env.data as T };
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
  return { success: true, data: json as T };
}