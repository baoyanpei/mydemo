<style lang="scss">
@import './meterDianOld.scss';
</style>

<template>
  <div class="screen-meter-dian-old">
    <div v-if="device_id === null" class="noMeterDianTips">{{noMeterDianTips}}</div>
    <div v-if="device_id !== null" class="data-area">
      <!-- <div class="label">当前电表读数</div> -->
      <div class="total-used">
        <div class="item-box">{{total_used[0]}}</div>
        <div class="item-box">{{total_used[1]}}</div>
        <div class="item-box">{{total_used[2]}}</div>
        <div class="item-box">{{total_used[3]}}</div>
        <div class="item-box">{{total_used[4]}}</div>
        <div class="item-box">{{total_used[5]}}</div>
      </div>
      <div class="total-today-label">今日用电量</div>
      <div class="total-today">{{total_today}} 度</div>
    </div>
    <!-- <div v-if="device_id !== null">
      <echart ref="echarts-shuibiao" :options="option" class="echarts-shuibiao" theme="infographic"
        style="width:100%;height: 170px;">
      </echart>
    </div>-->
  </div>
</template>
<script>
import lodash from 'lodash'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      noMeterDianTips: '',
      project_id: null,
      device_id: null, //YD10000SB03, YD10000DB01
      total_used: '',
      total_today: '',
      option: {
        title: {
          // text: '进场人员走势'
        },

        grid: {
          left: '3%',
          right: '3%',
          bottom: '3%',
          top: 5,
          height: 140,
          // borderWidth: 1,
          // borderColor: '#ccc',
          containLabel: true
        },
        legend: {
          show: true,
          bottom: 0,
          itemHeight: 4,
          data: ['最近7小时用电'],
          align: 'left',
          // align: 'right',
          // right: 30,
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
            color: '#ffc297'
          },
          axisLine: {
            lineStyle: {
              color: '#ffc297'
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#ffc297'
            }
          }
        },
        yAxis: {
          type: 'value',
          splitNumber: 4,
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#ffc297'],
              type: 'solid'
            }
          },
          axisLabel: {
            color: '#ffc297'
          },
          axisLine: {
            lineStyle: {
              color: '#ffc297'
            }
          },
          axisTick: {
            show: false,
            lineStyle: {
              color: '#34716c'
            }
          }
        },
        series: [
          {
            name: '最近7小时用电',
            data: [],
            type: 'bar',
            smooth: false,
            center: ['10%', '10%'],
            symbol: 'circle',
            symbolSize: 10,
            barWidth: 8,
            itemStyle: {
              color: '#ffc297'
            },
            lineStyle: {
              color: '#ffc297'
            }
          }
        ]
      }
    }
  },
  props: {},
  computed: {},
  created() {},
  watch: {},
  mounted() {
    // this.getAllData()
    // this.refreshData()
  },
  destroyed() {},
  methods: {
    init(project_id, datumMeterMap) {
      this.project_id = project_id

      datumMeterMap.forEach(datum => {
        if (this.device_id === null) {
          if (
            datum.device_type === 10 &&
            datum.total_used !== null &&
            datum.total_used !== ''
          ) {
            // this.cameraURList.push(datum)
            this.device_id = datum.device_id
            this.getAllData()
            this.refreshData()
          }
        }
      })
      if (this.device_id === null) {
        this.noMeterDianTips = '无电表数据'
      }
      // this.getAllData()
      // this.refreshData()
    },
    getAllData() {
      this.getCurrentData()
      this.getTodayHoursData()
      this.getLastHoursData()
    },
    getCurrentData() {
      const param = {
        method: 'devlist',
        project_id: this.project_id,
        device_id: this.device_id
      }
      this.$store
        .dispatch('QueryDatumMeter', param)
        .then(MeterData => {
          console.log('MeterData', MeterData)
          if (MeterData.length > 0) {
            this.total_used = MeterData[0].total_used
          }
          this.total_used = this.FillZero(parseInt(this.total_used).toString())
        })
        .catch(e => {
          console.log(e)
        })
    },
    FillZero(p) {
      return new Array(6 - (p + '').length + 1).join('0') + p
    },
    getTodayHoursData() {
      const _param = {
        method: 'query_hours',
        project_id: this.project_id,
        meter_id: this.device_id,
        bt: moment().format('YYYY-MM-DD 00:00:00'),
        et: moment().format('YYYY-MM-DD 23:59:59') //HH:mm:ss
      }
      this.total_today = 0
      this.$store.dispatch('QueryDatumMeterHours', _param).then(dataList => {
        //   console.log('QueryDatumMeterHours', dataList)
        dataList.forEach(hourData => {
          if (hourData.used !== '') {
            this.total_today = this.total_today + hourData.used
          }
        })
        this.total_today = this.total_today.toFixed(2)
      })
    },
    getLastHoursData() {
      this.option.xAxis.data = []
      this.option.series[0].data = []

      const _param = {
        method: 'query_hours',
        project_id: this.project_id,
        meter_id: this.device_id,
        bt: moment()
          .add('hours', -7)
          .format('YYYY-MM-DD HH:00:00'),
        et: moment()
          .add('hours', -1)
          .format('YYYY-MM-DD HH:59:59')
      }
      let btHH = parseInt(
        moment()
          .add('hours', -7)
          .format('H')
      )
      let etHH = parseInt(
        moment()
          .add('hours', -1)
          .format('H')
      )
      this.total_today = 0
      this.$store.dispatch('QueryDatumMeterHours', _param).then(dataList => {
        let _hourMap = new Map()
        dataList.forEach((item, index) => {
          // this.option.xAxis.data.push(moment(item.hour, 'YYYYMMDDHHMM').format('HH'))
          let _h = moment(item.hour, 'YYYYMMDDHHMM').format('H')
          _hourMap.set(_h, item)
          // this.option.series[0].data.push(used)
          // loading.close();
        })
        console.log('_hourMap', _hourMap)
        for (let i = btHH; i <= etHH; i++) {
          this.option.xAxis.data.push(i)
          let _hourData = _hourMap.get(i.toString())
          if (_hourData !== undefined) {
            let used = _hourData.used
            if (used === '') {
              used = 0
            }
            this.option.series[0].data.push(used)
          } else {
            this.option.series[0].data.push(0)
          }
        }
      })
    },
    refreshData() {
      setTimeout(() => {
        this.getAllData()
        this.refreshData()
        // console.log('getVehicleGateData')
      }, 120 * 1000)
    }
  }
}
</script>
