<template>
    <div style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          <!--顶部导航栏-->
          <div class="boxtop">
            <div class="boxtop_left"><span style="margin-left: 15px;line-height: 35px;white-space: nowrap;display:inline-block;overflow: hidden;;text-overflow: ellipsis;width: 300px;">日计划>计划列表>{{this.bannertitle}}</span></div>
            <div class="boxtop_right">新增计划</div>
          </div>
          <!--时间线-->
          <div class="block" style="float: left;background-color: #DFDFDF">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" class="linespan">
                <span style="position: absolute;top: -6px;left: 25px;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 180px;" @click="showtitle(activity)" :class="{active:indexspan==activity.id}">{{activity.title}}</span>
                <span class="datayear">{{activity.datayear}}</span>
              </el-timeline-item>
            </el-timeline>
          </div>
          <!--计划信息栏-->
          <div class="planbox">
            <!--头部-->
            <div class="itemactovi" v-for="item in this.firstactivities">
                <div class="planboxtop">
                  <div class="planboxtop_left" style="width: 590px;height: 100%;float: left">
                    <div class="planboxtop_left_1" style="width: 100%;height: 50%;;overflow: hidden">
                      <div class="taskbtn" style="width: 130px;height:30px;margin-top:10px;background-color: #1bb1f4;text-align: center;line-height: 30px;margin-left: 15px;border-radius: 5px;color: #ffffff;float: left">
                        <i class="el-icon-edit-outline"></i>
                        <span>发布实施任务</span>
                      </div>
                      <div class="comments" style="width: 80px;height:30px;margin-top:10px;border: 1px solid #BABABA;float: left;text-align: center;line-height: 30px;color: #BABABA;margin-left: 15px">
                        <i class="el-icon-chat-square"></i>
                        <span>评论</span>
                      </div>
                      <h1 style="font-size: 20px;margin-left: 15px;float: left;color: #000000;margin-top: 15px;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 300px;">{{item.title}}</h1>
                    </div>
                    <div class="planboxtop_left_2" style="width: 100%;height: 50%;overflow: hidden">
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-date"></i>计划时间:{{item.start_date}}-{{item.created_time}}</span>
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-coin"></i>计划类别:日计划</span>
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-user"></i>发起人:{{item.person_name}}</span>
                    </div>
                  </div>
                  <div class="implementation" style="position:relative;width: 120px;height: 80px;background-color: #F2F2F2;float: left;margin-top: 10px;">
                    <span class="implementation_span1" style="font-size: 40px;position: absolute;bottom: 15px;left: 0px;">{{span1}}</span>
                    <span class="implementation_span2" style="position: absolute;bottom: 15px;right: 10px">实施任务</span>
                  </div>
                  <div class="implementation" style="position:relative;color:#fff;width: 120px;margin-left:10px;height: 80px;background-color: #1ABC9C;float: left;margin-top: 10px;">
                    <span class="implementation_span1" style="font-size: 40px;position: absolute;bottom: 15px;left: 0px;">{{span2}}</span>
                    <span class="implementation_span2" style="position: absolute;bottom: 15px;right: 10px">完成任务</span>
                  </div>
                  <div class="implementation" style="position:relative;color:#fff;width: 120px;margin-left:10px;height: 80px;background-color: #BC0000;float: left;margin-top: 10px;">
                    <span class="implementation_span1" style="font-size: 40px;position: absolute;bottom: 15px;left: 0px;">{{span3}}</span>
                    <span class="implementation_span2" style="position: absolute;bottom: 15px;right: 10px">超时任务</span>
                  </div>
                </div>
                 <el-divider></el-divider>
                <span style="display: block;float: left;font-size: 14px;color:#AAAAAA;font-weight: 700;margin-left: 15px;">计划内容</span>
                <br>
                <p style="color: #000000;font-size: 16px;margin-left: 15px;">{{item.content}}</p>
                <el-divider></el-divider>
              <span style="display: block;float: left;font-size: 14px;font-weight: 700;color:#AAAAAA;margin-left: 15px;">子计划</span>
            </div>
            <br>
            <!--所属计划粗略描述-->
            <div class="objjjj" v-for="obj in this.sonplanbox">
                <div class="smallplan" style="width: 100%;height: 100px;margin-top: 10px;margin-left: 15px;">
                    <div class="round" style="margin-top: 25px;margin-right:15px;width: 50px;height: 50px;background-color: #e5e5e5;border-radius: 25px;float:left;text-align: center;line-height: 50px;font-size: 20px;">{{obj.sonnum}}</div>
                    <div class="smallplan_box" style="width: 800px;height: 100px;background-color: #e5e5e5;float: left;padding: 10px">
                        <div class="smallplan_box_top" style="width: 100%;height: 30px">
                          <span style="font-size: 16px;font-weight: 700;float: left;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 650px;">{{obj.title}}</span>
                          <div class="planstybox" style="width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right;color: #ffffff">{{obj.typename}}</div>
                        </div>
                      <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 600px;">{{obj.content}}</span>
                      <br>
                      <span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>
                    </div>
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
        activities: [],
        firstactivities:[],
        bannertitle:'',
        fatherid:'',
        sonplanbox:[],
        plan3id:'',
        span1:'',
        span2:"",
        span3:"",
        indexspan:0
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
        this.getplan()
      },
    },
    mounted(){
      if (this.project_id !== null) {
        this.getplan()
      }
    },
    methods:{
      getplan(){
        const param = {
            method:'plan_query',
            project_id: this.project_id,
            type:4
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            let todaydata=new Date()
            let todayyear=todaydata.getFullYear()
            data.data.forEach(item=>{
              if(item.start_date.slice(0,4)==todayyear){
                item["datayear"]=item.start_date.slice(5,11)
              }
              else {
               item["datayear"]=item.start_date.slice(0,11)
              }
            })
           this.firstactivities=[]
            this.activities=data.data
            this.firstactivities.push(this.activities[0])
            this.bannertitle=data.data[0].title
            this.indexspan=data.data[0].id
            this.fatherid=data.data[0].id
            this.bannertitle=index.title
            this.plan3id=data.data[0].id
            this.getplan2()
            this.getplane3()
          })
      },
      getplan2(){
        const param = {
            method:'plan_query',
            project_id: this.project_id,
            parent_id:this.fatherid
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('plan22222', data)
            this.sonplanbox=data.data
            this.sonplanbox.forEach(item=>{
              item["sonnum"]=this.sonplanbox.indexOf(item)+1
              if(item.type==1){
                item["typename"]="年计划"
              }
              if(item.type==2){
                item["typename"]="月计划"
              }
              if(item.type==3){
                item["typename"]="周计划"
              }
              if(item.type==4){
                item["typename"]="日计划"
              }
              if(item.type==5){
                item["typename"]="施工组织计划"
              }
              if(item.type==6){
                item["typename"]="施工计划"
              }
              if(item.type==0){
                item["typename"]="其他"
              }
            })
            this.getplane3()
          })
      },
      getplane3(){//任务状态
        const param = {
            method:'plan_detail',
            project_id: this.project_id,
            id:this.plan3id
        }
        this.$store.dispatch('Getplan', param).then((data) => {
          // console.log('plan3333', data)
          this.span1=data.data.sub_work_count
          this.span2=data.data.sub_finished
          this.span3=data.data.sub_work_count-data.data.sub_finished
        })
      },
      showtitle(index){
        this.indexspan = index.id
         this.fatherid=index.id
        this.bannertitle=index.title
        this.firstactivities.splice(0,1)
        this.firstactivities.push(index)
        this.plan3id=index.id
        this.getplan2()
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
    padding: 0 20px;
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
    width: 990px;
    float: left;
  }
  .planboxtop{
    width: 100%;
    height: 100px;
  }
  .datayear{
    position: absolute;
    top: 20px;
    left: 25px;
  }
    .active {
   background-color: #ffffff;
    padding-bottom: 35px;
}
</style>
