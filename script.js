const VERSION = "1.3";
document.getElementById("version").innerText = "Version " + VERSION;

const lanes = 12;

// build table
const table = document.getElementById("table");

for (let i = 1; i <= lanes; i++) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <div>${i}</div>
    <input id="t1-${i}" data-lane="${i}" data-col="1" />
    <input id="t2-${i}" data-lane="${i}" data-col="2" />
    <div class="avg" id="avg-${i}">0.00</div>
  `;

  table.appendChild(row);
}

// calculate + highlight
function calc(lane) {
  const t1 = parseFloat(document.getElementById(`t1-${lane}`).value);
  const t2 = parseFloat(document.getElementById(`t2-${lane}`).value);

  const avgBox = document.getElementById(`avg-${lane}`);

  if (!isNaN(t1) && !isNaN(t2)) {
    const diff = Math.abs(t1 - t2);

    const avg = ((t1 + t2) / 2).toFixed(2);
    avgBox.innerText = avg;

    if (diff > 0.30) {
      avgBox.classList.add("bad");
    } else {
      avgBox.classList.remove("bad");
    }
  }
}

// attach listeners
document.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    const lane = e.target.dataset.lane;
    calc(lane);
  }
});

// keyboard navigation
document.addEventListener("keydown", (e) => {
  const active = document.activeElement;

  if (active.tagName !== "INPUT") return;

  let lane = parseInt(active.dataset.lane);
  let col = parseInt(active.dataset.col);

  if (e.key === "Enter") {
    e.preventDefault();
    move(lane, col === 1 ? 2 : lane + 1, col === 1 ? 2 : 1);
  }

  if (e.key === "ArrowRight") move(lane, lane, 2);
  if (e.key === "ArrowLeft") move(lane, lane, 1);
  if (e.key === "ArrowDown") move(lane + 1, 1, 1);
  if (e.key === "ArrowUp") move(lane - 1, 2, 2);
});

function move(lane, newLane, col) {
  if (newLane < 1 || newLane > lanes) return;

  const target = document.getElementById(`t${col}-${newLane}`);
  if (target) target.focus();
}

// reset
function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.00";
    document.getElementById(`avg-${i}`).classList.remove("bad");
  }
}
