<style lang="scss">
  @import "./ryxxForm";

</style>
<template>
  <div class="ryxx-from">
    <div class="order">
      <span class="txt">入职信息</span>
      <span class="line"></span>
    </div>
    <el-row :gutter="24">
      <el-col :span="12" style="text-align: center;padding-left: 30px;">
        <div><img src="/static/photo_no.jpg" style="height:120px;" /></div>
        <div>(证件照)</div>
      </el-col>
      <el-col :span="12" style="text-align: center;padding-right: 30px;">
        <div><img src="/static/photo_vip.jpg" style="height:120px;" /></div>
        <div>(入职照)</div>
      </el-col>
    </el-row>
    <el-row :gutter="24" style="padding-top:20px;">
      <el-col :span="8" style="text-align: left;">姓名：{{personInfoDialog.person.name}}</el-col>
      <el-col :span="8" style="text-align: left;">部门：技术部</el-col>
      <el-col :span="8" style="text-align: left;">工种：木工</el-col>
    </el-row>
    <el-row :gutter="24" style="padding-top:20px;">
      <el-col :span="24" style="text-align: left;">身份证：510107190000000000</el-col>
    </el-row>
    <div class="order" style="margin-top: 10px;">
      <span class="txt">入职资料</span>
      <span class="line"></span>
    </div>
    <el-row class="rzzl-table" :gutter="24" style="padding-top:20px;">
      <el-table :data="tableData3" height="130" border style="width: 100%" @row-click="RowClick">
        <el-table-column prop="name" label="类型" width="60">
        </el-table-column>
        <el-table-column prop="date" label="数量">
        </el-table-column>
        <el-table-column prop="address" label="最后上传时间">
        </el-table-column>
        <el-table-column prop="gongzong" label="操作">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row :gutter="24" style="padding-top:20px;">
      <el-button type="success" style="float: right;" @click.native.prevent="handleSubmit">确定</el-button>
    </el-row>
    <el-dialog v-el-drag-dialog :modal="false" custom-class="upload-form-dialog" width="380px" top="8vh" :lock-scroll="true"
      :close-on-click-modal="false" :visible.sync="dialogUploadVisible" title="上传信息" >
      <UploadForm></UploadForm>
    </el-dialog>
  </div>

</template>

<script>
  import moment from 'moment'
  import UploadForm from './uploadForm'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  export default {
    components: {
      UploadForm
    },
    directives: {
      elDragDialog
    },
    computed: {
      personInfoDialog() {
        return this.$store.state.project.personInfoDialog
      }
    },
    data() {
      return {
        dialogUploadVisible:false,
        tableData3: [{
          "id": "1",
          date: '18111111111',
          name: '合同资料',
          address: '技术部'
        }, {
          date: '18111111111',
          name: '技术交底',
          address: '技术部'
        }, {
          date: '18111111111',
          name: '安全交底',
          address: '技术部'
        }]
      }
    },
    created: function () {


    },
    methods: {
      RowClick(row, event, column) {
        console.log(row);
        this.dialogUploadVisible = true;
      },
    },
    mounted() {

    }
  }

</script>
