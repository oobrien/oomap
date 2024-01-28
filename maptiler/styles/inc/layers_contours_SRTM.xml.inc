<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way, height, ST_Length(way) as length FROM &prefix;_srtm_line WHERE (height*2)::integer % (10*&contourSeparation;)::integer != 0 AND  (height*2)::integer % (2*&contourSeparation;)::integer = 0) as "cntrs10"
            </Parameter>
        </Datasource>
</Layer>

<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way, height, ST_Length(way) as length FROM &prefix;_srtm_line WHERE (height*2)::integer % (10*&contourSeparation;)::integer = 0 ) as "cntrs50"
            </Parameter>
        </Datasource>
</Layer>
