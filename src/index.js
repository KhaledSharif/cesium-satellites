var MomentLibrary = require('moment');
require('cesium/Source/Widgets/widgets.css');
require('./main.css');
var CesiumLibrary = require('cesium/Source/Cesium');
const TLEJS = require('tle.js');
const tle = new TLEJS();

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

var CesiumViewer = new CesiumLibrary.Viewer('cesiumContainer',
{
    shadows: true,
    animation: false,
    baseLayerPicker: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    infoBox: false,
    sceneModePicker: false,
    selectionIndicator: false,
    timeline: false,
    navigationHelpButton: false,
    navigationInstructionsInitiallyVisible: false,
    sceneMode : CesiumLibrary.SceneMode.SCENE3D,
    terrainProvider : new CesiumLibrary.CesiumTerrainProvider({
        url : 'https://assets.agi.com/stk-terrain/v1/tilesets/world/tiles'
    }),
    imageryProvider : new CesiumLibrary.WebMapTileServiceImageryProvider({
        url : 
            'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/'+
            MomentLibrary().subtract(1, 'days').format("YYYY-MM-DD") +
            '/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.jpg',
        layer : 'VIIRS_SNPP_CorrectedReflectance_TrueColor',
        style : 'default',
        tileMatrixSetID : 'GoogleMapsCompatible_Level9',
        maximumLevel : 5,
        format : 'image/jpeg',
        credit : new CesiumLibrary.Credit({text : 'NASA Global Imagery Browse Services for EOSDIS'})
    }),
    mapProjection : new CesiumLibrary.WebMercatorProjection()
});

fetch('stations.txt')
.then(response => response.text())
.then(function(text)
{
    Window.twoLineElements = text.match(/[^\r\n]+/g);
})
.then(function()
{
    const listSelector = document.getElementById("list-of-satellites");
    var iterator = 0;
    while (iterator < Window.twoLineElements.length)
    {
        listSelector.appendChild(htmlToElement(
            '<a class="list-group-item" value="' + iterator.toString() + '">' + Window.twoLineElements[iterator] + '</a>'
        ));
        iterator += 3;
    }
    Array.from(listSelector.children).forEach(function (element) {
        element.onclick = function () {
            Window.tleIndex = parseInt(this.getAttribute("value"));
            Window.drawOrbit();
        };
    }); 
});

Window.drawOrbit = function()
{
    var tleStr = [
        Window.twoLineElements[Window.tleIndex],
        Window.twoLineElements[Window.tleIndex + 1],
        Window.twoLineElements[Window.tleIndex + 2],
    ].join("\n");
    var issOrbit = [];
    var timesArray = [];

    if (Window.orbitPoints) {
        for (var op of Window.orbitPoints)
        {
            CesiumViewer.entities.remove(op);
        }
    }
    Window.orbitPoints = [];
    for (var i of [...Array(100).keys()])
    {
        var newTime = MomentLibrary().add(i * 10, 'minutes');
        timesArray.push(newTime);
        var coordinates = tle.getLatLon(tleStr, newTime.valueOf());
        issOrbit.push(coordinates.lng);
        issOrbit.push(coordinates.lat);
        issOrbit.push(404.8 * 1000);
    }
    for (var i of [...Array(100).keys()])
    {
        var newTime = MomentLibrary().add(i, 'hours');
        if (newTime >= timesArray[timesArray.length - 1]) break;
        var coordinates = tle.getLatLon(tleStr, newTime.valueOf());
        Window.orbitPoints.push(CesiumViewer.entities.add({
            position : CesiumLibrary.Cartesian3.fromDegrees(coordinates.lng, coordinates.lat, 404.8 * 1000),
            point : {
                pixelSize : 5,
                color : CesiumLibrary.Color.RED,
                outlineColor : CesiumLibrary.Color.WHITE,
                outlineWidth : 2
            },
            label : {
                text : newTime.fromNow(),
                font : '14pt monospace',
                style: CesiumLibrary.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth : 2,
                verticalOrigin : CesiumLibrary.VerticalOrigin.TOP,
                pixelOffset : new CesiumLibrary.Cartesian2(0, 32)
            }
        }));
    }
    if (Window.orbitPolyline) CesiumViewer.entities.remove(Window.orbitPolyline);
    Window.orbitPolyline = CesiumViewer.entities.add({
        name: 'Orbit Polyline',
        polyline: {
            positions: CesiumLibrary.Cartesian3.fromDegreesArrayHeights(issOrbit),
            width: 5,
            followSurface: true,
            material: new CesiumLibrary.PolylineArrowMaterialProperty(CesiumLibrary.Color.RED)
        }
    });
};
