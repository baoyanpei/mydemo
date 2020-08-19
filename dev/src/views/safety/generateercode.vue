<template>
  <div>
    <span class="title">系统二维码生成</span>
    <div class="ercode">
      <div class="ercode_left">
        <span>将网址URL复制进下方输入框，点击生成后，保存图片进行打印</span>
        <el-input v-model="input1" placeholder="请输入URL" style="width: 480px;margin-top: 30px;"></el-input>
        <el-input maxlength="10" v-model="input2" placeholder="请输入二维码名称" style="width: 480px;margin-top: 30px;"></el-input>
        <div class="button" style="width: 120px;height: 40px;text-align: center;background-color: #34ba9c;margin: 30px auto;
        line-height: 40px;color: #ffffff;border-radius: 5px" @click="getcode">生成二维码</div>
      </div>
      <div class="ercode_right" v-show="ercodeshow">
        <div class="tpclass">
          <div id="qrcode" ref="qrcode" style="float: left"></div>
          <div class="code_right">
            <span class="code_right_one">{{input2}}</span>
            <img src="../../../static/images/5ece54003e73333b34c941d5a9e9e09.png" alt="" class="code_right_two" style="width: 280px">
          </div>
        </div>
        <div class="button" style="width: 120px;height: 40px;text-align: center;background-color: #1A65BC;margin: 30px auto;
        line-height: 40px;color: #ffffff;border-radius: 5px" @click="dowlondercode">下载二维码</div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  export default {
    name: 'generateercode',
    data(){
      return{
        input1:"",
        input2:"",
        ercodeshow:false,
        num:0
      }
    },
    methods:{
      getcode(){
         document.getElementById("qrcode").innerHTML = "";
         this.ercodeshow=true
          let aaa = new QRCode('qrcode', {
            width: 200,
            height: 200,
            text: this.input1,
            colorDark: "#000",
            colorLight: "#fff",
            })
      },
      dowlondercode(){
        let xx=document.getElementsByClassName("tpclass")[0]
         console.log("xx",xx)
         html2canvas(xx,{useCORS: true}).then(canvas => {
          let link = document.createElement("a");
          link.href = canvas.toDataURL("image/png");
          link.setAttribute("download","二维码.png");
          link.style.display = "none";//a标签隐藏
          document.body.appendChild(link);
          link.click();
        });
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
  color: #666666;
}
.ercode{
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
  .ercode_right{
    width: 500px;
    height: 100%;
    float: left;
    text-align: center;
    margin-left: 15px;
  }
  .tpclass{
    width: 700px;
    height: 200px;
  }
  .code_right{
    width: 500px;
    height: 100%;
    float: right;
    position: relative;
  }
  .code_right_one{
    position: absolute;
    font-size: 40px;
    left: 15px;
    top: 20px;
    font-weight: 800;
    color: #666666;
  }
  .code_right_two{
    position: absolute;
    left: 15px;
    bottom: 20px;
  }
</style>
