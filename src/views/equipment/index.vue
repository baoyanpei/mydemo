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
              <el-tab-pane label="设备信息" name="first">
                <el-col :span="12">
                  <!--卡片1-->
                  <el-card class="box-card">
                    <div slot="header" class="clearfix">
                      <span>状态信息</span>
                    </div>
                    <div class="text item">
                      这是卡片1
                    </div>
                  </el-card>
                </el-col>
                <el-col span="12">
                  <!--卡片2-->
                <el-card class="box-card">
                  <div slot="header" class="clearfix">
                    <span><i class="el-icon-info"></i>基本信息</span>
                  </div>
                  <div class="text item">
                    这是卡片2
                  </div>
                </el-card>
                </el-col>
              </el-tab-pane>
              <el-tab-pane label="设备位置" name="second">
                <button @click="addmappointfnc">dasdsa</button>
                 <div id="allmap" ref="newmap" style="width: 100%;height: 500px;"></div>
              </el-tab-pane>
              <el-tab-pane label="巡检记录" name="third">
                <div class="onSitetop">
                    <span>选择查询日期:</span>
                    <el-date-picker
                      v-model="datavalue"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期">
                    </el-date-picker>
                    <el-button type="primary" class="onSitebutton">下载勾选记录</el-button>
                </div>
                <!--巡检记录表格-->
                <el-table :data="sitedata" :header-cell-style="headClass" ref = "multipleTable"
                  style="margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" width="50">
                  </el-table-column>
                  <el-table-column prop="eleid" label="序号" width="80">
                  </el-table-column>
                  <el-table-column label="巡检人员" prop="person_name" width="80">
                  </el-table-column>
                  <el-table-column label="检查时间" prop="check_time" width="180">
                  </el-table-column>
                  <el-table-column label="巡检记录" style="text-align: center;">
                    <el-table-column prop="count" label="巡检事项" width="100">
                    </el-table-column>
                    <el-table-column prop="passed" label="合格" width="100">
                    </el-table-column>
                    <el-table-column prop="unpass" label="不合格" style="" width="100">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column prop="statespan" label="状态" width="150" align='center'>
                  </el-table-column>
                  <el-table-column label="操作" width="180">
                    <template slot-scope="scope">
                      <div>
                        <el-button type="text" size="small" @click="previewfnc(scope.row)"><i class="el-icon-view">预览</i>
                        </el-button>
                        <el-button type="text" size="small" @click="downloadfnc(scope.row)"><i class="el-icon-download">下载打印</i>
                        </el-button>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="标定BIM位置" name="fourth">
                <el-table :data="bimdata" style="width: 100%" max-height="250">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="date" label="日期" width="150"></el-table-column>
                  <el-table-column prop="name" label="姓名" width="120"></el-table-column>
                  <el-table-column prop="province" label="省份" width="120"></el-table-column>
                  <el-table-column prop="city" label="市区" width="120"></el-table-column>
                  <el-table-column prop="address" label="地址" width="300"></el-table-column>
                  <el-table-column prop="zip" label="邮编" width="120"></el-table-column>
                  <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                      <el-button @click.native.prevent="deleteRow(scope.$index, bimdata)" type="text" size="small">移除</el-button>
                      <el-button @click.native.prevent="deleteRow(scope.$index, bimdata)" type="text" size="small">标定BIM中位置</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
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
          activeName: 'first',
          datavalue:"",//日期时间
          sitedata:[],//巡检记录表格
          bimdata:[],//bim标定表格
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
        console.log("这是地图")
        var map = new BMap.Map('allmap');
        // 创建地图实例
        var point = new BMap.Point(103.840755,36.066746);
        // 创建点坐标
        map.centerAndZoom("兰州", 15);

        function addMarker(point){
          var marker = new BMap.Marker(point);
          map.addOverlay(marker);
        }
        map.enableScrollWheelZoom(true)//开启鼠标滚轮缩放
        var label = new BMap.Label("我是兰州市政府",{offset:new BMap.Size(20,-10)});
        marker.setLabel(label);

      },
      addmappointfnc(){
        var map = new BMap.Map("allmap");   //初始化map, 绑定id=allmap
        var point = new BMap.Point(103.840755,36.066746);   // 初始化point, 给定一个默认x,y值
        map.centerAndZoom(point, 15);        // 将point点放入map中，展示在页面中心展示，10=缩放程度
        map.enableScrollWheelZoom();         // 开启滚动鼠标滑轮
        let data = [
          { x: 116.297047, y: 39.979542, name: '张三' },
          { x: 116.321768, y: 39.88748, name: '李四' },
          { x: 116.494243, y: 39.756539, name: '王五' }
        ]
        data.forEach(item=>{
          let pointNumber = new BMap.Point(item.x, item.y)
        })

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
   .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }
  .onSitetop{
    width: 100%;
    height: 60px;
    line-height: 60px;
    padding: 0 30px;
    font-size: 16px;
  }
  .onSitetop span{
    margin-right: 20px;
  }
  .onSitebutton{
    margin-top: 13px;
    margin-right: 30px;
    float: right;
    background-color: #409EFF;
  }
</style>
