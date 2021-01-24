<Style name="ocean">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&black;" />
    </Rule>
</Style>  

<Style name="coast-poly">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&black;" />
    </Rule>
</Style>

<Style name="water_areas">
    <Rule>
        &maxscale_zoom12;
        <Filter>&water_area;</Filter>
        <PolygonSymbolizer fill="&black;" gamma="0.8" />
    </Rule>
</Style>

<Style name="water_lines">
    <Rule>
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom12;
        &minscale_zoom12;
        <LineSymbolizer stroke="&black;" stroke-width="2.25" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule> 
	    <Filter>not &tunnel;</Filter>
        &maxscale_zoom13;
        &minscale_zoom16;
        <LineSymbolizer stroke="&black;" stroke-width="3.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
 	    <Filter>not &tunnel;</Filter>
       &maxscale_zoom17;
        <LineSymbolizer stroke="&black;" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
</Style>

<Style name="islands">
    <Rule>
        &maxscale_zoom12;
        <PolygonSymbolizer fill="&black;" gamma="0.6" />
    </Rule>
</Style>

<Style name="roads-casing">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="4.5" stroke-linejoin="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="7.5" stroke-linejoin="round" />
    </Rule>
    <!-- 
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
    </Rule> -->
 </Style>
<Style name="roads-core">
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom13;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom14;
        <Filter>&major_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&black;" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.75" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&minor_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&service_road; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.0" stroke-linejoin="round" stroke-linecap="round" />
    </Rule>
    
    <!--
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="1.5" stroke-linejoin="round" stroke-dasharray="1,1,1,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&railway; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="3" stroke-linejoin="round" stroke-dasharray="1,1,1,1" />
    </Rule>
    -->
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&track; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
    <Rule>
        &maxscale_zoom12;
        &minscale_zoom12;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.5" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="2,1" />
    </Rule>
    <Rule>
        &maxscale_zoom13;
        <Filter>&path; and not &tunnel;</Filter>
        <LineSymbolizer stroke="&white;" stroke-width="0.8" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="4,2" />
    </Rule>
</Style>


