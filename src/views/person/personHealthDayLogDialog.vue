<style lang="scss">
  @import "./personHealthDayLogDialog";

</style>
<template>
  <div class="person-health-day-log-dialog">
    <el-dialog :modal="true"  width="570px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonHealthDayLogDialogHandle" @close="closePersonHealthDayLogDialogHandle"
      :visible.sync="personHealthDayLogDialog.show" :title="title">
      <div class="person-health-from">
        <el-row v-if="personHealthDayLastList.length===0" :gutter="24">
          <div style="text-align: center;">没有体检记录</div>
        </el-row>
        <el-row v-for="info in personHealthDayLastList" :key="info.id" :gutter="24">
          <div class="title">· {{info.created_time|formatTime}} 体温记录</div>
          <div class="content">
            <span v-if="info.temp>=37.3" style="color:red;">体温：{{info.temp}}°C</span>
            <span v-if="info.temp<37.3">体温：{{info.temp}}°C</span>


            <span v-if="info.give_out_heat===1" style="color:red;">有发热</span>
            <span v-if="info.give_out_heat===0">无发热</span>

            <span v-if="info.cough===1" style="color:red;">有干咳等症状</span>
            <span v-if="info.cough===0">无干咳等症状</span>

            <span
              v-if="info.symptom!=='' && info.symptom!=='无上述症状'" style="color:red;">过去14天,有{{info.symptom}}等症状</span>

          </div>
        </el-row>
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
        title: "",
        personHealthDayLastList: []
      }
    },
    filters: {
      //局部过滤器
      formatTime: function (data) {

        return moment(data).format("HH:mm:ss")
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personHealthDayLogDialog: {
        get: function () {
          return this.$store.state.health.personHealthDayLogDialog
        },
        set: function (newValue) {
          this.$store.state.health.personHealthDayLogDialog = newValue
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
      personHealthDayLogDialog: {
        handler: function (newVal, oldVal) {
          console.info('value personHealthDayLogDialog ', newVal)
          if (newVal.show === true) {

            this.initData()
            this.getPersonHealthDayList()
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
      initData() {
        this.title = `${this.personHealthDayLogDialog.date} - ${this.personHealthDayLogDialog.person_name}`
      },
      clearData() {
        this.title = ""
        this.personHealthDayLastList = []
      },
      openPersonHealthDayLogDialogHandle() {
        console.log("----personHealthDayLogDialog---", this.personHealthDayLogDialog)
        // this.person_id = this.personHealthDayLogDialog.person_id
        // this.getPersonHealth()
      },
      closePersonHealthDayLogDialogHandle() {
        this.clearData()
      },
      getPersonHealthDayList() {
        const param = {
          method: 'person_health_day_list',
          project_id: this.project_id,
          person_id: this.personHealthDayLogDialog.person_id,
          page: 1,
          limit: 100,
          bt: this.personHealthDayLogDialog.date,
          et: this.personHealthDayLogDialog.date
        }

        this.$store.dispatch('GetPersonHealthDayList', param).then((personHealthDayLastList) => {
          console.log('GetPersonHealthDayList', personHealthDayLastList)
          this.personHealthDayLastList = personHealthDayLastList
        })
      }
    },
    mounted() {


    }
  }

</script>
