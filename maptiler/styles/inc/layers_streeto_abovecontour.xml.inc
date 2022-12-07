<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (SELECT ST_Intersection(way, !bbox!) as way from water WHERE ST_Intersects(way,!bbox!)) as coastline
      </Parameter>
    </Datasource>
</Layer>

<Layer name="water_areas" status="on" srs="&srs900913;">
    <StyleName>water_areas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Intersection(way, !bbox!) as way,"natural",waterway,landuse,"water",way_area
            from &prefix;_polygon
                    where landuse in ('reservoir','water','basin')
                or "natural" in ('lake','water')
                or "water" = 'yes'
            order by z_order,way_area desc
            ) as water_areas
        </Parameter>
    </Datasource>
</Layer>

<Layer name="piers" status="on" srs="&srs900913;">
    <StyleName>islands</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Intersection(way, !bbox!) as way,"natural" from &prefix;_polygon
            where "man_made" in ('pier')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>

<Layer name="line features" status="on" srs="&srs900913;">
    <StyleName>cliffs</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Intersection(way, !bbox!) as way,barrier,"natural",man_made from &prefix;_line where barrier is not null or "natural" in ('hedge','cliff') or man_made='embankment') as roads
        </Parameter>
    </Datasource>
</Layer>
<Layer name="bridges" status="on" srs="&srs900913;">
    <StyleName>bridges-casing</StyleName>
    <StyleName>bridges-core</StyleName>
    <StyleName>trams-casing</StyleName>
    <StyleName>trams-core</StyleName>
    <StyleName>roads-casing</StyleName>
    <StyleName>roads-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Intersection(way, !bbox!) as way,highway,railway,amenity,layer,bridge,tunnel
            from &prefix;_line
            where (highway is not null
                or railway is not null)
                and bridge in ('yes','true','1')
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="power" status="on" srs="&srs900913;">
    <StyleName>power</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">(select ST_Intersection(way, !bbox!) as way from &prefix;_line where "power"='line' AND ST_Intersects(way,!bbox!)) as power</Parameter>
    </Datasource>
</Layer>

<Layer name="symbols" status="on" srs="&srs900913;">
    <StyleName>symbols</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select *
            from &prefix;_point
            ) as symbols
        </Parameter>
    </Datasource>
</Layer>
