import os, os.path
import math
import time
from handlePDF import createImage

home_base = os.getenv('OOM_HOME')
home=home_base + "/maptiler"

def isStr(x):
    try:
        return str(x) == x
    except Exception:
        return False

def processRequest(req):
    from mod_python import apache, util
    path = req.args

#    with open(home + "/logs/oommakerlog-jpg-access.txt", "a") as fa:
#        fa.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + path + "\n")
    outf = createImage(path, 'jpg')

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
#        with open(home + "/logs/oommakerlog-jpg-error.txt", "a") as fe:
#            fe.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + outf + " : " + path + "\n")
        return req
    else:
        outfsize = os.fstat(outf.fileno()).st_size
        req.status = apache.HTTP_OK
        req.content_type = 'image/jpeg'
        req.headers_out["Content-Disposition"] = "attachment; filename=\"oom_" + mapid + ".jpg\""
        req.set_content_length(outfsize)
        req.write(outf.read())
        return req

def test(path):
    outf = createImage(path, 'jpg')
    if isStr(outf):
        print outf
    else:
        fd = open('test.jpg', 'wb')
        fd.write(outf.read())
        fd.close()

if __name__ == '__main__':
    test("style=streeto|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=|start=6801344,-86261|crosses=|cps=|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631")
