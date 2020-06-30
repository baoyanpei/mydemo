<style lang="scss">
@import './tajiArea.scss';
</style>

<template>
  <div class="screen-taji-area">
    <el-row>
      <el-col :span="12">
        <TadiaoTaji ref="taji"></TadiaoTaji>
      </el-col>
      <el-col :span="12">
        <ShenjiangjiTaji ref="shenjiangji"></ShenjiangjiTaji>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import lodash from 'lodash'
import moment from 'moment'
import TadiaoTaji from './tadiaoTaji'
import ShenjiangjiTaji from './shenjiangjiTaji'
const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码
const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)

export default {
  components: {
    TadiaoTaji,
    ShenjiangjiTaji
  },
  data() {
    return {
      client: new Paho.MQTT.Client('d1.mq.tddata.net', 8083, CLIENT_ID),
      timerReconnectMqtt: null,
      isConnectMqtt: null, //是否已经连接

      info_system: '', //系统信息
      reconnectTimes: 0, //重连次数

      topicTJ1: '', // 塔机
      topicTJ2: '', // 升降机
      TJ_Height: '', // 塔机的高度
      SJJ_DeviceID: '', // 升降机
      project_id: null,
      mqttMap: new Map(),

      mqttTajiMap: new Map(),
      mqttSjjMap: new Map(),
      tdDataList: []
    }
  },
  props: {},
  computed: {},
  created() {
    this.client.onConnectionLost = this.onConnectionLost //注册连接断开处理事件
    this.client.onMessageArrived = this.onMessageArrived //注册消息接收处理事件
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
  },
  destroyed() {
    // console.log('destroyeddestroyeddestroyeddestroyeddestroyeddestroyed')
    // this.unsubscribe()
    // clearTimeout(this.timerReconnectMqtt)
  },
  methods: {
    init(project_id, allDeviceConfigList) {
      this.project_id = project_id

      allDeviceConfigList.forEach(device => {
        // 升降机
        if (device.device_type === 12) {
          // this.cameraURList.push(device)

          const _mqtt = device.mqtt_url
          if (_mqtt !== undefined && _mqtt !== '') {
            this.mqttSjjMap.set(device.id, device)
          }
        } else if (device.device_type === 13) {
          // 塔机
          console.log('塔机塔机', device)
          const _mqtt = device.mqtt_url
          if (_mqtt !== undefined && _mqtt !== '') {
            // this.mqttTajiMap.set(device.id, device)
            device.mqttData = ''
            this.tdDataList.push(device)
          }
        }
      })
      console.log('this.tdDataList', this.tdDataList)
      console.log('this.mqttSjjMap', this.mqttSjjMap)
      if (this.tdDataList.length === 0) {
        this.$refs.taji.noDevice()
      } else {
        this.$refs.taji.init(this.tdDataList)
      }
      if (this.mqttSjjMap.size === 0) {
        this.$refs.shenjiangji.noDevice()
      }
      this.mqttConnect()

      window.addEventListener('online', () => {
        this.mqttConnect()
      }) // offline网络连接事件
      window.addEventListener('offline', () => {
        // this.mqttConnect()
      })
    },
    mqttConnect() {
      this.client.connect({
        userName: MQTT_USERNAME,
        password: MQTT_PASSWORD,
        onSuccess: this.onConnect,
        onFailure: this.onFailure
      }) //连接服务器并注册连接成功处理事件
    },
    onConnectionLost(responseObject) {
      console.log('onConnectionLost', responseObject)
      this.isConnectMqtt = false
      this.info_system = '通讯断开...'
      if (responseObject.errorCode !== 0) {
        console.log('onConnectionLost:' + responseObject.errorMessage)
        console.log('连接已断开')
      }
    },
    onMessageArrived(message) {
      //BIM/door/10000/223293220/msg
      //{"direction": 2, "gate_ip": "192.168.0.254", "gate_sn": "223293220", "rfid": "611477", "door_no": "2", "msg": "\u67e5\u65e0\u6b64\u5361\u7528\u6237\u4fe1\u606f", "project_id": "10000", "id": "0e07ca193c894e4fbaeba499c0108e34", "onoff": -1}
      console.log(
        '收到消息 - mqttTJ:' + message.destinationName + message.payloadString
      )
      const _data = JSON.parse(message.payloadString)
      for (let device of this.tdDataList) {
        // 塔吊
        // console.log('device111', device, _data)
        if (
          device.device_id === _data.device_id &&
          _data.rotate !== undefined
        ) {
          device.mqttData = _data
          this.mqttTadiao(this.tdDataList)
        }
      }

      // for (let [key, device] of this.mqttMap) {
      //   // console.log("mqttMap", this.mqttMap)
      //   key = key.replace('#', '')
      //   if (message.destinationName.startsWith(key)) {
      //     if (device.device_type === 13 || device.device_type === 12) {
      //       this.mqttTJ(message, device)
      //       break
      //     }
      //   }
      // }
    },
    onConnect() {
      console.log('onConnected')
      this.isConnectMqtt = true
    },
    onFailure(eee) {
      this.isConnectMqtt = false
      this.info_system = '通讯断开...'
      console.log('onFailure', eee)
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
        // this.topicTJ1 = 'BIM/Sets/zhgd/DEYE/18090311/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
        // this.topicTJ2 = 'BIM/Sets/zhgd/DEYE/18090302/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
        // BIM/door/10001/count

        for (let device of this.tdDataList) {
          this.client.subscribe(device.mqtt_url) //订阅主题
          console.log('订阅成功！tajiArea', device.mqtt_url)
        }

        for (let [key, device] of this.mqttSjjMap) {
          this.client.subscribe(device.mqtt_url) //订阅主题
          console.log('订阅成功！tajiArea', device.mqtt_url)
        }

        // if (this.topicTJ1 !== '') {
        //   this.client.subscribe(this.topicTJ1) //塔机
        // }
        // if (this.topicTJ2 !== '') {
        //   this.client.subscribe(this.topicTJ2) //升降机
        // }
        // console.log('订阅成功！', this.topicTJ1)
        // console.log('订阅成功！', this.topicTJ2)
      }
    },
    // unsubscribe() {
    //   if (this.isConnectMqtt === true) {
    //     // 取消老的订阅

    //     for (let [key, device] of this.mqttTajiMap) {
    //       this.client.unsubscribe(device.mqtt_url) //订阅主题
    //       console.log('订阅成功！tajiArea', device.mqtt_url)
    //     }

    //     for (let [key, device] of this.mqttSjjMap) {
    //       this.client.unsubscribe(device.mqtt_url) //订阅主题
    //       console.log('订阅成功！tajiArea', device.mqtt_url)
    //     }
    //   }
    // },

    mqttTJ(data, device) {
      // console.log('mqttTJ', data)
      const _destinationName = data.destinationName
      const _payloadString = data.payloadString
      const destinationNameArray = _destinationName.split('/')
      console.log('destinationNameArray111', destinationNameArray)

      const _cmd = destinationNameArray[5] //指令
      switch (device.device_type) {
        case 13: // 塔吊
          // this.mqttTaDiao(_cmd, _payloadString)
          break
        case 12: // 升降机
          this.mqttShenJiangJi(_cmd, _payloadString)
          break
      }
    },
    // mqttTaDiao(cmd, data) { //塔吊
    //   // console.log('塔吊', cmd)
    //   switch (cmd) {
    //     case "RealtimeDataCrane": // 2.3 上报塔机实时数据（专用）
    //       const _data = JSON.parse(data)
    //       console.log('RealtimeDataCrane', _data)
    //       this.$refs.taji.updateData(_data,this.TJ_Height)
    //       break
    //   }
    // },
    mqttTadiao(tdDataList) {
      //塔吊
      // const _data = JSON.parse(data)
      console.log('mqttTaDiao123', tdDataList)

      this.$refs.taji.updateData(tdDataList)
    },
    mqttShenJiangJi(cmd, data) {
      //升降机
      console.log('升降机', cmd)
      let _data = null
      switch (cmd) {
        case 'RealtimeDataElevator': // 2.11上报升降机实时数据（专用）
          _data = JSON.parse(data)
          console.log('RealtimeDataElevator', _data)
          this.$refs.shenjiangji.updateData(_data)
          break
        case 'WorkDataElevator': // 2.11上报升降机工作循环数据（专用）
          _data = JSON.parse(data)
          console.log('RealtimeDataCrane', _data)
          // this.$refs.shenjiangji.updateData(_data)
          break
      }
    }
  }
}
</script>
