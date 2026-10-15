import json
import math

with open("chamoli_river.json", "r") as f:
    coords = json.load(f)

# The avalanche started near Ronti peak / Rishiganga at ~ [79.730, 30.420]
start_point = [79.730, 30.420]

# Find the closest point in the dataset
def dist(p1, p2):
    return math.hypot(p1[0]-p2[0], p1[1]-p2[1])

# Since coords is just a flat list of points from multiple ways,
# let's reconstruct the ways first
ways = []
current_way = []
for i in range(len(coords)):
    if i > 0 and dist(coords[i], coords[i-1]) > 0.05:
        if current_way: ways.append(current_way)
        current_way = [coords[i]]
    else:
        current_way.append(coords[i])
if current_way: ways.append(current_way)

# Find the way closest to the start point
best_way = None
best_dist = 999
for way in ways:
    d1 = dist(way[0], start_point)
    d2 = dist(way[-1], start_point)
    if d1 < best_dist:
        best_dist = d1
        best_way = way
    if d2 < best_dist:
        best_dist = d2
        best_way = list(reversed(way))

# Now we have the starting way, let's stitch connecting ways!
stitched = list(best_way)
used_ways = [best_way]

for _ in range(5): # try to stitch up to 5 segments
    end_point = stitched[-1]
    next_way = None
    next_dist = 0.02 # must be close
    for way in ways:
        if way in used_ways or list(reversed(way)) in used_ways: continue
        d1 = dist(way[0], end_point)
        d2 = dist(way[-1], end_point)
        if d1 < next_dist:
            next_dist = d1
            next_way = way
        elif d2 < next_dist:
            next_dist = d2
            next_way = list(reversed(way))
            
    if next_way:
        stitched.extend(next_way)
        used_ways.append(next_way)
    else:
        break

with open("final_river.json", "w") as f:
    json.dump(stitched, f)

print(f"Stitched {len(stitched)} points for the river!")
