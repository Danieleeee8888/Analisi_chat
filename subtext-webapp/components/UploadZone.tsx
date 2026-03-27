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
          "flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          disabled
            ? "cursor-not-allowed border-stone-200 bg-stone-100/80 opacity-70"
            : [
                "cursor-pointer",
                isDragging
                  ? "border-stone-500 bg-stone-100"
                  : "border-stone-300 bg-white hover:border-stone-400 hover:bg-stone-50/80"
              ].join(" ")
        ].join(" ")}
      >
        <span className="text-sm font-medium text-stone-800">
          Trascina qui il file .zip
        </span>
        <span className="mt-1 text-xs text-stone-500">
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
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      {file && !error && (
        <div className="rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-700 shadow-sm">
          <p className="font-medium text-stone-900">{file.name}</p>
          <p className="text-stone-500">{formatFileSize(file.size)}</p>
          <button
            type="button"
            disabled={disabled}
            onClick={() => {
              setError(null);
              onFileChange(null);
            }}
            className="mt-2 text-xs font-medium text-stone-600 underline hover:text-stone-900"
          >
            Rimuovi file
          </button>
        </div>
      )}
    </div>
  );
}
