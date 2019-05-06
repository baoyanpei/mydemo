<style lang="scss">
  @import "./indexGold";

</style>
<template>
  <div class="screen-index-container" style="margin: 0px;">
    <el-row>
      <div class="header">
        <div class="now-time">{{todayDate}}</div>
      </div>

    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="gate-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">门禁管理</div>
          </div>
          <div class="main">
            <GateArea ref="gateArea"></GateArea>
          </div>
        </div>
        <div class="inout-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">场内人员</div>
          </div>
          <div class="main">
            <Inout></Inout>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <el-row>
          <div class="lot-area">
            <div class="title">
              <img src="/static/screen/gold/titleBg.png" class="bg" />
              <div class="text">智慧工地</div>
            </div>
            <div class="main">
              <LotArea></LotArea>
            </div>
          </div>
        </el-row>
        <el-row>
          <el-col :span="14">
            <div class="online-area">
              <div class="title">
                <img src="/static/screen/gold/titleBg.png" class="bg" />
                <div class="text">每日上工人数</div>
              </div>
              <div class="main">
                <Online></Online>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="vedio-area">
              <div class="title">
                <img src="/static/screen/gold/titleBg.png" class="bg" />
                <div class="text">现场视频监控</div>
              </div>
              <div class="main">
                <Camera></Camera>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <div class="weather-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">环境检测仪</div>
          </div>
          <div class="main">
            <Weather></Weather>
          </div>
        </div>
        <div class="shuibiao-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">水表数据</div>
          </div>
          <div class="main">
            <ShuiBiao></ShuiBiao>
          </div>
        </div>
        <div class="dianbiao-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">电表数据</div>
          </div>
          <div class="main">
            <DianBiao></DianBiao>
          </div>
        </div>
        <div class="taji-area">
          <div class="title">
            <img src="/static/screen/gold/titleBg.png" class="bg" />
            <div class="text">塔机/升降机</div>
          </div>
          <div class="main">
            <TajiArea></TajiArea>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import $ from 'jquery'
  import moment from 'moment'
  import GateArea from './components/gateArea'
  import Inout from './components/inout'
  import Online from './components/online'
  import ShuiBiao from './components/shuibiao'
  import DianBiao from './components/dianbiao'
  import Weather from './components/weather'
  import Camera from './components/camera'
  import TajiArea from './components/tajiArea'
  import LotArea from './components/lotArea'
  export default {
    directives: {},
    name: 'Main',
    components: {
      GateArea,
      Inout,
      Online,
      ShuiBiao,
      DianBiao,
      Weather,
      Camera,
      TajiArea,
      LotArea
      // VueDragResize
    },
    data() {
      return {
        todayDate: ''
      }
    },
    computed: {

    },
    created() {
      // this.mqttConnect()
    },
    watch: {

    },
    mounted() {
      moment.locale('zh-cn');
      this.getDate()
    },
    destroyed() {},
    methods: {
      getDate() {
        setTimeout(() => {
          const _moment = moment()
          const weekName = moment.weekdays(_moment.isoWeekday())
          this.todayDate = `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`
          this.getDate()
        }, 1000)
      },
    }
  }

</script>
