<Layer name="line features" status="on" srs="&srs900913;">
    <StyleName>cliffs</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,barrier,"natural",man_made from &prefix;_line where barrier is not null or "natural" in ('hedge','cliff') or man_made='embankment') as roads
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
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,railway,amenity,layer,bridge,tunnel
            from &prefix;_line
            where (highway is not null
                or railway is not null)
                and (bridge is not null and bridge &lt;&gt; 'no')
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="power" status="on" srs="&srs900913;">
    <StyleName>power</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">(select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from &prefix;_line where "power"='line' AND ST_Intersects(way,&box3857;)) as power</Parameter>
    </Datasource>
</Layer>

<Layer name="symbols" status="on" srs="&srs900913;">
    <StyleName>symbols</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
          (select  ST_Rotate(way, &magn;, ST_Centroid(&box3857;)) as way, man_made, amenity, leisure, "natural", historic
          from &prefix;_point
          where ST_Intersects(way,&box3857;)
          ) as symbols
        </Parameter>
    </Datasource>
</Layer>
