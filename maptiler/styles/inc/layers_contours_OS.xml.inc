<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style</StyleName>
    <Datasource>
        &datasource-settings-contours;
        <Parameter name="table">
        (
            WITH wetstuff as (
            SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)
            UNION ALL
            SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way
            FROM &prefix;_polygon
            WHERE landuse in ('reservoir','water','basin') or "natural" in ('lake','water') or "water" = 'yes'
            )
            select ST_Difference(ST_SetSRID(ST_Rotate(ST_Intersection(h.way, &box;), &magn;, ST_Centroid(&box;)),3857), ST_Union(w.way)) as way, h.prop_value 
            from terr50_lns2 h, wetstuff w
            WHERE h.prop_value::integer % 50 != 0 AND ST_Intersects(h.way,&box;)
            GROUP BY h.way, h.prop_value
        ) as "cntrs10"

        </Parameter>
    </Datasource>
</Layer>

<Layer name="contours_simple_major" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style_major</StyleName>
    <Datasource>
        &datasource-settings-contours;
        <Parameter name="table">
        (
            WITH wetstuff as (
            SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)
            UNION ALL
            SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way
            FROM &prefix;_polygon
            WHERE landuse in ('reservoir','water','basin') or "natural" in ('lake','water') or "water" = 'yes'
            )
            select ST_Difference(ST_SetSRID(ST_Rotate(ST_Intersection(h.way, &box;), &magn;, ST_Centroid(&box;)),3857), ST_Union(w.way)) as way, h.prop_value 
            from terr50_lns2 h, wetstuff w
            WHERE h.prop_value::integer % 50 = 0 AND ST_Intersects(h.way,&box;)
            GROUP BY h.way, h.prop_value
        ) as "cntrs50"
        </Parameter>
    </Datasource>
</Layer>
