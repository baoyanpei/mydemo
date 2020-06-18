<template>
  <div>
    <span class="title">系统二维码生成</span>
    <div class="ercode">
      <div class="ercode_left">
        <span>将网址URL复制进下方输入框，点击生成后，保存图片进行打印</span>
        <el-input v-model="input1" placeholder="请输入URL" style="width: 480px;margin-top: 30px;"></el-input>
        <el-input v-model="input2" placeholder="请输入二维码名称" style="width: 480px;margin-top: 30px;"></el-input>
        <div class="button" style="width: 120px;height: 40px;text-align: center;background-color: #34ba9c;margin: 30px auto;
        line-height: 40px;color: #ffffff;border-radius: 5px">生成二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'generateercode',
    data(){
      return{
        input1:"",
        input2:""
      }
    }
  }
</script>

<style scoped>
.title{
  font-size: 30px;
  display: block;
  margin-left: 15px;
  margin-top: 15px;
  font-weight: 800;
}
.ercode{
   width: 1000px;
  margin-top: 100px;
  margin-left: 200px;
    height: 400px;
}
  .ercode_left{
    width: 500px;
    height: 100%;
    float: left;
    text-align: center;
  }
</style>
