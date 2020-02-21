<style lang="scss">
  @import "./personHealthDialog";

</style>
<template>
  <div class="person-health-dialog">
    <el-dialog :modal="false" top="13vh" width="770px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonFaceHealthDialogHandle" :visible.sync="personHealthDialog.show" :title="personHealthDialog.title">

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


      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personHealthDialog: {
        get: function () {
          return this.$store.state.health.personHealthDialog
        },
        set: function (newValue) {
          this.$store.state.health.personHealthDialog = newValue
        }
      },
      // personInfoChanged() {
      //   return this.$store.state.project.personInfoChanged
      // }

    },
    created: function () {

      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personHealthDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // this.initData()
            // this.getProjectPersonInfo()
            // this.getPersonDatum()

          } else {
            // this.initData()
          }

        },
        deep: true
      },
      // personInfoChanged(curVal, oldVal) {
      //   this.initData()
      //   this.getProjectPersonInfo()
      // },
    },
    methods: {
      openPersonFaceHealthDialogHandle() {
        // console.log("----22222---")
      },
    },
    mounted() {


    }
  }

</script>
