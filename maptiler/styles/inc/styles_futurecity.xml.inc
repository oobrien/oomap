<Style name="ocean">
    <Rule>
        &maxscale_zoom4;
        <PolygonSymbolizer fill="&water;" />
    </Rule>
</Style>

<Style name="coast-poly">
    <Rule>
        &maxscale_zoom4;
        <PolygonSymbolizer fill="&background;" gamma="0.8" />
    </Rule>
  </Style>

<Style name="parkareas">
    <Rule>
        &maxscale_zoom7;
        <Filter>&park_area;</Filter>
        <PolygonSymbolizer fill="&grass;" gamma="0.8" />
    </Rule>
</Style>

<Style name="waterareas">
    <Rule>
        &maxscale_zoom4;
        <Filter>&water_area;</Filter>
        <PolygonSymbolizer fill="&water;" gamma="0.8" />
    </Rule>
</Style>

 <Style name="waterlines">
    <Rule>
        &maxscale_zoom10;
        &minscale_zoom10;
        <LineSymbolizer stroke="&water;" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom11;
        <LineSymbolizer stroke="&water;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="roadscasing">
    <Rule>
        &maxscale_zoom11;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&raildark;" stroke-width="2.5" stroke-linejoin="round" />
    </Rule>
 </Style>

<Style name="roadscore">
     <Rule>
        &maxscale_zoom9;
        &minscale_zoom9;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="0.6" stroke-linejoin="round" />
    </Rule>
      <Rule>
        &maxscale_zoom10;
        &minscale_zoom10;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="1" stroke-linejoin="round" />
    </Rule>
   <Rule>
        &maxscale_zoom10;
        &minscale_zoom11;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="2" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom10;
        &minscale_zoom11;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="0.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
         &maxscale_zoom14;
         <Filter>&major_road; and not &tunnel;</Filter>
         <LineSymbolizer stroke="&roads;" stroke-width="6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>[highway] = 'tertiary' and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&minor_road; and [highway] != 'tertiary' and not &tunnel;</Filter>
        <LineSymbolizer stroke="&roads;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
        &maxscale_zoom9;
        &minscale_zoom10;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&raillight;" stroke-width="1.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&raildark;" stroke-width="1.4" stroke-linejoin="round" stroke-dasharray="0,3,6,1" />
    </Rule>
   <Rule>
        &maxscale_zoom11;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&raillight;" stroke-width="1.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&raildark;" stroke-width="2.0" stroke-linejoin="round" stroke-dasharray="0,3,6,1" />
    </Rule>
</Style>

<Style name="bridges">
    <Rule>
        &maxscale_zoom9;
        &minscale_zoom10;
        <Filter>&major_road; and &bridge;</Filter>
        <LineSymbolizer stroke="&bridgeedge;" stroke-width="0.3" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom10;
        <Filter>&major_road; and &bridge;</Filter>
        <LineSymbolizer stroke="&bridgeedge;" stroke-width="0.7" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom10;
        <Filter>&minor_road; and &bridge;</Filter>
        <LineSymbolizer stroke="&bridgeedge;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom11;
        <Filter>&railway; and &bridge;</Filter>
        <LineSymbolizer stroke="&raillight;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&raildark;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
</Style>

<Style name="stations">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>[railway]='station'</Filter>
        <PointSymbolizer file="&symbols;station_s.png" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[railway]='station'</Filter>
        <PointSymbolizer file="&symbols;station_m.png" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[railway]='halt' or [railway]='tram_stop'</Filter>
        <PointSymbolizer file="&symbols;station_s.png" />
     </Rule>
 </Style>

 <!-- PLACE NAMES -->

<Style name="stationstext">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>[railway]='station'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[railway]='station'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[railway]='halt' or [railway]='tram_stop'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0">[name]</TextSymbolizer>
    </Rule>
 </Style>

<Style name="city">
     <Rule>
        &maxscale_zoom7;
        &minscale_zoom7;
        <Filter>[place] = 'city' or [place] = 'metropolis'</Filter>
        <TextSymbolizer face-name="&title-font;" size="14" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="10">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom8;
        &minscale_zoom8;
        <Filter>[place] = 'city' or [place] = 'metropolis'</Filter>
        <TextSymbolizer face-name="&title-font;" size="16" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="10">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom9;
        &minscale_zoom9;
        <Filter>[place] = 'city' or [place] = 'metropolis'</Filter>
        <TextSymbolizer face-name="&title-font;" size="18" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="10" character-spacing="10" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom10;
        <Filter>[place] = 'city' or [place] = 'metropolis'</Filter>
        <TextSymbolizer face-name="&title-font;" size="30" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="10" character-spacing="10" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
</Style>

<Style name="town">
    <Rule>
        &maxscale_zoom10;
        <Filter>[place] = 'town' or [place] = 'large_town' or [place] = 'small_town'</Filter>
        <TextSymbolizer face-name="&title-font;" size="18" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="10" character-spacing="5" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
</Style>

<Style name="suburb">
    <Rule>
        &maxscale_zoom10;
        &minscale_zoom11;
        <Filter>[place] = 'suburb'</Filter>
        <TextSymbolizer face-name="&title-font;" size="12" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0" character-spacing="5" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom11;
        <Filter>[place] = 'suburb'</Filter>
        <TextSymbolizer face-name="&title-font;" size="13" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0" character-spacing="5" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
</Style>

<Style name="village">
    <Rule>
        &maxscale_zoom11;
        <Filter>[place] = 'village' or [place] = 'large_village'</Filter>
        <TextSymbolizer face-name="&title-font;" size="10" fill="&words;" halo-radius="1" halo-fill="&halo;" wrap-width="0" text-transform="uppercase">[name]</TextSymbolizer>
    </Rule>
</Style>

 <!-- ROADS TEXT -->

<Style name="roads-text">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>[highway] = 'trunk' or [highway] = 'primary'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&roadwords;" halo-radius="1" halo-fill="&roadhalo;" placement="line">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>[highway] = 'trunk' or [highway] = 'primary' or [highway] = 'secondary'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&roadwords;" halo-radius="1" halo-fill="&roadhalo;" placement="line">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>[highway] = 'trunk' or [highway] = 'primary' or [highway] = 'secondary'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="9" fill="&roadwords;"  halo-radius="1" halo-fill="&roadhalo;" placement="line">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>[highway] = 'tertiary'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="8" fill="&roadwords;" halo-radius="1" halo-fill="&roadhalo;" placement="line">[name]</TextSymbolizer>
    </Rule>
    <Rule>
        &maxscale_zoom15;
        <Filter>[highway] = 'tertiary' or [highway] = 'residential' or [highway] = 'unclassified'</Filter>
        <TextSymbolizer face-name="&standard-font;" size="9" fill="&roadwords;" halo-radius="1" halo-fill="&roadhalo;" placement="line">[name]</TextSymbolizer>
    </Rule>
</Style>
