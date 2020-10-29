<template>
 <div  class="filter-container">
      <el-table
        v-loading="outSumLoading"
        v-if="outShowSum"
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
          property="prices"
          label="总金额"
          width="120">
        </el-table-column>
        <el-table-column
          property="taxamous"
          label="总税额"
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
          label="明细表"
          width="100">
          <template slot-scope="scope">
            <el-button v-if="scope.row.code" size="mini" type="primary" @click="queryDetail(scope.$index, scope.row)">明细表</el-button>
          </template>
        </el-table-column>
      </el-table>
 </div>
</template>

<script>
    export default {
        name:'outputSum',
        data() {

            return {

            }
        },
        computed:{

            parents(){

                return this.$parent.$parent.$parent;
            },
            tableData(){

               return this.parents.tableData

            },
            outSumLoading(){

                return this.parents.outSumLoading;
            },
            outShowSum(){

                return this.parents.outShowSum;
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
