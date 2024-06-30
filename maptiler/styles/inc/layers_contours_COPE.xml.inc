<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(
    WITH wetstuff as (
    SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)
    UNION ALL
    SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way
    FROM &prefix;_polygon
    WHERE landuse in ('reservoir','water','basin') or "natural" in ('lake','water') or "water" = 'yes'
    )
    SELECT ST_Difference(ST_SetSRID(ST_Rotate(ST_Intersection(h.way, &box3857;),&magn;, ST_Centroid(&box3857;)),3857), ST_Union(w.way)) as way, h.height as height, ST_Length(h.way) as length 
    FROM &prefix;_srtm_line h, wetstuff w 
     WHERE (h.height*2)::integer % (10*&contourSeparation;)::integer != 0 AND  (h.height*2)::integer % (2*&contourSeparation;)::integer = 0
    group by h.way, h.height
) as "cntrs10"
            </Parameter>
        </Datasource>
</Layer>

<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(
    WITH wetstuff as (
    SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)
    UNION ALL
    SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way
    FROM &prefix;_polygon
    WHERE landuse in ('reservoir','water','basin') or "natural" in ('lake','water') or "water" = 'yes'
    )
    SELECT ST_Difference(ST_SetSRID(ST_Rotate(ST_Intersection(h.way, &box3857;),&magn;, ST_Centroid(&box3857;)),3857), ST_Union(w.way)) as way, h.height as height, ST_Length(h.way) as length 
    FROM &prefix;_srtm_line h, wetstuff w 
    WHERE (h.height*2)::integer % (10*&contourSeparation;)::integer = 0 
    group by h.way, h.height
) as "cntrs50"
            </Parameter>
        </Datasource>
</Layer>
