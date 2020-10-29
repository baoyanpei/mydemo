<template>
 <div  class="filter-container">
   <el-table
     v-loading="outItemLoading"
     v-if="outShowItem"
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
       property="invoice"
       label="发票"
       width="90">
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
       property="user_name"
       label="出库人"
       width="120">
     </el-table-column>
     <el-table-column
       property="out_time"
       label="出库时间"
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
        name:'OutputItem',
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
            outItemLoading(){

                return this.parents.outItemLoading;
            },
            outShowItem(){

                return this.parents.outShowItem;
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
