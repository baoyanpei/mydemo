<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="loT5-index">

    <mqttBim ref="mqttBim" v-on:mqttWeather="mqttWeather" v-on:mqttTaDiao="mqttTaDiao"
      v-on:mqttShenJiangJi="mqttShenJiangJi"></mqttBim>
    <historyLocation ref="historyLocation" v-on:initPerson="initPerson"></historyLocation>
    <mqttLocation ref="mqttLocation" v-on:initPerson="initPerson"></mqttLocation>
    <div id="viewer-local">
      <div v-if="noModelTip!==''" class="noModelTip">{{noModelTip}}</div>
    </div>
    <div v-show="showTadiaoInfo" class="divDataTadiao" @click="aaaa">
      <div style="padding-bottom: 5px;font-size: 14px;">塔吊</div>
      <div>塔吊高度：<span id="td_tdgd">{{tdData.tdgd}}</span> 米</div>
      <div>大臂角度：<span id="td_dbjd">{{tdData.dbjd}}</span> 度</div>
      <div>小车距离：<span id="td_xcjl">{{tdData.xcjl}}</span> 米</div>
      <div>吊钩线长：<span id="td_dgxc">{{tdData.dgxc}}</span> 米</div>
      <div>上报时间：<span id="td_sbsj">{{tdData.sbsj}}</span></div>
    </div>
    <div v-show="showShenjiangjiInfo" class="divDataShenJiangJi" @click="bbbb">
      <div style="padding-bottom: 5px;font-size: 14px;">升降机</div>
      <div>高度：<span id="sjj_gd">{{sjjData.sjjgd}}</span> 米</div>
      <div>楼层：<span id="sjj_lc">{{sjjData.sjjlc}}</span> 层</div>
      <div>笼门状态：<span id="sjj_lmzt">{{sjjData.mzt}}</span> </div>
      <div>上报时间：<span id="sjj_sbsj">{{sjjData.sbsj}}</span></div>
    </div>
    <div v-show="showWeatherInfo" class="divDataWeather" @click="cccc">
      <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(3)" title="关闭" /> -->
      <div style="padding-bottom: 5px;font-size: 14px;">环境检测仪</div>
      <div>温度：<span>{{weather_data.temp}}</span> °C</div>
      <div>湿度：<span>{{weather_data.h}}</span> %</div>
      <div>噪声：<span>{{weather_data.noise}}</span> db</div>
      <div>扬尘：<span>{{weather_data.pm10}}</span> ug/m</div>
      <div>PM2.5：<span>{{weather_data.pm2_5}}</span> ug/m</div>
      <div>风速：<span>{{ weather_data.wind }}</span> 级</div>
    </div>
    <div v-show="showShuibiaoInfo" class="divDataShuibiao">
      <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(4)" title="关闭" /> -->
      <div style="padding-bottom: 5px;font-size: 14px;">水表</div>
      <div>当前用量：<span>{{shuibiaoTotalUsed}}</span> 吨</div>

    </div>
    <div v-show="showDianbiaoInfo" class="divDataDianbiao">
      <!-- <img class='iconTipClose' src='/static/icon/closeIcon.png' @click="closeInfoAreaHandle(5)" title="关闭" /> -->
      <div style="padding-bottom: 5px;font-size: 14px;">电表</div>
      <div>当前用量：{{dianbiaoTotalUsed}} 度</div>

    </div>
  </div>
</template>

<script>
  import LoadLotMixin from './mixin/LoadLotHander'

  import './Viewing.Extension.MeshSelection'

  import mqttBim from "./components/mqttBim"
  import mqttLocation from "./components/mqttLocation"
  import historyLocation from "./components/historyLocation"

  export default {
    name: 'Lot5-index',
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
      project_id() {
        return this.$store.state.project.project_id
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('project_idproject_idproject_id', curVal, oldVal)
        if (oldVal !== null) {
          // this.clearData()
          location.reload()

        }
        if (curVal !== null) {
          this.useFrom = "lot"
          this.init(curVal)
        }
      },
    },
    created() {

    },
    mounted() {
      if (this.project_id !== undefined && this.project_id !== '') {
        this.init(this.project_id)
      }

    },
    destroyed() {},
    methods: {

    },

  }

</script>
