const lanes = 12;

const container = document.getElementById("table");

// build table
for (let i = 1; i <= lanes; i++) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <div>Lane ${i}</div>
    <input id="t1-${i}" oninput="calc(${i})" />
    <input id="t2-${i}" oninput="calc(${i})" />
    <div class="avg" id="avg-${i}">0.00</div>
  `;

  container.appendChild(row);
}

function calc(lane) {
  const t1 = parseFloat(document.getElementById(`t1-${lane}`).value);
  const t2 = parseFloat(document.getElementById(`t2-${lane}`).value);

  if (!isNaN(t1) && !isNaN(t2)) {
    const avg = ((t1 + t2) / 2).toFixed(2);
    document.getElementById(`avg-${lane}`).innerText = avg;
  }
}

function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.00";
  }
}
