<style lang="scss">
  @import "./index";

</style>
<template>
  <div class="worktime-container" style="margin: 0px;">
    <el-row :gutter="10">
      <el-col :span="4">
        <div class="grid-content bg-purple" style="border-right:1px solid #eeeeee; padding: 5px;min-height:500px">
          <el-row type="flex" class="row-bg">
            <el-menu default-active="2" active-text-color="#FFFFFF" class="el-menu-vertical-demo">
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">考勤统计</span>
              </el-menu-item>
              <el-menu-item index="3" disabled>
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
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">

        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },

    },
    watch: {
      // project_id(curVal, oldVal) {
      //   if (curVal !== null) {
      //     this.reloadData()
      //   }
      // },
    },
    mounted() {

    },

    methods: {

    }

  };

</script>
