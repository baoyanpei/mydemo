<template>
    <div style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          <!--顶部导航栏-->
          <div class="boxtop">
            <div class="boxtop_left">年计划>计划列表>11111111</div>
            <div class="boxtop_right">新增计划</div>
          </div>
          <!--时间线-->
          <div class="block" style="float: left">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" class="linespan">
                <span style="position: absolute;top: -6px;left: 25px">{{activity.content}}</span>
                <span style="position: absolute;top: -6px;left: -40px;">{{activity.timestamp}}</span>
              </el-timeline-item>
            </el-timeline>
          </div>
          <!--计划信息栏-->
          <div class="planbox">
            <!--头部-->
            <div class="planboxtop">
              <div class="planboxtop_left" style="width: 580px;height: 100%;float: left">
                <div class="planboxtop_left_1" style="width: 100%;height: 50%;;overflow: hidden">
                  <div class="taskbtn" style="width: 130px;height:30px;margin-top:10px;background-color: #1bb1f4;text-align: center;line-height: 30px;margin-left: 15px;border-radius: 5px;color: #ffffff;float: left">
                    <i class="el-icon-edit-outline"></i>
                    <span>发布实施任务</span>
                  </div>
                  <div class="comments" style="width: 80px;height:30px;margin-top:10px;border: 1px solid #BABABA;float: left;text-align: center;line-height: 30px;color: #BABABA;margin-left: 15px">
                    <i class="el-icon-chat-square"></i>
                    <span>评论</span>
                  </div>
                  <h1 style="font-size: 20px;margin-left: 15px;display: block;float: left">标题1标题1标题1标题1标题1</h1>
                </div>
                <div class="planboxtop_left_2" style="width: 100%;height: 50%;overflow: hidden">
                  <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-date"></i>计划时间:2020年1月1日-2020年2月2日</span>
                  <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 25px;font-size: 14px;"><i class="el-icon-coin"></i>计划类别:年计划</span>
                  <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 25px;font-size: 14px;"><i class="el-icon-user"></i>发起人:张垚</span>
                </div>
              </div>
              <div class="implementation" style="width: 130px;height: 80px;background-color: #F2F2F2;float: left;margin-top: 10px;">1111</div>
              <div class="implementation" style="width: 130px;margin-left:10px;height: 80px;background-color: #1ABC9C;float: left;margin-top: 10px;">2222</div>
              <div class="implementation" style="width: 130px;margin-left:10px;height: 80px;background-color: #BC0000;float: left;margin-top: 10px;">3333</div>
            </div>
             <el-divider></el-divider>
            <span style="display: block;float: left;font-size: 20px;font-weight: 700;">计划内容</span>
            <br>
            <p>1.“香港众志”称，相继自行宣布离任本会职务及退出“香港众志”。</p>
            <p>2.“香港众志”称，相继自行宣布离任本会职务及退出“香港众志”。</p>
            <p>3.“香港众志”称，相继自行宣布离任本会职务及退出“香港众志”。</p>
            <p>4.“香港众志”称，相继自行宣布离任本会职务及退出“香港众志”。</p>
            <el-divider></el-divider>
            <span style="display: block;float: left;font-size: 20px;font-weight: 700;">所属计划</span>
            <br>
            <!--所属计划粗略描述-->
            <div class="smallplan" style="width: 100%;height: 100px;background-color: antiquewhite;margin-top: 10px">
                <div class="round" style="width: 50px;height: 50px;background-color: #BABABA;border-radius: 25px;float:left;text-align: center;line-height: 50px;font-size: 20px;">1</div>
                <div class="smallplan_box" style="width: 800px;height: 100px;background-color: #e5e5e5;float: left;padding: 10px">
                    <div class="smallplan_box_top" style="width: 100%;height: 30px">
                      <span style="font-size: 16px;font-weight: 700;float: left">医技楼2020年1月月计划</span>
                      <div class="planstybox" style="width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right">月计划</div>
                    </div>
                  <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 600px">香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁</span>
                  <br>
                  <span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>
                </div>
            </div>
            <div class="smallplan" style="width: 100%;height: 100px;background-color: antiquewhite;margin-top: 10px">
                <div class="round" style="width: 50px;height: 50px;background-color: #BABABA;border-radius: 25px;float:left;text-align: center;line-height: 50px;font-size: 20px;">1</div>
                <div class="smallplan_box" style="width: 800px;height: 100px;background-color: #e5e5e5;float: left;padding: 10px">
                    <div class="smallplan_box_top" style="width: 100%;height: 30px">
                      <span style="font-size: 16px;font-weight: 700;float: left">医技楼2020年1月月计划</span>
                      <div class="planstybox" style="width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right">月计划</div>
                    </div>
                  <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 600px">香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁香港独裁</span>
                  <br>
                  <span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>
                </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
  export default {
    name: 'yearsplan',
    components:{
      planindex
    },
    data() {
      return {
        reverse: true,
        activities: [{
          content: '活动按期开始',
          timestamp: '2018'
        }, {
          content: '通过审核',
          timestamp: '2019'
        }, {
          content: '创建成功',
          timestamp: '2020'
        }]
      };
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
    width: 240px;
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
.linespan{
  width: 200px;
  height: 50px;
  margin-top: 20px;
  line-height: 30px;
  font-size: 15px;
  position: relative;
}
  .planbox{
    width: 1000px;
    float: left;
  }
  .planboxtop{
    width: 100%;
    height: 100px;
  }
</style>
