#!/bin/bash

# Phishing Page Generator - README.md Generator Script

README_CONTENT="
# 🎣 Phishing Page Generator (For Educational Use Only)

> **DISCLAIMER:** This tool is strictly for **educational**, **cybersecurity research**, and **awareness training** purposes **only**. Do **NOT** use it on any website without **explicit permission**. The author is not responsible for any misuse.

---

## 📌 Overview

This tool allows you to **clone a public login page** (e.g., Facebook, Instagram) **locally** for the purpose of **learning**, **demonstration**, and **CTF practice**. It helps in understanding how phishing attacks work in a **safe and controlled** environment.

---

## ✨ Features

- ✅ Clone login page HTML, CSS, and JavaScript
- ✅ Rewrite form actions to a **local credential listener**
- ✅ Download and store external assets into `assets/`
- ✅ Simulate credential harvesting with a **Flask server**
- ✅ Fully offline and local use – ideal for **phishing awareness training**

---

## ⚙️ How to Use

### 1. 📦 Install Dependencies

\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

### 2. 🛠 Generate a Phishing Page

\`\`\`bash
python generate.py --url https://example.com/login
\`\`\`

#### 📂 Output Structure:
\`\`\`
output/
├── index.html         # Cloned login page (offline)
├── server.py          # Flask server to capture credentials
└── assets/            # CSS, JS, images downloaded locally
\`\`\`

---

### 3. ▶️ Simulate Phishing Locally

\`\`\`bash
cd output
python server.py
\`\`\`

- Open \`index.html\` in your browser
- Submit dummy credentials
- View captured data in the terminal

---

## 🔧 Configuration Options

### CLI Flags:
- \`--url\` – URL of the login page to clone
- \`--output\` – Output directory (default: \`output\`)

### Code Customization:
- \`TARGET_ACTION\` in \`generate.py\` – Customize the form action rewrite
- \`LISTENER_SCRIPT\` in \`server.py\` – Adjust logging or save method for submitted credentials

---

## ✅ Example Use Cases (Ethical & Safe)

- 🎓 Cybersecurity workshops and phishing simulations
- 🔐 Red team practice in labs or CTF competitions
- 🧪 Study login form structure and behavior
- 🧠 Internal phishing awareness training (with permission)

---

## ⚠️ Legal & Ethical Notice

> This project is designed **strictly** for legal, ethical, and educational activities.  
> **Do NOT deploy publicly** or target systems you do not own or have authorization to test.

---

## 👨‍💻 Author

**Krish Prasad**  
Cybersecurity Enthusiast & Full-Stack Developer

---

> ⭐ If you find this helpful for your studies or awareness efforts, consider giving credit and promoting ethical cybersecurity education.
"

# Output the README content into a file
echo "$README_CONTENT" > README.md

# Notify user
echo "README.md has been generated successfully!"
