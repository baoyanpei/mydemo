<template>
    <div>
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20" style="background-color: #F9F9F9">
           <div class="boxtop">
            <div class="boxtop_left">新增计划</div>
            <div class="boxtop_right">新增计划</div>
          </div>
          <div class="plantoon">
            <span class="plantoonspan">计划名称</span>
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <div class="planstyle">
              <span class="plantoonspan">计划类别</span>
              <el-cascader v-model="value" :options="options" @change="handleChange"></el-cascader>
            </div>
            <div class="planstyle">
              <span class="plantoonspan">计划时间</span>
              <el-date-picker
                v-model="value1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期" style="width: 250px">
              </el-date-picker>
            </div>
            <span class="plantoonspan">计划内容</span>
            <el-input type="textarea" v-model="desc"></el-input>
            <div style="width: 100%;height: 40px;text-align: center;line-height: 40px;background-color: #169BD5;color: #ffffff;margin-top: 10px;border-radius: 10px">
              发布实施任务</div>
            <div style="width: 120px;margin-top: 10px;color: #34ba9c"><i class="el-icon-circle-plus-outline"></i>添加所属计划</div>
          </div>
          <!--//暂无实施计划-->
          <div class="newplanxijie">
            <!--<span style="text-align: center;line-height: 400px;">暂无实施计划</span>-->
            <div class="newplanxijie_1">
              <div class="newplanxijie_1_top">新增实施计划</div>
              <div class="newplanxijie_1_box">
                <span class="newplanxijie_1_box_span1">【便利店店员】男女不限，年龄在18-50周岁，2500--3000/月，加班工资，节假日三倍工资，生日福利等，上24小时休24小时，管住，部分门店管吃，</span>
                <span style="display: block;color: #0a76a4;line-height: 35px">实施计划</span>
                <span style="display: block;">
                  <i class="el-icon-edit-outline" style="margin-right: 10px"></i>编辑
                  <span style="margin-right: 10px;margin-left: 10px;color: #BABABA">|</span>
                  <i class="el-icon-close" style="margin-right: 10px"></i>删除
                </span>
                <div class="jump"><i class="el-icon-right" style="font-size: 30px;color: #ffffff"></i></div>
              </div>
              <!--&#45;&#45;&#45;&#45;-->
              <div class="newplanxijie_1_box">
                <span class="newplanxijie_1_box_span1">【便利店店员】男女不限，年龄在18-50周岁，2500--3000/月，加班工资，节假日三倍工资，生日福利等，上24小时休24小时，管住，部分门店管吃，</span>
                <span style="display: block;color: #0a76a4;line-height: 35px">实施计划</span>
                <span style="display: block;">
                  <i class="el-icon-edit-outline" style="margin-right: 10px"></i>编辑
                  <span style="margin-right: 10px;margin-left: 10px;color: #BABABA">|</span>
                  <i class="el-icon-close" style="margin-right: 10px"></i>删除
                </span>
                <div class="jump"><i class="el-icon-right" style="font-size: 30px;color: #ffffff"></i></div>
              </div>
              <div class="newplanxijie_1_box">
                <span class="newplanxijie_1_box_span1">【便利店店员】男女不限，年龄在18-50周岁，2500--3000/月，加班工资，节假日三倍工资，生日福利等，上24小时休24小时，管住，部分门店管吃，</span>
                <span style="display: block;color: #0a76a4;line-height: 35px">实施计划</span>
                <span style="display: block;">
                  <i class="el-icon-edit-outline" style="margin-right: 10px"></i>编辑
                  <span style="margin-right: 10px;margin-left: 10px;color: #BABABA">|</span>
                  <i class="el-icon-close" style="margin-right: 10px"></i>删除
                </span>
                <div class="jump"><i class="el-icon-right" style="font-size: 30px;color: #ffffff"></i></div>
              </div>
            </div>
          </div>
          <div class="faqijihua" style="width: 100%;height: 80px;float: left;text-align: center;line-height: 50px">
              <div style=" box-shadow:0px 0px 30px #e5e5e5;width: 180px;color:#fff;border-radius:20px;height: 50px;background-color: #1ABC9C;margin: auto">发起计划</div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
  export default {
    name: 'newplan',
    data() {
      return {
        input:'',//标题名字
        value: [],//计划类别
        value1:'',//日期
         options: [{//计划下拉标签
          value: 'zhinan',
          label: '指南',}],
        desc:""
      }
    },
    components:{
      planindex
    },
    methods: {
      handleChange(value) {
        console.log(value);
      }
    }
  }
</script>

<style scoped>
.boxtop{
    width: 100%;
    height: 50px;
    background-color: #D8D8D8;
    overflow: hidden;
  }
  .boxtop_left{
    background-color:#1bb1f4;
    width: 150px;
    height: 35px;
    margin-top: 7px;
    line-height: 35px;
    text-align: center;
    margin-left: 15px;
    color: #ffffff;
    border-radius: 10px;
    float: left;
  }
  .boxtop_right{
    float: right;
    width: 150px;
    height: 35px;
    margin-top: 7px;
    line-height: 35px;
    text-align: center;
    background-color: #34ba9c;
    margin-right: 25px;
    color: #ffffff;
    border-radius: 5px;
  }
  .plantoon{
    width: 500px;
    padding: 10px;
    background-color: #fff;
    float: left;
    margin-bottom: 15px;
    margin-top: 10px;
  }
  .plantoonspan{
    line-height: 30px;
    display: block;
    margin-top: 6px;
  }
  .planstyle{
    width: 50%;
    height: 80px;
    float: left;
  }
  .newplanxijie{
    width: 700px;
    margin-left: 15px;
    float: left;
    background-color: #ffffff;
     margin-bottom: 15px;
    margin-top: 10px;
    padding: 10px;
  }
  .newplanxijie_1_top{
    width: 150px;
    height: 40px;
    background-color: #1bb1f4;
    text-align: center;
    line-height: 40px;
    color: #ffffff;
    float: right;
  }
  .newplanxijie_1_box{
    width: 100%;
    height: 100px;
    float: left;
    border-bottom: 1px solid #000000;
    padding: 10px;
    position: relative;
  }
  .newplanxijie_1_box_span1{
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    width: 650px
  }
  .jump{
    width: 80px;
    height: 40px;
    background-color: #0081FE;
    text-align: center;
    line-height: 50px;
    font-weight: 800;
    font-size: 20px;
    float: right;
    position: absolute;
    top: 40px;
    right: 20px;
  }
</style>
