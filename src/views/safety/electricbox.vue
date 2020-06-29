<style lang="scss">
  @import "./index";
</style>
<style>
  .colorreddiv{
    width: 100%;
    height: 100%;
  }
  .unqualifiedred{
    color: #fff;
    background-color: red;
    text-align: center;
  }
  .active {
    background: #1ABC9C;
    color: #ffffff;
  }
</style>
<template>
    <div style="padding-top: 20px">
      <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-form ref="worktimeForm" :model="worktimeForm" label-width="80px" :inline="true">
            <el-form-item prop="GroupList">
             <el-input v-model="input" placeholder="请输入姓名、标题搜索" class="input1"></el-input>
            </el-form-item>
            <el-form-item prop="InoutDaterange" label="时间范围">
              <el-date-picker type="daterange" @change="" v-model="worktimeForm.InoutDaterange"
                name="InoutDaterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-search"
                @click.native.prevent="selecttable()" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <div class="eleboxsmall">
            <div class="small" @click="clickcategory(item.index)" :class="{active:categoryIndex==item.index}" v-for="item in this.equipmentbox"><span :title=item.device_name @click="changeidfnc(item.device_id)">{{item.device_name}}</span></div>
          </div>
          <div class="eleboxsmall2" style="width: 100%;height: 30px;margin-top: 10px;">
            <div class="small2" style="background-color:#1ABC9C;width: 100px;height: 100%;color: #ffffff;text-align: center;line-height: 30px;" @click="downtask()">下载列表</div>
          </div>
          <el-table :data="tableData" :header-cell-style="headClass" ref = "multipleTable " v-loading="loading"
            style="width: 98%;margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column prop="eleid" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="device_name" label="名称" width="180">
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
              <el-table-column prop="" label="不合格" style="background-color: pink" width="100">
                <template slot-scope="scope">
                  <div class="colorreddiv" :title=scope.row.nopassed :class="{'unqualifiedred':scope.row.nopassed>0}">{{scope.row.nopassed}}</div>
              </template>
              </el-table-column>
            </el-table-column>
            <el-table-column prop="statespan" label="状态" width="150" align='center'>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                <div v-show=scope.row.stateshow>
                  <el-button type="text" size="small" @click="previewfnc(scope.row)"><i class="el-icon-view">预览</i>
                  </el-button>
                  <el-button type="text" size="small" @click="downloadfnc(scope.row)"><i class="el-icon-download">下载打印</i>
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next,total,jumper"
            :current-page="currpage"
            :page-size="pagesize"
            :page-sizes='[1,2,3]'
            @current-change='pagechange'
            @size-change='handleSizeChange'
            style="text-align: center;margin-top: 10px;"
            :total="infonum">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
  import moment from 'moment'
  import TJFXMenu from "../layout/components/XUGLMenu.vue"
  import { async } from 'q'
  export default {
    components: {
      TJFXMenu
    },
    name: 'index',
    data(){
      return{
        currpage:1,
        pagesize:20,
        infonum:0,
        worktimeForm: {
          InoutDaterange: [
          ], // 时间范围
        },
        input:'',
        tableData:[],
        equipmentbox:[],
        firstid:"",
        staarttime:"",
        endtime:"",
        categoryIndex:0,
        ids:[],
        deviceid:"",
        loading:false,
        newarrspk:[]
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.getDistribution()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.getDistribution()
      }
       // 每月的某一天，如每月10日
      const monthDay = moment().add('month', 0).format('YYYY-MM') + '-10'
      // 是否在某月某天之前
      const isBefore = moment().isBefore(monthDay);
      // console.log('isBefore', isBefore)
      let _FirstDay = moment()
      let _LastDay = moment()
      if (isBefore) {
        // 上个月的第一天
        _FirstDay = moment().add('month', -1).format('YYYY-MM') + '-01'
        // 上个月的最后一天
        _LastDay = moment(_FirstDay).add('month', 1).add('days', -1).format('YYYY-MM-DD')
      } else {
        _FirstDay = moment().add('month', 0).format('YYYY-MM') + '-01'
      }
      this.worktimeForm.InoutDaterange = [_FirstDay, _LastDay]
    },
    methods:{
      pagechange (e) {//每页多少条数据
        this.tableData=[]
        let startnum=(e-1)*20+1
        let endnum=20*e
        console.log("ee",startnum,endnum)
        for(let i=0;i<this.newarrspk.length;i++){
          if(this.newarrspk[i].eleid>=startnum && this.newarrspk[i].eleid<=endnum){
            this.tableData.push(this.newarrspk[i])
          }
        }
      },
      handleSizeChange (e) {
      this.pagesize = e
    },
      headClass() {
        return 'text-align: center;'
      },
      downtask(){
        const param = {
          method: 'record_download',
          project_id: this.project_id,
          device_id:this.firstid,
          device_type:101,
          ids:this.ids
        }
        this.$store.dispatch('GetDist2', param).then((data) => {
          // console.log("下载列表",data)
          window.open("http://admin.yidebim.com"+data)
        }).catch(() => {
        })
      },
      handleSelectionChange(val) {//空白格选中未选中
        this.ids=[]
        for(let i=0;i<val.length;i++){
          this.ids.push(val[i].id)
        }
        console.log("val",this.ids)
      },
      getDistribution(){//获取设备名称
        const param = {
          method: 'dev_list',
          project_id: this.project_id,
          device_type:101
        }
        this.$store.dispatch('GetDist', param).then((data) => {
          console.log("获取设备",data)
          if(data.length!==0){
           this.loading=true
          }
          this.equipmentbox=[]
          this.tableData=[]
          for(let i=0;i<data.length;i++){
            data[i]["index"]=data.indexOf(data[i])
          }
          this.firstid=data[0].device_id
          for(let i=0;i<data.length;i++){
            this.equipmentbox.push(data[i])
          }
          console.log("配电箱设备",this.equipmentbox)
          this.gettablefnc()
        }).catch(() => {
        })
      },
      gettablefnc(){//获取列表
        const param = {
          method: 'record_query',
          project_id: this.project_id,
          checked_count:1,
          device_id:this.firstid,
          bt:this.staarttime,
          et:this.endtime,
          page:this.currpage,
          limit:10000
        }
        this.$store.dispatch('GetDist', param).then((data) => {
          console.log("获取列表",data)
          this.newarrspk=[]
          data.forEach(item=>{
            item["nopassed"]=item.count-item.passed
            item["eleid"]=data.indexOf(item)+1
          })
          this.loading=false
          this.tableData=[]
          this.infonum=data.length
          for(let i=0;i<data.length;i++){
            if(data[i].status==1){
              data[i]["statespan"]="已完成"
            }
            if(data[i].status==0){
              data[i]["statespan"]="处理中"
            }
            if(data[i].status==-1){
              data[i]["statespan"]="未处理"
            }
          }
          this.tableData.forEach(item=>{
            if(item.statespan == "已完成") {
              item["stateshow"] = true
            } else {
              item["stateshow"] = false
            }
          })
          this.newarrspk=data
           for(let i=0;i<data.length;i++){
            if(data[i].eleid<=20){
              this.tableData.push(data[i])
            }
          }
          console.log("配电箱列表信息",this.tableData)
        }).catch(() => {
        })
      },
      changeidfnc(e){//点击不同的设备
        console.log("点击",e)
        this.loading=true
        this.deviceid=e
        this.firstid=e
        console.log("------",this.deviceid,this.firstid)
        this.gettablefnc()
      },
      selecttable(){//列表查询
        this.staarttime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        this.endtime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 00:00:00')
        this.firstid=this.input
        console.log("111111",this.staarttime,this.endtime)
        this.gettablefnc()
      },
      clickcategory(index){ // 这里我们传入一个当前值
    　　this.categoryIndex = index
        console.log("index",index)
      },
      previewfnc(val) { //预览
        window.open("http://admin.yidebim.com" + val.url)
        // window.location.href="http://admin.yidebim.com"+val.url
      },
      downloadfnc(val) { //下载
        window.open("http://admin.yidebim.com" + val.url + "?t=download")
      },
    }
  }
</script>
