const grid = document.getElementById('battery-grid');
const statusText = document.getElementById('system-status');
const predictionText = document.getElementById('prediction-status');
const logsDiv = document.getElementById('logs');
const chemistrySelect = document.getElementById('chemistry-select');
const chemistryInfo = document.getElementById('chemistry-info');
const inboxMessages = document.getElementById('inbox-messages');
const inboxCount = document.getElementById('inbox-count');

let cells = [];
let chart;
let timeIndex = 0;
let lastMilestoneReached = 0;
let isSystemLocked = false;
let vehicleVIN = "";
let messageCounter = 0;

const chemistryConfig = {
    LFP: { stabilityFactor: 1.5, propagationSpeed: 0.6, label: "LFP: High Safety / Thermal Stability" },
    NMC: { stabilityFactor: 1.0, propagationSpeed: 1.2, label: "NMC: Balanced Energy / Performance" },
    NCA: { stabilityFactor: 0.7, propagationSpeed: 2.0, label: "NCA: High Performance / Volatile" }
};

const alertMilestones = {
    1: { label: "ANOMALY DETECTED", color: "#f1c40f", msg: "AI detected initial cell degradation." },
    25: { label: "MODERATE RISK", color: "#f39c12", msg: "25% pack compromise. Activating cooling." },
    50: { label: "HIGH RISK", color: "#e67e22", msg: "50% pack compromise. Partial shutdown." },
    75: { label: "CRITICAL FAILURE", color: "#e74c3c", msg: "75% failure. Imminent runaway." },
    90: { label: "DANGER: EVACUATE", color: "#8b0000", msg: "90% pack loss. SYSTEM TERMINATED." }
};

function registerVehicle() {
    const vinInput = document.getElementById('vin-input').value;
    if (vinInput.length < 5) {
        alert("Please enter a valid VIN.");
        return;
    }
    vehicleVIN = vinInput;
    document.getElementById('registration-overlay').style.display = 'none';
    if ("Notification" in window) Notification.requestPermission();
    addLog(`System: Vehicle ${vehicleVIN} registered. Cloud Telemetry active.`);
    addInboxMessage("System Welcome", `Predictive services enabled for VIN: ${vehicleVIN}.`);
}

function sendPushAlert(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(`BMS Alert [${vehicleVIN}]`, { body: message });
    }
}

function addInboxMessage(subject, body) {
    if (messageCounter === 0) inboxMessages.innerHTML = ''; 
    messageCounter++;
    inboxCount.innerText = messageCounter;
    const msgDiv = document.createElement('div');
    msgDiv.style.background = "#0f172a";
    msgDiv.style.padding = "10px";
    msgDiv.style.marginBottom = "8px";
    msgDiv.style.borderRadius = "5px";
    msgDiv.style.borderLeft = "4px solid #3b82f6";
    msgDiv.innerHTML = `
        <div style="font-weight: bold; color: #3b82f6; margin-bottom: 3px;">${subject}</div>
        <div style="color: #cbd5e1; line-height: 1.3;">${body}</div>
        <div style="font-size: 9px; color: #64748b; margin-top: 6px;">Sent: ${new Date().toLocaleTimeString()}</div>
    `;
    inboxMessages.prepend(msgDiv);
}

function triggerTieredAlert(milestone) {
    if (milestone <= lastMilestoneReached) return; 
    lastMilestoneReached = milestone;
    const data = alertMilestones[milestone];
    
    predictionText.innerText = `AI ALERT: ${data.label}`;
    predictionText.style.color = data.color;
    sendPushAlert(data.label, data.msg);

    // RESTORED: Tier-specific logic and messages
    if (milestone === 1) {
        addInboxMessage("Anomaly Alert", "Early-stage thermal deviation detected in a single cell.");
    } else if (milestone === 25) {
        addInboxMessage("Maintenance Advice", "25% compromise. Switch to Eco-mode to reduce discharge stress.");
    } else if (milestone === 50) {
        addInboxMessage("Service Alert", "50% failure. Thermal propagation is active. Service required.");
    } else if (milestone === 75) {
        statusText.innerText = "CRITICAL";
        addInboxMessage("EMERGENCY", "75% failure. AI predicting total pack loss within minutes.");
    } else if (milestone === 90 && !isSystemLocked) {
        isSystemLocked = true;
        handleTotalFailure();
    }

    addLog(`<strong style="color:${data.color}">[Tier ${milestone}] ${data.msg}</strong>`);
}

// RESTORED: Dangerous Alert with Causes
function handleTotalFailure() {
    const chem = chemistrySelect.value;
    setTimeout(() => {
        alert(`🚨 TERMINAL SYSTEM FAILURE (VIN: ${vehicleVIN}) 🚨\n\n` +
              `CAUSE OF RUNAWAY:\n` +
              `1. Internal Short Circuit due to ${chem} volatility.\n` +
              `2. Electrolyte Decomposition at high temperatures.\n` +
              `3. SEI Layer Breakdown causing exothermic chain reaction.\n\n` +
              `DANGER: If battery is NOT replaced, localized fires and toxic gas release (HF) are 100% certain.\n\n` +
              `ACTION: Evacuate vehicle immediately.`);
        
        addInboxMessage("FINAL WARNING", "SYSTEM TERMINATED. High probability of explosion if power is applied.");
        statusText.innerText = "TERMINATED";
        statusText.style.color = "#ff4444";
    }, 1000);
}

function updateSystem() {
    if (!vehicleVIN) return;
    let maxTemp = 0;
    let packSlopes = [];
    let degradedCount = 0;
    const chem = chemistryConfig[chemistrySelect.value];

    cells.forEach(cell => {
        packSlopes.push(cell.temp - cell.prevTemp);
        cell.prevTemp = cell.temp;
    });

    const aiModel = runAIInference(packSlopes);

    cells.forEach((cell, index) => {
        if (cell.isFailing) {
            cell.temp += (cell.temp < 1200) ? (15 + Math.random() * 10) * chem.propagationSpeed : (Math.random() - 0.7);
        } else {
            cell.temp += (Math.random() - 0.5) * 0.2;
        }

        if (cell.temp > 40) degradedCount++;

        let currentSlope = cell.temp - cell.prevTemp;
        // Check for 1st cell anomaly
        if (currentSlope > aiModel.threshold && currentSlope > 1 && !cell.hasPredicted) { 
            triggerTieredAlert(1);
            cell.hasPredicted = true;
        }

        if (cell.temp > 45) {
            const neighbors = [index - 1, index + 1, index - 10, index + 10];
            neighbors.forEach(nIndex => {
                if (nIndex >= 0 && nIndex < 100 && cells[nIndex].temp < 1200) {
                    cells[nIndex].temp += (1.2 * chem.propagationSpeed); 
                }
            });
        }
        if (cell.temp > maxTemp) maxTemp = cell.temp;
        cell.element.innerText = Math.floor(cell.temp) + '°';
        updateCellColor(cell);
    });

    // RESTORED: Check for degraded cell count milestones
    const milestones = [90, 75, 50, 25];
    for (let m of milestones) {
        if (degradedCount >= m) { triggerTieredAlert(m); break; }
    }
    updateGraph(maxTemp);
}

// Utility functions (colors, graph, etc. - keep same as before)
function runAIInference(currentSlopes) {
    const chem = chemistryConfig[chemistrySelect.value];
    const mean = currentSlopes.reduce((a, b) => a + b) / currentSlopes.length;
    const stdDev = Math.sqrt(currentSlopes.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / currentSlopes.length) || 0.1;
    return { mean, threshold: mean + (stdDev * 3 * chem.stabilityFactor) }; 
}
function updateCellColor(cell) {
    if (cell.temp > 70) cell.element.style.backgroundColor = "#e74c3c"; 
    else if (cell.temp > 50) cell.element.style.backgroundColor = "#f39c12"; 
    else if (cell.temp > 40) cell.element.style.backgroundColor = "#f1c40f"; 
    else cell.element.style.backgroundColor = "#2ecc71"; 
}
function initChart() {
    const ctx = document.getElementById('tempChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Max Pack Temp (°C)',
                data: [],
                borderColor: '#3b82f6',
                borderWidth: 2,
                fill: true,
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4
            }]
        },
        options: {
            scales: { y: { min: 20, max: 1300 }, x: { ticks: { display: false } } },
            plugins: { legend: { display: false } }
        }
    });
}
function updateGraph(temp) {
    timeIndex++;
    chart.data.labels.push(timeIndex);
    chart.data.datasets[0].data.push(temp);
    if (chart.data.labels.length > 20) {
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }
    chart.update('none'); 
}
function addLog(message) {
    const time = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.style.borderBottom = "1px solid #334155"; entry.style.padding = "4px 0";
    entry.innerHTML = `<span style="color: #64748b;">[${time}]</span> ${message}`;
    logsDiv.prepend(entry); 
}
function startRunaway() {
    const randomCell = Math.floor(Math.random() * 100);
    cells[randomCell].isFailing = true;
    addLog(`USER: Fault injection at Cell #${randomCell}.`);
}
function createPack() {
    grid.innerHTML = ''; cells = [];
    for (let i = 0; i < 100; i++) {
        const div = document.createElement('div'); div.className = 'cell'; div.innerText = '25°';
        grid.appendChild(div);
        cells.push({ element: div, temp: 25, prevTemp: 25, isFailing: false, hasPredicted: false });
    }
}
function updateChemistryProfile() {
    const selected = chemistrySelect.value;
    chemistryInfo.innerText = `Profile: ${chemistryConfig[selected].label}`;
    addLog(`BMS: Re-calibrating for ${selected}.`);
}

initChart();
createPack();
setInterval(updateSystem, 500);