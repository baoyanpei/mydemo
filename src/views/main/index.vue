<style lang="scss">
  @import "./index";
.logobox{
    float: left;
    width: 60px;
    margin-left: 5px;
    height: 20px;
    border: 1px solid #1abc9c;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
    color: #1abc9c;
  }
   /*状态信息颜色*/
  .statered{
    background-color: red;
  }
  .stategray{
    background-color: #BABABA;
  }
  .stateyellow{
    background-color: yellowgreen;
  }
  .stategreen{
    background-color: green;
  }
  .tajijiaoduleft{
    float: left;
    width: 50%;
    height: 100%;
  }
</style>
<template>
  <div class="main-container" style="margin: 0px;">
    <CountInfoBoard ref="count_info"></CountInfoBoard><!--人员组别清单-->
    <div class="gate-area-div"><!--具体人员清单-->
      <GeteArea ref="gateArea"></GeteArea>
    </div>
    <!--温度测试-->
    <div class="temperature">
      <h1>环境监测</h1>
      <div class="huanjingbox" v-show="huanjingshow2">
        暂无环境数据
      </div>
      <div v-show="huanjingshow">
          <div class="huanjinline" style="width: 100%;height: 30px;margin-top: 15px;padding: 0 75px 0 20px">
            <span style="float: left;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">温度:<span>{{temp}}℃</span></span>
            <span style="float: right;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">湿度:<span>{{shiduh}}%</span></span>
          </div>
          <div class="huanjinline" style="width: 100%;height: 30px;margin-top: 15px;padding: 0 85px 0 20px">
            <span style="float: left;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">噪声:<span>{{noise}}db</span></span>
            <span style="float: right;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">风速:<span>{{wind}}级</span></span>
          </div>
          <div class="huanjinline" style="width: 100%;height: 30px;margin-top: 15px;padding: 0 20px">
            <span style="float: left;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">扬尘:<span>{{powder}}ug/m3</span></span>
            <span style="float: right;line-height: 30px;font-size: 15px;font-weight: 600;color: #FF0000;">PM2.5:<span>{{pm25}}ug/m3</span></span>
          </div>
      </div>
    </div>
    <!--最新任务-->
    <div class="newtask">
      <div class="newtask_top">
        <span style="font-size: 18px;">&nbsp;&nbsp;最新任务</span>
        <i class="el-icon-arrow-right" @click="newtaskjumpfnc"></i>
      </div>
      <div class="taskbottom" style="width: 100%;overflow: hidden;border: 1px solid #BABABA">
        <div class="tasksmall" v-for="item in this.taskbox" style="width: 90%;height: 130px;border: 1px solid #e7e7e7;margin:10px auto;">
          <div class="taskbanner" style="height: 20px;border-bottom: 1px solid #e7e7e7">
            <img src="/static/icon/BrowserPreview_tmp%20(2).png" alt="" style="width: 15px;height: 15px;margin-top: 2px;margin-left: 8px;float: left">
            <span style="font-size: 13px;display: block;float: left;margin-top: 3px;margin-left: 10px;font-weight: 800">{{item.first}}</span>
            <span style="font-size: 13px;display: block;float: left;margin-top: 3px;margin-left: 10px;font-weight: 800">—</span>
            <span style="font-size: 13px;display: block;float: left;margin-top: 3px;margin-left: 10px;font-weight: 800">{{item.questions_type}}</span>
            <div class="statusbox" style="float: right;width: 40px;height: 14px;font-size: 10px;margin-top: 3px;margin-right: -5px;text-align: center;line-height: 14px;color: #eaeefb"
            :class="{'statered':(item.statecolor==='red'),'stateyellow':(item.statecolor==='yellow'),'stategreen':(item.statecolor==='green'),'stategray':(item.statecolor==='gray')}">
              {{item.status}}</div>
          </div>
          <div class="tasknei" style="width: 100%;height: 108px;">
            <div class="taskneileft" style="width: 120px;height: 100%;float: left">
              <img :src=item.imgurl alt="" style="width: 110px;height: 100px;margin-top: 5px;margin-left: 5px">
            </div>
            <div class="taskright" style="float: left;width: 262px;height: 100%;position: relative">
              <span style="margin-top: 5px;display: block;overflow: hidden;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient: vertical;">{{item.title}}</span>
              <span style="display: block;font-size: 12px;color: #a8a8a8;margin-top: 5px">发起人:<span style="color: #000000">{{item.originator}}</span></span>
              <span style="display: block;font-size: 12px;color: #a8a8a8;margin-top: 5px">发起时间:<span style="color: #000000">{{item.created}}</span></span>
              <div class="taskrightbottom" style="position: absolute;bottom: 0;height: 25px;width:100%;">
                  <div class="logobox">{{item.first}}</div>
                  <div class="logobox">{{item.questions_type}}</div>
                  <div class="star_block" style="float: right;"><el-rate v-model="item.value" disabled :max=3></el-rate></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--物联设备-->
    <div class="equipment" style="border: 1px solid #BABABA">
      <div class="newtask_top">
        <span style="font-size: 18px" >&nbsp;&nbsp;物联设备</span>
        <i class="el-icon-arrow-right" @click="newwulianjumpfnc"></i>
      </div>
      <div class="shuidian" style="width: 95%;margin:10px auto;height: 100px;border: 1px solid #e5e5e5;border-radius: 10px;">
        <div class="shuidianleft" style="width: 50%;height: 80%;border-right: 1px solid #e5e5e5;margin-top: 10px;float: left">
          <img src="../../../static/mainpng/3522ca9f171f5bc9cd2400a2534b40b.png" alt="" style="width: 60px;height: 60px;margin-top: 10px;margin-left: 20px;float: left">
          <div class="dianbiao" style="width: 180px;height: 100%;float: left;margin-left: 30px;" v-show="dianbiaoshow">
            <span style="font-size: 15px;display: block;margin-top: 10px;color: #909399">总读数:<span>{{eleallnum}}</span></span>
            <br>
            <span style="font-size: 18px;color: #909399">今日用量:<span>{{todayelenum}}度</span></span>
          </div>
          <div class="dianbiaonone" style="float: left;width: 180px;height: 100%;" v-show="dianbiaoshow2">
            暂无电表信息
          </div>
        </div>
        <div class="shuidianleft" style="width: 50%;height: 80%;margin-top: 10px;float: left">
          <img src="../../../static/mainpng/shuibiao.png" alt="" style="width: 60px;height: 60px;margin-top: 10px;margin-left: 20px;float: left">
          <div class="dianbiao" style="width: 180px;height: 100%;float: left;margin-left: 30px" v-show="shuibiaoshow">
            <span style="font-size: 15px;display: block;margin-top: 10px;color: #909399">总读数:<span>{{waterallnum}}</span></span>
            <br>
            <span style="font-size: 18px;color: #909399">今日用量:<span>{{todaywaternum}}吨</span></span>
          </div>
          <div class="shuibiaonohave" style="float: left;width: 180px;height: 100%;" v-show="shuibiaoshow2">
            暂无水表信息
          </div>
        </div>
      </div>
      <div v-for="item in this.tajidatabox">
        <div class="tajitp" style="width: 220px;height: 230px;float: left;position: relative" v-show="tajitupianshow">
        <img src="../../../static/mainpng/taji.png" alt="" style="width:100%;height: 100%">
        <span style="position: absolute;left: 100px;top: 10px;">{{item.dabi}}°</span>
        <span style="position: absolute;left: 136px;top: 50px;">{{item.fudu}}m</span>
        <span style="position: absolute;left: 30px;top: 118px;">{{item.height1}}m</span>
        <span style="position: absolute;left: 180px;top: 150px;">{{item.height2}}m</span>
      </div>
        <div class="tajitupian2" v-show="tajitupianshow2">
          <img src="../../../static/mainpng/taji.png" alt="" style="width:100%;height: 100%">
        </div>
        <div class="tajiright" style="width:410px;height:230px;float: left;">
          <div class="tajirighttop" style="width: 100%;height: 30px;background-color: #1abc9c;">
            <span style="line-height: 30px;color: #ffffff;font-weight: 800;margin-left: 10px;">塔机数据</span>
          </div>
          <div class="tajibox" style="width: 100%;height: 25px;margin-top: 10px;">
            <div class="tajismallbox"  style="width: 60px;border: 1px solid #1abc9c;;height: 100%;text-align: center;line-height: 25px;font-size: 14px;color: #1abc9c;font-weight: 800;">
              {{item.tajiname}}</div>
          </div>
          <!--塔机角度 转角-->
          <div class="tajidata" v-show="tajishow">
            <div class="tajijiaodu" style="width: 100%;height: 50px;margin-top: 5px;">
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/jiaodu.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">大臂斜角</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.dabi}}</span>
              </div>
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/fengli.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">风速</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.fengsu}}</span>
              </div>
            </div>
            <div class="tajijiaodu" style="width: 100%;height: 50px;margin-top: 5px;">
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/huizhuan.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">回转</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.huizhuan}}</span>
              </div>
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/fudu.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">幅度</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.fudu}}</span>
              </div>
            </div>
            <div class="tajijiaodu" style="width: 100%;height: 50px;margin-top: 5px;">
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/huizhuan.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">力矩</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.liju}}</span>
              </div>
              <div class="tajijiaoduleft">
                <img src="../../../static/mainpng/zhongliang.png" alt="" style="float:left;width: 40px;height: 40px;margin-left: 40px;margin-top: 5px">
                <span style="float: left;font-size: 15px;margin-top: 5px;margin-left: 10px;">重量</span>
                <span style="display: block;margin-top: 25px;margin-left: 90px;">{{item.zhong}}</span>
              </div>
            </div>
          </div>
          <!--没有塔机数据的时候-->
          <div class="nohavetajidata" v-show="tajishow2">
              暂无塔机数据
          </div>
        </div>
      </div>
    </div>
    <!--进出车辆-->
    <div class="inoutcar" style="border: 1px solid #BABABA">
      <div class="newtask_top">
        <span style="font-size: 18px" >&nbsp;&nbsp;进出场车辆</span>
        <i class="el-icon-arrow-right" @click="newwulianjumpfnc"></i>
      </div>
      <div v-show="asasasas">
          <div class="carsmall" style="width: 100%;height: 100px;margin-top: 10px" v-for="item in this.carbox">
          <div class="carsmallleft" style="float:left;width: 40%;height: 100%;">
            <img :src=item.pic alt="" style="width: 90%;height: 90%;margin: 5%;">
          </div>
          <div class="carsmallright" style="float: right;width: 60%;height: 100%;">
              <h1 style="margin-top: 15px;float: left;margin-left: 20px;margin-right:50px;color: #0a131c">{{item.lisence}}</h1>
              <h2 style="display: block;float:left;font-size:13px;margin-left: 20px;color: #0a131c;margin-top: 25px;">进场时间:{{item.created_time}}</h2>
          </div>
        </div>
      </div>
      <div class="noanzhuang">未安装设备</div>
    </div>
    <div class="yizheng-logo">
      <img src="/static/yizheng-logo.png"/><!--易正科技图标LOGO-->
    </div>
    <div class="bim-toolbar"><!--底部图标按钮-->
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
              <font-awesome-icon icon="calendar-alt" size="2x" />
            </el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="发布管理" placement="top">
            <el-button @click="publishHandle" style="padding-top:4px;">
              <!-- <icon name="el-icon-date" scale="1.7"></icon> -->
              <font-awesome-icon icon="desktop" size="2x" />
            </el-button>
          </el-tooltip>
          <!--<el-tooltip class="item" effect="dark" content="测试" placement="top">-->
            <!--<el-button @click="ceshi">-->
              <!--<font-awesome-icon icon="user-cog" size="2x" />-->
            <!--</el-button>-->
          <!--</el-tooltip>-->
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
  import moment from 'moment'
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
        huanjingshow:true,
        huanjingshow2:false,
        tajitupianshow:true,
        tajitupianshow2:false,
        dianbiaoshow:true,
        dianbiaoshow2:false,
        shuibiaoshow:true,
        shuibiaoshow2:false,
        tajishow:true,
        tajishow2:false,
        tajinamenum:[],
        noise:"",//噪声
        pm25:"",//pm2.5
        wind:"",//风速
        shiduh:"",//湿度
        temp:"",//温度
        powder:"",//粉尘
        eleallnum:"",//电表总度数
        todayelenum:"",//今日走电
        waterallnum:0,//水表总度数
        todaywaternum:0,//今日水表走水
        carbox:[],//进出车辆表
        postdata:[],//数据筛选
        tajidevice_id:"",//塔机id
        tajidatabox:[{//塔机具体参数盒子
          height1:"",
          height2:"",
          fudu:"",
          dabi:"",
          fengsu:"",
          huizhuan:"",
          liju:"",
          zhong:"",
          tajiname:""
        }],
        listbox:[],
        taskbox:[],
        loadingFull: null,
        dialogTableVisible: false,
        dialogCJHYVisible: false,
        dialogHuiyiFullCalendar: false,
        // dialogJDHYVisible: true
        topicUserInfo: '', //订阅用户信息
        topicCount: '', //订阅统计消息
        reconnectTimes: 0, //重连次数
        allwaterdevicedid:0,//总水表id
        alleledevicedid:0,//总电表id
        asasasas:true,
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
        console.log("触发")
        console.log('curVal',curVal,oldVal)
        this.jiekoufnc()
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
      console.log("index mount",this.project_id)
      if (this.project_id !== null) {
        this.jiekoufnc()
      }
      else {
        console.log("没得project_id")
      }
    },
    destroyed() {
      // window.removeEventListener('hashchange', this.afterQRScan)
    },
    methods: {
      jiekoufnc(){
        this.initDevlist()
        this.inoutcarquery()
        this.smalltaskfnc()
        this.gettajifnc()
        this.huanjingjiancefnc()//总电表
        this.allwatergetfnc()//总水表
        this.gettajidatafnc()
      },
      newtaskjumpfnc(){
        this.$router.replace('/task')
      },
      newwulianjumpfnc(){
        this.$router.replace('/lot5/index')
      },
      initDevlist() {//环境检测
        console.log("数据",this.project_id)
          const param = {
            method: 'query_env',
            project_id: this.project_id
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('环境检测', data)
            this.noise=data[0].noise
            this.pm25=data[0].pm2_5
            this.wind=data[0].wind
            this.shiduh=data[0].h
            this.temp=data[0].temp
            this.powder=data[0].power
          })
      },
      gettajifnc(){
        const param = {
            method: 'devlist',
            project_id: this.project_id,
            device_type:13
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('塔机数据', data)
            if(data.length==0){
              this.tajishow=false
              this.tajishow2=true
              this.tajitupianshow=false
              this.tajitupianshow2=true
            }else{
              this.tajishow=true
              this.tajishow2=false
              this.tajitupianshow=true
              this.tajitupianshow2=false
              this.tajidevice_id=data[0].device_id
              let hei=JSON.parse(data[0].params_json)
              this.tajidatabox[0].height1=hei.height
              this.tajidatabox[0].tajiname="塔机"+1
              console.log("获取塔机参数id",data[0].device_id)
              this.gettajidatafnc()
            }
          })
      },
      huanjingjiancefnc(){
        const param = {
            method: 'devlist',
            project_id: this.project_id,
            device_type:10
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('总电表', data[0],data)
            if(data.length==0){
              this.dianbiaoshow=false
              this.dianbiaoshow2=true
            }else {
              this.dianbiaoshow=true
              this.dianbiaoshow2=false
              this.eleallnum=data[0].total_used
              this.alleledevicedid=data[0].device_id
              this.selectnownumfnc()
            }
          })
      },
      allwatergetfnc(){
        const param = {
            method: 'devlist',
            project_id: this.project_id,
            device_type:11
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('总水表', data[0],data)
            if(data.length==0){
              this.shuibiaoshow=false
              this.shuibiaoshow2=true
            }else {
              this.shuibiaoshow=true
              this.shuibiaoshow2=false
              this.waterallnum=data[0].total_used
              this.allwaterdevicedid=data[0].device_id
              this.selectnownumtaterfnc()
            }
          })
      },
      selectnownumfnc(){
        let time=new Date()
        let year=time.getFullYear()
        var month = time.getMonth()+1;//得到月份
        var date = time.getDate();//得到日期
        var hour = time.getHours();//得到小时
        var minu = time.getMinutes();//得到分钟
        var sec = time.getSeconds();//得到秒 2020-04-02 00:00:00
        if (month < 10){month = "0" + month;}
        if (date < 10) {date = "0" + date;}
        if (hour < 10) {hour = "0" + hour;}
        if (minu < 10){ minu = "0" + minu;}
        if (sec < 10) {sec = "0" + sec;}
        let starttime=year+"-"+month+"-"+date+" "+"00:00:00"
        let endtime=year+"-"+month+"-"+date+" "+hour+":"+minu+":"+sec
        const param = {
            method: 'query_hours',
            project_id: this.project_id,
            meter_id: this.alleledevicedid,
            bt:starttime,
            et:endtime
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('总电表详情',data)
            if(data.length==0){
               this.todayelenum=0
            }else {
              let newarr=[]
              for(let i=0;i<data.length;i++){
                newarr.push(data[i].used)
              }
               let num=0;
              for(let i=0;i<newarr.length;i++){
                num+=newarr[i]
              }
              this.todayelenum=Math.round(num)
            }
          })
      },
      selectnownumtaterfnc(){
        console.log("没有执行型芯222222",this.waterallnum)
        let time=new Date()
        let year=time.getFullYear()
        var month = time.getMonth()+1;//得到月份
        var date = time.getDate();//得到日期
        var hour = time.getHours();//得到小时
        var minu = time.getMinutes();//得到分钟
        var sec = time.getSeconds();//得到秒 2020-04-02 00:00:00
        if (month < 10){month = "0" + month;}
        if (date < 10) {date = "0" + date;}
        if (hour < 10) {hour = "0" + hour;}
        if (minu < 10){ minu = "0" + minu;}
        if (sec < 10) {sec = "0" + sec;}
        let starttime=year+"-"+month+"-"+date+" "+"00:00:00"
        let endtime=year+"-"+month+"-"+date+" "+hour+":"+minu+":"+sec
        const param = {
            method: 'query_hours',
            project_id: this.project_id,
            meter_id: this.allwaterdevicedid,
            bt:starttime,
            et:endtime
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log('总水表详情',data)
            if(data.length==0){
              this.todaywaternum=0
            }else {
                let newarr=[]
                for(let i=0;i<data.length;i++){
                  newarr.push(data[i].used)
                }
                 let num=0;
                for(let i=0;i<newarr.length;i++){
                  num+=newarr[i]
                }
                this.todaywaternum=Math.round(num)
            }
          })
      },
      gettajidatafnc(){
        const param = {
            method: 'query_crane2',
            project_id: this.project_id,
            devid:this.tajidevice_id
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            this.tajidatabox[0].height2=data[0].height
            this.tajidatabox[0].dabi=data[0].dip_angle
            this.tajidatabox[0].fengsu=data[0].wind
            this.tajidatabox[0].huizhuan=data[0].rotate
            this.tajidatabox[0].fudu=data[0].extent
            this.tajidatabox[0].liju=data[0].torque_percent
            this.tajidatabox[0].zhong=data[0].weight
            console.log('塔机具体数据',data[0])
          })
      },
      inoutcarquery(){
        console.log("车辆测试")
        const param = {
            method: 'query_vehicle_logs',
            project_id: this.project_id,
            limit_row:3
          }
          this.$store.dispatch('Inoutcarquery', param).then((data) => {
            this.carbox=data.data
            this.asasasas=true
            console.log('进出车辆日志',this.carbox)
          },()=>{
            this.asasasas=false
          })
      },
      smalltaskfnc(){
        this.taskbox=[]
        const param = {
            method: 'query_task_all',
            project_id: this.project_id,
            limit:3
          }
          this.$store.dispatch('Allpersondata', param).then((data) => {
            this.taskbox=data.data
            this.taskbox.forEach(item=>{
              if(item.flowId=="PlanFlow01"){
                item["first"]="计划"
              }
              if(item.flowId=="ProblemFindSolve01"){
                item["first"]="任务"
              }
              if(item.flowId=="Meeting01"){
                item["first"]="会议"
              }
              if(item.flowId=="Documents01"){
                item["first"]="资料"
              }
              if(item.flowId=="Notice01"){
                item["first"]="通知"
              }
              if(item.flowId=="SafetyInspection01"){
                item["first"]="安全巡检"
              }
              item["imgurl"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id='+item.workId+'&w=220'
            })
            console.log('任务数据',this.taskbox)
            this.firstdatascreenfnc()
          })
      },
      firstdatascreenfnc(){
        this.postdata=[]
        this.taskbox.forEach(item=>{
          this.postdata.push(item.workId)
        })
        this.secondtaskfnc()
      },
      secondtaskfnc(){//任务模块第二数据接口
        const _param = {
          method: 'get_nodes_users_list',
          project_id: this.project_id,
          work_ids:this.postdata
        }
        this.$store.dispatch('Allpersondata', _param).then((data) => {
          this.listbox=data.data
          console.log("第二接口数据",this.listbox)
          let map1= new Map()
          for(var i in this.listbox){
            map1.set(i,this.listbox[i])//添加key值
          }
           this.taskbox.forEach(item=>{
             let workId = item.workId
             item["obj"]=map1.get(workId)
             if(map1.get(workId).info!=undefined){
                item["value"]=map1.get(workId).info.priority//任务星级
                item["status"]=map1.get(workId).info.status//任务状态
               item["statecolor"]=map1.get(workId).info.status_color//任务颜色
               item["originator"] = map1.get(workId).Start[0].userName//发起人名字
              }
           })
          console.log("这个是map",this.taskbox)
        })
      },
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
        // console.log("收到消息:" + message.destinationName + message.payloadString);


        if (message.destinationName === this.topicCount) {
          this.mqttUserCount(message.payloadString)
        } else if (message.destinationName === 'BIM/door/' + this.project_id + '/cmd') {
          console.log('msg', message.destinationName + message.payloadString)
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
        console.log('mqttUserCount-mqttUserCount', _data)
        this.subscribe()
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
        console.log("人员信息")
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonListDialog', param).then(() => {}).catch(() => {

        })
      },ceshi() {
        console.log("测试")
        const param = {
          show: true,
        }
        this.$store.dispatch('ceshipro', param).then(() => {}).catch(() => {

        })
      },
      personFullCalendarHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPersonFullCalenderDialog', param).then(() => {}).catch(() => {

        })
      },
      publishHandle() {
        const param = {
          show: true,
        }
        this.$store.dispatch('SetPublishDialog', param).then(() => {}).catch(() => {

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
