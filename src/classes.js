'use strict';

const TleJsLibrary  = require('tle.js');
const MomentLibrary = require('moment');
const CesiumLibrary = require('cesium/Source/Cesium');

class OrbitPolylineDrawer {
    constructor(cesiumMapObject) {
        this._cesiumMapObject = cesiumMapObject;
        this._tle = new TleJsLibrary();
        this._twoLineElement = null;
        this._orbitPolyline = null;
    }

    get twoLineElement() {
        return this._twoLineElement;
    }

    set twoLineElement(twoLineElementString) {
        this._twoLineElement = twoLineElementString;
        this._draw();
    }

    _draw() {
        var satelliteOrbit = [];
        var newTime = null;
        var coordinates = null;
        for (var i of [...Array(150).keys()])
        {
            newTime = MomentLibrary().add(i * 10, 'minutes');
            coordinates = this._tle.getLatLon(this.twoLineElement, newTime.valueOf());
            satelliteOrbit.push(coordinates.lng);
            satelliteOrbit.push(coordinates.lat);
            satelliteOrbit.push(404.8 * 1000);
        }
        if (this._orbitPolyline) this._cesiumMapObject.entities.remove(this._orbitPolyline);
        this._orbitPolyline = this._cesiumMapObject.entities.add({
            name: 'Orbit Polyline',
            polyline: {
                positions: CesiumLibrary.Cartesian3.fromDegreesArrayHeights(satelliteOrbit),
                width: 5,
                followSurface: true,
                material: new CesiumLibrary.PolylineArrowMaterialProperty(CesiumLibrary.Color.RED)
            }
        });
    }
}

class OrbitPointsDrawer {
    constructor(cesiumMapObject) {
        this._cesiumMapObject = cesiumMapObject;
        this._tle = new TleJsLibrary();
        this._twoLineElement = null;
        this._orbitPoints = [];
    }

    get twoLineElement() {
        return this._twoLineElement;
    }

    set twoLineElement(twoLineElementString) {
        this._twoLineElement = twoLineElementString;
        this._draw();
    }

    _draw() {
        if (this._orbitPoints.length != 0)
        {
            for (var op of this._orbitPoints)
                this._cesiumMapObject.entities.remove(op);
        }

        var newTime = null;
        var coordinates = null;
        for (var i of [...Array(25).keys()]) {
            newTime = MomentLibrary().add(i, 'hours');
            coordinates = this._tle.getLatLon(this._twoLineElement, newTime.valueOf());
            this._orbitPoints.push(this._cesiumMapObject.entities.add({
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
    }
}

module.exports = exports = {
    "OrbitPointsDrawer": OrbitPointsDrawer,
    "OrbitPolylineDrawer": OrbitPolylineDrawer,
}