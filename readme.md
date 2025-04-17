================================================================================
          Phishing Page Generator (For Educational Use Only)
================================================================================

Clone a public login page (e.g., Facebook, Instagram) locally to simulate credential
capture for educational, awareness, and ethical testing purposes only.

!!! WARNING !!!
This tool is strictly for LOCAL USE, CTF practice, cybersecurity research, or raising
awareness about phishing threats. NEVER deploy publicly or use maliciously.

================================================================================
Features
================================================================================

- Clone login page HTML, CSS, and JS
- Rewrite form actions to a local listener
- Download external assets (CSS, JS, images) to a local assets/ folder
- Simulate credential harvesting with a Python Flask server
- Ideal for safe phishing technique demos

================================================================================
How to Use
================================================================================

1. Install Dependencies
   Run: pip install -r requirements.txt

2. Generate the Phishing Page
   Run: python generate.py --url https://example.com/login

   Output structure:
   output/
   ├── index.html         (cloned login page, works locally)
   ├── server.py          (credential listener script)
   └── assets/            (cloned CSS, JS, images)

3. Simulate Phishing Locally
   Run: cd output
        python server.py
   Open index.html in a browser, submit the form, and view credentials in the terminal.

================================================================================
Configuration
================================================================================

Flags:
  --url          URL of the login page to clone
  --output       Output directory (default: output)

Customize:
  - TARGET_ACTION in generate.py for form submission endpoint
  - LISTENER_SCRIPT in server.py for logging or saving behavior

================================================================================
Example Use Cases (Safe & Ethical)
================================================================================

- Run phishing simulations for cyber awareness workshops
- Study login form mechanics
- Practice red team tactics in labs or CTF competitions

================================================================================
Disclaimer
================================================================================

This tool is for EDUCATIONAL and RESEARCH purposes only. Do NOT use on websites you
do not own or have explicit permission to test. The authors are not responsible for
any misuse or damage caused.

================================================================================
Author
================================================================================

Krish Prasad
Cybersecurity Enthusiast & Full-Stack Developer

================================================================================