<template>
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          weeksplan
        </el-col>
      </el-row>
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
  export default {
    name: 'weeksplan',
    components:{
      planindex
    }
  }
</script>

<style scoped>

</style>
