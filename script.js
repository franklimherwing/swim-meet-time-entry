const VERSION = "2.2";
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
    <div class="avg" id="avg-${i}">0.000</div>
  `;

  container.appendChild(row);
}

/* -------------------------
   BEEP
--------------------------*/
function beep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.value = 880;
  gain.gain.value = 0.1;

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.12);
}

/* -------------------------
   FORMAT (3 decimals)
--------------------------*/
function format(val) {
  const num = parseFloat(val);
  if (isNaN(num)) return null;
  return num.toFixed(3); // 🔥 now 3 digits
}

/* -------------------------
   BEST LANE TRACKER
--------------------------*/
function updateBest() {
  let bestLane = null;
  let bestTime = Infinity;

  for (let i = 1; i <= lanes; i++) {
    const avg = parseFloat(document.getElementById(`avg-${i}`).innerText);

    if (!isNaN(avg) && avg > 0) {
      if (avg < bestTime) {
        bestTime = avg;
        bestLane = i;
      }
    }
  }

  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`avg-${i}`).classList.remove("best");
  }

  if (bestLane !== null) {
    document.getElementById(`avg-${bestLane}`).classList.add("best");
  }
}

/* -------------------------
   CALC
--------------------------*/
function calc(lane) {
  const t1 = parseFloat(document.getElementById(`t1-${lane}`).value);
  const t2 = parseFloat(document.getElementById(`t2-${lane}`).value);

  if (!isNaN(t1) && !isNaN(t2)) {
    const avg = (t1 + t2) / 2;

    document.getElementById(`avg-${lane}`).innerText =
      avg.toFixed(3); // 🔥 3 decimal places

    if (!document.getElementById(`avg-${lane}`).dataset.done) {
      beep();
      document.getElementById(`avg-${lane}`).dataset.done = "true";
    }

    updateBest();
  }
}

/* -------------------------
   INPUT HANDLER (NO RESTRICTION)
--------------------------*/
document.addEventListener("input", (e) => {
  if (e.target.tagName !== "INPUT") return;

  const lane = parseInt(e.target.dataset.lane);
  const col = parseInt(e.target.dataset.col);

  calc(lane);

  const value = e.target.value;

  // keep auto advance
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
    }, 80);
  }
});

/* -------------------------
   RESET
--------------------------*/
function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.000";
    document.getElementById(`avg-${i}`).dataset.done = "";
    document.getElementById(`avg-${i}`).classList.remove("best");
  }
}
