<template>
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          constructionplan
        </el-col>
      </el-row>
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
  export default {
    name: 'constructionplan',
    components:{
      planindex
    }
  }
</script>

<style scoped>

</style>
