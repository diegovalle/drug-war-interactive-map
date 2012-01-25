// jQuery Deparam - v0.1.0 - 6/14/2011
// http://benalman.com/
// Copyright (c) 2011 Ben Alman; Licensed MIT, GPL

(function($) {
  // Creating an internal undef value is safer than using undefined, in case it
  // was ever overwritten.
  var undef;
  // A handy reference.
  var decode = decodeURIComponent;

  // Document $.deparam.
  var deparam = $.deparam = function(text, reviver) {
    // The object to be returned.
    var result = {};
    // Iterate over all key=value pairs.
    $.each(text.replace(/\+/g, ' ').split('&'), function(index, pair) {
      // The key=value pair.
      var kv = pair.split('=');
      // The key, URI-decoded.
      var key = decode(kv[0]);
      // Abort if there's no key.
      if ( !key ) { return; }
      // The value, URI-decoded. If value is missing, use empty string.
      var value = decode(kv[1] || '');
      // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
      // into its component parts.
      var keys = key.split('][');
      var last = keys.length - 1;
      // Used when key is complex.
      var i = 0;
      var current = result;

      // If the first keys part contains [ and the last ends with ], then []
      // are correctly balanced.
      if ( keys[0].indexOf('[') >= 0 && /\]$/.test(keys[last]) ) {
        // Remove the trailing ] from the last keys part.
        keys[last] = keys[last].replace(/\]$/, '');
        // Split first keys part into two parts on the [ and add them back onto
        // the beginning of the keys array.
        keys = keys.shift().split('[').concat(keys);
        // Since a key part was added, increment last.
        last++;
      } else {
        // Basic 'foo' style key.
        last = 0;
      }

      if ( $.isFunction(reviver) ) {
        // If a reviver function was passed, use that function.
        value = reviver(key, value);
      } else if ( reviver ) {
        // If true was passed, use the built-in $.deparam.reviver function.
        value = deparam.reviver(key, value);
      }

      if ( last ) {
        // Complex key, like 'a[]' or 'a[b][c]'. At this point, the keys array
        // might look like ['a', ''] (array) or ['a', 'b', 'c'] (object).
        for ( ; i <= last; i++ ) {
          // If the current key part was specified, use that value as the array
          // index or object key. If omitted, assume an array and use the
          // array's length (effectively an array push).
          key = keys[i] !== '' ? keys[i] : current.length;
          if ( i < last ) {
            // If not the last key part, update the reference to the current
            // object/array, creating it if it doesn't already exist AND there's
            // a next key. If the next key is non-numeric and not empty string,
            // create an object, otherwise create an array.
            current = current[key] = current[key] || (isNaN(keys[i + 1]) ? {} : []);
          } else {
            // If the last key part, set the value.
            current[key] = value;
          }
        }
      } else {
        // Simple key.
        if ( $.isArray(result[key]) ) {
          // If the key already exists, and is an array, push the new value onto
          // the array.
          result[key].push(value);
        } else if ( key in result ) {
          // If the key already exists, and is NOT an array, turn it into an
          // array, pushing the new value onto it.
          result[key] = [result[key], value];
        } else {
          // Otherwise, just set the value.
          result[key] = value;
        }
      }
    });

    return result;
  };

  // Default reviver function, used when true is passed as the second argument
  // to $.deparam. Don't like it? Pass your own!
  deparam.reviver = function(key, value) {
    var specials = {
      'true': true,
      'false': false,
      'null': null,
      'undefined': undef
    };

    return (+value + '') === value ? +value // Number
      : value in specials ? specials[value] // true, false, null, undefined
      : value; // String
  };

}(jQuery));

function warningLongLinksIE(){
    if($("#maplink").val().length > 2083)
	$('#ielonglinks').html('<span class="label warning">Warning</span> Long links may not work in Internet Explorer or Social Networks');
    else
	$('#ielonglinks').html("");
}

function getLocation() {
    return location.protocol+ '//' +location.host+location.pathname;
}

function getShareURL(){
   var ret;
    if(polyString == "")
	ret = getLocation() + "#" + $.param({city: currentCity, start: startDate, end: endDate,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom, homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong})
    else
	ret = getLocation() + "#" + $.param({city: currentCity, start: startDate, end: endDate,
					  mariguana: mjVisible, poppy: poppyVisible,
					  meth: methVisible, cocaine: cocaineVisible,
					  zoom: currentZoom,  homtype : typeOfHomicide,
					  clat: centerLat, clong: centerLong,
					  polygon: polyString});
   return ret;
}


function changeHash(){
    $("#maplink").attr("value","");
    if(polyString == "")
	$("#maplink").attr("value", getShareURL());
    else
	$("#maplink").attr("value", getShareURL());
    warningLongLinksIE();
}
var style = [
    {
	featureType: 'road.highway',
	elementType: 'all',
	stylers: [
            { visibility: 'off' }
      ]
    } ,
    {
	featureType: "landscape",
	elementType: "all",
	stylers: [

	    { hue: "#000"},//"#F3F4EE" },
            { saturation: -100 }, //100
            { lightness: 22 } //22
	    //{ gamma: 1.11 }
	]
    },
    {
	featureType: "poi",
	stylers: [
	    { visibility: "off" }
	]
    },{
	featureType: "water",
	stylers: [
	    { visibility: "simplified" },
	    { hue: "#000000" },
            { saturation: -100 },
            { lightness: -30 }
	]
    },
    {
	featureType: "administrative.country",
	stylers: [
	    { visibility: "simplified" }
	]
    },
    {
	featureType: 'road.arterial',
	elementType: 'all',
	stylers: [
            { visibility: 'off' }
	]
    } ,
    
    {
	featureType: 'road.local',
	elementType: 'all',
	stylers: [
            { visibility: 'off' }
	]
    } ,
    
    {
	featureType: 'poi',
	elementType: 'all',
	stylers: [
            { visibility: 'off' }
	]
    } ,
    {
	featureType: 'transit',
	elementType: 'all',
	stylers: [
            { visibility: 'off' }
	]
    } ,
{
    featureType: 'administrative.province',
    elementType: 'all',
    stylers: [
        { visibility: 'off' }
    ]
} ,
    {featureType: 'administrative.locality',
     elementType: 'all',
     stylers: [
        { visibility: 'off' }
     ]
    }
];

var startDate = "2010-01-15";
var endDate = "2010-12-15";
var numMonths = 12;
var homrate = [], datehom = [], homtot = [], drhrate = [], drhtot =[], pop = [];
var commas = pv.Format.number();

var lastDWRHYear = 2011;
var lastDWRHMonth = 9; //September is the last month for which DWRH are available

var dates = [];
var monthlyData = [], coordData = [];


var shortUrl;
var shortUrlShare;

var shownModalButton = false;
var parameters;
var layer;
var vis, state;
var showingNames = false;
var overlay;
var crimes = [];
var currentCity = all_of_mx_text;
var currentZoom = 5;

var newShape, selectedShape;

var mjlayer, poppylayer, lablayer, mjpathslayer, poppypathslayer, methpathslayer;
var mj_paths = 824024;
var poppy_paths = 2310300;
var meth_paths = 2308189;
var homicide_month = 2330644;
var dots;
var visChart;
var yearSlider;

var changed = false;
var drh_layer= 2243315;//2240298;//
var mjVisible = true, poppyVisible = false, methVisible = false, cocaineVisible = false;
var typeOfHomicide = "INEGI";
var scaleFactor = .5;
var centerLat = 23.61796278994952, centerLong = -95.02734375;

var violenceData;
var baseURLCartodb = "http://diegovalle.cartodb.com/api/v1/sql/?q=";
//var homicidesg20=new Array(2500);

var map;
var coords = [];
var polyString = "";
var myPolygon = null;
var lastModePoly = false;
var lastHomicideYear = 2010;
var mj_cartodb_gmapsv3, poppy_cartodb_gmapsv3;


//Chart sidebar variables
var lastDate = "September 15, 2011";
var interHom = -1, interDRH = -1;var interDRH2 = -1;
var activeLine = false, activeChart;
var startDWRH = new Date("December 15,2006");
var start = new Date(2004, 0, 1);
var end = new Date(lastDate);
var endHomicides = new Date("December 15, 2010");
var monthsLength = monthDiff(start, end)+1;


var w = 360,
    h = 180;


var alltothom = [    772,    797,    818,    688,    837,    805,    745,    773,    746,    779,    781,    813,    770,    785,    843,    856,    819,    891,    819,    800,    845,    827,    824,    907,    894,    760,    852,    834,    917,    851,    853,    924,    920,    836,    904,    885,    605,    509,    788,    771,    936,    761,    745,    765,    709,    773,    708,    783,    888,    839,   1009,    943,   1149,   1220,   1176,   1287,   1183,   1471,   1521,   1530,   1382,   1481,   1430,   1342,   1481,   1669,   1641,   1799,   1854,   1767,   1716,   2230,   1949,   1671,   2016,   2041,   2147,   2307,   2287,   2544,   2165,   2477,   1919,   2156, null, null, null, null, null, null, null, null, null ];





var alltotdrh =[ null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null,     62,    146,    106,    266,    249,    313,    200,    159,    300,    262,    294,    259,    272,    306,    331,    352,    294,    506,    512,    614,    706,    573,    860,    981,    802,    588,    741,    626,    641,    638,    923,    848,    882,    928,    904,    831,   1064,   1080,    988,   1266,   1250,   1363,   1494,   1494,   1488,   1160,   1467,   1079,   1144,   1351,   1176,   1424,   1630,   1539,   1433,   1519,   1461,   1370 ];


var allpop = [ 1.0335e+08, 1.0347e+08, 1.0358e+08, 1.037e+08, 1.0382e+08, 1.0393e+08, 1.0405e+08, 1.0417e+08, 1.0428e+08, 1.044e+08, 1.0452e+08, 1.0463e+08, 1.0475e+08, 1.0487e+08, 1.0498e+08, 1.051e+08, 1.0522e+08, 1.0533e+08, 1.0545e+08, 1.0557e+08, 1.0568e+08, 1.058e+08, 1.0592e+08, 1.0603e+08, 1.0615e+08, 1.0627e+08, 1.0639e+08, 1.065e+08, 1.0662e+08, 1.0674e+08, 1.0685e+08, 1.0697e+08, 1.0709e+08, 1.072e+08, 1.0732e+08, 1.0744e+08, 1.0756e+08, 1.0767e+08, 1.0779e+08, 1.0791e+08, 1.0802e+08, 1.0814e+08, 1.0826e+08, 1.0837e+08, 1.0849e+08, 1.0861e+08, 1.0873e+08, 1.0884e+08, 1.0896e+08, 1.0908e+08, 1.0919e+08, 1.0931e+08, 1.0943e+08, 1.0954e+08, 1.0966e+08, 1.0978e+08, 1.0989e+08, 1.1001e+08, 1.1013e+08, 1.1024e+08, 1.1036e+08, 1.1048e+08, 1.1059e+08, 1.1071e+08, 1.1083e+08, 1.1094e+08, 1.1106e+08, 1.1118e+08, 1.1129e+08, 1.1141e+08, 1.1152e+08, 1.1164e+08, 1.1176e+08, 1.1187e+08, 1.1199e+08, 1.121e+08, 1.1222e+08, 1.1234e+08, 1.1245e+08, 1.1257e+08, 1.1268e+08, 1.128e+08, 1.1292e+08, 1.1303e+08, 1.1315e+08, 1.1326e+08, 1.1338e+08, 1.1349e+08, 1.1361e+08, 1.1373e+08, 1.1384e+08, 1.1396e+08, 1.1407e+08 ];

var alldrhrate = alltotdrh.map(function(value, i) {return value/ allpop[i] * 100000 * 12;});
var allhomrate = alltothom.map(function(value, i) {return value/ allpop[i] * 100000 * 12;});


//Initialize a date array with all the months for the homicide data
for(var i = 2004; i <= lastDWRHYear; i++) {
    for(var j = 0; j < 12; j++){
	if(i ==  lastDWRHYear) 
	    if(j < lastDWRHMonth)
		dates.push(new Date(i, j, 15));
            else
		break;
	else
	    dates.push(new Date(i, j, 15));
    }
}
for(var i = 0; i < dates.length; i++){
    monthlyData.push({date: dates[i], drh: alltotdrh[i], drhrate: alldrhrate[i],
		    hom: alltothom[i], homrate: allhomrate[i], pop: allpop[i]});
}


function toggleProvince() {
  if(showingNames) {
      style.push( {
		      featureType: 'administrative.province',
		      elementType: 'all',
		      stylers: [
			  { visibility: 'off' }
		      ]
		  });style.push({
				    featureType: 'administrative.locality',
				    elementType: 'all',
				    stylers: [
					{ visibility: 'off' }
				    ]
				});}
   else {
       style.pop();style.pop();
   }
    var styledMapType = new google.maps.StyledMapType(style, {
							  map: map,
							  name: 'Styled Map'
  });
    map.mapTypes.set('map-style', styledMapType);
    map.setMapTypeId('map-style');
    showingNames = !showingNames;
}


function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('#') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


//SELECT sum(drh) AS drh, AVG(drhrate) as rate, sum(hom) AS hom, AVG(homrate) as homrate, MAX(lat) AS lat, MAX(long) as long, EXTRACT(year FROM date), name, AVG(pop) as pop FROM homicides_web WHERE EXTRACT(year FROM date) = 2010  AND drh > 0 GROUP BY EXTRACT(year FROM date), name ORDER BY drh DESC
function queryData() {
    if(typeOfHomicide === "DWRH") {

	var homstr = "drh";
	var ratestr = "rate";
    } else { 

	var homstr = "hom";
	var ratestr = "homrate";
    }
var queryCartodb = "SELECT sum(" + homstr + ") AS " + homstr + ", MAX(ST_X(the_geom)) AS long, MAX(ST_Y(the_geom)) as lat, name, AVG(pop) as pop FROM homicides_web WHERE date BETWEEN DATE '" +startDate+"' AND DATE '"+ endDate +"' AND " + homstr + " > 0 GROUP BY  name ORDER BY " + homstr + " DESC";
//queryCartodb = "SELECT avg(population) as pop, sum(hom) AS hom, MAX(ST_X(the_geom)) AS long, MAX(ST_Y(the_geom)) as lat, CASE metroarea WHEN '' THEN CONCAT(munname,', ', statename) ELSE metroarea END as name FROM homicides_dwrh_month_municipality WHERE  EXTRACT(year FROM date) = " + yearSlider + " GROUP BY  EXTRACT(year FROM date), metroarea, CASE metroarea WHEN '' THEN CONCAT(munname,', ', statename) ELSE metroarea END ORDER BY hom DESC";
    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  coordData = result;
		  //overlay.crimes.splice(0, overlay.crimes.length);
		  overlay.crimes.length = 0;
		  //var startTime = new Date();
		  for(var i =0; i<result.rows.length;i++) {
		      
		      
		      overlay.crimes[i] = ({lat : result.rows[i]["lat"], lon: result.rows[i]["long"], latlon: new google.maps.LatLng(result.rows[i]["lat"], result.rows[i]["long"]), code: result.rows[i][homstr], name:result.rows[i]["name"], rate:result.rows[i][homstr]/result.rows[i]["pop"] * 100000 * 12/numMonths, pop:result.rows[i]["pop"]
});
		      
		  }
		  
		  //var endTime = new Date();
		  
		  //alert(endTime-startTime);
		  overlay.draw();
	      });
}








//codes.forEach(function(x) colors[x.code] = colors[x.category]);
Canvas.prototype = pv.extend(google.maps.OverlayView);

function Canvas(crimes, map){
    this.crimes = crimes;
    this.map = map;
    this.setMap(map);
}





Canvas.prototype.onAdd = function() {
    
    
    this.getPanes().overlayLayer.style['zIndex'] = 104;
    this.canvas = document.createElement("div");
    this.canvas.setAttribute("class", "canvas");
    this.getPanes().overlayMouseTarget.appendChild(this.canvas);
    
   
}


/* Convert the country borders to latlng.*/
      // mariguana_muns.forEach(function(c) {
// 				 c.borders.forEach(function(b) {
// 						       b.forEach(function(p, i) {
// 								     //b[i] = {lat: p[1], lng: p[0]};
// 								     b[i] = new google.maps.LatLng(p[1], p[0]);
// 								 });
// 	  });
// 			     });

// poppy_muns.forEach(function(c) {
// 		       c.borders.forEach(function(b) {
// 					     b.forEach(function(p, i) {
// 							   //b[i] = {lat: p[1], lng: p[0]};
// 							   b[i] = new google.maps.LatLng(p[1], p[0]);
// 						       });
// 					 });
// 		   });






Canvas.prototype.draw = function(){
    
    var projection = this.getProjection();
    
 function transform(d) {
     //d = new google.maps.LatLng(d.Lat, d.Long);
     d = projection.fromLatLngToDivPixel(d.latlon);
     return d3.select(this)
         .style("left", (d.x - padding) + "px")
         .style("top", (d.y - padding) + "px");
      }
    
    
    
    
    
    
    
    var m = this.map;
    var c = this.canvas;
    var r = 100;
    
    if((typeOfHomicide === "DWRH" & yearSlider <= 2006) | typeOfHomicide === "INEGI" & yearSlider > lastHomicideYear) {

	//console.log(crimes)
	r = 200;
	overlay.crimes.splice(0, overlay.crimes.length);
	overlay.crimes.push({latlon : new google.maps.LatLng(23.5, -105.118408)});
	

	var city_pixels = this.crimes.map(function(d) {
					 return projection.fromLatLngToDivPixel(d.latlon);
				     });
	
	
        function x(p) {return p.x;}; function y(p) {return p.y;};
	var x = { min: pv.min(city_pixels, x) - r, max: pv.max(city_pixels, x) + r };
	var y = { min: pv.min(city_pixels, y) - r, max: pv.max(city_pixels, y) + r };
	c.style.width = (x.max - x.min) + "px";
	c.style.height = (y.max - y.min) + "px";
	c.style.left = x.min + "px";
	c.style.top = y.min + "px";
	
	
	vis = new pv.Panel().canvas(c)
	    .left(-x.min)
	    .top(-y.min)
	    .add(pv.Panel)
	    .data(crimes)
	    .add(pv.Label)
	//.radius(function() {return 50 * scaleFactor})
	    .left(function(d) {return projection.fromLatLngToDivPixel(d.latlon).x;})
	    .top(function(d) {return projection.fromLatLngToDivPixel(d.latlon).y;})
	    .textAlign("center")
	    .text("No Data").font("102px sans-serif")
	    .textAngle(-5.5);
	vis.root.render();
	//console.log(-x.min)
	//console.log(pixels)
	return;
    }			
    
    var city_pixels = this.crimes.map(function(d) {
				     return projection.fromLatLngToDivPixel(d.latlon);
				 });
    
    var druglab_pixels = lab_density.map(function(d) {
				     return projection.fromLatLngToDivPixel(d.latlon);
				 });
    

    function x(p) {return p.x;}; function y(p) {return p.y;};
    var x = { min: pv.min(city_pixels, x) - r, max: pv.max(city_pixels, x) + r };
    var y = { min: pv.min(city_pixels, y) - r, max: pv.max(city_pixels, y) + r };
    c.style.width = (x.max - x.min) + "px";
    c.style.height = (y.max - y.min) + "px";
    c.style.left = x.min + "px";
    c.style.top = y.min + "px";
    
    var rad = pv.Scale.root(0, 1600).range(0, 55);
    var colors = pv.Scale.linear(1,14,30,
				 45, 60, 75,
				 90,105, 129).range("#F5F5F5","#F5f5f5","#FCBBA1",
						    "#FC9272", "#FB6A4A", "#EF3B2C", 
						    "#CB181D", "#A50F15","#99000d");
    var oldStrokeStyle = null;
    
    
 
    
    //.event("click", function() {alert();})
    vis = new pv.Panel().canvas(c)
	.left(-x.min)
	.top(-y.min);
    
    
    var methOpacity = pv.Scale.linear(1, 35.02).range(0,.8);
    
    var tempMarCoord, tempPoppyCoord,tempLabCoord, tempPointCoord;

    // vis.add(pv.Panel)
    // 	.data(mariguana_muns)
    
    //     .add(pv.Panel)
    // //.left(-x.min)
    // //	.top(-y.min)
    // 	.data(function(c) {return c.borders;})
    // 	.add(pv.Line)
    // 	.data(function(l) {return l;})
    // 	.left(function(c)  {tempMarCoord = projection.fromLatLngToDivPixel(c);
    // 			    return tempMarCoord.x;})
    // 	.top(function(c) {return tempMarCoord.y;})
    // 	.fillStyle("rgba(76, 187, 23, 0.5)")
    // 	.lineWidth(1)
    //     .visible(mjVisible)
    // 	.strokeStyle("black")
    // 	.title(function(d, b, c) {return c.name;})
    // 	.antialias(false)

    
    
    
    
    // 	.root.add(pv.Panel)
    // 	.data(poppy_muns)
    //     .add(pv.Panel)
    // //.left(-x.min)
    // //	.top(-y.min)
    // 	.data(function(c) {return c.borders;})
    // 	.add(pv.Line)
    // 	.data(function(l) {return l;})
    // 	.visible(false)
    // 	.left(function(c)  {tempPoppyCoord = projection.fromLatLngToDivPixel(c); return tempPoppyCoord.x;})
    // 	.top(function(c) {return tempPoppyCoord.y;})
    // 	.fillStyle("rgba(156, 138, 165, 0.5)")
    // 	.lineWidth(1)
    
    // 	.strokeStyle("black")
    // 	.title(function(d, b, c) {return c.name;})
    // 	.antialias(false)

	vis.root.add(pv.Panel)
	.data(lab_density)
	.add(pv.Dot)
	.visible(methVisible)
	.left(function(d) {return druglab_pixels[this.parent.index].x;})
	.top(function(d) {return druglab_pixels[this.parent.index].y;})
	.radius(function() {
		    if(currentZoom < 7) 
			return 3;
		    else 
			if(currentZoom > 8)
			    return 5;
		    else
			return 7;})
	.fillStyle(function(d) {return "rgba(0, 0, 0, " + methOpacity(d.z) + ")";})
	.strokeStyle("rgba(0, 0, 0, 0)")
    
    
	.root.add(pv.Panel)
	.data(crimes)
        .add(pv.Dot)
	.visible(function(d) {return !(d.code < 20 & currentZoom < 7);})
	.strokeStyle(function(d) {if(d.code < 20 & currentZoom <7) return null;
				  if(d.name != currentCity)
				      return "#444";
                                  else
                                      return "black";})
	.fillStyle(function(d) {  if(d.code < 20 & currentZoom <7) 
                                     return null; 
				  return colors(d.rate > 130 ? 130 :d.rate).alpha(.9);
				  
			       })
	.size(990)
        .cursor("pointer")
	.left(function(d) {return city_pixels[this.parent.index].x;})
	.top(function(d) {return city_pixels[this.parent.index].y;})
	.radius(function(d) {return rad(d.code* 12/numMonths) * scaleFactor ;})
        .lineWidth(function(d) {if(d.name != currentCity)
			        	return 1;
                                else
                                        return 4;})
        .def("active", -1)
        .event("click", function(d) { 
	 
   
		   deleteSelectedShape();
		   
		   if(oldStrokeStyle) {
		       this.strokeStyle("black");
		       old.strokeStyle(function(d, f) {
					   
					   if(d.name == currentCity)
					       return "white";
		    else
			return this.index == this.active() ? "white" : "black";
					   
				       });}
		   old = this;
		   currentCity = d.name;

		   queryHomicideMonth(currentCity);
   
		   return this.root;})
    
        .event("mouseover", function() {this.active(this.index);
					return pv.Behavior.tipsy({gravity: "s", fade: true, html: true }); },  function(){}) 
        .event("mouseout", function() {return this.active(-1);})
	.anchor("center").add(pv.Label)
        .title(function(d) {return d.name;})
	.textStyle("black")
        .font(function(d) {  
		  
		  if(d.code < 70)
		      return rad(70* 12/numMonths) * scaleFactor * .75 + "px sans-serif";
		  else
		      return rad(d.code* 12/numMonths) * scaleFactor * .75 + "px sans-serif";})
	.text(function(x, d) {
		  if(typeOfHomicide == "INEGI"){
		      if (d.code > 250 & d.rate > 15) 
			  return d.code;
		  }
else {
    if (d.code > 250 & d.rate > 10) 
        return d.code;
}
                  if (currentZoom >= 7 && d.code > 20)
                      return d.code;
                  else 
                      return "";});
    
    
    
    
    vis.root.render();
    
};

 



function switchLayers(layer, visible) {
    if(visible) {
	layer.setMap(null);
    }
    else {
	layer.setMap(map);
    }
}

function switchCartoLayers(layer, visible) {
    if(visible) {
	layer.hide();
    }
    else {
	layer.show();
    }
}





function showMJ(){
    switchLayers(mjpathslayer, mjVisible);
    switchCartoLayers(mj_cartodb_gmapsv3, mjVisible);
    mjVisible = !mjVisible;
    changeHash();
    overlay.draw();
}

function showPoppy(){
    switchLayers(poppypathslayer, poppyVisible);
    switchCartoLayers(poppy_cartodb_gmapsv3, poppyVisible);
    poppyVisible = !poppyVisible;
    changeHash();
    overlay.draw();
}

function showMeth(){
    switchLayers(methpathslayer, methVisible);
    methVisible = !methVisible;
    changeHash();
    overlay.draw();
}




var updateHomicidesTable = function(){   
    createTipsy(homtot, homrate, "#h2004", 0, 12);
    createTipsy(homtot, homrate, "#h2005", 12, 24);
    createTipsy(homtot, homrate, "#h2006", 24, 36);
    createTipsy(homtot, homrate, "#h2007", 36, 48);
    createTipsy(homtot, homrate, "#h2008", 48, 60);
    createTipsy(homtot, homrate, "#h2009", 60, 72);
    createTipsy(homtot, homrate, "#h2010", 72, 84);
    //$('#h2011').text("NA");
    
    
    
    $('#n2004').text("NA");
    $('#n2005').text("NA");
    $('#n2006').text("NA");
    createTipsy(drhtot, drhrate, "#n2007", 36, 48);
    createTipsy(drhtot, drhrate, "#n2008", 48, 60);
    createTipsy(drhtot, drhrate, "#n2009", 60, 72);
    createTipsy(drhtot, drhrate, "#n2010", 72, 84); 
    //createTipsy(drhtot, drhrate, "#n2011", 84, 93);  
		      
    var cityText = currentCity;
    switch(cityText) {
	case "José Azueta, Guerrero":
	  cityText = "Zihuatanejo, Guerrero";
	  break;
	case "San Luis Potosí-Soledad de Graciano Sánchez":
	  cityText = "San Luis Potosí" + metroArea;
	  break;
	case "Polygon":
	  cityText = custom_area;
	  break;
    }
    if(cityText.indexOf(",") < 0 & (cityText != all_of_mx_text &
cityText != custom_area))
	  cityText = currentCity + metroArea;
        
    $('#city').text(cityText);
       
};

var createTipsy = function(array, arrayRate, elementId, start, end) {
    function sumArray(previousValue, currentValue) {
	return previousValue + currentValue;
    }
		      var hom12Month = commas(array.slice(start,end).reduce(sumArray));
		      var tipId = elementId.slice(1) + "tip";
		      var tipIdHash = "#" + tipId;
		      $(tipIdHash).tipsy("hide");
		      $(elementId).html('<a id="'+tipId+'" href="#" original-title="<table><tr><td>'+ rate_colon + '</td><td>' + Math.round(pv.mean(arrayRate.slice(start,end))) + '</td></tr><br/><tr><td>'+ population_colon +'</td><td> '+ commas(pv.mean(pop.slice(start,end))) + '">'+hom12Month+'</td></tr></table></a>');
		      
		      $(tipIdHash).tipsy({html: true, gravity: 'e' });
		  };

function queryHomicideMonth() {
    
		
    homrate = []; 
    drhrate = [];
    pop = [];
    drhtot = [];
    homtot = [];
    if(currentCity === all_of_mx_text) {
	 homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
	// datehom = dates;
	// drhtot = alltotdrh;
	// drhrate=alldrhrate;
	// homtot = alltothom;
	// homrate = allhomrate;
	// pop = allpop;
	monthlyData.forEach(function(value, index) {
				homrate.push(value.homrate);
				homtot.push(value.hom);
				drhrate.push(value.drhrate);
				drhtot.push(value.drh);
				pop.push(value.pop);
			    });
	updateHomicidesTable();
	rerenderGraph();
        if(vis != null)
	    vis.root.render();
	return;
    }

    if(currentCity == "Polygon"){
	if(newShape != null) {

	    polyString = "";
	    var t = newShape.getPath().b.concat(newShape.getPath().b[0]);
	    for(var i=0;i<t.length;i++) {
		polyString = polyString + t[i].lng() + " " + t[i]. lat();
		if(i < (t.length-1))
     polyString = polyString + ",";
	    }
	    currentCity = "Polygon";
	    var queryCartodb = "SELECT sum(drh) AS drh, sum(hom) AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM(hom)/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
}
	else if(polyString != "")
	var queryCartodb = "SELECT sum(drh) AS drh, sum(hom) AS hom, ((SUM(drh)/SUM(pop))*100000 * 12) AS drhrate, SUM(hom)/SUM(pop) * 100000 * 12 AS homrate, date, sum(pop) AS pop FROM homicides_web WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((" + polyString +")))', 4326)) GROUP BY date ORDER BY date";
    }

    else
	var queryCartodb = "SELECT drh, hom, drhrate, homrate, date, pop FROM homicides_web WHERE name = " + "'" + currentCity + "'" + " ORDER BY date";
    
    $.getJSON(baseURLCartodb + encodeURIComponent(queryCartodb) + "&callback=?",function(result){
		  monthlyData = result.rows;
		  homrate = [];datehom=[];homtot = [];drhrate = [];drhtot = [];pop = [];
		  for(var i =0; i< monthlyData.length;i++) {
		      monthlyData[i].date = new Date(monthlyData[i].date);
		      drhtot[i] = monthlyData[i]["drh"];
		      drhrate[i] = monthlyData[i]["drhrate"];
		      homtot[i] = monthlyData[i]["hom"];
		      homrate[i] = monthlyData[i]["homrate"];
		      pop[i] = monthlyData[i]["pop"];
		  }
		  changeHash();
		  
		  //var startTime = new Date();
		  updateHomicidesTable();
		  
		  rerenderGraph();
                  if(vis != null)
		      vis.root.render();
		  //var endTime = new Date();		  
		 // console.log(endTime-startTime);
		  
});
    
}






//SELECT sum(drh) AS drhtotal, sum(hom) AS homtotal, date FROM homicides_web  
//WHERE ST_Intersects(the_geom,  GEOMETRYFROMTEXT('MULTIPOLYGON(((-105.5302734375 20.64677721903632, -97.4443359375 15.298608451631088, -93.181640625  20.81117922114718, -104.607421875 21.303306009492623, -105.5302734375 20.64677721903632)))', 4326)) GROUP BY date ORDER BY date


var drawPolygon = function(id, poly){
    // Construct the polygon
		  // Note that we don't specify an array or arrays, but instead just
    // a simple array of LatLngs in the paths property
    var newPoly = new google.maps.Polygon({
					  paths: poly,
					  strokeColor: '#AA2143',
					  strokeOpacity: 1,
					  strokeWeight: 2,
					  fillColor: "#FF6600",
					  fillOpacity: 0.7
				      });
    newPoly.cartodb_id = id;
    newPoly.setMap(map);
    google.maps.event.addListener(newPoly, 'click', function() {
		  		      this.setEditable(true);
				      setSelection(this);
				  });
		  polys.push(newPoly);
};





function toPath(path) {   
    for (var i = 0; i < path.length; i++){
	var coord=path.getAt(i);
	coords.push( coord.lng() + " " + coord.lat() );
	//	payload.coordinates[0][0].push([coord.lng(),coord.lat()])
    }
}

var clearSelection = function() {
    if (selectedShape) {
	//storePoly(selectedShape.getPath(), selectedShape.cartodb_id);
          selectedShape.setEditable(false);
        selectedShape = null;
    }
};

function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
        }
    polyString = "";
    if(myPolygon != null)
          myPolygon.setMap(null);
}


var setSelection = function(shape) {
    clearSelection();
    selectedShape = shape;
    shape.setEditable(false);
    
    //selectColor(shape.get('fillColor') || shape.get('strokeColor'));
};


  //add the overlay canvas
  

function initialize() {
    initializeParameters();
    var myOptions = {
	zoom: Number(currentZoom),
	minZoom: 4,
	center: new google.maps.LatLng(centerLat, centerLong),
	mapTypeId: google.maps.MapTypeId.ROADMAP,
	streetViewControl: false,
	panControl: false
    };
    
    map = new google.maps.Map(document.getElementById("map"),
				  myOptions);
    mj_cartodb_gmapsv3 = new google.maps.CartoDBLayer({
      map_canvas: 'map',
      map: map,
      user_name:'diegovalle',
      table_name: 'mariguana',
      query: "SELECT * FROM mariguana",
      map_style: false,
      infowindow: false,
      auto_bound: false
    });
    poppy_cartodb_gmapsv3 = new google.maps.CartoDBLayer({
      map_canvas: 'map',
      map: map,
      user_name:'diegovalle',
      table_name: 'poppy',
      query: "SELECT * FROM poppy",
      map_style: false,
      infowindow: false,
      auto_bound: false
    });
    mj_cartodb_gmapsv3.show(); //#4CBB17
    poppy_cartodb_gmapsv3.hide(); //#9c8aa5
    var styledMapType = new google.maps.StyledMapType(style, {
							  map: map,
							  name: 'Styled Map'
						      });
    map.mapTypes.set('map-style', styledMapType);
    map.setMapTypeId('map-style');
    
    
    
    google.maps.event.addListener(map, "center_changed", function() {
				      var ctr = map.getCenter();
				      centerLat = ctr.lat();
				      centerLong = ctr.lng();
				      changeHash();
				  });
    
    google.maps.event.addListener(map, "zoom_changed", function() {
				      currentZoom = map.getZoom();
				      if (currentZoom >= 6)
					  scaleFactor = 1;
				      else
					  scaleFactor = .5;
				      if( currentZoom <= 4)
					  scaleFactor = .3;
				      changeHash();
				      
				      
				  });

    mjpathslayer = new google.maps.FusionTablesLayer(mj_paths, {
							 suppressInfoWindows: true,
							 clickable: false
						     });
    mjpathslayer.setQuery("SELECT 'geometry' FROM " + mj_paths);
    if(document.getElementById('mjCheck').checked == true)
	mjpathslayer.setMap(map);

   poppypathslayer = new google.maps.FusionTablesLayer(poppy_paths, {
							   suppressInfoWindows: true,
							   clickable: false
						       });
    poppypathslayer.setQuery("SELECT 'geometry' FROM " + poppy_paths);
    if(document.getElementById('poppyCheck').checked == true)
	poppypathslayer.setMap(map);

    methpathslayer = new google.maps.FusionTablesLayer(meth_paths, {
							   suppressInfoWindows: true,
							   clickable: false
						       });
    methpathslayer.setQuery("SELECT 'geometry' FROM " + meth_paths);
    if(document.getElementById('methCheck').checked == true)
	methpathslayer.setMap(map);
    
    if(parameters["mariguana"] != null){
	mjVisible = parameters["mariguana"] == "true";
	if(mjVisible){
	    $("#mjCheck").prop("checked", true);
	    //mj_cartodb_gmapsv3.hide();
	}
	else {
	    $("#mjCheck").prop("checked",false);
	    mjpathslayer.setMap(null);
	    mj_cartodb_gmapsv3.hide();
	}
    }
    if(parameters["poppy"] != null){
	poppyVisible = parameters["poppy"] == "true";
	if(poppyVisible) {
	    $("#poppyCheck").prop("checked", true);
	    poppypathslayer.setMap(map);
	    poppy_cartodb_gmapsv3.show();
	}
    }
    if(parameters["meth"] != null){
	methVisible = parameters["meth"] == "true";
	if(methVisible) {
	    $("#methCheck").prop("checked", true);
	    methpathslayer.setMap(map);
	}
    }
    if(parameters["cocaine"] != null){
	cocaineVisible = parameters["cocaine"] == "true";
	if(cocaineVisible) {
	    $("#cocaineCheck").prop("checked", true);
	    //cocainepathslayer.setMap(map);
	}
    }
    var drawingManager = new google.maps.drawing.DrawingManager({
		       drawingControl: true,
								    drawingControlOptions: {
									position: google.maps.ControlPosition.TOP_LEFT,
									drawingModes: [google.maps.drawing.OverlayType.POLYGON]
								},
								    polygonOptions: {
									fillColor: '#0099FF',
									fillOpacity: 0.7,
									strokeColor: '#AA2143',
									strokeWeight: 2,
									clickable: true,
									zIndex: 1,
									editable: true
								    }
								});
    
    drawingManager.setMap(map);
    google.maps.event.addListener(drawingManager, 'drawingmode_changed', function(){
				      
				      if(lastModePoly == false)
					  deleteSelectedShape();
				      else
					  lastModePoly = !lastModePoly;});
    google.maps.event.addListener(drawingManager, 'overlaycomplete', function(e) {
				      // Add an event listener that selects the newly-drawn shape when the user
				      // mouses down on it.
				      newShape = e.overlay;
				      newShape.type = e.type;
				      google.maps.event.addListener(newShape, 'click', function() {
									setSelection(this);
								    });
				      setSelection(newShape);
				      currentCity = "Polygon";
				      queryHomicideMonth();
				      //storePoly(newShape.getPath());
				      newShape.setEditable(false);
				      // Switch back to non-drawing mode after drawing a shape.
				      lastModePoly = true;
				      changeHash();
				      drawingManager.setDrawingMode(null);
				  });

    
    
    if(myPolygon != null)
	myPolygon.setMap(map);
    $('#mediumSelect').change(function() {
				  typeOfHomicide = (typeOfHomicide === "INEGI" ? "DWRH" : "INEGI");
				  queryData();
				  changeHash();
			      
			      });
    overlay = new Canvas(crimes, map);
    queryData();
    queryHomicideMonth();

    //setup a warning if link length exceeds 2083 characters
    warningLongLinksIE();
    //Clipboard copying
    $("#maplink").attr("value", getLocation() );
    //You must supply an afterCopy function to supress the annoying dialog that pops up after ciopyn
    $('#modal-share').bind('shown', function () {
			    if(!shownModalButton) {
				shownModalButton = true;
				$('button#copy_button').zclip({
				  path:'http://diegovalle.github.com/drug-war-interactive-map/js/ZeroClipboard.swf',
				  copy:function(){return $('input#maplink').val();},
				  afterCopy: function() {return true;}
			     });
			  
			    }
		    
			       var baseShorten = "http://ilsevalle.com/shorten.php?url=";
			       shortUrlShare = getShareURL();
			       $.ajax({
        url : baseShorten + encodeURIComponent(getShareURL()) + '&jsoncallback=?',//php script to shorten with bit.ly
        dataType : "json",
        type : "GET",
        data : {
            url : getLocation()
        },
        success : function(data) {
            if(data.status_txt === "OK")
                shortUrlShare = data.data.url;
	    else
		shortUrlShare = getShareURL();
        },
        error : function(xhr, error, message) {
            //no success, fallback to the long url
            shortUrlShare = getShareURL();
        }
    });
				   
//$.getJSON(baseShorten + getLocation() + '&jsoncallback=?', function(data) { shortUrl = data.url;});
			      
			   
			});
    
}


function initializeParameters() {

    //To speed up the code pre-convert the lat and longitudes of the 2d drug lab density estimate to google latlon objects
    lab_density = lab_density.map(function(d) {return {latlon: new google.maps.LatLng(d.y, d.x),
				     z : d.z};});

    parameters = $.deparam(document.location.hash);
    if(parameters["start"] != null){
        startDate = parameters["start"];
	changed = true;
    }
    if(parameters["end"] != null){
        endDate = parameters["end"];
	changed = true;
    }
    yearSlider = startDate.substring(0,4);
    numMonths = monthDiff(new Date(startDate), new Date(endDate))+1;
    transitionTable(2004, yearSlider);

    function changeTableColors(str, yearLast, yearCurrent) {
	var idTableLast = str + yearLast;
	var idTableCurrent = str + yearCurrent;
	$(idTableLast).css("background-color", "#F9F9F9");
	$(idTableCurrent).css("background-color", "#F6E493");
    }
    function transitionTable(yearLast, yearCurrent) {
	changeTableColors("#y",yearLast, yearCurrent);
	changeTableColors("#n",yearLast, yearCurrent);
	changeTableColors("#h",yearLast, yearCurrent);
    }
   
    $(function() {
	  $( "#slider" ).slider({
				    min: 2004,
				    max: 2010,
				    value: yearSlider,
				    stop: function(e, ui) {
					transitionTable(yearSlider, ui.value);
					yearSlider = ui.value;
					startDate =  ui.value + "-01-15";
					endDate =  ui.value + "-12-15";
					numMonths = numMonths = monthDiff(new Date(startDate), new Date(endDate))+1;
					queryData();
					changeHash();
					
				    },
				    slide: function(e, ui){
					document.getElementById('slider').firstChild.innerHTML = ui.value;
					
       
				    }
				});
      });



    if(parameters["#city"] != null){
	currentCity = parameters["#city"];
	changed = true;
    }
    
    
    
    if(parameters["zoom"] != null){
	currentZoom = parameters["zoom"];
	if (currentZoom >= 6)
	    scaleFactor = 1;
	else
	    scaleFactor = .5;
	if( currentZoom <= 4)
	    scaleFactor = .3;
    }
    
    if(parameters["clat"] != null){
	centerLat = parameters["clat"];
    };
    if(parameters["clong"] != null){
	centerLong = parameters["clong"];
    };
    if(parameters["homtype"] != null){
	typeOfHomicide = parameters["homtype"];
	$('#mediumSelect').val(typeOfHomicide);
    };
    
    if(parameters["polygon"] != null){
	polyString = parameters["polygon"];
	var t = polyString.split(",");
	for(var i =0;i < t.length;i++) {
	    coords.push(new google.maps.LatLng(Number(t[i].split(" ")[1]), 
					       Number(t[i].split(" ")[0]) ));
	}
	
	myPolygon = new google.maps.Polygon({
						paths: coords,	
						strokeColor: '#AA2143',
						strokeOpacity: 1,
						strokeWeight: 2,
						fillColor: "#0099FF",
						fillOpacity: 0.7
						
					    });
    }
    
}
//

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    //months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months;
}


var x = pv.Scale.linear(start, end.setMonth(end.getMonth()+1)).range(0, w),
y = pv.Scale.linear(0, pv.max(homrate.concat(drhrate))).range(0, h);

function createGraph(){
    //var x = pv.Scale.linear(data, function(d) d.x).range(0, w),
    //  y = pv.Scale.linear(0, pv.max(hom)).range(0, h);
    
    visChart = new pv.Panel()
	.width(w)
	.height(h)
	.bottom(20)
	.left(40)
	.top(17)
	.fillStyle("#e5e5e5");
    
    
    
    
    /* X-axis ticks. */
    visChart.add(pv.Rule)
	.data(x.ticks())
	.left(x)
	.strokeStyle(function(d) {return d ? "#fff" : "000";})
	.add(pv.Rule)
	.bottom(-4)
	.height(4)
	.strokeStyle("#888888")
	.anchor("bottom").add(pv.Label)
	.bottom(6)
	.text(x.tickFormat);



/* Y-axis ticks. */
    visChart.add(pv.Rule)
	.data(function() {return y.ticks(3);})
	.bottom(y)
    .visible(function(d) {return d;})
	.strokeStyle("#fff")
	.anchor("left")
	.add(pv.Rule)
	.left(-3.8)
	.height(1)
        
	.strokeStyle("#888888")
	.anchor("left")
	.add(pv.Label)
	.left(-1)
	.text(y.tickFormat);
    
 /*   visChart.add(pv.Rule)
	.left(0);
    
    visChart.add(pv.Rule)
	.bottom(0);*/
    
    /* Y-axis label */
    visChart.add(pv.Label)
	.data([annual_rate])
	.left(function() {
		  //The number of digits in a number, -27 is the farthest we allow the 
		  //y axis label to be
		  var left = ((Math.log(y.domain()[1] / 10) / Math.log(10)+1) * -8) -8;
		  return left < -27 ? -27 : left;
	      })
	.bottom(h/2)
	.font("10pt Arial")
	.textAlign("center")
	.textAngle(-Math.PI/2);

  /*  visChart.add(pv.Rule)
	.data(function() {return gethomicideData();})
	.left(function(d) {return x(d.x);})
	.bottom(-4)
	.lineWidth(5)
	.strokeStyle(function() {return (activeChart == this.index) ? "#efefef" : "transparent";});
    */
    var line = visChart.add(pv.Line)
        .data(function() {return monthlyData.slice(0, 
						   getIndex(endHomicides)+1);})
        .bottom(function(d)  {return y(d.homrate);})
        .left(function(d)  {return x(d.date);})
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle("#004b62")
        .text(y.tickFormat)
        .text(function(d)  {return y(d);})
	;
    
    
    
    
    
  

    
    var line2 = visChart.add(pv.Line)
//Slice the data at 35 (Dec 2006) cause otherwise we get a blank line because
//of the null values in the drug war homicide data
        .data(function() {return monthlyData.slice(getIndex(startDWRH), 
						   monthlyData.length);})
        .bottom(function(d)  {return y(d.drhrate);})
	.event("point",  function(d) {this.active(this.index);return visChart;})
        .left(function(d)  {return x(d.date);})
        .lineWidth(2.5)
	.antialias(true)
        .strokeStyle("#4eb4da");
    
    
    
    var homDot = line.add(pv.Dot)
	.visible(function(d) {return interDRH2 >= 0;})
	.data(function() {return [monthlyData[interDRH2]];})
	.fillStyle(function() {return line.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    //A caption for when you hover above the homicide lines
    homDot.add(pv.Dot)
	.left(10)
	.top(10)
	.anchor("right")
	.add(pv.Label).textStyle("#222")
	.text(function(d) {
		  if(d.hom != null) 
		      return monthName[d.date.getMonth()] + " "+ d.date.getFullYear() + rate_chart + d.homrate.toFixed(0) +" (" + d.hom + total_homicides_chart;});


    var drhDot = line2.add(pv.Dot)
	.visible(function(d) {return interDRH >= 0;})
	.data(function()  {return [monthlyData[interDRH]];})
	.fillStyle(function()  {return line2.strokeStyle();})
	.strokeStyle("#000")
	.size(20)
	.lineWidth(1);
    
//A caption for when you hover above the homicide lines
    drhDot.add(pv.Dot)
	.left(10)
	.top(25)
	.anchor("right").add(pv.Label).textStyle("#222")
	.text(function(d) {if(d.drh != null) return monthName[d.date.getMonth()] + " "+ d.date.getFullYear() + " rate: " + d.drhrate.toFixed(0) +" (" + d.drh + dw_r_homicides_text;});

    
    
    
    visChart.add(pv.Bar)
	.fillStyle("rgba(0,0,0,.001)")
	.event("mouseout", function() {
		   interDRH = -1;
		   interDRH2 = -1;
		   return visChart;
	       })
	.event("mousemove", function(d) {
		   var mx2 = x.invert(visChart.mouse().x);
		   mx2 = new Date(mx2.getFullYear(), mx2.getMonth(), 15);
		   
		   interDRH = pv.search(monthlyData.map(function(d) {return d.date;}), mx2);
		   //alert([gethomicideData()][0]);
		   interDRH = interDRH < 0 ? (-interDRH - 2) : interDRH;
		   interDRH2 = interDRH;
		   if((mx2.getFullYear() < 2006) | (mx2.getFullYear() <= 2006 & mx2.getMonth() < 11))
		       interDRH = -1;
		   if(mx2.getFullYear() > lastHomicideYear)
		       interDRH2 = -1;
        
		   return visChart;
	       });
    
    

    visChart.add(pv.Label)
	.textAlign("left")
	.text(function(d) {return total_homicides;})
	.left(15)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.height(3)
	.fillStyle("#004b62")
	.size(15)
	.left(10)
	.top(-11)
    
	.add(pv.Label)
	.def("active", -1)
	.textAlign("left")
	.text(function(d) {return drug_war_homicides;})
	.left(125)
	.top(-4)
	.font("9pt sans-serif")
	.add(pv.Dot)
	.strokeStyle(null)
	.fillStyle("#4eb4da")
	.size(15)
	.left(120)
	.top(-11);
    
    
   

    getEvents = function() {
	var rangei = [];
	if(currentCity.indexOf(all_of_mx_text) >= 0) {
	    rangei = [drug_war_date];
	    tip = [drug_war_text];
	}
	if(currentCity.indexOf("Veracruz") >= 0) {
	    rangei = [op_veracruz];
	    tip = [op_veracruz_text];
	}
	if(currentCity.indexOf("Juárez") >= 0) {
	    rangei = [op_chihuahua, op_reinforcements];
	    tip = [chihuahua_text, reinforcements_text];
	}
	if(currentCity.indexOf("Chihuahua") >= 0) {
	    rangei = [op_chihuahua];
	    tip = [chihuahua_text];
	}
	if(currentCity.indexOf("Nogales, ") >= 0) {
	    rangei = [mochomo_date];
	    tip = [mochomo_text];
	}
	if(currentCity.indexOf(", Michoacán") >= 0) {
	    rangei = [op_michoacan, op_michoacan2];
	    tip = [op_michoacan_text, op_michoacan2_text];
	}
	if(currentCity.indexOf("Culiacán") >= 0 ||
	   currentCity.indexOf("Navolato") >= 0) {
	    rangei = [op_marlin, op_culiacan];
	    tip = [op_marlin_text, op_culiacan_text];
	}
	if(currentCity.indexOf("Ahome, Sinaloa") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sinaloa") >= 0 ||
	   currentCity.indexOf("Guasave, Sinaloa") >= 0 ||
	   currentCity.indexOf("Sinaloa, Sinaloa") >= 0 ||
	   currentCity.indexOf("Salvador Alvarado, Sinaloa") >= 0 ||
	   currentCity.indexOf("Mocorito, Sinaloa") >= 0 ||
	   currentCity.indexOf("El Fuerte, Sinaloa") >= 0 ||
	   currentCity.indexOf("Angostura, Sinaloa") >= 0) {
	    rangei = [abl_date];
	    tip = [abl_text];
	}
	if(currentCity.indexOf("Mazatlán") >= 0 ||
	   currentCity.indexOf("Salvador Alvarado") >= 0) {
	    rangei = [op_culiacan2];
	    tip = [op_culiacan2_text];
	}
	if(currentCity.indexOf("Durango") >=0) {
	    rangei = [op_tri_dor];
	    tip = [tri_dor_text];
	}
	if(currentCity == "Nuevo Laredo") {
	    rangei = [awb, op_mx_secure, zetas_vs_cdg];
	    tip = [awb_text, op_mx_secure_text, zetas_vs_cdg_text];
	}
	if(currentCity == "Monterrey") {
	    rangei = [awb, op_nl_tam,
                      zetas_vs_cdg];
	    tip = [awb_text, op_nl_tam_text, 
		   zetas_vs_cdg_text];
	}
	if(currentCity == "La Laguna") {
	    rangei = [op_la_laguna, zetas_vs_cdg];
	    tip = [op_la_laguna_text, zetas_vs_cdg_text];
	}
	if(currentCity == "Tijuana") {
	    rangei = [op_tijuana, jail_riots, teo_date];
	    tip = [op_tijuana_text, jail_riots_text, teo_text];
	}
	if(currentCity == "Acapulco") {
	    rangei = [op_guerrero, capture_barbie];
	    tip = [op_guerrero_text, capture_barbie_text];
	}
	if(currentCity.indexOf("Tamaulipas") >= 0 || currentCity.indexOf("Nuevo León") >= 0
	   || currentCity.indexOf("Tampico") >= 0 || currentCity.indexOf("Reynosa") >= 0
	   || currentCity.indexOf("Matamoros") >= 0
	   || currentCity.indexOf("Ciudad Valles") >= 0) {
	    rangei = [zetas_vs_cdg];
	    tip = [zetas_vs_cdg_text];
	}
	if(currentCity.indexOf("Jalisco") >= 0 || currentCity.indexOf("Nayarit") >= 0
	   || currentCity.indexOf("Colima") >= 0
	   || currentCity.indexOf("Tepic") >= 0
	   || currentCity.indexOf("Guadalajara") >= 0
	   || currentCity.indexOf("Colima-Villa de Alvarez") >= 0
	   || currentCity.indexOf("Tecomán") >= 0
	   || currentCity.indexOf("Puerto Vallarta") >= 0) {
	    rangei = [mochomo_capture, nacho_kidnapping];
	    tip = [mochomo_capture_text, nacho_kidnapping_text];
	}
	if(currentCity.indexOf("Cuernavaca") >= 0) {
	    rangei = [mochomo_capture, abl_killed];
	    tip = [mochomo_capture_text, abl_killed_text];
	}
	if(currentCity.indexOf(", Guerrero") >= 0) {
	    rangei = [mochomo_capture];
	    
	    tip = [mochomo_capture_text];
	}
	if(currentCity.indexOf("Valle de México") >= 0) {
	    rangei = [mistake_df];
	    
	    tip = [mistake_df_text];
	}
        rangei = rangei.map(getIndex);
	return data = rangei
	    .map(function(i) {
		     return ({
			date: new Date(monthlyData[i].date),
			max: pv.max([monthlyData[i].homrate, 
				     monthlyData[i].drhrate]),
			max12: pv.max(
			    homrate.slice(
				  i - 12 < 0 ? 0 : i - 12, i + 3)
				.concat(drhrate.slice(i - 12 < 0 ? 0 : i - 12, i + 3)))
			    });
		 });
    };
    
 

    var whiteDotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
	.bottom(function(d)  {return y(d.max);})
	.left(function(d)  {return x(d.date);})
	.size(10)
	.lineWidth(1)
	.antialias(true)
	.fillStyle("white")
	.strokeStyle("black");
    
    var dotOffset = 70;
    
    var dotLine = visChart.add(pv.Dot)
	.data(function() {return getEvents();})
    //.bottom(function(d) y(d.y))
	.bottom(function(d) {return (y(d.max12) + dotOffset)  > h ? 180 : y(d.max12) + dotOffset;})
	.left(function(d)  {return x(d.date);})
	.fillStyle("black")
	.strokeStyle(null)
    //.event("mousemove", function(d) {activeLine=true;return visChart})
	.event("mouseover", function() {
		   pv.Behavior.tipsy("disable").apply(this, arguments); 
		   pv.Behavior.tipsy({gravity: "e", fade: true, html: true}).apply(this, arguments); 
		   activeLine=true; 
		   return visChart;
	       }) 
	.event("mouseout", function() {activeLine = false;return visChart;}) 
	.textAlign("right")
	.text(function(d) {return tip[this.index]; }); 
    
    visChart.add(pv.Rule)
    .data(function() {return getEvents();})
    .left(function(d) {return x(d.date);})
    .top(function(d) {return (y(d.max12) + dotOffset)  > h ? 4 : h+4-(y(d.max12) + dotOffset);})
    .bottom(function(d) {return y(d.max)+4;})
    .strokeStyle("#666")
 .textAlign("right")
    .text(function(d) {return tip[this.index] ;});




}




function rerenderGraph() {
    $('div[style^="position: absolute; width: 9px;"]').remove();
    $(".tipsy-e").remove();
    if (visChart == null)
        createGraph();
    y.domain(0, pv.max(homrate.concat(drhrate))).nice();	  
    visChart.render();
   		  
    
}



function getIndex(idx) {
    idx = new Date(idx);
    return ((idx.getYear() - 104) * 12) + idx.getMonth();
}

/* Converts homtot, drhtot to a nicely formatted csv file*/
function convertToCSV(){
    
    var line = csvHeaders + '\r\n';
    for (var i = 0; i < homtot.length; i++) {
        var hom = monthlyData[i].hom == null ? "NA" : monthlyData[i].hom;
	var drh =  monthlyData[i].drh == null ? "NA" : monthlyData[i].drh;
        line += (monthlyData[i].date).getFullYear() + "-" + monthName[monthlyData[i].date.getMonth()] + "," + hom + "," + drh + "," + monthlyData[i].pop + '\r\n';
    }
    if(currentCity != "Polygon")
	line += location_text + currentCity;
    else
        line += all_municipalities_text + polyString.replace(/,/g, "/").replace(/ /g, ":");
    return Base64.encode(line);
}

//http://stackoverflow.com/questions/246801/how-can-you-encode-to-base64-using-javascript
var Base64 = {

// private property
_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

// public method for encoding
encode : function (input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;

    input = Base64._utf8_encode(input);

    while (i < input.length) {

        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
        this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
        this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

    }

    return output;
},

// public method for decoding
decode : function (input) {
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Base64._utf8_decode(output);

    return output;

},

// private method for UTF-8 encoding
_utf8_encode : function (string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

        var c = string.charCodeAt(n);

        if (c < 128) {
            utftext += String.fromCharCode(c);
        }
        else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        }
        else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }

    }

    return utftext;
},

// private method for UTF-8 decoding
_utf8_decode : function (utftext) {
    var string = "";
    var i = 0;
    var c = c1 = c2 = 0;

    while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
            string += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224)) {
            c2 = utftext.charCodeAt(i+1);
            string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
            i += 2;
        }
        else {
            c2 = utftext.charCodeAt(i+1);
            c3 = utftext.charCodeAt(i+2);
            string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }

    }

    return string;
}

};