### 3. Thermal Management System — README.md
```markdown
# Thermal Management System

A closed-loop, automotive-grade control architecture engineered to optimize electric vehicle (EV) powertrain operating efficiency. The system monitors high-voltage cell telemetry and controls fluid cooling loops dynamically to preserve battery safety.

## System Architecture
The embedded control loop operates seamlessly from hardware data streams to reactive actuators:
1. **Sensor Ingestion:** Collects low-level analog telemetry via embedded hardware interfaces.
2. **Error Evaluation:** Processes real-time temperature and current profiles to identify thermal tracking errors.
3. **Actuation Control:** Utilizes closed-loop logic to regulate cooling infrastructure instantly.

## Key Features
* **Low-Level Telemetry Processing:** Ingests real-time cell telemetry efficiently from thermistor arrays (temperature profiling) and shunt resistors (current tracking).
* **Closed-Loop Mitigation:** Implements Proportional-Integral-Derivative (PID) logic to dynamically control fluid cooling loops, reducing Motor Control Unit (MCU) thermal stress.
* **Thermal Runaway Prevention:** Actively throttles power draw and balances thermal dissipation profiles to eliminate catastrophic runaway states in the power inverter and MCU.
* **Industry Standard Compliance:** Developed in strict alignment with MISRA C guidelines and optimized for execution across a localized CAN bus network.

## Technology Stack
* **Domain:** Automotive Embedded Systems, Battery Management Systems (BMS)
* **Hardware Integration:** Thermistor Arrays, Shunt Resistors
* **Control Theory:** PID Logic
* **Protocols & Standards:** CAN bus, MISRA C

## Installation & Setup
```bash
# Clone the repository
git clone [https://github.com/nayana649/Thermal-Management-System.git](https://github.com/nayana649/Thermal-Management-System.git)
cd Thermal-Management-System

# Note: This repository contains embedded C scripts compliant with MISRA C.
# Build instructions depend on your specific target microcontroller toolchain.
make all
