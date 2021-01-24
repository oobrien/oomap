<Style name="ocean">
	<Rule>
		&maxscale_zoom12;
		<LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linecap="butt" />
	</Rule>
</Style>

<Style name="coast-poly">
	<Rule>
		&maxscale_zoom12;
		<LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linecap="butt" />
	</Rule>
</Style>

<Style name="bridges-casing">
	<Rule>
		&maxscale_zoom13;
		<Filter>&major_road;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="7.6" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&minor_road; or &service_road; or &track;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="5.8" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&path;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="3.35" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&railway; or &tram;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="5.6" stroke-linecap="butt" />
	</Rule>
</Style>

<Style name="bridges-core">
    <Rule>
        &maxscale_zoom13;
        <Filter>&major_road;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="7" stroke-linecap="butt" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; or &service_road; or &track;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="5.2" stroke-linecap="butt" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&path;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="2.75" stroke-linecap="butt" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; or &tram;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="5" stroke-linecap="butt" />
    </Rule>
</Style>

<Style name="tunnels-core">
    <Rule>
        &maxscale_zoom12;
        <Filter>&major_road;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; or &service_road;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-dasharray="3,2" />
    </Rule>
</Style>

<Style name="trams-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" />
    </Rule>
</Style>

<Style name="roads-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.2" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="3.8" stroke-linejoin="round" />
    </Rule>
     <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="5.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
        &minscale_zoom16;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="8" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom17;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="10.6" stroke-linejoin="round" />
    </Rule>
     <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="4.1" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
         &minscale_zoom16;
       <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="6.6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom17;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="9.6" stroke-linejoin="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom15;
        &minscale_zoom15;
        <LineSymbolizer stroke="&black;" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom16;
        &minscale_zoom16;
        <LineSymbolizer stroke="&black;" stroke-width="4.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom17;
        <LineSymbolizer stroke="&black;" stroke-width="6.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
       &maxscale_zoom12;
       &minscale_zoom13;
       <Filter>&railway; and not &tunnel;</Filter>
      <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" />
    </Rule>
</Style>

<Style name="trams-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
    </Rule>
</Style>

<Style name="roads-core">
   <Rule>
       &maxscale_zoom12;
       &minscale_zoom13;
       <Filter>&major_road; and not &tunnel;</Filter>
       <LineSymbolizer stroke="&white;" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
       <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="4.9" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
         &minscale_zoom16;
       <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="7.4" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
        &maxscale_zoom17;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="10" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
  <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
        &maxscale_zoom16;
        &minscale_zoom16;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
      <Rule>
        &maxscale_zoom17;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom14;
        &minscale_zoom14;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom15;
        &minscale_zoom15;
        <LineSymbolizer stroke="&white;" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom16;
        &minscale_zoom16;
        <LineSymbolizer stroke="&white;" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom17;
        <LineSymbolizer stroke="&white;" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
   <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-dasharray="0,5,2,4,2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="3,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="6,2" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>

<Style name="buildings">
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom14;
        <PolygonSymbolizer fill="&white;" gamma="1.0" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="islands">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="leisure">
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'landfill' or [landuse] = 'construction'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'wood' or [landuse] = 'wood' or [landuse] = 'forest'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
   <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'quarry'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.5" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'nature_reserve' or [landuse] = 'orchard'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>([landuse] = 'cemetery' or [landuse] = 'grave_yard' or [amenity] = 'grave_yard')</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'garden' or [leisure] = 'common' or [leisure] = 'park' or [leisure] = 'recreation_ground' or [leisure] = 'golf_course' or [landuse] = 'sport' or [landuse] = 'recreational'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'park' or [landuse] = 'meadow' or [landuse] = 'grass' or [landuse] = 'recreation_ground' or [landuse] = 'village_green' or [landuse] = 'green'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'grass' or [natural] = 'grassland' or [natural] = 'meadow' or [tourism] = 'camp_site' or [tourism]='caravan_site' or [tourism] = 'picnic_site'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'field' or [natural] = 'heath' or [landuse] = 'conservation'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'residential' or [landuse] ='commercial' or [landuse] = 'industrial' or [landuse] = 'retail'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'school' or [amenity] = 'school' or [amenity] = 'college' or [amenity] = 'university' or [amenity] = 'hospital'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'allotments' or [landuse] = 'military' or [landuse] = 'railway' or [landuse] = 'garden' or [tourism] = 'zoo'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'field' or [natural] = 'crop' or [landuse] = 'farm' or [landuse] = 'farmland'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'mud' or [natural] = 'beach' or [natural] = 'sand'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
     </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[amenity] = 'parking' or [landuse] = 'playground' or [leisure] = 'playground' or [landuse] = 'farmyard' or [landuse] = 'parking' or [highway] = 'pedestrian' or [highway] = 'services'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'track'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>

<Style name="water_areas_casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&water_area;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&water_area;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<!--
<Style name="water_lines_casing">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="butt" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom13;
        <LineSymbolizer stroke="&black;" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="butt" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom14;
        &minscale_zoom16;
        <LineSymbolizer stroke="&black;" stroke-width="4.6" stroke-linejoin="round" stroke-linecap="butt" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom17;
        <LineSymbolizer stroke="&black;" stroke-width="6.0" stroke-linejoin="round" stroke-linecap="butt" />
    </Rule>
</Style>
-->

<Style name="water_areas_core">
    <Rule>
        &maxscale_zoom12;
        <Filter>&water_area;</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
</Style>


<Style name="water_lines_core">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom13;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
<Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom14;
        &minscale_zoom16;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom17;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="sports_grounds">
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'sports_centre' or [leisure] = 'stadium'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.3" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="sports_grounds_pitch">
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'pitch'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="barriers">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[barrier] = 'fence'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.3" stroke-linecap="square" />
    </Rule>
</Style>

<Style name="coast-line">
    <Rule>
        &maxscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="0.3" />
    </Rule>
</Style>

