import urllib.request
import json
import os
import ssl

query = """
[out:json];
(
  way["waterway"="river"](18.43,73.75,18.55,73.88);
);
out geom;
"""

url = "https://overpass-api.de/api/interpreter"
req = urllib.request.Request(url, data=query.encode('utf-8'))
req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')

# Bypass SSL verification
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    with urllib.request.urlopen(req, context=ctx) as response:
        data = json.loads(response.read().decode())
        
        coords = []
        for element in data.get('elements', []):
            if element['type'] == 'way' and 'geometry' in element:
                way_coords = [[node['lon'], node['lat']] for node in element['geometry']]
                coords.append(way_coords)
                
        # Merge all LineStrings into one big list of points (roughly sorted)
        # For simplicity, we just dump them to use as reference
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        all_points = []
        for line in coords:
            all_points.extend(line)
            geojson['features'].append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": line
                },
                "properties": {}
            })
            
        os.makedirs("flood-dashboard/public", exist_ok=True)
        with open("flood-dashboard/public/river.geojson", "w") as f:
            json.dump(geojson, f)
            
        # Also dump a flat array of points to river_points.json for App.jsx to import easily
        with open("flood-dashboard/src/river_points.json", "w") as f:
            json.dump(all_points, f)
            
        print(f"Saved {len(coords)} river segments. Total points: {len(all_points)}")
except Exception as e:
    print(f"Error: {e}")
