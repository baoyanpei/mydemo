<template>
    <div>
        <el-tabs :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="用户管理">用户管理</el-tab-pane>
          <el-tab-pane label="配置管理">配置管理</el-tab-pane>
          <el-tab-pane label="角色管理">角色管理</el-tab-pane>
          <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
  export default {
    name: 'index',
    data() {
        return {
          tabPosition: 'left'
        };
      },
      computed:{
        project_id() {
          return this.$store.state.project.project_id
        }
      },
      watch: {
        project_id(curVal, oldVal) {
          console.log('curVal',curVal,oldVal)
          this.getshebei()
        },
      },
      mounted(){
        if (this.project_id !== null) {
          this.getshebei()
        }
      },
    methods:{
      getshebei(){
        const param = {
            method:'devlist',
            project_id: this.project_id,
          }
          this.$store.dispatch('QueryDatumMeter', param).then((data) => {
            console.log("设备data",data)
          })
      }
    }
  }
</script>

<style scoped>

</style>
