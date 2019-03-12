<style lang="scss">
  @import "./huiyiFullCalendar";

</style>
<template>
  <div class="huiyiFullCalendar">
    <div id=calendar></div>
  </div>
</template>

<script>
  import 'fullcalendar/dist/locale/zh-cn'
  import $ from 'jquery'
  export default {
    name: 'huiyiFullCalendar',
    components: {},
    data() {
      return {
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
        // this.getPlanList()
        $('#calendar').fullCalendar('refetchEvents')
      }
    },
    mounted() {
      // this.getPlanList()

      $('#calendar').fullCalendar({
        height: 500,
        header: {
          right: 'prev,next today',
          center: 'title',
          left: ''
        },
        theme: false,
        editable: false,
        allDaySlot: false,
        eventLimit: 100,
        events: (start, end, timezone, callback) => {
          // console.log(start, end)
          const param = {
            method: 'query',
            project_id: this.project_id,
            start_time: '1980-01-01',
            end_time: '2099-12-31'
          }
          this.$store.dispatch('PlanListQuery', param).then(() => {
            console.log("this.planList", this.planList)
            this.events = this.planList
            this.events.forEach((item, index) => {
              item.start = item.start + " 00:00:00"
              item.end = item.end + " 23:59:59"
              // item.allDay = true
              //1,2,3,4,5
            })

            callback(this.events);
          }).catch(() => {
            //   this.loading = false
          })
        },
        // dayClick: function (date, allDay, jsEvent, view) {

        //   return false;
        // },
        // timeFormat: 'HH:mm{ - HH:mm}',
        // eventClick: function (event) {

        //   return false;
        // },
        // loading: function (bool) {},




      });
    },
    methods: {

    }
  }

</script>
