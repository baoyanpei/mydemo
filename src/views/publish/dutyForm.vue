<style lang="scss">
  @import "./dutyForm";

</style>
<template>
  <div id="duty-form" class="duty-form">
    <el-form ref="dustForm" label-width="80px" :inline="true">
      <div class="table-title">值班人员：
        <el-button type="success" class="btnDutySuubmit" :loading="loading" @click.native.prevent="handleMsgSubmit()" size="mini">确定修改
        </el-button>
      </div>
      <el-table :data="dutyDataList" border style="width: 100%" size="mini" :show-header="true"
        header-align="center">
        <el-table-column property="weekName"  label="日期"  header-align="center">
        </el-table-column>
        <el-table-column label="姓名" header-align="center">
        </el-table-column>

        </el-table-column>
      </el-table>


    </el-form>
  </div>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'

  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    filters: {

    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
    },
    data() {
      return {
        loadingInstance: null,
        loading: false,
        dutyDataList: [{
          weekName: '星期一'
        },{
          weekName: '星期二'
        },{
          weekName: '星期三'
        },{
          weekName: '星期四'
        },{
          weekName: '星期五'
        },{
          weekName: '星期六'
        },{
          weekName: '星期日'
        }]
      }
    },
    created: function () {


    },
    watch: {

    },
    methods: {
      handleMsgSubmit() {
        this.$confirm('是否确定修改值班人员?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info',
          // center: true
        }).then(() => {


        }).catch(() => {

        });
      },
    },
    mounted() {

    }
  }

</script>
