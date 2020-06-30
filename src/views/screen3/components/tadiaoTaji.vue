<style lang="scss">
@import './tadiaoTaji.scss';
</style>
<template>
  <div class="screen-tadiao-taji">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        <span>{{tdData.device_name}}数据</span>
      </el-col>
    </el-row>
    <div v-if="hasDevice === false" class="noTJTdTip">{{noTJTdTip}}</div>
    <div v-if="hasDevice === true">
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">塔吊高度：</div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">{{tdData.tdgd}} 米</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">大臂角度：</div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">{{tdData.dbjd}} 度</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">小车距离：</div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">{{tdData.xcjl}} 米</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">吊钩高度：</div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">{{tdData.dggd}} 米</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">上报时间：</div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">{{tdData.sbsj}}</div>
        </el-col>
      </el-row>
      <el-row class="dot-page-list">
        <div
          v-for="(item,i) in tdDataList"
          :key="i"
          :class="{ 'marker_white': i!==currentIndex, 'marker': i===currentIndex }"
          @click="dotClick(i)"
        ></div>
      </el-row>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  components: {},
  data() {
    return {
      tdData: {
        device_name: '塔机',
        tdgd: '-',
        dbjd: '-',
        xcjl: '-',
        dggd: '-',
        sbsj: '-'
      },
      tdDataList: [],
      noTJTdTip: '',
      hasDevice: true,
      currentIndex: 0,
      timerChangeData: null
    }
  },
  props: {},
  filters: {
    //如下这样写
  },
  methods: {
    init(tdDataList) {
      this.tdDataList = tdDataList
      if (this.timerChangeData === null) {
        this.showData()
        this.changeIndex()
      }
    },
    updateData(tdDataList) {
      // console.log('tdDataListtdDataList1111', tdDataList)
      this.tdDataList = tdDataList
      this.showData()
      // this.tdData.tdgd = height
      // this.tdData.dbjd = data.rotate // 回转
      // this.tdData.xcjl = data.extent // 幅度  小车距离
      // this.tdData.dggd = data.height // 吊钩高度
      // this.tdData.sbsj = moment(data.created_time).format('HH:mm:ss')
    },
    showData() {
      if (this.tdDataList.length > 0) {
        const currentDisplayData = this.tdDataList[this.currentIndex]
        const familyLocation = JSON.parse(currentDisplayData.family_location)
        const mqttData = currentDisplayData.mqttData
        if (mqttData !== '') {
          this.tdData.device_name = currentDisplayData.device_name
          this.tdData.tdgd = familyLocation.displayHeight
          this.tdData.dbjd = mqttData.rotate // 回转
          this.tdData.xcjl = mqttData.extent // 幅度  小车距离
          this.tdData.dggd = mqttData.height // 吊钩高度
          this.tdData.sbsj = moment(mqttData.created_time).format('HH:mm:ss')
        } else {
          this.tdData.device_name = currentDisplayData.device_name
          this.tdData.tdgd = familyLocation.displayHeight
          this.tdData.dbjd = '-' // 回转
          this.tdData.xcjl = '-' // 幅度  小车距离
          this.tdData.dggd = '-' // 吊钩高度
          this.tdData.sbsj = '-'
        }

        this.hasDevice = true
      }
    },
    changeIndex() {
      if (this.tdDataList.length > 1) {
        this.timerChangeData = setTimeout(() => {
          // this.showData()
          this.currentIndex = this.currentIndex + 1
          if (this.currentIndex === this.tdDataList.length) {
            this.currentIndex = 0
          }
          this.showData()
          this.changeIndex()
        }, 10 * 1000)
      }
    },
    dotClick(index) {
      this.currentIndex = index
      this.showData()
    },
    noDevice() {
      this.hasDevice = false
      this.noTJTdTip = '未配置塔机'
    }
  },
  watch: {},
  mounted() {
    //   console.log("persion_data.entry_pic", this.persion_data.entry_pic)
  }
}
</script>
