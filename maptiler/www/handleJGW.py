import os, os.path, platform, mapnik
import math
import time
from pyproj import Transformer
from oomf import *

def processRequest(environ):
    path = environ['QUERY_STRING']
    p = parse_query(path)
    if isStr(p):
        return (p, 'new')
    mapid = p.get('mapid', 'new')
    return createJGW(path), mapid

def createJGW(path):
    import tempfile
    p = parse_query(path)
    mapid = p.get('mapid', 'new')
    SCALE_FACTOR = p['dpi']/72.0
    S2P = 360.0 * SCALE_FACTOR/0.127

    MAP_NM = 0.014
    MAP_EM = 0.008
    MAP_SM = 0.013
    MAP_WM = 0.008

    paper = p['paper']
    PAPER_W = float(paper.split(",")[0])
    PAPER_H = float(paper.split(",")[1])

    scale = int(p['scale'])

    centre = p['centre']
    clat = int(centre.split(",")[0])
    clon = int(centre.split(",")[1])
    rotation=float(p.get('rotation','0'))

    transformer = Transformer.from_crs("EPSG:4326", "EPSG:3857")
    wgs84lat = transformer.transform(clon, clat, direction = 'INVERSE')[0]
    scaleCorrectionFactor = math.cos(wgs84lat * math.pi/180)
    scaleCorrected = scale / scaleCorrectionFactor

    if p['style'] == "adhoc":
        MAP_EM = MAP_WM
        MAP_NM = MAP_WM
        MAP_SM = MAP_WM

    MAP_W = PAPER_W - MAP_WM - MAP_EM
    MAP_H = PAPER_H - MAP_NM - MAP_SM

    paperSLat = clat - (MAP_H/2+MAP_SM)*scaleCorrected
    paperNLat = clat + (MAP_H/2+MAP_NM)*scaleCorrected
    paperWLon = clon - (MAP_W/2+MAP_WM)*scaleCorrected
    paperELon = clon + (MAP_W/2+MAP_EM)*scaleCorrected

    PIXEL_W = PAPER_W*S2P
    PIXEL_H = PAPER_H*S2P
    TopLeftLat = clat + (MAP_H/2+MAP_NM)*scaleCorrected*math.cos(rotation) - (MAP_W/2+MAP_WM)*scaleCorrected*math.sin(rotation)
    TopLeftLon = clon - (MAP_W/2+MAP_WM)*scaleCorrected*math.cos(rotation) - (MAP_H/2+MAP_NM)*scaleCorrected*math.sin(rotation)

    fworld = tempfile.NamedTemporaryFile()
    jgwString = str((paperELon - paperWLon)*math.cos(rotation)/PIXEL_W) + "\n" + \
    str((paperELon - paperWLon)*math.sin(rotation)/PIXEL_W) + "\n" + \
    str((paperNLat - paperSLat)*math.sin(rotation)/PIXEL_H) + "\n" + \
    str((paperSLat - paperNLat)*math.cos(rotation)/PIXEL_H) + "\n" + \
    str(TopLeftLon) + "\n" + \
    str(TopLeftLat) + "\n"
    fworld.write(jgwString.encode('utf-8'))
    fworld.seek(0)
    return fworld

def test(path):
    outf = createJGW(path)
    if isStr(outf):
        print (outf)
    else:
        fd = open('test.jgw', 'wb')
        fd.write(outf.read())
        fd.close()

if __name__ == '__main__':
    test("style=streeto-OS-10|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=607f20b74ad8f|start=6801344,-86261|crosses=|cps=|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631|rotation=0.2|grid=yes|dpi=450")
