# Chemistry-Aware Predictive Battery Management System (BMS)

An advanced, edge-compatible **Predictive Thermal Management System** for Electric Vehicle (EV) battery packs that shifts safety paradigms from **reactive mitigation to proactive accident prevention**. This interactive dashboard utilizes an unsupervised statistical anomaly detection algorithm ($3\sigma$) to identify single-cell thermal irregularities *minutes before* physical temperatures reach critical thresholds, mitigating the risk of thermal runaway.

## 🚀 Live Simulation Link
👉 **[View Live Interactive Dashboard](REPLACE_WITH_YOUR_GITHUB_PAGES_URL)**

---

## 📌 Problem Statement
Traditional Battery Management Systems (BMS) are predominantly **reactive**—relying on static absolute temperature thresholds (e.g., triggering an alarm only when a cell crosses 60°C). By the time standard sensors flag this, localized chemical degradation (such as SEI layer breakdown and electrolyte decomposition) has often initiated an irreversible cascade known as **Thermal Runaway**. 

This project implements an intelligent software layer that continuously tracks the **rate of thermal acceleration** rather than absolute values, isolating internal short circuits or microscopic cell defects with **99.7% mathematical confidence** well in advance of a thermal incident.

---

## 🛠️ Tech Stack & Architecture
This system mimics a distributed **Edge-to-Cloud automotive telematics ecosystem** implemented via a lightweight, production-ready frontend framework:

* **Logic Core:** Vanilla JavaScript (ES6+) for real-time background processing, data matrix tracking, and physics-based heat conduction emulation.
* **Data Visualization:** `Chart.js` for high-fidelity, real-time plotting of continuous peak pack temperature curves.
* **User Interface:** HTML5 & CSS3 engineered into an automotive-grade diagnostics dashboard.
* **Telematics Relay:** Native Browser `Web Notifications API` simulating cross-platform vehicle-to-smartphone emergency push messaging.

---

## 🧠 Machine Learning Algorithm & Working
The predictive intelligence relies on an **Unsupervised Anomaly Detection Framework** built using a dynamic **Three-Sigma ($3\sigma$) / Z-Score Analysis**:

1.  **Feature Engineering:** The algorithm monitors the continuous thermal slope ($\Delta T / \Delta t$) of a 100-cell battery grid every 500ms.
2.  **Dynamic Baseline Profiling:** It continuously calculates the rolling mathematical Mean and Standard Deviation ($\sigma$) of the slopes across the entire cell population to establish a baseline for "normal thermal behavior" under current operating loads.
3.  **Adaptive Chemistry Modeling:** The statistical boundary automatically adjusts its mathematical sensitivity based on the selected cell chemistry properties via dynamic hyperparameters:
    $$\text{Threshold} = \text{Mean} + (3 \times \sigma \times \text{Stability Factor})$$

| Battery Chemistry | Stability Factor | AI Sensitivity | Thermal Spread Profile |
| :--- | :--- | :--- | :--- |
| **LFP (Lithium Iron Phosphate)** | `1.5` | Low (Wider Boundary) | Slow, localized crawl ($0.6\times$ speed) |
| **NMC (Nickel Manganese Cobalt)** | `1.0` | Balanced Baseline | Moderate standard propagation ($1.2\times$ speed) |
| **NCA (Nickel Cobalt Aluminum)** | `0.7` | Hyper-Sensitive (Tight) | Volatile, rapid domino cascade ($2.0\times$ speed) |

---

## 🕹️ How to Run the Simulation Locally
1.  Clone or download this repository containing `index.html`, `script.js`, and `style.css`.
2.  Open the folder inside **Visual Studio Code**.
3.  Install the **Live Server** extension from the marketplace.
4.  Click the **"Go Live"** button in the bottom-right status bar.
5.  **Execution Steps:**
    * Enter an alphanumeric **Vehicle Identification Number (VIN)** on the login screen to register your vehicle profile in cloud memory.
    * Grant browser permission for desktop notifications.
    * Select your target battery chemistry option (**LFP, NMC, or NCA**).
    * Click **"Simulate Cell Failure"** to inject a randomized internal field fault.
    * Observe the cell matrix color gradients shift, the `Chart.js` graph update, and the multi-tiered corrective actions sent directly to the **Service Diagnostics Inbox** at the bottom of the screen.

---

## 💼 Industry Use & Real-World Applications
* **Next-Generation Embedded BMS:** Logic patterns designed to be flashed into vehicle microcontrollers for fast execution over local CAN buses.
* **Cloud Fleet Telematics:** Allows commercial fleet operators to map data against thousands of VINs concurrently to schedule preventative maintenance before highway failures happen.
* **Grid Energy Storage Systems (BESS):** Enables automated isolation of localized battery racks in renewable energy sub-stations, preventing multi-million dollar asset destruction.
