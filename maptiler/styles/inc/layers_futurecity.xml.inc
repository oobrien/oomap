<Layer name="land" status="on" srs="&srs900913;">
    <StyleName>land</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (SELECT ST_Intersection(way, &box3857;) as way from ocean) as ocean
      </Parameter>
    </Datasource>
</Layer>

<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (SELECT ST_Intersection(way, &box3857;) as way from water WHERE ST_Intersects(way,&box3857;)) as coastline
      </Parameter>
    </Datasource>
</Layer>

<Layer name="parkareas" status="on" srs="&srs900913;">
    <StyleName>parkareas</StyleName>
    <Datasource>
    &datasource-settings;
        <Parameter name="table">
            (select way,"natural",landuse,leisure,name,way_area
            from &prefix;_polygon
            where leisure in ('park', 'garden', 'nature_reserve', 'common')
                or landuse in ('forest', 'recreation_ground', 'village_green', 'meadow')
                or "natural" in ('wood', 'heath')
            order by z_order,way_area desc
            ) as parkareas
        </Parameter>
    </Datasource>
</Layer>

<Layer name="waterareas" status="on" srs="&srs900913;">
    <StyleName>waterareas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural",waterway,landuse,name,way_area
            from &prefix;_polygon
            where waterway in ('dock','mill_pond','riverbank','canal','river')
                or landuse in ('reservoir','water','basin')
                or "natural" in ('lake','water','land','marsh','scrub','wetland','glacier')
            order by z_order,way_area desc
            ) as waterareas
        </Parameter>
    </Datasource>
</Layer>

<Layer name="waterlines" status="on" srs="&srs900913;">
    <StyleName>waterlines</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,waterway,name,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel
            from &prefix;_line
            where waterway in ('weir','river','canal','derelict_canal','stream','drain')
                and (bridge is null or bridge not in ('yes','true','1','aqueduct'))
            order by z_order
            ) as waterlines
        </Parameter>
    </Datasource>
</Layer>

<Layer name="roads" status="on" srs="&srs900913;">
    <StyleName>roadscasing</StyleName>
    <StyleName>roadscore</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,name,highway,railway,amenity,aeroway,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel,
            case when bridge in ('yes','true','1') then 'yes'::text else bridge end as bridge
            from &prefix;_line
            where highway is not null
                or railway is not null
                or aeroway is not null
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="pavedareas" status="on" srs="&srs900913;">
    <StyleName>roadscasing</StyleName>
    <StyleName>roadscore</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,highway,railway,amenity,aeroway,tunnel from &prefix;_polygon
            where highway in ('residential','unclassified','pedestrian','service','footway','track')
                or amenity = 'parking'
            order by z_order,way_area desc) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="amenity-stations" status="on" srs="&srs900913;">
    <StyleName>stations</StyleName>
    <StyleName>stationstext</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
        (select way,name,railway,aerialway
        from &prefix;_point
        where railway in ('station','halt','tram_stop')
            or aerialway='station'
        ) as stations
        </Parameter>
    </Datasource>
</Layer>

<Layer name="bigplaces" status="on" srs="&srs900913;">
    <StyleName>city</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,place,name
            from &prefix;_point
            where place in ('city','metropolis')
            ) as placenames
        </Parameter>
    </Datasource>
</Layer>

<Layer name="medplaces" status="on" srs="&srs900913;">
    <StyleName>town</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,place,name
            from &prefix;_point
            where place in ('town','large_town','small_town')
            ) as placenames
        </Parameter>
    </Datasource>
</Layer>

<Layer name="smallplaces" status="on" srs="&srs900913;">
    <StyleName>suburb</StyleName>
    <StyleName>village</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,place,name
            from &prefix;_point
            where place in ('suburb','village','large_village','locality')
            ) as placenames
        </Parameter>
    </Datasource>
</Layer>

<Layer name="roads" status="on" srs="&srs900913;">
    <StyleName>roads-text</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,name,highway,railway,amenity,aeroway,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel,
            case when bridge in ('yes','true','1') then 'yes'::text else bridge end as bridge
            from &prefix;_line
            where highway is not null
                or railway is not null
                or aeroway is not null
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>
