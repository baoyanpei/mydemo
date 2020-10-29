<template>
  <!--材料入库-->
  <div class="input-container" style="margin-top: 20px;padding-top: 20px">
    <el-row :gutter="10">
      <el-col :span="4">
        <PagMenu></PagMenu>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light input-form">
          <el-divider content-position="center"><h2>材料入库</h2></el-divider>
          <el-form ref="dataForm" :model="form" :rules="rules" label-width="120px" class="input-container-form"  v-loading="loading">
            <div class="input-from-sum">
              <p>一、基本信息 <span v-show="itemShow" @click="showAndHidden">+</span><span v-show="!itemShow" @click="showAndHidden">-</span></p>
                  <div style="padding-left: 25px;" v-show="itemShow">
                      <el-form-item label="类别:" prop="category">
                        <el-select v-model="form.category" placeholder="请选择类型" @change="addMaterialJudge=true">
                          <el-option v-for="(item,index) in options.category" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-button type="success" v-if="addMaterialJudge" icon="el-icon-edit" size="mini" @click="addThreeCom('ori')">添加材料</el-button>
                      </el-form-item>
                      <el-form-item label="入库时间:" prop="date">
                        <el-date-picker v-model="form.date" type="date" placeholder="选择日期:"> </el-date-picker>
                      </el-form-item>
                      <el-form-item label="入库编号:" style="width:400px" prop="code">
                        <el-input v-model="form.code"></el-input>
                      </el-form-item>
                      <el-form-item label="供货商:" prop="supplier_id">
                        <el-select v-model="form.supplier_id" placeholder="请选择供货商">
                          <el-option v-for="item in supplier" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="addThreeCom('sup')">添加</el-button>
                      </el-form-item>
                      <el-form-item label="产地厂:" prop="origin_id">
                        <el-select v-model="form.origin_id" placeholder="请选择产地厂">
                          <el-option v-for="item in original" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                        <el-button type="success" icon="el-icon-edit" size="mini" @click="addThreeCom('ori')">添加</el-button>
                      </el-form-item>
                      <el-form-item label="车牌号:" style="width:280px">
                        <el-input v-model="form.lisence"></el-input>
                      </el-form-item>
                  </div>
            </div>
            <div>
              <p>二、明细录入</p>
              <el-table
                :data="tableData"
                fit
                :summary-method="getSummaries"
                show-summary
                highlight-current-row
                style="width:100%;padding-left: 25px"
                :stripe=true
                :border=true
                :show-header=true>
                <el-table-column label="操作" width="120">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="handleAdd(scope.$index, scope.row)">+</el-button>
                    <el-button size="mini"type="danger" @click="handleDel(scope.$index, scope.row)">-</el-button>
                  </template>
                </el-table-column>
                <el-table-column  label="序号" width="80"><template slot-scope="scope">{{scope.$index+1}}</template></el-table-column>
                <el-table-column  label="材料类别" width="180">
                  <template slot-scope="scope">
                    <el-select prop="style_id" v-model="scope.row.style_id" @change="queryMaterialList(scope.$index,scope.row.style_id)" clearable placeholder="选择" style="width:100px">
                      <el-option v-for="item in materialStyle" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column  label="材料信息" width="260">
                  <template slot-scope="scope">
                    <el-cascader
                      v-model="scope.row.name_id"
                      :options="scope.row.materialList"
                      :props="{ expandTrigger: 'hover' }"
                      @change="handleChange(scope.row.style_id)" style="width:240px"></el-cascader>
                  </template>
                </el-table-column>
                <el-table-column label="数量" sortable width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.number" @change="getColumns('number',scope.row.number)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="发票" width="180">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.invoice" placeholder="请选择类型">
                      <el-option label="有" value="有"></el-option>
                      <el-option label="无" value="无"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column  label="类型" width="180">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.ordinary_rate" placeholder="请选择类型">
                      <el-option label="专票" value="0"></el-option>
                      <el-option label="普票" value="1"></el-option>
                      <el-option label="调拨" value="2"></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column  label="税率" width="120">
                  <template slot-scope="scope">
                    <el-select v-model="scope.row.taxrate" @change="getColumns(scope.row,'taxrate',scope.row.taxrate)" placeholder="请选择类型">
                      <el-option label="0" value="0"></el-option>
                      <el-option value="0.01" label="1%"></el-option>
                      <el-option value="0.03" label="3%"></el-option>
                      <el-option value="0.05" label="5%"></el-option>
                      <el-option value="0.11" label="11%"></el-option>
                      <el-option value="0.13" label="13%"></el-option>
                      <el-option value="0.16" label="16%"></el-option>
                      <el-option value="0.17" label="17%"></el-option>
                    </el-select>
                  </template>

                </el-table-column>
                <el-table-column  label="含税单价" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxprice" @change="getColumns(scope.row,'taxprice',scope.row.taxprice)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="含税小计" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxcount"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="不含税单价" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.price" @change="getColumns(scope.row,'price',scope.row.price)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="不含税小计" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.count" ></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="金额调差" width="180" hide="true">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.diff" @change="getColumns(scope.row,'diff',scope.row.diff)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="税额" width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.taxamou" @change="getColumns(scope.row,'taxamou',scope.row.taxamou)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column  label="税额调差" width="180" style="display: none">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.tax_diff" @change="getColumns(scope.row,'tax_diff',scope.row.tax_diff)"></el-input>
                  </template>
                </el-table-column>
               <el-table-column  label="备注" width="240">
                 <template slot-scope="scope">
                   <el-input v-model="scope.row.desc"></el-input>
                 </template>
               </el-table-column>
              </el-table>
          </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogStatus==='create'?submitData('dataForm'):updateData()">
              提交
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <three-com-dialog ref="threeCom" />
  </div>


</template>

  <script>
      import PagMenu from "../component/PagMenu"
      import ThreeComDialog from "../component/ThreeComDialog"
      import {getCostMgtInfoList,submitMaterial} from "@/api/costmgt"

      export default {
          components:{
              PagMenu,ThreeComDialog
          },
          data() {
              return {
                  loading:false,
                  itemShow:true,
                  addMaterialJudge:false,
                  options:{

                      category:[{value: '1', label: '土建'},{value: '2', label: '安装'}]

                  },
                  sumData:{},
                  tableData:[{
                      "style_id": "",
                      "style_name": "",
                      "name_id": "",
                      "name": "",
                      "model": "",
                      "unit": "",
                      "invoice": "",
                      "taxrate": undefined,
                      "ordinary_rate": "",
                      "number": undefined,
                      "taxprice": undefined,
                      "taxcount": undefined,
                      "price": undefined,
                      "count": undefined,
                      "taxamou": undefined,
                      "diff": undefined,
                      "tax_diff": undefined,
                      "desc": "",
                      "materialList":[]
                  }],
                  supplier: [],
                  original: [],
                  materialList1:[],
                  dialogStatus:'create',
                  items:'',
                  form: {
                      code: '',
                      supplier_id:null,
                      origin_id:null,
                      date: '',
                      lisence:'',
                      desc: ''
                  },
                  rules: {
                      category: [{required: true, message: '请选择类型', trigger: 'change'  }],
                      code: [{ required: true, message: '必须填写编码', trigger: 'blur' }],
                      date: [{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }],
                      supplier_id: [{required: true, message: '请选择供货商', trigger: 'change' }],
                      origin_id: [{ required: true, message: '请选择产地厂', trigger: 'change' }]
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
                      this.$store.dispatch('getMaterialStyleList', {"method":"material_style"});
                  }
                  return this.$store.state.costMgt.materialStyle;

              }
          },
          watch:{

              //切换项目时候发生
              project_id(newData,oldData){

                  this.loading=true;
                  this.project_id=newData;

                  //从新获取此项目下的产地厂 供货商信息
                  this.getCostMgtInfoList();


              }

          },
          created(){

              this.getCostMgtInfoList();

          },
          methods: {
              getCostMgtInfoList(){

                  // 供货商
                  getCostMgtInfoList({"method":"supplier_list","project_id":this.project_id}).then(res=>{
                      this.supplier =res.data;
                  });
                  //产地商
                  getCostMgtInfoList({"method":"original_list","project_id":this.project_id}).then(res=>{

                      this.original =res.data;
                  })
                  //重置表单
                  this.form={

                      code: '',
                      supplier_id:null,
                      origin_id:null,
                      date: '',
                      lisence:'',
                      desc: ''
                  }
                  setTimeout(() => {
                      this.loading=false;
                  }, 2000);
              },
              //添加产地商或者供货商
              addThreeCom(trup){

                  this.$refs.threeCom.dialogFormVisible = true;
                 if(trup==='sup'){

                   //添加供货商的模态框
                     this.$refs.threeCom.title="添加供货商名称"
                     this.$refs.threeCom.itemTitle="供货商名称:"

                 }else if(trup==='ori'){

                     this.$refs.threeCom.title="添加产地厂名称"
                     this.$refs.threeCom.itemTitle="产地厂名称:"


                 }

              },

              getSummaries(param){
                  const { columns, data } = param;
                  const sums =[];
                  sums[0]='合计';
                  sums[9]=0; //含税小计
                  sums[11]=0;//不含税小计
                  sums[12]=0;//金额调差
                  sums[13]=0;//税额
                  sums[14]=0;//税额调差
                  data.forEach(item=>{

                      if(!isNaN(Number(item.taxcount))){ //含税小计
                          sums[9]+=Number(item.taxcount)
                      }

                      if(!isNaN(Number(item.count))){ //不含税小计
                          let diff=0.0;
                          if(!isNaN(Number(item.diff))){diff=item.diff}
                          sums[11]+=(Number(item.count)+Number(diff))
                      }

                      if(!isNaN(Number(item.diff))){ //金额调差
                          sums[12]+=Number(item.diff)
                      }
                      if(!isNaN(Number(item.taxamou))){ //税额
                          let tax_diff=0.0;
                          if(!isNaN(Number(item.tax_diff))){tax_diff=item.tax_diff}
                          sums[13]+=(Number(item.taxamou)+Number(tax_diff))
                      }
                      if(!isNaN(Number(item.tax_diff))){ //税额调差
                          sums[14]+=Number(item.tax_diff)
                      }

                  })

                  this.tableData.prices=sums[11];
                  this.tableData.taxamous=sums[13];

                  return sums;
              },
              getSubmitData(){

                  this.form.project_id=this.project_id; //获取系统的项目ID
                  let tmpData=[];
                  //获取提交的数据items
                  this.tableData.forEach(item=>{
                      let trup={};
                      trup.style_id=item.style_id;
                      trup.name_id=item.name_id[1]
                      trup.invoice=item.invoice
                      trup.taxrate=parseFloat(item.taxrate)
                      trup.ordinary_rate=parseInt(item.ordinary_rate)
                      trup.number=parseFloat(item.number)
                      trup.price=parseFloat(item.price)
                      trup.count=parseFloat(item.count)
                      trup.taxprice=parseFloat(item.taxprice)
                      trup.taxcount=parseFloat(item.taxcount)
                      trup.taxamou=parseFloat(item.taxamou)
                      trup.diff=parseFloat(item.diff)
                      trup.tax_diff=parseFloat(item.tax_diff)
                      trup.desc=item.desc
                      tmpData.push(trup)

                  })
                  let prices= this.tableData.prices;
                  let taxamous =this.tableData.taxamous;
                  this.sumData = JSON.parse(JSON.stringify(this.form))
                  this.sumData.items=tmpData;
                  this.sumData.prices=prices;
                  this.sumData.taxamous=taxamous;
                  return this.sumData;
              },
              getColumns(row,trup,value) {

                  //不含税价格 = 含税价格/（1+税率）
                  //含税价格 = 不含税价格*(1+税率)
                  //
                  switch(trup){

                      case 'price' :

                          //计算含税单价
                          if(row.taxrate) {
                              row.taxprice = (Number(value) * (1 + Number(row.taxrate))).toFixed(11);

                          }else{

                              this.$message({
                                  message: '先选择税率',
                                  type: 'warning'
                              });
                              row.price='';
                          }
                          //小计

                          if(row.number) {
                              row.count = (Number(row.number) * Number(row.price)).toFixed(2);
                              row.taxcount = (Number(row.number) * Number(row.taxprice)).toFixed(2);
                              row.taxamou = (row.taxcount-row.count).toFixed(2);

                          }
                          break;

                      case 'taxrate':
                          //切换税率 重置后面的金额
                          row.price='';
                          row.taxprice='';
                          row.count='';
                          row.taxcount='';
                       break;

                      case 'taxprice':
                          //计算不含税单价= 含税价格/（1+税率）
                          if(row.taxrate) {
                              row.price = (Number(value) / (1 + Number(row.taxrate))).toFixed(11);
                          }else{

                              this.$message({
                                  message: '先选择税率',
                                  type: 'warning'
                              });
                              row.taxprice='';
                          }
                          //小计
                          if(row.number) {
                              row.count = (Number(row.number) * Number(row.price)).toFixed(2);
                              row.taxcount = (Number(row.number) * Number(row.taxprice)).toFixed(2);
                              row.taxamou = (row.taxcount-row.count).toFixed(2);
                          }

                          break;
                      case 'number':
                          //数量  计算count taxcount
                          if(row.price) {
                              row.count = (Number(value) * Number(row.price)).toFixed(2);
                              row.taxcount = (Number(value) * Number(row.taxprice)).toFixed(2);
                              row.taxamou = (row.taxcount-row.count).toFixed(2);
                          }

                          break;

                  }



              },

              //提交入库
              submitData(formName) {

                  this.$refs[formName].validate((valid) => {
                      if (valid) {

                          this.getSubmitData();

                          this.sumData.method="material_instock";
                          submitMaterial(this.sumData).then(res=>{

                             //提交成功
                              this.$notify({
                                  title: '成功',
                                  message: '提交成功！！！',
                                  type: 'success',
                                  duration: 2000
                              });
                              const condition={"categoryId":this.form.category,"inorout":1,"proId":this.project_id,"code":this.form.code};
                              this.$router.push({path:'/costmgt/queryCost',query:condition});

                          }).catch(res=>{

                              console.log("error="+JSON.stringify(res))
                              //提交失败
                              this.$message({
                                  message: "提交入库失败！",
                                  type: "error"
                              });

                          })
                      } else {
                          console.log('error submit!!');
                          return false;
                      }
                  });


              },
              updateData() {

                  let tmpData =this.tableData.pop();
                  let  submitData =tmpData.concat(this.sumData);

              },

              queryMaterialList(index,style_id){

                  //清空/材料list
                  let condition ={

                      "method":"material_name",
                      "project_id":this.project_id,
                      "style_id":style_id,
                      "category_id": this.form.category
                  };
                  getCostMgtInfoList(condition).then(res=>{
                      this.materialList1 =res.data;
                     if(this.materialList1.length!==0){
                         this.assemblyMaterialNameList(index);
                     }else{

                         this.$message({
                             message: '此种类下空空如也~~~',
                             type: 'warning'
                         });
                         this.tableData.splice(index,1,{
                             "style_id": "",
                             "style_name": "",
                             "name_id": "",
                             "name": "",
                             "model": "",
                             "unit": "",
                             "invoice": "",
                             "taxrate": undefined,
                             "ordinary_rate": "",
                             "number": undefined,
                             "taxprice": undefined,
                             "taxcount": undefined,
                             "price": undefined,
                             "count": undefined,
                             "taxamou": undefined,
                             "diff": undefined,
                             "tax_diff": undefined,
                             "desc": "",
                             "materialList":[]
                         });
                     }
                  })

              },
              handleAdd(){
                  let list={
                      "style_id": "",
                      "style_name": "",
                      "name_id": "",
                      "name": "",
                      "model": "",
                      "unit": "",
                      "invoice": "",
                      "taxrate": undefined,
                      "ordinary_rate": "",
                      "number": undefined,
                      "taxprice": undefined,
                      "taxcount": undefined,
                      "price": undefined,
                      "count": undefined,
                      "taxamou": undefined,
                      "diff": undefined,
                      "tax_diff": undefined,
                      "desc": "",
                      "materialList":[]
                  };
                  this.tableData.push(list);
              },
              handleDel(index,row) {

                  if(this.tableData.length>1) {
                      this.tableData.splice(index, 1);
                  }
              },
              showAndHidden(){
                  if(this.itemShow===true)
                  {
                      this.itemShow=false
                  }else{
                      this.itemShow=true
                  }
              },

              assemblyMaterialNameList(index){

                  let trupData=this.unique(this.materialList1,'name');
                  let tmpList=[];
                  trupData.forEach((item,index,array)=>{

                          //名字相同的材料
                          tmpList.push({

                              'value':item.id,
                              'label':item.name,
                              'model':item.model,
                              'children':[]

                          })
                  })
                  trupData.forEach((item,index)=>{
                      let children1=[],children2=[];
                      this.materialList1.forEach((item1)=>{

                             if(item.name===item1.name){ //材料名称相同

                                     //添加类型
                                     children2=[{'value':item1.id, 'label':item1.unit}];
                                     children1.push({

                                         'value':item1.id,
                                         'label':item1.model,
                                         'unit':item1.unit,
                                         'status':item1.model+item1.unit, //相同型号 单位的合并
                                         'children':children2

                                     })
                             }
                       })

                      //注意：相同材料名 型号 不同的单位
                      children1=this.unique(children1,'status');
                      children1.forEach((item,index)=>{
                          children1.forEach((item1,index1)=>{

                              if(item.label===item1.label && index!==index1){

                                  children1[index].children.push({'value':item1.id, 'label':item1.unit})

                              }

                          })
                      })
                      children1=this.unique(children1,'label');
                      if(children1) {
                          tmpList[index].children=children1;
                      }

                   })

                  this.tableData[index].materialList=tmpList;

              },
              unique(arr,val) {
                  const res = new Map();
                  return arr.filter(item => !res.has(item[val]) && res.set(item[val], 1))
              },
              handleChange(value) {


              }
          }
      }
  </script>

<style type="scss" scoped>
  .input-container {
    height: calc(100vh - 34px);
    padding: 10px;
    background-color: #FFFFFF;

  .el-form-item {
    margin-bottom: 2px;
  }


  }
</style>
<style scoped>
  .input-form{

    width:90%;
  }

  .input-container-form{

    margin-top: 25px;

  }
  .input-from-sum{
    padding: 5px;
    border: #0a76a4;
  }
 .dialog-footer{

   padding-top: 25px;
   width: 100%;
   text-align: center;

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
    text-align: center;
  }
  .el-table .cell {
    text-align: center;
  }
  /**
    * 查询行和table之间的12px的距离
   */
  .filter-container {
    padding-bottom: 10px;
  } .el-button+.el-button{
    margin-left: 0px !important;
  }
</style>
