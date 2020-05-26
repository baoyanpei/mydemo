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
            <el-form-item prop="InoutDaterange" label="时间范围">
              <el-date-picker type="daterange" @change="dateChangeHandle" v-model="worktimeForm.InoutDaterange"
                name="InoutDaterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="GroupList" label="拍照颜色">
              <el-cascader placeholder="请选择颜色" style="width: 230px;" @change="groupChangeHandle"
                v-model="carcolor" :options="optionGroups" filterable change-on-select size="mini">
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="loading" icon="el-icon-search"
                @click.native.prevent="handleSubmit()" size="mini">查询</el-button>
              <!--<el-button type="success" :loading="loading" icon="el-icon-download"-->
                <!--@click.native.prevent="handleSubmit(true)" size="mini">导出Excel</el-button>-->
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <el-table
            ref="singleTable"
            :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
            highlight-current-row
            @current-change="handleCurrentChange"
            style="width: 100%">
            <el-table-column
              property="carnum"
              label="#"
              fixed="left"
              width="60">
            </el-table-column>
            <el-table-column
              property="lisence"
              label="车牌号"
              fixed="left"
              width="120">
            </el-table-column>
            <el-table-column
              property="lisence_type"
              label="车牌颜色"
              fixed="left"
              width="120">
            </el-table-column>
            <el-table-column
              property="created_time"
              fixed="left"
              label="进厂时间"
              width="180">
            </el-table-column>
             <el-table-column
              fixed="left"
              label="进厂照片"
              width="220">
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-camera-solid" @click="previewtp(scope.row)">预览</el-button>
                <el-button type="primary" icon="el-icon-share" @click="downloadtp(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
          @size-change="handleSizeChange"
          @current-change="pagechange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="pagesize"
          :total="tableData.length"
          layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
  import moment from 'moment'
  import TJFXMenu from "../layout/components/TJFXMenu.vue"
  import { async } from 'q'
  export default {
    components: {
      TJFXMenu
    },
    name: 'index',
    data(){
      return{
        loading: false,
        carcolor:[],//汽车颜色
        worktimeForm: {
          InoutDaterange: [], // 时间范围
        },
        optionGroups: [],
        tableData: [{
          lisence: '',
          lisence_type:'',
          created_time:'',
          carnum:0
        }],
        table2:[],
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
          this.inoutcarquery()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.inoutcarquery()
      }
    },
    methods:{
      dateChangeHandle() {
        },
      groupChangeHandle(e) {
      },
      handleSubmit() {
        // console.log(11111111,this.carcolor)
        this.loading = true
        const sTime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        const eTime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
        this.inoutcarquery(sTime, eTime)
        this.loading = false
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      inoutcarquery(sTime, eTime){
        if(this.carcolor.length!==0){
          const param = {
            method: 'query_vehicle_logs',
            project_id: this.project_id,
            bt:sTime,
            et:eTime,
            limit_row:10000
          }
          this.$store.dispatch('Inoutcarquery', param).then((data) => {
            this.tableData=data.data
            this.table2=data.data
            let num=this.carcolor[0]
            let newcararr=[]
            for(let i=0;i<this.tableData.length;i++){
              if(this.tableData[i].lisence_type==this.optionGroups[num].label){
                newcararr.push(this.tableData[i])
              }
            }
            this.tableData=newcararr
          })
        }
        console.log('执行函数',sTime, eTime)
        const param = {
            method: 'query_vehicle_logs',
            project_id: this.project_id,
            bt:sTime,
            et:eTime,
            limit_row:10000
          }
          this.$store.dispatch('Inoutcarquery', param).then((data) => {
            console.log(data)
            this.tableData=data.data
            this.tableData.forEach(item=>{
              item["carnum"]=(this.tableData.indexOf(item) + 1)
            })
            this.table2=data.data
            let arr=[]
            this.optionGroups=[]
            for(let i=0;i<this.tableData.length;i++){
                arr.push(this.tableData[i].lisence_type)
            }
            for(let j=0;j<arr.length;j++){
              if(this.optionGroups.indexOf(arr[j])==-1){
                this.optionGroups.push(arr[j])
              }
            }
            for(let i=0;i<this.optionGroups.length;i++){
              this.optionGroups.splice(i,1,{label:this.optionGroups[i],value:i})
            }
          })
      },
      previewtp(e){//车辆图片预览
        window.open(e.pic)//?t=download
      },
      downloadtp(e) {//车辆图片下载
        console.log(e)
        let url=e.pic
        this.downloadIamge(url, 'pic')
      },
      downloadIamge(imgsrc, name) {//下载图片地址和图片名
        var image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function() {
          var canvas = document.createElement("canvas");
          canvas.width = image.width;
          canvas.height = image.height;
          var context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, image.width, image.height);
          var url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
          console.log(url)
          var a = document.createElement("a");
          var event = new MouseEvent("click"); // 创建一个单击事件
          a.download = name || "photo";
          a.href = url; // 将生成的URL设置为a.href属性
          a.dispatchEvent(event);
        };
        image.src = imgsrc;
      },
      pagechange (e) {//每页多少条数据
        console.log("页数改变",e)
        this.currentPage=e
      },
      handleSizeChange(e){
        this.pagesize = e
      }
    }
  }
</script>

<style scoped>

</style>
