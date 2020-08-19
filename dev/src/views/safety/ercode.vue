<style lang="scss">
  @import "./index";
</style>
<style>
 .ercodewpan{
   display: block;
   font-size: 30px;
   font-weight: 800;
 }
  .batchdown{
    width: 100%;
    overflow:hidden;
  }
  .downsmall{
    width:550px;
    height: 230px;
    float: left;
    margin-bottom: 20px;
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
          <el-form ref="worktimeForm" label-width="80px" :inline="true">
            <el-form-item prop="GroupList">
              <el-button type="primary" @click="batchfnc()">批量下载打印</el-button>
            </el-form-item>
            <el-form-item prop="GroupList">
              <span>设备类型：</span>
             <el-cascader v-model="value" :options="options" @change="handleChange" :show-all-levels="false"></el-cascader>
              <!--<el-cascader v-model="labeloptionsvalue" :options="labeloptions" @change="handleChange" :show-all-levels="false"></el-cascader>-->
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <el-table :data="tableData" ref = "multipleTable "
            style="width: 98%;margin:20px auto;border-collapse:collapse;" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column prop="eleid" label="序号" width="80">
            </el-table-column>
            <el-table-column prop="device_name" label="名称" width="180">
            </el-table-column>
            <el-table-column label="设备类型" prop="type_name" width="80">
            </el-table-column>
            <el-table-column label="设备位置" prop="addr" width="180">
            </el-table-column>
            <el-table-column label="操作" width="180">
              <template slot-scope="scope">
                  <el-button type="text" size="small" @click="previewfnc(scope.row)"><i class="el-icon-view">预览</i>
                  </el-button>
                  <el-button type="text" size="small" @click="downloadfnc(scope.row)"><i class="el-icon-download">打印</i>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!--二维码预览-->
          <el-dialog title="二维码预览" :visible.sync="dialogVisible" width="50%">
            <div class="bigercode" style=";margin:0 auto;" ref="box">
                <img :src=imgsrc alt="" crossorigin="anonymous" style="width: 230px;height: 230px;margin-right:10px;float: left">
                <span class="ercodewpan">{{span1}}</span>
                <span class="ercodewpan" style="margin-top: 60px">{{span2}}</span>
                <span class="ercodewpan" style="margin-top: 60px">{{span3}}</span>
            </div>
            <br>
            <button @click="generatorImage()">下载图片</button>
          </el-dialog>
          <!--批量下载-->
          <el-dialog title="二维码预览" :visible.sync="centerDialogVisible" width="1200px">
            <button @click="getdowntpall()">下载图片</button>
              <div class="batchdown">
                <div class="downsmall" v-for="item in this.erval">
                  <img :src=item.imgsrc alt="" crossorigin="anonymous" style="width: 230px;height: 230px;margin-right:10px;float: left">
                  <span class="ercodewpan">{{item.projectname}}</span>
                  <span class="ercodewpan" style="margin-top: 60px">{{item.device_name}}</span>
                  <span class="ercodewpan" style="margin-top: 60px">{{item.addr}}</span>
                </div>
              </div>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
    </div>
</template>

<script>
  import TJFXMenu from "../layout/components/XUGLMenu.vue"
  import { async } from 'q'
  export default {
    components: {
      TJFXMenu
    },
    name: 'index',
    data(){
      return{
        worktimeForm:[],
        value:"",
        dialogVisible: false,
        centerDialogVisible: false,
        imgsrc:"",
        span1:"",
        span2:"",
        span3:"",
        imgUrl2:"",
        options:[],
        tableData:[],
        deviceid:'',
        projectname:"",
        imgUrl1:"",
        erval:[],
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },
      project_option() {
        return this.$store.state.project.project_option
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          this.getshebei()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.getshebei()
      }

    },
    methods:{
      handleChange(e){
        console.log("改变",e)
        this.deviceid=e[0]
        this.gettable()
      },
      handleSelectionChange(val){
        this.erval=[]
        this.erval=val
        console.log("val",val)
      },
      getshebei(){
        for(let i=0;i<this.project_option.length;i++){
          if(this.project_id==this.project_option[i].value){
            this.projectname=this.project_option[i].label
          }
        }
        const param = {
          method: 'dev_template_list',
          project_id: this.project_id
        }
        this.$store.dispatch('GetDist', param).then((data) => {
          this.options=[]
          console.log("配电箱设备222",data)//YJPDX001
          this.tableData=[]
          for(let i=0;i<data.length;i++){
            this.options.push({label:data[i].type_name,value:data[i].device_type})
          }
          this.deviceid=this.options[0].value
          console.log("liebiao",)
          this.gettable()
        }).catch(() => {
        })
      },
      gettable(){
        const param = {
          method: 'dev_list',
          project_id: this.project_id,
          device_type:this.deviceid
        }
        this.$store.dispatch('GetDist', param).then((data) => {
          this.tableData=data
          this.tableData.forEach(item=>{
            item["projectname"]=this.projectname
            item["imgsrc"]="http://admin.yidebim.com/api/oa/qrcode/device.jpg?project_id="+this.project_id+"&device_id="+item.device_id+"&w=180&border=1"
            item.eleid=this.tableData.indexOf(item)+1
          })
          console.log("设备列表",this.tableData)
        }).catch(() => {
        })
      },
      previewfnc(e){
        this.dialogVisible=true
        this.span1=e.projectname
        this.span2=e.device_name
        this.span3=e.addr
        this.imgsrc="http://admin.yidebim.com/api/oa/qrcode/device.jpg?project_id="+this.project_id+"&device_id="+e.device_id+"&w=180&border=1"
      },
      generatorImage() {
        let xx=document.getElementsByClassName("bigercode")[0]
         console.log("xx",xx)
         html2canvas(xx,{useCORS: true}).then(canvas => {
          let link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.setAttribute("download","二维码.png");
          link.style.display = "none";//a标签隐藏
          document.body.appendChild(link);
          link.click();
        });
      },
      downtp(){
      },
      downloadfnc(e){
        this.dialogVisible=true
        this.span1=e.projectname
        this.span2=e.device_name
        this.span3=e.addr
        this.imgsrc="http://admin.yidebim.com/api/oa/qrcode/device.jpg?project_id="+this.project_id+"&device_id="+e.device_id+"&w=180&border=1"
        this.interval = setTimeout(() => {
          this.generatorImage()
        },3000)
      },
      batchfnc(){
        this.centerDialogVisible=true
      },
      getdowntpall(){
          let xx=document.getElementsByClassName("batchdown")[0]
           console.log("xx",xx)
           html2canvas(xx,{useCORS: true}).then(canvas => {
            let link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.setAttribute("download","二维码大图.png");
            link.style.display = "none";//a标签隐藏
            document.body.appendChild(link);
            link.click();
          });
      }
    }
  }
</script>
