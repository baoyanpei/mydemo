<template>
  <div class="mqtt-location">
  </div>
</template>
<script>
  import {
    CSS2DRenderer,
    CSS2DObject
  } from 'three-css2drender';
  const MQTT_USERNAME = 'LOC_messager' // mqtt连接用户名
  const MQTT_PASSWORD = 'LOC_12342234' // mqtt连接密码 
  const CLIENT_ID = 'WebClient-' + parseInt(Math.random() * 100000)
  export default {
    directives: {},
    name: 'model3D-index',
    components: {},
    data() {
      return {
        labelRenderer: null,
        client: new Paho.MQTT.Client("d1.mq.tddata.net", 8083, CLIENT_ID),
        timerReconnectMqtt: null,
        isConnectMqtt: null, //是否已经连接
        topicUserInfo: '', //订阅用户信息
        topicCount: '', //订阅统计消息
        reconnectTimes: 0, //重连次数
        personGroup: new THREE.Group(),
        lablePosisionList: {}

      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      modelMap() {
        return this.$store.state.model3d.modelMap
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
        //BIM/door/10000/223293220/msg
        //{"direction": 2, "gate_ip": "192.168.0.254", "gate_sn": "223293220", "rfid": "611477", "door_no": "2", "msg": "\u67e5\u65e0\u6b64\u5361\u7528\u6237\u4fe1\u606f", "project_id": "10000", "id": "0e07ca193c894e4fbaeba499c0108e34", "onoff": -1}
        console.log("收到消息:" + message.destinationName + message.payloadString);
        let obj = JSON.parse(message.payloadString);
        // console.log("收到消息:" + message.payloadString);
        this.initPerson(obj)
        // if (message.destinationName === this.topicCount) {
        //   this.mqttUserCount(message.payloadString)
        // } else {
        //   this.$refs.gateArea.receiveData(message)
        // }
      },
      initPerson(obj) {
        // if (obj.name=="84:0d:8e:81:d4:3c"){
        //     obj.name = "x";
        //     editPerson(obj)
        //     obj.name = "x1";
        //     obj.x = obj.x1;
        //     obj.y = obj.y1;
        //     editPerson(obj)
        // }
        //editPerson(obj)
        // obj.name = obj.name + "_1";
        obj.x = obj.x1;
        obj.y = obj.y1;
        this.editPerson(obj)
      },
      editPerson(obj) {
        let ex = this.personGroup.getObjectByName(obj.name, true)
        if (ex) {
          // ex.position.x = obj.x/1000-20.8;
          ex.position.x = obj.x / 1000;
          // ex.position.y = obj.y/1000-38.9;
          ex.position.y = obj.y / 1000;
          let thisb = $('#' + obj.labid)[0];
          if (thisb != undefined) {
            thisb.innerText = obj.name + ' -- ' + obj.datatime.substr(11, 5);
          }
        } else {
          let personGeometry = new THREE.SphereGeometry(0.2);
          //颜色根据传入的信息变化（白，蓝，黄，红）
          let hatColor = Math.floor(Math.random() * 4.99) + 1;
          switch (hatColor) {
            case 1:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x00FFFF
              });
              break;
            case 2:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0xFF0000
              });
              break;
            case 3:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x0000FF
              });
              break;
            case 4:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0x00FF00
              });
              break;
            default:
              var personMaterial = new THREE.MeshLambertMaterial({
                color: 0xFFFF00
              });
          }
          //var personMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
          //var personMaterial = new THREE.MeshLambertMaterial({color: obj.hatColor});
          let person = new THREE.Mesh(personGeometry, personMaterial);
          person.geometry.verticesNeedUpdate = true;
          person.geometry.normalsNeedUpdate = true;

          // 创建DIV跟随
          let thisbt = document.createElement('button');
          thisbt.className = 'locationLabel'
          thisbt.style.marginTop = '-1em';
          thisbt.innerText = obj.name + ' -- ' + obj.datatime.substr(11, 5);
          thisbt.id = obj.labid;


          // console.log('thisbt', thisbt)
          let lable = new CSS2DObject(thisbt);
          // console.log('lable', lable)
          // lable.position.copy(ex.position);
          // console.log('lable', lable)

          let pName = Math.round(obj.x / 500) + ',' + Math.round(obj.y / 500)

          lable.position.z = this.getLablePosition(pName);

          lable.name = obj.name + "_b";

          //Z坐标来自于所属楼层的Z坐标中心点
          person.position.z = (obj.layer - 1) * 3.5 + 1.6;
          //X,Y坐标来自于传入数据
          person.position.x = obj.x / 1000;
          person.position.y = obj.y / 1000;
          //name来自于传入的数据
          person.name = obj.name;
          person.add(lable)
          //person.visible = inBuilding(person,boxes[floorIndex-1]);
          this.personGroup.add(person);
        }
      },
      getLablePosition(a) {
        let z
        if (this.lablePosisionList.hasOwnProperty(a)) {
          z = this.lablePosisionList[a][this.lablePosisionList[a].length - 1] + 0.5
          this.lablePosisionList[a].push(z)
        } else {
          z = 0.5;
          this.lablePosisionList[a] = [z]
        }
        return z
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
        //BIM/location/10000/#
        if (this.isConnectMqtt === true) {
          this.topicUserInfo = `BIM/location/10000/#` //订阅用户信息
          // this.topicCount = `BIM/location/${this.project_id}/count` //订阅统计消息
          // BIM/door/10001/count
          this.client.subscribe(this.topicUserInfo); //订阅主题
          // this.client.subscribe(this.topicCount); //订阅主题
          console.log("订阅成功123！")
        }
      },
      unsubscribe() {
        if (this.isConnectMqtt === true && this.topicUserInfo !== '') {
          // 取消老的订阅
          this.client.unsubscribe(this.topicUserInfo); //订阅主题
          //   this.client.unsubscribe(this.topicCount); //订阅主题
          console.log("取消订阅成功！")
        }
      },
    }
  }

</script>
