<Layer name="contours_layer" status="on" srs="&srs900913;">
    <StyleName>contours_style</StyleName>
        <Datasource>
            &datasource-settings-contours;
            <Parameter name="table">
(
  SELECT h.way as way, ST_Length(h.way) as length
  FROM
  (
    SELECT (ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom as way
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, !bbox!))).geom as way
      FROM all_lidar
      WHERE (height*2)::integer % (10* &contourSeparation; )::integer != 0
      AND  (height*2)::integer % (2* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,!bbox!)
    ) as g
  ) as h
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
  SELECT h.way as way, ST_Length(h.way) as length
  FROM
  (
    SELECT (ST_Dump(ST_LineMerge(ST_collect(g.way)))).geom as way
    FROM
    (
      SELECT (ST_Dump(ST_Intersection(way, !bbox!))).geom as way
      FROM all_lidar
      WHERE (height*2)::integer % (10* &contourSeparation; )::integer = 0
      AND ST_Intersects(way,!bbox!)
    ) as g
  ) as h
) as "cntrs50"
            </Parameter>
        </Datasource>
    </Layer>
