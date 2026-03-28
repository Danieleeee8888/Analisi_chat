"use client";

import { useSearchParams } from "next/navigation";
import { UploadFlow } from "@/components/UploadFlow";
import {
  audienceFromQueryParam,
  focusFromQueryParam,
  isEnterpriseFocus
} from "@/lib/context-form-types";

export function UploadPageClient() {
  const sp = useSearchParams();
  const focusParam = focusFromQueryParam(sp.get("focus"));
  const audienceParam = audienceFromQueryParam(sp.get("audience"));

  const audienceSegment = isEnterpriseFocus(focusParam) ? "enterprise" : audienceParam;

  return <UploadFlow audienceSegment={audienceSegment} focus={focusParam} />;
}
