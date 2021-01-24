OpenOrienteeringMap
=====

This is a stripped-down version of [oomap](https://github.com/oobrien/oomap) for UK data, utilising LIDAR-derived contours.

Mapnik stylesheets for OOMap (as used at https://oomap.co.uk/global/ when zoomed in) and other raster tile layers (e.g. the "futurecity" stylesheet is used at https://bikesharemap.com/london/).

The stylesheets are based on the "old" (pre-2012) osm.xml stylesheet at http://svn.openstreetmap.org/applications/rendering/mapnik/osm.xml that used to be used for the "main" map rendering on http://osm.org/

Setup
===

Data
---

You need a copy of the OpenStreetMap data on a PostgreSQL/PostGIS database (I'm using PostgreSQL 9.3) - either the whole world or for a specific area, e.g. from http://download.geofabrik.de/europe/british-isles.html

Set up a database and tile server, eg. https://www.linuxbabe.com/ubuntu/openstreetmap-tile-server-ubuntu-18-04-osm

Put the data on a database using osm2pgsql: http://wiki.openstreetmap.org/wiki/Osm2pgsql

You also need the coastline data from OpenStreetMap which is distributed as a shapefile. Use the large split "Mercator" one from here: http://openstreetmapdata.com/data/land-polygons

Contours are a bit more involved. I use, for Great Britain, the set from Ordnance Survey Terrain 50: http://www.ordnancesurvey.co.uk/business-and-government/products/terrain-50.html

These can then be put into a PostgreSQL/PostGIS database using shp2pgsql with comes with PostGIS.

Additional data setup is described in [README_mysql.md](README_mysql.md)

Scripts
---

Once the data is ready, Mapnik (including its python bindings) needs to be installed. I'm using mapnik 3.0.19 and python-mapnik built against this version and with pycairo. These are the latest versions on Ubuntu bionic's package manager.  Some guidance for setting up Apache with mod_python is available at https://wiki.openstreetmap.org/wiki/Howto_real_time_tiles_rendering_with_mapnik_and_mod_python

The script at https://github.com/openstreetmap/mapnik-stylesheets/blob/master/generate_tiles.py to generate sets of tiles from the stylesheets.

Note the futurecity.xml stylesheet requires msttcorefonts - & you'll need to let mapnik know where these live, e.g. in the python script:

custom_fonts_dir = '/usr/share/fonts/truetype/msttcorefonts/'

mapnik.register_fonts(custom_fonts_dir)

Examples
===

The example images, using the XYZ map tile convention, have x=16090, y=10213, z=15. See http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames for further details.

![futurecity](https://raw.github.com/oobrien/oomap/master/examples/futurecity_z15.png "futurecity") futurecity

![futurecity_unicode](https://raw.github.com/oobrien/oomap/master/examples/futurecity_unicode_z15.png "futurecity_unicode") futurecity_unicode

![streeto](https://raw.github.com/oobrien/oomap/master/examples/streeto_z15.png "streeto") streeto (streeto_global and streeto_ioa are similar but with no contours)

![streeto_norail](https://raw.github.com/oobrien/oomap/master/examples/streeto_norail_z15.png "streeto_norail") streeto_norail (streeto_norail_global and streeto_norail_ioa are similar but with no contours)

![oterrain](https://raw.github.com/oobrien/oomap/master/examples/oterrain_z15.png "oterrain") streeto (oterrain_global and oterrain_ioa are similar but with no contours)

![blueprint](https://raw.github.com/oobrien/oomap/master/examples/blueprint_z15.png "blueprint") blueprint (only on it's own edition which uses the Global edition database)

![urban_skeleton](https://raw.github.com/oobrien/oomap/master/examples/urban_skeleton_z15.png "urban_skeleton") urban_skeleton (not currently on OOMap)
