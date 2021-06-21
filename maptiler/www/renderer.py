# -*- coding: utf-8 -*-
import os, os.path

def handle(req):
	from mod_python import apache, util
	path = os.path.basename(req.filename)+req.path_info

	req.headers_out.add('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type')
	req.headers_out.add('Access-Control-Allow-Origin', '*')

	if path == "":
#		req.status = apache.HTTP_NOT_FOUND
#		req.content_type = 'text/plain'
#		req.write("Path not specifiedddd.")
#		return apache.OK
		return apache.DECLINED

	if path == "favicon.ico":
		req.status = apache.HTTP_NOT_FOUND
		req.content_type = 'text/plain'
		req.write("404")
		return apache.OK

	if path[0:3] == "pdf":
		import handlePDF
		req = handlePDF.processRequest(req)
		return apache.OK	

	if path[0:3] == "jpg":
			import handleJPG
			req = handleJPG.processRequest(req)
			return apache.OK

	if path[0:3] == "jgw":
			import handleJGW
			req = handleJGW.processRequest(req)
			return apache.OK

	if path[0:3] == "kmz":
			import handleKMZ
			req = handleKMZ.processRequest(req)
			return apache.OK

