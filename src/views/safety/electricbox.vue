<style lang="scss">
  @import "./index";
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
            <div class="small" v-for="item in this.equipmentbox"><span @click="changeidfnc(item.device_id)">{{item.device_name}}</span></div>
          </div>
          <div class="eleboxsmall2" style="width: 100%;height: 30px;margin-top: 10px;">
            <div class="small2" style="background-color:#1ABC9C;width: 100px;height: 100%;color: #ffffff;text-align: center;line-height: 30px;">下载列表</div>
          </div>
          <el-table :data="tableData" :header-cell-style="headClass" ref = "multipleTable "
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
              <el-table-column prop="nopassed" label="不合格" style="background-color: pink" width="100">
              </el-table-column>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="150" align='center'>
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="previewfnc(scope.row)"><i class="el-icon-view">预览</i>
                  </el-button>
                  <el-button type="text" size="small" @click="downloadfnc(scope.row)"><i class="el-icon-download">下载打印</i>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
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
        worktimeForm: {
          InoutDaterange: [
          ], // 时间范围
        },
        input:'',
        tableData:[],
        equipmentbox:[],
        firstid:"",
        staarttime:"",
        endtime:""
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
      headClass() {
        return 'text-align: center;'
      },
      handleSelectionChange(val) {//空白格选中未选中
        console.log("val",val)
      },
      getDistribution(){//获取设备名称
        const param = {
          method: 'dev_list',
          project_id: this.project_id,
          device_type:101
        }
        this.$store.dispatch('GetDist', param).then((data) => {
          console.log("配电箱设备",data)
          this.firstid=data[0].device_id
          for(let i=0;i<data.length;i++){
            this.equipmentbox.push(data[i])
          }
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
          et:this.endtime

        }
        this.$store.dispatch('GetDist', param).then((data) => {
          this.tableData=[]
          this.tableData=data
          data.forEach(item=>{
            item["nopassed"]=item.count-item.passed
            item["eleid"]=data.indexOf(item)+1
          })
          this.tableData=data
          console.log("配电箱列表信息",this.tableData)
        }).catch(() => {
        })
      },
      changeidfnc(e){//点击不同的设备
        console.log("点击",e)
        this.firstid=e
        this.gettablefnc()
      },
      selecttable(){//列表查询
        this.staarttime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        this.endtime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 00:00:00')
        this.firstid=this.input
        console.log("111111",this.staarttime,this.endtime)
        this.gettablefnc()
      }
    }
  }
</script>
