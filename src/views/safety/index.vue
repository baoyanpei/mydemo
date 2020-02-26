<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="fafety-index">
    <div class="box">
      <div class="banner">
        <div class="inp">
          <el-input v-model="input" placeholder="请输入内容" class="input1"></el-input>
        </div>
        <el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button type="success" style="background-color: #1abc9c;margin-left: 30px;" @click="findfnc">查找</el-button>
      </div>
      <el-button type="success" style="background-color: #1abc9c;margin-left: 30px;" @click="batchonload">批量下载打印</el-button>

      <el-table :data="tableData" :header-cell-style="headClass" ref = "multipleTable "
        style="width: 98%;margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <!--prop="index"-->
        <el-table-column prop="id" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="title" label="名称" width="180">
        </el-table-column>
        <el-table-column label="巡检人员" prop="check_person" width="80">
        </el-table-column>
        <el-table-column label="检查时间" prop="check_day" width="160">
        </el-table-column>
        <el-table-column label="施工部位" width="190">
          <template slot-scope="scope">
            <span class="check_location_span" :title=scope.row.check_location>{{scope.row.check_location}}</span>
          </template>
        </el-table-column>
        <el-table-column label="巡检记录" style="text-align: center;">
          <el-table-column prop="count.all" label="巡检事项" width="80">
          </el-table-column>
          <el-table-column prop="count.1" label="合格" width="80">
          </el-table-column>
          <el-table-column prop="count.-1" label="不合格" style="background-color: pink" width="80">
            <template slot-scope="scope" style="width: 100%;height: 100%;">
              <div class="unqualifiedred_div" :class="{'unqualifiedred':scope.row.unqualified>0}">
                {{scope.row.unqualified}}</div>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="备注" width="195">
          <template slot-scope="scope">
            <span class="check_location_span" :title=scope.row.remark>{{scope.row.remark}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
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
  </div>

</template>
<!--//http://admin.yidebim.com-->
<script>
  export default {
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
        console.log("这是批量下载按钮")
        const param = {
          method: 'batch',
          project_id: this.project_id,
          work_ids:this.workids
        }
        this.$store.dispatch('Allbatchdownload', param).then((data) => {
          console.log("批量下载成功返回",data)
          let url=window.URL.createObjectURL(new Blob([data]))
          let link = document.createElement('a')
          link.href=url
          link.setAttribute("download","批量下载.pdf")
          document.body.appendChild(link)
          link.click()
          // var blob=new Blob([data],{type: 'application/pdf'})
          // let reader=new FileReader()
          // reader.readAsDataURL(blob);
          // reader.onload = function (e) {
          //     if('download'in document.createElement("a")){
          //       const link = document.createElement('a')
          //       link.href = URL.createObjectURL(blob)
          //       link.download = '批量下载.pdf';
          //       document.body.appendChild(link)
          //       window.open(link.href)
          //       link.click()//执行下载
          //       URL.revokeObjectURL(link.href) //释放url
          //       document.body.removeChild(link)//释放标签
          //   }
          // }
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
            console.log("item",item)
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


