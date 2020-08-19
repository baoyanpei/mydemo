<style lang="scss">
  @import "./huiyiRili";

</style>
<template>
  <div class="huiyiRili">
    <full-calendar :events="events" ref="calendar" defaultView="month" :editable="false" @event-selected="eventSelected"
      @view-change="changeView"></full-calendar>
    <el-dialog v-if="dialogJDHYVisible" v-el-drag-dialog :modal="false" custom-class="jiaodi-dialog" width="400px" top="2vh"
      :lock-scroll="true" :close-on-click-modal="false" :visible.sync="dialogJDHYVisible" title="交底会议" @dragDialog="handleDrag">
      <JiaodiForm></JiaodiForm>
    </el-dialog>
  </div>
</template>

<script>
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import 'fullcalendar/dist/locale/zh-cn'
  import JiaodiForm from "./jiaodiForm"
  export default {
    name: 'huiyiRili',
    directives: {
      elDragDialog
    },
    components: {
      JiaodiForm
    },
    data() {
      return {
        dialogJDHYVisible: false,
        events: []
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      planList() {
        return this.$store.state.huiyi.planList
      },
      planListChange() {
        return this.$store.state.huiyi.planListChange
      }
    },
    watch: {
      planListChange(curVal, oldVal) {
        this.getPlanList()
      }
    },
    mounted() {
      this.getPlanList()
      // this.changeView('agendaDay')
    },
    methods: {
      eventSelected(event, jsEvent, view) {
        console.log(event)
        // console.log(jsEvent)
        // console.log(view)
        const _id = event.id

        const param = {
          method: 'query',
          project_id: this.project_id,
          id: _id,
          start_time: '1980-01-01',
          end_time: '2099-12-31'
        }
        this.$store.dispatch('PlanDetailQuery', param).then(() => {
          // this.events = this.planList
          this.dialogJDHYVisible = true
        }).catch(() => {
          //   this.loading = false
        })



      },
      handleDrag() {
        // console.log(this.ref.dialogJiaodi)
        // this.$refs.select.blur()
      },
      getPlanList() {
        const param = {
          method: 'query',
          project_id: this.project_id,
          start_time: '1980-01-01',
          end_time: '2099-12-31'
        }
        this.$store.dispatch('PlanListQuery', param).then(() => {
          console.log("this.planList", this.planList)
          this.events = this.planList

        }).catch(() => {
          //   this.loading = false
        })
      },
      next() {
        this.$refs.calendar.fireMethod('next')
      },
      changeView(view) {
        console.log('view', view)
        this.$refs.calendar.fireMethod('changeView', view)
      },
    }
  }

</script>
