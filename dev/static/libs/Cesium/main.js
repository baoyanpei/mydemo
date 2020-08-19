// Get your own Bing Maps API key at https://www.bingmapsportal.com, prior to publishing your Cesium application:
Cesium.BingMapsApi.defaultKey = 'put your API key here';

// Construct the default list of terrain sources.
var terrainModels = Cesium.createDefaultTerrainProviderViewModels();

// Construct the viewer with just what we need for this base application
var viewer = new Cesium.Viewer('cesiumContainer', {
  timeline: false,
  animation: false,
  vrButton: true,
  sceneModePicker: false,
  infoBox: true,
  scene3DOnly: true,
  terrainProviderViewModels: terrainModels,
  selectedTerrainProviderViewModel: terrainModels[1] // Select STK high-res terrain
});

// No depth testing against the terrain to avoid z-fighting
viewer.scene.globe.depthTestAgainstTerrain = false;

// Add credit to Bentley
viewer.scene.frameState.creditDisplay.addDefaultCredit(new Cesium.Credit(''));

// Bounding sphere
var boundingSphere = new Cesium.BoundingSphere(Cesium.Cartesian3.fromDegrees(104.1354216, 30.91325763, 530.9954567), 348.0873257);

// Override behavior of home button
viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
  // Fly to custom position
  viewer.camera.flyToBoundingSphere(boundingSphere);

  // Tell the home button not to do anything
  commandInfo.cancel = true;
});

// Set custom initial position
viewer.camera.flyToBoundingSphere(boundingSphere, {
  duration: 0
});

/*---------------------------------------------------------------------------------**/
/**
* @bsimethod
+---------------+---------------+---------------+---------------+---------------+------*/
// Functions to adapt screen space error and memory use to the device
var isMobile = {
  Android: function () {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function () {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function () {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function () {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function () {
    return navigator.userAgent.match(/IEMobile/i);
  },
  any: function () {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};
var _cameraJson;

function reSetCamera() {
  getThisCamera(_cameraJson);
}

function getThisCamera(data) {
  viewer.camera.position.x = data.position_x;
  viewer.camera.position.y = data.position_y;
  viewer.camera.position.z = data.position_z;
  viewer.camera.direction.x = data.direction_x;
  viewer.camera.direction.y = data.direction_y;
  viewer.camera.direction.z = data.direction_z;
  viewer.camera.up.x = data.up_x;
  viewer.camera.up.y = data.up_y;
  viewer.camera.up.z = data.up_z;
}
