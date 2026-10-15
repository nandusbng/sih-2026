import urllib.request
import json
import ssl

query = """
[out:json];
(
  way["waterway"="river"](18.40, 73.74, 18.48, 73.82);
  way["natural"="water"](18.40, 73.74, 18.48, 73.82);
  relation["natural"="water"](18.40, 73.74, 18.48, 73.82);
);
out geom;
"""

url = "https://overpass.kumi.systems/api/interpreter"
req = urllib.request.Request(url, data=query.encode('utf-8'))
req.add_header('User-Agent', 'Mozilla/5.0')
req.add_header('Content-Type', 'application/x-www-form-urlencoded')

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

print("Downloading coordinates from alternative server...")
try:
    with urllib.request.urlopen(req, context=ctx) as response:
        with open("flood-dashboard/public/real_coordinates.json", "w") as f:
            f.write(response.read().decode())
        print("Success! Downloaded real_coordinates.json")
except Exception as e:
    print(f"Failed: {e}")
