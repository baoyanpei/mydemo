<style lang="scss">
  @import "./personInOutDetailDialog";

</style>
<template>
  <div class="person-inout-detail-dialog">
    <el-dialog :modal="false" top="0.5vh" width="500px" :lock-scroll="true" :close-on-click-modal="false"
      @open="openPersonInOutDetailDialogHandle" :visible.sync="personInOutDetailDialog.show" :title="dialogTitle">
      <div id="person-inout-detail-form" class="person-inout-detail-form">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :type="activity.type" :icon="activity.icon"
            :key="index" placement="top">
            <!-- <el-card> -->
            <!-- {{activity.pic}} -->
            <div v-if="activity.direction===1" class="content1">{{activity.content}}</div>
            <div v-if="activity.direction===2" class="content2">{{activity.content}}</div>
            <div>
              <a v-if="activity.pic !==''" :href="activity.pic" target="_blank">
                <img :src="activity.pic" style="height:400px;" />
              </a>
            </div>

            <!-- </el-card> -->
          </el-timeline-item>
          <el-timeline-item></el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
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
        dialogTitle: '',
        activities: []

      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personInOutDetailDialog: {
        get: function () {
          return this.$store.state.project.personInOutDetailDialog
        },
        set: function (newValue) {
          this.$store.state.project.personInOutDetailDialog = newValue
        }
      },

    },
    created: function () {
      // this.src = pdf.createLoadingTask(this.src)
    },
    watch: {
      personInOutDetailDialog: {
        handler: function (newVal, oldVal) {
          //   console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            this.initData()
            this.initDialog()
            // this.getProjectPersonInfo()
            // this.getPersonDatum()
            // this.getPerson()
          } else {
            this.initData()
          }

        },
        deep: true
      },

    },
    methods: {
      // 打开窗口
      openPersonInOutDetailDialogHandle() {
        // console.log("----22222---")
      },

      initData() {
        this.dialogTitle = ''
        this.activities = []
      },
      initDialog() {
        this.dialogTitle = `${this.personInOutDetailDialog.name} ${this.personInOutDetailDialog.bt.substring(0,10)}`
        const param = {
          method: 'query_inout_detail',
          project_id: this.project_id,
          person_id: this.personInOutDetailDialog.person_id,
          bt: this.personInOutDetailDialog.bt, //开始时间 格式 2016 - 6 - 5 00: 00: 00
          et: this.personInOutDetailDialog.et, //结束时间 格式 2016 - 6 - 5 00: 00: 00
        }
        this.$store.dispatch('queryInOutDetail', param).then((data_list) => {
          data_list = lodash.orderBy(data_list, ['created_time', ], ['desc']);
          data_list.forEach(data => {
            if (data.direction === 1) {
              this.activities.push({
                // content: '进场时间：',
                type: 'primary',
                // icon: 'el-icon-more',
                content: `进场时间：${data.created_time.substr(10)}`,
                pic: data.pic,
                direction: data.direction
              })
            } else if (data.direction === 2) {
              this.activities.push({
                // content: '出场时间：',
                type: 'primary',
                // icon: 'el-icon-more',
                content: `出场时间：${data.created_time.substr(10)}`,
                pic: data.pic,
                direction: data.direction
              })
            }

          });
        })
      }
    },
    mounted() {


    }
  }

</script>
