import json
import math
import random

with open("flood-dashboard/src/all_water.json", "r") as f:
    water_data = json.load(f)

points = []
# We will generate particles by walking along every LineString/Polygon
for feature in water_data.get('features', []):
    props = feature.get('properties', {})
    name = props.get('name', '')
    
    # Strictly allow ONLY the main connected rivers and the dam reservoir.
    # We must completely ignore generic "water=reservoir" ponds!
    allowed_names = ['Mutha', 'Mula', 'Mula-Mutha', 'Khadakwasla Reservoir']
    if name not in allowed_names:
        continue

    geom = feature.get('geometry', {})
    geom_type = geom.get('type')
    coords = geom.get('coordinates', [])
    
    if not coords: continue
    
    paths = []
    if geom_type == 'LineString':
        paths = [coords]
    elif geom_type == 'Polygon':
        paths = coords

    for path in paths:
        for i in range(len(path) - 1):
            p1 = path[i]
            p2 = path[i+1]
            
            # Calculate distance between p1 and p2
            dx = (p2[0] - p1[0]) * 105
            dy = (p2[1] - p1[1]) * 111
            dist = math.sqrt(dx*dx + dy*dy)
            
            # Number of particles for this segment based on length
            num_particles = int(dist * 2000)
            
            for _ in range(num_particles):
                # Random position along the segment
                t = random.random()
                base_lng = p1[0] + t * (p2[0] - p1[0])
                base_lat = p1[1] + t * (p2[1] - p1[1])
                
                # Distance from the dam breach (73.763, 18.435)
                dist_from_dam = math.sqrt(((base_lng - 73.763) * 105)**2 + ((base_lat - 18.435) * 111)**2)
                
                color = "#3b82f6" # Default blue
                
                if name == 'Khadakwasla Reservoir' or base_lng < 73.75:
                    # Reservoir is mostly calm deep water (blue)
                    scatter_amount = 0.0015
                    scatter_x = random.gauss(0, scatter_amount)
                    scatter_y = random.gauss(0, scatter_amount)
                    scatter_dist = math.sqrt((scatter_x*105)**2 + (scatter_y*111)**2)
                    
                    if scatter_dist < 0.04 and random.random() < 0.05:
                        color = "#eab308" # Occasional yellow in reservoir center
                else:
                    # River (East of dam)
                    # MASSIVE water spread near the dam (explodes outward)
                    scatter_amount = 0.0012
                    if dist_from_dam < 4.0:
                        # Up to 5x wider right at the dam breach!
                        scatter_amount += 0.005 * (1.0 - (dist_from_dam / 4.0))
                        
                    scatter_x = random.gauss(0, scatter_amount)
                    scatter_y = random.gauss(0, scatter_amount)
                    scatter_dist = math.sqrt((scatter_x*105)**2 + (scatter_y*111)**2)
                    
                    # Red ONLY near the dam (fade out quickly within 5km)
                    red_prob = max(0, 1.0 - (dist_from_dam / 5.0))
                    yellow_prob = max(0, 1.0 - (dist_from_dam / 15.0))
                    
                    # Normalize scatter_dist to check if we are in the "center" of the flow
                    normalized_dist = scatter_dist / (scatter_amount * 105)
                    
                    if normalized_dist < 1.0: # Center flow
                        rand_val = random.random()
                        # Randomize red dots strictly near the dam, highly concentrated
                        if rand_val < red_prob:
                            color = "#ef4444" # Red!
                        elif rand_val < (red_prob + yellow_prob):
                            color = "#eab308" # Yellow!
                        else:
                            color = "#3b82f6" # Blue
                    elif normalized_dist < 2.0: # Edge flow
                        if random.random() < (yellow_prob * 0.5):
                            color = "#eab308" # Occasional yellow at edges
                        else:
                            color = "#3b82f6"
                
                # Time index mapping (Dam is ~73.763, everything west is instant)
                idx_approx = 1
                if name != 'Khadakwasla Reservoir' and base_lng > 73.763:
                    # Map 73.763 -> 74.15 to steps 0 -> 320
                    base_flow = (base_lng - 73.763) * 900
                    turbulence = random.uniform(-10, 15)
                    idx_approx = int(base_flow + turbulence)
                
                points.append({
                    "coords": [base_lng + scatter_x, base_lat + scatter_y],
                    "idx": max(1, idx_approx),
                    "color": color
                })

# Subsample if there are too many to keep performance high
if len(points) > 25000:
    points = random.sample(points, 25000)

with open("flood-dashboard/src/sphPoints.json", "w") as f:
    json.dump(points, f)

print(f"Generated {len(points)} highly realistic flow particles.")
