<Style name="ocean">
	<Rule>
		&maxscale_zoom12;
		<PolygonSymbolizer fill="&blue50;" />
	</Rule>
</Style>

<Style name="coast-poly">
	<Rule>
		&maxscale_zoom12;
	    <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
	</Rule>
</Style>

<Style name="bridges-casing">
	<Rule>
		&maxscale_zoom13;
		<Filter>&major_road;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="9" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&minor_road; or &service_road; or &track;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="7.2" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&path;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="4.75" stroke-linecap="butt" />
	</Rule>
	<Rule>
		&maxscale_zoom13;
		<Filter>&railway; or &tram;</Filter>
		<LineSymbolizer stroke="&black;" stroke-width="7" stroke-linecap="butt" />
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
        <LineSymbolizer stroke="&grey50;" stroke-width="3" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; or &service_road;</Filter>
        <LineSymbolizer stroke="&grey50;" stroke-width="2" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&grey50;" stroke-width="1" stroke-dasharray="3,2" />
    </Rule>
</Style>

<Style name="trams-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="3" stroke-linejoin="round" />
    </Rule>
</Style>

<Style name="roads-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.6" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="5.2" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="4" stroke-linejoin="round" />
    </Rule>
    <Rule>
       &maxscale_zoom12;
       &minscale_zoom13;
       <Filter>&railway; and not &tunnel;</Filter>
      <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="3" stroke-linejoin="round" />
    </Rule>
</Style>

<Style name="trams-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.8" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
    </Rule>
</Style>

<Style name="roads-core">
   <Rule>
       &maxscale_zoom12;
       &minscale_zoom13;
       <Filter>&major_road; and not &tunnel;</Filter>
       <LineSymbolizer stroke="&brown50;" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&brown50;" stroke-width="3.2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&brown50;" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&brown50;" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
     <Rule>
      <Filter>&service_road; and not &tunnel;</Filter>
      &maxscale_zoom14;
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.8" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.5" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2" stroke-linejoin="round" stroke-dasharray="0,5,2,4,2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="3,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="6,2" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>

<Style name="buildings">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&black;" gamma="0.6" />
    </Rule>
</Style>

<Style name="islands">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="leisure">
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'landfill' or [landuse] = 'construction'</Filter>
        <PolygonSymbolizer fill="&magenta50;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'wood' or [landuse] = 'wood' or [landuse] = 'forest'</Filter>
        <PolygonSymbolizer fill="&white;" gamma="0.6" />
    </Rule>
   <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'quarry'</Filter>
        <PolygonPatternSymbolizer file="&symbols;/quarry2.png" />
        <LineSymbolizer stroke="&grey50;" stroke-width="0.5" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'nature_reserve' or [landuse] = 'orchard'</Filter>
        <PolygonSymbolizer fill="&green30;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>([landuse] = 'cemetery' or [landuse] = 'grave_yard' or [amenity] = 'grave_yard')</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'garden' or [leisure] = 'common' or [leisure] = 'park' or [leisure] = 'recreation_ground' or [leisure] = 'golf_course' or [landuse] = 'sport' or [landuse] = 'recreational'</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'park' or [landuse] = 'meadow' or [landuse] = 'grass' or [landuse] = 'recreation_ground' or [landuse] = 'village_green' or [landuse] = 'green'</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'grass' or [natural] = 'grassland' or [natural] = 'meadow' or [tourism] = 'camp_site' or [tourism]='caravan_site' or [tourism] = 'picnic_site'</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'field' or [natural] = 'heath' or [landuse] = 'conservation'</Filter>
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
    </Rule>
   <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'scrub'</Filter>
        <PolygonPatternSymbolizer file="&symbols;/undergrowth.png" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'residential' or [landuse] ='commercial' or [landuse] = 'industrial' or [landuse] = 'retail'</Filter>
        <PolygonSymbolizer fill="&olive100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'school' or [amenity] = 'school' or [amenity] = 'college' or [amenity] = 'university' or [amenity] = 'hospital'</Filter>
        <PolygonSymbolizer fill="&olive100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'allotments' or [landuse] = 'military' or [landuse] = 'railway' or [landuse] = 'garden' or [tourism] = 'zoo'</Filter>
        <PolygonSymbolizer fill="&olive100;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'field' or [natural] = 'crop' or [landuse] = 'farm' or [landuse] = 'farmland'</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
        <PolygonPatternSymbolizer file="&symbols;/blackdot.png" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'mud' or [natural] = 'beach' or [natural] = 'sand'</Filter>
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
        <PolygonPatternSymbolizer file="&symbols;/sand.png" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[amenity] = 'parking' or [landuse] = 'playground' or [leisure] = 'playground' or [landuse] = 'farmyard' or [landuse] = 'parking' or [highway] = 'pedestrian' or [highway] = 'services'</Filter>
        <PolygonSymbolizer fill="&brown50;" gamma="0.6" />
        <LineSymbolizer stroke="&black;" stroke-width="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'track'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>

<Style name="graveyard_overprint">
    <Rule>
        &maxscale_zoom12;
        <PolygonPatternSymbolizer file="&symbols;/tomb.png" />
    </Rule>
</Style>

<Style name="water_areas_casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&water_area;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&water_area;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="water_lines_casing">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="1.9" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom13;
        <LineSymbolizer stroke="&black;" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom14;
        &minscale_zoom16;
        <LineSymbolizer stroke="&black;" stroke-width="4.6" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom17;
        <LineSymbolizer stroke="&black;" stroke-width="6.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="water_areas_core">
    <Rule>
        &maxscale_zoom12;
        <Filter>&water_area;</Filter>
        <PolygonSymbolizer fill="&blue50;" gamma="0.6" />
    </Rule>
</Style>

<Style name="water_lines_core">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&blue50;" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom13;
        <LineSymbolizer stroke="&blue50;" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
<Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom14;
        &minscale_zoom16;
        <LineSymbolizer stroke="&blue50;" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom17;
        <LineSymbolizer stroke="&blue50;" stroke-width="4.4" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="marshes">
    <Rule>
        &maxscale_zoom12;
        <Filter>([natural] = 'wetland' or [natural] = 'marsh')</Filter>
        <PolygonPatternSymbolizer file="&symbols;/marsh.png" />
    </Rule>
</Style>

<Style name="sports_grounds">
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'sports_centre' or [leisure] = 'stadium'</Filter>
        <PolygonSymbolizer fill="&black;" gamma="0.6" />
    </Rule>
</Style>

<Style name="sports_grounds_pitch">
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'pitch'</Filter>
        <PolygonSymbolizer fill="&yellow100;" gamma="0.6" />
    </Rule>
</Style>

<Style name="power">
    <Rule>
        &maxscale_zoom13;
        <LinePatternSymbolizer file="&symbols;/power.png" />
    </Rule>
</Style>

<Style name="cliffs">
     <Rule>
        &maxscale_zoom13;
        <Filter>[natural] = 'cliff'</Filter>
        <LinePatternSymbolizer file="&symbols;/cliff.png" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[man_made] = 'embankment'</Filter>
        <LinePatternSymbolizer file="&symbols;/embankment.png" />
    </Rule>
</Style>

<Style name="barriers">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="0.75" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="1.5" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>[natural]='hedge' or [barrier] = 'hedge'</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="3" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[barrier] = 'citywall' or [barrier] = 'wall' or [barrier] = 'retaining_wall' or [barrier] = 'jersey_barrier' or [barrier] = 'yes'</Filter>
        <LinePatternSymbolizer file="&symbols;/wall.png" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[barrier] = 'fence'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linecap="square" />
        <LinePatternSymbolizer file="&symbols;/fence.png" />
    </Rule>
</Style>

<Style name="coast-line">
    <Rule>
        &maxscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="0.8" />
    </Rule>
</Style>

<Style name="symbols">
    <Rule>
        &maxscale_zoom13;
        <Filter>[natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree2.png" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        <Filter>[historic]='monument'</Filter>
        <PointSymbolizer file="&symbols;/monument.png" />
    </Rule>
</Style>
