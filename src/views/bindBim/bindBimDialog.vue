<style lang="scss">
  @import "./bindBimDialog";

</style>
<template>

  <div id="bind-bim-dialog" class="bind-bim-dialog">
    <el-dialog :modal="false" width="400px" top="10vh" :lock-scroll="true" :visible.sync="BindBimDialog.show"
      @opened="openedDialogHandle" @close="closeDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      <div style="margin: 10px;">关联码</div>
      <el-input v-model="bimCode" placeholder="请输入关联码"></el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click='handleDialogCancel'>取 消</el-button>
        <el-button type="primary" :loading="loadingBindBim" @click="handleDialogSubmit">确 定</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>
  import {
    getToken
  } from '@/utils/auth'
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '请输入关联码',
        bimCode: "",
        loadingBindBim: false
      }
    },
    computed: {
      project_id: {
        get: function () {
          return this.$store.state.project.project_id
        },
        set: function (newValue) {
          this.$store.state.project.project_id = newValue
        }
      },
      BindBimDialog: {
        get: function () {
          return this.$store.state.bindBim.BindBimDialog
        },
        set: function (newValue) {
          this.$store.state.bindBim.BindBimDialog = newValue
        }
      },
    },
    props: {

    },
    created: function () {

    },
    mounted() {

    },
    watch: {

    },
    methods: {
      openedDialogHandle() {
        console.log('BindBimDialog', this.BindBimDialog)

      },
      closeDialogHandle() {
        // this.clearData()
        // const param = {
        //   show: false,
        // }
        // this.$store.dispatch('ShowViewPointSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleDialogSubmit() {

      },
      handleDialogCancel() {
        this.closeDialogHandle()
      },
      closeDialogHandle() {
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowBindBimDialog', param).then(() => {}).catch(() => {})
      }
    }
  }

</script>
