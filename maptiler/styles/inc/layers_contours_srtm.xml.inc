<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings;
            <Parameter name="table">
(SELECT ST_Intersection(way, !bbox!) as way, ele as height, ST_Length(way) as length FROM &prefix;_srtm_line) as "cntrs10"
            </Parameter>
        </Datasource>
    </Layer>

