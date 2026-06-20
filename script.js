const VERSION = "1.4";
document.getElementById("version").innerText = "Version " + VERSION;

const lanes = 12;
const container = document.getElementById("table");

// build UI
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

// calculate averages
function calc(lane) {
  const t1 = parseFloat(document.getElementById(`t1-${lane}`).value);
  const t2 = parseFloat(document.getElementById(`t2-${lane}`).value);

  if (!isNaN(t1) && !isNaN(t2)) {
    const avg = ((t1 + t2) / 2).toFixed(2);
    document.getElementById(`avg-${lane}`).innerText = avg;
  }
}

// input listener
document.addEventListener("input", (e) => {
  if (e.target.tagName === "INPUT") {
    calc(e.target.dataset.lane);
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
