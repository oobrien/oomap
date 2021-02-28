<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select ST_Intersection(way, !bbox!) as way, prop_value from terr50_lns2 WHERE prop_value::integer % 50 != 0 AND ST_Intersects(way,!bbox!)) as cntrs10
            </Parameter>
        </Datasource>
    </Layer>

<Layer name="contours_simple_major" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style_major</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select ST_Intersection(way, !bbox!) as way, prop_value from terr50_lns2 WHERE prop_value::integer % 50 = 0 AND ST_Intersects(way,!bbox!)) as cntrs50
            </Parameter>
        </Datasource>
    </Layer>
