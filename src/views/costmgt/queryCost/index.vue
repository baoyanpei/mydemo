<template>
  <div style="padding-top: 20px">

    <el-row :gutter="10">
      <el-col :span="4">
        <PagMenu></PagMenu>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-form ref="dataForm"   :model="form" :rules="rules" label-width="59px" :inline="true">
            <div style="margin-bottom: 8px">
            <el-form-item label="专业:" prop="category" >
              <el-select v-model="form.category" placeholder="土建" style="width: 170px;" size="mini" @change="handleSelectChange">
                <el-option v-for="(item,index) in options.category" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型:" prop="inorout" >
              <el-select v-model="form.inorout" placeholder="入库列表" style="width: 170px;" size="mini"  @change="handleSelectChange">
                <el-option v-for="(item,index) in options.inorout" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="供货商:" prop="supplier_id" >
              <el-select clearable v-model="form.supplier_id" placeholder="供货商查询" style="width: 170px;" size="mini">
                <el-option v-for="item in supplier_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="编号:" prop="code" >
                <el-input v-model="form.code" size="mini"></el-input >
              </el-form-item>
            </div>
            <el-form-item label="种类:" prop="style_id" >
              <el-select clearable v-model="form.sytle_id" placeholder="材料种类查询" style="width: 170px;" size="mini" @change="getMaterialName">
                <el-option v-for="item in materialStyle" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称:" prop="name_id" >
              <el-select clearable v-model="form.name_id" placeholder="材料名称查询" style="width: 170px;" size="mini">
                <el-option v-for="item in materialName" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="开始:" prop="bt">
              <el-date-picker v-model="form.bt" type="date" placeholder="起始日期:" style="width: 170px;" size="mini" />
            </el-form-item>
            <el-form-item label="结束:" prop="et">
              <el-date-picker v-model="form.et" type="date" placeholder="结束日期:" style="width: 170px;" size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-search"
                         @click.native.prevent="handleSubmit('dataForm')" size="mini">查询</el-button>
              <el-button type="success" icon="el-icon-download"
                         @click.native.prevent="tabeldownload()" size="mini">导出Excel</el-button>
            </el-form-item>
          </el-form>
          <!-- 入库总体查询-->
          <input-sum ref="inputSum"></input-sum>
          <!-- 入库分项查询-->
          <input-item ref="InputItem"></input-item>
          <!-- 出库总体查询-->
          <output-sum ref="outputSum"></output-sum>
          <!-- 出库分项查询-->
          <output-item ref="outputItem"></output-item>
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="pagechange"
            :current-page="form.page"
            :page-sizes="[10, 20, 30, 40, 50]"
            :page-size="form.limit"
            :total="pageCount"
            layout="total, sizes, prev, pager, next, jumper">
          </el-pagination>
        </div>
      </el-col>
    </el-row>
    <!--入库详情-->
    <in-detail-dialog ref="inDetail"></in-detail-dialog>
    <!--出库详情-->
    <out-detail-dialog ref="outDetail"></out-detail-dialog>
  </div>
</template>

<script>
    import moment from 'moment'
    import PagMenu from "../component/PagMenu"
    import InputSum from "../component/InputSum"
    import InputItem from "../component/InputItem"
    import OutputSum from "../component/OutputSum"
    import OutputItem from "../component/OutputItem"
    import InDetailDialog from "../component/InDetailDialog"
    import OutDetailDialog from "../component/OutDetailDialog"
    import {getCostMgtInfoList} from "@/api/costmgt"
    export default {
        components: {
            PagMenu,InDetailDialog,OutDetailDialog,
            InputSum,InputItem,OutputSum,OutputItem
        },
        name: 'inputQuery',
        data(){
            return{

                form:{limit:20,page:1},
                showSum:true,
                showItem:false,
                outShowSum:false,
                outShowItem:false,
                pageCount:0,
                options:{

                    category:[{value: 1, label: '土建'},{value: 2, label: '安装'}],
                    inorout:[{value: 1, label: '入库列表'},{value: 2, label: '出库列表'}]

                },
                itemLoading: false,
                sumLoading:false,
                outSumLoading:false,
                outItemLoading:false,

                dialogVisible:false,
                tableData: [{

                }],
                table2:[],
                materialName:[],
                rules: {
                    category: [{required: true, message: '请选择专业', trigger: 'change'  }],
                    inorout: [{required: true, message: '您查询入库还是入库', trigger: 'change'  }],
                },
            }
        },
        computed:{

                project_id(){

                    //获取系统 跟系统同步
                    return this.$store.state.project.project_id;
                },
                materialStyle(){

                    //store获取
                    if(this.$store.state.costMgt.materialStyle.length===0){
                        this.$store.dispatch('getMaterialStyleList');
                    }
                    return this.$store.state.costMgt.materialStyle;

                },
                supplier_list(){

                    //store获取
                    if(this.$store.state.costMgt.supplierList.length===0){
                        this.$store.dispatch('getSupplierList',{"method":"supplier_list","project_id":this.project_id});
                    }
                    return this.$store.state.costMgt.supplierList;

                }

        },
        watch:{

            //切换项目时候发生
            project_id(newData,oldData){

                this.project_id=newData;

            }

        },
        created(){
            //入库提交成功后调用
           if(this.$route.query.categoryId!==undefined){

               this.form.category=Number(this.$route.query.categoryId);
               this.form.inorout=Number(this.$route.query.inorout);
               this.form.project_id=Number(this.$store.state.project.project_id);
               this.form.code=this.$route.query.code+'';
               //自动查询相关列表
               this.initQueryDataList();
           }
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

            unique(arr) {
                let map = new Map();
                console.log(map)
                //let arr1 = new Array();      // 数组用于返回结果
                let arr1 = []
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (map.has(arr[i].name)) {      // 判断是否存在该key值
                        map.set(arr[i].name, true);
                    }
                    else {
                        map.set(arr[i].name, false);
                        arr1.push(arr[i]);
                    }
                }
                return arr1;
            },
            getMaterialName(){

                // 供货商
                const param={method:"material_name",project_id:this.project_id,style_id:this.form.style_id};
                getCostMgtInfoList(param).then(res=>{

                    //去重
                    this.materialName=this.unique(res.data)

               });
            },
            //查询明细表
            queryDetail(data,rows){

               let param='';
              if(this.form.inorout===1) {
                  //入库
                  this.$refs.inDetail.dialogDetailVisible = true;
                  this.$refs.inDetail.loading = true;
                  this.$refs.inDetail.title = "编号 " + rows.code + " 的入库详情表";
                  param={"method":"material_instock_items","project_id":"10013","category":rows.category,"id":rows.id};
              }else{

                  //出库
                  this.$refs.outDetail.dialogDetailVisible = true;
                  this.$refs.outDetail.loading = true;
                  this.$refs.outDetail.title = "编号 " + rows.code + " 的出库详情表";
                  param={"method":"material_outstock_items","project_id":"10013","category":rows.category,"id":rows.id};
              }
              //不需要缓存进store；直接查询详情
               getCostMgtInfoList(param).then(res=>{
                   if(this.form.inorout===1) {
                       this.$refs.inDetail.tableDetailData = res.data;
                       this.pageCount=res.count;
                       this.$refs.inDetail.loading = false;
                   }else{
                       this.$refs.outDetail.tableDetailData = res.data;
                       this.pageCount=res.count;
                       this.$refs.outDetail.loading = false;
                   }
               })
            },

            //提交跳转列表自动查询
            initQueryDataList(){

                this.form.method="material_instock_query";
                getCostMgtInfoList(this.form).then(res=>{

                    this.tableData=res.data;

                    this.pageCount=res.count;
                    this.form.code='';

                })

            },
            handleSelectChange(){
                this.$forceUpdate()
            },
            dateChangeHandle(e) {
                console.log(e)
            },
            groupChangeHandle(e) {

                let num=e[0]
                this.lisecolor=this.optionGroups[num-1].label

            },
            handleSubmit(formName) {//查询按钮

                this.$refs[formName].validate((valid) => {

                    if (valid) {

                        this.trupShowHide();

                        if(this.form.bt)this.form.bt = moment(this.form.bt).format('YYYY-MM-DD');
                        if(this.form.et)this.form.et = moment(this.form.et).format('YYYY-MM-DD');
                        this.form.project_id=this.project_id;
                        getCostMgtInfoList(this.form).then(res=>{

                            this.tableData=[{}];
                            this.tableData=res.data;
                            this.pageCount=res.count;

                            if(this.form.inorout===1) {
                                this.sumLoading = false;
                                this.itemLoading = false;
                            }else{
                                this.outSumLoading = false;
                                this.outItemLoading = false;
                            }

                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


                this.loading = false
            },
            trupShowHide(){

                if(this.form.inorout===1){

                    //入库查询
                    this.sumLoading = true;
                    this.itemLoading =true;

                    //查询入库分项
                    if(this.form.sytle_id){
                        this.form.method="material_instock_items";
                        this.showItem=true;
                        this.showSum=false;
                        this.outShowItem=false;
                        this.outShowSum=false;
                    }else {
                        //查询入库总项
                        this.form.method = "material_instock_query";
                        this.showSum=true;
                        this.showItem=false;
                        this.outShowSum=false;
                        this.outShowItem=false;
                    }

                }else{

                    //出库查询
                    this.outSumLoading = true;
                    this.outItemLoading =true;

                    //查询出库分项
                    if(this.form.sytle_id){
                        this.form.method="material_outstock_items";
                        this.outShowItem=true;
                        this.outShowSum=false;
                        this.showItem=false;
                        this.showSum=false;

                    }else {
                        //查询出库总项
                        this.form.method = "material_outstock_query";
                        this.outShowSum=true;
                        this.outShowItem=false;
                        this.showItem=false;
                        this.showSum=false;
                    }

                }

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
                  /*  console.log("车辆数组",data)
                    this.tableData=data.data
                    this.table2=data.data
                    this.tableData.forEach(item=>{//序号
                        item["carnum"]=(this.tableData.indexOf(item) + 1)
                    })*/
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

                this.form.page=e
                this.handleSubmit('dataForm')

            },
            handleSizeChange(e){

                this.form.limit = e
                this.handleSubmit('dataForm')
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

  .worktime-container {
     height: calc(100vh - 34px);
     padding: 10px;
     background-color: #FFFFFF;
   }
  .el-form-item {
    margin-bottom: 2px;
  }

  /* 解决element-ui的table表格控件表头与内容列不对齐问题 */
  .el-table th.gutter{
    display: table-cell!important;
  }
  .el-table{margin-bottom: 9px;}
  /**
     table 字体居中
   */
  .el-table th > .cell {
    text-align: center!important;
  }
  .el-table .cell {
    text-align: center!important;
  }
  /**
    * 查询行和table之间的12px的距离
   */
  .filter-container {
    padding-bottom: 10px!important;
  } .el-button+.el-button{
      margin-left: 0px !important;
    }
</style>
