import urllib.request
import json
import ssl
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Query specific to Rishiganga / Dhauliganga in Chamoli
query = """
[out:json][timeout:25];
way["waterway"="river"](30.40, 79.55, 30.50, 79.75);
out geom;
"""

endpoints = [
    "https://overpass.osm.ch/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass-api.de/api/interpreter"
]

for url in endpoints:
    print(f"Trying {url}...")
    req = urllib.request.Request(url, data=query.encode('utf-8'))
    req.add_header('User-Agent', 'Mozilla/5.0')
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=15) as response:
            data = json.loads(response.read().decode('utf-8'))
            
            coords = []
            for element in data.get('elements', []):
                if element['type'] == 'way' and 'geometry' in element:
                    way_coords = [[node['lon'], node['lat']] for node in element['geometry']]
                    # We just need one continuous sequence, or all of them.
                    coords.extend(way_coords)
            
            if len(coords) > 0:
                print("SUCCESS")
                with open("chamoli_river.json", "w") as f:
                    json.dump(coords, f)
                sys.exit(0)
    except Exception as e:
        print("Failed:", e)

print("ALL FAILED")
