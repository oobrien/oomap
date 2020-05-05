import os, os.path, platform, mapnik
import math
import time

home = "/home/ollie/production/maptiler"
EPSG900913 = "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs +over"

MAP_NM = 0.014
MAP_EM = 0.008
MAP_SM = 0.013
MAP_WM = 0.008

def isStr(x):
	try:
		return str(x) == x
	except Exception:
		return False

def processRequest(req):
	from mod_python import apache, util
	path = req.args

	with open(home + "/logs/oommakerlog-kmz-access.txt", "a") as fa:
		fa.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + path + "\n")

        outf = createKMZ(path)

	if path.count("|") < 9 or path.count("|") > 10 or  len(path) < 30:
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
		with open(home + "/logs/oommakerlog-kmz-error.txt", "a") as fe:
			fe.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + outf + " : " + path + "\n")		
		return req
	else:			
		outfsize = os.fstat(outf.fileno()).st_size
		req.status = apache.HTTP_OK
		req.content_type = 'application/vnd.google-earth.kmz'
		req.headers_out["Content-Disposition"] = "attachment; filename=\"oom_" + mapid + ".kmz\""
		req.set_content_length(outfsize)
		req.write(outf.read())		
		return req

def createKMZ(path):
		import tempfile
        import zipfile
        from handlePDF import createImage
        from simplekml import Kml, Folder
        from simplekml.base import Kmlable

        class PermKml(Kml):
            def savekmz(self, path, format=True):
                Kmlable._currentroot = self
                self._outputkmz = True
                out = self._genkml(format).encode('utf-8')
                kmz = zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED)
                info = zipfile.ZipInfo("doc.kml")
                info.external_attr = 0100775 << 16
                info.date_time = time.localtime()
                kmz.writestr(info, out)
                for image in self._images:
                    kmz.write(image, os.path.join('files', os.path.split(image)[1]))
                for image in self._foundimages:
                    kmz.write(image, os.path.join('files', os.path.split(image)[1]))
                kmz.close()
        
        jpgf = createImage(path, 'jpg')
        
        global MAP_NM, MAP_EM, MAP_SM, MAP_WM

        if path.count("|") < 9 or path.count("|") > 10 or  len(path) < 30:
                return "Incorrectly formatted string."
        if path.count("|") == 9:
                path = path + "|"
        style, paper, scale, centre, title, club, mapid, start, crosses, cps, controls  = path.split("|")

        paper = paper.split("=")[1]
        PAPER_W = float(paper.split(",")[0])
        PAPER_H = float(paper.split(",")[1])

        scale = int(scale.split("=")[1])

        centre = centre.split("=")[1]
        clat = int(centre.split(",")[0])
        clon = int(centre.split(",")[1])

        projection = mapnik.Projection(EPSG900913)
        wgs84lat = mapnik.Coord(clon, clat).inverse(projection).y
        scaleCorrectionFactor = math.cos(wgs84lat * math.pi/180)
        scaleCorrected = scale / scaleCorrectionFactor

        MAP_W = PAPER_W - MAP_WM - MAP_EM
        MAP_H = PAPER_H - MAP_NM - MAP_SM

        paperSLat = clat - (MAP_H/2+MAP_SM)*scaleCorrected
        paperNLat = clat + (MAP_H/2+MAP_NM)*scaleCorrected
        paperWLon = clon - (MAP_W/2+MAP_WM)*scaleCorrected
        paperELon = clon + (MAP_W/2+MAP_EM)*scaleCorrected

        XMin = clon - (paperELon - paperWLon)/2.0
        YMin = clat - (paperNLat - paperSLat)/2.0
        XMax = clon + (paperELon - paperWLon)/2.0
        YMax = clat + (paperNLat - paperSLat)/2.0

        north = mapnik.Coord(XMin, YMax).inverse(projection).y
        west = mapnik.Coord(XMin, YMax).inverse(projection).x
        south =  mapnik.Coord(XMax, YMin).inverse(projection).y
        east = mapnik.Coord(XMax, YMin).inverse(projection).x

        kml = PermKml()
        kml.document = Folder(name="")

        jpgfilename = '/tmp/tile_0_0.jpg'
        jpgfile = open(jpgfilename, 'wb')
        jpgfile.write(jpgf.read())
        jpgfile.flush()
        jpgfilepath = kml.addfile(jpgfilename)

        ground = kml.newgroundoverlay(name=os.path.split(jpgfilename)[1])
        ground.draworder = 75
        ground.icon.href = jpgfilepath
        ground.icon.viewboundscale = 0.75
        ground.latlonbox.north = north
        ground.latlonbox.south = south
        ground.latlonbox.east = east
        ground.latlonbox.west = west
        ground.latlonbox.rotation = 0
     
        kmzfile = tempfile.NamedTemporaryFile()
        kml.savekmz(kmzfile.name)

        return kmzfile

def test(path):
        outf = createKMZ(path)
        if isStr(outf):
                print outf
        else:
                fd = open('oom_test.kmz', 'wb')
                fd.write(outf.read())
                fd.close()


if __name__ == '__main__':
        # test("style=streeto|paper=a4l|scale=10000|centre=6801767,-86381|title=Furzon%20%28Milton%20Keynes%29|start=|controls=")
        #        style, paper, scale, centre, title, club, mapid, start, crosses, controls  = path.split("|")
        test("style=streeto|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=|start=6801344,-86261|crosses=|cps=|controls=")
        # test("style=oterrain|paper=a4l|scale=10000|centre=6701416,-36931|title=Teddington 18/02/2010 E|star