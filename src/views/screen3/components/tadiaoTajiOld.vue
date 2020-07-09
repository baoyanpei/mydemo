<style lang="scss">
@import './tadiaoTajiOld.scss';
</style>
<template>
  <div class="screen-tadiao-taji-old">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        <span>塔机数据</span>
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
        tdgd: '-',
        dbjd: '-',
        xcjl: '-',
        dggd: '-',
        sbsj: '-'
      },
      noTJTdTip: '',
      hasDevice: true
    }
  },
  props: {},
  filters: {
    //如下这样写
  },
  methods: {
    updateData(data, height) {
      this.tdData.tdgd = height
      this.tdData.dbjd = data.rotate // 回转
      this.tdData.xcjl = data.extent // 幅度  小车距离
      this.tdData.dggd = data.height // 吊钩高度
      this.tdData.sbsj = moment(data.created_time).format('HH:mm:ss')
      this.hasDevice = true
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
