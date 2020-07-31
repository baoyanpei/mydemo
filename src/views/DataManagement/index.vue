<template>
    <div style="margin-top: 20px">
      <el-row>
        <el-col :span="4">
          <dataindex></dataindex>
        </el-col>
        <el-col :span="20">
        </el-col>
      </el-row>
    </div>
</template>

<script>
   import dataindex from '../../components/publicdatamanagement/index'
  export default {
    name: 'index',
    components:{
      dataindex
    }
  }
</script>

<style scoped>

</style>
