<style lang="scss">
  @import "./TJFXMenu";
  </style>
<template>
  <div class="grid-content bg-purple tjfx-menu" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
      <el-menu router :default-active="$route.path" active-text-color="#FFFFFF" class="el-menu-vertical-demo">
        <el-menu-item index="/safety-inspection">
          <span slot="title">日常巡检</span>
        </el-menu-item>
        <el-menu-item index="/elebox">
          <span slot="title">配电箱巡检</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>
