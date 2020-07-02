<template>
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          dayplan
        </el-col>
      </el-row>
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
  export default {
    name: 'dayplan',
    components:{
      planindex
    }
  }
</script>

<style scoped>

</style>
