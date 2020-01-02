<template>
    <div class="box">
        <div class="banner">
          <div class="inp">
            <el-input v-model="input" placeholder="请输入内容" class="input1"></el-input>
          </div>
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-button type="success" style="background-color: #1abc9c;margin-left: 30px;" @click="findfnc">查找</el-button>
        </div>
      <el-button type="success" style="background-color: #1abc9c;margin-left: 30px;">批量下载打印</el-button>

     <el-table
    :data="tableData"
    :header-cell-style="headClass"
    style="width: 98%;margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
     <el-table-column
      type="selection"
      width="55">
    </el-table-column>
       <!--prop="index"-->
    <el-table-column
       prop="id"
      label="序号"
      width="50">
    </el-table-column>
      <el-table-column
        prop="title"
        label="名称"
        width="180">
      </el-table-column>
       <el-table-column
        label="巡检人员"
        prop="check_person"
        width="80">
      </el-table-column>
       <el-table-column
        label="检查时间"
        prop="check_day"
        width="160">
      </el-table-column>
      <el-table-column
        label="施工部位"
        width="190">
        <template slot-scope="scope">
          <span class="check_location_span" :title=scope.row.check_location>{{scope.row.check_location}}</span>
        </template>
      </el-table-column>
      <el-table-column label="巡检记录" style="text-align: center;">
        <el-table-column
          prop="count.all"
          label="巡检事项"
          width="80">
        </el-table-column>
        <el-table-column
          prop="count.1"
          label="合格"
          width="80">
        </el-table-column>
        <el-table-column
          prop="count.-1"
          label="不合格"
          style="background-color: pink"
          width="80">
          <template slot-scope="scope" style="width: 100%;height: 100%;">
            <div class="unqualifiedred_div" :class="{'unqualifiedred':scope.row.unqualified>0}">{{scope.row.unqualified}}</div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column
        label="备注"
        width="195">
        <template slot-scope="scope">
          <span class="check_location_span" :title=scope.row.remark>{{scope.row.remark}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        width="120">
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <div v-show=scope.row.stateshow>
            <el-button type="text" size="small" @click="previewfnc(scope.row)"><i class="el-icon-view">预览</i></el-button>
            <el-button type="text" size="small" @click="downloadfnc(scope.row)"><i class="el-icon-download">下载打印</i></el-button>
          </div>
        </template>
      </el-table-column>
  </el-table>
  <el-pagination background
   layout="prev, pager, next,total,jumper"
   :current-page="currpage"
   :total="infonum"
   :page-sizes='[1,2,3]'
   :page-size="pagesize"
    @current-change='pagechange'
    @size-change='handleSizeChange'
    style="text-align: center;display: block;margin-bottom: 20px">
  </el-pagination>
    </div>
</template>
<!--//http://admin.yidebim.com-->
<script>
  export default {
    name: 'index',
    data(){
      return {
        value1:'',
        input:"",
        currpage:1,
        infonum:0,
        pagesize: 20,
        tableData: [],
        multipleSelection: []
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal',curVal,oldVal)
        this.getform()
        this.tableRowClassName()
      }
    },
     mounted(){
      if (this.project_id !== null) {
        console.log("you")
        this.getform()
      }
    },
    methods:{
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      headClass () {
        return 'text-align: center;'
      },
      tableRowClassName(val){
        return 'background-color:red;'
        console.log("不合格列",val)
      },
      pagechange (e) {//每页多少条数据
        this.currpage = e
        this.getform()
      },
      handleSizeChange (e) {
        this.pagesize = e
        console.log("--data",e)
      },
      getform(){
        const param = {
          method: 'query_task_list_safe',
          project_id: this.project_id,
          page:this.currpage,
          keywords:this.input,
          bt:this.value1[0],
          et:this.value1[1]
        }
        this.$store.dispatch('SafeInspection', param).then((data) => {
          this.tableData=data.data
          console.log("表格数据",this.tableData)
          this.infonum=data.count
          this.tableData.forEach(item=>{
            item["index"]=(this.tableData.indexOf(item)+1)+20*(this.currpage-1)
            item["unqualified"]=item.count["-1"]
            if(item.status=="已完成"){
              item["stateshow"]=true
            }else {
              item["stateshow"]=false
            }
          })
        }).catch(() => {

        })
      },
      previewfnc(val){//预览
        window.open("http://admin.yidebim.com"+val.url)
        // window.location.href="http://admin.yidebim.com"+val.url
      },
      downloadfnc(val){//下载
        window.open("http://admin.yidebim.com"+val.url+"?t=download")
      },
      findfnc(){
        // console.log("查找按钮",this.value1[0])
        this.getform()
      }
    }
  }
</script>

<style lang="scss">
.box{
  width: 98%;
  background-color:#fff;
  margin:10px auto;
  overflow: hidden;
  box-shadow:0px 0px 30px #4a4c4b;
}
  .banner{
    width: 100%;
    height: 50px;
    margin-top: 10px;
    line-height: 50px;
    margin-bottom: 10px;
  }
  .inp{
    width: 280px;
    margin-top: 5px;
    margin-left: 30px;
    margin-right: 50px;
    height: 40px;
    float: left;
  }
  .input1{
    line-height: 40px;
    width: 100%;
    background: none;
	  outline: none;
	  border: none;
  }
  .el-table th,.el-table td{
    text-align: center;
    border:1px solid #e5e5e5!important;
  }
  .el-table td{
    padding: 0;
    height: 35px;
  }
  body .el-table th.gutter{
    display: table-cell!important;
  }
  .el-table .cell {
    padding: 0!important;
  }
  .el-table td div {
    line-height: 35px;
}
  .unqualifiedred{
    color: #fff;
    background-color: red;
  }
  .check_location_span{
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    word-break:keep-all;
  }
</style>
