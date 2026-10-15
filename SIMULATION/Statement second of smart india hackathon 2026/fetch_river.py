import urllib.request
import json
import os

query = """
[out:json];
(
  way["waterway"="river"](18.43,73.75,18.55,73.88);
);
out geom;
"""

url = "https://overpass-api.de/api/interpreter"
req = urllib.request.Request(url, data=query.encode('utf-8'))
try:
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode())
        
        # Extract coordinates
        coords = []
        for element in data['elements']:
            if element['type'] == 'way':
                way_coords = [[node['lon'], node['lat']] for node in element['geometry']]
                coords.append(way_coords)
                
        # Save as geojson
        geojson = {
            "type": "FeatureCollection",
            "features": []
        }
        
        for line in coords:
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
        print(f"Successfully saved {len(coords)} river segments to river.geojson")
except Exception as e:
    print(f"Error: {e}")
