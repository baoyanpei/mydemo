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
            <el-form-item label="专业:" prop="category_id" >
              <el-select v-model="form.category_id" placeholder="土建" style="width: 170px;" size="mini" @change="handleSelectChange">
                <el-option v-for="(item,index) in options.category" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
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
            <el-form-item label="结束:" prop="et" v-if="false">
              <el-date-picker v-model="form.et" type="date" placeholder="截止日期:" style="width: 170px;" size="mini" />
            </el-form-item>
            <el-form-item>
              <el-button type="success" icon="el-icon-search"
                         @click.native.prevent="handleSubmit('dataForm')" size="mini">查询</el-button>
              <el-button type="success" icon="el-icon-download"
                         @click.native.prevent="tabeldownload()" size="mini">导出Excel</el-button>
            </el-form-item>
            </div>
          </el-form>
          <el-table
            v-loading="loading"
            v-if="show"
            :data="tableData"
            highlight-current-row
            show-summary
            stripe
            border
            @current-change="handleCurrentChange"
          >
            <el-table-column
              label="序号"
              fixed="left"
              width="50">
              <template slot-scope="scope">
                <span v-show="scope.row.code">{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="材料编号"
              width="130">
              <template slot-scope="scope">
                <el-button type="text" @click="handleAdd(scope.$index, scope.row)">{{scope.row.code}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              property="dept_name"
              label="所属公司"
              width="130">
            </el-table-column>
            <el-table-column
              property="material_name"
              label="材料名称"
              width="120">
            </el-table-column>
            <el-table-column
              property="model"
              label="型号"
              width="120">
            </el-table-column>
            <el-table-column
              property="unit"
              label="单位"
              width="90">
            </el-table-column>
            <el-table-column
              property="number"
              label="数量"
              width="120">
            </el-table-column>
            <el-table-column
              property="price"
              label="单价"
              width="180">
            </el-table-column>
            <el-table-column
              property="prices"
              label="金额[元]"
              width="150">
            </el-table-column>
            <el-table-column
              property="diff"
              label="金额调差[元]"
              width="150">
            </el-table-column>
            <el-table-column
              property="invoice"
              label="发票"
              width="90">
            </el-table-column>
            <el-table-column
              label="类型"
              width="120">
              <template slot-scope="scope">
                <span  v-show="scope.row.ordinaryrate === 0">专票</span>
                <span  v-show="scope.row.ordinaryrate === 1">普票</span>
                <span  v-show="scope.row.ordinaryrate === 2">调拨</span>
              </template>
            </el-table-column>
            <el-table-column
              property="taxrate"
              label="税率"
              width="120">
            </el-table-column>
            <el-table-column
              property="taxamou"
              label="税额[元]"
              width="120">
            </el-table-column>
            <el-table-column
              property="tax_diff"
              label="税额调差[元]"
              width="120">
            </el-table-column>
            <el-table-column
              property="supplier_name"
              label="供货单位"
              width="180">
            </el-table-column>
            <el-table-column
              property="origin_name"
              label="产地厂"
              width="180">
            </el-table-column>
            <el-table-column
              property="lisence"
              label="车辆号"
              width="120">
            </el-table-column>
            <el-table-column
              property="user_name"
              label="录入人"
              width="120">
            </el-table-column>
            <el-table-column
              property="createtime"
              label="录入时间"
              width="120">
            </el-table-column>
            <el-table-column
              property="desc"
              label="备注"
              width="180">
            </el-table-column>
          </el-table>
          <el-table
            v-loading="itemLoading"
            v-if="showItem"
            :data="tableData"
            highlight-current-row
            show-summary
            stripe
            border
            @current-change="parents.handleCurrentChange"
          >
            <el-table-column
              label="序号"
              fixed="left"
              width="50">
              <template slot-scope="scope">
                <span v-show="scope.row.code">{{scope.$index+1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="材料编号"
              width="130">
              <template slot-scope="scope">
                <el-button type="text" @click="handleAdd(scope.$index, scope.row)">{{scope.row.code}}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              property="dept_name"
              label="所属公司"
              width="130">
            </el-table-column>
            <el-table-column
              property="material_name"
              label="材料名称"
              width="120">
            </el-table-column>
            <el-table-column
              property="model"
              label="型号"
              width="120">
            </el-table-column>
            <el-table-column
              property="unit"
              label="单位"
              width="90">
            </el-table-column>
            <el-table-column
              property="number"
              label="数量"
              width="120">
            </el-table-column>
            <el-table-column
              property="price"
              label="单价"
              width="180">
            </el-table-column>
            <el-table-column
              property="prices"
              label="金额[元]"
              width="150">
            </el-table-column>
            <el-table-column
              property="diff"
              label="金额调差[元]"
              width="150">
            </el-table-column>
            <el-table-column
              property="invoice"
              label="发票"
              width="90">
            </el-table-column>
            <el-table-column
              label="类型"
              width="120">
              <template slot-scope="scope">
                <span  v-show="scope.row.ordinaryrate === 0">专票</span>
                <span  v-show="scope.row.ordinaryrate === 1">普票</span>
                <span  v-show="scope.row.ordinaryrate === 2">调拨</span>
              </template>
            </el-table-column>
            <el-table-column
              property="taxrate"
              label="税率"
              width="120">
            </el-table-column>
            <el-table-column
              property="taxamou"
              label="税额[元]"
              width="120">
            </el-table-column>
            <el-table-column
              property="tax_diff"
              label="税额调差[元]"
              width="120">
            </el-table-column>
            <el-table-column
              property="supplier_name"
              label="供货单位"
              width="180">
            </el-table-column>
            <el-table-column
              property="origin_name"
              label="产地厂"
              width="180">
            </el-table-column>
            <el-table-column
              property="lisence"
              label="车辆号"
              width="120">
            </el-table-column>
            <el-table-column
              property="user_name"
              label="录入人"
              width="120">
            </el-table-column>
            <el-table-column
              property="createtime"
              label="录入时间"
              width="120">
            </el-table-column>
            <el-table-column
              property="desc"
              label="备注"
              width="180">
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
    import PagMenu from "../component/PagMenu"
    import {getCostMgtInfoList} from "@/api/costmgt"
    export default {
        components: {PagMenu},
        name: 'inputQuery',
        data(){
            return{

                form:{limit:10000},

                options:{

                    category:[{value: 1, label: '土建'},{value: 2, label: '安装'}],
                    inorout:[{value: 1, label: '入库列表'},{value: 2, label: '出库列表'}]

                },

                tableData: [{

                }],
                materialName:[],
                currentRow: null,
                pagesize:10,
                currentPage:1,
                rules: {
                    category_id: [{required: true, message: '请选择专业', trigger: 'change'  }],
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

                }

        },
        watch:{

            //切换项目时候发生
            project_id(newData,oldData){

                this.project_id=newData;

            }

        },
        created(){

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

                // 材料名称
                const param={method:"material_name",project_id:this.project_id,style_id:this.form.style_id};
                getCostMgtInfoList(param).then(res=>{

                    //去重
                    this.materialName=this.unique(res.data)

               });
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
                        this.loading =true;

                        this.form.project_id=this.project_id;
                        this.form.method = "meterial_remain_list";
                        getCostMgtInfoList(this.form).then(res=>{
                            this.tableData=[{}];
                        })

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });


                this.loading = false
            },

            handleCurrentChange(val) {
                this.currentRow = val;
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
