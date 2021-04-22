try:    #DPD - get urlparse regardless of Python version
    from urllib.parse import parse_qs   #Python3
except ImportError:
     from urlparse import parse_qs  #Python2
import os, os.path
import time
#Get environment vars (set in /etc/apache2/envvars)
home_base = os.getenv('OOM_HOME')
ee_user = os.getenv('OOM_EE_USR')
ee_pw = os.getenv('OOM_EE_PW')
home = home_base + "/maptiler"
web_root = 'http://tile.dna-software.co.uk:8888/'

def parse_query(url):
    p = parse_qs(url.replace("|", "&"))
    for key, val in p.items():  #unlist param dictionary values
        p[key] = val[0]
    if not ('centre' in p and 'scale' in p and 'paper' in p):
        return ("Malformed URL")
    try:
        p['style'], p['contour'], p['interval'] = p['style'].split("-")
    except:
        pass
    try:
        p['interval'] = p['interval'].replace("p",".")  #For 2.5 m contours, string comes as "2p5"
    except:
        p['interval'] = '0'
    p['contour'] = p.get('contour', 'NONE')
    p['dpi']=float(p.get('dpi','150'))
    p['mapid']=p['id']
    return(p)


def isStr(x):
    try:
        return str(x) == x
    except Exception:
        return False

def req_write(outf, req, mapid, filetype):
    from mod_python import apache, util
    if isStr(outf):
        req.status = apache.HTTP_SERVICE_UNAVAILABLE
        req.content_type = 'text/html'
        outHTML = "<html><head><title>OpenOrienteeringMap: Error</title></head><body><h1>Error</h1><p>" + outf + "</p></body></html>"
        req.write(outHTML)
        with open(home_base + "/log/oommakerlog-access.txt", "a") as fa:
            fa.write("failure|" + time.strftime('%x %X') + "|" + req.get_remote_host() + "|" + os.path.basename(req.filename) + "|" + req.args + "\n")
    else:
        types = {
            'jpg': 'image/jpeg',
            'jgw': 'text/plain',
            'kmz': 'application/vnd.google-earth.kmz',
            'pdf': 'application/pdf'
        }
        outf.seek(0)    #DPD
        outfsize = os.fstat(outf.fileno()).st_size
        req.status = apache.HTTP_OK
        req.content_type = types.get(filetype)
        req.headers_out["Content-Disposition"] = "attachment; filename=\"oom_" + mapid + "." + filetype + "\""
        req.set_content_length(outfsize)
        req.write(outf.read())
        with open(home_base + "/log/oommakerlog-access.txt", "a") as fa:
            fa.write("success|" + time.strftime('%x %X') + "|" + req.get_remote_host() + "|" + os.path.basename(req.filename) + "|" + req.args + "\n")
    return req
