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
              <el-button type="success" :loading="loading" icon="el-icon-download"
                @click.native.prevent="tabeldownload()" size="mini">导出Excel</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <el-dialog title="进出车辆图片预览" :visible.sync="dialogVisible">
            <!--<iframe :src=iframeurl frameborder="0" class="iframeclass"></iframe>-->
            <img :src=iframeurl alt="" style="width: 100%">
          </el-dialog>
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
              label="进场时间"
              width="180">
            </el-table-column>
             <el-table-column
              fixed="left"
              label="进场照片"
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
        dialogVisible:false,
        iframeurl:'',
        carcolor:[],//汽车颜色
        worktimeForm: {
          InoutDaterange: [
          ], // 时间范围
        },
        optionGroups: [{value:1,label:"蓝"},{value:2,label:"黄"},{value:3,label:"白"},{value:4,label:"黑"},{value:5,label:"绿"}],
        lisecolor:"",
        tabelurlstring:"",
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
          this.tabelurlfnc()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.inoutcarquery()
        this.tabelurlfnc()
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
      dateChangeHandle(e) {
        console.log(e)
        },
      groupChangeHandle(e) {
        console.log(e)
        let num=e[0]
        this.lisecolor=this.optionGroups[num-1].label
        console.log("yanse",this.lisecolor)
      },
      handleSubmit() {//查询按钮
        // console.log(11111111,this.carcolor)
        this.loading = true
        const sTime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        const eTime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
        this.inoutcarquery(sTime, eTime)
        this.tabelurlfnc(sTime, eTime)
        this.loading = false
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      inoutcarquery(sTime, eTime){//表格数据  tabelurlfnc
        console.log("车辆颜色",sTime,this.lisecolor)
          const param = {
            method: 'query_vehicle_logs',
            project_id: this.project_id,
            bt:sTime,
            et:eTime,
            lisence_type:this.lisecolor,
            limit_row:10000,
          }
          this.$store.dispatch('Inoutcarquery', param).then((data) => {
            console.log("车辆数组",data)
            this.tableData=data.data
            this.table2=data.data
            this.tableData.forEach(item=>{//序号
                item["carnum"]=(this.tableData.indexOf(item) + 1)
            })
          })
      },
      tabelurlfnc(sTime, eTime){//表格地址
        const param = {
            method: 'query_vehicle_logs',
            project_id: this.project_id,
            bt:sTime,
            et:eTime,
            lisence_type:this.lisecolor,
            limit_row:10000,
            t:"download"
          }
          this.$store.dispatch('Inoutcarquery', param).then((data) => {
            console.log("车辆数组222",data.url)
            this.tabelurlstring=data.url
          })
      },
      tabeldownload(){
        // window.open(this.tabelurlstring)
        console.log("表格下载地址",this.tabelurlstring)
        window.open(this.tabelurlstring)
      },
      previewtp(e){//车辆图片预览
        this.dialogVisible=true
        this.iframeurl=e.pic
        console.log(this.iframeurl)
        // window.open(e.pic)//?t=download
      },
      downloadtp(e) {//车辆图片下载
        console.log("车牌牌牌牌牌牌",e)
        let name=e.lisence+"——"+e.created_time
        let url=e.pic
        url=url.replace("http://w.yidebim.com:8899/","")
        this.downloadIamge(url, name)
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
      },
      handleClose(){

      }
    }
  }
</script>

<style scoped>
  .iframeclass{
    width: 100%;
  }
</style>
