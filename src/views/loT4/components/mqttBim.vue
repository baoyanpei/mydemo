<template>
  <div class="mqtt-bim">
  </div>
</template>
<script>
  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)
  export default {
    directives: {},
    name: 'model3D-index',
    components: {},
    data() {
      return {
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接
        topicWeather: '', // 天气检测
        topicTJ1: '', // 塔机和升降机推送消息
        topicTJ2: '', // 塔机和升降机推送消息
        reconnectTimes: 0, //重连次数

      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
    },
    created() {
      this.client.onConnectionLost = this.onConnectionLost; //注册连接断开处理事件
      this.client.onMessageArrived = this.onMessageArrived; //注册消息接收处理事件

    },
    watch: {
      project_id(curVal, oldVal) {

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
      this.mqttConnect()

    },
    beforeDestroy() {
      console.log("beforeDestroy")
    },
    destroyed() {},
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
        let obj = JSON.parse(message.payloadString);
        // console.log("收到消息1:" + message.destinationName + message.payloadString);
        // this.initPerson(obj)
        // this.mqttWeather(message.payloadString)

        if (message.destinationName === this.topicWeather) {
          // console.log("收到天气消息:" + message.payloadString);
          //   this.mqttWeather(message.payloadString)
          this.$emit('mqttWeather', message.payloadString)
        } else if (message.destinationName.substring(0, 14) === 'BIM/Sets/zhgd/') { // 塔机和升降机推送消息
          //   this.mqttTJ(message)
          this.$emit('mqttTJ', message)
        }

      },
      onConnect() {
        console.log("onConnected");
        this.isConnectMqtt = true;
        // this.client.subscribe(this.topicWeather); //订阅天气检测
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
        //BIM/location/10000/#
        if (this.isConnectMqtt === true) {
          // this.topicUserInfo = `BIM/location/${this.project_id}/#` //订阅用户信息
          // this.topicCount = `BIM/location/${this.project_id}/count` //订阅统计消息
          // BIM/door/10001/count

          this.topicWeather = 'BIM/HJ/720/01'
          this.topicTJ1 = 'BIM/Sets/zhgd/DEYE/18090311/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
          this.topicTJ2 = 'BIM/Sets/zhgd/DEYE/18090302/#' //塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
          this.client.subscribe(this.topicWeather); //订阅主题
          this.client.subscribe(this.topicTJ1); //塔机和升降机推送消息
          this.client.subscribe(this.topicTJ2); //塔机和升降机推送消息
          // this.client.subscribe(this.topicCount); //订阅主题
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
      },
    }
  }

</script>
