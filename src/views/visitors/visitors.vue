<template>
     <div style="padding-top: 20px">
      <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
       <el-form ref="worktimeForm" :model="worktimeForm" label-width="80px" :inline="true">
            <el-form-item prop="InoutDaterange" label="时间范围">
              <el-date-picker type="daterange" @change="dateChangeHandle" v-model="worktimeForm.InoutDaterange"
                name="InoutDaterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="GroupList" label="来访事由">
              <el-cascader placeholder="请选择" style="width: 230px;" @change="groupChangeHandle"
                v-model="carcolor" :options="optionGroups" filterable change-on-select size="mini">
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="loading" icon="el-icon-search"
                @click.native.prevent="handleSubmit()" size="mini">查询</el-button>
              <el-button type="success" :loading="loading" icon="el-icon-download"
                @click.native.prevent="tabeldownload()" size="mini">导出Excel</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
        <el-table
            ref="singleTable"
            :data="tableData"
            highlight-current-row
            :header-cell-style="{'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              property="carnum"
              label="#"
              fixed="left"
              width="60">
            </el-table-column>
            <el-table-column
              property="name"
              label="姓名"
              fixed="left"
              width="80"
            style="text-align: center;">
            </el-table-column>
            <el-table-column
              property="idcard"
              label="身份证号"
              fixed="left"
              width="180">
            </el-table-column>
            <el-table-column
              property="mobile"
              fixed="left"
              label="手机号"
              width="120">
            </el-table-column>
             <el-table-column
               property="reason"
              fixed="left"
              label="来访事由"
              width="120">
            </el-table-column>
          <el-table-column
              property="created_time"
              fixed="left"
              label="来访时间"
              width="180">
            </el-table-column>
          <el-table-column
              fixed="left"
              label="体温"
              width="120">
            </el-table-column>
          <el-table-column
              fixed="left"
              label="测量人"
              width="120">
            </el-table-column>
          <el-table-column
              fixed="left"
              label="备注"
              width="180">
            </el-table-column>
          </el-table>
      </el-col>
    </el-row>
    </div>
</template>

<script>
  import moment from 'moment'
  import TJFXMenu from "../layout/components/TJFXMenu.vue"
  export default {
    name: 'visitors',
     components: {
      TJFXMenu
    },
    data(){
      return{
        loading: false,
        carcolor:[],//汽车颜色
        worktimeForm: {
          InoutDaterange: [
          ], // 时间范围
        },
        optionGroups: [],
        lisecolor:"",
        tabelurlstring:"",
        tableData: [{
        }],
        able2:[],
        currentRow: null,
        pagesize:20,
        infonum:0,
        currentPage:1
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
          this.getvisitor()
          console.log("project_id",this.project_id)
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.getvisitor()
        console.log("project_id",this.project_id)
      }
      const monthDay = moment().add('month', 0).format('YYYY-MM') + '-10'
      const isBefore = moment().isBefore(monthDay);
      let _FirstDay = moment()
      let _LastDay = moment()
      if (isBefore) {
        _FirstDay = moment().add('month', -1).format('YYYY-MM') + '-01'
        _LastDay = moment(_FirstDay).add('month', 1).add('days', -1).format('YYYY-MM-DD')
      } else {
        _FirstDay = moment().add('month', 0).format('YYYY-MM') + '-01'
      }
      this.worktimeForm.InoutDaterange = [_FirstDay, _LastDay]
    },
    methods:{
      dateChangeHandle(e){
        console.log(e)
      },
      groupChangeHandle(){

      },
      handleSubmit(){
        const sTime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        const eTime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
        this.getvisitor(sTime,eTime)
        this.tabeldownload(sTime,eTime)
      },
      tabeldownload(){
        const sTime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        const eTime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
        const param = {
            method: 'query',
            project_id: this.project_id,
            bt:sTime,
            et:eTime,
            t:"url"
          }
          this.$store.dispatch('vistor', param).then((data) => {
            console.log("地址",data)
            window.open(data.url)
          })
      },
      handleCurrentChange(){

      },
      getvisitor(sTime,eTime){
        const param = {
            method: 'query',
            project_id: this.project_id,
            bt:sTime,
            et:eTime
          }
          this.$store.dispatch('vistor', param).then((data) => {
            console.log("访客",data)
            this.tableData=data.data
            this.tableData.forEach(item=>{
              item["carnum"]=this.tableData.indexOf(item)+1
            })
            for(let i=0;i<this.tableData.length;i++){
              this.optionGroups.push({label:this.tableData[i].reason,value:i})
            }
            console.log("访客---------2",option)
          })
      }
    }
  }
</script>

<style scoped>

</style>
