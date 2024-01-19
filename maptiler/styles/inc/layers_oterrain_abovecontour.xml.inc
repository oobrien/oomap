<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)) as coastline
      </Parameter>
    </Datasource>
</Layer>

<Layer name="water_areas_core" status="on" srs="&srs900913;">
    <StyleName>water_areas_core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,"natural",waterway,landuse,way_area
            from &prefix;_polygon
            where landuse in ('reservoir','water','basin')
              or "natural" in ('lake','water')
            order by z_order,way_area desc
            ) as water_areas
        </Parameter>
    </Datasource>
</Layer>


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
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,railway,layer,bridge,tunnel
            from &prefix;_line
            where (highway is not null
                or railway is not null)
                and bridge not in ('no','false','0')
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="power" status="on" srs="&srs900913;">
    <StyleName>power</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
          (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from &prefix;_line where "power"='line') as power
        </Parameter>
    </Datasource>
</Layer>

<Layer name="symbols" status="on" srs="&srs900913;">
    <StyleName>symbols</StyleName>
    <StyleName>opaque_symbols</StyleName>
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

<Layer name="area_symbols" status="on" srs="&srs900913;">
    <StyleName>area_symbols</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Centroid(way), &magn;, ST_Centroid(&box3857;)) as way, man_made, amenity
            from &prefix;_polygon
            where ST_Intersects(ST_Centroid(way),&box3857;)
              and (man_made='water_well' or man_made='water_tower' or man_made='reservoir_covered' or amenity='fountain')
            ) as areasymbols
        </Parameter>
    </Datasource>
</Layer>
