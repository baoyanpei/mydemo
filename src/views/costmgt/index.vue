<template>
<div id="app-index">
  <el-row>
    <el-col :span="24">
      <div class="grid-content bg-purple-dark">
      <el-button icon="el-icon-delete-solid"  type="success" plain @click="directUrl('input')" >材料入库</el-button>
      <el-button icon="el-icon-delete" type="success" plain @click="directUrl('output')">材料出库</el-button>
      <el-button icon="el-icon-search" type="success" plain @click="directUrl('queryCost')">材料查询</el-button>
      <el-button icon="el-icon-search" type="success" plain  @click="directUrl('remainCost')">库存查询</el-button>
    </div>
    </el-col>
  </el-row>
  </div>
</template>
<script>
    import echarts from 'echarts'
    import $ from 'jquery'
    //获取设备宽高
    const y= $(document.body).height()-35;
    //容器高度和屏幕同高
    export default {
        data(){

            return{



            }

        },
        /**
         * 初始化一些信息
         * 项目信息 【获取系统的】此处不获取
         * 此项目下的供货商信息
         * 此项目下的材料类别
         */
        created(){
            //材料类别
            if(this.$store.state.costMgt.materialStyle.length===0) {
                this.$store.dispatch('getMaterialStyleList');
            }

        },
        mounted(){
           $("#app-index").height(y)
        },
        computed:{

        },
        watch:{

        },
        methods: {
          directUrl(url) {

              const condition={};
              this.$router.push({path:'/costmgt/'+url,query:condition});
          }
        }
    }
</script>

<style scoped>
  #app-index{
    z-index: -99999;
    width:100%;
    height:100%;
    background-image: url("./imgs/cost_bg.jpg");
    background-repeat: no-repeat;
    opacity: 1;
    background-size:100% 100%;

  }
.grid-content{
  height:200px;
  width:700px;
  background: rgba(0, 142, 255, 0.27);
  line-height: 200px;
  text-align: center;
  margin: 0 auto;
  margin-top: 10% !important
}


</style>
