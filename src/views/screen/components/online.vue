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
            height: 300,
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
            
            axisLabel: {
              color: '#555555'
            },
            axisLine: {
              lineStyle: {
                color: '#2b3a59'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#2b3a59'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#2b3a59'],
                type: 'solid',
              }
            },
            axisLabel: {
              color: '#555555'
            },
            axisLine: {
              lineStyle: {
                color: '#2b3a59'
              }
            },
            axisTick: {
              lineStyle: {
                color: '#2b3a59'
              }
            }
          },
          color: ['#404bd7', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            name: '在场人数',
            data: [],
            type: 'line',
            smooth: true,
            center: ['10%', '10%'],
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

      const sDate = moment().add('month', 0).format('YYYY-MM') + '-01'
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
