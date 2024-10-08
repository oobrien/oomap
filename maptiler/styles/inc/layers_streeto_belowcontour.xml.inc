<Layer name="land" status="on" srs="&srs900913;">
    <StyleName>land</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from ocean) as ocean
      </Parameter>
    </Datasource>
</Layer>

<Layer name="leisure_lower" status="on" srs="&srs900913;">
    <StyleName>leisure_lower</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,amenity,landuse,leisure,man_made,highway,"natural",power,tourism
            from &prefix;_polygon
            where landuse is not null
                or leisure is not null
                or amenity in ('parking','university','college','school','hospital','grave_yard')
                or highway in ('pedestrian', 'services')
                or "natural" in ('field','beach','heath','mud','wood','scrub','meadow','crop','grass','grassland','scree')
                or power in ('station','sub_station')
                or tourism in ('attraction','camp_site','caravan_site','picnic_site','zoo')
            order by z_order,way_area desc
            ) as leisure
      </Parameter>
    </Datasource>
</Layer>

<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)) as coastline
      </Parameter>
    </Datasource>
</Layer>

<Layer name="islands" status="on" srs="&srs900913;">
    <StyleName>islands</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,"natural" from &prefix;_polygon
            where "natural" in ('land', 'island')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>

<Layer name="leisure_upper" status="on" srs="&srs900913;">
    <StyleName>leisure_upper</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,amenity,landuse,leisure,man_made,highway,"natural",power,tourism,"water",waterway,way_area
            from &prefix;_polygon
            where landuse is not null
                or leisure is not null
                or amenity in ('parking','university','college','school','hospital','grave_yard')
                or highway in ('pedestrian', 'services')
                or "natural" is not null
                or power in ('station','sub_station')
                or tourism in ('attraction','camp_site','caravan_site','picnic_site','zoo')
                or "water" = 'yes'
            order by z_order,way_area desc
            ) as leisure
      </Parameter>
    </Datasource>
</Layer>

<Layer name="carparks" status="on" srs="&srs900913;">
    <StyleName>pavedareas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,amenity from &prefix;_polygon
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
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,tunnel from &prefix;_polygon
            where highway in ('residential','unclassified','pedestrian','service')
            or (highway in ('footway','track')
            and (foot not in ('no', 'private','destination','customer'))
            and (access not in ('no', 'private','destination','customer') and foot is null))
            order by z_order,way_area desc) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="bridge_areas" status="on" srs="&srs900913;">
    <StyleName>land</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from &prefix;_polygon
            where "man_made" in ('bridge','breakwater','groyne','lighthouse')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>

<Layer name="piers" status="on" srs="&srs900913;">
    <StyleName>pavedareas</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,"natural" from &prefix;_polygon
            where "man_made" in ('pier')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>

<Layer name="water_lines" status="on" srs="&srs900913;">
    <StyleName>water_lines</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,waterway,
            case when tunnel in ('yes','true','1','culvert') then 'yes'::text else tunnel end as tunnel
            from &prefix;_line
            where waterway in ('weir','river','canal','derelict_canal','stream','drain')
                and (bridge is null or bridge not in ('yes','true','1','aqueduct'))
            order by z_order
            ) as water_lines
        </Parameter>
    </Datasource>
</Layer>

<Layer name="buildings" status="on" srs="&srs900913;">
    <StyleName>buildings-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
          (WITH areas as (
          select ST_Force2D(ST_MakeValid(ST_Union(ST_Intersection(way, &box3857;)))) as way2
                      from &prefix;_polygon
                      where (landuse is not null and landuse &lt;&gt; 'residential')
                          or leisure is not null
                          or amenity in ('parking','university','college','school','hospital','grave_yard')
                          or highway in ('pedestrian', 'services')
                          or "natural" in ('field','beach','heath','mud','wood','scrub','meadow','crop','grass','grassland','land','marsh','scrub','wetland','glacier')
                          or power in ('station','sub_station')
                          or tourism in ('attraction','camp_site','caravan_site','picnic_site','zoo')
          		or waterway in ('dock','mill_pond','riverbank','canal','river')
                         )
                     select ST_Rotate(ST_Force2D(ST_MakeValid(b.way)), &magn;, ST_Centroid(&box3857;)) as way,b.building,b.leisure,b.railway,b.amenity,b.landuse from &prefix;_polygon b, areas a
                      where (b.building is not null
                          or b.landuse='building'
                          or b.railway='station'
                          or b.amenity='place_of_worship')
                          and ST_Intersects(b.way, a.way2)
          ) as buildings
        </Parameter>
    </Datasource>
</Layer>

<Layer name="tunnels" status="on" srs="&srs900913;">
    <StyleName>tunnels-core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,amenity from &prefix;_line where tunnel in ('yes','true','1') order by z_order) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="line features" status="on" srs="&srs900913;">
    <StyleName>barriers</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,barrier,"natural",man_made from &prefix;_line where barrier is not null or "natural" in ('hedge','cliff') or man_made is not null) as roads
        </Parameter>
    </Datasource>
</Layer>

<Layer name="driveways" status="on" srs="&srs900913;">
    <StyleName>driveways</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,railway,amenity,service,access,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel,
            case when bridge in ('yes','true','1') then 'yes'::text else bridge end as bridge
            from &prefix;_line
            where (highway = 'service'
            and service = 'driveway')
            order by z_order
            ) as driveways
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
            (select ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way,highway,railway,amenity,service,access,
            case when tunnel in ('yes','true','1') then 'yes'::text else tunnel end as tunnel,
            case when bridge in ('yes','true','1') then 'yes'::text else bridge end as bridge
            from &prefix;_line
            where (highway is not null
            and (tags->'footway' is null or (tags ->'footway' != 'sidewalk' and tags ->'footway' != 'crossing') or '&sidewalks;' = 'yes')
            and (tags->'cycleway' is null or (tags ->'cycleway' != 'sidewalk' and  tags ->'cycleway' != 'crossing') or '&sidewalks;' = 'yes')
            and (service is null or service !='driveway')
            and not (highway='footway' and access is not null and (access ='private' or access='no'))
            and (not (access is not null and (access ='private' or access='no')) or '&privroads;' = 'yes'))
            or railway is not null
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

