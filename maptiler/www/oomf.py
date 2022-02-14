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
web_root = 'https://tile.dna-software.co.uk/'

def parse_query(url):
    p = parse_qs(url.replace("|", "&").replace("%7C", "&")) #Replace "|" to allow standard parsing; in case "|" gets URL-encoded also replace "%7C"
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
    p['mapid']= p.get('id', 'new')
    return(p)


def isStr(x):
    try:
        return str(x) == x
    except Exception:
        return False
