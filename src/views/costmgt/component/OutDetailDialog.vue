<template>
 <div>
    <el-dialog :title="title" :visible.sync="dialogDetailVisible" v-if="dialogDetailVisible" width=70% :before-close="closeDialog">
      <el-table
        v-loading="loading"
        :data="tableDetailData"
        highlight-current-row
        show-summary
        stripe="true"
        border="true"
        @current-change="handleCurrentChange"
        height='550'
        >
        <el-table-column
          fixed
          label="序号"
          width="50">
          <template slot-scope="scope">
            <span v-show="scope.row.code">{{scope.$index+1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          property="item_id"
          label="ID"
          width="80">
        </el-table-column>
        <el-table-column
          property="material_name"
          v-if="false"
          label="材料类别"
          width="100">
        </el-table-column>
        <el-table-column
          property="material_name"
          label="材料名称"
          width="130">
        </el-table-column>
        <el-table-column
          property="model"
          label="规格型号"
          width="140">
        </el-table-column>
        <el-table-column
          property="unit"
          label="单位"
          width="80">
        </el-table-column>
        <el-table-column
          property="number"
          label="数量"
          width="120">
        </el-table-column>
        <el-table-column
          property="invoice"
          label="发票"
          width="80">
        </el-table-column>
        <el-table-column
          property="taxrate"
          label="税率"
          width="100">
        </el-table-column>
        <el-table-column
          property="taxprice"
          label="含税单价(元)"
          width="180">
        </el-table-column>
        <el-table-column
        property="taxcount"
        label="含税小计(元)"
        width="180">
      </el-table-column>
        <el-table-column
          property="price"
          label="不含税单价(元)"
          width="180">
        </el-table-column>
        <el-table-column
          property="prices"
          label="不含税小计(元)"
          width="180">
        </el-table-column>
        <el-table-column
          property="taxamou"
          label="税额(元)"
          width="130">
        </el-table-column>
        <el-table-column
          property="use"
          label="用途"
          width="120">
        </el-table-column>
        <el-table-column
          property="desc"
          label="备注"
          width="130">
        </el-table-column>

      </el-table>
    </el-dialog>
 </div>
</template>

<script>


    export default {
        name:'outDetailDialog',
        data() {

            return {

                title:undefined,
                tableDetailData: [{}],
                dialogDetailVisible:false,
                currentRow:undefined,
                loading:false
            }
        },
        methods:{

            handleCurrentChange(val) {
                this.currentRow = val;
            },
            closeDialog(){

                this.tableDetailData=[{}];
                this.dialogDetailVisible=false;
            }
        }

    }
</script>

<style>

</style>
