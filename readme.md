# 🎣 Phishing Page Generator (For Educational Use Only)

Clone any public login page (e.g., Facebook, Instagram) **locally** and **simulate credential capture** for educational, awareness, and ethical testing purposes only.

> ❗ This tool is meant **strictly for local use**, CTF practice, cybersecurity research, or raising awareness about phishing threats.  
> **Never deploy publicly or use it maliciously.**

---

## 📸 Features

- 🧪 Clone any login page’s **HTML + CSS + JS**
- 🛠 Automatically rewrites `<form>` actions to local listener
- 📦 Downloads all external assets (CSS, JS, images) into local `assets/`
- 📥 Simulates credential harvesting using a local Python Flask server
- 💻 Perfect for demonstrating phishing techniques in a safe environment

---

## 🚀 How to Use

### 1. 📦 Install Dependencies

```bash
pip install -r requirements.txt
2. 🔗 Run the Generator
bash
Copy
Edit
python generate.py --url https://example.com/login
This will create a folder like:

pgsql
Copy
Edit
output/
├── index.html         ← cloned login page (locally working)
├── server.py          ← simple listener script
└── assets/            ← CSS/JS/images cloned from target site
3. 🧪 Simulate Local Phishing
Run the local listener:

bash
Copy
Edit
cd output
python server.py
Then open index.html in a browser and submit the form.
The credentials will be printed in your terminal.

⚙️ Configuration

Flag	Description
--url	URL of the login page to clone
--output	Output directory (default: output)
You can also modify:

TARGET_ACTION in generate.py to customize where the form submits

The LISTENER_SCRIPT for custom logging or saving behavior

✅ Example Use Case (Safe Testing)
✅ Simulate phishing for an internal cyber awareness workshop

✅ Analyze how login forms work

✅ Practice safe red team tactics in labs or CTF competitions

⚠️ Disclaimer
This tool is provided for educational and research purposes only.
Do NOT use this tool on websites you do not own or have explicit permission to test.
The authors are not responsible for any misuse or damage caused.

👨‍💻 Author
Krish Prasad
Cybersecurity enthusiast & full-stack developer