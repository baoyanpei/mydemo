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
            123
          </div>
        </div>
      </el-col>
      <el-col :span="10">

      </el-col>
      <el-col :span="9">

      </el-col>
    </el-row>
  </div>
</template>

<script>
  // import $ from 'jquery'
  import GateArea from './components/gateArea'
  export default {
    directives: {},
    name: 'Main',
    components: {
      GateArea
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
    mounted() {
    },
    destroyed() {},
    methods: {

    }
  }

</script>
