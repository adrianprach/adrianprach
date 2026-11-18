import spec from "./availability.json" with { type: "json" };

const POPULAR_TZS = [
  { label: "Detected (Auto)", value: "AUTO" },
  { label: "London (UTC+0/+1)", value: "Europe/London" },
  { label: "Berlin / Paris (UTC+1/+2)", value: "Europe/Berlin" },
  { label: "Bangkok (UTC+7)", value: "Asia/Bangkok" },
  { label: "Singapore / KL (UTC+8)", value: "Asia/Singapore" },
  { label: "Tokyo (UTC+9)", value: "Asia/Tokyo" },
  { label: "Adelaide (UTC+9:30/+10:30)", value: "Australia/Adelaide" },
  { label: "Sydney / Melb (UTC+10/+11)", value: "Australia/Sydney" },
  { label: "San Francisco (UTC-8/-7)", value: "America/Los_Angeles" },
  { label: "New York (UTC-5/-4)", value: "America/New_York" }
];

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const pad = (n) => String(n).padStart(2, "0");

let detectedTz = "UTC";
try {
  detectedTz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
} catch (_) {}

let currentVisitorTz = detectedTz;
let selectedDayOffset = 0;
let selectedHour = null;

const fmtCache = new Map();
function getParts(date, timeZone) {
  if (!fmtCache.has(timeZone)) {
    fmtCache.set(
      timeZone,
      new Intl.DateTimeFormat("en-US", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        weekday: "short"
      })
    );
  }
  const parts = fmtCache.get(timeZone).formatToParts(date);
  const m = {};
  for (const p of parts) m[p.type] = p.value;
  return {
    year: parseInt(m.year, 10),
    month: parseInt(m.month, 10),
    day: parseInt(m.day, 10),
    hour: parseInt(m.hour, 10) % 24,
    minute: parseInt(m.minute, 10),
    second: parseInt(m.second, 10),
    weekday: m.weekday.toLowerCase()
  };
}

function getISODate(date, timeZone) {
  const p = getParts(date, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

function getOffsetMinutes(date, tz1, tz2) {
  const p1 = getParts(date, tz1);
  const p2 = getParts(date, tz2);
  const d1 = Date.UTC(p1.year, p1.month - 1, p1.day, p1.hour, p1.minute);
  const d2 = Date.UTC(p2.year, p2.month - 1, p2.day, p2.hour, p2.minute);
  return Math.round((d2 - d1) / 60000);
}

function formatOffset(diffMin) {
  const sign = diffMin >= 0 ? "+" : "-";
  const abs = Math.abs(diffMin);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return m ? `${sign}${h}h ${m}m` : `${sign}${h}h`;
}

function getSchedule(dateStr, dayKey) {
  if (spec.dates?.[dateStr]) return spec.dates[dateStr];
  const def = spec.default || {};
  if (def.weekday && def.weekend) {
    return dayKey === "sat" || dayKey === "sun" ? def.weekend : def.weekday;
  }
  return def[dayKey] || [];
}

function getSlotStatus(dateStr, dayKey, hour) {
  for (const s of getSchedule(dateStr, dayKey)) {
    const [start, end, type] = Array.isArray(s) ? s : [s.start, s.end, s.type];
    if (hour >= start && hour < end) return type;
  }
  return "busy";
}

function renderTerminal() {
  const container = document.getElementById("availability-terminal-root");
  if (!container) return;

  const now = new Date();
  const vParts = getParts(now, currentVisitorTz);
  const aParts = getParts(now, spec.timezone);
  const diffMin = getOffsetMinutes(now, currentVisitorTz, spec.timezone);
  const diffStr = diffMin === 0 ? "same tz" : formatOffset(diffMin);

  const curDateStr = getISODate(now, spec.timezone);
  const curType = getSlotStatus(curDateStr, aParts.weekday, aParts.hour + aParts.minute / 60);
  const curState = spec.states[curType] || spec.states.busy;

  const horizon = spec.horizonDays || 14;
  let tabsHtml = "";
  for (let i = 0; i < horizon; i++) {
    const d = new Date(now.getTime() + i * 86400000);
    const p = getParts(d, currentVisitorTz);
    const isSel = i === selectedDayOffset;
    const name = i === 0 ? "TODAY" : i === 1 ? "TMRW" : p.weekday.toUpperCase();
    tabsHtml += `
      <button class="term-btn term-tab ${isSel ? "active" : ""}" data-day-offset="${i}">
        ${isSel ? `[▶ ${name} ${pad(p.day)}/${pad(p.month)}]` : `[ ${name} ${pad(p.day)}/${pad(p.month)} ]`}
      </button>
    `;
  }

  const targetDate = new Date(now.getTime() + selectedDayOffset * 86400000);
  const targetVParts = getParts(targetDate, currentVisitorTz);

  const slots = [];
  for (let h = 0; h < 24; h++) {
    const totalMin = h * 60;
    const aTotal = (totalMin + diffMin) % 1440;
    const normMin = aTotal < 0 ? aTotal + 1440 : aTotal;
    const aHour = Math.floor(normMin / 60);
    const aMin = normMin % 60;

    const dayShift = Math.floor((totalMin + diffMin) / 1440);
    const vDayIdx = DAY_KEYS.indexOf(targetVParts.weekday);
    const aDayKey = DAY_KEYS[(vDayIdx + dayShift + 7) % 7];

    const slotDate = new Date(targetDate.getTime() + (dayShift * 24 + (aHour - targetVParts.hour)) * 3600000);
    const slotDateStr = getISODate(slotDate, spec.timezone);
    const type = getSlotStatus(slotDateStr, aDayKey, aHour + aMin / 60);
    const state = spec.states[type] || spec.states.busy;

    slots.push({
      vHour: h,
      aHour,
      aMin,
      aDayKey,
      aDateStr: slotDateStr,
      dayShift,
      type,
      state,
      isSweetSpot: h >= 9 && h <= 21 && type === "open"
    });
  }

  if (selectedHour === null) {
    if (selectedDayOffset === 0) {
      selectedHour = vParts.hour;
    } else {
      const openSlot = slots.find((s) => s.type === "open");
      selectedHour = openSlot ? openSlot.vHour : 14;
    }
  }

  const active = slots[selectedHour] || slots[0];

  let vRow = "";
  let aRow = "";
  let cellsRow = "";

  for (let h = 0; h < 24; h++) {
    const s = slots[h];
    const isCur = h === selectedHour;
    const pv = pad(s.vHour);
    const pa = pad(s.aHour);
    const cls = `slot-cell slot-${s.type} ${s.isSweetSpot ? "slot-sweetspot" : ""} ${isCur ? "slot-active" : ""}`;

    vRow += `<span class="col-cell ${isCur ? "active" : ""}" data-hour="${h}">${pv}</span>`;
    aRow += `<span class="col-cell ${isCur ? "active" : ""}" data-hour="${h}">${pa}</span>`;
    cellsRow += `<span class="${cls}" data-hour="${h}">${s.state.symbol}</span>`;
  }

  const vHourStr = `${pad(active.vHour)}:00`;
  const aHourStr = `${pad(active.aHour)}:${pad(active.aMin)}`;
  const vDateStr = `${pad(targetVParts.day)}/${pad(targetVParts.month)}`;
  const vDay = targetVParts.weekday.toUpperCase();
  const shift = active.dayShift === 1 ? " (+1d)" : active.dayShift === -1 ? " (-1d)" : "";

  const mailSub = encodeURIComponent(`sync @ ${vHourStr} ${vDay}`);
  const mailBody = encodeURIComponent(
    `hey,\n\nfree to chat around ${aHourStr} adelaide time (${vDay} ${vDateStr} / ${vHourStr} my time)?\n\n[topic]`
  );
  const mailUrl = `mailto:${spec.contactEmail}?subject=${mailSub}&body=${mailBody}`;

  container.className = "term-viewport";
  container.innerHTML = `
    <div class="term-screen">
      <div class="term-header-bar">
        <div class="term-title">
          <span>adrian // availability</span>
          <span class="term-badge">live</span>
        </div>
      </div>

      <div class="term-box">
        <div class="box-title">┌── [ tz ] ──────────────────────────────────────────────────────────────────┐</div>
        <div class="box-content">
          <div class="term-line">
            <span class="term-label">you:</span>
            <span class="term-val highlight">${currentVisitorTz}</span>
            <span class="term-sub">(${pad(vParts.hour)}:${pad(vParts.minute)})</span>
          </div>
          <div class="term-line">
            <span class="term-label">adrian:</span>
            <span class="term-val">${spec.timezone}</span>
            <span class="term-sub">(${pad(aParts.hour)}:${pad(aParts.minute)})</span>
          </div>
          <div class="term-line">
            <span class="term-label">diff:</span>
            <span class="term-val delta-val">${diffStr}</span>
          </div>
          <div class="term-line">
            <span class="term-label">now:</span>
            <span class="term-val status-badge status-${curType}">${curState.symbol} ${curState.name.toLowerCase()}</span>
            <span class="term-sub">(${spec.statusNote})</span>
          </div>
        </div>
        <div class="box-bottom">└─────────────────────────────────────────────────────────────────────────────┘</div>
      </div>

      <div class="tz-selector-wrap">
        <span class="term-prompt">$ tz:</span>
        <select id="term-tz-select" class="term-select" aria-label="Select timezone">
          ${POPULAR_TZS.map((t) => {
            const val = t.value === "AUTO" ? detectedTz : t.value;
            return `<option value="${val}" ${currentVisitorTz === val ? "selected" : ""}>${t.label}</option>`;
          }).join("")}
        </select>
      </div>

      <div class="term-tabs-row">
        <span class="term-prompt">$ date:</span>
        ${tabsHtml}
      </div>

      <div class="term-box matrix-box">
        <div class="box-title">┌── [ matrix ] ───────────────────────────────────────────────────────────────┐</div>
        <div class="matrix-table-wrap">
          <div class="matrix-grid">
            <div class="grid-row-header">
              <span class="row-tag">you [h]:</span>
              <span class="row-tag">adrian [h]:</span>
              <span class="row-tag">status:</span>
            </div>
            <div class="grid-scroll">
              <div class="grid-row hour-row visitor-row">${vRow}</div>
              <div class="grid-row hour-row adrian-row">${aRow}</div>
              <div class="grid-row cells-row">${cellsRow}</div>
            </div>
          </div>
        </div>
        <div class="box-bottom">└─────────────────────────────────────────────────────────────────────────────┘</div>
      </div>

      <div class="term-box inspector-box">
        <div class="box-title">┌── [ slot ] ─────────────────────────────────────────────────────────────────┐</div>
        <div class="box-content inspector-content">
          <div class="inspector-details">
            <div class="term-line">
              <span class="term-label">slot:</span>
              <span class="term-val highlight">${vDay} ${vHourStr}</span>
              <span class="term-arrow">↔</span>
              <span class="term-val">${aHourStr}${shift} adelaide</span>
            </div>
            <div class="term-line">
              <span class="term-label">state:</span>
              <span class="term-val status-badge status-${active.type}">${active.state.symbol} ${active.state.name.toLowerCase()}</span>
              ${active.isSweetSpot ? `<span class="term-val sweetspot-alert">★ overlap</span>` : ""}
            </div>
          </div>
          <div class="inspector-actions">
            <a href="${mailUrl}" class="term-btn term-action-btn" target="_blank" rel="noopener">
              [ email ]
            </a>
          </div>
        </div>
        <div class="box-bottom">└─────────────────────────────────────────────────────────────────────────────┘</div>
      </div>

      <div class="term-legend">
        <span class="legend-item"><span class="legend-sym status-open">█</span> open</span>
        <span class="legend-item"><span class="legend-sym status-deep">▒</span> lock in</span>
        <span class="legend-item"><span class="legend-sym status-busy">░</span> afk / busy</span>
        <span class="legend-item"><span class="legend-sym sweetspot-dot">★</span> overlap</span>
      </div>
    </div>
  `;
}

function init() {
  const container = document.getElementById("availability-terminal-root");
  if (!container) return;

  container.addEventListener("click", (e) => {
    const cell = e.target.closest("[data-hour]");
    if (cell) {
      selectedHour = parseInt(cell.dataset.hour, 10);
      renderTerminal();
      return;
    }
    const tab = e.target.closest("[data-day-offset]");
    if (tab) {
      selectedDayOffset = parseInt(tab.dataset.dayOffset, 10);
      selectedHour = null;
      renderTerminal();
    }
  });

  container.addEventListener("change", (e) => {
    if (e.target.id === "term-tz-select") {
      currentVisitorTz = e.target.value;
      renderTerminal();
    }
  });

  renderTerminal();

  setInterval(() => {
    if (new Date().getSeconds() === 0) renderTerminal();
  }, 1000);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
