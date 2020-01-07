<style lang="scss">
  @import "./saveDialog";

</style>
<template>

  <div id="view-point-save-dialog" class="view-point-save-dialog">
    <el-dialog :modal="false" width="300px" top="10vh" :lock-scroll="true" :visible.sync="ViewPointSaveDialog.show"
      @opened="openedSaveDialogHandle" @close="closeSaveDialogHandle" :title="dialogTitle" v-el-drag-dialog>
      123123

    </el-dialog>
  </div>

</template>

<script>
  export default {
    components: {},
    directives: {},
    data() {
      return {
        dialogTitle: '位置信息',
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
      ViewPointSaveDialog: {
        get: function () {
          return this.$store.state.viewPoint.ViewPointSaveDialog
        },
        set: function (newValue) {
          this.$store.state.viewPoint.ViewPointSaveDialog = newValue
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
      openedSaveDialogHandle() {
        this.tipMessage = "正在查询视点数据"
        // let dialogHeaderEl = document.getElementById("view-point-manage-dialog").querySelector('.el-dialog')
        // console.log('dialogHeaderEl', dialogHeaderEl)
        // dialogHeaderEl.style.cssText = `;right:500px !important;`
        console.log('ViewPointSaveDialog', this.ViewPointSaveDialog)

        // this.CurrentFileIDList = []
        // this.ViewPointManageDialog.itemInfoList.forEach(item => {
        //   this.CurrentFileIDList.push(item.FILE_ID)
        // })
        // this.getData()
      },
      closeSaveDialogHandle() {
        // this.clearData()
      },
    }
  }

</script>
