<style lang="scss">
  @import "./dianbiao.scss";

</style>

<template>
  <div class="screen-dianbiao">
    <echart ref="echarts-dianbiao" :options="option" class="echarts-dianbiao" theme="infographic" style="width:100%">
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
            top: 5,
            height: 110,
            // borderWidth: 1,
            // borderColor: '#ccc',
            containLabel: true
          },
          legend: {
            show: false,
            data: ['电表数据'],
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
              color: '#d28a38'
            },
            axisLine: {
              lineStyle: {
                color: '#7c684e'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#34716c'
              }
            }
          },
          yAxis: {
            type: 'value',
            splitNumber: 4,
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#7c684e'],
                type: 'solid',
              }
            },
            axisLabel: {
              color: '#d28a38'
            },
            axisLine: {
              lineStyle: {
                color: '#7c684e'
              }
            },
            axisTick: {
              show: false,
              lineStyle: {
                color: '#34716c'
              }
            }
          },
          color: ['#fcbe70', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            name: '电表数据',
            data: [],
            type: 'bar',
            smooth: true,
            center: ['10%', '10%'],
            barWidth: 10,
            itemStyle: {
              color: '#fcbe70',
              //柱形图圆角，鼠标移上去效果，如果只是一个数字则说明四个参数全部设置为那么多
              emphasis: {
                barBorderRadius: 30
              },

              normal: {
                //柱形图圆角，初始化效果
                barBorderRadius: [10, 10, 0, 0],
                label: {
                  show: false, //是否展示
                  textStyle: {
                    fontWeight: 'bolder',
                    fontSize: '12',
                    fontFamily: '微软雅黑',
                  }
                }
              }

            },
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
      // const sDate = moment().add('day', -30).format('YYYY-MM-DD')
      // const eDate = moment().format('YYYY-MM-DD')

      // const sTime = moment(sDate).format('YYYY-MM-DD 00:00:00')
      // const eTime = moment(eDate).format('YYYY-MM-DD 23:59:59')

      const param = {
        project_id: this.project_id,
        // bt: sTime,
        // et: eTime
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
        //   target: document.querySelector('.echart-dianbiao-container')
        // });
        const _param = {
          method: 'query_days',
          project_id: param.project_id,
          meter_id: 'YD10000DB01',
          month: moment().format('YYYYMM') //'201904'
        }
        this.option.xAxis.data = []
        this.option.series[0].data = []
        this.$store.dispatch('QueryDatumMeterDays', _param).then((dataList) => {
          //   console.log('dataList', dataList)
          dataList.forEach((item, index) => {
            this.option.xAxis.data.push(moment(item.day).format('DD'))
            let used = item.used
            if (used === '') {
              used = 0
            }
            this.option.series[0].data.push(used)
            // loading.close();
          })
        })
      }
    },

  }

</script>
