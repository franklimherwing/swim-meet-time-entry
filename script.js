const VERSION = "1.9";
document.getElementById("version").innerText = "Version " + VERSION;

const lanes = 12;
const container = document.getElementById("table");

// build UI
for (let i = 1; i <= lanes; i++) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <div class="lane">${i}</div>
    <input id="t1-${i}" data-lane="${i}" data-col="1" />
    <input id="t2-${i}" data-lane="${i}" data-col="2" />
    <div class="avg" id="avg-${i}">0.00</div>
  `;

  container.appendChild(row);
}

/* -------------------------
   🔊 BEEP SOUND (simple + reliable)
--------------------------*/
function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 880; // tone
  gain.gain.value = 0.1;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

// sanitize input
function sanitize(val) {
  return val.replace(/[^0-9.]/g, "");
}

// calculate + check completion
function calc(lane) {
  const t1El = document.getElementById(`t1-${lane}`);
  const t2El = document.getElementById(`t2-${lane}`);
  const avgEl = document.getElementById(`avg-${lane}`);

  const t1 = parseFloat(t1El.value);
  const t2 = parseFloat(t2El.value);

  const t1Filled = !isNaN(t1);
  const t2Filled = !isNaN(t2);

  if (t1Filled && t2Filled) {
    avgEl.innerText = ((t1 + t2) / 2).toFixed(2);

    // 🔊 beep ONLY when lane is fully completed
    if (!avgEl.dataset.done) {
      beep();
      avgEl.dataset.done = "true";
    }
  } else {
    avgEl.dataset.done = "";
  }
}

/* -------------------------
   INPUT HANDLER
--------------------------*/
document.addEventListener("input", (e) => {
  if (e.target.tagName !== "INPUT") return;

  e.target.value = sanitize(e.target.value);

  const lane = parseInt(e.target.dataset.lane);
  const col = parseInt(e.target.dataset.col);

  calc(lane);

  const value = e.target.value;

  // auto advance logic
  if (value.includes(".") && value.split(".")[1]?.length >= 1) {
    setTimeout(() => {
      if (col === 1) {
        document.getElementById(`t2-${lane}`).focus();
      } else {
        const next = lane + 1;
        if (next <= lanes) {
          document.getElementById(`t1-${next}`).focus();
        }
      }
    }, 100);
  }
});

/* -------------------------
   RESET
--------------------------*/
function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.00";
    document.getElementById(`avg-${i}`).dataset.done = "";
  }
}

/* -------------------------
   MIC (unchanged)
--------------------------*/
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported on this device.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = (event) => {
    let text = event.results[0][0].transcript;
    text = text.replace(/[^0-9.]/g, "");

    const active = document.activeElement;

    if (active && active.tagName === "INPUT") {
      active.value = text;
      active.dispatchEvent(new Event("input"));
    }
  };
}
