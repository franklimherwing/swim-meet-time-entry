const VERSION = "1.5";
document.getElementById("version").innerText = "Version " + VERSION;

const lanes = 12;
const container = document.getElementById("table");

// build table
for (let i = 1; i <= lanes; i++) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <div>${i}</div>
    <input id="t1-${i}" data-lane="${i}" data-col="1" />
    <input id="t2-${i}" data-lane="${i}" data-col="2" />
    <div class="avg" id="avg-${i}">0.00</div>
  `;

  container.appendChild(row);
}

// calculate average
function calc(lane) {
  const t1El = document.getElementById(`t1-${lane}`);
  const t2El = document.getElementById(`t2-${lane}`);
  const avgEl = document.getElementById(`avg-${lane}`);

  const t1 = parseFloat(t1El.value);
  const t2 = parseFloat(t2El.value);

  if (!isNaN(t1) && !isNaN(t2)) {
    avgEl.innerText = ((t1 + t2) / 2).toFixed(2);
  }
}

// AUTO MOVE FUNCTION
function maybeAutoAdvance(e) {
  const el = e.target;

  if (el.tagName !== "INPUT") return;

  const value = el.value.trim();

  // only move when a valid number is entered
  if (!isNaN(parseFloat(value)) && value.length >= 4) {
    const lane = parseInt(el.dataset.lane);
    const col = parseInt(el.dataset.col);

    // move logic:
    if (col === 1) {
      document.getElementById(`t2-${lane}`).focus();
    } else {
      const nextLane = lane + 1;
      if (nextLane <= lanes) {
        document.getElementById(`t1-${nextLane}`).focus();
      }
    }
  }
}

// input handler
document.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    const lane = e.target.dataset.lane;
    calc(lane);
    maybeAutoAdvance(e);
  }
});

// reset
function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.00";
  }
}
