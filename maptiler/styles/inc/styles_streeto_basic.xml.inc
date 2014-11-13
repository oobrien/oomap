<Style name="ocean">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&blue50;" />
    </Rule>
</Style>  

<Style name="coast-poly">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&white;" />
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
        <Filter>&railway; or &tram;</Filter>
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
        <Filter>&railway; or &tram;</Filter>
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
        <Filter>&minor_road; or &service_road;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="1.5" stroke-dasharray="3,3" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        <Filter>&track; or &path;</Filter>
        <LineSymbolizer stroke="&grey;" stroke-width="0.75" stroke-dasharray="2,2" />
    </Rule>
</Style>

<Style name="trams-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
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
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.3" stroke-linejoin="round" />
    </Rule>
 </Style>

<Style name="trams-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&tram; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.8" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="2.5" stroke-linejoin="round" stroke-dasharray="0,5,8,1" />
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
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.9" stroke-linejoin="round" />
        <LineSymbolizer stroke="&black;" stroke-width="1.0" stroke-linejoin="round" stroke-dasharray="0,2,4,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; and not &tunnel;</Filter>
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

<Style name="leisure">
    <Rule>
        &maxscale_zoom12;
        <Filter>[landuse] = 'landfill' or [landuse] = 'construction'</Filter>
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

