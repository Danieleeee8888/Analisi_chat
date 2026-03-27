"use client";

import { useCallback, useId, useState } from "react";

const MAX_BYTES = 50 * 1024 * 1024;

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isZipFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return name.endsWith(".zip") || file.type === "application/zip" || file.type === "application/x-zip-compressed";
}

function UploadGlyph({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M24 14v14M17 21l7-7 7 7M14 34h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export interface UploadZoneProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  /** Durante invio API: non modificare il file. */
  disabled?: boolean;
}

export function UploadZone({ file, onFileChange, disabled }: UploadZoneProps) {
  const inputId = useId();
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    (f: File | null) => {
      if (disabled) return;
      setError(null);
      if (!f) {
        onFileChange(null);
        return;
      }
      if (!isZipFile(f)) {
        setError("Accettiamo solo file .zip (export WhatsApp).");
        onFileChange(null);
        return;
      }
      if (f.size > MAX_BYTES) {
        setError(`Il file supera il limite di ${formatFileSize(MAX_BYTES)}.`);
        onFileChange(null);
        return;
      }
      onFileChange(f);
    },
    [onFileChange, disabled]
  );

  return (
    <div className="space-y-3">
      <label
        htmlFor={inputId}
        aria-disabled={disabled}
        onDragEnter={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
          }
        }}
        onDrop={(e) => {
          if (disabled) return;
          e.preventDefault();
          setIsDragging(false);
          const dropped = e.dataTransfer.files[0];
          handleFile(dropped ?? null);
        }}
        className={[
          "upload-zone flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-12 text-center sm:px-8 sm:py-[48px]",
          disabled
            ? "cursor-not-allowed border-[var(--border)] bg-surface opacity-60"
            : [
                "cursor-pointer bg-surface",
                isDragging
                  ? "border-accent bg-accent-light"
                  : "border-[var(--border)] hover:border-accent hover:bg-accent-light",
              ].join(" "),
        ].join(" ")}
      >
        <UploadGlyph className="mb-6 text-accent" />
        <span className="font-ui text-base font-medium text-foreground">
          Trascina il file .zip
        </span>
        <span className="font-ui mt-2 text-sm text-muted">
          oppure clicca per selezionare · max {formatFileSize(MAX_BYTES)}
        </span>
        <input
          id={inputId}
          type="file"
          accept=".zip,application/zip"
          className="sr-only"
          disabled={disabled}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            handleFile(f);
            e.target.value = "";
          }}
        />
      </label>
      {error && (
        <p className="font-ui text-sm text-[var(--danger)]" role="alert">
          {error}
        </p>
      )}
      {file && !error && (
        <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 font-ui text-sm text-foreground shadow-sm">
          <p className="font-medium">{file.name}</p>
          <p className="mono mt-1 text-xs text-muted">{formatFileSize(file.size)}</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setError(null);
              onFileChange(null);
            }}
            className="nav-link mt-3 text-xs font-semibold text-accent-dark"
          >
            Rimuovi file
          </button>
        </div>
      )}
    </div>
  );
}
