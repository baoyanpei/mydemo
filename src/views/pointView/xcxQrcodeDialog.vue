<style lang="scss">
  @import "./xcxQrcodeDialog";

</style>
<template>

  <div id="xcx-qrcode-dialog" class="xcx-qrcode-dialog">
    <el-dialog :modal="false" :close-on-click-modal="false" width="400px" top="10vh" :lock-scroll="true"
      :visible.sync="ViewPointQrcodeDialog.show" @opened="openedDialogHandle" @close="closeDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      123
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
        dialogTitle: '',
        loadingSaveViewPoint: false, // 保存视点按钮加载

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
      ViewPointQrcodeDialog: {
        get: function () {
          return this.$store.state.viewPoint.ViewPointQrcodeDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.ViewPointQrcodeDialog = newValue
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
      clearData() {
        this.dialogTitle = ''

      },
      async openedDialogHandle() {
        console.log('ViewPointQrcodeDialog', this.ViewPointQrcodeDialog)
        let _name = this.ViewPointQrcodeDialog.name
        this.dialogTitle = '1111'
      },
      closeDialogHandle() {
        console.log('closeDialogHandle')
        this.clearData()
      },
    }
  }

</script>
