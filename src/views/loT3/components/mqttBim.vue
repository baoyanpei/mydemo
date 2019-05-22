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
        reconnectTimes: 0, //重连次数
        datumMeterMap: new Map(),
        mqttMap: new Map()
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
        if (oldVal === null && curVal !== null) {
          this.mqttConnect()
        }
        if (oldVal !== null) {
          this.unsubscribe()
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
      // this.mqttConnect()

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
        // console.log("收到消息-BIM:" + message.destinationName + message.payloadString);
        // console.log('mqttMap', this.mqttMap)
        // this.initPerson(obj)
        // this.mqttWeather(message.payloadString)

        // this.mqttMap.forEach((datum, key, map) => {
        for (let [key, datum] of this.mqttMap) {
          key = key.replace('#', '')
          // console.log("--->", key, datum);
          
          if (message.destinationName.startsWith(key)) {
            // console.log('key', key, datum.device_type)
            if (datum.device_type === 15) {
              this.$emit('mqttWeather', message.payloadString)
              break
            } else if (datum.device_type === 13 || datum.device_type === 12) {
              this.mqttTJ(message, datum)
              break
            }
          }
        };


        // if (message.destinationName === this.topicWeather) {
        //   // console.log("收到天气消息:" + message.payloadString);
        //   //   this.mqttWeather(message.payloadString)
        //   this.$emit('mqttWeather', message.payloadString)
        // } else if (message.destinationName.substring(0, 14) === 'BIM/Sets/zhgd/') { // 塔机和升降机推送消息
        //   //   this.mqttTJ(message)
        //   // this.$emit('mqttTJ', message)

        // }

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
      async subscribe() {

        // BIM/Sets/zhgd/DEYE/18090302/RuntimeData
        // {"DownlineTime": "", "OnlineTime": "2019-05-22 11:11:44", "HxzId": "18090302", "HxzFactory": "DEYE", "RunTime": "0"}


        //BIM/location/10000/#
        if (this.isConnectMqtt === true) {
          // this.topicUserInfo = `BIM/location/${this.project_id}/#` //订阅用户信息
          // this.topicCount = `BIM/location/${this.project_id}/count` //订阅统计消息
          // BIM/door/10001/count

          await this.initDevlist()

          // {"mqtt":"BIM/HJ/720/01"}
          this.datumMeterMap.forEach(datum => {
            // BIM/Sets/zhgd/DEYE/18090311/# 塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
            // 'BIM/Sets/zhgd/DEYE/18090302/#' 塔机和升降机推送消息 BIM/Sets/zhgd/厂家/和匣子编号/cmd
            if ((datum.device_type === 15 || datum.device_type === 13 || datum.device_type === 12) && datum
              .params_json !== '') { // 环境检测仪
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.mqtt !== undefined) {
                this.client.subscribe(paramsJson.mqtt); //订阅主题
                this.mqttMap.set(paramsJson.mqtt, datum)
                console.log("订阅成功！", paramsJson.mqtt)
                if (datum.device_type === 15) {
                  this.topicWeather = paramsJson.mqtt
                }
              }

            }

          })

        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicUserInfo !== '') {
          this.datumMeterMap.forEach(datum => {

            if ((datum.device_type === 15 || datum.device_type === 13 || datum.device_type === 12) && datum
              .params_json !== '') { // 环境检测仪
              let paramsJson = JSON.parse(datum.params_json)
              if (paramsJson.mqtt !== undefined) {
                this.client.unsubscribe(paramsJson.mqtt); //订阅主题
                this.mqttMap.delete(paramsJson.mqtt)
                console.log("取消订阅成功！", paramsJson.mqtt)
              }

            }

          })
        }
      },
      initDevlist() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'devlist',
            project_id: this.project_id
          }
          this.datumMeterMap = new Map()
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            // console.log('QueryDatumMeter - data', data)
            data.forEach(datum => {
              this.datumMeterMap.set(datum.device_id, datum)
            })
            console.log('QueryDatumMeter', this.project_id, this.datumMeterMap)
            resolve()
          }).catch((e) => {
            console.log(e)
            resolve()
          })


        })
      },
      mqttTJ(data, datum) {
        // console.log('mqttTJ', data)
        const _destinationName = data.destinationName
        const _payloadString = data.payloadString

        const destinationNameArray = _destinationName.split('/')
        // const TJNO = destinationNameArray[4] //黑匣子编号
        const _cmd = destinationNameArray[5] //指令
        switch (datum.device_type) {
          case 13: // 塔吊
            // console.log('塔吊', data)
            // this.mqttTaDiao(_cmd, _payloadString)
            this.$emit('mqttTaDiao', _cmd, _payloadString)
            break;
          case 12: // 升降机
            // console.log('升降机', data)
            // this.mqttShenJiangJi(_cmd, _payloadString)
            this.$emit('mqttShenJiangJi', _cmd, _payloadString)
            break;
        }
      },
    }
  }

</script>
