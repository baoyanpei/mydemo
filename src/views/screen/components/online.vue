<style lang="scss">
  @import "./online.scss";

</style>

<template>
  <div class="screen-online">
    <echart ref="echarts-jcryzs" :options="option" class="echarts-jcryzs" theme="infographic" style="width:100%">
    </echart>
  </div>
</template>
<script>
  import lodash from 'lodash'
  import moment from 'moment'
  export default {
    components: {},
    data() {
      return {
        project_id: 10000,
        option: {
          title: {
            // text: '进场人员走势'
          },

          grid: {
            left: '3%',
            right: '5%',
            bottom: '3%',
            top: 35,
            height: 290,
            // borderWidth: 1,
            // borderColor: '#ccc',
            containLabel: true
          },
          legend: {
            data: ['在场人数'],
            // align: 'right',
            right: 30,
            textStyle: {
              color: '#FFFFFF'
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: [],
            splitLine: { // 竖分割线
              show: true,
              lineStyle: {
                color: ['#3c3825'],
                type: 'solid',
              }
            },
            axisLabel: {
              color: '#aaaaaa'
            },
            axisLine: { // 横 标尺线
              lineStyle: {
                color: '#d28a38'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#2b3a59'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: { // 横分割线
              show: false,
              lineStyle: {
                color: ['#2b3a59'],
                type: 'solid',
              }
            },
            axisLabel: {
              color: '#aaaaaa'
            },
            axisLine: { // 竖 标尺线
              show: true,
              lineStyle: {
                color: '#d28a38'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#2b3a59'
              }
            }
          },
          color: ['#ecad48', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            name: '在场人数',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 0,
            sampling: 'average',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0,
                  color: '#513407' // 0% 处的颜色
                }, {
                  offset: 0.8,
                  color: 'black' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              },
             
            },
            data: []


          }]
        }
      }
    },
    props: {

    },
    computed: {

    },
    created() {

    },
    watch: {

    },
    mounted() {

      // const sDate = moment().add('month', 0).format('YYYY-MM') + '-01'
      const sDate = moment().add('day', -30).format('YYYY-MM-DD 00:00:00')
      const eDate = moment().format('YYYY-MM-DD')

      const sTime = moment(sDate).format('YYYY-MM-DD 00:00:00')
      const eTime = moment(eDate).format('YYYY-MM-DD 23:59:59')

      const param = {
        // method: 'query_person_in_hours',
        project_id: this.project_id,
        bt: sTime,
        et: eTime
      }
      this.getData(param)
    },
    destroyed() {

    },
    methods: {
      getData(param) {
        // const loading = this.$loading({
        //   lock: true,
        //   text: '正在载入数据...',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(255, 255, 255, 0.7)',
        //   target: document.querySelector('.screen-online')
        // });
        const _param = {
          method: 'query_online_max',
          project_id: param.project_id,
          bt: param.bt,
          et: param.et
        }
        this.option.xAxis.data = []
        this.option.series[0].data = []
        this.$store.dispatch('QueryPersonOnlineMaxList', _param).then((dataList) => {
          dataList.forEach((item, index) => {
            this.option.xAxis.data.push(moment(item.date).format('MM-DD'))
            this.option.series[0].data.push(item.in_count)
            // loading.close();
          })
        })
      }
    },

  }

</script>
