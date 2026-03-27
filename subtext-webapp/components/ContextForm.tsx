"use client";

import { useState } from "react";
import {
  AGE_BAND_OPTIONS,
  HOW_LONG_OPTIONS,
  type ContextFormData,
  RELATIONSHIP_OPTIONS
} from "@/lib/context-form-types";

export interface ContextFormProps {
  disabled?: boolean;
  /** Disabilita campi e mostra stato invio (API). */
  isSubmitting?: boolean;
  onSubmit: (data: ContextFormData) => void;
}

const emptyForm: ContextFormData = {
  relationshipType: "coppia",
  whoAreYou: "",
  howLongKnown: "",
  liveOrWorkTogether: "no",
  ageBand: "",
  specificQuestion: ""
};

export function ContextForm({ disabled, isSubmitting, onSubmit }: ContextFormProps) {
  const [data, setData] = useState<ContextFormData>(emptyForm);
  const locked = Boolean(disabled || isSubmitting);

  const update = <K extends keyof ContextFormData>(key: K, value: ContextFormData[K]) => {
    setData((d) => ({ ...d, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locked) return;
    onSubmit(data);
  };

  const canSubmit =
    data.whoAreYou.trim().length > 0 &&
    data.howLongKnown.length > 0 &&
    data.ageBand.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="relationship" className="block text-sm font-medium text-stone-800">
          1. Tipo di relazione
        </label>
        <select
          id="relationship"
          className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          value={data.relationshipType}
          onChange={(e) => update("relationshipType", e.target.value as ContextFormData["relationshipType"])}
          disabled={locked}
        >
          {RELATIONSHIP_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="whoAreYou" className="block text-sm font-medium text-stone-800">
          2. Chi sei tu in questa chat?
        </label>
        <input
          id="whoAreYou"
          type="text"
          autoComplete="off"
          placeholder="Es. il mio nome come compare in WhatsApp"
          className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          value={data.whoAreYou}
          onChange={(e) => update("whoAreYou", e.target.value)}
          disabled={locked}
        />
      </div>

      <div>
        <label htmlFor="howLong" className="block text-sm font-medium text-stone-800">
          3. Da quanto vi sentite o conoscete?
        </label>
        <select
          id="howLong"
          className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          value={data.howLongKnown}
          onChange={(e) => update("howLongKnown", e.target.value)}
          disabled={locked}
        >
          <option value="">Seleziona…</option>
          {HOW_LONG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <fieldset disabled={locked} className="space-y-2">
        <legend className="text-sm font-medium text-stone-800">
          4. Vivete o lavorate insieme?
        </legend>
        <div className="flex gap-6 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="radio"
              name="liveTogether"
              className="text-stone-900"
              checked={data.liveOrWorkTogether === "si"}
              onChange={() => update("liveOrWorkTogether", "si")}
            />
            Sì
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-700">
            <input
              type="radio"
              name="liveTogether"
              className="text-stone-900"
              checked={data.liveOrWorkTogether === "no"}
              onChange={() => update("liveOrWorkTogether", "no")}
            />
            No
          </label>
        </div>
      </fieldset>

      <div>
        <label htmlFor="ageBand" className="block text-sm font-medium text-stone-800">
          5. Età tua e dell&apos;altra persona (fascia)
        </label>
        <select
          id="ageBand"
          className="mt-1.5 w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          value={data.ageBand}
          onChange={(e) => update("ageBand", e.target.value)}
          disabled={locked}
        >
          <option value="">Seleziona…</option>
          {AGE_BAND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="specific" className="block text-sm font-medium text-stone-800">
          6. C&apos;è qualcosa di specifico che vuoi capire?{" "}
          <span className="font-normal text-stone-500">(opzionale)</span>
        </label>
        <textarea
          id="specific"
          rows={3}
          placeholder="Es. capire se ci sono pattern dopo le litigate…"
          className="mt-1.5 w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-50"
          value={data.specificQuestion}
          onChange={(e) => update("specificQuestion", e.target.value)}
          disabled={locked}
        />
      </div>

      <button
        type="submit"
        disabled={locked || !canSubmit}
        className="w-full rounded-lg bg-stone-900 px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Elaborazione in corso…" : "Analizza"}
      </button>
      {!canSubmit && !locked && (
        <p className="text-xs text-stone-500">
          Compila i campi obbligatori (2, 3 e 5) per abilitare l&apos;analisi.
        </p>
      )}
    </form>
  );
}
