import json
with open("coordinate.json", "r") as f:
    data = json.load(f)

lines = []
for el in data.get('elements', []):
    if el.get('type') == 'way' and 'geometry' in el:
        tags = el.get('tags', {})
        name = tags.get('name', 'Unknown')
        geom = el['geometry']
        if geom:
            lines.append((name, len(geom), (geom[0]['lon'], geom[0]['lat']), (geom[-1]['lon'], geom[-1]['lat'])))

for name, length, start, end in lines[:20]:
    print(f"{name}: length {length}, start {start}, end {end}")
