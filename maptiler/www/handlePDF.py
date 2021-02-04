# -*- coding: utf-8 -*-

import os, os.path, platform, mapnik
import math
import time

home = "/home/osm/maptiler"

def isStr(x):
    try:
        return str(x) == x
    except Exception:
        return False

def processRequest(req):
    from mod_python import apache, util
    from urllib import unquote
    path = req.args

#    with open(home + "/logs/oommakerlog-access.txt", "a") as fa:
#        fa.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + path + "\n")
    outf = createImage(path, 'pdf')
    if path.count("|") < 9 or path.count("|") > 10  or  len(path) < 30:
        return "Incorrectly formatted string."
    if path.count("|") == 9:
        path = path + "|"
    style, paper, scale, centre, title, club, mapid, start, crosses, cps, controls  = path.split("|")
    mapid = mapid.split("=")[1]

    if isStr(outf):
        req.status = apache.HTTP_SERVICE_UNAVAILABLE
        req.content_type = 'text/html'
        outHTML = "<html><head><title>OpenOrienteeringMap: Error</title></head><body><h1>Error</h1><p>" + outf + "</p></body></html>"
        req.write(outHTML)
#        with open(home + "/logs/oommakerlog-error.txt", "a") as fe:
#            fe.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + outf + " : " + path + "\n")
        return req
    else:
        outfsize = os.fstat(outf.fileno()).st_size
        req.status = apache.HTTP_OK
        req.content_type = 'application/pdf'
        req.headers_out["Content-Disposition"] = "attachment; filename=\"oom_" + mapid + ".pdf\""
        req.set_content_length(outfsize)
        req.write(outf.read())
        return req

def createImage(path, fileformat, scalefactor=1):
    import tempfile
    import cairo
    import urllib

    import overpass #For real-time data query
    import time

    EPSG900913 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over"
    C_SCALE_FACTOR = 1.4
    SCALE_FACTOR = scalefactor
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

    if path.count("|") < 9 or path.count("|") > 10 or  len(path) < 30:
        return "Incorrectly formatted string."
    if path.count("|") == 9:
        path = path + "|"
    style, paper, scale, centre, title, club, mapid, start, crosses, cps, controls  = path.split("|")
    style = style.split("=")[1]

    if style != "crew" and style != 'blueprint' and style != "urban_skeleton" and style != "streeto" and style != "oterrain" and style != "streeto_norail" and style != "adhoc" and style != "streeto_ioa" and style != "oterrain_ioa" and style != "streeto_norail_ioa" and style != "streeto_au" and style != "oterrain_au" and style != "streeto_norail_au" and style != "streeto_dk" and style != "oterrain_dk" and style != "streeto_norail_dk" and style != 'streeto_global' and style != 'streeto_norail_global' and style != 'oterrain_global':
        return "Unknown style."

    paper = paper.split("=")[1]
    PAPER_W = float(paper.split(",")[0])
    PAPER_H = float(paper.split(",")[1])

    scale = int(scale.split("=")[1])

    centre = centre.split("=")[1]
    clat = int(centre.split(",")[0])
    clon = int(centre.split(",")[1])

    title = title.split("=")[1]

    slon = 0
    slat = 0
    start = start.split("=")[1]
    if len(start) > 0:
        slat = int(start.split(",")[0])
        slon = int(start.split(",")[1])

    controlsArr = []
    controls = controls.split("=")[1]
    if len(controls) > 0:
        controlsArr = controls.split(",")

    crossesArr = []
    crosses = crosses.split("=")[1]
    if len(crosses) > 0:
        crossesArr  = crosses.split(",")

    cpsArr = []
    cps = cps.split("=")[1]
    if len(cps) > 0:
        cpsArr = cps.split(",")

    if mapid != "":
        mapid = mapid.split("=")[1]

    projection = mapnik.Projection(EPSG900913)
    wgs84lat = mapnik.Coord(clon, clat).inverse(projection).y
    scaleCorrectionFactor = math.cos(wgs84lat * math.pi/180)
    scaleCorrected = scale / scaleCorrectionFactor

    if style == "adhoc":
        MAP_EM = MAP_WM
        MAP_NM = MAP_WM
        MAP_SM = MAP_WM

    MAP_W = PAPER_W - MAP_WM - MAP_EM
    MAP_H = PAPER_H - MAP_NM - MAP_SM

    mapSLat = clat - (MAP_H/2)*scaleCorrected
    mapNLat = clat + (MAP_H/2)*scaleCorrected
    mapWLon = clon - (MAP_W/2)*scaleCorrected
    mapELon = clon + (MAP_W/2)*scaleCorrected

    styleFile = home + "/styles/" + style + ".xml"

    bbox2=mapnik.Box2d(mapWLon, mapSLat, mapELon, mapNLat).inverse(projection)
    api = overpass.API()
    MapQuery = overpass.MapQuery(bbox2.miny,bbox2.minx,bbox2.maxy,bbox2.maxx)
    response = api.get(MapQuery, responseformat="xml")
    tmpid = "h" + hex(int(time.time()))[2:10] + hex(int(time.time()*1000000) % 0x100000)[2:7]
    tmpname = "/tmp/" + tmpid + ".osm"
    with open(tmpname,mode="w") as f:
           f.write(response.encode("utf-8"))
    # Populate Postgres db with data, using tables with temporary id prefix
    # (with "h" at the start - postgres tables can't start with a number)
    os.system("osm2pgsql -d otf1 --hstore --multi-geometry --number-processes 1" + \
        " -p " + tmpid + \
        " --tag-transform-script /home/osm/openstreetmap-carto/openstreetmap-carto.lua" + \
        " --style /home/osm/openstreetmap-carto/openstreetmap-carto.style -C 100 -U osm "+ tmpname)
    os.unlink(tmpname)  #Finished with temporary osm data file - delete.

    # Need a custom Mapnik style file to find tables with temo id prefix.
    # Therefore inject "prefix" entity into appropriate base style definition and save using temp id as name.
    import re
    insertstring="%settings;\n<!ENTITY prefix \"" + tmpid + "\">"
    searchstring="\%settings;"
    with open(styleFile, mode="r") as f:
               styleString = f.read()
    styleString = re.sub(searchstring,insertstring,styleString)

    styleFile = home + "/styles/" + tmpid + ".xml"

    with open(styleFile, mode="w") as f:
               f.write(styleString)

    cbbox = mapnik.Box2d(mapWLon,mapSLat,mapELon,mapNLat)
    # Limit the size of map we are prepared to produce to roughly A2 size.
    if PAPER_W * PAPER_H > 0.25 and style != "adhoc":
        return "Map too large. Try increasing the scale value or using a smaller paper size."

    if scale > 50000 and style != "adhoc":
        return "Scale too small. Try using a lower scale value."

    # Create map
    map = mapnik.Map(int(MAP_W*S2P), int(MAP_H*S2P))

    # Load map configuration
    mapnik.load_map(map, styleFile)

    # Zoom the map to the Gbounding box
    map.zoom_to_box(cbbox)

    file = tempfile.NamedTemporaryFile()

    surface = None
    if fileformat == 'jpg':
        surface = cairo.ImageSurface(cairo.FORMAT_ARGB32, int(PAPER_W*S2P), int(PAPER_H*S2P))
    else:
        surface = cairo.PDFSurface(file.name, PAPER_W*S2P, PAPER_H*S2P)
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
    ctx.translate(MAP_WM*S2P, MAP_NM*S2P)
    mapnik.render(map, ctx, SCALE_FACTOR, 0, 0)

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

    # Start control
    if slon != 0 and slat != 0:
        ctx = cairo.Context(surface)
        ctx.set_line_width(SC_T*S2P)
        ctx.set_line_join(cairo.LINE_JOIN_ROUND)
        ctx.set_source_rgb(1, 0, 1)
        ctx.translate((MAP_WM+((slon-mapWLon)/scaleCorrected))*S2P, (MAP_NM+((mapNLat-slat)/scaleCorrected))*S2P)
        ctx.move_to(0, -0.577*SC_W*S2P)
        ctx.rel_line_to(-0.5*SC_W*S2P, 0.866*SC_W*S2P)
        ctx.rel_line_to(SC_W*S2P, 0)
        ctx.close_path()
        ctx.stroke()

    # Controls and labels
    if len(controlsArr) > 0:
        ctx = cairo.Context(surface)
        ctx.set_source_rgb(1, 0, 1)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(CTEXT_S*S2P)
        numControls = len(controlsArr)/4
        for i in range(numControls):
            text = controlsArr[4*i]
            labelAngle = float(controlsArr[4*i+1])
            controllat = float(controlsArr[4*i+2])
            controllon = float(controlsArr[4*i+3])
            controllatP = MAP_NM+((mapNLat-controllat)/scaleCorrected)
            controllonP = MAP_WM+((controllon-mapWLon)/scaleCorrected)
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
            ctx.move_to((controllonP+labelX)*S2P-width/2, (controllatP-labelY)*S2P+height/2)
            ctx.show_text(text)

    # Crosses and labels
    if len(crossesArr) > 0:
        ctx = cairo.Context(surface)
        ctx.set_source_rgb(1, 0, 1)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_BOLD)
        ctx.set_font_size(CTEXT_S*S2P/1.5)
        ctx.set_source_rgb(1, 0, 0)
        numCrosses = len(crossesArr)/2
        for i in range(numCrosses):
            text = "X"
            controllat = float(crossesArr[2*i])
            controllon = float(crossesArr[2*i+1])
            controllatP = MAP_NM+((mapNLat-controllat)/scaleCorrected)
            controllonP = MAP_WM+((controllon-mapWLon)/scaleCorrected)
            #ctx.move_to((controllonP)*S2P, controllatP*S2P)
            x_bearing, y_bearing, width, height = ctx.text_extents(text)[:4]
            #labelX = C_R*2.5*math.sin(math.pi*labelAngle/180)
            #labelY = C_R*2.5*math.cos(math.pi*labelAngle/180)
            ctx.move_to((controllonP)*S2P-width/2, (controllatP)*S2P+height/2)
            ctx.show_text(text)

    #Crossing points and labels
    if len(cpsArr) > 0:
        ctx = cairo.Context(surface)
        ctx.set_source_rgb(1, 0, 1)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_font_size(CTEXT_S*S2P/1.1)
        ctx.set_source_rgb(1, 0, 0)
        numCps = len(cpsArr)/3
        for i in range(numCps):
            text = "]["
            controlAngle = float(cpsArr[3*i])
            controllat = float(cpsArr[3*i+1])
            controllon = float(cpsArr[3*i+2])
            controlAngleRads = math.pi*controlAngle/180
            controllatP = MAP_NM+((mapNLat-controllat)/scaleCorrected)
            controllonP = MAP_WM+((controllon-mapWLon)/scaleCorrected)
            x_bearing, y_bearing, width, height, x_advance, y_advance = ctx.text_extents(text)[:6]
            #0.34375 -12.890625 9.38465881348 16.46875 10.019317627 0.0
            ctx.move_to((controllonP)*S2P, (controllatP)*S2P)
            ctx.rotate(controlAngleRads)
            ctx.rel_move_to(-width/2, height/3.5)
            ctx.show_text(text)
            ctx.rotate(-1.0*controlAngleRads)
            ctx.save()

    # Adornments - Title
    ctx = cairo.Context(surface)
    ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
    if style == 'blueprint':
        ctx.select_font_face("Impact", cairo.FONT_SLANT_NORMAL, cairo.FONT_WEIGHT_NORMAL)
    text = urllib.unquote(title).decode('utf8')

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
        text = "scale 1:" + str(scale) + ", contours 5m"
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
    scaleBarMetres = 500
    if scale < 10000:
        scaleBarMetres = 200
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

    scaleBarW = scaleBarMetres/float(scale)
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
    ctx.translate((MAP_WM+MAP_W-ADORN_LOGO_W)*S2P-width, CONTENT_NM*S2P)
    ctx.set_line_width(1*SCALE_FACTOR)
    ctx.set_source_rgb(0, 0, 0)
    if style == 'blueprint':
        ctx.set_source_rgb(0, 0.5, 0.8)
    ctx.move_to(0, 0)
    ctx.line_to(0.001*S2P, 0.002*S2P)
    ctx.line_to(-0.001*S2P, 0.002*S2P)
    ctx.close_path()
    ctx.fill()
    ctx.move_to(0, 0.001*S2P)
    ctx.line_to(0, 0.008*S2P)
    ctx.stroke()
    ctx.set_line_join(cairo.LINE_JOIN_ROUND)
    ctx.set_line_cap(cairo.LINE_CAP_ROUND)
    ctx.move_to(-0.001*S2P, 0.005*S2P)
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
    text = "Map data (c) OpenStreetMap, available under the Open Database Licence."
    ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM)*S2P)
    ctx.show_text(text)

    # Adornments - Attribution left line 2
    if style == "oterrain" or style == "streeto" or style == "streeto_norail":
        ctx = cairo.Context(surface)
        ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
        ctx.set_source_rgb(0.12, 0.5, 0.65)
        ctx.set_font_size(7*SCALE_FACTOR)
        text = "Contours from LIDAR  © Environment Agency copyright and/or database right 2015. All rights reserved."
        ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+0.002)*S2P)
        ctx.show_text(text)

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
    text = path
    ctx.translate(MAP_WM*S2P, (MAP_NM+MAP_H+ADORN_URL_NM)*S2P)
    ctx.show_text(text)

    if fileformat == 'jpg':
        from PIL import Image
        surface.write_to_png(file.name + '.png')
        im = Image.open(file.name + '.png')
        bg = Image.new("RGB", im.size, (255,255,255))
        bg.paste(im,im)
        bg.save(file.name, 'JPEG', quality=95)
    else:
        surface.finish()

    #Delete temporary style file and postgres tables (everything beginning with "h"):
    os.unlink(styleFile)
    dropTables = 'psql -U osm otf1 -t -c "select \'drop table \\"\' || tablename || \'\\" cascade;\' from pg_tables where schemaname = \'public\' and tablename like \'h%\'"  | psql -U osm otf1'
    os.system(dropTables)
    return file

def test(path):
    outf = createImage(path, 'pdf')
    if isStr(outf):
        print outf
    else:
        fd = open('test.pdf', 'wb')
        fd.write(outf.read())
        fd.close()

if __name__ == '__main__':
    test("style=streeto|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=|start=6801344,-86261|crosses=|cps=45,6801960,-86749,90,6802960,-88000|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631")
