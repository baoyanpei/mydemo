<style lang="scss">
  @import "./worktimeFullCalendarDialog";

</style>
<template>
  <div class="worktime-fullcalendar-dialog">
    <div id="worktime-full-calender" class="worktime-full-calender">
      <div id="worktime-fullcalender"></div>
    </div>

  </div>

</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import 'fullcalendar/dist/locale/zh-cn'
  import $ from 'jquery'
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      worktimeFullCalendarDialog: {
        get: function () {
          return this.$store.state.project.worktimeFullCalendarDialog
        },
        set: function (newValue) {
          this.$store.state.project.worktimeFullCalendarDialog = newValue
        }
      }

    },
    data() {

      return {

      }
    },
    created: function () {


    },
    watch: {
      worktimeFullCalendarDialog: {
        handler: function (newVal, oldVal) {
          console.info('value changed ', newVal)
          if (newVal.show === false) {
            $("#worktime-fullcalender").fullCalendar('destroy'); //销毁日历
          } else {
            this.renderFullCalender()
          }

        },
        deep: true
      },
    },
    methods: {
      // 打开窗口
      openWorktimeFullCalendarDialogHandle() {},

      initData() {


      },
      renderFullCalender() {
        // console.log("renderFullCalenderrenderFullCalender")
        $('#worktime-fullcalender').fullCalendar({
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
            console.log(start, end, timezone, callback)
            this.getFullCal(start, end, timezone, callback);
            // console.log(start, end)

            // $(".fc-time").html("2");
          },
          // dayClick: function (date, allDay, jsEvent, view) {

          //   return false;
          // },
          // timeFormat: 'HH:mm{ - HH:mm}',
          eventClick: (event) => {
            // console.log('this.worktimeFullCalendarDialog', this.worktimeFullCalendarDialog)
            const param = {
              show: true,
              bt: event.start.format('YYYY-MM-DD 00:00:00'),
              et: event.start.format('YYYY-MM-DD 23:59:59'), //HH:mm:ss
              ...this.worktimeFullCalendarDialog
            }
            // console.log('param', param)
            this.$store.dispatch('SetPersonInoutDetailDialog', param).then(() => {}).catch(() => {

            })
            return false;
          },
          // loading: function (bool) {},

        });
      },
      getFullCal(start, end, timezone, callback) {
        const _start = start.format('YYYY-MM-DD')
        const _end = end.format('YYYY-MM-DD')
        console.log("ccc->", _start, _end)

        const param = {
          method: 'query_person_worktime',
          project_id: this.project_id,
          person_id: this.worktimeFullCalendarDialog.person_id,
          bt: _start,
          et: _end
        }
        let events = [];
        this.loading = this.$loading({
          // lock: true,
          // text: '正在读取数据...',
          // spinner: 'el-icon-loading',
          // background: 'rgba(0, 0, 0, 0.5)',
          // customClass: 'loading-class',
          target: document.querySelector('.worktime-full-calender')
        });

        this.$store.dispatch('queryPersonWorktime', param).then((personWorktimeList) => {
          this.loading.close();
          // console.log("this.personOnlineMaxList", this.personOnlineMaxList)
          personWorktimeList.forEach((item, index) => {
            // console.log('item', item)
            item.start = item.date + " 00:00:00"
            // item.end = item.date + " 23:59:59"
            item.title = "入场人数" + item.in_count
            item.titleFormat = ""

            item.worktime = 0 // 工作时长 大于1小时 显示1.00小时 小于1小时 显示 分钟
            item.worktimeName = ""// 1 分钟 2小时
            let work_seconds = item.work_seconds
            if (work_seconds !== undefined) {
              const _hours = work_seconds / 60 / 60
              if (_hours>1){
                item.worktime = _hours.toFixed(1)
                item.worktimeName = "小时"
              }else{
                const _minutes = work_seconds / 60
                item.worktime = _minutes.toFixed(0)
                item.worktimeName = "分钟"
              }
              
              // person.worktime = worktime
            } 
            // item.worktime = parseFloat(person.worktime)


            events.push({
              title: "进场时间:" + moment(item.in_time).format('HH:mm:ss'),
              start: moment(item.in_time).format('YYYY-MM-DD 00:00:00'),
              backgroundColor: "#4a86e8", //red
              borderColor: "#4a86e8", //red
              titleFormat: ""
            })
            events.push({
              title: "最后出场:" + moment(item.out_time).format('HH:mm:ss'),
              start: moment(item.out_time).format('YYYY-MM-DD 00:00:01'),
              backgroundColor: "#29bb9c", //red
              borderColor: "#29bb9c", //red
              titleFormat: ""
            })
            events.push({
              title: `工作时长:${item.worktime}${item.worktimeName}`,
              start: moment(item.out_time).format('YYYY-MM-DD 00:00:03'),
              backgroundColor: "#fc6720", //red
              borderColor: "#fc6720", //red
              titleFormat: ""
            })
            /*
            in_count: 135 // 今天一天
            online_count: 126 //最大同时峰值
            start: "2018-09-21 00:00:00"
            title: "入场人数135"
            titleFormat: ""
            total_count: 571 // 进出次数
            */
            // item.rendering = 'background'
            // item.allDay = true
            //1,2,3,4,5
          })

          callback(events);
          // console.log("111")

        }).catch(() => {
          //   this.loading = false
        })
      }

    },
    mounted() {

      this.renderFullCalender()
    }
  }

</script>
