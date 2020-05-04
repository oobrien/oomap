import os, os.path, platform, mapnik
import math
import time

home = "/home/ollie/production/maptiler"
EPSG900913 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over"
C_SCALE_FACTOR = 1.4
SCALE_FACTOR = 2
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

def isStr(x):
	try:
		return str(x) == x
	except Exception:
		return False

def processRequest(req):
	from mod_python import apache, util
	path = req.args

	with open(home + "/logs/oommakerlog-access.txt", "a") as fa:
		fa.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + path + "\n")
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
		with open(home + "/logs/oommakerlog-error.txt", "a") as fe:
			fe.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + outf + " : " + path + "\n")		
		return req
	else:			
		outfsize = os.fstat(outf.fileno()).st_size
		req.status = apache.HTTP_OK
		req.content_type = 'application/pdf'
		req.headers_out["Content-Disposition"] = "attachment; filename=\"oom_" + mapid + ".pdf\""
		req.set_content_length(outfsize)
		req.write(outf.read())		
		return req

	# req.status = apache.HTTP_NOT_FOUND
	# req.content_type = 'text/plain'
	# req.write("Working on it... ")
	# return req

def createImage(path, fileformat):
	import tempfile
	import cairo
	import urllib

	# Specifically declare these as global, as we may change them.
	global MAP_NM, MAP_EM, MAP_SM, MAP_WM

	if path.count("|") < 9 or path.count("|") > 10 or  len(path) < 30:
		return "Incorrectly formatted string."
	if path.count("|") == 9:
		path = path + "|"		
	style, paper, scale, centre, title, club, mapid, start, crosses, cps, controls  = path.split("|")
	style = style.split("=")[1]

	if style != "crew" and style != 'blueprint' and style != "urban_skeleton" and style != "streeto" and style != "oterrain" and style != "streeto_norail" and style != "adhoc" and style != "streeto_ioa" and style != "oterrain_ioa" and style != "streeto_norail_ioa" and style != "streeto_dk" and style != "oterrain_dk" and style != "streeto_norail_dk" and style != 'streeto_global' and style != 'streeto_norail_global' and style != 'oterrain_global':
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
	cbbox = mapnik.Box2d(mapWLon,mapSLat,mapELon,mapNLat)

    	# Limit the size of map we are prepared to produce
    	if PAPER_W * PAPER_H > 0.25 and style != "adhoc":
		# Roughly A2 size.
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
		ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL,
		     cairo.FONT_WEIGHT_NORMAL)
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
	text = urllib.unquote(title)
	if len(text) > 28:
		ctx.set_font_size(15*SCALE_FACTOR)						
	elif len(text) > 20:
		ctx.set_font_size(18*SCALE_FACTOR)				
	else:
 		ctx.set_font_size(21*SCALE_FACTOR)
	ctx.translate(MAP_WM*S2P, (MAP_NM-ADORN_TITLE_SM)*S2P)
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
		text = "scale 1:" + str(scale) + ", contours 10m"
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
	ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC,
	     cairo.FONT_WEIGHT_NORMAL)
 	ctx.set_source_rgb(0.12, 0.5, 0.65)
	if style == 'blueprint':
		ctx.set_source_rgb(0, 0.5, 0.8)
	ctx.set_font_size(7*SCALE_FACTOR)
	text = "Map data (c) OpenStreetMap, available under the Open Database Licence." 
	ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM)*S2P)			
	ctx.show_text(text)

	if style == "oterrain" or style == "streeto" or style == "streeto_norail":
 		# Adornments - Attribution left line 2
		ctx = cairo.Context(surface)
		ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC, cairo.FONT_WEIGHT_NORMAL)
		ctx.set_source_rgb(0.12, 0.5, 0.65)
		ctx.set_font_size(7*SCALE_FACTOR)
		text = "Contains OS data (c) Crown copyright & database right OS 2013-2017."
		ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+0.002)*S2P)
		ctx.show_text(text)

	#Adornments - Attribution left line 3
	ctx = cairo.Context(surface)
	ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC,
	     cairo.FONT_WEIGHT_NORMAL)
	ctx.set_source_rgb(0.12, 0.5, 0.65)
	if style == "blueprint":
		ctx.set_source_rgb(0, 0.5, 0.8)
	ctx.set_font_size(7*SCALE_FACTOR)
	text = "OOM created by Oliver O'Brien. Make your own: http://oomap.co.uk/"
	ctx.translate((MAP_WM)*S2P, (MAP_NM+MAP_H+ADORN_ATTRIB_NM+0.004)*S2P)
	ctx.show_text(text)

	if style == "oterrain" or style == "streeto" or style == "streeto_norail" or style == "blueprint": 
		#Adornments - Attribution right line 1 
		ctx = cairo.Context(surface)
		ctx.select_font_face("Arial", cairo.FONT_SLANT_ITALIC,
		     cairo.FONT_WEIGHT_BOLD)
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
	ctx.select_font_face("Arial", cairo.FONT_SLANT_NORMAL,
	     cairo.FONT_WEIGHT_NORMAL)
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
	# test("style=streeto|paper=a4l|scale=10000|centre=6801767,-86381|title=Furzon%20%28Milton%20Keynes%29|start=|controls=")
	#	style, paper, scale, centre, title, club, mapid, start, crosses, controls  = path.split("|")

	test("style=streeto|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=|start=6801344,-86261|crosses=|cps=45,6801960,-86749,90,6802960,-88000|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631")
	# test("style=oterrain|paper=a4l|scale=10000|centre=6701416,-36931|title=Teddington 18/02/2010 E|start=6701091,-36673|controls=1,45,6701683,-35890,2,45,6700670,-37313,3,45,6700861,-35498")
	# test("style=streeto|paper=a4l|scale=10000|centre=6701568,-34323|title=Teddington%20%28Test%29|start=6701568,-34323|controls=1,315,6701244,-35230,22,225,6701998,-33148")
	# test("style=streeto|paper=a4p|scale=12500|centre=6701387,-38364|title=Many%20Controls|start=6700298,-38106|controls=1,45,6701823,-38811,2,45,6701598,-40125,3,45,6702621,-39886,4,45,6702998,-39136,5,45,6703285,-39466,6,45,6703192,-38716,7,45,6702645,-39456,8,45,6702914,-39898,9,45,6703225,-40244,10,45,6702136,-39833,11,45,6702379,-38632,12,45,6702590,-38696,13,45,6701837,-39174,14,45,6701006,-38599,15,45,6700722,-38682,16,45,6700710,-38460,17,45,6700397,-38536,18,45,6700801,-39396,19,45,6700445,-39683,20,45,6701840,-37053,21,45,6702052,-37098,22,45,6702707,-37378,23,45,6703024,-37502,24,45,6703208,-37440,25,45,6702219,-38204,26,45,6702124,-38159,27,45,6701701,-39463,28,45,6701792,-39595,31,45,6701422,-39896,32,45,6701500,-40008,33,45,6701918,-39955,34,45,6701959,-40318,35,45,6700435,-40266,36,45,6699336,-39864,37,45,6699692,-39955,38,45,6699632,-40328,39,45,6699193,-39055,40,45,6699568,-38931,41,45,6699656,-38441,42,45,6699716,-38336,43,45,6700031,-38436,44,45,6699996,-38281,45,45,6700760,-37966,46,45,6700903,-37829,47,45,6700927,-38338,48,45,6700285,-38696,49,45,6700308,-38938,50,45,6700299,-39377,51,45,6700005,-39681,52,45,6700215,-39423,53,45,6700213,-39341,54,45,6700304,-39272,55,45,6700375,-39179,56,45,6699085,-39138,57,45,6698980,-39351,58,45,6699355,-39695,59,45,6700148,-37803,60,45,6700182,-37440,61,45,6700041,-37973,62,45,6700007,-37650,63,45,6699988,-37590,64,45,6700000,-37536,65,45,6699900,-38737")
