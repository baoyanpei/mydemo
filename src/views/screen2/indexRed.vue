<style lang="scss">
  @import "./indexRed";

</style>
<template>
  <div class="screen-index-container" style="margin: 0px;">
    <el-row>
      <div class="header">
        <div class="now-time">{{todayDate}}</div>
      </div>

    </el-row>
    <div v-show="canShow===false" class="errTips">{{errTips}}</div>

    <el-row v-show="canShow===true">
      <el-col :span="5">
        <div class="gate-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
            <div class="text">门禁管理</div>
          </div>
          <div class="main">
            <GateArea ref="gateArea" v-on:gateMessage="gateMessage"></GateArea>
          </div>
        </div>
        <div class="message-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
            <div class="text">公告栏</div>
          </div>
          <div class="main">
            <Message ref="messageArea"></Message>
          </div>
        </div>
        <div class="duty-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
            <div class="text">值班人员</div>
          </div>
          <div class="main">
            <Duty ref="duty"></Duty>
          </div>
        </div>
        <div class="inout-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
            <div class="text">场内人员{{totalInoutPerson}}人</div>
          </div>
          <div class="main">
            <Inout ref="inout" v-on:inoutTotalPerson="inoutTotalPerson"></Inout>
          </div>
        </div>
      </el-col>
      <el-col :span="13">
        <el-row>
          <div class="lot-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" />
              <div class="text">智慧工地</div>
            </div>
            <div class="main">
              <!-- <LotArea ref="lotArea"></LotArea> -->
            </div>
          </div>
        </el-row>
        <el-row>
          <el-col :span="14">
            <div class="online-area">
              <div class="title">
                <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
                <div class="text">进出场车辆</div>
              </div>
              <div class="main">
                <Vehicle ref="vehicle"></Vehicle>
              </div>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="vedio-area">
              <div class="title">
                <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
                <div class="text">现场视频监控</div>
              </div>
              <div class="main">
                <Camera ref="carema"></Camera>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="6">
        <div class="weather-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
            <div class="text">环境检测仪</div>
          </div>
          <div class="main">
            <Weather ref="weather"></Weather>
          </div>
        </div>
        <div class="meter-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
            <div class="text">水表/电表</div>
          </div>
          <div class="main">
            <!-- <Weather></Weather> -->
            <el-row>
              <el-col :span="12">
                <MeterShui ref="meterShui"></MeterShui>
              </el-col>
              <el-col :span="12">
                <MeterDian ref="meterDian"></MeterDian>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="taji-area">
          <div class="title">
            <img src="/static/screen/red/titleBg.png" class="bg" />
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
  import Duty from './components/duty'
  import Vehicle from './components/vehicle'
  // import ShuiBiao from './components/shuibiao'
  // import DianBiao from './components/dianbiao'
  import Weather from './components/weather'
  import Camera from './components/camera'
  import TajiArea from './components/tajiArea'
  import LotArea from './components/lotArea'
  import MeterShui from './components/meterShui'
  import MeterDian from './components/meterDian'
  import Message from './components/Message'
  export default {
    directives: {},
    name: 'Main',
    components: {
      GateArea,
      Inout,
      Online,
      // ShuiBiao,
      // DianBiao,
      Weather,
      Camera,
      TajiArea,
      LotArea,
      Duty,
      Vehicle,
      MeterShui,
      MeterDian,
      Message
      // VueDragResize
    },
    data() {
      return {
        errTips: '',
        todayDate: '',
        totalInoutPerson: '0',
        datumMeterMap: new Map(),
        project_id: null,
        personInfo: null,
        canShow: true
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
      let _initProjectID = null;
      let _projectID = this.$route.query.project_id
      console.log('_projectID', _projectID)
      if (_projectID === undefined || _projectID === '') {
        // this.errTips = 'URL参数缺少project_id'
        _initProjectID = 10000
      } else {
        _initProjectID = parseInt(_projectID, 10)
      }

      this.init(_initProjectID)


    },
    destroyed() {},
    methods: {
      async init(projectID) {
        await this.getPerson()
        if (this.personInfo !== null) {
          let _projects = this.personInfo.project
          _projects.forEach(project => {
            // console.log('project', project)
            if (project.project_id === projectID) {
              this.project_id = projectID
            }
          })
          if (this.project_id !== null) {
            await this.initDevlist()
            console.log('personInfo1233', this.personInfo)
            console.log('this.datumMeterMap', this.datumMeterMap)
            this.$refs.gateArea.init(this.project_id, this.datumMeterMap)
            this.$refs.messageArea.init(this.project_id)
            this.$refs.vehicle.init(this.project_id, this.datumMeterMap)
            this.$refs.duty.init(this.project_id)
            this.$refs.inout.init(this.project_id)
            this.$refs.meterShui.init(this.project_id, this.datumMeterMap)
            this.$refs.meterDian.init(this.project_id, this.datumMeterMap)
            this.$refs.weather.init(this.project_id, this.datumMeterMap)

            
          } else {
            this.canShow = false
            this.errTips = '项目ID错误或您没有查看权限'
          }


        }


      },
      getDate() {
        setTimeout(() => {
          const _moment = moment()
          const weekName = moment.weekdays(_moment.isoWeekday())
          this.todayDate = `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`
          this.getDate()
        }, 1000)
      },
      getPerson() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'query'
          }
          this.$store.dispatch('QueryPersonInfo', param).then((data) => {
            // console.log('datatadaad',data)
            this.personInfo = data
            resolve()
          }).catch(() => {
            resolve()
          })
        })

      },
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              this.datumMeterMap.set(datum.device_id, datum)
            })
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
      inoutTotalPerson(total) {
        this.totalInoutPerson = total
      },
      gateMessage(data) {
        console.log('gateMessage', data)
        this.$refs.lotArea.gateData(data)
      },
    }
  }

</script>
