<style lang="scss">
  @import "./fullCalender";

</style>
<template>
  <div id="person-full-calender" class="person-full-calender">
    <div id=person-fullcalender></div>
  </div>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import 'fullcalendar/dist/locale/zh-cn'
  import $ from 'jquery'

  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      personOnlineMaxList() {
        return this.$store.state.person.personOnlineMaxList
      },
      personFullCalenderDialog: {
        get: function () {
          return this.$store.state.project.personFullCalenderDialog
        },
        set: function (newValue) {
          this.$store.state.project.personFullCalenderDialog = newValue
        }
      }

    },
    data() {

      return {
        loadingInstance: null,
        loading: false,

        // list: []
      }
    },
    created: function () {


    },
    watch: {
      // loading(curVal, oldVal) {
      //   if (curVal === false) {} else {

      //   }
      // },
      personFullCalenderDialog: {
        handler: function (newVal, oldVal) {
          console.info('value changed ', newVal)
          if (newVal.show === false) {
            $("#person-fullcalender").fullCalendar('destroy'); //销毁日历
          } else {
            this.renderFullCalender()
          }

        },
        deep: true
      }


    },
    methods: {
      renderFullCalender() {
        // console.log("renderFullCalenderrenderFullCalender")
        $('#person-fullcalender').fullCalendar({
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
            this.getFullCal(start, end, timezone, callback);
            // console.log(start, end)

            // $(".fc-time").html("2");
          },
          // dayClick: function (date, allDay, jsEvent, view) {

          //   return false;
          // },
          // timeFormat: 'HH:mm{ - HH:mm}',
          eventClick: (event) => {
            // console.log('123', event, event.start.format('YYYY-MM-DD'))
            const param = {
              show: true,
              bt: event.start.format('YYYY-MM-DD 00:00:00'),
              et: event.start.format('YYYY-MM-DD 23:59:59') //HH:mm:ss
            }
            this.$store.dispatch('SetPersonNowInDialog', param).then(() => {}).catch(() => {

            })
            return false;
          },
          // loading: function (bool) {},

        });
      },
      getFullCal(start, end, timezone, callback) {
        const _start = start.format('YYYY-MM-DD')
        const _end = end.format('YYYY-MM-DD')
        // console.log("ccc->", _start, _end)

        const param = {
          method: 'query_online_max',
          project_id: this.project_id,
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
          target: document.querySelector('.person-full-calender')
        });

        this.$store.dispatch('QueryPersonOnlineMaxList', param).then(() => {
          this.loading.close();
          // console.log("this.personOnlineMaxList", this.personOnlineMaxList)
          this.personOnlineMaxList.forEach((item, index) => {
            // console.log('item', item)
            item.start = item.date + " 00:00:00"
            // item.end = item.date + " 23:59:59"
            item.title = "入场人数" + item.in_count
            item.titleFormat = ""
            events.push({
              title: "场内人员" + item.in_count,
              start: item.date,
              backgroundColor: "#4a86e8", //red
              borderColor: "#4a86e8", //red
              titleFormat: ""
            })
            events.push({
              title: "场内峰值" + item.online_count,
              start: item.date,
              backgroundColor: "#2cbc9d", //red
              borderColor: "#2cbc9d", //red
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
      // console.log("---------")
      this.renderFullCalender()


    }
  }

</script>
