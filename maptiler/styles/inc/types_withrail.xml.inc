<!ENTITY park_area "([natural] = 'wood' or [natural] = 'heath' or  [leisure] = 'park' or [landuse] = 'forest' or [leisure] = 'garden' or [leisure] = 'nature_reserve' or [leisure] = 'common' or [landuse] = 'recreation_ground' or [landuse] = 'village_green' or [landuse] = 'meadow')">
<!ENTITY water_area "([natural] = 'lake' or [natural] = 'water' or [natural] = 'pond' or [waterway] = 'dock' or [landuse] = 'reservoir' or [landuse] = 'water' or [landuse] = 'basin' or [waterway] = 'mill_pond' or [waterway] = 'riverbank' or [waterway] = 'river') and not ([natural] = 'land')">
<!ENTITY major_road "([highway] = 'motorway' or [highway]='motorway_link' or [highway] = 'trunk' or [highway]='trunk_link' or [highway] = 'primary' or [highway] = 'primary_link' or [highway] = 'secondary' or [highway] = 'secondary_link')">
<!ENTITY minor_road "([highway] = 'tertiary' or [highway] = 'residential' or [highway] = 'minor' or [highway] = 'unclassified' or [highway] = 'road' or [highway] = 'living_street' or [highway] = 'construction')">
<!ENTITY service_road "([highway] = 'service' or [highway] = 'byway')">
<!ENTITY track "([highway] = 'track' or [highway] = 'unsurfaced' or [highway] = 'bridleway' or [highway] = 'cycleway')">
<!ENTITY path "([highway] = 'path' or [highway] = 'footway' or [highway] = 'steps' or [highway] = 'pedestrian')">
<!ENTITY railway "([railway] = 'rail' or [railway] = 'narrow_gauge' or [railway] = 'light_rail' or [railway] = 'subway')">
<!ENTITY tram "([railway] = 'tram')">
<!ENTITY bridge "([bridge] = 'yes' or [bridge] = 'true' or [bridge] = '1')">
<!ENTITY tunnel "([tunnel] = 'yes' or [tunnel] = 'true' or [tunnel] = '1')">
