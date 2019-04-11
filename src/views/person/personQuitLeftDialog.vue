<style lang="scss">
  @import "./personQuitLeftDialog";

</style>
<template>
  <div class="person-info-dialog">
    <el-dialog :modal="false" top="0.5vh" width="400px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonQuitLeftDialogHandle" :visible.sync="personQuitLeftDialog.show" :title="dialogTitle">
      <div id="person-quit-left-form" class="person-quit-left-form">

      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  // import vpdf from 'vpdf'
  // import pdf from 'vue-pdf'
  // import vueshowpdf from 'vueshowpdf'
  export default {
    components: {
      // pdf
      // vueshowpdf
    },
    directives: {},

    data() {
      return {
        dialogTitle: ''
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personQuitLeftDialog: {
        get: function () {
          return this.$store.state.project.personQuitLeftDialog
        },
        set: function (newValue) {
          this.$store.state.project.personQuitLeftDialog = newValue
        }
      }

    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personQuitLeftDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            this.initData()
            //   this.getProjectPersonInfo()
            //   this.getPersonDatum()
          } else {
            this.initData()
          }

        },
        deep: true
      },
    },
    methods: {
      initData() {
        console.log('this.personQuitLeftDialog', this.personQuitLeftDialog)
        if (this.personQuitLeftDialog.op_status === 4) {
          this.dialogTitle = '开除 ' + this.personQuitLeftDialog.name
        }

      },
      // 打开窗口
      openPersonQuitLeftDialogHandle() {
        // console.log("----22222---")
      },

    },
    mounted() {


    }
  }

</script>
