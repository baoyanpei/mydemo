<style lang="scss">
  @import "./TJFXMenu";
  </style>
<template>
  <div class="grid-content bg-purple tjfx-menu" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
      <el-menu router :default-active="$route.path" active-text-color="#FFFFFF" class="el-menu-vertical-demo">
        <el-menu-item index="/yearsplan">
          <span slot="title">年计划</span>
        </el-menu-item>
        <el-menu-item index="/monthplan">
          <span slot="title">月计划</span>
        </el-menu-item>
        <el-menu-item index="/weeksplan">
          <span slot="title">周计划</span>
        </el-menu-item>
        <el-menu-item index="/dayplan">
          <span slot="title">日计划</span>
        </el-menu-item>
        <el-menu-item index="/constructionplan">
          <span slot="title">施工计划</span>
        </el-menu-item>
        <el-menu-item index="/newplan">
          <span slot="title">新增计划</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>
