import json

with open("flood-dashboard/public/real_coordinates.json", "r") as f:
    data = json.load(f)

# Find ways that represent the reservoir (natural=water)
reservoir_ways = []
for el in data.get('elements', []):
    if el['type'] == 'way' and 'geometry' in el:
        # Check if it has natural=water
        tags = el.get('tags', {})
        if tags.get('natural') == 'water':
            # It's part of the reservoir
            coords = [[node['lon'], node['lat']] for node in el['geometry']]
            reservoir_ways.append(coords)

# Just save the biggest one or all of them as a MultiPolygon feature
# Let's save them as a FeatureCollection of polygons
features = []
for way in reservoir_ways:
    if len(way) > 3:
        # ensure it's closed
        if way[0] != way[-1]:
            way.append(way[0])
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Polygon",
                "coordinates": [way]
            },
            "properties": {}
        })

fc = {
    "type": "FeatureCollection",
    "features": features
}

with open("flood-dashboard/src/reservoir.json", "w") as f:
    json.dump(fc, f)
print(f"Extracted {len(features)} reservoir polygons.")
