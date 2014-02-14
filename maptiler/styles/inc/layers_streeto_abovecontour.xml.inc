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
            (select way,highway,railway,amenity,layer,bridge,tunnel
            from &prefix;_line
            where (highway is not null
                or railway is not null)
                and bridge in ('yes','true','1')
            order by z_order
            ) as roads
        </Parameter>
    </Datasource>
</Layer>

