# -*- coding: utf-8 -*-
from oomf import *

def logRequest(status, filetype, environ):
    try:    #Get req IP from reverse proxy if present,
        requestor = environ['HTTP_X_FORWARDED_FOR']
    except KeyError: #otherwise get directly
        requestor = environ['REMOTE_ADDR']
    with open(home_base + "/log/oommakerlog-access.txt", "a") as fa:
        outline = status + "|" + time.strftime('%x %X') + "|" + requestor + "|" + filetype + "|" + environ['QUERY_STRING'] + "\n"
        fa.write(outline)

def application(environ, start_response):
    path = os.path.basename(environ['SCRIPT_NAME'])+environ['PATH_INFO']
    response_headers=[('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type'),
    ('Access-Control-Allow-Origin', '*'),
    ('Content-type', 'text/html')]
    html = '<html><body><div style="width: 100%; font-size: 40px; font-weight: bold; text-align: center;">\n' + \
    path + '</div></body></html>\n'

    try:
        filetype = path[7:10]    #extract filetype xxx from path (should be 'render/xxx?params')
    except:
        filetype = '404'

    if filetype == "pdf":
        import handlePDF
        body, mapid = handlePDF.processRequest(environ)

    elif filetype == "jpg" or filetype == "pre":
        import handleJPG
        body, mapid = handleJPG.processRequest(environ)

    elif filetype == "jgw":
        import handleJGW
        body, mapid = handleJGW.processRequest(environ)

    elif filetype == "kmz":
        import handleKMZ
        body, mapid = handleKMZ.processRequest(environ)

#Enable for debugging
#    elif filetype == "dbg":
#        from io import StringIO
#        headers = []
#        headers.append(('Content-Type', 'text/plain'))
#        write = start_response('200 OK', headers)
#        input = environ['wsgi.input']
#        output = StringIO()
#        keys = environ.keys()
#        for key in keys:
#            print ('%s: %s' % (key, repr(environ[key])), file=output)
#        return [output.getvalue().encode('utf-8')]
#
    else:   #Request URL is mal-formed
        body=html

    if isStr(body): #If body is a string, there's a problem.
        status = '503 Service Unavailable'
        response_headers = [('Content-type','text/html')]
        logRequest("failure", filetype, environ)
        start_response(status, response_headers)
        return [b"<html><head><title>OpenOrienteeringMap: Error</title></head><body><h1>Error</h1><p>" + body.encode('utf-8') + b"</p></body></html>"]
    else:   #Otherwise, body is a file handle - send file as attachment
        types = {
            'jpg': 'image/jpeg',
            'pre': 'image/jpeg',
            'jgw': 'text/plain',
            'kmz': 'application/vnd.google-earth.kmz',
            'pdf': 'application/pdf'
        }
        body.seek(0)    #DPD
        outfsize = os.fstat(body.fileno()).st_size
        status = '200 OK'
        logRequest("success", filetype, environ)
        if filetype == 'pre':
            filetype = 'jpg'
        response_headers = [('Content-type',types.get(filetype)),
            ("Content-Disposition", "attachment; filename=\"oom_" + mapid + "." + filetype + "\""),
            ('content-length',str(outfsize))]
        start_response(status, response_headers)
        return [body.read()]
