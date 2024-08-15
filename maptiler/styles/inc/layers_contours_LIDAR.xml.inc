<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
    <Datasource>
        &datasource-settings-contours;
        <Parameter name="table">
(
WITH wetstuff as (
  SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way from water WHERE ST_Intersects(way,&box3857;)
  UNION ALL
  SELECT ST_Rotate(ST_Intersection(way, &box3857;),&magn;, ST_Centroid(&box3857;)) as way
  FROM &prefix;_polygon
  WHERE landuse in ('reservoir','water','basin') or "natural" in ('lake','water') or "water" = 'yes'
  UNION ALL 
  SELECT ST_SetSRID(ST_GeomFromText('CIRCULARSTRING(0 2, -1 1,0 0, 0.5 0, 1 0, 2 1, 1 2, 0.5 2, 0 2)'),3857) as way
)

 SELECT COALESCE(ST_Difference(h.way, ST_Union(w.way)),h.way) as way,
  ST_Length(h.way) as length,
  ((h.height*2)::integer % (10* &contourSeparation; )::integer = 0) as major
  FROM
  (
    SELECT ST_SetSRID(ST_Rotate((ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom,&magn;, ST_Centroid(&box;)),3857) as way, g.height as height
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, &box;))).geom as way, height
      FROM all_lidar
      WHERE (height*2)::integer % (2* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,&box;)
    ) as g
     group by g.height
  ) as h, wetstuff w
  group by h.way, h.height
) as "contours"
        </Parameter>
    </Datasource>
</Layer>

