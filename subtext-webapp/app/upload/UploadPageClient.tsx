"use client";

import { useSearchParams } from "next/navigation";
import { UploadFlow } from "@/components/UploadFlow";
import { audienceFromQueryParam } from "@/lib/context-form-types";

export function UploadPageClient() {
  const sp = useSearchParams();
  const audienceSegment = audienceFromQueryParam(sp.get("audience"));

  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:max-w-3xl sm:px-6">
      <UploadFlow audienceSegment={audienceSegment} />
    </div>
  );
}
