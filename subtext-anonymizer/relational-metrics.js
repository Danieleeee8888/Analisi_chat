const { parseWhatsAppChat } = require("./chat-parser");
const lexicons = require("./lexicons");

const DAY_MS = 86400000;

const DEFAULT_OPTIONS = {
  segment_gap_minutes: 180,
  long_pause_hours: 12,
  question_response_hours: 12,
  balanced_segment_min_messages_each: 2,
  long_message_thresholds: [200, 400],
  short_message_max_chars: 5,
  repair_after_tension_window: 5,
  tension_window_size: 5,
  tension_window_min_markers: 2,
  strong_caps_min_length: 10,
  strong_caps_upper_ratio: 0.7,
  night_hour_start: 0,
  night_hour_endExclusive: 6
};

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function round4(x) {
  return Math.round(x * 10000) / 10000;
}

function median(sortedArr) {
  if (!sortedArr.length) return null;
  const mid = Math.floor(sortedArr.length / 2);
  if (sortedArr.length % 2) return sortedArr[mid];
  return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
}

function percentile(sortedArr, p) {
  if (!sortedArr.length) return null;
  const idx = (sortedArr.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedArr[lo];
  return sortedArr[lo] + (sortedArr[hi] - sortedArr[lo]) * (idx - lo);
}

function calendarDayKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function monthKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function inclusiveCalendarDaysBetween(firstDate, lastDate) {
  const start = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const end = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
  return Math.max(1, Math.round((end - start) / DAY_MS) + 1);
}

function daypartLabel(d) {
  const h = d.getHours();
  if (h >= 6 && h < 12) return "mattina";
  if (h >= 12 && h < 18) return "pomeriggio";
  if (h >= 18 && h < 24) return "sera";
  return "notte";
}

function weekMondayKey(d) {
  const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  return calendarDayKey(date);
}

function segmentMessages(messages, gapMinutes) {
  const gapMs = gapMinutes * 60 * 1000;
  const segments = [];
  let cur = [];
  for (const msg of messages) {
    if (cur.length === 0) {
      cur.push(msg);
    } else {
      const prev = cur[cur.length - 1];
      if (msg.ts - prev.ts > gapMs) {
        segments.push(cur);
        cur = [msg];
      } else {
        cur.push(msg);
      }
    }
  }
  if (cur.length) {
    segments.push(cur);
  }
  return segments;
}

function countLexiconHits(body, { lemmas = [], phrases = [] }) {
  const t = body.toLowerCase();
  let n = 0;
  const byLemma = {};

  for (const phrase of phrases) {
    const p = phrase.toLowerCase();
    let idx = 0;
    let found;
    while ((found = t.indexOf(p, idx)) !== -1) {
      n += 1;
      idx = found + Math.max(1, p.length);
    }
  }

  for (const lemma of lemmas) {
    const le = lemma.toLowerCase();
    if (le.includes(" ")) {
      let idx = 0;
      let c = 0;
      while ((idx = t.indexOf(le, idx)) !== -1) {
        c += 1;
        idx += le.length;
      }
      byLemma[lemma] = c;
      n += c;
    } else {
      const re = new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRe(le)}(?![\\p{L}\\p{N}_])`, "giu");
      const m = t.match(re);
      const c = m ? m.length : 0;
      byLemma[lemma] = c;
      n += c;
    }
  }

  return { total: n, by_lemma: byLemma };
}

function messageHasQuestion(body) {
  return body.includes("?");
}

function multiQuestionCount(body) {
  return (body.match(/\?/g) || []).length;
}

function strongPunctuationHit(body) {
  if (/!!|\?\?|\?!|\!\?/.test(body)) return true;
  const letters = body.replace(/[^\p{L}]/gu, "");
  if (letters.length < DEFAULT_OPTIONS.strong_caps_min_length) return false;
  const upper = letters.replace(/[^\p{Lu}]/gu, "");
  return upper.length / letters.length >= DEFAULT_OPTIONS.strong_caps_upper_ratio;
}

function buildMessageIndexToSegment(segments) {
  const map = new Map();
  segments.forEach((seg, si) => {
    seg.forEach((m) => map.set(m._i, si));
  });
  return map;
}

function questionAnsweredInWindow(messages, segMap, segments, qIndex, options) {
  const q = messages[qIndex];
  const maxT = q.ts + options.question_response_hours * 3600 * 1000;
  const segIdx = segMap.get(qIndex);
  const segment = segments[segIdx];

  for (let j = qIndex + 1; j < messages.length; j++) {
    const m = messages[j];
    if (m.ts > maxT) break;
    if (segMap.get(j) !== segIdx) break;
    if (m.sender !== q.sender) {
      return true;
    }
  }
  return false;
}

function computeRelationalMetrics(messages, options) {
  const opt = { ...DEFAULT_OPTIONS, ...options };
  messages.forEach((m, i) => {
    m._i = i;
  });

  const participants = [...new Set(messages.map((m) => m.sender))].sort();
  if (participants.length === 0) {
    return emptyReport(opt, participants);
  }

  const firstDate = messages[0].date;
  const lastDate = messages[messages.length - 1].date;
  const date_start = calendarDayKey(firstDate);
  const date_end = calendarDayKey(lastDate);
  const timespan_days = inclusiveCalendarDaysBetween(firstDate, lastDate);

  const activeDaySet = new Set();
  const daysByParticipant = {};
  participants.forEach((p) => {
    daysByParticipant[p] = new Set();
  });

  for (const m of messages) {
    const dk = calendarDayKey(m.date);
    activeDaySet.add(dk);
    daysByParticipant[m.sender].add(dk);
  }

  const active_days = activeDaySet.size;
  const activity_ratio = timespan_days > 0 ? round4(active_days / timespan_days) : 0;

  const total_messages = messages.length;
  const messages_by_participant = {};
  participants.forEach((p) => {
    messages_by_participant[p] = 0;
  });
  for (const m of messages) {
    messages_by_participant[m.sender] += 1;
  }

  const message_share_by_participant = {};
  participants.forEach((p) => {
    message_share_by_participant[p] =
      total_messages > 0 ? round4(messages_by_participant[p] / total_messages) : 0;
  });

  const days_with_messages_by_participant = {};
  participants.forEach((p) => {
    days_with_messages_by_participant[p] = daysByParticipant[p].size;
  });

  const segments = segmentMessages(messages, opt.segment_gap_minutes);
  const segMap = buildMessageIndexToSegment(segments);

  const conversation_starts_by_participant = {};
  participants.forEach((p) => {
    conversation_starts_by_participant[p] = 0;
  });
  const segment_summaries = [];

  for (const seg of segments) {
    const starter = seg[0].sender;
    conversation_starts_by_participant[starter] += 1;
    const byP = {};
    participants.forEach((p) => {
      byP[p] = 0;
    });
    seg.forEach((m) => {
      byP[m.sender] += 1;
    });
    segment_summaries.push({
      start_ts: seg[0].ts,
      end_ts: seg[seg.length - 1].ts,
      message_count: seg.length,
      starter,
      messages_by_participant: byP
    });
  }

  const total_starts = segments.length;
  const conversation_start_share = {};
  participants.forEach((p) => {
    conversation_start_share[p] =
      total_starts > 0 ? round4(conversation_starts_by_participant[p] / total_starts) : 0;
  });

  const longPauseMs = opt.long_pause_hours * 3600 * 1000;
  const reopenings_after_long_pause_by_participant = {};
  participants.forEach((p) => {
    reopenings_after_long_pause_by_participant[p] = 0;
  });

  for (let i = 1; i < messages.length; i++) {
    if (messages[i].ts - messages[i - 1].ts >= longPauseMs) {
      reopenings_after_long_pause_by_participant[messages[i].sender] += 1;
    }
  }

  const responseDelaysByParticipant = {};
  const responseCountByParticipant = {};
  const sameCalendarDayReplyFlags = [];
  participants.forEach((p) => {
    responseDelaysByParticipant[p] = [];
    responseCountByParticipant[p] = 0;
  });

  for (let i = 1; i < messages.length; i++) {
    const prev = messages[i - 1];
    const cur = messages[i];
    if (cur.sender !== prev.sender) {
      const delay = cur.ts - prev.ts;
      responseCountByParticipant[cur.sender] += 1;
      responseDelaysByParticipant[cur.sender].push(delay);
      sameCalendarDayReplyFlags.push({
        responder: cur.sender,
        sameDay: calendarDayKey(cur.date) === calendarDayKey(prev.date)
      });
    }
  }

  const median_response_time_by_participant = {};
  const p75_response_time_by_participant = {};
  participants.forEach((p) => {
    const arr = responseDelaysByParticipant[p].slice().sort((a, b) => a - b);
    const med = median(arr);
    const p75 = percentile(arr.slice(), 0.75);
    median_response_time_by_participant[p] = med == null ? null : Math.round(med / 1000);
    p75_response_time_by_participant[p] = p75 == null ? null : Math.round(p75 / 1000);
  });

  const same_day_reply_rate_by_participant = {};
  participants.forEach((p) => {
    const subset = sameCalendarDayReplyFlags.filter((x) => x.responder === p);
    const denom = subset.length;
    const num = subset.filter((x) => x.sameDay).length;
    same_day_reply_rate_by_participant[p] =
      denom > 0 ? round4(num / denom) : null;
  });

  const unanswered_segment_end_by_participant = {};
  participants.forEach((p) => {
    unanswered_segment_end_by_participant[p] = 0;
  });
  for (const seg of segments) {
    const sendersInSeg = new Set(seg.map((m) => m.sender));
    if (sendersInSeg.size < 2) continue;
    const lastSender = seg[seg.length - 1].sender;
    let i = seg.length - 1;
    while (i > 0 && seg[i - 1].sender === lastSender) {
      i -= 1;
    }
    if (i === 0) continue;
    const beforeRun = seg[i - 1];
    if (beforeRun.sender !== lastSender) {
      unanswered_segment_end_by_participant[lastSender] += 1;
    }
  }

  const questions_by_participant = {};
  const multi_question_messages_by_participant = {};
  participants.forEach((p) => {
    questions_by_participant[p] = 0;
    multi_question_messages_by_participant[p] = 0;
  });

  let questionMessageIndices = [];
  for (let i = 0; i < messages.length; i++) {
    const m = messages[i];
    if (messageHasQuestion(m.body)) {
      questions_by_participant[m.sender] += 1;
      const mq = multiQuestionCount(m.body);
      if (mq > 1) {
        multi_question_messages_by_participant[m.sender] += 1;
      }
      questionMessageIndices.push(i);
    }
  }

  const question_rate_by_participant = {};
  participants.forEach((p) => {
    const denom = messages_by_participant[p];
    question_rate_by_participant[p] =
      denom > 0 ? round4(questions_by_participant[p] / denom) : 0;
  });

  let answeredQuestions = 0;
  for (const qi of questionMessageIndices) {
    if (questionAnsweredInWindow(messages, segMap, segments, qi, opt)) {
      answeredQuestions += 1;
    }
  }
  const question_response_rate =
    questionMessageIndices.length > 0
      ? round4(answeredQuestions / questionMessageIndices.length)
      : null;

  const avg_message_length_chars_by_participant = {};
  const median_message_length_chars_by_participant = {};
  const long_message_count_by_participant = {};
  const short_message_rate_by_participant = {};
  participants.forEach((p) => {
    long_message_count_by_participant[p] = {};
    opt.long_message_thresholds.forEach((t) => {
      long_message_count_by_participant[p][`over_${t}_chars`] = 0;
    });
  });

  const lengthsByP = {};
  participants.forEach((p) => {
    lengthsByP[p] = [];
  });
  for (const m of messages) {
    const len = m.body.length;
    lengthsByP[m.sender].push(len);
    for (const t of opt.long_message_thresholds) {
      if (len > t) {
        long_message_count_by_participant[m.sender][`over_${t}_chars`] += 1;
      }
    }
  }

  participants.forEach((p) => {
    const arr = lengthsByP[p];
    const sum = arr.reduce((a, b) => a + b, 0);
    avg_message_length_chars_by_participant[p] =
      arr.length > 0 ? round4(sum / arr.length) : 0;
    const sorted = arr.slice().sort((a, b) => a - b);
    const med = median(sorted);
    median_message_length_chars_by_participant[p] =
      med == null ? 0 : Math.round(med);

    const shorts = arr.filter((l) => l <= opt.short_message_max_chars).length;
    short_message_rate_by_participant[p] =
      arr.length > 0 ? round4(shorts / arr.length) : 0;
  });

  const messages_per_day = [];
  const dayMap = new Map();
  for (const m of messages) {
    const dk = calendarDayKey(m.date);
    if (!dayMap.has(dk)) {
      dayMap.set(dk, { date: dk, total: 0, by_participant: {} });
      participants.forEach((p) => {
        dayMap.get(dk).by_participant[p] = 0;
      });
    }
    const row = dayMap.get(dk);
    row.total += 1;
    row.by_participant[m.sender] += 1;
  }
  [...dayMap.keys()].sort().forEach((k) => messages_per_day.push(dayMap.get(k)));

  const weekMap = new Map();
  for (const m of messages) {
    const wk = weekMondayKey(m.date);
    if (!weekMap.has(wk)) {
      weekMap.set(wk, { week_start: wk, total: 0, by_participant: {} });
      participants.forEach((p) => {
        weekMap.get(wk).by_participant[p] = 0;
      });
    }
    const row = weekMap.get(wk);
    row.total += 1;
    row.by_participant[m.sender] += 1;
  }
  const messages_per_week = [...weekMap.keys()].sort().map((k) => weekMap.get(k));

  const monthMap = new Map();
  for (const m of messages) {
    const mk = monthKey(m.date);
    if (!monthMap.has(mk)) {
      monthMap.set(mk, { month: mk, total: 0, by_participant: {}, active_days: new Set() });
      participants.forEach((p) => {
        monthMap.get(mk).by_participant[p] = 0;
      });
    }
    const row = monthMap.get(mk);
    row.total += 1;
    row.by_participant[m.sender] += 1;
    row.active_days.add(calendarDayKey(m.date));
  }

  const messages_per_month = [];
  const active_days_per_month = {};
  const monthly_balance_by_participant = {};

  [...monthMap.keys()].sort().forEach((mk) => {
    const row = monthMap.get(mk);
    messages_per_month.push({
      month: mk,
      total: row.total,
      by_participant: { ...row.by_participant }
    });
    active_days_per_month[mk] = row.active_days.size;
    monthly_balance_by_participant[mk] = { ...row.by_participant };
  });

  const messagesByMonthIndex = {};
  [...monthMap.keys()].forEach((mk) => {
    messagesByMonthIndex[mk] = [];
  });
  for (const m of messages) {
    messagesByMonthIndex[monthKey(m.date)].push(m);
  }

  let speaker_switches = 0;
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender !== messages[i - 1].sender) {
      speaker_switches += 1;
    }
  }
  const speaker_switch_rate =
    messages.length > 1 ? round4(speaker_switches / (messages.length - 1)) : null;

  const runLengthsByParticipant = {};
  participants.forEach((p) => {
    runLengthsByParticipant[p] = [];
  });
  let runSender = messages[0].sender;
  let runLen = 1;
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].sender === runSender) {
      runLen += 1;
    } else {
      runLengthsByParticipant[runSender].push(runLen);
      runSender = messages[i].sender;
      runLen = 1;
    }
  }
  runLengthsByParticipant[runSender].push(runLen);

  const avg_consecutive_messages_by_participant = {};
  const monologue_runs_by_participant = {};
  participants.forEach((p) => {
    const arr = runLengthsByParticipant[p];
    const sum = arr.reduce((a, b) => a + b, 0);
    avg_consecutive_messages_by_participant[p] =
      arr.length > 0 ? round4(sum / arr.length) : 0;
    monologue_runs_by_participant[p] = arr.filter((l) => l >= 4).length;
  });

  let balanced_segments = 0;
  const minEach = opt.balanced_segment_min_messages_each;
  for (const seg of segments) {
    const byP = {};
    participants.forEach((p) => {
      byP[p] = 0;
    });
    seg.forEach((m) => {
      byP[m.sender] += 1;
    });
    const ok =
      participants.length >= 2 &&
      participants.every((p) => byP[p] >= minEach);
    if (ok) {
      balanced_segments += 1;
    }
  }
  const balanced_segments_rate =
    segments.length > 0 ? round4(balanced_segments / segments.length) : 0;

  const messages_by_daypart = {
    mattina: { total: 0, by_participant: {} },
    pomeriggio: { total: 0, by_participant: {} },
    sera: { total: 0, by_participant: {} },
    notte: { total: 0, by_participant: {} }
  };
  participants.forEach((p) => {
    Object.keys(messages_by_daypart).forEach((k) => {
      messages_by_daypart[k].by_participant[p] = 0;
    });
  });

  let nightCount = 0;
  for (const m of messages) {
    const dp = daypartLabel(m.date);
    messages_by_daypart[dp].total += 1;
    messages_by_daypart[dp].by_participant[m.sender] += 1;
    const h = m.date.getHours();
    if (h >= opt.night_hour_start && h < opt.night_hour_endExclusive) {
      nightCount += 1;
    }
  }
  const night_message_rate =
    total_messages > 0 ? round4(nightCount / total_messages) : 0;

  const conversation_starts_by_daypart = {
    mattina: { ...Object.fromEntries(participants.map((p) => [p, 0])) },
    pomeriggio: { ...Object.fromEntries(participants.map((p) => [p, 0])) },
    sera: { ...Object.fromEntries(participants.map((p) => [p, 0])) },
    notte: { ...Object.fromEntries(participants.map((p) => [p, 0])) }
  };
  for (const seg of segments) {
    const st = seg[0];
    const dp = daypartLabel(st.date);
    conversation_starts_by_daypart[dp][st.sender] += 1;
  }

  function lexiconAggForMessages(msgList) {
    const out = {};
    participants.forEach((p) => {
      out[p] = {
        affection: { total: 0, by_lemma: {} },
        repair: { total: 0, by_lemma: {} },
        tension: { total: 0, by_lemma: {} },
        playfulness: { total: 0, by_lemma: {} },
        checkin: { total: 0, by_lemma: {} },
        care: { total: 0, by_lemma: {} }
      };
    });
    for (const m of msgList) {
      for (const kind of Object.keys(lexicons)) {
        const { total, by_lemma } = countLexiconHits(m.body, lexicons[kind]);
        out[m.sender][kind].total += total;
        Object.entries(by_lemma).forEach(([k, v]) => {
          out[m.sender][kind].by_lemma[k] =
            (out[m.sender][kind].by_lemma[k] || 0) + v;
        });
      }
    }
    return out;
  }

  const lexical_global = lexiconAggForMessages(messages);

  function flattenLexTotals(agg) {
    const row = {};
    participants.forEach((p) => {
      row[p] = {
        affection_term_count: agg[p].affection.total,
        repair_signal_count: agg[p].repair.total,
        tension_marker_count: agg[p].tension.total,
        playfulness_marker_count: agg[p].playfulness.total,
        checkin_marker_count: agg[p].checkin.total,
        care_marker_count: agg[p].care.total
      };
    });
    return row;
  }

  const participant_lexical = flattenLexTotals(lexical_global);

  let segmentsStartedWithAffection = 0;
  for (const seg of segments) {
    const { total } = countLexiconHits(seg[0].body, lexicons.affection);
    if (total > 0) {
      segmentsStartedWithAffection += 1;
    }
  }
  const affection_initiation_rate =
    segments.length > 0 ? round4(segmentsStartedWithAffection / segments.length) : 0;

  const affA = participant_lexical[participants[0]]?.affection_term_count ?? 0;
  const affB = participant_lexical[participants[1]]?.affection_term_count ?? 0;
  let affection_symmetry_index = null;
  if (participants.length >= 2) {
    affection_symmetry_index = round4(
      Math.abs(affA - affB) / (affA + affB + 1)
    );
  }

  let tensionEvents = 0;
  let repairAfterTension = 0;
  const w = opt.repair_after_tension_window;
  for (let i = 0; i < messages.length; i++) {
    const { total: tens } = countLexiconHits(messages[i].body, lexicons.tension);
    if (tens === 0) continue;
    tensionEvents += 1;
    const end = Math.min(messages.length - 1, i + w);
    let repaired = false;
    for (let j = i + 1; j <= end; j++) {
      const { total: rep } = countLexiconHits(messages[j].body, lexicons.repair);
      if (rep > 0) {
        repaired = true;
        break;
      }
    }
    if (repaired) {
      repairAfterTension += 1;
    }
  }
  const repair_after_tension_rate =
    tensionEvents > 0 ? round4(repairAfterTension / tensionEvents) : null;

  const strong_punctuation_count_by_participant = {};
  participants.forEach((p) => {
    strong_punctuation_count_by_participant[p] = 0;
  });
  for (const m of messages) {
    if (strongPunctuationHit(m.body)) {
      strong_punctuation_count_by_participant[m.sender] += 1;
    }
  }

  let friction_window_count = 0;
  const ws = opt.tension_window_size;
  for (let i = 0; i + ws <= messages.length; i++) {
    let c = 0;
    for (let j = i; j < i + ws; j++) {
      if (countLexiconHits(messages[j].body, lexicons.tension).total > 0) {
        c += 1;
      }
    }
    if (c >= opt.tension_window_min_markers) {
      friction_window_count += 1;
    }
  }

  let playful_segments = 0;
  for (const seg of segments) {
    const used = {};
    participants.forEach((p) => {
      used[p] = false;
    });
    for (const m of seg) {
      if (countLexiconHits(m.body, lexicons.playfulness).total > 0) {
        used[m.sender] = true;
      }
    }
    if (participants.length >= 2 && participants.every((p) => used[p])) {
      playful_segments += 1;
    }
  }
  const playful_exchange_rate =
    segments.length > 0 ? round4(playful_segments / segments.length) : 0;

  const monthly_question_rate = {};
  const monthly_affection_signal_rate = {};
  const monthly_lexical = {};

  for (const mk of Object.keys(messagesByMonthIndex).sort()) {
    const list = messagesByMonthIndex[mk];
    const qn = list.filter((m) => messageHasQuestion(m.body)).length;
    monthly_question_rate[mk] =
      list.length > 0 ? round4(qn / list.length) : 0;
    let affSum = 0;
    for (const m of list) {
      affSum += countLexiconHits(m.body, lexicons.affection).total;
    }
    monthly_affection_signal_rate[mk] =
      list.length > 0 ? round4((affSum / list.length) * 100) : 0;

    const lex = flattenLexTotals(lexiconAggForMessages(list));
    monthly_lexical[mk] = {
      affection_term_count_by_participant: {},
      repair_signal_count_by_participant: {},
      tension_marker_count_by_participant: {},
      playfulness_marker_count_by_participant: {}
    };
    participants.forEach((p) => {
      monthly_lexical[mk].affection_term_count_by_participant[p] = lex[p].affection_term_count;
      monthly_lexical[mk].repair_signal_count_by_participant[p] = lex[p].repair_signal_count;
      monthly_lexical[mk].tension_marker_count_by_participant[p] = lex[p].tension_marker_count;
      monthly_lexical[mk].playfulness_marker_count_by_participant[p] =
        lex[p].playfulness_marker_count;
    });
  }

  const initiative_balance_index =
    participants.length >= 2 && total_starts > 0
      ? round4(
          Math.abs(
            conversation_starts_by_participant[participants[0]] -
              conversation_starts_by_participant[participants[1]]
          ) / total_starts
        )
      : null;

  const participation_balance_index =
    participants.length >= 2 && total_messages > 0
      ? round4(
          Math.abs(
            messages_by_participant[participants[0]] -
              messages_by_participant[participants[1]]
          ) / total_messages
        )
      : null;

  let responsiveness_balance_index = null;
  if (participants.length >= 2) {
    const ma = median_response_time_by_participant[participants[0]] ?? 0;
    const mb = median_response_time_by_participant[participants[1]] ?? 0;
    const denom = Math.max(ma, mb, 1);
    responsiveness_balance_index =
      denom > 0 ? round4(Math.abs(ma - mb) / denom) : null;
  }

  let affection_balance_index = null;
  let repair_balance_index = null;
  if (participants.length >= 2) {
    const a1 = participant_lexical[participants[0]].affection_term_count;
    const a2 = participant_lexical[participants[1]].affection_term_count;
    affection_balance_index = round4(Math.abs(a1 - a2) / (a1 + a2 + 1));
    const r1 = participant_lexical[participants[0]].repair_signal_count;
    const r2 = participant_lexical[participants[1]].repair_signal_count;
    repair_balance_index = round4(Math.abs(r1 - r2) / (r1 + r2 + 1));
  }

  const participant_metrics = {};
  participants.forEach((p) => {
    participant_metrics[p] = {
      message_count: messages_by_participant[p],
      message_share: message_share_by_participant[p],
      days_with_messages: days_with_messages_by_participant[p],
      question_count: questions_by_participant[p],
      question_rate: question_rate_by_participant[p],
      multi_question_messages: multi_question_messages_by_participant[p],
      avg_message_length_chars: avg_message_length_chars_by_participant[p],
      median_message_length_chars: median_message_length_chars_by_participant[p],
      long_message_counts: long_message_count_by_participant[p],
      short_message_rate: short_message_rate_by_participant[p],
      median_response_time_seconds: median_response_time_by_participant[p],
      p75_response_time_seconds: p75_response_time_by_participant[p],
      same_day_reply_rate: same_day_reply_rate_by_participant[p],
      response_count: responseCountByParticipant[p],
      conversation_starts: conversation_starts_by_participant[p],
      conversation_start_share: conversation_start_share[p],
      reopenings_after_long_pause: reopenings_after_long_pause_by_participant[p],
      unanswered_segment_ends: unanswered_segment_end_by_participant[p],
      affection_term_count: participant_lexical[p].affection_term_count,
      affection_by_lemma: lexical_global[p].affection.by_lemma,
      repair_signal_count: participant_lexical[p].repair_signal_count,
      tension_marker_count: participant_lexical[p].tension_marker_count,
      playfulness_marker_count: participant_lexical[p].playfulness_marker_count,
      checkin_marker_count: participant_lexical[p].checkin_marker_count,
      care_marker_count: participant_lexical[p].care_marker_count,
      strong_punctuation_count: strong_punctuation_count_by_participant[p]
    };
  });

  return {
    schema_version: 1,
    note:
      "Metriche descrittive (densità lessicale, tempi, volumi). Non sono diagnostiche né misure di compatibilità o attaccamento.",
    computation_options: { ...opt },
    chat_metadata: {
      date_start,
      date_end,
      timespan_days,
      active_days,
      activity_ratio,
      total_messages
    },
    participants_order: participants,
    participant_metrics,
    conversation_segments: {
      segment_count: segments.length,
      segment_summaries,
      segment_gap_minutes: opt.segment_gap_minutes,
      long_pause_hours: opt.long_pause_hours
    },
    response_dynamics: {
      response_count_by_participant: responseCountByParticipant,
      median_response_time_seconds_by_participant: median_response_time_by_participant,
      p75_response_time_seconds_by_participant: p75_response_time_by_participant,
      same_day_reply_rate_by_participant,
      unanswered_segment_end_by_participant
    },
    questions: {
      questions_by_participant,
      question_rate_by_participant,
      multi_question_messages_by_participant,
      question_response_rate,
      question_response_rule_hours: opt.question_response_hours
    },
    temporal_series: {
      messages_per_day,
      messages_per_week,
      messages_per_month,
      active_days_per_month,
      monthly_balance_by_participant,
      monthly_question_rate,
      monthly_affection_signal_rate,
      monthly_lexical_signals: monthly_lexical
    },
    turn_taking: {
      speaker_switch_rate,
      avg_consecutive_messages_by_participant,
      monologue_runs_by_participant,
      balanced_segments_rate,
      balanced_segment_min_messages_each: minEach
    },
    daypart_usage: {
      messages_by_daypart,
      conversation_starts_by_daypart,
      night_message_rate,
      night_hours_local: `${String(opt.night_hour_start).padStart(2, "0")}:00–${String(opt.night_hour_endExclusive).padStart(2, "0")}:00`
    },
    lexical_signals_global: {
      affection_initiation_rate,
      affection_symmetry_index,
      repair_after_tension_rate,
      playful_exchange_rate,
      friction_window_count,
      tension_sliding_window_size: opt.tension_window_size,
      tension_sliding_window_min_marked_messages: opt.tension_window_min_markers
    },
    synthetic_indices: {
      initiative_balance_index,
      participation_balance_index,
      responsiveness_balance_index,
      affection_balance_index,
      repair_balance_index
    }
  };
}

function emptyReport(opt, participants) {
  return {
    schema_version: 1,
    note: "Nessun messaggio parsato.",
    computation_options: { ...DEFAULT_OPTIONS, ...opt },
    chat_metadata: {
      date_start: null,
      date_end: null,
      timespan_days: 0,
      active_days: 0,
      activity_ratio: 0,
      total_messages: 0
    },
    participants_order: participants,
    participant_metrics: {}
  };
}

function emptyFromError(message) {
  return {
    schema_version: 1,
    error: message,
    chat_metadata: {},
    participant_metrics: {}
  };
}

function buildRelationalMetricsReport(chatText, options = {}) {
  try {
    const messages = parseWhatsAppChat(chatText);
    return computeRelationalMetrics(messages, options);
  } catch (e) {
    return emptyFromError(e.message || String(e));
  }
}

module.exports = {
  buildRelationalMetricsReport,
  computeRelationalMetrics,
  parseWhatsAppChat,
  DEFAULT_OPTIONS
};
