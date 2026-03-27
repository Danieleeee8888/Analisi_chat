const { parseWhatsAppChat } = require("./chat-parser");

const PERIOD_IDS = {
  ALL: "all",
  LAST_2M: "last2months",
  LAST_6M: "last6months",
  LAST_1Y: "last1year",
  LAST_2Y: "last2years"
};

const PERIOD_LABELS_IT = {
  [PERIOD_IDS.ALL]: "Tutta la chat",
  [PERIOD_IDS.LAST_2M]: "Ultimi 2 mesi",
  [PERIOD_IDS.LAST_6M]: "Ultimi 6 mesi",
  [PERIOD_IDS.LAST_1Y]: "Ultimo anno",
  [PERIOD_IDS.LAST_2Y]: "Ultimi 2 anni"
};

/** Suffisso file (solo se non tutta la chat) */
const PERIOD_FILE_SUFFIX = {
  [PERIOD_IDS.LAST_2M]: "ultimi2mesi",
  [PERIOD_IDS.LAST_6M]: "ultimi6mesi",
  [PERIOD_IDS.LAST_1Y]: "ultimoanno",
  [PERIOD_IDS.LAST_2Y]: "ultimi2anni"
};

function formatItalianDateTime(d) {
  if (!d || !(d instanceof Date)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}

function formatItalianDateOnly(d) {
  if (!d || !(d instanceof Date)) return "";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function subtractMonthsFromDate(date, months) {
  const d = new Date(date.getTime());
  d.setMonth(d.getMonth() - months);
  return d;
}

function filterMessagesByPeriod(messages, period) {
  if (!messages.length) return [];
  if (period === PERIOD_IDS.ALL || !period) {
    return messages.slice();
  }

  const lastMsg = messages[messages.length - 1];
  const lastTs = lastMsg.ts;

  let months = 0;
  switch (period) {
    case PERIOD_IDS.LAST_2M:
      months = 2;
      break;
    case PERIOD_IDS.LAST_6M:
      months = 6;
      break;
    case PERIOD_IDS.LAST_1Y:
      months = 12;
      break;
    case PERIOD_IDS.LAST_2Y:
      months = 24;
      break;
    default:
      return messages.slice();
  }

  const windowStart = subtractMonthsFromDate(lastMsg.date, months);
  const startTs = windowStart.getTime();

  return messages.filter((m) => m.ts >= startTs && m.ts <= lastTs);
}

function previewSlice(messages, period) {
  const filtered = filterMessagesByPeriod(messages, period);
  if (!filtered.length) {
    return {
      message_count: 0,
      date_start: null,
      date_end: null,
      date_start_label: null,
      date_end_label: null
    };
  }
  const a = filtered[0];
  const b = filtered[filtered.length - 1];
  return {
    message_count: filtered.length,
    date_start: a.date.toISOString(),
    date_end: b.date.toISOString(),
    date_start_label: formatItalianDateTime(a.date),
    date_end_label: formatItalianDateTime(b.date)
  };
}

function buildPreviews(messages) {
  const keys = [
    PERIOD_IDS.ALL,
    PERIOD_IDS.LAST_2M,
    PERIOD_IDS.LAST_6M,
    PERIOD_IDS.LAST_1Y,
    PERIOD_IDS.LAST_2Y
  ];
  const previews = {};
  for (const k of keys) {
    previews[k] = previewSlice(messages, k);
  }
  return previews;
}

function analyzeParsedMessages(messages) {
  if (!messages.length) {
    return {
      message_count: 0,
      date_start: null,
      date_end: null,
      date_start_label: null,
      date_end_label: null,
      previews: {}
    };
  }
  const first = messages[0];
  const last = messages[messages.length - 1];
  return {
    message_count: messages.length,
    date_start: first.date.toISOString(),
    date_end: last.date.toISOString(),
    date_start_label: formatItalianDateTime(first.date),
    date_end_label: formatItalianDateTime(last.date),
    previews: buildPreviews(messages)
  };
}

function analyzeChatText(text) {
  const messages = parseWhatsAppChat(text);
  return analyzeParsedMessages(messages);
}

function getPeriodLabel(period) {
  return PERIOD_LABELS_IT[period] || period;
}

function getOutputBaseSuffix(period) {
  if (!period || period === PERIOD_IDS.ALL) return "";
  return PERIOD_FILE_SUFFIX[period] ? `_${PERIOD_FILE_SUFFIX[period]}` : "";
}

module.exports = {
  PERIOD_IDS,
  PERIOD_LABELS_IT,
  filterMessagesByPeriod,
  analyzeParsedMessages,
  analyzeChatText,
  getPeriodLabel,
  getOutputBaseSuffix,
  formatItalianDateTime,
  formatItalianDateOnly
};
