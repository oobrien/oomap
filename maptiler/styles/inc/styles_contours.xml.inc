<Style name="contours_style" comp-op="darken">
    <Rule>
	<Filter>[length] &gt; 40 and [length] &lt; 200</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="0.5"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="20" max-error="0.5" transform="translate(0 -1.5) scale(0.5 0.4)" />
    </Rule>
   <Rule>
        <Filter>[length] &lt; 600 and [length] &gt;= 200</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="0.5"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="60" max-error="0.5" transform="translate(0 -1.5) scale(0.5 0.4)" />
    </Rule>
    <Rule>
        <Filter>[length] &gt;= 600</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="0.5"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="200" max-error="0.5" transform="translate(0 -1.5) scale(0.5 0.4)" />
    </Rule>
</Style>

<Style name="contours_style_major" comp-op="darken">
    <Rule>
        <Filter>[length] &gt; 40 and [length] &lt; 200</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="1.0"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="20" max-error="0.5" transform="translate(0 -1.5) scale(1.0 0.4)" />
    </Rule>
   <Rule>
        <Filter>[length] &lt; 600 and [length] &gt;= 200</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="1.0"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="60" max-error="0.5" transform="translate(0 -1.5) scale(1.0 0.4)" />
    </Rule>
    <Rule>
        <Filter>[length] &gt;= 600</Filter>
        <LineSymbolizer stroke="&contour;" stroke-width="1.0"/>
 <MarkersSymbolizer file="&symbols;/tick.svg" allow-overlap="false" placement="line" spacing="200" max-error="0.5" transform="translate(0 -1.5) scale(1.0 0.4)" />
    </Rule>
</Style>
