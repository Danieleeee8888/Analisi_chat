"use client";

import { useSearchParams } from "next/navigation";
import { UploadFlow } from "@/components/UploadFlow";
import { audienceFromQueryParam } from "@/lib/context-form-types";

export function UploadPageClient() {
  const sp = useSearchParams();
  const audienceSegment = audienceFromQueryParam(sp.get("audience"));

  return <UploadFlow audienceSegment={audienceSegment} />;
}
