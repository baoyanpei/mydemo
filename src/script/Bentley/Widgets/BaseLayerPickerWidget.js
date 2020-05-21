define("BaseLayerPickerWidget", [], function () {
    function e(e, t) {
        var n = this._createBaseLayerPickerOptions(t);
        this.baseLayerPicker = new Cesium.BaseLayerPicker(e, n)
    }

    function t(e) {
        switch (e) {
            case "stk":
                return new Cesium.CesiumTerrainProvider({
                    url: "https://assets.agi.com/stk-terrain/world",
                    requestVertexNormals: !0
                });
            default:
                return new Cesium.EllipsoidTerrainProvider({
                    ellipsoid: Cesium.Ellipsoid.WGS84
                })
        }
    }

    function n(e) {
        switch (e) {
            case "stk":
                return new Cesium.ProviderViewModel({
                    name: "STK World Terrain Meshes",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/TerrainProviders/STK.png"),
                    tooltip: "High-resolution, mesh-based terrain for the entire globe. Free for use on the Internet. Closed-network options are available. http://www.agi.com",
                    creationFunction: function () {
                        return t("stk")
                    }
                });
            default:
                return new Cesium.ProviderViewModel({
                    name: "WGS84 Ellipsoid",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/TerrainProviders/Ellipsoid.png"),
                    tooltip: "WGS84 standard ellipsoid, also known as EPSG:4326",
                    creationFunction: function () {
                        return t("ellipsoid")
                    }
                })
        }
    }

    function r(e) {
        switch (e) {
            case "NaturalEarth":
                return Cesium.createTileMapServiceImageryProvider({
                    url: Cesium.buildModuleUrl("Assets/Textures/NaturalEarthII")
                });
            case "BlackMarble":
                return Cesium.createTileMapServiceImageryProvider({
                    url: "https://cesiumjs.org/blackmarble",
                    credit: "Black Marble imagery courtesy NASA Earth Observatory",
                    flipXY: !0
                });
            case "BingMapsRoads":
                return new Cesium.BingMapsImageryProvider({
                    url: "https://dev.virtualearth.net",
                    mapStyle: Cesium.BingMapsStyle.ROAD
                });
            case "BingMapsAerial":
                return new Cesium.BingMapsImageryProvider({
                    url: "https://dev.virtualearth.net",
                    mapStyle: Cesium.BingMapsStyle.AERIAL
                });
            case "BingMapsAerialWithLabels":
                return new Cesium.BingMapsImageryProvider({
                    url: "https://dev.virtualearth.net",
                    mapStyle: Cesium.BingMapsStyle.AERIAL_WITH_LABELS
                });
            case "MapboxSatellite":
                return new Cesium.MapboxImageryProvider({
                    mapId: "mapbox.satellite"
                });
            case "MapboxTerrain":
                return new Cesium.MapboxImageryProvider({
                    mapId: "mapbox.terrain"
                });
            case "MapboxStreets":
                return new Cesium.MapboxImageryProvider({
                    mapId: "mapbox.streets"
                });
            case "MapboxStreetsClassic":
                return new Cesium.MapboxImageryProvider({
                    mapId: "mapbox.streets.basic"
                });
            case "StamenWatercolor":
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/watercolor/",
                    credit: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."
                });
            case "StamenToner":
                return Cesium.createOpenStreetMapImageryProvider({
                    url: "https://stamen-tiles.a.ssl.fastly.net/toner/",
                    credit: "Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA."
                });
            case "ESRIWorldStreetMap":
                return new Cesium.ArcGisMapServerImageryProvider({
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer",
                    enablePickFeatures: !1
                });
            case "ESRINationalGeographic":
                return new Cesium.ArcGisMapServerImageryProvider({
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer",
                    enablePickFeatures: !1
                });
            case "OpenStreetMap":
                return new Cesium.createOpenStreetMapImageryProvider({
                    url: "https://a.tile.openstreetmap.org/"
                });
            default:
                return new Cesium.ArcGisMapServerImageryProvider({
                    url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                    enablePickFeatures: !1
                })
        }
    }

    function i(e) {
        switch (e) {
            case "NaturalEarth":
                return new Cesium.ProviderViewModel({
                    name: "Natural Earth II",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/naturalEarthII.png"),
                    tooltip: "Natural Earth II, darkened for contrast. http://www.naturalearthdata.com/",
                    creationFunction: function () {
                        return r("NaturalEarth")
                    }
                });
            case "BlackMarble":
                return new Cesium.ProviderViewModel({
                    name: "The Black Marble",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/blackMarble.png"),
                    tooltip: "The lights of cities and villages trace the outlines of civilization in this global view of the Earth at night as seen by NASA/NOAA's Suomi NPP satellite.",
                    creationFunction: function () {
                        return r("BlackMarble")
                    }
                });
            case "BingMapsRoads":
                return new Cesium.ProviderViewModel({
                    name: "Bing Maps Roads",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/bingRoads.png"),
                    tooltip: "Bing Maps aerial imagery with label overlays http://www.bing.com/maps",
                    creationFunction: function () {
                        return r("BingMapsRoads")
                    }
                });
            case "BingMapsAerial":
                return new Cesium.ProviderViewModel({
                    name: "Bing Maps Aerial",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/bingAerial.png"),
                    tooltip: "Bing Maps aerial imagery http://www.bing.com/maps",
                    creationFunction: function () {
                        return r("BingMapsAerial")
                    }
                });
            case "BingMapsAerialWithLabels":
                return new Cesium.ProviderViewModel({
                    name: "Bing Maps Aerial with Labels",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/bingAerialLabels.png"),
                    tooltip: "Bing Maps standard road mapshttp://www.bing.com/maps",
                    creationFunction: function () {
                        return r("BingMapsAerialWithLabels")
                    }
                });
            case "MapboxSatellite":
                return new Cesium.ProviderViewModel({
                    name: "Mapbox Satellite",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/mapboxSatellite.png"),
                    tooltip: "Mapbox satellite imagery https://www.mapbox.com/maps/",
                    creationFunction: function () {
                        return r("MapboxSatellite")
                    }
                });
            case "MapboxTerrain":
                return new Cesium.ProviderViewModel({
                    name: "Mapbox Satellite",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/mapboxTerrain.png"),
                    tooltip: "Mapbox terrain imagery https://www.mapbox.com/maps/",
                    creationFunction: function () {
                        return r("MapboxTerrain")
                    }
                });
            case "MapboxStreets":
                return new Cesium.ProviderViewModel({
                    name: "Mapbox Streets",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/mapboxStreets.png"),
                    tooltip: "Mapbox streets imagery https://www.mapbox.com/maps/",
                    creationFunction: function () {
                        return r("MapboxStreets")
                    }
                });
            case "MapboxStreetsClassic":
                return new Cesium.ProviderViewModel({
                    name: "Mapbox Streets Classic",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/mapboxTerrain.png"),
                    tooltip: "Mapbox streets basic imagery https://www.mapbox.com/maps/",
                    creationFunction: function () {
                        return r("MapboxStreetsClassic")
                    }
                });
            case "StamenWatercolor":
                return new Cesium.ProviderViewModel({
                    name: "Stamen Watercolor",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/stamenWatercolor.png"),
                    tooltip: "Reminiscent of hand drawn maps, Stamen watercolor maps apply raster effect area washes and organic edges over a paper texture to add warm pop to any map. http://maps.stamen.com",
                    creationFunction: function () {
                        return r("StamenWatercolor")
                    }
                });
            case "StamenToner":
                return new Cesium.ProviderViewModel({
                    name: "Stamen Toner",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/stamenToner.png"),
                    tooltip: "A high contrast black and white map. http://maps.stamen.com",
                    creationFunction: function () {
                        return r("StamenToner")
                    }
                });
            case "ESRIWorldStreetMap":
                return new Cesium.ProviderViewModel({
                    name: "ESRI World Street Map",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/esriWorldStreetMap.png"),
                    tooltip: "This worldwide street map presents highway-level data for the world. Street-level data includes the United States; much of Canada; Japan; most countries in Europe; Australia and New Zealand; India; parts of South America including Argentina, Brazil, Chile, Colombia, and Venezuela; Ghana; and parts of southern Africa including Botswana, Lesotho, Namibia, South Africa, and Swaziland.http://www.esri.com",
                    creationFunction: function () {
                        return r("ESRIWorldStreetMap")
                    }
                });
            case "ESRINationalGeographic":
                return new Cesium.ProviderViewModel({
                    name: "ESRI National Geographic",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/esriNationalGeographic.png"),
                    tooltip: "This web map contains the National Geographic World Map service. This map service is designed to be used as a general reference map for informational and educational purposes as well as a basemap by GIS professionals and other users for creating web maps and web mapping applications.http://www.esri.com",
                    creationFunction: function () {
                        return r("ESRINationalGeographic")
                    }
                });
            case "OpenStreetMap":
                return new Cesium.ProviderViewModel({
                    name: "Open Street Map",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/openStreetMap.png"),
                    tooltip: "OpenStreetMap (OSM) is a collaborative project to create a free editable map of the world.http://www.openstreetmap.org",
                    creationFunction: function () {
                        return r("OpenStreetMap")
                    }
                });
            default:
                return new Cesium.ProviderViewModel({
                    name: "ESRI World Imagery",
                    iconUrl: Cesium.buildModuleUrl("./static/libs/Cesium/Widgets/Images/ImageryProviders/esriWorldImagery.png"),
                    tooltip: "World Imagery provides one meter or better satellite and aerial imagery in many parts of the world and lower resolution satellite imagery worldwide.  The map includes NASA Blue Marble: Next Generation 500m resolution imagery at small scales (above 1:1,000,000), i-cubed 15m eSAT imagery at medium-to-large scales (down to 1:70,000) for the world, and USGS 15m Landsat imagery for Antarctica. The map features 0.3m resolution imagery in the continental United States and 0.6m resolution imagery in parts of Western Europe from DigitalGlobe. In other parts of the world, 1 meter resolution imagery is available from GeoEye IKONOS, i-cubed Nationwide Prime, Getmapping, AeroGRID, IGN Spain, and IGP Portugal.  Additionally, imagery at different resolutions has been contributed by the GIS User Community.http://www.esri.com",
                    creationFunction: function () {
                        return r("ESRIWorldImagery")
                    }
                })
        }
    }
    return e.prototype._createBaseLayerPickerOptions = function (e) {
        this.terrainProviderViewModels = this._createAllTerrainViewModels(), this.imageryProviderViewModels = this._createRelevantImageryViewModels();
        var t = {
            globe: e.globe,
            imageryProviderViewModels: this.imageryProviderViewModels,
            selectedImageryProviderViewModel: this._getDefaultProviderViewModel(e.imageryProvider, !0),
            terrainProviderViewModels: this.terrainProviderViewModels,
            selectedTerrainProviderViewModel: this._getDefaultProviderViewModel(e.terrainProvider, !1)
        };
        return t
    }, e.prototype._getDefaultProviderViewModel = function (e, t) {
        if (t) {
            var r = i(e);
            return this.imageryProviderViewModels.filter(function (e) {
                return e.name === r.name
            })[0]
        }
        var o = n(e);
        return this.terrainProviderViewModels.filter(function (e) {
            return e.name === o.name
        })[0]
    }, e.prototype._createAllTerrainViewModels = function () {
        var e = [n("ellipsoid"), n("stk")];
        return e
    }, e.prototype._createAllImageryViewModels = function () {
        var e = [i("BingMapsAerial"), i("BingMapsRoads"), i("BingMapsAerialWithLabels"), i("MapboxSatellite"), i("MapboxStreets"), i("MapboxStreetsClassic"), i("ESRIWorldImagery"), i("ESRIWorldStreetMap"), i("ESRINationalGeographic"), i("OpenStreetMap"), i("StamenWatercolor"), i("StamenToner"), i("BlackMarble"), i("NaturalEarth")];
        return e
    }, e.prototype._createRelevantImageryViewModels = function () {
        var e = [i("ESRIWorldImagery"), i("ESRIWorldStreetMap"), i("ESRINationalGeographic"), i("OpenStreetMap")];
        return e
    }, e.prototype.destroy = function () {
        return Cesium.destroyObject(this)
    }, e.prototype.isDestroyed = function () {
        return !1
    }, e
})