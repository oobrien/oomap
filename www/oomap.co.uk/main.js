
import $ from 'jquery';
import  'jquery-ui-dist/jquery-ui';
import './lib/jquery.knob.js';
import './lib/jquery.jqprint-0.31.js';
import Proj4 from 'proj4';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import GeoImageLayer from 'ol-ext/layer/GeoImage';
import VectorSource from 'ol/source/Vector';
import Static from 'ol/source/ImageStatic';
import Feature from 'ol/feature';
import {OSM, XYZ} from 'ol/source';
import Select from 'ol/interaction/Select';
import {Fill, Stroke, Style, Text, Circle, RegularShape} from 'ol/style';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import * as olProj from 'ol/proj';
import { DragRotateAndZoom, Translate, DragAndDrop, defaults as defaultInteractions,} from 'ol/interaction';
import GPX from 'ol/format/GPX';
import GeoJSON from 'ol/format/GeoJSON';
import {Point, Polygon, LineString} from 'ol/geom';
import {fromExtent as PolyFromExtent} from 'ol/geom/Polygon';
import {getDistance, getLength} from 'ol/sphere';
import GeoImage from 'ol-ext/source/GeoImage';
import SearchNominatim from 'ol-ext/control/SearchNominatim';
import Overlay from 'ol/Overlay';
import './lib/jquery-ui.min.css';
import 'ol/ol.css';
import './style.css';
import 'ol-ext/dist/ol-ext.css';

Proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");

var debug = false;

//Site-specific constants - change these as required:
var prefix1 = "https://tile.dna-software.co.uk/";
var prefix2 = "https://tile.dna-software.co.uk/";
var prefix3 = "https://tile.dna-software.co.uk/";
var defaultMapTitle = "OpenOrienteeringMap";
var defaultRaceDescription = "Race instructions";

//var apiServer = "https://overpass-api.de/api/interpreter";
var apiServer = "https://overpass.kumi.systems/api/interpreter";

var currentID = null;
var currentNumber = null;
var topID = 0;  //assign features unique ids starting from 0 (start = "S", finish = "F")
var topNumber = 0; //assign controls unique numbers
var batchNumber = 0;  //control property describing which batch it was added as, to allow batch delete

var rotAngle = 0;
var magDec = null; //magnetic declination for map centre
const hitTol = 8;	//pixel tolerance when selecting map features

var mapTitle = defaultMapTitle;
var mapTitleDisplay = mapTitle;
var raceDescription = defaultRaceDescription;
var mapStyleID = "streeto-NONE-0";
var mapStyleIDOnSource;
var paper;
var paper_pieces = [];
var scale;
var trueScale = 10000;  //scale corrected for latitude, with sensible initial default
var tips;
var eventdate = "";
var fontSizeFromArr;
var mapID = "new";
var reqMapID = "new";
var select;
var contourSeparation;
var previewWarning = true;

var dpi=150;  //advanced rendering options & defualt values
var drives=false;
var rail=true;
var walls=true;
var grid=true;
var trees=true;
var hedges=true;
var fences=true;
var linear=false;
var preview=false;

//OpenLayers single-instance objects
var olMap;
var args;
var layerMapnik;
var layerOrienteering;
var layerMapBorder;
var layerMapCentre;
var layerMapSheet;
var layerMapTitle;
var layerMapContent;
var layerControls;
var layerGPX;
var layerLines;
var layerPreview;
var titleFeature;
var sheetCentreLL;
var newControlLL = [0, 0];
var mapBound;
var wgs84Poly;
var purple = 'rgba(220, 40, 255, 1)';

const container = document.getElementById('popup');
const overlayContent = document.getElementById('popup-content');
const overlay = new Overlay({
  element: container,
  autoPan: {
    animation: {
      duration: 250,
    },
  },
});

var state = "initialzoom";
var controloptstate = "add";

let dragAndDropInteraction;

function setInteraction() {
  if (dragAndDropInteraction) {
    olMap.removeInteraction(dragAndDropInteraction);
  }
  dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [GPX, ],
  });
  dragAndDropInteraction.on('addfeatures', function (event) {
    layerGPX.getSource().addFeatures(event.features);
    event.features.forEach(function(f) {
       if (f.getGeometry().getType() != 'Point') {
         f.setStyle(gpxStyle(f));
         f.set('description', f.get('name'));
       }
       else {
         f.setStyle([new Style({  image: new Circle({
              stroke: new Stroke({
                color: "blue",
                width: 1.75
              }),
              radius: 5
            })})]);
       }
     });
    olMap.getView().fit(layerGPX.getSource().getExtent());
    $( "#deleteMarkers" ).button("enable");
  });
  olMap.addInteraction(dragAndDropInteraction);
}

function controlStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
  var type = feature.getProperties().type;
  var startAngle = 0;
  var listC = getSortedControls("c_regular");
  var listS = getSortedControls("c_startfinish");
  if (linear && listS.length > 0 && listC.length > 0) {
    startAngle = Math.atan2(listS[0].lat - listC[0].lat, listC[0].lon - listS[0].lon) - Math.PI/6 + rotAngle;
  }

  switch(type)
  {
  case "c_regular": //control - circle & number.    Transparent fill allows selection throughout
    return [
    	new Style({
    		image: new Circle ({
    			stroke: new Stroke({color: purple, width: 10 * size}),
          fill: new Fill({color: 'rgba(255, 255, 255, 0)'}),
    			radius: 75 * size
    		}),
    		text: new Text({
    			  textAlign: "center",
    			  font: 120 * size + "px arial, verdana, sans-serif",
    			  text: feature.get('number'),
    			  fill: new Fill({color: purple}),
    			  offsetX:  5 * size * 35 * Math.sin((feature.get('angle')*Math.PI)/180 + olMap.getView().getRotation()),
    			  offsetY:  5 * size * -35 * Math.cos((feature.get('angle')*Math.PI)/180 + olMap.getView().getRotation())
    		})
    	}),
      new Style({
        image: new Circle({
          fill: new Fill({ color: purple}),
          radius: 10 * size
        })
    })]
  break;
  case "c_startfinish": //start/finish - triangle & double circle
    var boolFinish = layerControls.getSource().getFeatures().filter(feat=>feat.get('type')=='c_finish').length > 0 ;
    if (boolFinish) //If a finish exists, just draw a triangle. Otherwise add finish circles.
    {
      return [
    		new Style({
    			image: new RegularShape({
    				points: 3,
    				stroke: new Stroke({color: purple, width: 10 * size}),
            fill: new Fill({color: 'rgba(255, 255, 255, 0)'}),
            angle: startAngle,
    				radius: 110 * size
    			})
    		})]
    }
    else
    {
      return [
        new Style({
          image: new RegularShape({
            points: 3,
            stroke: new Stroke({color: purple, width: 10 * size}),
            angle: startAngle,
            radius: 110 * size
          })
        }),
        new Style({
          image: new Circle({
            stroke: new Stroke({color: purple, width: 10 * size}),
            radius: 70 * size
          })
        }),
        new Style({
          image: new Circle({
            stroke: new Stroke({color: purple, width: 10 * size}),
            fill: new Fill({color: 'rgba(255, 255, 255, 0)'}),
            radius: 90 * size
        })
      })]
    }
    break;
    case "c_finish": //finish - double circle
      return [
    		new Style({
    			image: new Circle({
    				stroke: new Stroke({color: purple, width: 10 * size}),
    				radius: 70 * size
    			})
    		}),
    		new Style({
    			image: new Circle({
    				stroke: new Stroke({color: purple, width: 10 * size}),
            fill: new Fill({color: 'rgba(255, 255, 255, 0)'}),
    				radius: 90 * size
        })
    	})]
      break;
    case "c_cross": //text "X"
      return [
    	new Style({
    		text: new Text({
    			  textAlign: "center",
    				baseAlign: "middle",
    			  font: "bold " + 90 * size + "px arial, verdana, sans-serif",
    			  text: "X",
    			  fill: new Fill({color: purple}),
    			  offsetX: 0,
    			  offsetY: 0
    		})
    	})]
    break;
    case "c_crossingpoint": //text "]["
      return [
    		new Style({
    			text: new Text({
    				  textAlign: "center",
    				  baseAlign: "middle",
    				  font: 90 * size + "px arial, verdana, sans-serif",
    				  text: "][",
    				  fill: new Fill({color: purple}),
    				  offsetX: 0,
    				  offsetY: 0,
    				  rotation: feature.get('angle')*Math.PI/180 + olMap.getView().getRotation()
    			})
    		})]
      break;
  }
};


function lineStyle(feature, resolution) //Lines between controls
{
  const geometry = feature.getGeometry();
  var size = trueScale/(resolution * 16000);
  const styles = [];
  geometry.forEachSegment(function (start, end) {
     styles.push(
       new Style({
           stroke: new Stroke({
             color: purple,
             width: 10 * size,
           })
         }),
       )
     });
   return styles;
};

//var dotStyle = new Style({
//});

var marginStyle = new Style({
	fill: new Fill({ color: [255, 255, 255, 1]})
});

var sheetStyle = new Style({  //css will add a compositing option to this white box
	fill: new Fill({ color: [255, 255, 255, 1]})
});

function titleStyle(feature, resolution)
{
	var size = trueScale/(resolution * 16000);
	return [
	 new Style({
		text: new Text({
			text: feature.get('mapTitleDisplay'),
			textAlign: "left",
			textBaseline: "middle",
      fill: new Fill({color: 'rgba(0,0,0,1)'}),
			font: "italic " + 150 * size + "px arial, verdana, sans-serif",
      offsetX: feature.get('xoff'),
      offsetY: feature.get('yoff'),
		})
	})
]};

function markerStyle(feature)
{
  if (feature.getGeometry().getType() == 'Point') {
    var markerColor;
    switch(feature.get('description').substring(0,4)) {
    case 'Post':
      markerColor = '#FF0000';
      break;
    case 'Lamp':
      markerColor = '#FFFF22';
      break;
    case 'Plaq':
      markerColor = '#0000CC';
      break;
    case 'Benc':
      markerColor = '#000000';
      break;
    case 'Cont':
      markerColor = '#DD22FF';
      break;
    default:
      markerColor = '#3399CC';
  }

    var fill = new Fill({
       color: markerColor + '40'
     });
     var stroke = new Stroke({
       color: markerColor,
       width: 1.75
     });
     return [
       new Style({
        image: new Circle({
           fill: fill,
           stroke: stroke,
           radius: 5
         }),
         fill: fill,
         stroke: stroke
       })
     ]
 }
 //No need to do linestring styling here - GPX styling is applied on load.
 else {
 }
};

function gpxStyle(feature) {
  var type = feature.getGeometry().getType();
  var lineStrings = [];
  var styles = [];
  if (type === "LineString") {
    lineStrings = [feature.getGeometry()];
  } else if (type === "MultiLineString") {
    lineStrings = feature.getGeometry().getLineStrings();
  }
  lineStrings.forEach(function (lineString) {
    var coordinates = lineString.getCoordinates();
    var boolSpeed = lineString.layout == "XYZM";  //Check that GPX data is time-stamped
    for (var i = 0; i < coordinates.length - 1; i++) {    //calc distance travelled, divide by time taken
      if(boolSpeed) {
        var speed = getLength(new LineString([coordinates[i],coordinates[i+1]], lineString.layout))/ (coordinates[i+1][3] - coordinates[i][3]);
        var hue = 220 + speed * 60; //range of 0 - 10 mph
        if (hue > 480) { hue = 480; }
        if (hue > 360) { hue -= 360; }
      }
      else { hue = 230; } //If no time column in GPX, set hue to blue
      var color = "hsl(" + hue + ", 100%, 50%)";

      styles.push(
        new Style({
          geometry: new LineString(coordinates.slice(i, i + 2)),
          stroke: new Stroke({
            color: color,
            width: 3
          })
        })
      );
    }
  });
  return styles;
}

var contentStyle = new Style({
   fill: new Fill({ color: [200, 200, 200, 0.3]})
});

var centreStyle = new Style({
	image: new Circle({
		stroke: new Stroke({color: 'rgba(0,0,255,1)', width: 1}),
		fill: new Stroke({color: 'rgba(0,0,255,0.5)'}),
		radius: 5
	})
});

var keys = ['unused', 'mapID', 'mapStyleID', 'zoom', 'lon', 'lat'];
args = [];

function setDefaults()
{
	/* Specified by user in URL. */
	var hash = window.location.hash;

	if (hash.length > 0)
	{
		var elements = hash.split('#');
		var pieces = elements[1].split('/');
		for(var i = 0; i < keys.length; i++)
		{
			if (pieces[i])
			{
				args[keys[i]] = pieces[i];
			}
		}
		if (args['zoom']) { args['zoom'] = parseInt(args['zoom']); }
		if (args['lon']) { args['lon'] = parseFloat(args['lon']); }
		if (args['lat']) { args['lat'] = parseFloat(args['lat']); }
	}
}

/* Initialisation */

function init()
{
	$( "#mapstyle" ).controlgroup();

	$( "#mapscale" ).controlgroup();
	$( "#papersize" ).controlgroup();
	$( "#paperorientation" ).controlgroup();

	$( "#contours" ).controlgroup();

	$( "#portrait" ).button( { icons: {primary: 'ui-icon-document'} } );
	$( "#landscape" ).button( { icons: {primary: 'ui-icon-document-b'} } );

	$( "#c_type" ).controlgroup();
	$( "#c_score" ).controlgroup();

	$( "#mapstyle input[type=radio]" ).on('change', handleStyleChange);
	$( "#mapscale input[type=radio]" ).on('change', handleOptionChange);
	$( "#papersize input[type=radio]" ).on('change', handleOptionChange);
	$( "#paperorientation input[type=radio]" ).on('change', handleOptionChange);
	$( "#c_type input[type=radio]" ).on('change', handleControlTypeChange);
	$( "#contours input[type=radio]" ).on('change', handleStyleChange);

	$( "#createmap" ).button({ icons: { primary: "ui-icon-disk" } }).on('click', function() { handleGenerateMap(); });
	$( "#getraster" ).button().on('click', function() { generateMap("jpg"); });
	$( "#getworldfile" ).button().on('click', function() {generateMap("jgw"); });
	$( "#getkmz" ).button().on('click', function() {generateMap("kmz"); });
	$( "#getkml" ).button().on('click', function() {generateKML(); });
	$( "#getxml" ).button().on('click', function() {generateXML(); });
	$( "#opts" ).button().on('click', function() {handleAdvancedOptions(); });
	$( "#preview" ).button().on('click', function() {
    if (previewWarning == false || preview == true) {
      handlePreview();
    }
    else {
      $('#prevAccept').prop('checked', !previewWarning);
      $("#prevWarn").dialog('open');
    }
  });
	$( "#createclue" ).button().on('click', function() { handleGenerateClue(); });
	$( "#deletesheet" ).button({ icons: { primary: "ui-icon-trash" } }).on('click', function() { handleDeleteSheet(); });
  $( "#deleteMarkers" ).button().on('click', function() { handleDeleteMarkers(); });
	$( "#getPostboxes" ).button({ icons: { primary: "ui-icon-pin-s" } }).on('click', function() {   $( "#pois" ).dialog( "open" ) });
	$( "#getOpenplaques" ).button({ icons: { primary: "ui-icon-pin-s" } }).on('click', function() { handleGetOpenplaques(); });

	$( "#createmap" ).button("disable");
	$( "#getraster,#getworldfile,#getkmz" ).button("disable");
	$( "#getkml,#getxml" ).button("disable");
	$( "#createclue" ).button("disable");
	$( "#deletesheet" ).button("disable");
  $( "#deleteMarkers" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getOpenplaques" ).button("disable");
	$( "#preview" ).button("disable");

	$( "#edittitle" ).on('click', function() { handleTitleEdit(); })
	$( "#editinstructions" ).on('click', function() { handleRaceDescriptionEdit(); })
  $("#s_poi_key").on("input", function() {   $("#c_poi_custom").prop("checked", true);   })
  $("#s_poi_value").on("input", function() {   $("#c_poi_custom").prop("checked", true);   })

  $("#tempLayer").prop("checked", false);
  $("#layerMessage").hide();
  $("#undoMessage").show();

  $('#tempLayer').change(function() {
    if (this.checked) {
      //$('#c_poi_dist').prop('disabled', true);
      //$("label[for='c_poi_dist']").addClass( "grey" );
      $("#layerMessage").show();
      $("#undoMessage").hide();
    } else {
      //$('#c_poi_dist').prop('disabled', false);
      //$("label[for='c_poi_dist']").removeClass( "grey" );
      $("#layerMessage").hide();
      $("#undoMessage").show();
    }
  });

	$( "#eventdate").datepicker({
		dateFormat: "D d M yy",
      	altField: "#eventdate_alternate",
      	altFormat: "yy-mm-dd",
    });

    tips = $( ".validateTips" );

    $('#about').click(function(event) {
      event.preventDefault();
      $("#welcome").dialog('open');
    });

	setDefaults();

	var currentLat = 51.1;
	var currentLon = -0.1;
	var currentZoom = 4;
	var minZoom = 1;

	mapStyleID = "streeto-LIDAR-5";

	if (args['zoom'])
	{
		currentZoom = args['zoom'];
	}
	else
	{
			currentZoom = 8;
	}
	if (args['lat'] && args['lon'])
	{
		currentLat = parseFloat(args['lat']); /* Necessary for lat (only) for some reason, otherwise was going to 90-val. Very odd... */
		currentLon = parseFloat(args['lon']);
	}
	else
	{
		currentLat = 51.8;
		currentLon = -0.9;
	}
	if (args['mapID'])
	{
		reqMapID = args['mapID'];
	}

 	layerMapnik = new TileLayer({ title: "OpenStreetMap", source: new OSM({
		"wrapX": true,
		attributions: [
			'Alt-Shift-Drag to rotate. Try drag & dropping a GPX file!<br>',
      '&#169; ' +
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> ' +
          'contributors.',
		],
		crossOrigin: null
	})});

    const sourceMB = new VectorSource({});
    const sourceMC = new VectorSource({});
    const sourceMS = new VectorSource({});
    const sourceMT = new VectorSource({});
    const sourceContent = new VectorSource({});
    const sourceCons = new VectorSource({});
    const sourceLines = new VectorSource({});
    const sourceGPX = new VectorSource({});

  layerOrienteering = new TileLayer({opacity: 1, zIndex: 1, className: 'features'});
	layerMapBorder = new VectorLayer({ title: "mapborder", style: marginStyle, source: sourceMB, zIndex: 2,
    updateWhileAnimating: true});
	layerMapCentre = new VectorLayer({ title: "mapcentre", style: centreStyle, source: sourceMC, zIndex: 4});
	layerMapSheet = new VectorLayer({ title: "mapsheet", style: sheetStyle, source: sourceMS, zIndex: 2,
    updateWhileAnimating: true,  className: 'colour'});
	layerMapTitle = new VectorLayer({ title: "maptitle", style: titleStyle, source: sourceMT, zIndex: 2,
    updateWhileAnimating: true});
	layerMapContent = new VectorLayer({ title: "mapcontent", style: contentStyle, source: sourceContent });
	layerControls = new VectorLayer({ title: "controls", style: controlStyle, source: sourceCons, className: 'features',
    updateWhileAnimating: true, zIndex: 4});
  layerLines = new VectorLayer({ title: "lines", style: lineStyle, source: sourceLines, className: 'features', visible: false, zIndex: 4 });
  layerPreview = new ImageLayer({ name: "Georef",  zIndex: 3});
  layerGPX = new VectorLayer({ title: "GPX", style: markerStyle, source: sourceGPX, zIndex: 4 });

	if (args['mapStyleID'])
	{
		mapStyleID = args['mapStyleID'];
 	}
	$('#' + mapStyleID.split("-")[0]).prop('checked', true);
	$('#mapstyle').controlgroup('refresh');
	$('#' + mapStyleID.split("-")[1]+"-"+mapStyleID.split("-")[2]).prop('checked', true);
	$('#contours').controlgroup('refresh');

	if (mapStyleID.split("-")[0] == "blueprint")
	{
		mapTitle = "Blueprint";
	}

	select = new Select({
		layers: [],
    hitTolerance: hitTol,
	});

	var translate = new Translate({
    layers: [layerMapCentre, layerControls],
  	//features: select.getFeatures()
	});

	translate.on('translateend',  function(evt) {
		handleDrag(evt);
	})

  translate.on('translating',  function(evt) {
		handleDrag(evt);
	})

	olMap = new Map(
	{
		target: "map",
		layers:
		[
			layerMapnik,
			layerOrienteering,
	  		layerMapBorder,
	  		layerMapContent,
  		  layerMapSheet,
	  		layerMapTitle,
	  		layerMapCentre,
	  		layerControls,
        layerLines,
        layerPreview,
        layerGPX
		],
    overlays: [overlay],
		controls: defaultControls({rotateOptions: {
      label: "M",
      autoHide: false,
      tipLabel: "M: To Mag North / N: to True North",
      resetNorth: function()
      {
        if (magDec == null) { //If no mag N details available, look up.
          var coords = olMap.getView().getCenter();
          //Use view centre unless sheet has been placed.
          if (state != 'initialzoom' && state != 'placepaper') { coords = sheetCentreLL; }
          lookupMag(olProj.transform(coords, "EPSG:3857", "EPSG:4326")[1],olProj.transform(coords, "EPSG:3857", "EPSG:4326")[0]);
        }
        else if (Math.PI - Math.abs(Math.abs((-magDec * Math.PI/180) - olMap.getView().getRotation()) - Math.PI) > 0.001) { //If mag N available, and not current orientation, change to Mag N
          olMap.getView().setRotation(-magDec * Math.PI/180);
        }
        else {  //Otherwise rotate to True N
          olMap.getView().setRotation(0);
        }
        this.label_.style.transform = 'rotate(' + olMap.getView().getRotation() + 'rad)';
      },
      render: function()
      { //if rotation more-or-less zero, change label to "M", otherwise show rotated "N"
        if (Math.PI - Math.abs(Math.abs(olMap.getView().getRotation()) - Math.PI) > 0.001) {
          this.label_.innerHTML = 'N';
          this.label_.style.transform = 'rotate(' + olMap.getView().getRotation() + 'rad)';
        }
        else {
          this.label_.innerHTML = 'M';
        }
      }
    } }).extend(
		[
			new ScaleLine({'geodesic': true, 'units': 'metric'})
		]),
		view: new View({
			projection: "EPSG:3857",
			maxZoom: 20,
			minZoom: minZoom,
			zoom: currentZoom,
			center: olProj.transform([currentLon, currentLat], "EPSG:4326", "EPSG:3857"),
      constrainRotation: false
		}),
		interactions: defaultInteractions().extend([select, translate]),
	});

  var search = new SearchNominatim (
  		{	//target: $(".options").get(0),
  			polygon: false,
  			reverse: true,
  			position: true	// Search, with priority to geo position
  		});
  olMap.addControl (search);

 	olMap.getView().on('change:resolution', handleZoom);
  olMap.getView().on('change:rotation', handleRotate);
	olMap.on("moveend", updateUrl);

	olMap.on("singleclick", function(evt) {
		handleClick(evt);
	});
  olMap.on("dblclick", function(evt) {
    handleDblClick(evt);
	});

  let selected = null;
  olMap.on('pointermove', function (evt) {
    //if (selected !== null) {
      selected = null;
    //}

    olMap.forEachFeatureAtPixel(evt.pixel, function (f, layer) {
      if ($.inArray(layer.get('title'), ['GPX','controls', 'mapcentre']) >= 0) {
        selected = f;
        return true;
      }
    });

    if (selected) {
      overlayContent.innerHTML = (selected.get('description') + "<br>" + selected.get('tags')).replace("undefined","");
      if (overlayContent.innerHTML != "<br>") { overlay.setPosition(evt.coordinate); }
    } else {
      overlay.setPosition(undefined);
    }
  });

  search.on('select', function(e)	{
		// Check if we get a geojson to describe the search
		if (e.search.geojson) {
			var format = new GeoJSON();
			var f = format.readFeature(e.search.geojson, { dataProjection: "EPSG:4326", featureProjection: olMap.getView().getProjection() });
			var view = map.getView();
			var resolution = view.getResolutionForExtent(f.getGeometry().getExtent(), olMap.getSize());
			var zoom = view.getZoomForResolution(resolution);
			var center = ol.extent.getCenter(f.getGeometry().getExtent());
			// redraw before zoom
			setTimeout(function(){
					view.animate({
					center: center,
					zoom: Math.min (zoom, 14)
				});
			}, 100);
		}
		else {
			olMap.getView().animate({
				center:e.coordinate,
				zoom: Math.max (olMap.getView().getZoom(),14)
			});
		}
	});

	setInteraction();  //Activate listener for GPX loading

	handleZoom();
	updateUrl();
	initDescriptions();

	$( ".knob" ).knob({
		'width':65,
		'fgColor':"#222222",
		'cursor':30,
		'thickness':0.3,
		'min':0,
		'max':360,
		'height':65,
		'release' : function (v) { }
	});

	var c_number = $( "#c_number" ),
  allFields = $( [] ).add( c_number );

  function checkNumber( o, n, type )
  {
  	if (type == "c_startfinish" ||type == "c_finish" || type == "c_cross" || type == "c_crossingpoint")
  	{
  		return true;
  	}
		if (o.val() == null || o.val().length < 1)
		{
			o.addClass( "ui-state-error" );
			updateTips( "You must enter a number." );
			return false;
		}
		if (o.val() != currentNumber &&
			layerControls.getSource().getFeatures().filter(feat => feat.get('number')==o.val() && feat.get('type') == 'c_regular').length > 0)
		{
			o.addClass( "ui-state-error" );
			updateTips( "This number has already been used." );
			return false;
		}
		return true;
	}

	$( "#newcontroloptions" ).dialog({
	  autoOpen: false,
	  height: 370,
	  width: 610,
	  modal: true,
    open: function() {
      allFields.removeClass( "ui-state-error" );
      updateTips("Tip: There can only be one start or finish control. Adding another moves it.");
    },
	  buttons: {
      Delete: function() {
        handleControlDelete('d'+currentID);
        $( this ).dialog( "close" );
      },
      OK: function() {

		  var bValid = true;
		  allFields.removeClass( "ui-state-error" );

		  bValid = bValid && checkNumber( c_number, "Number", $("#c_type :radio:checked").attr("id"));

		  if ( bValid ) {

				var newNumber = c_number.val();
				if (!isNaN(parseInt(newNumber)) && $("#c_type :radio:checked").attr("id") == "c_regular")
				{
					newNumber = parseInt(newNumber);
					if (newNumber > topNumber) {	topNumber = newNumber; }
				}
				var control = new Feature({
					geometry: new Point(newControlLL),
					number: "" + newNumber,
					angle: parseInt($("#c_angle").val()),
					type: $("#c_type :radio:checked").attr("id"),
					score: parseInt($("#c_score :radio:checked").val()),
					description: $('<div>').text($("#c_description").val()).html().replace("undefined",""),
          batch: batchNumber++,
				});

        if (controloptstate == "edit")	{	//delete old point if being edited
          layerControls.getSource().removeFeature(layerControls.getSource().getFeatureById(currentID))
        }
				if (control.get('type') == "c_startfinish" || control.get('type') == "c_finish")
				{
          var SF = control.get('type') == "c_finish" ? 'F' : 'S';
          control.set('score', 0);
					control.setId(SF);
					control.set('id', SF);
					if (layerControls.getSource().getFeatureById(SF)) 	//Delete any old starts
					{
						layerControls.getSource().removeFeature(layerControls.getSource().getFeatureById(SF))
					}
	  		}
        else
				{
					control.set('id', topID);
					control.setId(topID++);
				}
				layerControls.getSource().addFeature(control); //add new control
        controlsChanged();

				$( this ).dialog( "close" );
		  }
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});

	$( "#advanced" ).dialog({
	  autoOpen: false,
	  height: 370,
	  width: 550,
	  modal: true,
	  buttons: {
			OK: function() {
				rail = $('#rail').is(':checked');
				grid = $('#grid').is(':checked');
				drives = $('#drive').is(':checked');
				walls = $('#wall').is(':checked');
				trees = $('#tree').is(':checked');
				hedges = $('#hedges').is(':checked');
				fences = $('#fence').is(':checked');
        linear = $('#linear').is(':checked');
        layerLines.setVisible(linear);
        if(linear){
          $(".scorecol").addClass('hidden');
          rebuildDescriptions();
        }
        layerControls.changed(); //force re-draw
				dpi = parseInt($('#dpi').val());
				if (isNaN(dpi)) { dpi = 150; }

				$( this ).dialog( "close" );
			},
			Cancel: function() {
			  $( this ).dialog( "close" );
			}
	  }
	});

  $( "#prevWarn" ).dialog({
    autoOpen: false,
    height: 300,
    width: 550,
    modal: true,
    buttons: {
      OK: function() {
        previewWarning = !$('#prevAccept').is(':checked');
        handlePreview();
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    }
  });

	$( "#setmaptitle" ).dialog({
	  autoOpen: false,
	  height: 350,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {

		    mapTitle = $("#s_maptitle").val();
		  	initDescriptions();
	  		if (state == "addcontrols" || state == "zoom")
			{
			if (mapID != "new")
				{
					mapID = "new";
					updateUrl();
				}
		    $( "#getraster,#getworldfile,#getkmz" ).button("disable");
				rebuildMapSheet();
			}

			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
  }
	});

	$( "#setracedescription" ).dialog({
	  autoOpen: false,
	  height: 350,
	  width: 845,
	  modal: true,
	  buttons: {
  		OK: function()
  		{
  			if (mapID != "new")
  			{
  				mapID = "new";
  				updateUrl();
  			}
  		  $( "#getraster,#getworldfile,#getkmz" ).button("disable");
  	    raceDescription = $("#s_racedescription").val();
  	  	initDescriptions();
  			$( this ).dialog( "close" );
  		},
  		Cancel: function() {
  		  $( this ).dialog( "close" );
  		}
	  }
	});

	$( "#saving" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#saveerror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
  		"Create anyway": function() {
  		 	mapID = "new";
  		  $( "#getraster,#getworldfile,#getkmz" ).button("disable");
  			generateMap("pdf");
  			$( this ).dialog( "close" );
  		},
  		Cancel: function() {
  		  $( this ).dialog( "close" );
  		}
	  }
	});
	$( "#validationerror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		"Save and create anyway": function() {
			saveMap();
			$( this ).dialog( "close" );
		},
		Cancel: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#generating" ).dialog({
	  autoOpen: false,
	  height: 410,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#loaderror" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#postcode_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#postcode_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#postboxes_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#postboxes_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#openplaques_searching" ).dialog({
	  autoOpen: false,
	  height: 140,
	  modal: true
	});
	$( "#openplaques_error" ).dialog({
	  autoOpen: false,
	  height: 300,
	  width: 500,
	  modal: true,
	  buttons: {
		OK: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#cluesheet" ).dialog({
	  autoOpen: false,
	  height: 700,
	  width: 900,
	  modal: true,
	  buttons: {
		"Print clue sheet": function() {
			$(this).jqprint();
		},
		Close: function() {
		  $( this ).dialog( "close" );
		}
	  }
	});
	$( "#welcome" ).dialog({
	  autoOpen: true,
	  width: 760,
	  modal: true,
	  buttons:  [ { text: "Ok", click: function() { $( this ).dialog( "close" ); } } ]
	});

  $( "#pois" ).dialog({
    autoOpen: false,
    height: 470,
    width: 580,
    modal: true,
    buttons: {
      OK: function() {
        var rVal = $("input[name='c_pois']:checked").val().split(",");
        if (rVal[0]=='custom')
        { //wrap key and value in single-quotes to allow e.g. colons in key
          rVal = ["'" + $("input[name='poi_key']").val() + "'='" +  $("input[name='poi_value']").val() + "'",$("input[name='poi_value']").val() + ': ','name', ''];
        }
        //rVal = [key=value, description prefix, field for description, sort field]
        rVal.push(parseInt($("input[name='poi_dist']").val()));
        rVal.push($("#tempLayer").prop('checked'));
        if (debug) {console.log(rVal);}
        handleGetPois(rVal);
        $( this ).dialog( "close" );
      },
      Cancel: function() {
        $( this ).dialog( "close" );
      }
    }
  });

	$("#search").on('submit', function() { handleSearchPostcode(); return false });
	$("#load").on('submit', function() { handleLoadMap(); return false; });

	$( "#searchButton" ).button().css('font-size', '10px');
	$( "#loadButton" ).button().css('font-size', '10px');

	//Handle loading in a map with ID.
	if (reqMapID != "new")
	{
		$.post('/php/load.php', {"shortcode":reqMapID}, handleLoadCallback);
	}

  $(window).keydown(function (e) {
      var keyCode = e.which;
      if (debug) {console.log ("key: " + keyCode);}
      if (keyCode == 68 && e.ctrlKey == true) {  //press "Ctrl-d" - toggle debug
        debug = !debug;
        e.preventDefault();
      }
      if (keyCode == 71 && e.ctrlKey == true) {  //press "Ctrl-g" to switch to greyscale map
          var gr = $('.greyscale');
          var col = $('.colour');
          gr.removeClass('greyscale').addClass('colour');
          col.removeClass('colour').addClass('greyscale');
          e.preventDefault();
      }
      if (keyCode == 90 && e.ctrlKey == true) {  //press "Ctrl-z" to undo last control add operation
        layerControls.getSource().getFeatures().filter(feat=>feat.get('batch') == batchNumber-1).forEach(function(f){
           layerControls.getSource().removeFeature(f);
        });
        if (batchNumber > 1) {
          var lastControl = getSortedControls('c_regular').pop();
          topNumber = parseInt(lastControl.number);
          batchNumber--;
        }
        else {
          topNumber = 0;
          batchNumber = 0;
        }
        controlsChanged();
        e.preventDefault();
      }
  });
}

function updateTips( t ) {
  tips
	.text( t )
	.addClass( "ui-state-highlight" );
  setTimeout(function() {
	tips.removeClass( "ui-state-highlight", 1500 );
  }, 500 );
}

/* Resetting and reinitialisation */

function initDescriptions()
{

	$( ".edit").button({ icons: { primary: "ui-icon-pencil" }, text: false });
	$( ".delete").button({ icons: { primary: "ui-icon-trash" }, text: false });

	$("#maptitle").text(mapTitle);
	$("#racedescription").text(raceDescription);
}

function resetControlAddDialog(pid)
{
	$("#c_angle").trigger('configure', { "readOnly":false });
	$("#c_score input[type=radio]").button("enable");
	$("#c_number").removeAttr('disabled');
	$("#c_description").removeAttr('disabled');

  $("#c_regular").prop("checked", true);
  $('#c_type').controlgroup('refresh');

	//set dialog defaults:
	$("#c_angle").val(45).trigger('change');
	//$("#c_score").val(10); //Don't change this - useful to keep current value.
	$("#c_number").val(""+(topNumber+1));
	$("#c_description").val("");

	//override defaults if control id specified and it exists
	if (pid != null)
	{
		var control = layerControls.getSource().getFeatureById(pid.substring(1));
		if(control)
		{
			$("#c_angle").val(control.get('angle')).trigger('change');
			$("#c_score" + control.get('score')).trigger( "click" ); //Underlying button
			$("#c_number").val(control.get('number'));
			$("#c_description").val(control.get('description'));
      $("#" + control.get('type')).prop("checked", true);
      $('#c_type').controlgroup('refresh');
      handleControlTypeChange();  //refreshes angle label text
			newControlLL = control.getGeometry().getFirstCoordinate();
		}
	}
}

/* Deal with user actions */

function handleControlTypeChange()
{
	var type = $("#c_type :radio:checked").attr("id");

	if (type == "c_startfinish" || type == "c_cross" || type == "c_finish")
	{
		$("#anglelabel").html('<br />&nbsp;');
		$("#c_angle").val(45).trigger('change');
		$("#c_angle").trigger('configure', { "readOnly":true });

	}
	else if (type == "c_crossingpoint")
	{
		$("#anglelabel").html('Crossing<br />angle');
		$("#c_angle").trigger('configure', { "readOnly":false });
	}
	else
	{
		$("#anglelabel").html('Number<br />position');
		$("#c_angle").trigger('configure', { "readOnly":false });
	}


	if (type == "c_startfinish" || type == "c_finish" || type == "c_cross" || type == "c_crossingpoint")
	{
		//$("#c_score").val(10); //Don't change this - useful to keep current value.
		$("#c_number").val("");
		$("#c_description").val("");

		$("#c_score input[type=radio]").button("disable");
		$("#c_number").attr('disabled','disabled');
		$("#c_description").attr('disabled','disabled');
	}
	else
	{
		$("#c_score input[type=radio]").button("enable");
		$("#c_number").removeAttr('disabled');
		$("#c_description").removeAttr('disabled');
	}
}

function handleStyleChange()
{
	mapStyleID = $("#mapstyle :radio:checked").attr("id") + "-" + $("#contours :radio:checked").attr("id");
  if (mapID != "new")
	{
		mapID = "new";
	}
  $( "#getraster,#getworldfile,#getkmz" ).button("disable");
  handleZoom();
  updateUrl();
}

function handleRotate()
{
	if(debug) {console.log('handleRotate');}
	if (!olMap || state == "initialzoom" || state == "placepaper")
	{
		return;
	}
	try {
		var angle = olMap.getView().getRotation();
  	if (angle != rotAngle) { //if map rotation is different from previous rotation
			if (Math.abs(angle)>Math.PI/4){  //If >45 rotation, rotate mapsheet 90deg backwards - N is always in top sector.
				var orient;
				if ($("#portrait").prop('checked')) {orient="landscape"}
				else {orient="portrait"}
				$("#" + orient).trigger( "click" );
				$("[for=" + orient + "]").trigger( "click" );
        if (angle>0) { angle=angle-Math.PI/2;  }
				else {angle=angle+Math.PI/2}
				olMap.getView().setRotation(angle);
			}
      //rotAngle = angle;
			rebuildMapSheet();   //reposition map sheet so it remains horizontal
			rebuildMapControls();
		}
	}
	catch {}
}

function handleZoom()
{
	if (debug) { console.log('handleZoom'); }
	if (!olMap)
	{
		return;
	}

/*
initialzoom - zoomed out, no sheet
zoom - zoomed out, sheet placed
placepaper - zoomed in, no sheet
addcontrols - zoomed in, sheet placed
*/

	if (olMap.getView().getZoom() < 12)	//if zoomed out, hide contours, and don't allow drawing
	{
		if (state == "placepaper")
		{
			state = "initialzoom";
			$("#messageCentre").hide();
			$("#messageZoom").show("pulsate", {}, 500);
		}
		else if (state == "addcontrols")
		{
			state = "zoom";
			$("#messageAdd").hide();
			$("#messageZoom").show("pulsate", {}, 500);
			//rebuildMapSheet();
		}
		layerOrienteering.setVisible(false); //hide contours
	}
	else
	{
		if (state == "initialzoom")
		{
			state = "placepaper";
			$("#messageZoom").hide();
			$("#messageAdd").hide();
			$("#messageCentre").show("pulsate", {}, 500);
		}
		else if (state == "zoom")
		{
			state = "addcontrols";
			$("#messageZoom").hide();
			$("#messageCentre").hide();
			$("#messageAdd").show("pulsate", {}, 500);
			//rebuildMapSheet();
		}
		else if (state == "addcontrols")
		{
			$("#messageCentre").hide();
			//rebuildMapSheet();
		}
		mapStyleID = $("#mapstyle :radio:checked").attr("id") + "-" + $("#contours :radio:checked").attr("id");

		if (mapStyleIDOnSource != mapStyleID)
		{
			layerOrienteering.setSource(
				new XYZ(
					{
						urls: [prefix1 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png", prefix2 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png", prefix3 + $("#contours :radio:checked").attr("id") + "/{z}/{x}/{y}.png"],
						attributions: ['Contours: various - see PDF output', ],
            maxZoom: 18,
						"wrapX": true
					}
				)
			);
			mapStyleIDOnSource = mapStyleID;
		}

		if(mapStyleID.split("-")[1] == "SRTM" || mapStyleID.split("-")[1] == "NONE" || mapStyleID.split("-")[1] == "COPE")
		{
			layerOrienteering.setVisible(false);
	  }
		else
		{
			layerOrienteering.setVisible(true);
		}
  }
}

function handleControlEditOptions(pid)
{
			controloptstate = "edit";
      //currentID = parseInt(pid.substring(1)); //remove the 'e' prefix
			currentID = pid.substring(1); //remove the 'e' prefix
			currentNumber = null;
			var control = layerControls.getSource().getFeatureById(currentID);
			if (control)
			{
					currentNumber = parseInt(control.get('number'));
					newControlLL = control.getGeometry().getFirstCoordinate();
			}
      $('.ui-dialog-buttonpane button:contains("Delete")').button().show();
      $( "#newcontroloptions" ).dialog( "open");
			resetControlAddDialog(pid);
}

function handleAdvancedOptions(pid)
{
			$('#rail').prop('checked', rail);
			$('#grid').prop('checked', grid);
			$('#drive').prop('checked', drives);
			$('#wall').prop('checked', walls);
			$('#tree').prop('checked', trees);
			$('#hedges').prop('checked', hedges);
			$('#fence').prop('checked', fences);
      $('#linear').prop('checked', linear);
			$('#dpi').val(dpi);
			$( "#advanced" ).dialog( "open" );
}

function handleControlDelete(pid)  //pid = "d<n>"
{
	currentID = pid.substring(1); //strip "d" prefix
  var control = layerControls.getSource().getFeatureById(currentID);
	if (control)
	{
		layerControls.getSource().removeFeature(control)
	}
  controlsChanged();
}

function controlsChanged(rebuild = true)
{
  if (mapID != "new")
  {
    mapID = "new";
    updateUrl();
  }
	$( "#getraster,#getworldfile,#getkmz" ).button("disable");
  rebuildMapControls();
  if (rebuild) rebuildDescriptions();
}

function handleDeleteMarkers()
{
  layerGPX.getSource().clear();
  $( "#deleteMarkers" ).button("disable");
}

function handleDeleteSheet()
{
	layerMapBorder.getSource().clear();
	layerMapCentre.getSource().clear();
	layerMapSheet.getSource().clear();
	layerMapTitle.getSource().clear();
	layerMapContent.getSource().clear();
	layerControls.getSource().clear();

	topID = 0;
	topNumber = 0;
	magDec = undefined;

  controlsChanged();
  layerPreview.setSource();
  preview=false;
  state = "initialzoom";
	handleZoom();

	$( "#createmap" ).button("disable");
  $( "#deletesheet" ).button("disable");
	$( "#getPostboxes" ).button("disable");
	$( "#getOpenplaques" ).button("disable");
  $( "#preview" ).button("disable");
}

function handleTitleEdit()
{
	$( "#setmaptitle" ).dialog( "open" );
	$("#s_maptitle").val(mapTitle);
	updateTips("Tip: Long titles will be reduced in size when creating sheet.");
}

function handleRaceDescriptionEdit()
{
	$( "#setracedescription" ).dialog( "open" );
	$("#s_racedescription").val(raceDescription);
	updateTips("Tip: The race instructions will appear at the top of the clue sheet. Please do not place any personal information here (e.g. phone numbers) as it may be publically visible in future versions of OpenOrienteeringMap.");
}

function handleLoadMap()
{
	reqMapID = $("#savedMapID").val();
	$.post('/php/load.php', {"shortcode":reqMapID}, handleLoadCallback);
}

function handleGenerateMap()
{
	$("#saved_mapid").html("");
	$("#saveerror_text").html("");
	$("#validationerror_text").html("");

	if (validate())
	{
		saveMap();
	}
}

function validate()
{
	var validationMsg = "";

	if (mapTitle == defaultMapTitle)
	{
		validationMsg += "Map title not changed from default.<br />";
	}
	if (raceDescription == defaultRaceDescription)
	{
		validationMsg += "Race instructions not changed from default.<br />";
	}

  var controls = getSortedControls('c_regular');
  var currScore = 0;
	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];
		if (control.score < currScore) //Assumes controls are sorted by number!
		{
			validationMsg += "One or more controls with higher number but lower score.<br />";
			break;
		}
		currScore = control.score;
	}

	var controlNumbers = [];
	for (var i = 0; i < controls.length; i++)
	{
		var control = controls[i];
		if ($.inArray(control.number, controlNumbers) > -1)
		{
			validationMsg += "Two or more controls have the same number.<br />";
			if (debug) { console.log(controlNumbers); console.log(control.number); }
			break;
		}
		controlNumbers.push(control.number);
	}

	if (validationMsg != "")
	{
		$( "#validationerror" ).dialog( "open" );
		$("#validationerror_text").html(validationMsg);
		return false;
	}
	else
	{
		return true;
	}
}

function handleDrag(evt)	//Vector element has been dragged - update arrays to match UI
{
	var feats = evt.features;
  var moveCentre = false;
  var moveControl = false;
	feats.forEach((feat) => {
		if (debug) { console.log('handleDrag'); }
		if (feat.get('type') == 'centre')
		{
			sheetCentreLL = (layerMapCentre.getSource().getFeatures()[0]).getGeometry().getFirstCoordinate();
      moveCentre = true;
		}
    else
		{
      moveControl = true;
    }
	});
	//select.getFeatures().clear();
  if (moveCentre) rebuildMapSheet();  //Needed if centre has moved
  if (moveControl) controlsChanged(false);  //Needed if any control has moved
}

function handleSaveCallback(json)
{
  $( "#saving" ).dialog( "close" );
	var result = JSON.parse(json);
	if (result.success)
	{
		$( "#generating" ).dialog( "open" );
		$("#saved_mapid").html("Your map ID (" + result.message + ") is printed at the bottom right. Use this ID if you wish to reload the map in the future.");
		mapID = result.message;
		updateUrl();
		if (debug) { console.log(result.data); }
		generateMap("pdf");

	}
	else
	{
		$( "#saveerror" ).dialog( "open" );
		$( "#saveerror_text" ).html(result.message);
	}
	$( "#getraster,#getworldfile,#getkmz" ).button("enable");
}

function handleLoadCallback(json)
{
	$("#loaderror_text").html("");

	var result = JSON.parse(json);
	if (result.success)
	{
		if (debug) { console.log(result.data); }
		loadMap(result.data);
	}
	else
	{
	//	$( "#loaderror" ).dialog( "open" );
	//	$( "#loaderror_text" ).html(result.message);

	//If failed, try looking up from oomap.co.uk load.php instead before giving up.
		reqMapID = $("#savedMapID").val();
		$.post('https://oomap.co.uk/load.php', {"shortcode":reqMapID}, handleLoadOldCallback);
	}
}

//Old save lookup callback - delete when function becomes redundant
function handleLoadOldCallback(json)
{
	$("#loaderror_text").html("");

	var result = JSON.parse(json);
	if (result.success)
	{
		if (debug) { console.log(result.data); }
		//If successful, need to convert old-style data to updated format (different styles, added rotation value)
		result.data.rotation='0';
		if (result.data.style == 'streeto') {result.data.style = 'streeto-OS-10'; }
		if ((result.data.style + "padding").substring(0,8) == 'streeto_') {result.data.style = 'streeto-NONE-0'; }
		if (result.data.style == 'oterrain') {result.data.style = 'oterrain-OS-10'; }
		if ((result.data.style + "padding").substring(0,9) == 'oterrain_') {result.data.style = 'oterrain-NONE-0'; }
		if (result.data.style == 'blueprint') {result.data.style = 'blueprint-NONE-0'; }
		loadMap(result.data);
	}
	else
	{
		$( "#loaderror" ).dialog( "open" );
		$( "#loaderror_text" ).html(result.message);
	}
}
function handleGenerateClue()
{
	//TODO Do warning that this action does not save - person needs to press Create Map Sheet.
	$( "#cluesheet" ).dialog( "open" );

	$("#cs_title").html(mapTitle);
	$("#cs_raceinstructions").html(raceDescription);

	$("#cs_controls tr").remove();

	$("#cs_controls").find('tbody')
		.append($('<tr>')
			.append($('<th>').append('No'))
			.append($('<th>').append('Score'))
			.append($('<th>').append('Description'))
			.append($('<th>').append('Answer'))
		);

	var currentScore = 0;
	var emphasise = false;
  var controls = getSortedControls('c_regular');
	for (var i = 0; i < controls.length; i++)
	{
		var control  = controls[i];
		emphasise = (currentScore != control.score && currentScore != 0) ? 'cs_spacer' : '';
		currentScore = control.score;

		$("#cs_controls").find('tbody')
			.append($('<tr>').addClass(emphasise)
				.append($('<td>')
					.append(control.number).css('width', '50').css('fontWeight', 'bold')
				  )
				.append($('<td>')
					.append(control.score).css('width', '50')
				  )
				.append($('<td>')
					.append(control.description).css('textAlign', 'left')
				  )
				.append($('<td>').css('width', '100')
				  )
			);
	}
}

//TODOs
//About/Comments/attribution links.

//Missing features from this version:
//Label overlay
//Aerial imagery overlay
//lat/lon jump.

function handleOptionChange()
{
	if(debug) {console.log(state);}
	if (state == "initialzoom")
	{
		$("#messageZoom").effect("pulsate", {}, 500);
		return;
	}
	if (state == "addcontrols" || state == "zoom")
	{
    rebuildMapSheet();
    controlsChanged();
    layerControls.changed(); //force re-draw
		return;
	}
}

function handleClick(evt)
{
	var centreClick = false;
	var pixel = evt.pixel;
	olMap.forEachFeatureAtPixel(pixel, function(feature, layer)
	{
		//Has a map feature been clicked?
    if (feature && $.inArray(layer.get('title'), ['GPX']) >= 0){
      evt.stopPropagation();  //Don't highlight GPX points, and stop event processing.
      centreClick = true;
    }
    if (feature && $.inArray(layer.get('title'), ['mapcentre', 'controls']) >= 0)
		{
			centreClick = true;
		}
	},
	{
		hitTolerance: hitTol,
	});
	//If so, stop processing click and allow openLayers event to take over.
	if (centreClick)
	{
		if (debug) { console.log('returning'); }
		return;
	}

	if (state == "addcontrols")
	{
  	var coordinate = evt.coordinate;
		newControlLL = coordinate;
    if (!(layerMapContent.getSource().getFeatures()[0].getGeometry().intersectsCoordinate(olProj.transform(newControlLL, "EPSG:3857", "EPSG:4326"))))
		{ //if control outside map area, alert
			$( "#newcontroloutsidemap" ).dialog({
			  modal: true,
			  buttons: {
				Ok: function() {
				  $( this ).dialog( "close" );
				}
			  }
			});
		}
		else
		{ //otherwise open new control dialog with default options
			controloptstate = "new";
      $('.ui-dialog-buttonpane button:contains("Delete")').button().hide();
			$( "#newcontroloptions" ).dialog( "open" );
			resetControlAddDialog(null);
		}
		return;
	}

	if (state == "initialzoom" || state == "zoom")
	{
		$("#messageZoom").effect("pulsate", {}, 500);
		return;
	}

	if (state == "placepaper")
	{
		if (mapID != "new")
		{
			mapID = "new";
			updateUrl();
		}
		$( "#getraster,#getworldfile,#getkmz" ).button("disable");
		sheetCentreLL = evt.coordinate;
		lookupMag(olProj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[1],olProj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[0]);
    olMap.getView().setCenter(sheetCentreLL);
		rebuildMapSheet();
		state = "addcontrols";
		$("#messageCentre").hide();
		$("#messageAdd").effect("pulsate", {}, 500);
	}
}

function handleDblClick(evt)
{

  var pixel = evt.pixel;

	olMap.forEachFeatureAtPixel(pixel, function(feature, layer)
	{
		//Has a map feature been clicked?
		if (feature && $.inArray(layer.get('title'), ['controls']) >= 0)
		{
      handleControlEditOptions('e'+feature.getId()); //Open edit dialog
      evt.stopPropagation(); //Don't continue to trigger zoom
		}
    else if (feature && $.inArray(layer.get('title'), ['GPX']) >= 0)
		{ //Clicked GPX/temp feature - promote to layerControls
      if (state == 'addcontrols' && feature.getGeometry().getType() == 'Point')
      { //only run if clicked item is a point, and a map has been placed
        if (!(layerMapContent.getSource().getFeatures()[0].getGeometry().intersectsCoordinate(olProj.transform(evt.coordinate, "EPSG:3857", "EPSG:4326"))))
        { //if event outside map area, alert
          $( "#newcontroloutsidemap" ).dialog({
            modal: true,
            buttons: {
              Ok: function() {
                $( this ).dialog( "close" );
              }
            }
          });
          return;
        }

        layerGPX.getSource().removeFeature(feature);
        if (feature.get('type')!='c_regular') //if not from a POI query
        {
          feature.set('description',"" + feature.get('name'),true)
        }
        else {//If no description, use tags instead.
          if(feature.get('description').length == 0){
            feature.set('description',feature.get('tags').replace("undefined",""));
          }
        }
        feature.set('type','c_regular',true);
        feature.set('id',topID++,true);
        feature.set('number',"" + ++topNumber,true);
        feature.set('angle',45,true);
        feature.set('score',topNumber < 20 ? 10 : topNumber < 30 ? 20 : topNumber < 40 ? 30: topNumber < 50 ? 40 : 50,true);
        feature.set('batch',batchNumber++);
        feature.setId(feature.get('id'));
        feature.setStyle();
        layerControls.getSource().addFeature(feature);
        controlsChanged();
      }
      evt.stopPropagation(); //Don't continue to trigger zoom
		}
	},
	{
		hitTolerance: hitTol,
	});
}

/* Actions */

function saveMap()
{
	if (mapID != "new")
	{
		$( "#generating" ).dialog( "open" );
		generateMap("pdf");
	}
	var controlsForDB = getSortedControls(); //get all features

	var json = {"data":{
		"action": "savemap",
		"title": mapTitle,
		"race_instructions": raceDescription,
		"eventdate": $('#eventdate_alternate').val(),
		"club": $('#club').val(),
		"style": mapStyleID,
		"scale": $("#mapscale :radio:checked").attr("id"),
		"papersize": $("#papersize :radio:checked").attr("id"),
		"paperorientation": $("#paperorientation :radio:checked").attr("id"),
		"centre_lat": sheetCentreLL[1],
		"centre_lon": sheetCentreLL[0],
		"centre_wgs84lat": olProj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[1],
		"centre_wgs84lon": olProj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326")[0],
		"controls": controlsForDB,
		"rotation": olMap.getView().getRotation()
	}};

	$.post('/php/save.php', json, handleSaveCallback);
  if(debug){console.log(json);}

	$( "#saving" ).dialog( "open" );
}

function generateMap(type)
{
		self.location=getURL(type);
}

function getURL(type)
{
  //Construct the URL to the download file/image.
  var escapeTitleText = encodeURIComponent(mapTitle);

  var startText = "";
  var finishText = "";
  var xText = "";
  var cpText = "";
  if(getSortedControls('c_startfinish').length > 0)
  {
    getSortedControls('c_startfinish').forEach(function(c)
    {
      startText += c.lat.toFixed(0) + "," + c.lon.toFixed(0) + ",";
    })
    startText  = startText.substring(0, startText.length - 1);
  }
  if(getSortedControls('c_finish').length > 0)
  {
    getSortedControls('c_finish').forEach(function(c)
    {
      finishText += c.lat.toFixed(0) + "," + c.lon.toFixed(0) + ",";
    })
    finishText  = finishText.substring(0, finishText.length - 1);
  }  if(getSortedControls('c_cross').length > 0)
  {
    getSortedControls('c_cross').forEach(function(c)
    {
      xText += c.lat.toFixed(0) + "," + c.lon.toFixed(0) + ",";
    })
    xText  = xText.substring(0, xText.length - 1);
  }
  if(getSortedControls('c_crossingpoint').length > 0)
  {
    getSortedControls('c_crossingpoint').forEach(function(c)
    {
      cpText += c.angle + "," + c.lat.toFixed(0) + "," + c.lon.toFixed(0) + ",";
    })
    cpText  = cpText.substring(0, cpText.length - 1);
  }

  var site_href = window.location.href
  var arr = site_href.split("/");
  var url = arr[0] + "//" + arr[2] + "/render/" + type
    + "/?style=" + mapStyleID
    + "|paper=" + paper_pieces[0].toFixed(3) + "," + paper_pieces[1].toFixed(3)	//trim numbers in string to 3dp
    + "|scale=" + scale
    + "|centre=" +  sheetCentreLL[1].toFixed(0) + "," + sheetCentreLL[0].toFixed(0)
    + "|title=" + escapeTitleText
    + "|club=" + $('#club').val()
    + "|id=";
  if (mapID != "new")
  {
    url += mapID;
  }

  if (type == 'kmz')
  {
    url	+= "|start="
      + "|crosses=" + xText
      + "|cps=" + cpText
      + "|controls=";
  }
  else if (type == 'pre') {} //don't add features to preview image
  else
  {
    url	+= "|start=" + startText
      + "|finish=" + finishText
      + "|crosses=" + xText
      + "|cps=" + cpText
      + "|controls=";

    if(getSortedControls('c_regular').length > 0)
    {
      getSortedControls('c_regular').forEach(function(c)
      {
        url += c.number + "," + c.angle + "," + c.lat.toFixed(0) + "," + c.lon.toFixed(0) + ",";
      })
      url  = url.substring(0, url.length - 1);
    }
  }
  url	+= "|rotation=" + olMap.getView().getRotation().toFixed(4);
  if (grid) {url += "|grid=yes"; } else {url += "|grid=no"; }
  if (rail) {url += "|rail=yes"; } else {url += "|rail=no"; }
  if (walls) {url += "|walls=yes"; } else {url += "|walls=no"; }
  if (trees) {url += "|trees=yes"; } else {url += "|trees=no"; }
  if (hedges) {url += "|hedges=yes"; } else {url += "|hedges=no"; }
  if (drives) {url += "|drives=yes"; } else {url += "|drives=no"; }
  if (fences) {url += "|fences=yes"; } else {url += "|fences=no"; }
  if (linear) {url += "|linear=yes"; } else {url += "|linear=no"; }
  url += "|dpi=" + dpi;

  if (debug) { console.log(url); }
  return url;
}

function KMLposition(control)
{
  var num;
  var style;
  if (control.type == 'c_startfinish') {
    num = 'S1';
    style = '#startfinish';
  }
  else if (control.type == 'c_finish') {
    num = 'F1';
    style = '#startfinish';
  }
  else {
    num = control.number;
    style = '#control';
  }
	return '<Placemark><name>'
		+ num
		+ '</name><description>'
    + control.description
    + '</description><styleUrl>' + style + '</styleUrl><Point><gx:drawOrder>1</gx:drawOrder><coordinates>'
		+ control.wgs84lon
		+ ","
		+ control.wgs84lat
		+ ',0</coordinates></Point></Placemark>\n';
}

function generateKML()
{
  // KML export for MapRun
  var kml = '';

	var kmlintro = '<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">\n';
	kmlintro += '<Document>\n<name>oom_' + mapID + '_controls</name>\n<open>1</open>\n';
	kmlintro += '<Style id="startfinish"><IconStyle><color>ffff00ff</color><scale>1.8</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-stars.png</href></Icon><hotSpot x="0.5" y="0" xunits="fraction" yunits="fraction"/></IconStyle><LabelStyle><color>ffff00ff</color></LabelStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	kmlintro += '<Style id="control"><IconStyle><color>ffff00ff</color><scale>1.0</scale><Icon><href>http://maps.google.com/mapfiles/kml/paddle/wht-blank.png</href></Icon><hotSpot x="0.5" y="0" xunits="fraction" yunits="fraction"/></IconStyle><LabelStyle><color>ffff00ff</color><scale>1.0</scale></LabelStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	//kmlintro += '<Style id="donotcross"><IconStyle><color>ffff00ff</color><scale>1.0</scale><Icon><href>https://oomap.co.uk/images/kml_donotcross.png</href></Icon></IconStyle><BalloonStyle></BalloonStyle><ListStyle></ListStyle></Style>\n';
	var kmlheader = '<Folder>\n<name>Controls</name>\n<open>1</open>\n';
	var kmlfooter = '</Folder>\n</Document>\n</kml>';

	kml += kmlintro;
	kml += kmlheader;

  var list = getControlList();
  list.forEach(function(c) { kml += KMLposition(c);});
  kml += kmlfooter;

	// Data URI
	var kmlData = 'data:application/vnd.google-earth.kml+xml,' + encodeURIComponent(kml);

	var filename = 'oom_' + mapID + '.kml'

	// For IE
	if (window.navigator.msSaveOrOpenBlob) {
		var blob = new Blob([decodeURIComponent(encodeURI(kml))], {
			type: "application/vnd.google-earth.kml+xml;"
		});
		navigator.msSaveBlob(blob, filename);
	}
	else
	{
		$('#getkml')
			.attr({
				'download': filename,
				'href': kmlData
		});
	}

}

function XMLposition(control) {
  var num;
  if (control.type == 'c_startfinish') {
    num = control.id;
  }
  else if (control.type == 'c_finish') {
    num = control.id;
  }
  else {
    num = control.number;
  }
  return '<Control>\n<Id>' + num + '</Id>\n' +
    '<Position lat="' + control.wgs84lat + '" lng="' + control.wgs84lon + '"/>\n</Control>\n';
}
function XMLorder(control) {
  var type;
  var num;
  var score = '';
  if (control.type == 'c_startfinish') {
    num = control.id;
    type = "Start";
  }
  else if (control.type == 'c_finish') {
    num = control.id;
    type = "Finish";
  }
  else {
    num = control.number;
    type = "Control";
    score += control.score;
  }
  var output =  '<CourseControl type="' + type + '" randomOrder="' + (!linear && control.type == 'c_regular') + '">';
  output += '\n<Control>' + num + '</Control>\n';
  if(!linear) { output += '<Score>' + score + '</Score>\n'; }
  output += '</CourseControl>\n';
  return output;
}

function getControlList()
{
  //  Get controls for KML/XML export - add start as finish if necessary.
  var list = getSortedControls('c_startfinish').concat(getSortedControls('c_regular'));
  getSortedControls('c_finish').length == 0 ? list=list.concat(getSortedControls('c_startfinish')) : list=list.concat(getSortedControls('c_finish'));
  //If last control is start, recast as a finish.
  var fcontrol = list.pop();
  if (fcontrol.type == 'c_startfinish') {fcontrol.type = 'c_finish';}
  list.push(fcontrol);
  return list;
}

function generateXML()
{
  // IOF 3.0 XML export
	var xml = '';
  var now = new Date;

	var xmlintro = '<?xml version="1.0" encoding="UTF-8"?>\n<CourseData xmlns="http://www.orienteering.org/datastandard/3.0"\n' +
    'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"\niofVersion="3.0"\n';
	xmlintro += 'createTime="' + now.toISOString() + '"\n creator="OpenOrienteeringMap v4">\n';
	xmlintro += '<Event><Name>' + mapTitle + '</Name>\n</Event>\n';

	var xmlheader = '<RaceCourseData>\n';
	var xmlfooter = '</Course>\n</RaceCourseData>\n</CourseData>';

	xml += xmlintro;
	xml += xmlheader;

  var list = getControlList();
  list.forEach(function(c) { xml += XMLposition(c);});
  xml += '<Course>\n<Name>' + (linear ? 'Line' : 'Score') + '</Name>\n';
  list.forEach(function(c) { xml += XMLorder(c);});

	xml += xmlfooter;
	// Data URI
	var xmlData = 'data:Application/xml,' + encodeURIComponent(xml);

	var filename = 'oom_' + mapID + '.xml'

	// For IE
	if (window.navigator.msSaveOrOpenBlob) {
		var blob = new Blob([decodeURIComponent(encodeURI(xml))], {
			type: "Application/xml;"
		});
		navigator.msSaveBlob(blob, filename);
	}
	else
	{
		$('#getxml')
			.attr({
				'download': filename,
				'href': xmlData
		});
	}
}



function loadMap(data)
{
	if (debug) { console.log('loadMap'); }
	state = "zoom";

	mapTitle = data.title;
	raceDescription = data.race_instructions;
	var $style = $("#" + data.style.split("-")[0]);
	var $styleL = $("[for=" + data.style.split("-")[0] + "]");
	var $scale = $("#" + data.scale);
	var $scaleL = $("[for=" + data.scale + "]");
	var $papersize = $("#" + data.papersize);
	var $papersizeL = $("[for=" + data.papersize + "]");
	var $paperorientation = $("#" + data.paperorientation);
	var $paperorientationL = $("[for=" + data.paperorientation + "]");
	var $contours = $("#" + data.style.split("-")[1] + "-" + data.style.split("-")[2]);
	var $contoursL = $("[for=" + data.style.split("-")[1] + "-" + data.style.split("-")[2] + "]");

	$('#eventdate_alternate').val(data.eventdate);
	$('#eventdate').val(data.eventdate);
	//$('#eventdate').datepicker("refresh");
	//TODO Implement loading of saved club.

	$style.trigger( "click" );
  $scale.trigger( "click" );
	$papersize.trigger( "click" );
	$paperorientation.trigger( "click" );
	$contours.trigger( "click" );

  layerControls.getSource().clear();
  topID=0;

	sheetCentreLL = olProj.transform([parseFloat(data.centre_lon), parseFloat(data.centre_lat)], "EPSG:4326", "EPSG:3857");
	olMap.getView().setCenter(sheetCentreLL);
  olMap.getView().setRotation(parseFloat(data.rotation));
	if (data.scale == "s7500" || data.scale == "s5000" || data.scale == "s4000")
	{
		olMap.getView().setZoom(15);
	}
	else
	{
		olMap.getView().setZoom(14);
	}
	if (debug) { console.log(sheetCentreLL); }

	for (var i = 0; i < data.controls.length; i++)
	{
		var control = data.controls[i];
		control.id = topID++;
		if (!isNaN(parseInt(control.number)))
		{
			control.number = parseInt(control.number);
			if (control.number > topNumber)
			{
				topNumber = control.number;
			}
		}
    if (control.type == 'c_startfinish') {control.id = 'S'; }
    if (control.type == 'c_finish') {control.id = 'F'; }
		var controlLL = olProj.transform([parseFloat(control.wgs84lon), parseFloat(control.wgs84lat)], "EPSG:4326", "EPSG:3857");

    var controlPoint = new Feature({
			geometry: new Point([controlLL[0], controlLL[1]]),
			number: "" + control.number,
			angle: parseInt(control.angle),
			type: control.type,
			score: parseInt(control.score),
			description: control.description,
			id: control.id,
      batch: batchNumber
		});
		controlPoint.setId(control.id);
		layerControls.getSource().addFeatures([controlPoint]);
	}
  batchNumber++;
	mapID = reqMapID;
  rebuildMapSheet();  //DPD
	rebuildMapControls();
  rebuildDescriptions();
	handleZoom();
	updateUrl();

	$( "#getraster,#getworldfile,#getkmz" ).button("enable");
	$("#messageCentre").hide();
}

//Move a feature from number: moveFrom to number: moveTo, and shuffle others down
function insertFeature (moveFrom, moveTo) {
  var isForward = parseInt(moveFrom) < parseInt(moveTo);
  var movedFeat = layerControls.getSource().getFeatures().filter(feat=>feat.get('number') == moveFrom && feat.get('type') == 'c_regular');
  while (true){ //keep iterating until function returns (when no feature is bumped)
    if (movedFeat.length != 1) { return false; }
    var bumpedFeat = layerControls.getSource().getFeatures().filter(feat=>feat.get('number') == moveTo && feat.get('type') == 'c_regular');
    if(debug) { console.log(moveFrom + " moved to " + moveTo); }
    movedFeat[0].set('number', "" + moveTo);
    if (bumpedFeat.length == 0) { return true; };
    moveFrom = moveTo;
    isForward ? moveTo-- : moveTo++ ;
    movedFeat = bumpedFeat;
  }
}
//convert a control Object to an ol Feature
function controlToFeature(control)
{
	var feature = new Feature({
		geometry: new Point([control.lon, control.lat]),
		number: control.number,
		angle: parseInt(control.angle),
		type: control.type,
		score: parseInt(control.score),
		description: control.description
	});
	control.setId(control.id);
	control.set('id', control.id)
	return(control);
}

//Convert an ol Feature to a control Object
function featureToControl(feature)
{
	const control = feature.getProperties();
	control.id = feature.getId();
	control.lon = feature.getGeometry().getFirstCoordinate[0];
	control.lat = feature.getGeometry().getFirstCoordinate[1];
	return control;
}


function getSortedControls(type = null)
{
  var list = layerControls.getSource().getFeatures();
  list.forEach(function(feat,i)
  {
    list[i] = feat.getProperties();
    [list[i].lon, list[i].lat] = list[i].geometry.flatCoordinates;
    [list[i].wgs84lon, list[i].wgs84lat] = olProj.transform(list[i].geometry.flatCoordinates, "EPSG:3857", "EPSG:4326");
    list[i].geometry = undefined;
  });
  if(type != null) { list = list.filter(feat => feat.type == type); } //filter by type if provided
  list.sort(function(a, b)
  {
    if (isNaN(a.number - b.number))
    {
      return a.number < b.number ? -1 : 1;
    }
    return a.number - b.number;
  });
  if(debug){console.log(list);}
  return list;
}

function getMarkers()
{
  var list = layerGPX.getSource().getFeatures().filter(feat=>feat.getGeometry().getType() == 'Point');
  list.forEach(function(feat,i)
  {
    list[i] = feat.getProperties();
    [list[i].lon, list[i].lat] = list[i].geometry.flatCoordinates;
    [list[i].wgs84lon, list[i].wgs84lat] = olProj.transform(list[i].geometry.flatCoordinates, "EPSG:3857", "EPSG:4326");
    list[i].geometry = undefined;
  });

  if(debug){console.log(list);}
  return list;
}


function rebuildMapSheet()
{
	if (debug) { console.log("rebuildMapSheet"); }

	if (!sheetCentreLL)
	{
		sheetCentreLL = olMap.getView().getCenter();
	}

	layerMapBorder.getSource().clear();
	//layerMapCentre.getSource().clear();
	layerMapSheet.getSource().clear();
	layerMapTitle.getSource().clear();
	layerMapContent.getSource().clear();

	var papersize = "";

	papersize = $("#papersize :radio:checked").attr("id");

	if ($("#portrait").prop('checked')) {  paper_pieces[0] = 0.0001 * papersize.substring(6); paper_pieces[1] = 0.0001 * papersize.substring(1, 5); }
	else { paper_pieces[0] = 0.0001 * papersize.substring(1, 5); paper_pieces[1] = 0.0001 * papersize.substring(6); }
	paper = paper_pieces[0] + "," + paper_pieces[1];

	scale = -1;

	scale = $("#mapscale :radio:checked").val();
	scale = parseInt(scale);

	var centroidllWGS84 = olProj.transform(sheetCentreLL, "EPSG:3857", "EPSG:4326");
	var fudgeFactor = Math.cos(centroidllWGS84[1] * Math.PI/180);
	trueScale = scale / fudgeFactor;
	if (debug) {console.log("True scale is " + trueScale);}

	var paper_dlon = paper_pieces[0] * trueScale;
	var paper_dlat = paper_pieces[1] * trueScale;

	var map_nm_dlat = 0.014 * trueScale;
	var map_em_dlon = 0.008 * trueScale;
	var map_sm_dlat = 0.013 * trueScale;
	var map_wm_dlon = 0.008 * trueScale;

	var map_dlon = (paper_dlon - map_wm_dlon) - map_em_dlon;
	var map_dlat = (paper_dlat - map_nm_dlat) - map_sm_dlat;

	mapBound = [sheetCentreLL[0]-map_dlon/2,  sheetCentreLL[1]-map_dlat/2, sheetCentreLL[0]+map_dlon/2,  sheetCentreLL[1]+map_dlat/2];
	var paperBound = [
	(sheetCentreLL[0] - map_dlon/2) - map_wm_dlon,
	( sheetCentreLL[1] - map_dlat/2) - map_sm_dlat,
	(sheetCentreLL[0] + map_dlon/2) + map_em_dlon,
	( sheetCentreLL[1] + map_dlat/2) + map_nm_dlat];
	var paperWMBound = [	paperBound[0],	mapBound[1], 	mapBound[0],		mapBound[3]];
	var paperEMBound = [	mapBound[2],		mapBound[1], 	paperBound[2],	mapBound[3]];
	var paperNMBound = [	paperBound[0], 	mapBound[3],		paperBound[2], 	paperBound[3]];
	var paperSMBound = [	paperBound[0], 	paperBound[1], 	paperBound[2], 	mapBound[1]];

	var sheet = new Feature({ geometry: PolyFromExtent(paperBound) });

	var titleSizeArr = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 5, 9, 18, 36, 72, 144, 288];
	fontSizeFromArr = (titleSizeArr[parseInt(olMap.getView().getZoom())]*(trueScale/16000)).toFixed(0);

	if (mapStyleID.split("-")[0] == "blueprint")
	{
		mapTitleDisplay = mapTitle;
	}
	else
	{
		mapTitleDisplay = mapTitle.toUpperCase();
	}

	var title = new Feature({
		geometry: new Point([ sheetCentreLL[0]-map_dlon/2, sheetCentreLL[1]+map_dlat/2+map_nm_dlat/2]),
		type: 'centre',
    description: 'Map Title'
	 });
	title.set('fontSizeFromArr',  fontSizeFromArr);
	title.set('mapTitleDisplay',  mapTitleDisplay);
	title.set('xoff',  0);
	title.set('yoff',  0);

	var content = new Feature({ geometry: PolyFromExtent(mapBound) });
	var westMargin = new Feature({ geometry: PolyFromExtent(paperWMBound) });
	var eastMargin = new Feature({ geometry: PolyFromExtent(paperEMBound) });
	var northMargin = new Feature({ geometry: PolyFromExtent(paperNMBound) });
	var southMargin = new Feature({ geometry: PolyFromExtent(paperSMBound) });

   if (layerMapCentre.getSource().getFeatures().length == 0) {
     var centreMarker = new Feature({
   		geometry: new Point(sheetCentreLL),
   		type: 'centre',
       description: 'Map centre.  Drag to move.'
   	 });
     layerMapCentre.getSource().addFeatures([centreMarker]);
  }
  else {
    layerMapCentre.getSource().getFeatures()[0].setGeometry(new Point(sheetCentreLL));
  }
	var titleFeature = new Feature({ geometry: new Point([mapBound[0], mapBound[3] + (0.002 * trueScale)])});

	layerMapBorder.getSource().addFeatures([westMargin, eastMargin, northMargin, southMargin, titleFeature]);
	layerMapSheet.getSource().addFeatures([sheet]);
	layerMapTitle.getSource().addFeatures([title]);
  layerMapContent.getSource().addFeatures([content]);


	var angle = olMap.getView().getRotation();
  //if (angle != rotAngle) {
		layerMapBorder.getSource().getFeatures().forEach(function(f) {
			f.getGeometry().rotate(angle,sheetCentreLL);
  	});
		layerMapSheet.getSource().getFeatures()[0].getGeometry().rotate(angle,sheetCentreLL);
		layerMapTitle.getSource().getFeatures()[0].getGeometry().rotate(angle,sheetCentreLL);
		rotAngle = angle;
	//}

	wgs84Poly = content.getGeometry();
	wgs84Poly.rotate(angle, sheetCentreLL);
	wgs84Poly.transform("EPSG:3857", "EPSG:4326");

	//rebuildDescriptions();

	$( "#getraster,#getworldfile,#getkmz" ).button("disable");
	$( "#createmap" ).button("enable");
	$( "#deletesheet" ).button("enable");
	$( "#getPostboxes" ).button("enable");
	$( "#getOpenplaques" ).button("enable");
	$( "#preview" ).button("enable");
}

function rebuildMapControls()
{
	if (layerControls.getSource().getFeatures().filter(feat=>feat.get('type')=='c_regular').length > 0)
	{
		$( "#createclue" ).button("enable");
		$( "#getkml" ).button("enable");
  	$( "#getxml" ).button("enable");
	}
	else
	{
		$( "#createclue" ).button("disable");
		$( "#getkml" ).button("disable");
		$( "#getxml" ).button("disable");
		$( "#getPostboxes" ).button("enable");
		$( "#getOpenplaques" ).button("enable");
    $( "#preview" ).button("enable");
	}
  var listC = getSortedControls("c_regular");
  var listS = getSortedControls("c_startfinish");
  var listF = getSortedControls("c_finish");
  if (listF.length == 0) {listF = listS}  //Reuse start as finish if needed
  var list = listS.concat(listC, listF);

  layerLines.getSource().clear();
  for (var i = 0; i < (list.length - 1); i++)
  {
    const scale = trueScale/200;
    const dx = list[i+1].lon - list[i].lon;
    const dy = list[i+1].lat - list[i].lat;
    const rotation = Math.atan2(dy, dx);
    var start2 = [list[i].lon + Math.cos(rotation) * scale, list[i].lat + Math.sin(rotation) * scale];
    if (list[i].type == 'c_startfinish') start2 = [list[i].lon + Math.cos(rotation) * scale * 1.3, list[i].lat + Math.sin(rotation) * scale * 1.3];
    var end2 = [list[i+1].lon - Math.cos(rotation) * scale, list[i+1].lat - Math.sin(rotation) * scale];
    if (list[i+1].type != 'c_regular') end2 = [list[i+1].lon - Math.cos(rotation) * scale * 1.2, list[i+1].lat - Math.sin(rotation) * scale* 1.2];

    var line = new Feature({
      geometry: new LineString([start2, end2]),
    });
    layerLines.getSource().addFeature(line);
  }
  layerLines.getSource().changed();
}

function rebuildDescriptions()
{
	$("#controldescriptions tr.controlrow").remove();
  const list = getSortedControls("c_regular");
	var controlnum = list.length;
	var maxscore = 0;

  contourSeparation = $("#contours :radio:checked").attr("id").split("-")[1].replace("p",".");

	for (var i = 0; i < list.length; i++)
	{
		maxscore += list[i].score;
	}

	$("#scalecaption").text('1:' + scale);
	$("#controlcaption").text('' + controlnum + " control" + (controlnum == 1 ? "" : "s"));
	$("#pointscaption").text('' + maxscore + " points");
	$("#contourcaption").text(contourSeparation + 'm contours');

	for (var i = 0; i < list.length; i++)
	{
		var control  = list[i];

		$("#controldescriptions").find('tbody')
			.append($('<tr>').addClass('controlrow').data( 'number', control.number )
				.append($('<td class="numcol">')
					.append(control.number)
				  )
				.append($('<td class="scorecol">')
					.append(control.score)
				  )
				.append($('<td>').attr('colspan', '2')
					.append(control.description.length > 28 ? control.description.substring(0,25) + "..."  : control.description)
				  )
				.append($('<th>')
					.append($('<span>').addClass('edit').attr('id', 'e' + control.id).text('Edit').on('click', function() { handleControlEditOptions(this.id); })
					  )
					.append($('<span>').addClass('delete').attr('id', 'd' + control.id).text('Delete').on('click', function() { handleControlDelete(this.id); })
					  )
				  )
			);
	}
  $('.controlrow').droppable({
    accept: '.controlrow',
    //hoverClass: 'hovered',
    drop: function (ev, ui) {
      var toNumber = $(this).data( 'number' );
      var fromNumber = ui.draggable.data( 'number' );
      insertFeature(fromNumber, toNumber);
      controlsChanged();
      ev.preventDefault();
      if (debug) { console.log("drop: "+ fromNumber + " to: " + toNumber); }
    }
  });

  $('.controlrow').draggable({
    cursor: 'move',
    containment: 'parent',
    stack: '#controlpanel div',
    revert: true
  });

	initDescriptions();
}

/* Search handling */

function handleSearchPostcode()
{
	var pc = $("#postcode").val();
	var url = '/php/postcode.php?pc=' + escape(pc);
    $.get(url, null, handleSearchPostcodeCallback);
	$( "#postcode_searching" ).dialog( "open" );
}

function handleSearchPostcodeCallback(json)
{
	$( "#postcode_searching" ).dialog( "close" );
	var result = JSON.parse(json);
	if (result.success)
	{
		var zoom = olMap.getView().getZoom();
		if (zoom < 13)
		{
			zoom = 13;
		}
    olMap.getView().setCenter(Proj4("EPSG:27700", "EPSG:3857", [parseInt(result.easting), parseInt(result.northing)]));
		olMap.getView().setZoom(zoom);
	}
	else
	{
		$( "#postcode_error" ).dialog( "open" );
		$( "#postcode_error_text" ).html(result.message);
	}
}

function sortByProp(property){
   return function(a,b){
      if(parseInt(a.tags[property]) > parseInt(b.tags[property]))
         return 1;
      else if(parseInt(a.tags[property]) < parseInt(b.tags[property]))
         return -1;

      return 0;
   }
}
function handleGetPois([query, prefix, srcDescription, orderBy=null, radius,boolTemp])
//Get points of interest from OSM Overpass query.
// query - string containing key-value pair, e.g. "amenity=post_box"
// prefix - String prefix for feature description eg. "Postbox: "
// srcDescription - source tag for remaining description text - eg "name" or "ref"
// orderBy - OSM tag to (numnerically) sort output on if order is important.
// radius - minimum spacing in meters from all other placed controls.
// boolTemp - put controls in a temporary layer?
{
  var arr = wgs84Poly.flatCoordinates;
  if (isNaN(radius)) { radius = 0;}
	var url = apiServer + '?data=[out:json][timeout:25];node[' + query + '](poly:\"' + arr[1] + " " + arr[0] + " " + arr[3] + " " + arr[2] + " " + arr[5] + " " + arr[4] + " " + arr[7] + " " + arr[6]+"\");out;";
    $.get(url)
      .done(function( result, textStatus, jqXHR ) {
    	var changed = false;
    	$( "#postboxes_searching" ).dialog( "close" );
    	if (result.elements.length > 0)
    	{
        if (orderBy != null) { result.elements.sort(sortByProp(orderBy)); }
        for(var i = 0; i < result.elements.length; i++)
    		{
    			var dupe = false;
          var featureList = getSortedControls('c_regular');
          if (boolTemp) { featureList = featureList.concat(getMarkers()); }  //add in marker layer features if results are going to feat layer.
          if(featureList.length > 0) //Check for nearby existing controls
          {
            featureList.forEach(function(c)
            {
              if (getDistance([result.elements[i].lon, result.elements[i].lat],[c.wgs84lon, c.wgs84lat]) <= (radius+1)) {		dupe = true;	};
              // Remove common unwanted nodes
              if (result.elements[i].tags.hasOwnProperty('created_by') || result.elements[i].tags.hasOwnProperty('generator:source')) {		dupe = true;	};
            });
          }
          if (debug) {console.log("dupe");}
    			if (!dupe)
    			{
            var tags="";
            Object.entries(result.elements[i].tags).forEach(function(t){
             tags+=t[0] + ": " + t[1] + "\n";
           });
            var control = new Feature({
              geometry: new Point(olProj.transform([result.elements[i].lon, result.elements[i].lat], "EPSG:4326", "EPSG:3857")),
              angle: 45,
              type: 'c_regular',
              description: (prefix + result.elements[i].tags[srcDescription]).replace("undefined",""),
              tags: tags
            });

            if(boolTemp)
            {
              layerGPX.getSource().addFeature(control);
              $( "#deleteMarkers" ).button("enable");
            }
            else
            {
              control.set('id',topID++);
              control.set('number',"" + ++topNumber);
              control.set('score', topNumber < 20 ? 10 : topNumber < 30 ? 20 : topNumber < 40 ? 30: topNumber < 50 ? 40 : 50);
              control.setId(control.get('id'));
              control.set('batch', batchNumber);
              layerControls.getSource().addFeature(control);
      				changed = true;
            }
    			}
    		}
    		rebuildMapControls();
    	  rebuildDescriptions();

    		if (changed)
        {
          controlsChanged();
          batchNumber++;
        }
    	}
    	else
    	{
    		$( "#postboxes_error" ).dialog( "open" );
    		$( "#postboxes_error_text" ).html(result.message);
    	}

    })
      .fail(function( jqXHR, textStatus, errorThrown ) {
        if (debug) {
          console.log(jqXHR);
          console.log(textStatus);
          console.log(errorThrown );
        }
        $( "#postboxes_searching" ).dialog( "close" );
    });

	$( "#postboxes_searching" ).dialog( "open" );
}

function handleGetOpenplaques()
{
  var bounds = layerMapContent.getSource().getExtent();
	var url = '/php/getopenplaques.php?bounds=[' + bounds[3] + "%2C" + bounds[0] + "]%2C[" + bounds[1] + "%2C" + bounds[2] + "]";
  $.get(url, null, handleGetOpenplaquesCallback);
	$( "#openplaques_searching" ).dialog( "open" );

}

function handleGetOpenplaquesCallback(result)
{
	var changed = false;
	$( "#openplaques_searching" ).dialog( "close" );
	if (result !== undefined && result.features !== undefined && result.features.length > 0)
	{
		for(var i = 0; i < result.features.length; i++)
		{
      var control = new Feature({
        geometry: new Point(olProj.transform(result.features[i].geometry.coordinates, "EPSG:4326", "EPSG:3857")),
        id: topID++,
        number: "" + ++topNumber,
        angle: 45,
        type: 'c_regular',
        score: topNumber < 20 ? 10 : topNumber < 30 ? 20 : topNumber < 40 ? 30: topNumber < 50 ? 40 : 50,
        description: "Plaque: " + ("" + result.features[i].properties.inscription).replace("undefined",""),
        batch: batchNumber
      });
      control.setId(control.get('id'));
	  	var dupe = false;

      for (var j = 0; j < i; j++)
			{
				if (JSON.stringify(result.features[i].geometry.coordinates) == JSON.stringify(result.features[j].geometry.coordinates))
				{
					dupe = true;
				}
			}
			if (!dupe)
			{
				layerControls.getSource().addFeature(control);
				changed = true;
			}
		}
		$( "#getOpenplaques" ).button("disable");
		if (changed)	{
       controlsChanged();
       batchNumber++;
     	}
	}
	else
	{
		$( "#openplaques_error" ).dialog( "open" );
		$( "#openplaques_error_text" ).html("There are no plaques in this area recorded on the Open Plaques database, or a system error is preventing retrieval of plaques for this area. Open Plaques has a high number of plaques in the UK, USA and Germany. Check the Open Plaques website at https://openplaques.org/places/");
	}
}

function updateUrl()
{
	var lon = olMap.getView().getCenter()[0];
	var lat = olMap.getView().getCenter()[1];
	var change = false;
	var metres180deg = 20037508.34;
	while (lon < -metres180deg) { lon = lon + 2*metres180deg; change = true; }
	while (lon > metres180deg) { lon = lon - 2*metres180deg; change = true; }

	if (change)
	{
		olMap.getView().setCenter([lon, lat]);
	}
	if (debug) { console.log('updateUrl'); }
	var centre = olProj.transform(olMap.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	window.location.hash = "/" + mapID + "/" + mapStyleID + "/" + olMap.getView().getZoom() + "/" + centre[0].toFixed(4) + "/" + centre[1].toFixed(4) + "/";
}

function rotateToMagDec(){
  if (magDec){
		olMap.getView().setRotation(-magDec * Math.PI/180);
		//handleRotate();
	}
}

function setdecl(v, callback){
 if(debug) {console.log("declination found: "+v);}
 magDec=v;
 callback();
}

function lookupMag(lat, lon) {
   var url = "https://oomap.dna-software.co.uk/wmm?lat="+lat+"&lon="+lon;
   $.get(url, function(response, status){
        setdecl(response, rotateToMagDec);
   });
}

function handlePreview(){
  if (!preview){
    var oldDPI = dpi;
    dpi = 300;
    var geoimg =  new GeoImage({
        url: getURL("pre"),
        crossOrigin: '',
        imageCenter: [sheetCentreLL[0], sheetCentreLL[1] + 0.0005 * trueScale], //this is centred on *map*, not *sheet* - need to adjust slightly based on margins.
        imageScale: [trueScale * 0.0254/dpi,trueScale*0.0254/dpi],  //metres per pixel.
        imageRotate: olMap.getView().getRotation() * -1,
    });
    $( "#preview" ).button().addClass('loading');
    $( "#preview" ).html('Loading...');
    layerPreview.setSource(geoimg);

    geoimg.on('change', function(event) { //imageloadend event isn't triggered, so use generic "change" event instead.
      if(debug) {console.log('change event fired');}
      $( "#preview" ).button().removeClass('loading');
      $( "#preview" ).html('Preview');
    });

    dpi = oldDPI;
    preview = true;
  }

  else {
    layerPreview.setSource();
    preview=false;
  }
}

$(document).ready(function()
{
	init();
});
