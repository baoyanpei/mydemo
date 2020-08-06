<template>
    <div style="background-color: #ffffff">
      <el-row>
      <el-col :span="24">
        <div class="top">
        <div class="topleft">
          <span style="font-weight: 800">设备管理</span>
          <span style="font-size: 20px;">&nbsp;>&nbsp;</span>
          <span style="font-weight: 800">{{this.indexlabel}}</span>
          <span style="font-size: 20px;">&nbsp;>&nbsp;</span>
          <span style="">配电箱一</span>
        </div>
        <el-button type="primary" round style="background-color: #409EFF" class="topright">查看所有{{this.indexlabel}}地图位置</el-button>
      </div>
        <el-tabs :tab-position="tabPosition" @tab-click="handleClick">
          <el-tab-pane v-for="item in this.equipmentbox" :label="item.name">
            <div class="equiptop">
              <span class="equiptopspan">{{item.name}}编号：</span>
              <el-select v-model="value" clearable placeholder="请选择">
                <el-option v-for="item in equipoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
              <el-button style="float: right;margin-right: 30px;margin-top: 13px">打印设备二维码</el-button>
            </div>
            <el-tabs v-model="activeName" type="card" @tab-click="smallhandleClick">
              <el-tab-pane label="设备信息" name="first">用户管理</el-tab-pane>
              <el-tab-pane label="设备位置" name="second">
                 <div id="allmap" ref="newmap" style="width: 800px;height: 400px;border: 1px solid #000000"></div>
              </el-tab-pane>
              <el-tab-pane label="巡检记录" name="third">角色管理</el-tab-pane>
              <el-tab-pane label="标定BIM位置" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    </div>
</template>

<script>
  export default {
    name: 'index',
    components:{
    },
    data() {
        return {
          tabPosition: 'left',//el-tab 方向
          equipmentbox:[],//设备类型盒子
          indexlabel:"",//公用页面label
          equipoptions:[],//例如电表总盒子
          value:"",//获取电表盒子内某个元素,
          activeName: 'first'
        };
      },
      computed:{
        project_id() {
          return this.$store.state.project.project_id
        }
      },
      watch: {
        project_id(curVal, oldVal) {
          console.log('curVal',curVal,oldVal)
          this.getshebei()
        },
      },
      mounted(){
        if (this.project_id !== null) {
          this.getshebei()
        }
      },
    methods:{
      getshebei(){//获取设备类型
        const param = {
            method:'device_type',
            project_id: this.project_id,
          }
          this.$store.dispatch('AddBimItem', param).then((data) => {
            console.log("设备data",data)
            this.equipmentbox=data
            this.indexlabel=this.equipmentbox[0].name
            this.getequipoptions(this.equipmentbox[0].id)
          })
      },
      handleClick(index){//设备类型点击事件
        console.log("被选中了",index.label)
        this.value=""
        this.indexlabel=index.label
        for(let i=0;i<this.equipmentbox.length;i++){
          if(this.indexlabel==this.equipmentbox[i].name){
            this.getequipoptions(this.equipmentbox[i].id)
          }
        }
      },
      getequipoptions(index){//设备下拉列表渲染
        console.log("device_type",index)
        const param = {
          method:'devlist',
          project_id: this.project_id,
          device_type:index,
        }
        this.$store.dispatch('QueryDatumMeter', param).then((data) => {
          this.equipoptions=data
          console.log("设备data",this.equipoptions)
          this.equipoptions.forEach(item=>{
            item["label"]=item.device_name
            item["value"]=item.device_id
          })
          if(this.equipoptions.length==0){
            this.$message({
              message: '暂无设备信息',
              type: 'warning'
            });
          }
          else {
            console.log("dasdsad",this.equipoptions[0].label)
            this.value=this.equipoptions[0].label
          }
        })
      },
      smallhandleClick(tab, event) {
        console.log(tab.label);
        if(tab.label=="设备位置"){
          this.map()
        }
      },
      map () {
        console.log("这是地图",this.$refs.newmap[0])
       let map = new window.BMap.Map(this.$refs.newmap[0]) // 创建Map实例
        map.centerAndZoom(new window.BMap.Point(116.404, 39.915), 11) // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new window.BMap.MapTypeControl({ // 添加地图类型控件
          mapTypes: [
            window.BMAP_NORMAL_MAP,
            window.BMAP_HYBRID_MAP
          ]
        }))
        map.setCurrentCity('北京') // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true)// 开启鼠标滚轮缩放
      }
    }
  }
</script>

<style scoped>
  #container {
      height: 500px;
      width: 800px;
    border: 1px solid #000000;
      overflow: hidden;
    }
  .top{
    width: 100%;
    height: 50px;
    margin-bottom: 10px;
    line-height: 50px;
  }
  .topleft{
    margin-left: 35px;
    font-size: 14px;
    float: left;
  }
  .topright{
    float: right;
    padding: 0 20px;
    height: 35px;
    margin-top: 15px;
    text-align: center;
    line-height: 35px;
    margin-right: 20px;
    border-radius: 15px;
    background-color: #409EFF;
    color: #ffffff;
  }
  .equiptop{
    width: 100%;
    height: 60px;
  }
  .equiptopspan{
    line-height: 60px;
    margin-left: 20px;
  }
</style>
