<template>
  <div class="grid-content bg-purple" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
      <el-menu router :default-active="$route.path" active-text-color="#FFFFFF" class="el-menu-vertical-demo">
        <el-menu-item index="/kqtj">
          <i class="el-icon-menu"></i>
          <span slot="title">考勤统计</span>
        </el-menu-item>
        <el-menu-item index="/tjfx">
          <i class="el-icon-document"></i>
          <span slot="title">统计分析</span>
        </el-menu-item>
        <el-menu-item index="4" disabled>
          <i class="el-icon-setting"></i>
          <span slot="title">工资表设置</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>
