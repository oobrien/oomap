<Layer name="contours_layer_old" status="off" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
(
  SELECT ST_Rotate(h.way,&magn;, ST_Centroid(&box;)) as way, ST_Length(h.way) as length
  FROM
  (
    SELECT (ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom as way
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, &box;))).geom as way
      FROM all_lidar
      WHERE (height*2)::integer % (10* &contourSeparation; )::integer != 0
      AND  (height*2)::integer % (2* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,&box;)
    ) as g
  ) as h
) as "cntrs10"
            </Parameter>
        </Datasource>
    </Layer>

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
)

 SELECT ST_Difference(ST_SetSRID(ST_Rotate(h.way,&magn;, ST_Centroid(&box;)),3857), ST_Union(w.way)) as way, ST_Length(h.way) as length
  FROM
  (
    SELECT (ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom as way
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, &box;))).geom as way
      FROM all_lidar
      WHERE (height*2)::integer % (10* &contourSeparation; )::integer != 0
      AND  (height*2)::integer % (2* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,&box;)
    ) as g
  ) as h, wetstuff w
  group by h.way
) as "cntrs10"
            </Parameter>
        </Datasource>
    </Layer>


<Layer name="contours_layer_major" status="on" srs="&srs900913;">
    <StyleName>contours_style_major</StyleName>
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
)

 SELECT ST_Difference(ST_SetSRID(ST_Rotate(h.way,&magn;, ST_Centroid(&box;)),3857), ST_Union(w.way)) as way, ST_Length(h.way) as length
  FROM
  (
    SELECT (ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom as way
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, &box;))).geom as way
      FROM all_lidar
      WHERE (height*2)::integer % (10* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,&box;)
    ) as g
  ) as h, wetstuff w
  group by h.way
) as "cntrs50"
            </Parameter>
        </Datasource>
    </Layer>
