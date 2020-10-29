<template>
 <div  class="filter-container">
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
 </div>
</template>

<script>
    export default {
        name:'InputItem',
        data() {

            return {

            }
        },
        computed:{

            parents(){

                return this.$parent.$parent.$parent;
            },
            tableData(){

               return  this.parents.tableData

            },
            itemLoading(){

                return this.parents.itemLoading;
            },
            showItem(){

                return this.parents.showItem;
            }

        },
        methods:{

            queryDetail(data,rows){

                return this.parents.queryDetail(data,rows);
            },
            //点击code 修改
            handleAdd(data,row){


            },
            //点击审批状态
            handleWorkFlow(data,rows){

            }

        }

    }
</script>

<style>

</style>
