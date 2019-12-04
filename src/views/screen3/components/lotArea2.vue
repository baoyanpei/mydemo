<style lang="scss">
  @import "./lotArea.scss";

</style>

<template>
  <div id="screen-loT5" class="screen-loT5" style="margin: 0px;">
    <mqttBim ref="mqttBim" v-on:mqttWeather="mqttWeather" v-on:mqttTaDiao="mqttTaDiao"
      v-on:mqttShenJiangJi="mqttShenJiangJi"></mqttBim>
    <historyLocation ref="historyLocation" v-on:initPerson="initPerson"></historyLocation>
    <mqttLocation ref="mqttLocation" v-on:initPerson="initPerson"></mqttLocation>
    <div id="viewer-local">
      <div v-if="noModelTip!==''" class="noModelTip">{{noModelTip}}</div>
    </div>
  </div>

</template>

<script>
  import LoadLotMixin from '../../loT5/mixin/LoadLotHander'

  import '../../loT5/Viewing.Extension.MeshSelection'

  import mqttBim from "../../loT5/components/mqttBim"
  import mqttLocation from "../../loT5/components/mqttLocation"
  import historyLocation from "../../loT5/components/historyLocation"
  export default {
    name: 'screen3-lotArea2-index',
    components: {
      mqttBim,
      historyLocation,
      mqttLocation
    },
    mixins: [LoadLotMixin],
    data() {
      return {
        
      }
    },
    computed: {

    },
    watch: {

    },
    created() {

    },
    mounted() {
        this.useFrom = "screen"
    },
    destroyed() {},
    methods: {
      
    },

  }

</script>
