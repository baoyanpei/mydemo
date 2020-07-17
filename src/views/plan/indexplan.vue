<template>
    <div style="margin-top: 20px">
      <el-row :gutter="10">
        <el-col :span="4">
          <planindex></planindex>
        </el-col>
        <el-col :span="20">
          <!--顶部导航栏-->
          <div class="boxtop">
            <div class="boxtop_left"><span style="margin-left: 15px;line-height: 35px;white-space: nowrap;display:inline-block;overflow: hidden;;text-overflow: ellipsis;width: 300px;">{{this.firsttitletype}}>计划列表>{{this.bannertitle}}</span></div>
            <div class="boxtop_right" @click="getnewplan">新增计划</div>
          </div>
          <!--时间线-->
          <div class="block" style="float: left;background-color: #DFDFDF">
            <el-timeline :reverse="reverse">
              <el-timeline-item v-for="(activity, index) in activities" :key="index" class="linespan">
                <span style="position: absolute;top: -6px;left: 25px;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 180px;" @click="showtitle(activity)" :class="{active:indexspan==activity.id}">{{activity.title}}</span>
                <span style="position: absolute;top: -6px;left: -40px;">{{activity.datayear}}</span>
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
                      <div  @click="releasetemplatefnc(item.content)" class="taskbtn" style="width: 130px;height:30px;margin-top:10px;background-color: #1bb1f4;text-align: center;line-height: 30px;margin-left: 15px;border-radius: 5px;color: #ffffff;float: left">
                        <i class="el-icon-edit-outline"></i>
                        <span>发布实施任务</span>
                      </div>
                      <h1 style="font-size: 20px;margin-left: 15px;float: left;color: #000000;margin-top: 15px;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 380px;">{{item.title}}</h1>
                    </div>
                    <div class="planboxtop_left_2" style="width: 100%;height: 50%;overflow: hidden">
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-date"></i>计划时间:{{item.start_date}}-{{item.created_time}}</span>
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-coin"></i>计划类别:{{item.firstlittertype}}</span>
                      <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-user"></i>发起人:{{item.person_name}}</span>
                    </div>
                  </div>
                  <div class="implementation" style="position:relative;width: 80px;height: 60px;background-color: #1BB1F4;float: left;margin-top: 10px;">
                    <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span4}}</span>
                     <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 14px">子任务</span>
                  </div>
                  <div class="implementation" style="position:relative;margin-left:10px;width: 80px;height: 60px;background-color: #F2F2F2;float: left;margin-top: 10px;">
                     <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span1}}</span>
                     <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">实施任务</span>
                  </div>
                  <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #1ABC9C;float: left;margin-top: 10px;">
                     <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span2}}</span>
                    <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">完成任务</span>
                  </div>
                  <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #BC0000;float: left;margin-top: 10px;">
                    <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span3}}</span>
                    <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">超时任务</span>
                  </div>
                </div>
                 <el-divider></el-divider>
                <span style="display: block;float: left;font-size: 14px;color:#AAAAAA;font-weight: 700;margin-left: 15px;">计划内容</span>
                <br>
                <p style="color: #000000;font-size: 16px;margin-left: 15px;">{{item.content}}</p>
                <el-divider></el-divider>
            </div>
            <!--显示评论-->
              <div v-for="item in this.getcommentbox">
                  <div class="showcomment">
                    <span>{{item.person_name}}：</span>
                    <span>{{item.comment}}</span>
                  </div>
              </div>
              <!--上传评论-->
              <div class="comments" style="width: 120px;height:35px;margin-top:8px;background-color:#1BB1F4;float: left;text-align: center;line-height: 35px;color: #ffffff;margin-left: 15px" @click="commentclick()">
                <i class="el-icon-chat-square"></i>
                <span>评论</span>
              </div>
              <el-input v-model="commentsinput" placeholder="请输入评论内容" style="float: left;width: 300px;margin-top:8px;"></el-input>
             <br><br><br><br>
              <span style="display: block;float: left;font-size: 14px;font-weight: 700;color:#AAAAAA;margin-left: 15px;">子计划</span>
            <br>
            <!--所属计划粗略描述-->
            <div class="objjjj" v-for="obj in this.sonplanbox">
                <div class="smallplan" style="width: 100%;height: 100px;margin-top: 10px;margin-left: 15px;" @click="jumpson(obj)">
                    <div class="round" style="margin-top: 25px;margin-right:15px;width: 50px;height: 50px;background-color: #e5e5e5;border-radius: 25px;float:left;text-align: center;line-height: 50px;font-size: 20px;">{{obj.sonnum}}</div>
                    <div class="smallplan_box" style="width: 800px;height: 100px;background-color: #e5e5e5;float: left;padding: 10px">
                        <div class="smallplan_box_top" style="width: 100%;height: 30px;margin-bottom: 15px">
                          <span style="font-size: 16px;font-weight: 700;float: left;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 650px;" >{{obj.title}}</span>
                          <div class="planstybox" style="width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right;color: #ffffff">{{obj.typename}}</div>
                        </div>
                      <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;" :title=obj.content>{{obj.content}}</span>
                      <br>
                      <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
                    </div>
                </div>
            </div>
            <el-divider></el-divider>
              <span style="display: block;float: left;font-size: 14px;font-weight: 700;color:#AAAAAA;margin-left: 15px;">实施任务</span>
            <br><br>
            <div class="objjjj" v-for="obj in this.taskplanbox">
                <div class="smallplan" :class="{'nohave':(obj.onshow=='none')}" style="width: 100%;height: 100px;margin-top: 10px;margin-left: 15px;">
                    <div class="round" style="margin-top: 25px;margin-right:15px;width: 50px;height: 50px;background-color: #e5e5e5;border-radius: 25px;float:left;text-align: center;line-height: 50px;font-size: 20px;">{{obj.sonnum}}</div>
                    <div class="smallplan_box" style="width: 800px;height: 100px;background-color: #e5e5e5;float: left;padding: 10px">
                        <div class="smallplan_box_top" style="width: 100%;height: 30px;margin-bottom: 15px">
                          <span style="font-size: 16px;font-weight: 700;float: left;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 650px;" @click="jumpfnc(obj)">{{obj.title}}</span>
                          <div class="planstybox" style="width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right;color: #ffffff">{{obj.typename}}</div>
                        </div>
                      <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;" :title=obj.content>{{obj.content}}</span>
                      <br>
                      <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
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
        idplan:[],
        mytaskbox:[],
        alltask:[],
        firsttitletype:"年计划",
        planchanidtype:1,
        planindexworkid:0,
        getcommentbox:[],
        commentsinput:"",//评论内容
        taskplanbox:[],
        bannertitle:'',//导航栏标题
        fatherid:0,
        firstactivities:[],
        plan3id:"",
        activities: [{
          title: '活动按期开始',
          datayear: '2018'
        }],
        sonplanbox:[],
        span1:'',
        span2:"",
        span3:"",
        span4:"",
        indexspan:0
      };
    },
    computed:{
      project_id() {
        return this.$store.state.project.project_id
      },
      plan_typeid(){
        return this.$store.state.plantypeid.count
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log("dsadas")
        this.getplan()
      },
      plan_typeid(curVal, oldVal){
        console.log("监听事件plan_typeid",curVal)
        if(curVal==1){
          this.firsttitletype="年计划"
        }
        if(curVal==2){
          this.firsttitletype="月计划"
        }
        if(curVal==3){
          this.firsttitletype="周计划"
        }
        if(curVal==4){
          this.firsttitletype="日计划"
        }
        if(curVal==5){
          this.firsttitletype="施工组织计划"
        }
        if(curVal==6){
          this.firsttitletype="施工计划"
        }
        if(curVal==0){
          this.firsttitletype="其他"
        }
        this.planchangeid()
      }
    },
    mounted(){
      if (this.project_id !== null) {
        this.getplan()
      }
    },
    methods:{
      releasetemplatefnc(index){//发布实施任务
        // console.log("发布实施任务",index)
        let box=this.firstactivities[0].content.split("\n")
        for(let i=0;i<box.length;i++){
            // blockshow:true,blockshow:false
            box.splice(i,1,{name:box[i],block:"have"})
          }
        this.$store.commit("titleboxchange",box)
        this.$store.commit("leftshowfnc")
        this.$router.push({path:'/newplan'})
      },
      planchangeid(){
        this.planchanidtype=this.plan_typeid
        this.getplan()
      },
      getcomment(){
        const param = {
            method:'query',
            project_id: this.project_id,
            work_id:this.indexspan,
          }
          this.$store.dispatch('Postmomment', param).then((data) => {
            // console.log('获取评论', data)
            this.getcommentbox=data.data
            console.log('获取评论', this.getcommentbox)
          })
      },
      commentclick(){
        console.log("评论按钮",this.commentsinput,this.indexspan)
        const param = {
            method:'comment',
            project_id: this.project_id,
            comment:this.commentsinput,
            work_id:this.indexspan,
            comment_node:"plan",
            current_node:0
          }
          this.$store.dispatch('Postmomment', param).then((data) => {
            console.log('计划评论', data)
            this.commentsinput=""
            this.getcomment()
          })
      },
      getnewplan(){
        this.$store.commit("leftnoshowfnc")
        this.$router.push({path:'/newplan'})
      },
      jumpfnc(index){
        console.log("跳转实施任务",index.work_id)
        this.planindexworkid=index.work_id
        this.smalltaskfnc()
      },
      smalltaskfnc() {//获取任务列表接口
        const _param = {
          method: 'get_todo_list',
          project_id: this.project_id,
          qtype: 'TodoList,BackLog,MatterRead'
        }
        this.$store.dispatch('GetAllInstList', _param).then(data => {
          for(let i=0;i<data.length;i++){
            if (this.planindexworkid==data[i].workId){
              console.log("提取到对应的任务",data[i])
              const param = {
                show: true,
                data:data[i]
              }
              this.$store.dispatch('SetInfoDialog', param).then(() => {}).catch(() => {
              })
            }
          }
          this.mytaskbox=data
          console.log('我的任务',data)
        })
    },
      jumpson(index){
        console.log("子计划",index)
        this.planchanidtype=index.type
        this.sonplanjump(index.id)
        this.$store.commit('planidchange',index.type)
      },
      sonplanjump(idsss){
        this.idplan=[]
        this.idplan.push(idsss)
      },
      getplan(){
        const param = {
            method:'plan_query',
            project_id: this.project_id,
            type:this.planchanidtype,
            sort:"desc"
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('plan', data)
            data.data.forEach(item=>{
              item["datayear"]=item.start_date.slice(0,4)
              if(item.type==1){
                item["firstlittertype"]="年计划"
              }
              if(item.type==2){
                item["firstlittertype"]="月计划"
              }
              if(item.type==3){
                item["firstlittertype"]="周计划"
              }
              if(item.type==4){
                item["firstlittertype"]="日计划"
              }
              if(item.type==5){
                item["firstlittertype"]="施工组织计划"
              }
              if(item.type==7){
                item["firstlittertype"]="施工计划"
              }
              if(item.type==0){
                item["firstlittertype"]="其他"
              }
            })
            for(let o=0;o<data.data.length;o++){
              if(this.idplan[0]==data.data[o].id){
                console.log("idplan有值",data.data[o])
                this.firstactivities=[]
                this.activities=data.data
                this.firstactivities.push(data.data[o])
                this.indexspan=data.data[o].id
                this.bannertitle=data.data[o].title
                this.fatherid=data.data[o].id
                this.plan3id=data.data[o].id
                this.getplan2()//子计划
                this.getplane3()//任务状态
                this.getcomment()//该计划的评论
                this.idplan=[]
              }
            }
            if(this.idplan.length==0){
              console.log("idplan为空")
              this.firstactivities=[]
              this.activities=data.data
              this.firstactivities.push(this.activities[0])
              this.indexspan=data.data[0].id
              this.bannertitle=data.data[0].title
              this.fatherid=data.data[0].id
              this.plan3id=data.data[0].id
              this.getplan2()//子计划
              this.getplane3()//任务状态
              this.getcomment()//该计划的评论
            }
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
                item["typename"]="施工任务"
              }
              if(item.type==7){
                item["typename"]="施工计划"
              }
              if(item.type==0){
                item["typename"]="其他"
              }
            })
            this.gettaskplan()
          })
      },
      getalltask(){
        const _param = {
          method: 'get_todo_list',
          project_id: this.project_id,
          qtype: 'TodoList,BackLog,MatterRead'
        }
        this.$store.dispatch('GetAllInstList', _param).then(data => {
          this.alltask=data
          console.log('所有任务',data)
        })
      },
      gettaskplan(){
        const param = {
            method:'plan_query',
            project_id: this.project_id,
            type:6,
            parent_id:this.fatherid
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            this.getalltask()
            console.log('实施任务', data)
            this.taskplanbox=[]
            this.taskplanbox=data.data
            this.taskplanbox.forEach(item=>{
              item["sonnum"]=this.taskplanbox.indexOf(item)+1
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
                item["typename"]="施工任务"
              }
                if(item.type==7){
                item["typename"]="施工计划"
              }
              if(item.type==0){
                item["typename"]="其他"
              }
            })
            for(let i=0;i<this.alltask.length;i++){
              for(let j=0;j<this.taskplanbox.length;j++){
                if(this.taskplanbox[j].work_id=this.alltask[i].workId){
                  this.taskplanbox[j]["onshow"]="have"
                }else {
                  this.taskplanbox[j]["onshow"]="none"
                }
              }
            }
            console.log("实施任务有什么",this.taskplanbox)
          })
      },
      getplane3(){//任务状态
        const param = {
            method:'plan_detail',
            project_id: this.project_id,
            id:this.plan3id
        }
        this.$store.dispatch('Getplan', param).then((data) => {
          console.log('plan3333', data)
          this.span4=data.data.sub_count    //子任务
          this.span1=data.data.sub_work_count//实施任务
          this.span2=data.data.sub_finished//完成任务
          this.span3=data.data.sub_work_count-data.data.sub_finished//超时任务
        })
      },
      showtitle(index){
        this.getcommentbox=[]
        this.indexspan = index.id
        this.fatherid=index.id
        this.firstactivities.splice(0,1)
        this.firstactivities.push(index)
        this.bannertitle=index.title
        this.plan3id=index.id
        this.getplan2()
        this.getplane3()
        this.getcomment()
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
    .active {
   background-color: #ffffff;
    padding-bottom: 35px;
      color: #1abc9c;
}
  .showcomment{
    width: 100%;
    height: 50px;
    margin-left: 15px;
    padding-left: 20px;
    line-height: 50px;
  }
  .nohave{
    background-color: #ff6700;
  }
</style>
