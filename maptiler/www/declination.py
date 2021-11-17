# -*- coding: utf-8 -*-

"""
WSGI module to return magnetic declination for current time, given lat and lon values
Returns plain text, with string representation of dec (or "0.0" if it fails).
Depends on https://github.com/todd-dembrey/geomag
"""
from oomf import *
from geomag import WorldMagneticModel

def application(environ, start_response):
    response_headers=[('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type'),
    ('Access-Control-Allow-Origin', '*'),
    ('Content-type', 'text/plain')]

    path = environ['QUERY_STRING']
    p = parse_qs(path)
    for key, val in p.items():  #unlist param dictionary values
        p[key] = val[0]

    wmm = WorldMagneticModel()

    try:
        magdec = wmm.calc_mag_field(real(p['lat']), real(p['lon'])).declination #look up magnetic declination for correct map North lines
    except:
        magdec = 0

    start_response('200 OK', response_headers)
    return [str(magdec).encode('utf-8')]
