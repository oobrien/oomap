import os, os.path, platform, mapnik
import math
import time
from pyproj import Transformer
from oomf import *

MAP_NM = 0.014
MAP_EM = 0.008
MAP_SM = 0.013
MAP_WM = 0.008

def processRequest(environ):
    path = environ['QUERY_STRING']
    p = parse_query(path)
    if isStr(p):
        return (p, 'new')
    mapid = p.get('mapid', 'new')
    return createKMZ(path), mapid

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
            info.external_attr = 0o100775 << 16
            info.date_time = time.localtime()
            kmz.writestr(info, out)
            for image in self._images:
                kmz.write(image, os.path.join('files', os.path.split(image)[1]))
                for image in self._foundimages:
                    kmz.write(image, os.path.join('files', os.path.split(image)[1]))
                    kmz.close()

    jpgf = createImage(path, 'jpg')

    p = parse_query(path)
    mapid = p.get('mapid', 'new')

    global MAP_NM, MAP_EM, MAP_SM, MAP_WM

    PAPER_W = float(p['paper'].split(",")[0])
    PAPER_H = float(p['paper'].split(",")[1])
    scale = int(p['scale'])
    clat = int(p['centre'].split(",")[0])
    clon = int(p['centre'].split(",")[1])
    try:
        rotation = float(p['rotation'])
    except:
        rotation = 0

    transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857")
    wgs84lat = transformer.transform(clon, clat, direction = 'INVERSE')[0]
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

    TopLeftLat = clat + (MAP_H/2+MAP_NM)*scaleCorrected*math.cos(rotation) - (MAP_W/2+MAP_WM)*scaleCorrected*math.sin(rotation)
    TopLeftLon = clon - (MAP_W/2+MAP_WM)*scaleCorrected*math.cos(rotation) - (MAP_H/2+MAP_NM)*scaleCorrected*math.sin(rotation)

    north, west = transformer.transform(XMin, YMax, direction = 'INVERSE')
    south, east = transformer.transform(XMax, YMin, direction = 'INVERSE')

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
    ground.latlonbox.rotation = rotation * 180/math.pi

    kmzfile = tempfile.NamedTemporaryFile()
    kml.savekmz(kmzfile.name)

    return kmzfile

def test(path):
    outf = createKMZ(path)
    if isStr(outf):
        print (outf)
    else:
        fd = open('oom_test.kmz', 'wb')
        fd.write(outf.read())
        fd.close()

if __name__ == '__main__':
    test("style=streeto-OS-10|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=607f20b74ad8f|start=6801344,-86261|crosses=|cps=|controls=|rotation=0.2|dpi=200")
