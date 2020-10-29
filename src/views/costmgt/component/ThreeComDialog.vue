<template>
 <div>
    <el-dialog :title="title" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="padding:45px">
        <el-form-item :label="itemTitle" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" placeholder="请输入公司名称"  style="width:400px"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">提 交</el-button>
      </div>
    </el-dialog>
 </div>
</template>

<script>


    export default {
        name:'ThreeComDialog',
        data() {

            return {
                title:undefined,
                itemTitle:undefined,
                form:{},
                dialogFormVisible:false,
                formLabelWidth:100
            }
        }
    }
</script>

<style>
.dialog-footer{text-align: center}
</style>
