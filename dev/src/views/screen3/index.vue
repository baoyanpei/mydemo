<style lang="scss">
@import './index';
</style>
<template>
  <div class="screen3-index-container" style="margin: 0px;">
    <LotArea ref="lotArea"></LotArea>
    <div class="screen-header">
      <el-row>
        <div class="header">
          <div class="project—name">{{project_name}}</div>
          <div class="now-time">{{todayDate}}</div>
          <div class="title-bg">
            <img v-if="img_src_title!==''" :src="img_src_title" />
            <!-- src="/static/screen/red/title1.png" -->
          </div>
        </div>
      </el-row>
    </div>

    <div v-show="canShow===false" class="errTips">{{errTips}}</div>
    <div v-show="canShow===true" class="screen-main">
      <el-row>
        <el-col :span="5">
          <div class="gate-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" />
              <div class="text">门禁管理</div>
            </div>

            <div class="main">
              <div class="bg"></div>
              <GateArea ref="gateArea" v-on:gateMessage="gateMessage"></GateArea>
            </div>
          </div>
          <div class="message-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" />
              <div class="text">公告栏</div>
            </div>
            <div class="main">
              <div class="bg"></div>
              <Message ref="messageArea"></Message>
            </div>
          </div>
          <div class="duty-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" />
              <div class="text">值班人员</div>
            </div>
            <div class="main">
              <div class="bg"></div>
              <Duty ref="duty"></Duty>
            </div>
          </div>
          <div class="inout-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
              <div class="text">场内人员{{totalInoutPerson}}人</div>
            </div>
            <div class="main">
              <div class="bg"></div>
              <Inout ref="inout" v-on:inoutTotalPerson="inoutTotalPerson"></Inout>
            </div>
          </div>
        </el-col>
        <el-col :span="13">
          <el-row>
            <div class="center-area">
              <div class="main"></div>
            </div>
          </el-row>
          <el-row>
            <el-col :span="14">
              <div class="task-area">
                <div class="title">
                  <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
                  <div class="text">最新任务</div>
                </div>
                <div class="main">
                  <div class="bg"></div>
                  <Tasks ref="tasks"></Tasks>
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
                  <div class="bg"></div>
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
              <div class="bg"></div>
              <Weather ref="weather"></Weather>
            </div>
          </div>
          <div class="meter-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" />
              <div class="text">水表/电表</div>
            </div>
            <div class="main">
              <div class="bg"></div>
              <el-row class="meter-main">
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
              <div class="bg"></div>
              <TajiArea ref="tajiArea"></TajiArea>
            </div>
          </div>
          <div class="vehicle-area">
            <div class="title">
              <img src="/static/screen/red/titleBg.png" class="bg" style="width: 150px;" />
              <div class="text">车辆进出场管理</div>
            </div>
            <div class="main">
              <div class="bg"></div>
              <Vehicle ref="vehicle"></Vehicle>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import LotArea from './components/lotArea2'
import GateArea from './components/gateArea'
import Message from './components/Message'
import Duty from './components/duty'
import Inout from './components/inout'
import Camera from './components/camera'
import Weather from './components/weather'
import MeterShui from './components/meterShuiOld'
import MeterDian from './components/meterDianOld'
import TajiArea from './components/tajiAreaOld'
import Vehicle from './components/vehicle'
import Tasks from './components/tasks'
export default {
  directives: {},
  name: 'screen3-index',
  components: {
    LotArea,
    GateArea,
    Message,
    Duty,
    Inout,
    Camera,
    Weather,
    MeterShui,
    MeterDian,
    TajiArea,
    Vehicle,
    Tasks
  },
  data() {
    return {
      errTips: '',
      todayDate: '',
      totalInoutPerson: '0',
      datumMeterMap: new Map(),
      project_id: null,
      project_name: '',
      personInfo: null,
      canShow: true,
      img_src_title: ''
    }
  },
  computed: {},
  created() {
    // this.mqttConnect()
  },
  watch: {
    $route(to, from) {
      console.log('totototo', to, from)
      if (to.name === from.name && to.name === 'screen2') {
        // 修改地址栏参数后刷新
        location.reload()
      }
    }
  },
  mounted() {
    moment.locale('zh-cn')
    this.getDate()
    let _initProjectID = null
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
            if (
              project.project_full_name !== '' &&
              project.project_full_name.length <= 10
            ) {
              this.project_name = project.project_full_name
            } else {
              this.project_name = project.project_name
            }

            this.img_src_title = `${process.env.BASE_DOMAIN_ORG_URL}${project.org_id}/BrowserPreview_tmp.png`
          }
        })
        if (this.project_id !== null) {
          await this.initDevlist()
          console.log('personInfo1233', this.personInfo)
          console.log('this.datumMeterMap', this.datumMeterMap)
          this.$refs.lotArea.init(this.project_id, this.datumMeterMap)
          this.$refs.gateArea.init(this.project_id, this.datumMeterMap)
          this.$refs.messageArea.init(this.project_id)
          this.$refs.duty.init(this.project_id)
          this.$refs.inout.init(this.project_id)
          this.$refs.carema.openPlayer(this.datumMeterMap)
          this.$refs.weather.init(this.project_id, this.datumMeterMap)
          this.$refs.meterShui.init(this.project_id, this.datumMeterMap)
          this.$refs.meterDian.init(this.project_id, this.datumMeterMap)
          this.$refs.tajiArea.init(this.project_id, this.datumMeterMap)
          this.$refs.vehicle.init(this.project_id, this.datumMeterMap)
          this.$refs.tasks.init(this.project_id)
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
        this.todayDate = `${_moment.format(
          'YYYY-MM-DD'
        )}  [${weekName}]  ${_moment.format('HH:mm:ss')}`
        this.getDate()
      }, 1000)
    },
    getPerson() {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'query'
        }
        this.$store
          .dispatch('QueryPersonInfo', param)
          .then(data => {
            // console.log('datatadaad',data)
            this.personInfo = data
            resolve()
          })
          .catch(() => {
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
        this.$store
          .dispatch('QueryDatumMeter', param)
          .then(data => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              this.datumMeterMap.set(datum.device_id, datum)
            })
            resolve()
          })
          .catch(e => {
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
      // this.$refs.lotArea.gateData(data)
    }
  }
}
</script>
