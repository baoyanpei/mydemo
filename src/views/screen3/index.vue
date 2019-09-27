<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="screen3-index-container" style="margin: 0px;">
    <LotArea ref="lotArea"></LotArea>
    <div class="screen-header">
      <el-row>
        <div class="header">
          <div class="project—name">{{project_name}}</div>
          <div class="now-time">{{todayDate}}</div>
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
              <GateArea ref="gateArea" v-on:gateMessage="gateMessage"></GateArea>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

  </div>
</template>

<script>
  import moment from 'moment'
  import LotArea from './components/lotArea'
  import GateArea from './components/gateArea'
  export default {
    directives: {},
    name: 'screen3-index',
    components: {
      LotArea,
      GateArea
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
        canShow: true
      }
    },
    computed: {

    },
    created() {
      // this.mqttConnect()
    },
    watch: {
      '$route'(to, from) {
        console.log("totototo", to, from)
        if (to.name === from.name && to.name === 'screen2') {
          // 修改地址栏参数后刷新
          location.reload()
        }
      },
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
              this.project_name = project.project_name
            }
          })
          if (this.project_id !== null) {
            await this.initDevlist()
            console.log('personInfo1233', this.personInfo)
            console.log('this.datumMeterMap', this.datumMeterMap)
            this.$refs.gateArea.init(this.project_id, this.datumMeterMap)
            this.$refs.lotArea.init(this.project_id, this.datumMeterMap)
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
