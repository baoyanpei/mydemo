<style lang="scss">
  @import "./tadiaoTaji.scss";

</style>
<template>
  <div class="screen-tadiao-taji">
    <div class="bg-img">
      <!-- <img src="../../assets/tadiao.png"> -->
    </div>
    <el-row>
      <el-col :span="24" class="title">
        <span>塔机数据</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          塔吊高度：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{tdData.tdgd}} 米
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          大臂角度：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{tdData.dbjd}} 度
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          小车距离：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{tdData.xcjl}} 米
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="grid-content label">
          吊钩线长：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{tdData.dgxc}} 米
        </div>
      </el-col>
    </el-row>
    <el-row>

      <el-col :span="8">
        <div class="grid-content label">
          上报时间：
        </div>
      </el-col>
      <el-col :span="16">
        <div class="grid-content">
          {{tdData.sbsj}}
        </div>
      </el-col>

    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  const TOWER_HEIGHT = 75 //塔吊高度
  export default {
    components: {},
    data() {
      return {
        tdData: {
          tdgd: TOWER_HEIGHT,
          dbjd: '-',
          xcjl: '-',
          dgxc: '-',
          sbsj: '-'
        }
      }
    },
    props: {

    },
    filters: { //如下这样写

    },
    methods: {
      updateData(data) {
        this.tdData.dbjd = data.Angle
        this.tdData.xcjl = data.RRange
        this.tdData.dgxc = data.Height
        this.tdData.sbsj = moment(data.RTime).format("HH:mm:ss")

      },

    },
    watch: {

    },
    mounted() {
      //   console.log("persion_data.entry_pic", this.persion_data.entry_pic)

    }
  }

</script>
