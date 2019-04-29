<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="screen-index-container" style="margin: 0px;">
    <el-row>
      <div class="header"></div>
    </el-row>
    <el-row>
      <el-col :span="5">
        <div class="gate-area">
          <div class="title">
            <img src="/static/screen/title-bg1.png" class="bg" />
            <div class="text">门禁管理</div>
          </div>
          <div class="main">
            <GateArea ref="gateArea"></GateArea>
          </div>
        </div>
        <div class="inout-area">
          <div class="title">
            <img src="/static/screen/title-bg1.png" class="bg" />
            <div class="text">场内人员</div>
          </div>
          <div class="main">
            <Inout></Inout>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="lot-area">
          <div class="title">
            <img src="/static/screen/title-bg1.png" class="bg" />
            <div class="text">智慧工地</div>
          </div>
          <div class="main">
          </div>
        </div>
      </el-col>
      <el-col :span="5">

      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import $ from 'jquery'
  import GateArea from './components/gateArea'
  import Inout from './components/inout'
  export default {
    directives: {},
    name: 'Main',
    components: {
      GateArea,
      Inout
      // VueDragResize
    },
    data() {
      return {

      }
    },
    computed: {

    },
    created() {
      // this.mqttConnect()
    },
    watch: {

    },
    mounted() {},
    destroyed() {},
    methods: {

    }
  }

</script>
