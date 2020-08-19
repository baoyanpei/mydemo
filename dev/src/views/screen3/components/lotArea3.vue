<style lang="scss">
@import './lotArea3.scss';
</style>
  
  <template>
  <div id="screen-loT6" class="screen-loT6" style="margin: 0px;">
    <mqttBim
      ref="mqttBim"
      v-on:mqttWeather="mqttWeather"
      v-on:mqttTaDiao="mqttTaDiao"
      v-on:mqttShenJiangJi="mqttShenJiangJi"
    ></mqttBim>
    <historyLocation ref="historyLocation" v-on:initPerson="initPerson"></historyLocation>
    <mqttLocation ref="mqttLocation" v-on:initPerson="initPerson"></mqttLocation>
    <div id="viewer-local" class="viewer-local-v3">
      <div v-if="nomodel_message!==''" class="noModelTip">{{nomodel_message}}</div>
    </div>
  </div>
</template>
  
  <script>
import LoadLotMixin from '../../loT6/mixin/LoadLotHander'

// import '../../loT6/Viewing.Extension.MeshSelection'

import mqttBim from '../../loT6/components/mqttBim'
import mqttLocation from '../../loT6/components/mqttLocation'
import historyLocation from '../../loT6/components/historyLocation'
export default {
  name: 'screen3-lotArea2-index',
  components: {
    mqttBim,
    historyLocation,
    mqttLocation
  },
  mixins: [LoadLotMixin],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.useFrom = 'screen'
  },
  destroyed() {},
  methods: {}
}
</script>
  