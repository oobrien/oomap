<Style name="land">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&white;" />
    </Rule>
</Style>

<Style name="coast-poly">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&blue50;" />
    </Rule>
</Style>

<Style name="water_areas">
    <Rule>
        &maxscale_zoom12;
        <Filter>&water_area;</Filter>
        <PolygonSymbolizer fill="&blue50;" gamma="0.8" />
    </Rule>
</Style>

<Style name="water_lines">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&blue50;" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom16;
        <LineSymbolizer stroke="&blue50;" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
 	    <Filter>not &tunnel;</Filter>
       &maxscale_zoom17;
        <LineSymbolizer stroke="&blue50;" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="bridges-casing">
    <Rule>
        &maxscale_zoom13;
        <Filter>&major_road;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="7.5" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; or &service_road;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="5" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="4.25" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; or &tram; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="6" />
    </Rule>
</Style>

<Style name="bridges-core">
    <Rule>
        &maxscale_zoom13;
        <Filter>&major_road;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="6" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; or &service_road;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="3.5" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="2.75" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; or &tram; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="4.5" />
    </Rule>
</Style>

<Style name="tunnels-core">
    <Rule>
        &maxscale_zoom12;
        <Filter>&major_road;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="3" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>&minor_road;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="1.5" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="0.75" stroke-dasharray="2,2" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>&service_road;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="0.75" stroke-dasharray="3,3" />
    </Rule>
</Style>

<Style name="trams-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&tram; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&tram; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="3" stroke-linejoin="round" />
    </Rule>
</Style>

<Style name="roads-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="4" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&railway; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.3" stroke-linejoin="round" />
    </Rule>
 </Style>

<Style name="trams-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&tram; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&tram; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.8" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
    </Rule>
</Style>
<Style name="driveways">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&driveway;" stroke-width="0.38" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <LineSymbolizer stroke="&driveway;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>
<Style name="roads-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&brown;" stroke-width="1" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&brown;" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; and not &tunnel; </Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.38" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&railway; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; and not &tunnel; and &rail; ='yes'</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.3" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="2.0" stroke-linejoin="round" stroke-dasharray="0,3,5,1" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.4" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>

<Style name="pavedareas">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&brown;" />
    </Rule>
</Style>

<Style name="islands">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
    </Rule>
</Style>

<Style name="leisure">
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'landfill' or [landuse] = 'construction' or [amenity] = 'school'</Filter>
        <PolygonSymbolizer fill="&magenta50;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'wood' or [landuse] = 'wood' or [landuse] = 'forest'</Filter>
        <PolygonSymbolizer fill="&green30;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'nature_reserve' or [landuse] = 'orchard'</Filter>
        <PolygonSymbolizer fill="&green30;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>([landuse] = 'cemetery' or [landuse] = 'grave_yard' or [amenity] = 'grave_yard')</Filter>
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[leisure] = 'common' or [leisure] = 'park' or [leisure] = 'recreation_ground' or [leisure] = 'golf_course' or [landuse] = 'sport' or [landuse] = 'recreational' or [landuse] = 'playground' or [leisure] = 'playground'</Filter>
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
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'field' or [natural] = 'crop' or [landuse] = 'farm' or [landuse] = 'farmland'</Filter>
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>[natural] = 'mud' or [natural] = 'beach' or [natural] = 'sand'</Filter>
        <PolygonSymbolizer fill="&yellow50;" gamma="0.6" />
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
        <Filter>&power; = 'yes'</Filter>
        <MarkersSymbolizer file="&symbols;/power.svg" placement="line" spacing="30" max-error="0.5" transform="scale(1.2)" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linecap="square" />
    </Rule>
</Style>

<Style name="cliffs">
     <Rule>
        &maxscale_zoom13;
        <Filter>[natural] = 'cliff'</Filter>
        <MarkersSymbolizer file="&symbols;/cliff.svg" placement="line" offset="1.4" spacing="3" max-error="0.5" />
        <LineSymbolizer stroke="&black;" stroke-width="2.0" stroke-linecap="square" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>[man_made] = 'embankment'</Filter>
        <MarkersSymbolizer file="&symbols;/embankment.svg" placement="line" offset="1.4" spacing="3" max-error="0.5" />
        <LineSymbolizer stroke="&brown100;" stroke-width="2.0" stroke-linecap="square" />
    </Rule>
</Style>

<Style name="barriers">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&hedges; = 'yes' and ([natural]='hedge' or [barrier] = 'hedge')</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="0.75" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>&hedges; = 'yes' and ([natural]='hedge' or [barrier] = 'hedge')</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="1.5" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom15;
        <Filter>&hedges; = 'yes' and ([natural]='hedge' or [barrier] = 'hedge')</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="2" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        <Filter>&hedges; = 'yes' and ([natural]='hedge' or [barrier] = 'hedge')</Filter>
        <LineSymbolizer stroke="&green100;" stroke-width="2.5" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&walls; = 'yes' and ([barrier] = 'citywall' or [barrier] = 'wall' or [barrier] = 'retaining_wall' or [barrier] = 'jersey_barrier' or [barrier] = 'yes')</Filter>
	<MarkersSymbolizer file="&symbols;/wall.svg" placement="line" spacing="8" max-error="0.5" transform="scale(0.6)" />
        <LineSymbolizer stroke="&black;" stroke-width="0.81" stroke-linecap="square" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&fences; = 'yes' and [barrier] = 'fence'</Filter>
	<MarkersSymbolizer file="&symbols;/fence.svg" placement="line" spacing="8" offset="1.0" max-error="0.5" transform="scale(0.6)"  />
        <LineSymbolizer stroke="&black;" stroke-width="0.79" stroke-linecap="square" />
    </Rule>
</Style>

<Style name="symbols" comp-op="darken">
    <Rule>
        &maxscale_zoom13;
        &minscale_zoom13;
        <Filter>&trees; = 'yes' and [natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree.svg" allow-overlap="true" transform="scale(0.15,0.15)" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>&trees; = 'yes' and [natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree.svg" allow-overlap="true" transform="scale(0.3,0.3)" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>&trees; = 'yes' and [natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree.svg" allow-overlap="true" transform="scale(0.4,0.4)" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
        &minscale_zoom16;
        <Filter>&trees; = 'yes' and [natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree.svg" allow-overlap="true" transform="scale(0.5,0.5)" />
    </Rule>
    <Rule>
        &maxscale_zoom17;
        <Filter>&trees; = 'yes' and [natural]='tree'</Filter>
        <PointSymbolizer file="&symbols;/tree.svg" allow-overlap="true" transform="scale(0.8,0.8)" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        &minscale_zoom14;
        <Filter>[historic]='monument'</Filter>
        <PointSymbolizer file="&symbols;/monument.svg" allow-overlap="true" transform="scale(0.3,0.3)" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>[historic]='monument'</Filter>
        <PointSymbolizer file="&symbols;/monument.svg" allow-overlap="true" transform="scale(0.4,0.4)" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
        &minscale_zoom16;
        <Filter>[historic]='monument'</Filter>
        <PointSymbolizer file="&symbols;/monument.svg" allow-overlap="true" transform="scale(0.6,0.6)" />
    </Rule>
    <Rule>
        &maxscale_zoom17;
        <Filter>[historic]='monument'</Filter>
        <PointSymbolizer file="&symbols;/monument.svg" allow-overlap="true" transform="scale(0.8,0.8)" />
    </Rule>
    <Rule>
        &maxscale_zoom15;
        &minscale_zoom15;
        <Filter>[amenity]='bench' or [leisure]='picnic_table' or [amenity]='waste_basket' or [amenity]='recycling'</Filter>
        <PointSymbolizer file="&symbols;/cross.svg" allow-overlap="true" transform="scale(0.5,0.5)" />
    </Rule>
    <Rule>
        &maxscale_zoom16;
        &minscale_zoom16;
        <Filter>[amenity]='bench' or [leisure]='picnic_table' or [amenity]='waste_basket' or [amenity]='recycling'</Filter>
        <PointSymbolizer file="&symbols;/cross.svg" allow-overlap="true" transform="scale(0.65,0.65)" />
    </Rule>
    <Rule>
        &maxscale_zoom17;
        <Filter>[amenity]='bench' or [leisure]='picnic_table' or [amenity]='waste_basket' or [amenity]='recycling'</Filter>
        <PointSymbolizer file="&symbols;/cross.svg" allow-overlap="true" transform="scale(0.8,0.8)" />
    </Rule>
</Style>
<Style name="buildings-core">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="#FEFEFE" gamma="0.0" />
    </Rule>
</Style>
