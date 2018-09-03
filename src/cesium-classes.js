'use strict';

const CesiumLibrary = require('cesium/Source/Cesium');
const MomentLibrary = require('moment');

class CesiumWithCorrectedReflectance {
    constructor(domElement) {
        this.cesiumViewer = new CesiumLibrary.Viewer('cesiumContainer',
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
            terrainProvider : CesiumLibrary.createWorldTerrain(),
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
    }
}

module.exports = exports = {
    "CesiumWithCorrectedReflectance": CesiumWithCorrectedReflectance,
}
