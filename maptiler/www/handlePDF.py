# -*- coding: utf-8 -*-

import os, os.path, platform, mapnik
import math
import time
from oomf import *  #reused functions from oomf.py in same directory

try:
    from PyPDF2 import PdfFileReader, PdfFileWriter
    from PyPDF2.generic import (ArrayObject, DecodedStreamObject, DictionaryObject, FloatObject, NameObject,
        NumberObject, TextStringObject, ByteStringObject, createStringObject)
    HAS_PYPDF2 = True
except ImportError:
    HAS_PYPDF2 = False
from geomag import WorldMagneticModel


def processRequest(req):
    path = req.args
    p = parse_query(path)
    mapid = p.get('mapid', 'new')
    outf = createImage(path, 'pdf')
    return req_write(outf, req, mapid, 'pdf')

def createImage(path, fileformat):
    import tempfile
    import cairo
    #import urllib
    try:    #DPD - get unquote regardless of Python version
        from urllib.parse import unquote   #Python3
    except ImportError:
         from urlparse import unquote  #Python2

    import overpass #For real-time data query
    import time
    import psycopg2

    p = parse_query(path)

    EPSG900913 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over"
    C_SCALE_FACTOR = 1.4
    SCALE_FACTOR = p['dpi']/72.0
    S2P = SCALE_FACTOR*360/0.127

    # Feature widths/diameters and stroke thicknesses, in m. From the ISOM/ISSOM specs.
    SC_W = 0.007*C_SCALE_FACTOR
    SC_T = 0.00035*C_SCALE_FACTOR
    C_R = 0.003*C_SCALE_FACTOR
    CDOT_R = 0.00035*C_SCALE_FACTOR
    C_T = 0.00035*C_SCALE_FACTOR
    CL_H = 0.005*C_SCALE_FACTOR
    CTEXT_S = 0.005*C_SCALE_FACTOR

    CONTENT_NM = 0.0045
    MAP_NM = 0.014
    MAP_EM = 0.008
    MAP_SM = 0.013
    MAP_WM = 0.008

    ADORN_TITLE_SM = 0.002
    ADORN_SCALE_SM = 0.005
    ADORN_SCALEBAR_SM = 0.002
    ADORN_SCALEBAR_LARGETICK = 0.002
    ADORN_SCALEBAR_SMALLTICK = 0.001
    ADORN_SCALEBAR_PADDING = 0.002
    ADORN_ATTRIB_NM = 0.0035
    ADORN_URL_NM = 0.001

    ADORN_LOGO_SCALE = 0.175*SCALE_FACTOR #0.038
    ADORN_LOGO_SCALE_IOA = 0.175*SCALE_FACTOR #= 0.25
    ADORN_ARROW_W = 0.012
    ADORN_LOGO_W = 0.018

    style = p['style']
    if style != "crew" and style != 'blueprint' and style != "urban_skeleton" and style != "streeto" and style != "oterrain" and style != "streeto_norail" and style != "adhoc":
        return "Unknown style."

    PAPER_W = float(p['paper'].split(",")[0])
    PAPER_H = float(p['paper'].split(",")[1])
    scale = int(p['scale'])
    clat = int(p['centre'].split(",")[0])
    clon = int(p['centre'].split(",")[1])
    try:
        rotation = float(p['rotation'])
    except:
        rotation = 0
    try:
        title = p['title']
    except:
        title = "OpenOrienteeringMap"

    mapid = p.get('mapid', 'new')

    slon = 0
    slat = 0
    if 'start' in p:
        slat = int(p['start'].split(",")[0])
        slon = int(p['start'].split(",")[1])

    controlsArr = []
    if 'controls' in p:
        controlsArr = p['controls'].split(",")

    crossesArr = []
    if 'crosses' in p:
        crossesArr  = p['crosses'].split(",")

    cpsArr = []
    if 'cps' in p:
        cpsArr = p['cps'].split(",")

    projection = mapnik.Projection(EPSG900913)
    wgs84lat = mapnik.Coord(clon, clat).inverse(projection).y
    wgs84lon = mapnik.Coord(clon, clat).inverse(projection).x
    scaleCorrectionFactor = math.cos(wgs84lat * math.pi/180)
    scaleCorrected = scale / scaleCorrectionFactor

    wmm = WorldMagneticModel()
    magdec = wmm.calc_mag_field(wgs84lat, wgs84lon).declination #look up magnetic declination for correct map North lines

    if style == "adhoc":
        MAP_EM = MAP_WM
        MAP_NM = MAP_WM
        MAP_SM = MAP_WM

    MAP_W = PAPER_W - MAP_WM - MAP_EM
    MAP_H = PAPER_H - MAP_NM - MAP_SM
    EXTENT_W = MAP_W * math.cos(rotation) + MAP_H * abs(math.sin(rotation))
    EXTENT_H = MAP_H * math.cos(rotation) + MAP_W * abs(math.sin(rotation))

    mapSLat = clat - (EXTENT_H/2)*scaleCorrected
    mapNLat = clat + (EXTENT_H/2)*scaleCorrected
    mapWLon = clon - (EXTENT_W/2)*scaleCorrected
    mapELon = clon + (EXTENT_W/2)*scaleCorrected

    pagePolyUnrotated = ((clon - (MAP_W/2 + MAP_WM) * scaleCorrected,
                            clat - (MAP_H/2 + MAP_SM) * scaleCorrected),
                            (clon - (MAP_W/2 + MAP_WM) * scaleCorrected,
                            clat + (MAP_H/2 + MAP_NM) * scaleCorrected),
                            (clon + (MAP_W/2 + MAP_EM) * scaleCorrected,
                            clat + (MAP_H/2 + MAP_NM) * scaleCorrected),
                            (clon + (MAP_W/2 + MAP_EM) * scaleCorrected,
                            clat - (MAP_H/2 + MAP_SM) * scaleCorrected))
    pagePoly = (rotate((clon, clat),pagePolyUnrotated[0],rotation),
                rotate((clon, clat),pagePolyUnrotated[1],rotation),
                rotate((clon, clat),pagePolyUnrotated[2],rotation),
                rotate((clon, clat),pagePolyUnrotated[3],rotation))

    styleFile = home + "/styles/" + style + ".xml"
    with open(styleFile, mode="r") as f:
               styleString = f.read()

    bbox2=mapnik.Box2d(mapWLon, mapSLat, mapELon, mapNLat).inverse(projection)

    if len(mapid) == 13:    #If existing id, use that, otherwise generate new one.
        tmpid = "h" + mapid #Add "h" prefix - postgres tables can't start with a number
    else:
        tmpid = "h" + hex(int(time.time()))[2:10] + hex(int(time.time()*1000000) % 0x100000)[2:7]
    styleFile = home + "/styles/" + tmpid + ".xml"

    # Get contour attribution from custom Postgres DB table
    # based on centre location and type (e.g. "LIDAR") of contour selected.
    conn = psycopg2.connect(database="gis", user = "osm", host = "127.0.0.1", port = "5432")
    cur = conn.cursor()
    cur.execute("""
        select attrib, tablename from attrib WHERE
            ST_Within(ST_SetSRID(ST_Point(%s, %s),900913),way)
            and type = %s;
        """,
        (clon, clat, p['contour']))
    # If at least 1 hit choose the first one, otherwise no contours available.
    if cur.rowcount > 0:
        db_result = cur.fetchone()
        contour_text = "Contours: " + db_result[0]
        contour_table = db_result[1]
    else:
        contour_text = ""
        contour_table = "lidar_null"

    # If stylefile exists, data has been recently fetched - can use existing DB tables.
    # Recreate stylefile regardless - might need a new style on existing data.

    if not os.path.isfile(styleFile):
        api = overpass.API()
        MapQuery = overpass.MapQuery(bbox2.miny,bbox2.minx,bbox2.maxy,bbox2.maxx)
        response = api.get(MapQuery, responseformat="xml")

        tmpname = "/tmp/" + tmpid + ".osm"
        with open(tmpname,mode="wb") as f:
               f.write(response.encode("utf-8"))
        # Populate Postgres db with data, using tables with temporary id prefix

        os.system("osm2pgsql -d otf1 --hstore --multi-geometry --number-processes 1" + \
            " -p " + tmpid + \
            " --tag-transform-script /home/osm/openstreetmap-carto/openstreetmap-carto.lua" + \
            " --style /home/osm/openstreetmap-carto/openstreetmap-carto.style -C 200 -U osm "+ tmpname)
        os.unlink(tmpname)  #Finished with temporary osm data file - delete.

        if p['contour'] == "SRTM" or p['contour'] == "COPE":
            #Now get contours using phyghtmap:
            #Use Phyghtmap just to get DEM data - process separately
            if p['contour'] == "SRTM":
                sourceText = " --source=srtm1 --srtm-version=3 "
            else:
                sourceText = " --source=cope1"
            phyString="phyghtmap --area="+str(bbox2.minx-0.0002)+":"+str(bbox2.miny-0.0002)+":"+ \
                str(bbox2.maxx+0.0002)+":"+str(bbox2.maxy+0.0002)+ sourceText + \
                " --earthexplorer-user=" + ee_user + " --earthexplorer-password=" + ee_pw + \
                " --hgtdir=" + home_base + "/hgt -p " + home_base + "/"+tmpid + " >> " + home_base + "/phy.log"
            os.system(phyString)
            #Merge file(s) into single virtual dataset (prevents contour boundaries at degree grid lines)
            os.system("gdalbuildvrt "+ home_base + "/"+tmpid + "_a.vrt " +  home_base + "/"+tmpid + "_lon*")
            #Resample at 10m intervals to get smoother contours.  Reproject at the same time
            os.system("gdalwarp -r cubic -tr 10 10 -s_srs EPSG:4326 -t_srs EPSG:3857 -te_srs EPSG:4326 -te " + \
                str(bbox2.minx-0.0001)+" "+str(bbox2.miny-0.0001)+" "+ \
                str(bbox2.maxx+0.0001)+" "+str(bbox2.maxy+0.0001)+ \
                " -of SAGA -ot Float32 " + home_base + "/"+tmpid + "_a.vrt " + home_base + "/"+tmpid + ".sdat")
            #Apply Guassian blur to further smooth contours
            os.system("saga_cmd grid_filter \"Gaussian Filter\" -SIGMA 2.0 -RADIUS 12 -INPUT " + home_base + "/"+tmpid + ".sdat -RESULT " + home_base + "/"+tmpid + "_s")
            #Generate contours
            os.system("gdal_contour -b 1 -a height -i " + p['interval'] + " " +  home_base + "/"+tmpid + "_s.sdat "  +  home_base + "/"+tmpid + ".shp")
            # If contour generation failed, use a dummy dataset so that the DB table
            # gets created and the SQL query returns without errors.
            try:
                os.stat(home_base + "/"+tmpid + ".shp")
            except:
                os.system("cp " + home_base + "/null.shp " + home_base + "/"+tmpid + ".shp")
                os.system("cp " + home_base + "/null.shx " + home_base + "/"+tmpid + ".shx")
                os.system("cp " + home_base + "/null.dbf " + home_base + "/"+tmpid + ".dbf")
            #then load contours to database
            os.system("shp2pgsql -g way -s 3857 " + home_base + "/"+tmpid + ".shp " + tmpid + "_srtm_line | psql -h localhost -p 5432 -U osm -d otf1")
            contour_table = tmpid + "_srtm_line"
            import glob
            for i in glob.glob(home_base +'/'+tmpid+'*'):
                os.unlink(i)  #Finished with temporary files - delete.
    else:   # If SRTM or COPE contours, still need to point to correct contour table for reused data so:
        if p['contour'] == "SRTM" or p['contour'] == "COPE":
            contour_table = tmpid + "_srtm_line"

    # Need a custom Mapnik style file to find tables with temo id prefix.
    # Therefore inject "prefix" entity into appropriate base style definition and save using temp id as name.
    if p.get('drives',"no") != "no":    #Render driveways as near-transparent if not selected.  Allows recovery later if needed.
        driveway_colour = "#010101FF"
    else:
        driveway_colour = "#01010101"
    if p.get('rail',"yes") != "no":    #Switch railways/tramways on/off
        rail = "yes"
    else:
        rail = "no"
    if p.get('walls',"yes") != "no":    # Switch walls (and unspecified "barriers") on/off.
        walls = "yes"
    else:
        walls = "no"
    if p.get('trees',"yes") != "no":    # Switch walls (and unspecified "barriers") on/off.
        trees = "yes"
    else:
        trees = "no"
    if p.get('hedges',"yes") != "no":    # Switch walls (and unspecified "barriers") on/off.
        hedges = "yes"
    else:
        hedges = "no"
    import re
    insertstring="%settings;\n<!ENTITY prefix \"" + tmpid + "\">" + \
        "\n<!ENTITY driveway \"" + driveway_colour + "\">" + \
        "\n<!ENTITY rail \"" + rail + "\">" + \
        "\n<!ENTITY walls \"" + walls + "\">" + \
        "\n<!ENTITY trees \"" + trees + "\">" + \
        "\n<!ENTITY hedges \"" + hedges + "\">" + \
        "\n<!ENTITY lidartable \"" + contour_table + "\">" + \
        "\n<!ENTITY contourSeparation \"" + p['interval'] + "\">" + \
        "\n<!ENTITY layers-contours SYSTEM \"inc/layers_contours_" + p['contour'] + ".xml.inc\">"
    searchstring="\%settings;"
    styleString = re.sub(searchstring,insertstring,styleString)

    with open(styleFile, mode="w") as f:
            f.write(styleString)

    cbbox = mapnik.Box2d(mapWLon,mapSLat,mapELon,mapNLat)
    # Limit the size of map we are prepared to produce to roughly A2 size.
    if PAPER_W * PAPER_H > 0.25 and style != "adhoc":
        return "Map too large. Try increasing the scale value or using a smaller paper size."

    if scale > 50000 and style != "adhoc":
        return "Scale too small. Try using a lower scale value."

    # Calculate scale, for scale bar and grid lines
    scaleBarMetres = 500
    if scale < 10000:
        scaleBarMetres = 200
    scaleBarW = scaleBarMetres/float(scale)


    # Create map
    map = mapnik.Map(int(EXTENT_W*S2P), int(EXTENT_H*S2P))

    # Load map configuration
    mapnik.load_map(map, styleFile)

    # Zoom the map to the Gbounding box
    map.zoom_to_box(cbbox)

    file = tempfile.NamedTemporaryFile()

    surface = None
    if fileformat == 'jpg':
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, int(PAPER_W*S2P), int(PAPER_H*S2P))
    else:
        surface = cairo.PDFSurface(file.name, PAPER_W*S2P / SCALE_FACTOR, PAPER_H*S2P / SCALE_FACTOR)
        surface.set_device_scale(1.0/SCALE_FACTOR,1.0/SCALE_FACTOR)
        # versions = surface.get_versions()
        # version = versions[1]
        # surface.restrict_to_version(version)

    # Adornments - Title swoosh back
    ctx = cairo.Context(surface)
    ctx.translate(0, 0)
    ctx.set_line_width(1*SCALE_FACTOR)
    ctx.move_to(0, 0)
    ctx.rel_line_to(0, 0.25*PAPER_H*S2P)
    ctx.rel_line_to(0.2*PAPER_W*S2P, 0)
    ctx.rel_line_to(0.4*PAPER_W*S2P, -0.25*PAPER_H*S2P)
    ctx.close_path()
    ctx.set_source_rgb(0.91, 0.15, 0.28)
    if style == "oterrain_ioa" or style == "streeto_ioa" or style == "streeto_norail_ioa":
        ctx.set_source_rgb(0.12, 0.53, 0.27)
    if style == "oterrain_dk" or style == "streeto_dk" or style == "streeto_norail_dk":
        ctx.set_source_rgb(0.78, 0.05, 0.18)
    if style != 'blueprint':
        ctx.fill()

    #Adornments - Attrib swoosh back
    ctx = cairo.Context(surface)
    ctx.translate(0, 0)
    ctx.set_line_width(1*SCALE_FACTOR)
    ctx.move_to(PAPER_W*S2P, PAPER_H*S2P)
    ctx.rel_line_to(0, -0.25*PAPER_H*S2P)
    ctx.rel_line_to(-0.2*PAPER_W*S2P, 0)
    ctx.rel_line_to(-0.4*PAPER_W*S2P, 0.25*PAPER_H*S2P)
    ctx.close_path()
    ctx.set_source_rgb(0.12, 0.5, 0.65)
    if style == "oterrain_ioa" or style == "streeto_ioa" or style == "streeto_norail_ioa":
        ctx.set_source_rgb(0.89, 0.44, 0.24)
    if style == "oterrain_dk" or style == "streeto_dk" or style == "streeto_norail_dk":
        ctx.set_source_rgb(0.78, 0.05, 0.18)
    if style != "blueprint":
        ctx.fill()

    # Background map
    ctx = cairo.Context(surface)
    ctx.set_operator(cairo.Operator.OVER)
    ctx.translate(MAP_WM*S2P, MAP_NM*S2P)
    ctx.rectangle(0, 0, MAP_W * S2P,  MAP_H * S2P)
    ctx.clip() #Clip to map area
    ctx.save()
    ctx.translate(MAP_W*S2P/2,MAP_H*S2P/2) # translate origin to the center
    ctx.rotate(rotation)
    ctx.translate(-EXTENT_W*S2P/2,-EXTENT_H*S2P/2)
    mapnik.render(map, ctx, SCALE_FACTOR, 0, 0)
    ctx.restore()

    if style == "adhoc":
        ctx = cairo.Context(surface)
        ctx.set_source_rgb(1, 1, 1)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(0.5*SCALE_FACTOR)
        text = path
        ctx.translate(MAP_WM*S2P, (MAP_NM+MAP_H+0.001)*S2P)
        ctx.show_text(text)
        if fileformat == 'jpg':
            surface.write_to_png(file.name)
        else:
            surface.finish()
        return file

    #  Add grid lines in same layer - allows darken comp-op
    if style != "blueprint" and p.get('grid',"yes") != "no":
        ctx.set_source_rgb(0.5, 0.5, 1)
        ctx.set_operator(cairo.Operator.MULTIPLY)
        ctx.set_line_width(0.5*SCALE_FACTOR)
        northSpacing = scaleBarW / math.cos(magdec*math.pi/180+rotation)
        shift = MAP_H * S2P * math.tan(magdec*math.pi/180+rotation) * 0.5
        lines = range(int(-northSpacing * S2P/2), int((MAP_W + northSpacing) * S2P), int(northSpacing * S2P))
        for line in lines:
            ctx.move_to (line + shift, 0)
            ctx.line_to (line - shift, MAP_H * S2P)
        ctx.stroke()

    # Start control
    if slon != 0 and slat != 0:
        ctx = cairo.Context(surface)
        ctx.set_operator(cairo.Operator.MULTIPLY)
        ctx.set_source_rgb(0.651, 0.149, 1)
        ctx.translate(MAP_WM*S2P + MAP_W*S2P/2,MAP_NM*S2P + MAP_H*S2P/2) # translate origin to the center
        ctx.rotate(rotation)    # rotate map to correct angle
        ctx.translate(-EXTENT_W*S2P/2,-EXTENT_H*S2P/2)  # set origin to NW corner
        ctx.set_line_width(SC_T*S2P)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        #ctx.translate((MAP_WM+((slon-mapWLon)/scaleCorrected))*S2P, (MAP_NM+((mapNLat-slat)/scaleCorrected))*S2P)
        ctx.translate((slon-mapWLon)*EXTENT_W*S2P/(mapELon-mapWLon), (mapNLat-slat)*EXTENT_H*S2P/(mapNLat-mapSLat))
        ctx.rotate(-rotation)
        ctx.move_to(0, -0.577*SC_W*S2P)
        ctx.rel_line_to(-0.5*SC_W*S2P, 0.866*SC_W*S2P)
        ctx.rel_line_to(SC_W*S2P, 0)
        ctx.close_path()
        ctx.stroke()
    #Finish control (same place as start)
        ctx.set_line_width(C_T*S2P)
        ctx.arc(0, 0, C_R*S2P*1.2, 0, 2*math.pi)    #Outer circle
        ctx.stroke()
        ctx.arc(0, 0, C_R*S2P*0.8, 0, 2*math.pi)    #inner circle
        ctx.stroke()

    # Controls and labels
    if len(controlsArr) > 0:
        ctx = cairo.Context(surface)
        ctx.translate(MAP_WM*S2P + MAP_W*S2P/2,MAP_NM*S2P + MAP_H*S2P/2) # translate origin to the center
        ctx.rotate(rotation)
        ctx.translate(-EXTENT_W*S2P/2,-EXTENT_H*S2P/2)


        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(CTEXT_S*S2P)
        numControls = len(controlsArr)//4

        #Draw white halo around control numbers for legibility on complex maps
        ctx.set_operator(cairo.Operator.SOURCE)
        ctx.set_source_rgb(1, 0.997, 1)
        for i in range(numControls):
            text = controlsArr[4*i]
            labelAngle = float(controlsArr[4*i+1])
            controllat = float(controlsArr[4*i+2])
            controllon = float(controlsArr[4*i+3])
            controllatP = (mapNLat-controllat)*EXTENT_H/(mapNLat-mapSLat)
            controllonP = (controllon-mapWLon)*EXTENT_W/(mapELon-mapWLon)
            x_bearing, y_bearing, width, height = ctx.text_extents(text)[:4]
            labelX = C_R*2.5*math.sin(math.pi*labelAngle/180)
            labelY = C_R*2.5*math.cos(math.pi*labelAngle/180)
            ctx.save()
            ctx.translate(controllonP*S2P, controllatP*S2P)
            ctx.rotate(-rotation)
            ctx.move_to(labelX*S2P-width/2, -labelY*S2P+height/2)
            ctx.text_path(text)
            ctx.set_line_width(C_T*S2P)
            ctx.stroke_preserve()
            ctx.fill()
            ctx.restore()

        ctx.set_source_rgb(0.651, 0.149, 1)
        ctx.set_operator(cairo.Operator.MULTIPLY)
        for i in range(numControls):
            text = controlsArr[4*i]
            labelAngle = float(controlsArr[4*i+1])
            controllat = float(controlsArr[4*i+2])
            controllon = float(controlsArr[4*i+3])
            #controllatP = MAP_NM+((mapNLat-controllat)/scaleCorrected)
            #controllonP = MAP_WM+((controllon-mapWLon)/scaleCorrected)
            #ctx.move_to((controllonP+C_R)*S2P, controllatP*S2P)
            controllatP = (mapNLat-controllat)*EXTENT_H/(mapNLat-mapSLat)
            controllonP = (controllon-mapWLon)*EXTENT_W/(mapELon-mapWLon)
            ctx.move_to((controllonP+C_R)*S2P, controllatP*S2P)
            ctx.set_line_width(C_T*S2P)
            ctx.arc(controllonP*S2P, controllatP*S2P, C_R*S2P, 0, 2*math.pi)
            ctx.stroke()
            ctx.move_to((controllonP+CDOT_R)*S2P, controllatP*S2P)
            ctx.arc(controllonP*S2P, controllatP*S2P, CDOT_R*S2P, 0, 2*math.pi)
            ctx.fill()
            x_bearing, y_bearing, width, height = ctx.text_extents(text)[:4]
            labelX = C_R*2.5*math.sin(math.pi*labelAngle/180)
            labelY = C_R*2.5*math.cos(math.pi*labelAngle/180)
            ctx.save()
            ctx.translate(controllonP*S2P, controllatP*S2P)
            ctx.rotate(-rotation)
            #ctx.move_to((controllonP+labelX)*S2P-width/2, (controllatP-labelY)*S2P+height/2)
            ctx.move_to(labelX*S2P-width/2, -labelY*S2P+height/2)
            ctx.show_text(text)
            ctx.restore()

    # Crosses and labels
    if len(crossesArr) > 0:
        #ctx = cairo.Context(surface)
        ctx.set_source_rgb(0.651, 0.149, 1)
        ctx.set_operator(cairo.Operator.MULTIPLY)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(CTEXT_S*S2P/1.5)
        #ctx.set_source_rgb(1, 0, 0)
        numCrosses = len(crossesArr)/2
        for i in range(numCrosses):
            text = "X"
            controllat = float(crossesArr[2*i])
            controllon = float(crossesArr[2*i+1])
            controllatP = (mapNLat-controllat)*EXTENT_H/(mapNLat-mapSLat)
            controllonP = (controllon-mapWLon)*EXTENT_W/(mapELon-mapWLon)
            #ctx.move_to((controllonP)*S2P, controllatP*S2P)
            x_bearing, y_bearing, width, height = ctx.text_extents(text)[:4]
            #labelX = C_R*2.5*math.sin(math.pi*labelAngle/180)
            #labelY = C_R*2.5*math.cos(math.pi*labelAngle/180)
            ctx.move_to((controllonP)*S2P-width/2, (controllatP)*S2P+height/2)
            ctx.show_text(text)

    #Crossing points and labels
    if len(cpsArr) > 0:
        #ctx = cairo.Context(surface)
        ctx.set_source_rgb(0.651, 0.149, 1)
        ctx.set_operator(cairo.Operator.DARKEN)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(CTEXT_S*S2P/1.1)
        #ctx.set_source_rgb(1, 0, 0)
        numCps = len(cpsArr)//3
        for i in range(numCps):
            text = "]["
            controlAngle = float(cpsArr[3*i])
            controllat = float(cpsArr[3*i+1])
            controllon = float(cpsArr[3*i+2])
            controlAngleRads = math.pi*controlAngle/180
            controllatP = (mapNLat-controllat)*EXTENT_H/(mapNLat-mapSLat)
            controllonP = (controllon-mapWLon)*EXTENT_W/(mapELon-mapWLon)
            x_bearing, y_bearing, width, height, x_advance, y_advance = ctx.text_extents(text)[:6]
            #0.34375 -12.890625 9.38465881348 16.46875 10.019317627 0.0
            ctx.move_to((controllonP)*S2P, (controllatP)*S2P)
            ctx.rotate(controlAngleRads)
            ctx.rel_move_to(-width/2, height/3.5)
            ctx.show_text(text)
            ctx.rotate(-1.0*controlAngleRads)
            #ctx.save()

    # Adornments - Title
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    if style == 'blueprint':
        ctx.select_font_face("Impact", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    text = unquote(title)

    if len(text) > 26:
        ctx.set_font_size(15*SCALE_FACTOR)
    elif len(text) > 18:
        ctx.set_font_size(18*SCALE_FACTOR)
    else:
        ctx.set_font_size(21*SCALE_FACTOR)
    ctx.translate((MAP_WM+0.014)*S2P, (MAP_NM-ADORN_TITLE_SM)*S2P) #add space to left for logo

    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)
    else:
        ctx.set_source_rgb(1, 1, 1)
    ctx.show_text(text.upper())

    # Adornments - Scale Text
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    text = "scale 1:" + str(scale)

    if style == "oterrain" or style == "streeto" or style == "streeto_norail":
        text = "scale 1:" + str(scale) + ", contours " + p['interval'] + "m"
    ctx.set_source_rgb(0, 0, 0)
    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)

    ctx.set_font_size(11*SCALE_FACTOR)
    width = ctx.text_extents(text)[4]
    ctx.translate((MAP_WM+MAP_W)*S2P-width-(ADORN_ARROW_W+ADORN_LOGO_W)*S2P, (MAP_NM-ADORN_SCALE_SM)*S2P)
    ctx.show_text(text)

    # Adornments - Scale Bar and Caption
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    text = str(scaleBarMetres) + "m"
    ctx.set_source_rgb(0, 0, 0)
    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)
    ctx.set_font_size(7*SCALE_FACTOR)
    width = ctx.text_extents(text)[4]
    barCaptionX = (MAP_WM+MAP_W-(ADORN_ARROW_W+ADORN_LOGO_W))*S2P-width
    ctx.translate(barCaptionX, (MAP_NM-ADORN_SCALEBAR_SM)*S2P)
    ctx.show_text(text)
    ctx.set_line_width(0.5*SCALE_FACTOR)

    ctx.move_to((-scaleBarW-ADORN_SCALEBAR_PADDING)*S2P, 0)
    ctx.rel_line_to(0, -ADORN_SCALEBAR_LARGETICK*S2P)
    ctx.rel_line_to(0, ADORN_SCALEBAR_LARGETICK*S2P)
    ctx.rel_line_to(scaleBarW*S2P/2, 0)
    ctx.rel_line_to(0, -ADORN_SCALEBAR_SMALLTICK*S2P)
    ctx.rel_line_to(0, ADORN_SCALEBAR_SMALLTICK*S2P)
    ctx.rel_line_to(scaleBarW*S2P/2, 0)
    ctx.rel_line_to(0, -ADORN_SCALEBAR_LARGETICK*S2P)
    ctx.stroke()

    # Adornments - North Arrow
    ctx = cairo.Context(surface)
    ctx.translate((MAP_WM+MAP_W-ADORN_LOGO_W)*S2P-width, (CONTENT_NM + 0.004)*S2P)  #set to centre of symbol...
    ctx.rotate(magdec*math.pi/180+rotation)   #so that rotation doesn't add translation.  Point to mag. N
    ctx.set_line_width(1*SCALE_FACTOR)
    ctx.set_source_rgb(0, 0, 0)
    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)
    ctx.move_to(0, -0.004*S2P)
    ctx.line_to(0.001*S2P, -0.002*S2P)
    ctx.line_to(-0.001*S2P, -0.002*S2P)
    ctx.close_path()
    ctx.fill()
    ctx.move_to(0, -0.003*S2P)
    ctx.line_to(0, 0.004*S2P)
    ctx.stroke()
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.move_to(-0.001*S2P, 0.001*S2P)
    ctx.rel_line_to(0, -0.002*S2P)
    ctx.rel_line_to(0.002*S2P, 0.002*S2P)
    ctx.rel_line_to(0, -0.002*S2P)
    ctx.stroke()

    # Adornments - Logo
    if style == "oterrain_ioa" or style == "streeto_ioa" or style == "streeto_norail_ioa":
        logoSurface = cairo.ImageSurface.create_from_png(home + "/images/ioalogo.png")
        ctx = cairo.Context(surface)
        width = logoSurface.get_width()*ADORN_LOGO_SCALE_IOA
        ctx.translate((MAP_WM+MAP_W)*S2P-width, CONTENT_NM*S2P)
        ctx.scale(ADORN_LOGO_SCALE_IOA, ADORN_LOGO_SCALE_IOA)
        ctx.set_source_surface(logoSurface, 0, 0)
        ctx.paint()
    elif style == "oterrain" or style == "streeto" or style == "streeto_norail":
        logoSurface = cairo.ImageSurface.create_from_png(home + "/images/oflogo.png")
        ctx = cairo.Context(surface)
        width = logoSurface.get_width()*ADORN_LOGO_SCALE
        ctx.translate((MAP_WM+MAP_W)*S2P-width, CONTENT_NM*S2P)
        ctx.scale(ADORN_LOGO_SCALE, ADORN_LOGO_SCALE)
        ctx.set_source_surface(logoSurface, 0, 0)
        ctx.paint()
    elif style == "blueprint":
        logoSurface = cairo.ImageSurface.create_from_png(home + "/images/oflogo.png")
        ctx = cairo.Context(surface)
        width = logoSurface.get_width()*ADORN_LOGO_SCALE
        ctx.translate((MAP_WM+MAP_W)*S2P-width, CONTENT_NM*S2P)
        ctx.scale(ADORN_LOGO_SCALE, ADORN_LOGO_SCALE)
        ctx.set_source_surface(logoSurface, 0, 0)
        ctx.paint()
    else:
        logoSurface = cairo.ImageSurface.create_from_png(home + "/images/oflogo.png")
        ctx = cairo.Context(surface)
        width = logoSurface.get_width()*ADORN_LOGO_SCALE
        ctx.translate((MAP_WM+MAP_W)*S2P-width, CONTENT_NM*S2P)
        ctx.scale(ADORN_LOGO_SCALE, ADORN_LOGO_SCALE)
        ctx.set_source_surface(logoSurface, 0, 0)
        ctx.paint()

    # Adornments - Attribution left line 1
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_source_rgb(0.12, 0.5, 0.65)
    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)

    ctx.set_font_size(7*SCALE_FACTOR)
    text = "Map data: © OpenStreetMap contributors; Open Database Licence."
    ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM)*S2P)
    ctx.show_text(text)

    # Adornments - Attribution left line 2 - contours
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_source_rgb(0.12, 0.5, 0.65)
    ctx.set_font_size(7*SCALE_FACTOR)


    ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+0.002)*S2P)
    ctx.show_text(contour_text)
    cur.close()
    conn.close()

    #Adornments - Attribution left line 3
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_source_rgb(0.12, 0.5, 0.65)
    if style == "blueprint":
        ctx.set_source_rgb(0, 0.5, 0.8)

    ctx.set_font_size(7*SCALE_FACTOR)
    text = "OOM created by Oliver O'Brien. Make your own: http://oomap.co.uk/"
    ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+0.004)*S2P)
    ctx.show_text(text)

    #Adornments - Attribution right line 1
    if style == "oterrain" or style == "streeto" or style == "streeto_norail" or style == "blueprint":
        ctx = cairo.Context(surface)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_BOLD)
        ctx.set_source_rgb(1, 1, 1)
        if style == "blueprint":
            ctx.set_source_rgb(0, 0.5, 0.8)
        ctx.set_font_size(9*SCALE_FACTOR)
        text = "OOM v3 developed with a grant from the Orienteering Foundation"
        width = ctx.text_extents(text)[4]
        ctx.translate((MAP_WM+MAP_W)*S2P-width, (MAP_NM+MAP_H+ADORN_ATTRIB_NM)*S2P)
        ctx.show_text(text)

    #Attribution right line 2
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_source_rgb(1, 1, 1)
    if style == "blueprint":
        ctx.set_source_rgb(0, 0.5, 0.8)
    ctx.set_font_size(9*SCALE_FACTOR)
    text = "Map ID: " + mapid
    width = ctx.text_extents(text)[4]
    ctx.translate((MAP_WM+MAP_W)*S2P-width, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+ADORN_ATTRIB_NM)*S2P)
    ctx.show_text(text)

    # Adornments - URL
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    ctx.set_font_size(0.5*SCALE_FACTOR)
    text = web_root + fileformat + '/?' + path
    ctx.translate(MAP_WM*S2P, (MAP_NM+MAP_H+ADORN_URL_NM)*S2P)
    ctx.show_text(text)

    if fileformat == 'jpg':
        from PIL import Image, ImageCms
        surface.write_to_png(file.name + '.png')
        im = Image.open(file.name + '.png')
        bg = Image.new("RGB", im.size, (255,255,255))
        profile = ImageCms.createProfile("sRGB")
        profile2 = ImageCms.ImageCmsProfile(profile)

        bg.paste(im,im)
        bg.save(file.name, 'JPEG', quality=95, icc_profile=profile2.tobytes())
    else:
        surface.finish()
        surface.flush()

        # Add Geospatial PDF metadata
        map_bounds = (MAP_WM/PAPER_W, (PAPER_H-MAP_SM)/PAPER_H, MAP_WM/PAPER_W, MAP_NM/PAPER_H, (PAPER_W-MAP_EM)/PAPER_W, MAP_NM/PAPER_H, (PAPER_W-MAP_EM)/PAPER_W, (PAPER_H-MAP_SM)/PAPER_H)
        file2 = tempfile.NamedTemporaryFile()
        file = add_geospatial_pdf_header(map, file, file2, map_bounds, pagePoly, epsg = 3857)

    #Delete temporary style file and postgres tables (everything beginning with "h"):
    #BUT - don't delete here as may be needed for related query.  Periodically clean out with cron job instead
    #os.unlink(styleFile)
    #dropTables = 'psql -U osm otf1 -t -c "select \'drop table \\"\' || tablename || \'\\" cascade;\' from pg_tables where schemaname = \'public\' and tablename like \'h%\'"  | psql -U osm otf1'
    #os.system(dropTables)
    return file

def add_geospatial_pdf_header(m, f, f2, map_bounds, poly, epsg=None, wkt=None):
        """
        Adds geospatial PDF information to the PDF file as per:
            Adobe® Supplement to the ISO 32000 PDF specification
            BaseVersion: 1.7
            ExtensionLevel: 3
            (June 2008)
        Notes:
            The epsg code or the wkt text of the projection must be provided.
            Must be called *after* the page has had .finish() called.
        """
        if not HAS_PYPDF2:
            raise RuntimeError("PyPDF2 not available; PyPDF2 required to add geospatial header to PDF")

        if not any((epsg,wkt)):
            raise RuntimeError("EPSG or WKT required to add geospatial header to PDF")

        file_reader = PdfFileReader(f)
        file_writer = PdfFileWriter()

        # preserve OCProperties at document root if we have one
        if NameObject('/OCProperties') in file_reader.trailer['/Root']: #Python3-friendly
            file_writer._root_object[NameObject('/OCProperties')] = file_reader.trailer[
                '/Root'].getObject()[NameObject('/OCProperties')]

        for page in file_reader.pages:
            gcs = DictionaryObject()
            gcs[NameObject('/Type')] = NameObject('/PROJCS')

            if epsg:
                gcs[NameObject('/EPSG')] = NumberObject(int(epsg))
            if wkt:
                gcs[NameObject('/WKT')] = TextStringObject(wkt)

            measure = get_pdf_measure(m, gcs, poly, map_bounds)

            """
            Returns the PDF's VP array.
            The VP entry is an array of viewport dictionaries. A viewport is basiscally
            a rectangular region on the PDF page. The only required entry is the BBox which
            specifies the location of the viewport on the page.
            """
            viewport = DictionaryObject()
            viewport[NameObject('/Type')] = NameObject('/Viewport')

            bbox = ArrayObject()
            for x in (0,int(page.mediaBox[3]),int(page.mediaBox[2]),0): #in pts
                bbox.append(FloatObject(str(x)))  #Fixed

            viewport[NameObject('/BBox')] = bbox
            #viewport[NameObject('/Name')] = TextStringObject('OOMAP')
            viewport[NameObject('/Measure')] = measure

            vp_array = ArrayObject()
            vp_array.append(viewport)
            page[NameObject('/VP')] = vp_array
            file_writer.addPage(page)

        file_writer.write(f2)
        return (f2)


def get_pdf_measure(m, gcs, poly, bounds_default):
    """
    Returns the PDF Measure dictionary.
    The Measure dictionary is used in the viewport array
    and specifies the scale and units that apply to the output map.
    """
    measure = DictionaryObject()
    measure[NameObject('/Type')] = NameObject('/Measure')
    measure[NameObject('/Subtype')] = NameObject('/GEO')

    bounds = ArrayObject()

    """
    Returns the PDF BOUNDS array.
    The PDF's bounds array is equivalent to the map's neatline, i.e.,
    the border delineating the extent of geographic data on the output map.
    """
    for x in [ 0, 1, 0, 0, 1, 0, 1, 1 ]:
        bounds.append(FloatObject(str(x)))

    measure[NameObject('/Bounds')] = bounds
    measure[NameObject('/GPTS')] = get_pdf_gpts(m, poly)
    measure[NameObject('/LPTS')] = bounds
    measure[NameObject('/GCS')] = gcs
    return measure

def get_pdf_gpts(m, poly):
    """
    Returns the GPTS array object containing the four corners of the
    map rect in map projection.
    The GPTS entry is an array of numbers, taken pairwise, defining
    points as latitude and longitude.
    m = mapnik map object
    poly = tuple of (x,y) tuples describing rect polygon - allows geocoding of rotated maps.
    """
    gpts = ArrayObject()

    proj = mapnik.Projection(m.srs)
    for x,y in poly:
        latlon_corner = proj.inverse(mapnik.Coord(x,y))
        # these are in lat,lon order according to the specification
        gpts.append(FloatObject(str(latlon_corner.y)))
        gpts.append(FloatObject(str(latlon_corner.x)))

    return gpts

def rotate(origin, point, angle):
    """
    Rotate a point counterclockwise by a given angle around a given origin.
    The angle should be given in radians.
    """
    ox, oy = origin
    px, py = point

    qx = ox + math.cos(angle) * (px - ox) - math.sin(angle) * (py - oy)
    qy = oy + math.sin(angle) * (px - ox) + math.cos(angle) * (py - oy)
    return qx, qy

def test(path):
    outf = createImage(path, 'pdf')
    if isStr(outf):
        print (outf)
    else:
        fd = open('test.pdf', 'wb')
        outf.seek(0)    #DPD
        fd.write(outf.read())
        fd.close()


if __name__ == '__main__':
    test("style=streeto-COPE-5|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=ÅFurzton%20%28Milton%20Keynes%29|club=|id=6043c1a44cc95|start=6801344,-86261|crosses=|cps=45,6801960,-86749,90,6802960,-88000|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631|rotation=0.2")
    #test("style=oterrain-COPE-5|grid=no&paper=0.297,0.210|scale=10000|centre=6801767,-86381|id=6043c1a44cc93&rotation=0.2")
