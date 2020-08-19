<style lang="scss">
  @import "./index";
</style>
<style>
  .unqualifiedred{
    color: #fff;
    background-color: red;
    text-align: center;
  }
  .unqualifiedred_div{
    text-align: center;
  }
</style>
<template>
    <div style="padding-top: 20px">
      <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
        <div class="box">
      <div class="banner">
          <el-input v-model="input" placeholder="请输入内容" class="input1" style="width: 300px;"></el-input>
        <!--<el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"-->
          <!--end-placeholder="结束日期">-->
        <!--</el-date-picker>-->
        <el-date-picker type="daterange" @change="" v-model="value1"
          name="InoutDaterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期" size="mini">
        </el-date-picker>
        <el-button type="success" style="background-color: #1abc9c;margin-left: 30px;" @click="findfnc">查找</el-button>
      </div>
      <el-button type="success" style="background-color: #1abc9c;margin-top: 15px" @click="batchonload">批量下载打印</el-button>

      <el-table :data="tableData" :header-cell-style="headClass" ref = "multipleTable "
        style="width: 100%;margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <!--prop="index"-->
        <el-table-column prop="id" label="序号" width="60">
        </el-table-column>
        <el-table-column prop="title" label="名称" width="180">
        </el-table-column>
        <el-table-column label="巡检人员" prop="check_person" width="80">
        </el-table-column>
        <el-table-column label="检查时间" prop="check_day" width="130">
        </el-table-column>
        <el-table-column label="施工部位" width="150">
          <template slot-scope="scope">
            <span class="check_location_span" :title=scope.row.check_location>{{scope.row.check_location}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检记录" style="text-align: center;">
          <el-table-column prop="count.all" label="巡检事项" width="80">
          </el-table-column>
          <el-table-column prop="count.1" label="合格" width="50">
          </el-table-column>

          <el-table-column prop="count.-1" label="不合格" style="background-color: pink" width="70">
            <template slot-scope="scope" style="width: 100%;height: 100%;">
              <div class="unqualifiedred_div" :class="{'unqualifiedred':scope.row.unqualified>0}">
                {{scope.row.unqualified}}</div>
            </template>
          </el-table-column>

        </el-table-column>
        <el-table-column label="备注" width="140">
          <template slot-scope="scope">
            <span class="check_location_span" :title=scope.row.remark>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="80">
        </el-table-column>
        <el-table-column label="操作" width="150">
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
      <el-pagination background layout="prev, pager, next,total,jumper" :current-page="currpage" :total="infonum"
        :page-sizes='[1,2,3]' :page-size="pagesize" @current-change='pagechange' @size-change='handleSizeChange'
        style="text-align: center;display: block;margin-bottom: 20px">
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
    data() {
      return {
        value1: '',
        input: "",
        currpage: 1,
        infonum: 0,
        pagesize: 20,
        tableData: [],
        workids:[],
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
        console.log('curVal', curVal, oldVal)
        this.getform()
        this.tableRowClassName()
      }
    },
    mounted() {
      if (this.project_id !== null) {
        console.log("you")
        this.getform()
      }
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
      this.value1 = [_FirstDay, _LastDay]
    },
    methods: {
      handleSelectionChange(val) {//空白格选中未选中
        this.multipleSelection = val;
        this.workids=[]
        for(let i=0;i<this.multipleSelection.length;i++){
          this.workids.push(this.multipleSelection[i].workId)
        }
        console.log("空格index",this.multipleSelection)
        console.log("workids",this.workids)
      },
      batchonload(){//批量下载
        const param = {
          method: 'batch',
          project_id: this.project_id,
          work_ids:this.workids,
          t:"url"
        }
        this.$store.dispatch('Allbatchdownload', param).then((data) => {
          console.log("批量下载成功返回11",data)
          window.open("http://admin.yidebim.com" + data.url + "?t=download")
        }).catch(() => {
        })
      },
      headClass() {
        return 'text-align: center;'
      },
      tableRowClassName(val) {
        return 'background-color:red;'
        console.log("不合格列", val)
      },
      pagechange(e) { //每页多少条数据
        this.currpage = e
        this.getform()
      },
      handleSizeChange(e) {
        this.pagesize = e
        console.log("--data", e)
      },
      getform() {
        const param = {
          method: 'query_task_list_safe',
          project_id: this.project_id,
          page: this.currpage,
          keywords: this.input,
          bt: this.value1[0],
          et: this.value1[1]
        }
        this.$store.dispatch('SafeInspection', param).then((data) => {
          data.data.forEach(item=>{
            // console.log("item",item)
            if(item.workId="HZ000000702de06e0170367ab6cf18f9"){
              this.tableData.push(item)
            }
          })
          // this.tableData = data.data
          console.log("表格数据", this.tableData)
          this.infonum = data.count
          this.tableData.forEach(item => {
            item["index"] = (this.tableData.indexOf(item) + 1) + 20 * (this.currpage - 1)
            item["unqualified"] = item.count["-1"]
            if (item.status == "已完成") {
              item["stateshow"] = true
            } else {
              item["stateshow"] = false
            }
          })
        }).catch(() => {

        })
      },
      previewfnc(val) { //预览
        window.open("http://admin.yidebim.com" + val.url)
        // window.location.href="http://admin.yidebim.com"+val.url
      },
      downloadfnc(val) { //下载
        window.open("http://admin.yidebim.com" + val.url + "?t=download")
      },
      findfnc() {
        // console.log("查找按钮",this.value1[0])
        this.getform()
      }
    }
  }
</script>
