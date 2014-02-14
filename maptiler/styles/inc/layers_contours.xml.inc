<Layer name="contours_layer" status="on" srs="&srs27700;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select geom, prop_value from terr50_lns WHERE prop_value::integer % 50 != 0 and feat_type = 'ContourLine') as cntrs10
            </Parameter>
        </Datasource>
    </Layer>
    
<Layer name="contours_layer_major" status="on" srs="&srs27700;">
    <StyleName>contours_style_major</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select geom, prop_value from terr50_lns WHERE prop_value::integer % 50 = 0 and feat_type = 'ContourLine') as cntrs50
            </Parameter>
        </Datasource>
    </Layer>
