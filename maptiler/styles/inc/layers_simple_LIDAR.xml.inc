<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_simple_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
(SELECT way as way, false as major FROM all_lidar WHERE (height*2)::integer % (2* &contourSeparation; )::integer = 0) as "cntrs10"
            </Parameter>
        </Datasource>
 </Layer>
