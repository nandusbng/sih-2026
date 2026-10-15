import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Overpass query to find water features (rivers/glaciers) near Chamoli, Uttarakhand
# Bounding box around Rishiganga river / Nanda Devi glacier
query = """
[out:json];
(
  way["waterway"="river"](30.35,79.60, 30.55,79.80);
  way["natural"="water"](30.35,79.60, 30.55,79.80);
  way["natural"="glacier"](30.35,79.60, 30.55,79.80);
);
out geom;
"""

url = "https://overpass-api.de/api/interpreter"
req = urllib.request.Request(url, data=query.encode('utf-8'))
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode('utf-8'))
        with open("chamoli_raw.json", "w") as f:
            json.dump(data, f)
        print(f"Downloaded {len(data['elements'])} elements.")
except Exception as e:
    print("Error:", e)
