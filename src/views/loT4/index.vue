<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="loT4-index">
    <div id="viewer-local"></div>

  </div>
</template>

<script>
  var config = {
    extensions: [
      // "Autodesk.Viewing.ZoomWindow",
      // "markup3d",
      // "Autodesk.Section"
      // "Autodesk.Viewing.MarkupsCore",
      // "Autodesk.Viewing.AxisHelper"
    ],
    disabledExtensions: {
      measure: false,
      section: false,
    },
    memory: {
      limit: 32 * 1024 // 32 GB
    }
  };

  var element = null; // document.getElementById('viewer-local');
  var viewer = null; //new Autodesk.Viewing.Private.GuiViewer3D(element, config);
  var options = {
    env: 'Local',
    offline: 'true',
    useConsolidation: true,
    useADP: false
  };


  function init3DView() {

    Autodesk.Viewing.Initializer(options, function () {
      element = document.getElementById('viewer-local');
      viewer = new Autodesk.Viewing.Private.GuiViewer3D(element, config);
      var startedCode = viewer.start();
      if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
      }

      // viewer.loadModel("https://lmv-models.s3.amazonaws.com/toy_plane/toy_plane.svf", undefined,
      // onLoadSuccess, onLoadError);
      viewer.loadModel("/static/model/qingyang/3d.svf", undefined, onLoadSuccess, onLoadError);
      // viewer.loadModel("/static/model/tianshui/3d.svf", undefined, onLoadSuccess, onLoadError);


    });
  }

  function onLoadSuccess(event) {
    viewer.fitToView()
    console.log('success');
  }

  function onLoadError(event) {
    console.log('fail');
  }
  export default {
    name: 'Lot4-index',
    components: {},
    data() {
      return {

      }
    },
    computed: {

    },
    created() {

    },
    mounted() {
      console.log('lot4-index-mounted')
      init3DView()

    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {

    }
  }

</script>
