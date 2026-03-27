/**
 * Riduce il JSON metriche prima dell'invio a Claude (CURSOR_PLAN Step 7).
 * Esclude `segment_summaries` e alleggerisce `temporal_series`.
 */
export function stripMetricsForReportPayload(metrics: unknown): unknown {
  if (!metrics || typeof metrics !== "object") return metrics;
  const m = metrics as Record<string, unknown>;

  const conversation_segments = m.conversation_segments;
  let segmentsLite: Record<string, unknown> | undefined;
  if (conversation_segments && typeof conversation_segments === "object") {
    const cs = { ...(conversation_segments as Record<string, unknown>) };
    delete cs.segment_summaries;
    segmentsLite = cs;
  }

  const temporal_series = m.temporal_series;
  let tsLite: Record<string, unknown> | undefined;
  if (temporal_series && typeof temporal_series === "object") {
    const ts = temporal_series as Record<string, unknown>;
    tsLite = {
      messages_per_month: ts.messages_per_month
    };
  }

  const out: Record<string, unknown> = {
    chat_metadata: m.chat_metadata,
    participant_metrics: m.participant_metrics,
    response_dynamics: m.response_dynamics,
    questions: m.questions,
    turn_taking: m.turn_taking,
    daypart_usage: m.daypart_usage,
    lexical_signals_global: m.lexical_signals_global,
    synthetic_indices: m.synthetic_indices
  };
  if (segmentsLite) out.conversation_segments = segmentsLite;
  if (tsLite) out.temporal_series = tsLite;
  return out;
}
