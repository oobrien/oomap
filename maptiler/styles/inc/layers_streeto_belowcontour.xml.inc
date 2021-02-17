<Layer name="land" status="on" srs="&srs900913;">
    <StyleName>land</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (SELECT ST_Intersection(way, !bbox!) as way from ocean) as ocean
      </Parameter>
    </Datasource>
</Layer>

<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (SELECT ST_Intersection(way, !bbox!) as way from water) as coastline
      </Parameter>
    </Datasource>
</Layer>

<Layer name="leisure" status="on" srs="&srs900913;">
    <StyleName>leisure</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Intersection(way, !bbox!) as way,amenity,landuse,leisure,man_made,highway,"natural",power,tourism
            from &prefix;_polygon
            where landuse is not null
                or leisure is not null
                or amenity in ('parking','university','college','school','hospital','grave_yard')
                or highway in ('pedestrian', 'services')
                or "natural" in ('field','beach','heath','mud','wood','scrub','meadow','crop','grass','grassland')
                or power in ('station','sub_station')
                or tourism in ('attraction','camp_site','caravan_site','picnic_site','zoo')
            order by z_order,way_area desc
            ) as leisure
      </Parameter>
    </Datasource>
</Layer>

<Layer name="water_areas" status="on" srs="&srs900913;">
    <StyleName>water_areas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural",waterway,landuse,way_area
            from &prefix;_polygon
                    where waterway in ('dock','mill_pond','riverbank','canal','river')
                or landuse in ('reservoir','water','basin')
                or "natural" in ('lake','water','land','marsh','scrub','wetland','glacier')
            order by z_order,way_area desc
            ) as water_areas
        </Parameter>
    </Datasource>
</Layer>

<Layer name="carparks" status="on" srs="&srs900913;">
    <StyleName>pavedareas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,amenity from &prefix;_polygon
            where amenity='parking'
            order by z_order,way_area desc) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="paved-areas" status="on" srs="&srs900913;">
    <StyleName>pavedareas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,highway,tunnel from &prefix;_polygon
            where highway in ('residential','unclassified','pedestrian','service')
            or (highway in ('footway','track')
            and (foot not in ('no', 'private','destination','customer'))
            and (access not in ('no', 'private','destination','customer') and foot is null))
            order by z_order,way_area desc) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="water_lines" status="on" srs="&srs900913;">
    <StyleName>water_lines</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,waterway,
            case when tunnel in ('yes','true','1','culvert') then 'yes'::text else tunnel end as tunnel
            from &prefix;_line
            where waterway in ('weir','river','canal','derelict_canal','stream','drain')
                and (bridge is null or bridge not in ('yes','true','1','aqueduct'))
            order by z_order
            ) as water_lines
        </Parameter>
    </Datasource>
</Layer>

<Layer name="tunnels" status="on" srs="&srs900913;">
    <StyleName>tunnels-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,highway,amenity from &prefix;_line where tunnel in ('yes','true','1') order by z_order) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="buildings" status="on" srs="&srs900913;">
    <StyleName>buildings-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,building,leisure,railway,amenity,landuse from &prefix;_polygon
            where building is not null
                or landuse='building'
                or railway='station'
                or amenity='place_of_worship'
            order by z_order,way_area desc) as buildings
        </Parameter>
    </Datasource>
</Layer>

<Layer name="line features" status="on" srs="&srs900913;">
    <StyleName>barriers</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,barrier,"natural",man_made from &prefix;_line where barrier is not null or "natural" in ('hedge','cliff') or man_made='embankment') as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="roads" status="on" srs="&srs900913;">
    <StyleName>trams-casing</StyleName>
    <StyleName>trams-core</StyleName>
    <StyleName>roads-casing</StyleName>
    <StyleName>roads-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,highway,railway,amenity,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel,
            case when bridge in ('yes','true','1') then 'yes'::text else bridge end as bridge
            from &prefix;_line
            where highway is not null
                or railway is not null
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="islands" status="on" srs="&srs900913;">
    <StyleName>islands</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural" from &prefix;_polygon
            where "natural" in ('land', 'island')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>
