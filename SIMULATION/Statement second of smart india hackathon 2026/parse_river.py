import json, os
with open("river_raw.json") as f:
    data = json.load(f)
coords = []
for element in data.get('elements', []):
    if element['type'] == 'way' and 'geometry' in element:
        way_coords = [[node['lon'], node['lat']] for node in element['geometry']]
        coords.append(way_coords)
geojson = {"type": "FeatureCollection", "features": []}
for line in coords:
    geojson['features'].append({
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": line},
        "properties": {}
    })
os.makedirs("flood-dashboard/public", exist_ok=True)
with open("flood-dashboard/public/river.geojson", "w") as f:
    json.dump(geojson, f)
print(f"Saved {len(coords)} river segments")
