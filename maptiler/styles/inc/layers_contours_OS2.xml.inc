<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select way, prop_value, 500 as length from terr50_lns2 WHERE prop_value::integer % 50 != 0) as cntrs10
            </Parameter>
        </Datasource>
    </Layer>

<Layer name="contours_layer_major" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select way, prop_value, 500 as length from terr50_lns2 WHERE prop_value::integer % 50 = 0) as cntrs50
            </Parameter>
        </Datasource>
    </Layer>
