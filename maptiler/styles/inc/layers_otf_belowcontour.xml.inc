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

<Layer name="coast-poly" status="on" srs="&srs900913;">
    <StyleName>coast-poly</StyleName>
    <Datasource>
        <Parameter name="type">shape</Parameter>
        <Parameter name="file">&shapefiles;land-polygons-split-3857/land_polygons</Parameter>
    </Datasource>
</Layer>


<Layer name="below_contour" status="on" srs="+proj=latlong +datum=WGS84">
  <StyleName>leisure</StyleName>
  <StyleName>water_areas</StyleName>
  <StyleName>pavedareas</StyleName>
  <StyleName>water_lines</StyleName>
  <StyleName>tunnels-core</StyleName>
  <StyleName>barriers</StyleName>
  <StyleName>trams-casing</StyleName>
  <StyleName>trams-core</StyleName>
  <StyleName>roads-casing</StyleName>
  <StyleName>roads-core</StyleName>
  <StyleName>islands</StyleName>

    <Datasource>
      &datasource-settings-otf;
    </Datasource>
</Layer>
<!-- <Layer name="below_contour2" status="on" srs="+proj=latlong +datum=WGS84">

  <StyleName>main-roads-casing</StyleName>
  <StyleName>main-roads-core</StyleName>

    <Datasource>
      &datasource-settings-otf;
    </Datasource>
</Layer> -->
