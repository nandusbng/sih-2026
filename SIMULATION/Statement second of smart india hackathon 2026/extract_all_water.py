import json

with open("coordinate.json", "r") as f:
    data = json.load(f)

features = []
for el in data.get('elements', []):
    if el.get('type') == 'way' and 'geometry' in el:
        coords = [[node['lon'], node['lat']] for node in el['geometry']]
        # Determine if it's a closed loop (polygon) or linestring
        if len(coords) >= 4 and coords[0] == coords[-1]:
            geom = {"type": "Polygon", "coordinates": [coords]}
        else:
            geom = {"type": "LineString", "coordinates": coords}
            
        features.append({
            "type": "Feature",
            "properties": el.get('tags', {}),
            "geometry": geom
        })

geojson = {
    "type": "FeatureCollection",
    "features": features
}

with open("flood-dashboard/src/all_water.geojson", "w") as f:
    json.dump(geojson, f)

print(f"Extracted {len(features)} water features to all_water.geojson.")
