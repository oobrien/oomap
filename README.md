oomap
=====

Mapnik 2.3.0-dev stylesheets for OOMap (as used at http://oomap.co.uk/ when zoomed in) and other raster tile layers (e.g. as used at http://bikes.oobrien.com/london/).

You need a copy of the OpenStreetMap data on a PostgreSQL/PostGIS database - either the whole world or for a specific area, e.g. I get data from http://download.geofabrik.de/europe/british-isles.html

You also need the coastline data from OpenStreetMap which is distributed as a shapefile. I use the large split one here: http://openstreetmapdata.com/data/land-polygons

I use a version of https://github.com/openstreetmap/mapnik-stylesheets/blob/master/generate_tiles.py to generate sets of tiles from these stylesheets.

Note the futurecity.xml requires msttcorefonts - & you'll need to let it know where these live, e.g.:

custom_fonts_dir = '/usr/share/fonts/truetype/msttcorefonts/'

mapnik.register_fonts(custom_fonts_dir)

Examples
===

The example images come from http://tiler1.oobrien.com/[style_name]/[z]/16090/10213.png with z=15

e.g. http://tiler1.oobrien.com/streeto/15/16090/10213.png


![futurecity](https://raw.github.com/oobrien/oomap/master/examples/futurecity_z15.png "futurecity") futurecity

![futurecity_unicode](https://raw.github.com/oobrien/oomap/master/examples/futurecity_unicode_z15.png "futurecity_unicode") futurecity_unicode

![streeto](https://raw.github.com/oobrien/oomap/master/examples/streeto_z15.png "streeto") streeto (streeto_global and streeto_ioa are similar but with no contours)

![streeto_norail](https://raw.github.com/oobrien/oomap/master/examples/streeto_norail_z15.png "streeto_norail") streeto_norail (streeto_norail_global and streeto_norail_ioa are similar but with no contours)

![oterrain](https://raw.github.com/oobrien/oomap/master/examples/oterrain_z15.png "oterrain") streeto (oterrain_global and oterrain_ioa are similar but with no contours)

