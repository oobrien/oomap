<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(SELECT ST_Intersection(way, !bbox!) as way, ele as height, ST_Length(way) as length FROM &prefix;_srtm_line WHERE (ele*2)::integer % (10*&contourSeparation;)::integer != 0 AND  (ele*2)::integer % (2*&contourSeparation;)::integer = 0) as "cntrs10"
            </Parameter>
        </Datasource>
</Layer>

<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(SELECT ST_Intersection(way, !bbox!) as way, ele as height, ST_Length(way) as length FROM &prefix;_srtm_line WHERE (ele*2)::integer % (10*&contourSeparation;)::integer = 0 ) as "cntrs50"
            </Parameter>
        </Datasource>
</Layer>
