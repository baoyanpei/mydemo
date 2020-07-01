<style lang="scss">
@import './meterShui.scss';
</style>

<template>
  <div class="screen-meter-shui">
    <div v-if="noMeterShuiTips !=='' " class="noMeterShuiTips">{{noMeterShuiTips}}</div>
    <div v-if="noMeterShuiTips ==='' && shuibiaoDataList.length>0" class="data-area">
      <div>
        <span class="device_name">{{device_name}}</span>
      </div>
      <div class="total-used">
        <div class="item-box">{{total_used[0]}}</div>
        <div class="item-box">{{total_used[1]}}</div>
        <div class="item-box">{{total_used[2]}}</div>
        <div class="item-box">{{total_used[3]}}</div>
        <div class="item-box">{{total_used[4]}}</div>
        <div class="item-box">{{total_used[5]}}</div>
      </div>
      <div class="total-today-label">今日用水量</div>
      <div class="total-today">{{total_today}} 吨</div>
      <el-row class="dot-page-list">
        <div
          v-for="(item,i) in shuibiaoDataList"
          :key="i"
          :class="{ 'marker_white': i!==currentIndex, 'marker': i===currentIndex }"
          @click="dotClick(i)"
        ></div>
      </el-row>
    </div>
  </div>
</template>
<script>
import lodash from 'lodash'
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      noMeterShuiTips: '',
      project_id: null,
      shuibiaoDataList: [],
      device_name: '水表',
      currentIndex: 0,
      total_used: '',
      total_today: 0,
      timerChangeData: null
    }
  },
  props: {},
  computed: {},
  created() {},
  watch: {},
  mounted() {},
  destroyed() {},
  methods: {
    async update(project_id, allDeviceConfigList) {
      this.project_id = project_id

      for (var i = 0; i < allDeviceConfigList.length; i++) {
        let device = allDeviceConfigList[i]
        if (device.device_type === 11) {
          const totalToday = await this.getTodayHoursData(device.device_id)
          device.total_today = totalToday
          //11 水表
          let hasDevice = false
          this.shuibiaoDataList.forEach(dianbiao => {
            if (device.device_id === dianbiao.device_id) {
              dianbiao = device
              hasDevice = true
            }
          })
          if (hasDevice === false) {
            this.shuibiaoDataList.push(device)
          }
        }
      }
      console.log('this.shuibiaoDataList', this.shuibiaoDataList)
      if (this.shuibiaoDataList.length === 0) {
        this.noMeterShuiTips = '无水表数据'
      } else {
        this.showData()
        if (this.timerChangeData === null) {
          this.changeIndex()
        }
      }
    },
    showData() {
      if (this.shuibiaoDataList.length > 0) {
        const currentDisplayData = this.shuibiaoDataList[this.currentIndex]
        this.device_name = currentDisplayData.device_name
        this.total_used = this.FillZero(
          parseInt(currentDisplayData.total_used).toString()
        )
        this.total_today = currentDisplayData.total_today
      }
    },
    changeIndex() {
      if (this.shuibiaoDataList.length > 1) {
        this.timerChangeData = setTimeout(() => {
          this.currentIndex = this.currentIndex + 1
          if (this.currentIndex === this.shuibiaoDataList.length) {
            this.currentIndex = 0
          }
          this.showData()
          this.changeIndex()
        }, 10 * 1000)
      }
    },
    FillZero(p) {
      return new Array(6 - (p + '').length + 1).join('0') + p
    },
    getTodayHoursData(device_id) {
      return new Promise((resolve, reject) => {
        const _param = {
          method: 'query_hours',
          project_id: this.project_id,
          meter_id: device_id,
          bt: moment().format('YYYY-MM-DD 00:00:00'),
          et: moment().format('YYYY-MM-DD 23:59:59') //HH:mm:ss
        }
        let _totalToday = 0
        this.$store.dispatch('QueryDatumMeterHours', _param).then(dataList => {
          //   console.log('QueryDatumMeterHours', dataList)
          dataList.forEach(hourData => {
            if (hourData.used !== '') {
              _totalToday = _totalToday + hourData.used
            }
          })
          _totalToday = _totalToday.toFixed(2)

          console.log('_totalToday_totalToday', _totalToday)
          resolve(_totalToday)
        })
      })
    },
    dotClick(index) {
      this.currentIndex = index
      this.showData()
    }
  }
}
</script>
