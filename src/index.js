const MomentLibrary = require('moment');
const CesiumWidgetsCss = require('cesium/Source/Widgets/widgets.css');
const MiscStyling = require('./main.css');
const CesiumLibrary = require('cesium/Source/Cesium');
const AdditionalClasses = require('./classes.js');

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

var orbitPointsDrawer   = new AdditionalClasses.OrbitPointsDrawer(CesiumViewer);
var orbitPolylineDrawer = new AdditionalClasses.OrbitPolylineDrawer(CesiumViewer);

var twoLineElements = null;

function drawOrbit(_twoLineElement)
{
    orbitPointsDrawer.twoLineElement = _twoLineElement;
    orbitPolylineDrawer.twoLineElement = _twoLineElement;
}

fetch('stations.txt')
    .then(response => response.text())
    .then(function(text)
    {
        twoLineElements = text.match(/[^\r\n]+/g);
    })
    .then(function()
    {
        const listSelector = document.getElementById("list-of-satellites");
        var iterator = 0;
        while (iterator < twoLineElements.length)
        {
            listSelector.appendChild(htmlToElement(
                '<a class="list-group-item" value="' + iterator.toString() + '">' + twoLineElements[iterator] + '</a>'
            ));
            iterator += 3;
        }
        Array.from(listSelector.children).forEach(function (element) {
            element.onclick = function() {
                var tleIndex = parseInt(this.getAttribute("value"));
                drawOrbit([
                    twoLineElements[tleIndex],
                    twoLineElements[tleIndex+1],
                    twoLineElements[tleIndex+2],
                ].join("\n"));
            };
        });
    });


