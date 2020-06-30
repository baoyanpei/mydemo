<style lang="scss">
  @import "./index";

</style>
<template>
  <div v-on:mouseenter="mouseOver" v-on:mouseleave="mouseLeave" class="index-sidebar">

    <el-menu default-active="1-4-1" router :default-active="$route.path" class="el-menu-vertical-demo"
      @open="handleOpen" @close="handleClose" :collapse="isCollapse" :collapse-transition="collapseTransition"
      background-color="#29bb9c" text-color="#ffffff">
      <el-menu-item index="/main">
        <font-awesome-icon icon="home" />
        <span slot="title">首页</span>
      </el-menu-item>

      <el-menu-item index="/task">
        <font-awesome-icon icon="calendar-alt" />
        <span slot="title">任务列表</span>
      </el-menu-item>

      <el-menu-item index="/kqtj">
        <font-awesome-icon icon="chart-bar" />
        <span slot="title">统计分析</span>
      </el-menu-item>
      <!-- <el-menu-item index="/gztz">
        <font-awesome-icon icon="calendar-alt" />
        <span slot="title">工资台帐</span>
      </el-menu-item> -->
      <!-- <el-menu-item index="/lot/index">
        <font-awesome-icon icon="network-wired" />
        <span slot="title">物联设备</span>
      </el-menu-item> -->
      <el-menu-item index="/lot5/index">
        <font-awesome-icon icon="network-wired" />
        <span slot="title">物联设备</span>
      </el-menu-item>
      <el-menu-item index="/safety-inspection">
        <font-awesome-icon icon="calendar-check" style="width:16px;font-size: 18px;"/>
        <span slot="title">巡检管理</span>
      </el-menu-item>
      <el-menu-item index="/modelSelect/index">
        <font-awesome-icon icon="map-marked" />
        <span slot="title">BIM管理</span>
      </el-menu-item>
      <el-menu-item index="">
        <i class="el-icon-notebook-1"></i>
        <span slot="title">计划</span>
      </el-menu-item>
      <!--
      <el-menu-item index="/main1">
        <i class="el-icon-location"></i>
        <span slot="title">空间定位1</span>
      </el-menu-item>
      <el-menu-item index="/main2">
        <i class="el-icon-location"></i>
        <span slot="title">空间定位2</span>
      </el-menu-item>
      <el-menu-item index="/model3d/index">
        <i class="el-icon-location"></i>
        <span slot="title">BIM模型</span>
      </el-menu-item>
      <el-menu-item index="/main3">
        <i class="el-icon-share"></i>
        <span slot="title">实景建模</span>
      </el-menu-item>
      <el-menu-item index="/720yun01">
        <i class="el-icon-picture"></i>
        <span slot="title">实景漫游</span>
      </el-menu-item>
      <el-menu-item index="/720yun02">
        <i class="el-icon-picture"></i>
        <span slot="title">模型漫游</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">项目管控</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <i class="el-icon-setting"></i>
        <span slot="title">模板及标准</span>
      </el-menu-item>
      <el-menu-item index="4" disabled>
        <i class="el-icon-setting"></i>
        <span slot="title">项目数据</span>
      </el-menu-item>
      -->
    </el-menu>

    <!-- <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.name" :item="route" :base-path="route.path"/>
    </el-menu> -->
  </div>
</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import SidebarItem from './SidebarItem'

  export default {
    components: {
      SidebarItem
    },
    data() {
      return {
        // isCollapse: true,
        collapseTransition: false
      };
    },
    computed: {
      ...mapGetters([
        'permission_routers',
        'sidebar'
      ]),
      isCollapse() {
        return !this.sidebar.opened
      },
      sidebar() {
        return this.$store.state.app.sidebar
      },


    },
    methods: {
      mouseOver: function () {
        this.sidebar.opened = true
      },
      mouseLeave: function () {
        this.sidebar.opened = false
      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
        this.sidebar.opened = true
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
        this.sidebar.opened = faltruese
      }
    }
  }

</script>
