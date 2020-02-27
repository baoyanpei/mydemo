<style lang="scss">
  @import "./gate.scss";

</style>
<template>
  <div class="data-gate">
    <el-row>
      <el-col :span="12" style="height:100%;display: table-cell;vertical-align: middle;text-align: center;">
        <img v-show="persion_data.entry_pic !==''" :src="persion_data.entry_pic" @click="handleNameClick(persion_data)"
          class="photo info-name-link">
        <span v-show="persion_data.entry_pic ===''">&nbsp;</span>
        <div v-if="persion_data.card_type===4" class="person-type-desc">临时人员</div>
      </el-col>
      <el-col :span="12" style="padding-left:5px;">
        <el-row :gutter="24">
          <div class="grid-content info-name">
            <span @click="handleNameClick(persion_data)" class="info-name-link">{{persion_data.name}}</span>&nbsp;
          </div>
        </el-row>
        <el-row :gutter="24">
          <div class="grid-content info-qita">部门：<span>{{persion_data.group_name_root}}</span></div>
        </el-row>
        <el-row :gutter="24">
          <div class="grid-content info-qita">班组：<span>{{persion_data.group_name}}</span></div>
        </el-row>
        <el-row :gutter="24">
          <div class="grid-content info-qita">职位：
            <span v-if="persion_data.card_type!==4">{{persion_data.project_pos_name}}</span>
            <span v-if="persion_data.card_type===4">临时人员</span>
          </div>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <div class="grid-content info-lichang">
        <span v-if="onOffValue === 0 && persion_data.direction===1"
          style="color:chartreuse;">进场时间：{{nowInOutTime}}</span>
        <span v-if="onOffValue === 0 && persion_data.direction===2" style="color:red;">离场时间：{{nowInOutTime}}</span>
        <span v-if="onOffValue === 1" style="color:#FF66FF;font-weight: 700;">{{errorMessage}}</span>
        <span>&nbsp;</span>
      </div>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  //   import {
  //     project_gateperson
  //   } from '../../service/api.js'
  const PersonDataEmpty = {
    "active_time": "", //2018-09-05 11:13:40
    "blood": "", //O\u578b,
    "direction": 0, //2
    "door_no": "", //1
    "gate_ip": "", //12
    "gate_sn": "", //123
    "id": 0, //1003
    // "entry_pic": "http://w.yidebim.com:8899/idcard_pic/100001/350321199103070714_entry_pic.jpg",
    "entry_pic": "../static/default.jpg",
    "card_type": -1, //卡类型 4 零时人员
    // "entry_pic": "",
    "group_id": "",
    "group_name": "", // 班组
    "group_name_root": "",
    "groups_type": "", // 部门类型 1为管理部门，0为施工部门
    "project_pos_id": "", // 职位id
    "project_pos_name": "", // 职位名称
    "idcard_pic": "", //http://w.yidebim.com:8899/idcard_pic/421003198305060077.jpg
    "mobile": "", //18980868006
    "name": "", //\u738b\u8d22\u5efa
    "nation": "", //\u6c49
    "person_id": 0, //1003
    "project_id": "", //10000
    "rfid": "", //12237849
    "rfid_wg": "", //12237849
    "sex": "", //\u7537
    "valid_time": "", //2018-09-19 15:49:21
    "last_out_time": "",
    "work_days": "",
    "age": "",
    "prof": "",
    "onoff": 0
  }
  export default {
    components: {},
    data() {
      return {

        // project_id: this.ProjectId,
        persion_data: PersonDataEmpty,
        lastPersonID: 0,
        last_out_time: '', // 上次立场时间（转换后）
        last_in_time: '', // 上次进场时间（转换后）
        // count_data: {
        //   "person": {
        //     "count_in": 0
        //   },
        //   "vip": {
        //     "count_in": 0
        //   },
        //   "all_count_in": 0
        // },
        topicUserInfo: '', //订阅用户信息
        topicCount: '', //订阅统计消息
        nowInOutTime: '', // 进场/离场 时间
        onOffValue: 0, // 0 允许进场 1 不开门 
        timerDisplayOver: 0,
        errorMessage: '' //错误消息
        // persion_data: persion_data
      }
    },
    props: {
      //   ProjectId: {
      //     type: String,
      //     default: 0
      //   },
      // GateSN: {
      //   type: String,
      //   default: ''
      // }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      // projectGatePerson() {
      //   return this.$store.state.project.projectGatePerson
      // }
    },

    methods: {

      updateData(data) {
        // const _data = JSON.parse(data)
        // console.log('userinfo1', data)
        this.persion_data = data

        // console.log("onoff", this.persion_data.onoff)
        if (this.lastPersonID !== this.persion_data.id) {
          if (this.persion_data.onoff === undefined) {
            this.onOffValue = -1
          } else {
            this.onOffValue = this.persion_data.onoff
            this.errorMessageHandle()
          }
        } else {
          if (this.persion_data.onoff === undefined) {
            // this.onOffValue = -1
          } else {
            this.onOffValue = this.persion_data.onoff
            this.errorMessageHandle()
          }
        }


        const _moment = moment()
        const weekName = moment.weekdays(_moment.isoWeekday())
        this.nowInOutTime = `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`

        this.lastPersonID = this.persion_data.id

      },
      updateErrorInfo(data) {
        if (data !== '') {
          // const _data = JSON.parse(data)
          console.log("updateErrorInfo", data)
          if (data.onoff === -1) {
            this.onOffValue = 1
            this.persion_data = Object.assign({}, PersonDataEmpty)
            this.persion_data.entry_pic = '../../static/not_valid.jpg'
            this.errorMessage = `此卡无效`
          }

        }


      },
      errorMessageHandle() {
        this.errorMessage = ""
        if (this.onOffValue === 1) {
          console.log("this.persion_data", this.persion_data.onoff_msg)
          // {'查无此卡用户信息':1,'卡需要激活':2, '需要激活':2,'卡已过期':3, '已注销':4,'离职':5}  
          switch (this.persion_data.onoff_status) {
            case 1:
              this.errorMessage = `查无此卡用户信息`
              this.persion_data.entry_pic = '../../static/not_valid.jpg'
              break;
            case 2: // '卡需要激活':2
              this.errorMessage = `${this.persion_data.name}，您的卡需要在门卫室激活！`
              // this.persion_data.entry_pic = '../../static/need_jihuo.jpg'
              break;
            case 3:
              this.errorMessage = `${this.persion_data.name}，您的卡已过期！`
              // this.persion_data.entry_pic = '../../static/not_valid.jpg'
              break;
            case 4:
              this.errorMessage = `${this.persion_data.name}，您的卡已注销已注销！`
              // this.persion_data.entry_pic = '../../static/not_valid.jpg'
              break;
            case 5:
              this.errorMessage = `${this.persion_data.name}已经离职`
              // this.persion_data.entry_pic = '../../static/not_valid.jpg'
              break;
            case 19:
              this.errorMessage = `${this.persion_data.name}，您的健康登记表还没有填写！`
              // this.persion_data.entry_pic = '../../static/not_valid.jpg'
              break;
          }
        }
      },
      setProjectGatePerson(GateData) {
        this.updateData(GateData)
        this.onOffValue = 0
        let _moment = ""
        let weekName = ""
        switch (GateData.direction) {
          case 1: //进场时间
            _moment = moment(GateData.last_in_time, 'YYYY-MM-DD "HH:mm:ss')
            weekName = moment.weekdays(_moment.isoWeekday())
            this.nowInOutTime =
              `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`
            break; //离场时间
          case 2:

            _moment = moment(GateData.last_out_time, 'YYYY-MM-DD "HH:mm:ss')
            weekName = moment.weekdays(_moment.isoWeekday())
            this.nowInOutTime =
              `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`

            break;
        }
      },
      handleNameClick(row) {
        const param = {
          show: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      // getProjectGatePerson() {
      //   const param = {
      //     method: 'project_gateperson',
      //     project_id: this.project_id
      //   }
      //   this.$store.dispatch('QueryProjectGatePerson', param).then(() => {
      //     console.log('this.projectGatePerson', this.projectGatePerson)

      //     const GateData = this.projectGatePerson[this.GateSN]
      //     if (GateData !== undefined) {
      //       this.updateData(GateData)
      //       this.onOffValue = 0
      //       let _moment = ""
      //       let weekName = ""
      //       switch (GateData.direction) {
      //         case 1: //进场时间
      //           _moment = moment(GateData.last_in_time, 'YYYY-MM-DD "HH:mm:ss')
      //           weekName = moment.weekdays(_moment.isoWeekday())
      //           this.nowInOutTime =
      //             `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`
      //           break; //离场时间
      //         case 2:

      //           _moment = moment(GateData.last_out_time, 'YYYY-MM-DD "HH:mm:ss')
      //           weekName = moment.weekdays(_moment.isoWeekday())
      //           this.nowInOutTime =
      //             `${_moment.format("YYYY-MM-DD")}  [${weekName}]  ${_moment.format("HH:mm:ss")}`

      //           break;
      //       }
      //     }

      //   }).catch(() => {

      //   })
      // },
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.persion_data = Object.assign({}, PersonDataEmpty)
          // this.getProjectGatePerson()
        }
      },
    },
    mounted() {
      // console.log("this.curValcurValcurValcurVal",this.project_id)
      //   this.getProjectGatePerson()

    }
  }

</script>
