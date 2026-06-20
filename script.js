const VERSION = "2.2";

document.getElementById("version").innerText =
    "Version " + VERSION;

const lanes = 12;
const container = document.getElementById("table");

// Build rows
for(let i=1;i<=lanes;i++){

    const row = document.createElement("div");
    row.className = "row";

    row.innerHTML = `
        <div class="lane">${i}</div>
        <input id="t1-${i}" data-lane="${i}" data-col="1">
        <input id="t2-${i}" data-lane="${i}" data-col="2">
        <div class="avg" id="avg-${i}">0.000</div>
    `;

    container.appendChild(row);
}


// Beep
function beep(){

    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.value = 880;

    gain.gain.value = 0.08;

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();

    osc.stop(ctx.currentTime + .12);

}


// Update fastest swimmer
function updateBest(){

    let bestLane = null;
    let bestTime = Infinity;

    for(let i=1;i<=lanes;i++){

        let avg =
            parseFloat(document.getElementById(`avg-${i}`).innerText);

        if(!isNaN(avg) && avg > 0){

            if(avg < bestTime){

                bestTime = avg;
                bestLane = i;

            }

        }

    }

    for(let i=1;i<=lanes;i++){

        document
            .getElementById(`avg-${i}`)
            .classList.remove("best");

    }

    if(bestLane){

        document
            .getElementById(`avg-${bestLane}`)
            .classList.add("best");

    }

}


// Calculate average
function calc(lane){

    const t1 =
        parseFloat(document.getElementById(`t1-${lane}`).value);

    const t2 =
        parseFloat(document.getElementById(`t2-${lane}`).value);

    const avgBox =
        document.getElementById(`avg-${lane}`);

    if(!isNaN(t1) && !isNaN(t2)){

        let avg = (t1+t2)/2;

        avgBox.innerText = avg.toFixed(3);

        if(!avgBox.dataset.done){

            beep();

            avgBox.dataset.done = "true";

        }

        updateBest();

    }

}


// Input handler
document.addEventListener("input",(e)=>{

    if(e.target.tagName !== "INPUT")
        return;

    const lane =
        parseInt(e.target.dataset.lane);

    const col =
        parseInt(e.target.dataset.col);

    calc(lane);

    let value = e.target.value;

    // Auto advance after three decimal digits
    if(
        value.includes(".") &&
        value.split(".")[1]?.length >= 3
    ){

        setTimeout(()=>{

            if(col===1){

                document
                    .getElementById(`t2-${lane}`)
                    .focus();

            }
            else{

                let nextLane = lane + 1;

                if(nextLane <= lanes){

                    document
                        .getElementById(`t1-${nextLane}`)
                        .focus();

                }

            }

        },80);

    }

});


// Reset
function resetHeat(){

    for(let i=1;i<=lanes;i++){

        document.getElementById(`t1-${i}`).value = "";

        document.getElementById(`t2-${i}`).value = "";

        document.getElementById(`avg-${i}`).innerText = "0.000";

        document.getElementById(`avg-${i}`).dataset.done = "";

        document
            .getElementById(`avg-${i}`)
            .classList.remove("best");

    }

    document.getElementById("t1-1").focus();

}
