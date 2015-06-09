<Layer name="ocean" status="on" srs="&srs900913;">
    <StyleName>ocean</StyleName>
    <Datasource>
        <Parameter name="type">csv</Parameter>
        <Parameter name="inline">
            wkt|name
            POLYGON((-20037508.34 -20037508.34, -20037508.34 20037508.34, 20037508.34 20037508.34, 20037508.34 -20037508.34, -20037508.34 -20037508.34))|bounds
        </Parameter>
    </Datasource>
</Layer>

<Layer name="coast-line" status="on" srs="&srs900913;">
    <StyleName>coast-line</StyleName>
    <Datasource>
        <Parameter name="type">shape</Parameter>
        <Parameter name="file">&shapefiles;land-polygons-split-3857/land_polygons</Parameter>
    </Datasource>
</Layer>

<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        <Parameter name="type">shape</Parameter>
        <Parameter name="file">&shapefiles;land-polygons-split-3857/land_polygons</Parameter>
    </Datasource>
</Layer>

<Layer name="leisure" status="on" srs="&srs900913;">
    <StyleName>leisure</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,amenity,landuse,leisure,man_made,highway,"natural",power,tourism
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

<Layer name="graveyard_overprint" status="on" srs="&srs900913;">
    <StyleName>graveyard_overprint</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,amenity,landuse
            from &prefix;_polygon
            where (landuse in ('cemetery', 'grave_yard')
                or amenity = 'grave_yard')
            order by z_order,way_area desc
            ) as leisure
        </Parameter>
    </Datasource>
</Layer>

<Layer name="sports_grounds" status="on" srs="&srs900913;">
    <StyleName>sports_grounds</StyleName>
    <StyleName>sports_grounds_pitch</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">(select way,leisure from &prefix;_polygon where leisure in ('sports_centre','stadium', 'pitch') order by z_order,way_area desc) as sports_grounds</Parameter>
    </Datasource>
</Layer>

<Layer name="water_areas_casing" status="on" srs="&srs900913;">
    <StyleName>water_areas_casing</StyleName>
    <StyleName>marshes</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural",waterway,landuse,way_area
            from &prefix;_polygon
            where waterway in ('dock','mill_pond','riverbank','canal','river')
                or landuse in ('reservoir','water','basin')
                or "natural" in ('lake','water','land','wetland','marsh','glacier','pond')
            order by z_order,way_area desc
            ) as water_areas
        </Parameter>
    </Datasource>
</Layer>

<!--
<Layer name="water_lines_casing" status="on" srs="&srs900913;">
    <StyleName>water_lines_casing</StyleName>
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
-->

<Layer name="water_areas_core" status="on" srs="&srs900913;">
    <StyleName>water_areas_core</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural",waterway,landuse,way_area
            from &prefix;_polygon
            where waterway in ('dock','mill_pond','riverbank','canal','river')
                or landuse in ('reservoir','water','basin')
                or "natural" in ('lake','water','land','glacier','pond')
            order by z_order,way_area desc
            ) as water_areas
        </Parameter>
    </Datasource>
</Layer>

<Layer name="water_lines_core" status="on" srs="&srs900913;">
    <StyleName>water_lines_core</StyleName>
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

<Layer name="islands" status="on" srs="&srs900913;">
    <StyleName>islands</StyleName>
    <Datasource>
        &datasource-settings;
        <Parameter name="table">
            (select way,"natural" from &prefix;_polygon
            where "natural" in ('land', 'island')
		or "man_made" in ('pier')
            order by z_order,way_area desc) as land
        </Parameter>
    </Datasource>
</Layer>
