<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="main-container" style="margin: 0px;">
    <!-- <div class="xBIM-viewer-div">
      <canvas id="xBIM-viewer">模型正在加载...</canvas>
    </div> -->


    <CountInfoBoard ref="count_info"></CountInfoBoard>
    <div class="gate-area-div">
      <GeteArea ref="gateArea"></GeteArea>
    </div>

    <div class="bim-toolbar">
      <!--v-draggable-->
      <!-- <div class="bim-toolbar1">
        <div>
          <el-tooltip class="item" effect="dark" content="创建计划" placement="top">
            <el-button @click="dialogCJHYVisible = true">
              <font-awesome-icon icon="list-alt" size="2x" />
            </el-button>

          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="交底计划" placement="top">
            <el-button @click="dialogTableVisible = true" style="padding-top:4px;">
              <font-awesome-icon icon="calendar-check" size="2x" />
            </el-button>
          </el-tooltip>
        </div>

      </div> -->
      <div class="bim-toolbar2">
        <div>
          <el-tooltip class="item" effect="dark" content="人员考勤" placement="top">
            <el-button @click="personInoutDialogHandle">
              <font-awesome-icon icon="book-open" size="2x" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="场内人员" placement="top">
            <el-button @click="personNowInDialogHandle">
              <font-awesome-icon icon="street-view" size="2x" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="人员信息" placement="top">
            <el-button @click="personListDialogHandle">
              <font-awesome-icon icon="user-cog" size="2x" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="日历" placement="top">
            <el-button @click="personFullCalendarHandle" style="padding-top:4px;">
              <!-- <icon name="el-icon-date" scale="1.7"></icon> -->
              <font-awesome-icon icon="calendar-alt" size="2x" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="发布管理" placement="top">
            <el-button @click="publishHandle" style="padding-top:4px;">
              <!-- <icon name="el-icon-date" scale="1.7"></icon> -->
              <font-awesome-icon icon="desktop" size="2x" />
            </el-button>
          </el-tooltip>
        </div>

      </div>
    </div>

    <!-- <div class="meeting-dialog" v-if="showMeetingDialog" v-draggable="draggableValue">
      <div class="md-title" :ref="handleId">
        创建计划 <el-button style="float:right" @click="meetingDialogHandle">
          <icon name="times" scale="1"></icon>
        </el-button>
      </div>
      <div class="md-main">
        <HuiYi></HuiYi>
      </div>

    </div> -->

    <el-dialog v-el-drag-dialog custom-class="HuiyiDialog" :modal="false" width="400px" top="15vh" :lock-scroll="true"
      :close-on-click-modal="false" v-if="dialogCJHYVisible" :visible.sync="dialogCJHYVisible" title="创建计划"
      @dragDialog="handleDrag">
      <HuiYi></HuiYi>
    </el-dialog>

    <el-dialog v-el-drag-dialog custom-class="HuiyiRiliDialog" :modal="false" width="800px" top="15vh"
      :lock-scroll="true" :close-on-click-modal="false" v-if="dialogTableVisible" :visible.sync="dialogTableVisible"
      title="会议计划" @dragDialog="handleDrag">
      <HuiyiRili></HuiyiRili>
    </el-dialog>

    <el-dialog v-el-drag-dialog custom-class="HuiyiRiliDialog" :modal="false" width="800px" top="5.8vh"
      :lock-scroll="true" :close-on-click-modal="false" v-if="showHuiyiFullCalendar"
      :visible.sync="showHuiyiFullCalendar" title="会议计划" @dragDialog="handleDrag">
      <HuiyiFullCalendar></HuiyiFullCalendar>
    </el-dialog>

  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  // import VueDragResize from 'vue-drag-resize';
  import {
    Loading
  } from 'element-ui';
  import {
    Draggable
  } from "draggable-vue-directive";
  import {
    toggleClass
  } from '@/utils'
  import HuiYi from "./components/huiyi"
  import HuiyiRili from "./components/huiyiRili"
  import HuiyiFullCalendar from "./components/huiyiFullCalendar"
  import CountInfoBoard from "./components/countInfoBoard"
  import GeteArea from './components/geteArea'
  // import '@/assets/custom-theme/index.css' // the theme changed version element-ui css
  var mname = "111"; //"庆阳市妇女儿童医院-摄像头定位-绑定 2017版";
  var indexi = 0;
  var isboling = 0; //是否玻璃效果

  const MQTT_SERVICE = 'ws://d1.mq.tddata.net:8083/mqtt' // mqtt服务地址
  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)

  // import $ from 'jquery'
  export default {
    directives: {
      Draggable,
      elDragDialog
    },
    name: 'Main',
    components: {
      HuiYi,
      HuiyiRili,
      HuiyiFullCalendar,
      CountInfoBoard,
      GeteArea
      // VueDragResize
    },
    data() {
      return {
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接
        // handleId: "handleA",
        loadingFull: null,
        // draggableValue: {
        //   handle: undefined
        // },
        // showMeetingDialog: false,
        dialogTableVisible: false,
        dialogCJHYVisible: false,
        dialogHuiyiFullCalendar: false,
        // dialogJDHYVisible: true
        topicUserInfo: '', //订阅用户信息
        topicCount: '', //订阅统计消息
        reconnectTimes: 0, //重连次数
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      showHuiyiFullCalendar: {
        get: function () {
          return this.$store.state.huiyi.showHuiyiFullCalendar
        },
        set: function (newValue) {
          this.$store.state.huiyi.showHuiyiFullCalendar = newValue
        }

      },
    },
    created() {
      this.client.onConnectionLost = this.onConnectionLost; //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived; //注册消息接收处理事件
      // this.mqttConnect()
    },
    watch: {
      project_id(curVal, oldVal) {
        if (oldVal === null && curVal !== null) {
          this.mqttConnect()
        }
        if (oldVal !== null) {
          this.unsubscribe()
        }
        if (curVal !== null) {
          this.subscribe()
        }
      },
      isConnectMqtt(curVal, oldVal) {
        if (curVal === false) {
          this.reconnectMqtt()
        } else {
          this.subscribe()
          this.reconnectTimes = 0
          clearTimeout(this.timerReconnectMqtt)
        }
      },
      reconnectTimes(curVal, oldVal) {
        if (oldVal > 0 && curVal === 0) {
          this.info_system = ''
        }
      }
    },
    mounted() {
      // this.draggableValue.handle = this.$refs[this.handleId];

      // $("#aaaa").html('哈哈哈')
      // toggleClass(document.body, 'custom-theme')
      console.log("index mount")



    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      openFullScreen: function (text) {
        this.loadingFull = this.$loading({
          lock: true,
          text: text,
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

      },
      closeFullScreen: function () {
        this.loadingFull.close();
      },
      handleDrag() {
        // this.$refs.select.blur()
      },
      mqttConnect() {
        this.client.connect({
          userName: MQTT_USERNAME,
          password: MQTT_PASSWORD,
          onSuccess: this.onConnect,
          onFailure: this.onFailure,
        }); //连接服务器并注册连接成功处理事件
      },
      onConnectionLost(responseObject) {
        console.log("onConnectionLost", responseObject)
        this.isConnectMqtt = false;
        this.info_system = "通讯断开..."
        if (responseObject.errorCode !== 0) {
          console.log("onConnectionLost:" + responseObject.errorMessage);
          console.log("连接已断开");
        }
      },
      onMessageArrived(message) {
        //BIM/door/10000/223293220/msg
        //{"direction": 2, "gate_ip": "192.168.0.254", "gate_sn": "223293220", "rfid": "611477", "door_no": "2", "msg": "\u67e5\u65e0\u6b64\u5361\u7528\u6237\u4fe1\u606f", "project_id": "10000", "id": "0e07ca193c894e4fbaeba499c0108e34", "onoff": -1}
        console.log("收到消息:" + message.destinationName + message.payloadString);


        if (message.destinationName === this.topicCount) {
          this.mqttUserCount(message.payloadString)
        } else {
          this.$refs.gateArea.receiveData(message)
        }
      },
      onConnect() {
        console.log("onConnected");
        this.isConnectMqtt = true;
      },
      onFailure(eee) {
        this.isConnectMqtt = false;
        this.info_system = "通讯断开..."
        console.log("onFailure", eee);
      },
      reconnectMqtt() {
        console.log('reconnectMqtt')
        this.timerReconnectMqtt = setTimeout(() => {
          if (this.isConnectMqtt === false) {
            this.mqttConnect()
            this.reconnectTimes++
            this.info_system = `重新开始进行通讯连接${this.reconnectTimes}...`
          }
          this.reconnectMqtt()
        }, 5 * 1000)
      },
      mqttUserCount(data) {

        const _data = JSON.parse(data)
        console.log('count', _data)
        this.count_data = _data
        if (this.$refs.count_info !== undefined) {
          this.$refs.count_info.updateData(_data)
        }


        /*
        新赠一个统计消息 BIM/door/xxx{project_id}/count   
        {'person': {'count_in': 1}, 'vip': {'count_in': 1}, 'all_count_in': 2} 
        进场人数统计 person：普通，vip 为vip进场数，'all_count_in'总进场数
        */

      },
      personInoutDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonInoutDialog', param).then(() => {}).catch(() => {

        })
      },
      personNowInDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonNowInDialog', param).then(() => {}).catch(() => {

        })
      },
      personListDialogHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonListDialog', param).then(() => {}).catch(() => {

        })
      },
      personFullCalendarHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonFullCalenderDialog', param).then(() => {}).catch(() => {

        })
      },
      subscribe() {
        if (this.isConnectMqtt === true && this.project_id !== null) {
          this.topicUserInfo = `BIM/door/${this.project_id}/#` //订阅用户信息
          this.topicCount = `BIM/door/${this.project_id}/count` //订阅统计消息
          // BIM/door/10001/count
          this.client.subscribe(this.topicUserInfo); //订阅主题
          this.client.subscribe(this.topicCount); //订阅主题
          console.log("订阅成功！")
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicUserInfo !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicUserInfo); //订阅主题
          this.client.unsubscribe(this.topicCount); //订阅主题
          console.log("取消订阅成功！")
        }
      }
    }
  }

</script>
