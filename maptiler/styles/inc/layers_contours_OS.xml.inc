<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select ST_Rotate(ST_Intersection(way, &box;), &magn;, ST_Centroid(&box;)) as way, prop_value from terr50_lns2 WHERE prop_value::integer % 50 != 0 AND ST_Intersects(way,&box;)) as cntrs10
            </Parameter>
        </Datasource>
    </Layer>

<Layer name="contours_simple_major" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style_major</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select ST_Rotate(ST_Intersection(way, &box;), &magn;, ST_Centroid(&box;)) as way, prop_value from terr50_lns2 WHERE prop_value::integer % 50 = 0 AND ST_Intersects(way,&box;)) as cntrs50
            </Parameter>
        </Datasource>
    </Layer>
