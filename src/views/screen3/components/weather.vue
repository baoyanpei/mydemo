<style lang="scss">
  @import "./weather.scss";

</style>

<template>
  <div class="screen-weather">
    <div v-if="topicWeather === ''" class="noWeatherTips">{{noWeatherTips}}</div>
    <div v-if="topicWeather !== ''" class="weather-info">

      <el-row class='weather-row'>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-1.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: TempColor}" class="box1">
                  {{weather_data.temp}} °C
                </span>
              </div>
              <div class="label">温度</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-2.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: HColor}">
                  {{weather_data.h}} %
                </span>
              </div>
              <div class="label">湿度</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class='weather-row'>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-3.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: NoiseColor}">
                  {{weather_data.noise}} db
                </span>
              </div>
              <div class="label">噪声</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-4.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: WindColor}">
                  {{ weather_data.wind }} 级
                </span>
              </div>
              <div class="label">风速</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row class='weather-row'>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-5.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: PM10Color}">
                  {{weather_data.pm10}} ug/m<sup>3</sup>
                </span>
              </div>
              <div class="label">扬尘</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col :span="6" class="icon-img">
              <img src="/static/screen/red/icon-6.png">
            </el-col>
            <el-col :span="18">
              <div>
                <span v-bind:style="{ color: PM2_5Color}">
                  {{weather_data.pm2_5}} ug/m<sup>3</sup>
                </span>
              </div>
              <div class="label">PM2.5</div>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'

  const MQTT_USERNAME = 'BIM_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'bim_msg159' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)

  export default {
    components: {},
    data() {
      return {
        noWeatherTips: '',
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接

        info_system: '', //系统信息
        reconnectTimes: 0, //重连次数

        topicWeather: '', // 天气检测

        project_id: null,
        weather_data: {},
        TempColor: '#FF00000',
        HColor: '#FF00000',
        PM10Color: '#FF00000',
        PM2_5Color: '#FF00000',
        NoiseColor: '#FF00000',
        WindColor: '#FF00000'
      }
    },
    props: {

    },
    computed: {

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
    },
    destroyed() {
      this.unsubscribe()
      clearTimeout(this.timerReconnectMqtt)
    },
    methods: {
      init(project_id, datumMeterMap) {
        this.project_id = project_id
        // console.log('datumMeterMap', datumMeterMap)
        datumMeterMap.forEach(datum => {
          if (datum.device_type === 15 && datum.params_json.length > 0) {
            // this.cameraURList.push(datum)

            const params_json = JSON.parse(datum.params_json)
            const _mqtt = params_json.mqtt
            if (_mqtt !== undefined && _mqtt !== '') {
              this.topicWeather = _mqtt // 天气检测


              this.mqttConnect()

              window.addEventListener("online", () => {
                this.mqttConnect()
              }); // offline网络连接事件        
              window.addEventListener("offline", () => {
                // this.mqttConnect()
              })
            }
          }
        })

        if (this.topicWeather === '') {
          this.noWeatherTips = '该项目没有配置环境检测仪'
        }
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
        // console.log("收到消息:" + message.destinationName + message.payloadString);

        this.updateData(message.payloadString)
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
          // this.topicWeather = `BIM/HJ/720/01` //订阅用户信息
          // BIM/door/10001/count
          this.client.subscribe(this.topicWeather); //订阅主题
          console.log("订阅成功！", this.topicWeather)
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicWeather !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicWeather); //订阅主题
          console.log("取消订阅成功！")
        }
      },
      updateData(data) {
        this.weather_data = JSON.parse(data)
        // console.log("this.weather_data", this.weather_data)
        // 1.温度：适宜的温度在18℃－24℃；温度高于适宜度为红色，在适宜度区间为绿色，在适宜度以下为蓝色
        const Temp = this.weather_data.temp
        if (Temp > 24) {
          this.TempColor = '#FF0000'
        } else if (Temp < 18) {
          this.TempColor = '#409EFF'
        } else {
          this.TempColor = '#67C23A'
        }
        // 2.湿度：适宜湿度在45％RH－65％RH之间；湿度在适宜度以下为红色，适宜度为绿色，适宜度以上为橘黄色
        const H = this.weather_data.h
        if (H > 65) {
          this.HColor = '#E78163'
        } else if (H < 45) {
          this.HColor = '#FF0000'
        } else {
          this.HColor = '#67C23A'
        }

        // 3.PM10：一级标准24 小时平均浓度限值50μg/m3；二级标准24 小时平均浓度限值150μg/m3；小于一级标准的为绿色，大于二级标准为橙黄色，大于二级标准为红色
        const PM10 = this.weather_data.pm10
        if (PM10 > 150) {
          this.PM10Color = '#FF0000'
        } else if (PM10 < 50) {
          this.PM10Color = '#67C23A'
        } else {
          this.PM10Color = '#E78163'
        }

        // 4.PM2.5：一级标准24 小时平均浓度限值35μg/m3；二级标准24 小时平均浓度限值75μg/m3；小于一级标准的为绿色，大于二级标准为橙黄色，大于二级标准为红色
        const PM2_5 = this.weather_data.pm2_5
        if (PM2_5 > 75) {
          this.PM2_5Color = '#FF0000'
        } else if (PM10 < 35) {
          this.PM2_5Color = '#67C23A'
        } else {
          this.PM2_5Color = '#E78163'
        }

        // 5.噪音：50分贝下为绿色，50分贝以上到90分贝为橙黄色，90分贝以上为红色
        const Noise = this.weather_data.noise
        if (Noise > 90) {
          this.NoiseColor = '#FF0000'
        } else if (Noise < 50) {
          this.NoiseColor = '#67C23A'
        } else {
          this.NoiseColor = '#E78163'
        }

        // 6.风力：等级请见附件；5级以上的用红色标示
        const Wind = this.weather_data.wind
        if (Wind > 5) {
          this.WindColor = '#FF0000'
        } else {
          this.WindColor = '#67C23A'
        }
      }
    },

  }

</script>
