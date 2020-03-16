<style lang="scss">
  @import "./saveDialog";

</style>
<template>

  <div id="positon-view-point-manage-dialog" class="positon-view-point-manage-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="400px" top="10vh" :lock-scroll="true"
      :visible.sync="PositionViewPointManageDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <div id="view-point-save-from" class="view-point-save-from">

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit">确 定</el-button>
        <el-button @click='handleSaveDialogCancel'>取 消</el-button>

      </div>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '位置标定',
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
      PositionViewPointManageDialog: {
        get: function () {
          return this.$store.state.viewPoint.PositionViewPointManageDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.PositionViewPointManageDialog = newValue
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

      },
      async openedSaveDialogHandle() {

      },
      closeSaveDialogHandle() {
        this.clearData()
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowPositionViewPointSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleSaveDialogSubmit() {

      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
      },
    }
  }

</script>
