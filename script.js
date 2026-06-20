const VERSION = "1.7";
document.getElementById("version").innerText = "Version " + VERSION;

const lanes = 12;
const container = document.getElementById("table");

// build table
for (let i = 1; i <= lanes; i++) {
  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
    <div class="lane">${i}</div>
    <input id="t1-${i}" data-lane="${i}" data-col="1" inputmode="decimal" />
    <input id="t2-${i}" data-lane="${i}" data-col="2" inputmode="decimal" />
    <div class="avg" id="avg-${i}">0.00</div>
  `;

  container.appendChild(row);
}

// force numeric cleanup (extra safety)
function sanitize(val) {
  return val.replace(/[^0-9.]/g, "");
}

// calc avg
function calc(lane) {
  const t1 = parseFloat(document.getElementById(`t1-${lane}`).value);
  const t2 = parseFloat(document.getElementById(`t2-${lane}`).value);

  if (!isNaN(t1) && !isNaN(t2)) {
    document.getElementById(`avg-${lane}`).innerText =
      ((t1 + t2) / 2).toFixed(2);
  }
}

// input handler
document.addEventListener("input", (e) => {
  if (e.target.tagName !== "INPUT") return;

  e.target.value = sanitize(e.target.value);

  const lane = parseInt(e.target.dataset.lane);
  const col = parseInt(e.target.dataset.col);

  calc(lane);

  const value = e.target.value;

  // auto advance
  if (value.length >= 3) {
    if (col === 1) {
      document.getElementById(`t2-${lane}`).focus();
    } else {
      const next = lane + 1;
      if (next <= lanes) {
        document.getElementById(`t1-${next}`).focus();
      }
    }
  }
});

// RESET
function resetHeat() {
  for (let i = 1; i <= lanes; i++) {
    document.getElementById(`t1-${i}`).value = "";
    document.getElementById(`t2-${i}`).value = "";
    document.getElementById(`avg-${i}`).innerText = "0.00";
  }
}

/* -------------------------
   🎤 VOICE INPUT (OPTIONAL)
--------------------------*/
function startVoice() {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice input not supported on this device/browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.start();

  recognition.onresult = (event) => {
    let text = event.results[0][0].transcript;

    // convert spoken numbers like "thirty two point one five"
    text = text.replace(/[^0-9.]/g, "");

    const active = document.activeElement;

    if (active && active.tagName === "INPUT") {
      active.value = text;
      active.dispatchEvent(new Event("input"));
    }
  };
}
