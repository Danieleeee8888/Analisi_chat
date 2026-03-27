import type { ContextFormData } from "./context-form-types";

export const PREVIEW_SESSION_KEY = "subtext:preview:v1";

/** Payload salvato in sessionStorage dopo `/api/process-chat` (solo client). */
export interface PreviewSessionPayload {
  anonymizedChat: string;
  metrics: unknown;
  formData: ContextFormData;
  participantMap: string[];
}

export function parsePreviewPayload(raw: string | null): PreviewSessionPayload | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as PreviewSessionPayload;
    if (
      typeof data.anonymizedChat !== "string" ||
      data.metrics == null ||
      typeof data.formData !== "object" ||
      !Array.isArray(data.participantMap)
    ) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
