<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
(
SELECT ST_Intersection(way, !bbox!) as way, height, ST_Length(way) as length 
FROM lidar2  
WHERE (height*2)::integer % (10* &contourSeparation; )::integer != 0 
AND  (height*2)::integer % (2* &contourSeparation; )::integer = 0 
AND ST_Intersects(way,!bbox!)
UNION ALL
SELECT ST_Intersection(way, !bbox!) as way, height, ST_Length(way) as length 
FROM lidar_oz 
WHERE (height*2)::integer % (10* &contourSeparation; )::integer != 0 
AND  (height*2)::integer % (2* &contourSeparation; )::integer = 0 
AND ST_Intersects(way,!bbox!)
) as "cntrs10"
            </Parameter>
        </Datasource>
    </Layer>

<Layer name="contours_layer_major" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
(
SELECT ST_Intersection(way,!bbox!) as way, height, ST_Length(way) as length F
ROM lidar2 
WHERE (height*2)::integer % (10* &contourSeparation; )::integer = 0  
AND ST_Intersects(way,!bbox!)
UNION ALL
SELECT ST_Intersection(way,!bbox!) as way, height, ST_Length(way) as length F
ROM lidar_oz
WHERE (height*2)::integer % (10* &contourSeparation; )::integer = 0  
AND ST_Intersects(way,!bbox!)
) as "cntrs50"
            </Parameter>
        </Datasource>
    </Layer>
