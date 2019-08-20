<style lang="scss">
  @import "./gateArea.scss";

</style>

<template>
  <div class="screen-gate-area">
    <Gate ref="gate1"></Gate>
    <div class="gateLineBox"></div>
    <Gate ref="gate2"></Gate>
  </div>
</template>
<script>
  import Gate from './gate'

  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)
  export default {
    components: {
      Gate
    },
    data() {
      return {
        project_id: null,

        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接

        topicUserInfo: '', //订阅用户信息
        topicCount: '',
        reconnectTimes: 0, //重连次数
        deviceIDs: []
      }
    },
    props: {

    },
    computed: {
      projectGatePerson() {
        return this.$store.state.project.projectGatePerson
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
      // this.mqttConnect()
      // this.getProjectGatePerson()
    },
    destroyed() {
      this.unsubscribe()
      clearTimeout(this.timerReconnectMqtt)
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      init(project_id, datumMeterMap) {
        this.project_id = project_id

        datumMeterMap.forEach(datum => {
          if (datum.device_type === 14) {
            // this.cameraURList.push(datum)
            this.deviceIDs.push(datum.device_id)


          }
        })
        this.getProjectGatePerson()
        this.mqttConnect()
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
        // console.log("收到消息11:" + message.destinationName + message.payloadString);
        if (message.destinationName === this.topicCount) {
          // console.log('this.topicCount', this.topicCount)
        } else if (message.destinationName === `BIM/door/${this.project_id}/cmd`) {

        } else {
          this.mqttUserInfo(message.payloadString)

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
      subscribe() {
        if (this.isConnectMqtt === true && this.project_id !== null) {
          this.topicUserInfo = `BIM/door/${this.project_id}/#` //订阅用户信息
          this.topicCount = `BIM/door/${this.project_id}/count`
          // BIM/door/10001/count
          this.client.subscribe(this.topicUserInfo); //订阅主题
          console.log("订阅成功！", this.topicUserInfo)
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicUserInfo !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicUserInfo); //订阅主题
          console.log("取消订阅成功screen！")
        }
      },

      mqttUserInfo(data) {
        const _data = JSON.parse(data)
        const _gateID = `gate${_data.door_no}`
        this.$refs[_gateID].updateData(_data)
        this.$emit('gateMessage', _data)
      },
      getProjectGatePerson() {
        if (this.project_id !== null) {
          const param = {
            method: 'project_gateperson',
            project_id: this.project_id
          }

          this.$store.dispatch('QueryProjectGatePerson', param).then(() => {
            console.log('this.projectGatePerson123', this.projectGatePerson)
            for (let key in this.projectGatePerson) {
              const GateData = this.projectGatePerson[key]

              if (this.deviceIDs.indexOf(GateData.gate_sn) !== -1) {
                const _gateID = `gate${GateData.door_no}`
                // console.log("_gateID", _gateID)
                // console.log('this.deviceIDs', this.deviceIDs)
                // console.log('indexOf', this.deviceIDs.indexOf(GateData.gate_sn))
                if (GateData !== undefined) {
                  this.$refs[_gateID].setProjectGatePerson(GateData)

                }
              }
            }
          }).catch(() => {

          })
        }

      },
    },

  }

</script>
