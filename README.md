OpenOrienteeringMap
=====

This is a fork of [oomap](https://github.com/oobrien/oomap) with the following main changes:

**Global:**  Mapping data is up-to-date, as required OpenStreetMap data is queried directly when producing the final map.

**Global:** No large large mapping databases are required as data is fetched as needed.  This significantly reduces the overhead in running & updating an oomap server.

**Global:**  The standard OpenStreetMap rendering is used at all scales for the web view; the custom rendering is only performed on PDF/JPG/KMZ download.

**Global:**  Contours are available (60N to 60S) based on NASA SRTM data - a long way from perfect but better than nothing!

**Global:**  Contours are also available worldwide (except Armenia and Azerbaijan) based on ESA COPERNICUS GLO-30 data - should be fresher and a bit better quality than SRTM.

**Global:**  Magnetic North lines are present.

**UK:** Higher resolution contours (2.5m, 5m or 10m spacing) are available for most of England & Wales, derived from LIDAR data.

**Other changes:**

Unicode text is handled correctly.
Minor rendering changes, including cropping objects to map window (generating smaller PDFs with fewer artefacts), showing building outlines in coloured areas.
Postboxes are now retrieved from OpenStreetMap.

SRTM contour generation requires the helper program phyghtmap from http://katze.tfiu.de/projects/phyghtmap/, along with its dependencies.

Magnetic declination requires geomag from https://github.com/todd-dembrey/geomag

Mapnik stylesheets for OOMap (as used at https://oomap.co.uk/global/ when zoomed in) and other raster tile layers (e.g. the "futurecity" stylesheet is used at https://bikesharemap.com/london/).

The stylesheets are based on the "old" (pre-2012) osm.xml stylesheet at http://svn.openstreetmap.org/applications/rendering/mapnik/osm.xml that used to be used for the "main" map rendering on http://osm.org/

Setup
===

Data
---

You need a PostgreSQL/PostGIS database (I'm using PostgreSQL 10) - with coastline and (for the UK) contour data.  See [README_postgres.md](README_postgre.md) for more details.

Set up a database and tile server, eg. https://www.linuxbabe.com/ubuntu/openstreetmap-tile-server-ubuntu-18-04-osm

Setup of an additional MySQL database for postcode searching and for saved maps is described in [README_mysql.md](README_mysql.md)

Scripts
---

Once the data is ready, Mapnik (including its python bindings) needs to be installed. I'm using mapnik 3.0.24 and python-mapnik built against this version and with pycairo.  Some guidance for setting up Apache with mod_python is available at https://wiki.openstreetmap.org/wiki/Howto_real_time_tiles_rendering_with_mapnik_and_mod_python

Note the futurecity.xml stylesheet requires msttcorefonts  (```sudo apt-get install ttf-mscorefonts-installer```)- & you'll need to let mapnik know where these live, e.g. in the python script:

custom_fonts_dir = '/usr/share/fonts/truetype/msttcorefonts/'

mapnik.register_fonts(custom_fonts_dir)

Website build
---

The website has to be built from the source files in www/oomap.co.uk/ using npm (from node.js install):

1.  Open a command prompt in this directory
2.  run "npm install" to retrieve required dependencies
3.  run "npm run build" to package up site into the "dist" subdirectory.

Examples
===

The example images, using the XYZ map tile convention, have x=16090, y=10213, z=15. See http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames for further details.

![futurecity](https://raw.github.com/oobrien/oomap/master/examples/futurecity_z15.png "futurecity") futurecity

![futurecity_unicode](https://raw.github.com/oobrien/oomap/master/examples/futurecity_unicode_z15.png "futurecity_unicode") futurecity_unicode

![streeto](https://raw.github.com/oobrien/oomap/master/examples/streeto_z15.png "streeto") streeto

![streeto_norail](https://raw.github.com/oobrien/oomap/master/examples/streeto_norail_z15.png "streeto_norail") streeto_norail

![oterrain](https://raw.github.com/oobrien/oomap/master/examples/oterrain_z15.png "oterrain") oterrain

![blueprint](https://raw.github.com/oobrien/oomap/master/examples/blueprint_z15.png "blueprint") blueprint

![urban_skeleton](https://raw.github.com/oobrien/oomap/master/examples/urban_skeleton_z15.png "urban_skeleton") urban_skeleton (not currently on OOMap)
