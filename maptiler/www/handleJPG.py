import os, os.path
import math
import time
from handlePDF import createImage

home = "/home/ollie/production/maptiler"

def isStr(x):
	try:
		return str(x) == x
	except Exception:
		return False

def processRequest(req):
	from mod_python import apache, util
	path = req.args

	with open(home + "/logs/oommakerlog-jpg-access.txt", "a") as fa:
		fa.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + path + "\n")
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
		with open(home + "/logs/oommakerlog-jpg-error.txt", "a") as fe:
			fe.write(time.strftime('%x %X') + " : " + req.get_remote_host() + " : " + outf + " : " + path + "\n")		
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
	# test("style=streeto|paper=a4l|scale=10000|centre=6801767,-86381|title=Furzon%20%28Milton%20Keynes%29|start=|controls=")
	#	 style, paper, scale, centre, title, club, mapid, start, crosses, controls  = path.split("|")
	test("style=streeto|paper=0.297,0.210|scale=10000|centre=6801767,-86381|title=Furzton%20%28Milton%20Keynes%29|club=|mapid=|start=6801344,-86261|crosses=|cps=|controls=10,45,6801960,-86749,11,45,6802104,-85841,12,45,6802080,-85210,13,45,6802935,-86911,14,45,6801793,-87307,15,45,6802777,-86285,16,45,6801244,-85573,17,45,6801382,-86968,18,45,6802357,-87050,19,45,6802562,-87288,20,45,6802868,-87303,21,45,6802204,-86342,22,45,6803011,-86008,23,45,6802600,-85081,24,45,6801903,-84580,25,45,6801024,-85382,26,45,6800718,-86400,27,45,6801139,-87112,28,45,6801717,-86519,29,45,6801736,-85549,30,45,6801769,-88206,31,45,6802161,-87795,32,45,6800919,-87618,33,45,6801989,-86099,34,45,6800546,-85621,35,45,6801631,-84795,36,45,6802309,-84403,37,45,6803126,-86223,38,45,6802061,-87174,39,45,6801674,-87828,40,45,6802567,-87962,41,45,6800627,-86772,42,45,6802080,-84250,43,45,6803212,-85320,44,45,6801091,-88631")
	# test("style=oterrain|paper=a4l|scale=10000|centre=6701416,-36931|title=Teddington 18/02/2010 E|start=6701091,-36673|controls=1,45,6701683,-35890,2,45,6700670,-37313,3,45,6700861,-35498")
	# test("style=streeto|paper=a4l|scale=10000|centre=6701568,-34323|title=Teddington%20%28Test%29|start=6701568,-34323|controls=1,315,6701244,-35230,22,225,6701998,-33148")
	# iest("style=streeto|paper=a4p|scale=12500|centre=6701387,-38364|title=Many%20Controls|start=6700298,-38106|controls=1,45,6701823,-38811,2,45,6701598,-40125,3,45,6702621,-39886,4,45,6702998,-39136,5,45,6703285,-39466,6,45,6703192,-38716,7,45,6702645,-39456,8,45,6702914,-39898,9,45,6703225,-40244,10,45,6702136,-39833,11,45,6702379,-38632,12,45,6702590,-38696,13,45,6701837,-39174,14,45,6701006,-38599,15,45,6700722,-38682,16,45,6700710,-38460,17,45,6700397,-38536,18,45,6700801,-39396,19,45,6700445,-39683,20,45,6701840,-37053,21,45,6702052,-37098,22,45,6702707,-37378,23,45,6703024,-37502,24,45,6703208,-37440,25,45,6702219,-38204,26,45,6702124,-38159,27,45,6701701,-39463,28,45,6701792,-39595,31,45,6701422,-39896,32,45,6701500,-40008,33,45,6701918,-39955,34,45,6701959,-40318,35,45,6700435,-40266,36,45,6699336,-39864,37,45,6699692,-39955,38,45,6699632,-40328,39,45,6699193,-39055,40,45,6699568,-38931,41,45,6699656,-38441,42,45,6699716,-38336,43,45,6700031,-38436,44,45,6699996,-38281,45,45,6700760,-37966,46,45,6700903,-37829,47,45,6700927,-38338,48,45,6700285,-38696,49,45,6700308,-38938,50,45,6700299,-39377,51,45,6700005,-39681,52,45,6700215,-39423,53,45,6700213,-39341,54,45,6700304,-39272,55,45,6700375,-39179,56,45,6699085,-39138,57,45,6698980,-39351,58,45,6699355,-39695,59,45,6700148,-37803,60,45,6700182,-37440,61,45,6700041,-37973,62,45,6700007,-37650,63,45,6699988,-37590,64,45,6700000,-37536,65,45,6699900,-38737")
