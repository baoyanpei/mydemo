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
    <div v-if="hasDevice === false" class="noTJTdTip">{{noTJTdTip}}</div>
    <div v-if="hasDevice === true">
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">
            塔吊高度：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            {{tdData.tdgd}} 米
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">
            大臂角度：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            {{tdData.dbjd}} 度
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">
            小车距离：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            {{tdData.xcjl}} 米
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
          <div class="grid-content label">
            吊钩线长：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            {{tdData.dgxc}} 米
          </div>
        </el-col>
      </el-row>
      <el-row>

        <el-col :span="10">
          <div class="grid-content label">
            上报时间：
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            {{tdData.sbsj}}
          </div>
        </el-col>

      </el-row>
    </div>
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
        },
        noTJTdTip: '',
        hasDevice: true
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
        this.hasDevice = true

      },
      noDevice() {
        this.hasDevice = false
        this.noTJTdTip = '未配置塔机'
      }

    },
    watch: {

    },
    mounted() {
      //   console.log("persion_data.entry_pic", this.persion_data.entry_pic)

    }
  }

</script>
