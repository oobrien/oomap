<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
                (select way as way, prop_value, false as major from terr50_lns2) as cntrs10
            </Parameter>
        </Datasource>
</Layer>
