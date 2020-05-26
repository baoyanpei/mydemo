<style lang="scss">
  @import "./TJFXMenu";
  </style>
<template>
  <div class="grid-content bg-purple tjfx-menu" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
      <el-menu router :default-active="$route.path" active-text-color="#FFFFFF" class="el-menu-vertical-demo">
        <el-menu-item index="/kqtj">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">考勤统计</span>
        </el-menu-item>
        <el-menu-item index="/carstatistical">
          <font-awesome-icon  icon="chart-line" class="fa-icon"/>
          <span slot="title">车辆进出厂统计</span>
        </el-menu-item>
        <el-menu-item index="/tjfx">
          <font-awesome-icon icon="chart-line" class="fa-icon"/>
          <span slot="title">统计分析</span>
        </el-menu-item>
        <!-- <el-menu-item index="/gzbsz">
          <font-awesome-icon icon="user" class="fa-icon"/>
          <span slot="title">工资表设置</span>
        </el-menu-item> -->
      </el-menu>
    </el-row>
  </div>
</template>
