<style lang="scss">
  @import "./message.scss";

</style>
<template>
  <div id="screen-message-info" class="screen-message-info">
    <!--  -->
    <!-- <MessageDefault v-show="isShowMessage===false"></MessageDefault> -->
    <div id="divMessage" style="position: relative;">
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
      <div v-html="listData" class="divContent"></div>
    </div>

  </div>
</template>
<script>
  import moment from 'moment'
  import axios from 'axios'
  import $ from 'jquery'
  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)
  export default {
    components: {
      // MessageDefault
    },
    data() {
      return {
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接
        info_system: '', //系统信息
        reconnectTimes: 0, //重连次数
        topicCMD: '', //指令

        project_id: 10000,
        isShowMessage: true,
        color: '#FF0000',
        message_content: '',
        listData: "",
        roll: true,
        timeoutScroll: null
      }
    },
    created() {
      this.client.onConnectionLost = this.onConnectionLost; //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived; //注册消息接收处理事件
    },

    watch: {
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
          // this.info_system = ''
        }
      }
    },
    mounted() {
      this.getMessage()
      this.mqttConnect()

    },
    destroyed() {
      this.unsubscribe()
      // clearTimeout(this.timerReconnectMqtt)
    },
    methods: {
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
        console.log("收到消息-messgage:" + message.destinationName + message.payloadString);
        if (message.destinationName === `BIM/door/${this.project_id}/cmd`) {
          this.getMessage()
        } 
        // this.updateData(message.payloadString)
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
      subscribe() {
        if (this.isConnectMqtt === true && this.project_id !== null) {
          this.topicCMD = `BIM/door/${this.project_id}/cmd` // 消息刷新指令
          // BIM/door/10001/count
          this.client.subscribe(this.topicCMD); //订阅主题
          console.log("订阅成功！", this.topicCMD)
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicCMD !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicCMD); //订阅主题
          console.log("取消订阅成功！")
        }
      },
      refreshHeight() {
        setTimeout(() => {
          let _divContain = $('#screen-message-info').height()
          let _scrollTop = $('#screen-message-info').scrollTop()
          let _divHeight = $('#divMessage').height()
          if (_scrollTop === 0) {
            setTimeout(() => {
              $('#screen-message-info').scrollTop(_scrollTop + 1);
              this.refreshHeight()
            }, 5000) //120秒
          } else if (_scrollTop >= (_divHeight - _divContain)) {
            setTimeout(() => {
              $('#screen-message-info').scrollTop(0);
              this.refreshHeight()
            }, 5000) //120秒
          } else {
            $('#screen-message-info').scrollTop(_scrollTop + 1);
            this.refreshHeight()
          }
          // console.log('scrollTop', _scrollTop, _divHeight, _divContain)
        }, 100) //120秒
      },
      getMessage() {
        this.isShowMessage = false;
        this.listData = ""
        const param = {
          method: 'query',
          project_id: this.project_id,
          rows: 1,
          show_led: 1
        }
        this.$store.dispatch('QueryInfoMsg', param).then((msgList) => {
          console.log('msgList', msgList)
          if (msgList.length > 0) {
            let _msg = msgList[0]
            if (_msg.show_led === 1) {
              //   this.publishForm.msg = _msg.msg_cont
              this.listData = _msg.msg_cont
              this.isShowMessage = true
            }

          }
          setTimeout(() => {
            this.refreshHeight()
            // console.log('height', $('#divMessage').parent().height())
            // console.log('divMessage', $('#divMessage').height())
            // this.scrollTable()

          }, 5000) //120秒
        })
      },
    }
  }

</script>
