<style lang="scss">
  @import "./positionPictureSaveDialog";

</style>
<template>

  <div id="position-picture-save-dialog" class="position-picture-save-dialog">
    <el-dialog :modal="true" :close-on-click-modal="false" width="800px" top="10vh" :lock-scroll="true"
      :visible.sync="PositionPictureSaveDialog.show" @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle"
      :title="dialogTitle" v-el-drag-dialog>
      <div class="oper-area">
        <el-button @click='handleSaveDialogCancel' size="mini">取 消</el-button>
        <el-button type="primary" :loading="loadingSaveViewPoint" @click="handleSaveDialogSubmit" size="mini">保 存</el-button>

      </div>
      <div id="position-picture-save-area" class="position-picture-save-area">

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
        dialogTitle: '编辑位置信息',
        loadingSaveViewPoint: false, // 保存视点按钮加载
        pointViewData: null
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
      PositionPictureSaveDialog: {
        get: function () {
          return this.$store.state.viewPoint.PositionPictureSaveDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.PositionPictureSaveDialog = newValue
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
        console.log('PositionPictureSaveDialog', this.PositionPictureSaveDialog)
      },
      handleSaveDialogCancel() {
        this.closeSaveDialogHandle()
      },
      closeSaveDialogHandle() {
        this.clearData()
        const param = {
          show: false,
        }
        this.$store.dispatch('ShowPositionPictureSaveDialog', param).then(() => {}).catch(() => {})
      },
      handleSaveDialogSubmit() {

      },
    }
  }

</script>
