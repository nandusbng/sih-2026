import json
import math

# Coordinates roughly near Mullaperiyar dam or a generic river valley
DAM_LAT = 9.528
DAM_LON = 77.149

def generate_polygon(center_lat, center_lon, radius_deg, aspect_ratio=0.3, rotation_deg=45):
    # Generates an elongated polygon (ellipse-like) to simulate a river valley flood
    points = []
    num_points = 30
    rot_rad = math.radians(rotation_deg)
    
    for i in range(num_points):
        angle = 2 * math.pi * i / num_points
        # create ellipse
        x = radius_deg * math.cos(angle)
        y = radius_deg * aspect_ratio * math.sin(angle)
        
        # rotate
        rot_x = x * math.cos(rot_rad) - y * math.sin(rot_rad)
        rot_y = x * math.sin(rot_rad) + y * math.cos(rot_rad)
        
        # shift center, and actually we want the flood to spread *from* the dam down the valley
        # so we shift the ellipse along its major axis based on radius
        offset_dist = radius_deg * 0.9
        shift_x = offset_dist * math.cos(rot_rad)
        shift_y = offset_dist * math.sin(rot_rad)
        
        points.append([center_lon + rot_x + shift_x, center_lat + rot_y + shift_y])
        
    points.append(points[0]) # close polygon
    return points

def main():
    frames = []
    num_frames = 10
    
    for t in range(num_frames):
        # Flood expands over time
        radius = 0.01 + (t * 0.015) # Roughly 1km to 15km
        
        poly = generate_polygon(DAM_LAT, DAM_LON, radius, aspect_ratio=0.4, rotation_deg=-30)
        
        feature = {
            "type": "Feature",
            "properties": {
                "time_hour": t + 1,
                "model": "SPH_Delft3D_Ensemble",
                "max_depth_m": round(15.0 / (t+1)**0.5, 2)
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [poly]
            }
        }
        frames.append(feature)
        
    feature_collection = {
        "type": "FeatureCollection",
        "features": frames
    }
    
    with open("flood-dashboard/public/simulationData.json", "w") as f:
        json.dump(feature_collection, f, indent=2)

    print("Generated mock simulation data!")

if __name__ == "__main__":
    main()
