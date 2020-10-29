<template>
  <div class="grid-content bg-purple mgt-menu" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
    <el-row type="flex" class="row-bg">
      <el-menu
         router
         :default-active="$route.path"
         text-color="#000000"
         active-text-color="#FFFFFF"
         class="el-menu-vertical-demo">
        <el-menu-item index="/costmgt/input">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">材料入库</span>
        </el-menu-item>
        <el-menu-item index="/costmgt/output">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">材料出库</span>
        </el-menu-item>
        <el-menu-item index="/costmgt/queryCost">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">材料查询</span>
        </el-menu-item>
        <el-menu-item index="/costmgt/remainCost">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">库存查询</span>
        </el-menu-item>
        <el-menu-item index="costmgt/queryCost2">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">耗料查询</span>
        </el-menu-item>
        <el-menu-item index="costmgt/queryCost4">
          <font-awesome-icon icon="calendar-check" class="fa-icon"/>
          <span slot="title">三级账查询</span>
        </el-menu-item>
      </el-menu>
    </el-row>
  </div>
</template>


<style>
  .mgt-menu .el-menu-item.is-active {

    background-color: #33ba9c!important;
    border-radius: 5px!important;
  }

  .el-menu {
    border-right: solid 0px #e6e6e6;
    list-style: none;
    position: relative;
    margin: 0;
    padding-left: 0;
  }

  .el-menu-item {
    height: 46px;
    line-height: 46px;
  }

  .fa-icon{
    margin: 6px;
  }


</style>
