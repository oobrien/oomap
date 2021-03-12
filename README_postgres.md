Postgres setup
==============

Create a whole-world polygon to represent land [named 'ocean' though to match existing queries] (psql commands):

```sql
create table ocean (id serial);
SELECT AddGeometryColumn ('ocean', 'way', 3857, 'POLYGON',2)
insert into ocean(way) VALUES (ST_Polygon('LINESTRING(-20026376.39 -20048966.10, -20026376.39 20048966.10, 20026376.39 20048966.10, 20026376.39 -20048966.10, -20026376.39 -20048966.10)'::geometry, 3857));
```
Import water polygons to overlay on top of above land definition:

```
wget https://osmdata.openstreetmap.de/download/water-polygons-split-3857.zip
unzip water-polygons-split-3857.zip
cd water-polygons-split-3857/
shp2pgsql -g way water_polygons public.water > water.sql
psql -d otf1 -U osm -f water.sql > /dev/null
```

OS Terrain® 50 download & processing
====================================

Download from:  
https://api.os.uk/downloads/v1/products/Terrain50/downloads?area=GB&format=ESRI%C2%AE+Shapefile&subformat=%28Contours%29&redirect

Then:

```
unzip terr50_cesh_gb.zip
mkdir terr50
find ./data -iname '*.zip' -exec mv '{}' ./terr50/ \;
cd terr50
unzip '*.zip'
rm *.zip
rm *point*
shp2pgsql -p -I -g way -s 27700:900913 NX16_line terr50_lns2 | psql -U osm -d gis
nano terr50.sh
```
	#!/bin/bash
	for f in *.shp
	do
	    shp2pgsql -a -g way -s 27700:900913 $f terr50_lns2 | psql -U osm -d gis
	done
```  
chmod 700 terr50.sh
./terr50.sh
```

LIDAR data processing
=====================

LIDAR data covering most of England & Wales is available and can be used to generate contour data.

Wales & England have been handled slightly differently due to differences in download availability.
Contour generation requires the SAGA GIS suite.

# Process Wales LIDAR 2M DTM data files from:
# http://lle.gov.wales/GridProducts#data=LidarCompositeDataset

process.sh
==========
```sh
for g in ./*.zip; do
	unzip $g
	for f in ./*.asc; do
		gdal_translate -outsize 25% 25% $f ${f%.asc}.tiff
	done
	rm *.asc
	mkdir ${g%.zip}
	mv *.tiff ${g%.zip}
done
```
...then create a single virtual file as a source for contour generation:

```
gdalbuildvrt -a_srs EPSG:27700 wales.vrt *.tiff
```

LIDAR_process.py
================

```python
import math
import subprocess
import os
import sys
from pathlib import Path

ts = 5000	#tile size in m
dele = 0		#delete tiles & recreate?
if len(sys.argv) == 5:
  extents = [int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])]
elif len(sys.argv) == 3:
  extents = [int(sys.argv[1]), int(sys.argv[2]), int(sys.argv[1]), int(sys.argv[2])]
  dele = 1
else:
  extents = [170000,160000,360000,396000]  #Box containing Wales (EPSG:27700 coords)

extents = [x/ts for x in extents]	#Find ts m x ts m tile breaks
buffer = 200	#Size of margin in m to give better tile:tile matching; crop off at end.
tileExtents = [math.floor(extents[0]), math.floor(extents[1]), math.floor(extents[2]), math.floor(extents[3])]
for i in range(tileExtents[0],tileExtents[2]+1):
  for j in range(tileExtents[1],tileExtents[3]+1):
    out = str(i) + "_" + str(j) + ".shp"
    outzero = str(i) + "_" + str(j) + ".000"
    if (os.path.isfile(out) or os.path.isfile(outzero)) and dele == 0:
      print ("skipping:" + out)
      continue
    thisExtent = [i * ts, j * ts, (i + 1) * ts, (j+1) * ts]
    thisBuffExtent = [i * ts - buffer, j * ts - buffer, (i + 1) * ts + buffer, (j+1) * ts + buffer]
    cmd = "gdal_translate -projwin " + str(thisBuffExtent[0]) + " " + str(thisBuffExtent[3]) + " " + str(thisBuffExtent[2]) + " " + str(thisBuffExtent[1]) + " -of SAGA -eco wales.vrt base.sdat"
    ret = subprocess.call(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    if ret!=0:
      print ("error:" + out)
      break
    cmd="saga_cmd grid_filter \"Gaussian Filter\" -RADIUS 4 -INPUT base.sdat -RESULT smooth"
    ret = subprocess.call(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    cmd = "gdal_contour -b 1 -a height -i 2.5 smooth.sdat contour.shp"
    ret = subprocess.call(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    cmd = "ogr2ogr -spat " + str(thisExtent[0]) + " " + str(thisExtent[1]) + " " + str(thisExtent[2]) + " " + str(thisExtent[3]) + " -clipsrc spat_extent -a_srs EPSG:27700 -skipfailures con.shp contour.shp"
    ret = subprocess.call(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    cmd = "saga_cmd shapes_lines \"Line Simplification\" -LINES con.shp -TOLERANCE 1.0 -OUTPUT " + out
    ret = subprocess.call(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
    if os.path.isfile(out):
      print(out)
    else:
      Path(outzero).touch()
```

to_db.sh
========
```sh
for f in ./*.shp; do
  shp2pgsql -a -g way -s 27700:900913 $f lidar2 | psql -h localhost -p 5432 -U postgres -d gis
done
```
