<template>
    <div>
      <el-row :gutter="10"
              v-loading="fullscreenLoading"
              element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-col :span="3">
          <planindex></planindex>
        </el-col>
        <el-col :span="21" style="margin:0 auto;margin-left: -10px;">
          <!--顶部导航栏-->
          <div class="boxtop">
            <div class="boxtop_left"><span style="margin-left: 15px;line-height: 35px;white-space: nowrap;display:inline-block;overflow: hidden;;text-overflow: ellipsis;width: 300px;">{{this.firsttitletype}}>计划列表>{{this.bannertitle}}</span></div>
            <el-progress v-show="progressshow" :percentage="progressnum" :format="format" class="jindutiao"></el-progress>
            <a href="javascript:void(0)"><div class="boxtop_right" @click="getnewplan">新增计划</div></a>
          </div>
          <!--添加定位属性-->
          <div class="positionbox">
              <!--时间线-->
              <div class="blockall">
                <div class="block">
                <el-timeline :reverse="reverse">
                  <el-timeline-item v-for="(activity, index) in activities" :key="index" class="linespan">
                    <span class="activitytitle" @click="showtitle(activity)" :class="{active:indexspan==activity.id}">{{activity.title}}</span>
                    <span style="position: absolute;top: 15px;left: 25px;font-size: 13px;color: #AAAAAA">{{activity.datayear}}</span>
                  </el-timeline-item>
                </el-timeline>
                <el-pagination background
                 layout="prev, pager, next"
                 :current-page="currpage"
                 :total="infonum"
                 :page-sizes='[1,2,3]'
                 :page-size="pagesize"
                  @current-change='pagechange'
                  @size-change='handleSizeChange'
                   class="fenyeclass"
                v-show="pagingshow">
                </el-pagination>
              </div>
            </div>
              <!--计划信息栏-->
              <div class="displayplanbox" v-if="planboxshow_none"><span>暂无计划</span></div>
              <div class="planbox"
                   v-if="planboxshow"
                   v-loading="plansonloading"
                  element-loading-text="拼命加载中"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)">
                <!--头部-->
                <newplandialog></newplandialog>
                <div class="itemactovi" v-for="item in this.firstactivities">
                    <div class="planboxtop">
                      <div class="planboxtop_left" style="width: 590px;height: 100%;float: left">
                        <div class="planboxtop_left_1" style="width: 100%;height: 50%;;overflow: hidden">
                          <div  @click="releasetemplatefnc(item)" class="taskbtn" style="width: 130px;height:30px;margin-top:10px;background-color: #0081FE ;text-align: center;line-height: 30px;margin-left: 15px;border-radius: 5px;color: #ffffff;float: left">
                            <i class="el-icon-edit-outline"></i>
                            <a href="javascript:void(0)"><span>发布实施任务</span></a>
                          </div>
                          <h1 style="font-size: 20px;margin-left: 15px;float: left;color: #000000;margin-top: 15px;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 380px;">{{item.title}}</h1>
                        </div>

                        <div class="planboxtop_left_2" style="width: 100%;height: 50%;overflow: hidden">
                          <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-date"></i>计划时间:{{item.start_date}}-{{item.created_time}}</span>
                          <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-coin"></i>计划类别:{{item.firstlittertype}}</span>
                          <span style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"><i class="el-icon-user"></i>发起人:{{item.person_name}}</span>
                        </div>
                      </div>
                      <div class="modelaaa">
                          <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #BC0000;float: right;margin-top: 10px;">
                            <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span3}}</span>
                            <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">超时任务</span>
                          </div>
                          <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #008525;float: right;margin-top: 10px;">
                             <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span2}}</span>
                            <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">完成任务</span>
                          </div>
                          <div class="implementation" style="position:relative;margin-left:10px;width: 80px;height: 60px;background-color: #F2F2F2;float: right;margin-top: 10px;">
                             <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span1}}</span>
                             <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">实施任务</span>
                          </div>
                          <div class="implementation" style="position:relative;width: 80px;height: 60px;background-color: #0081FE;float: right;margin-top: 10px;">
                            <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span4}}</span>
                             <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 14px">子计划</span>
                          </div>
                      </div>

                    </div>
                  <div class="modelbbb">
                      <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #BC0000;float: left;margin-top: 10px;">
                        <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span3}}</span>
                        <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">超时任务</span>
                      </div>
                      <div class="implementation" style="position:relative;color:#fff;width: 80px;margin-left:10px;height: 60px;background-color: #008525;float: left;margin-top: 10px;">
                         <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span2}}</span>
                        <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">完成任务</span>
                      </div>
                      <div class="implementation" style="position:relative;margin-left:10px;width: 80px;height: 60px;background-color: #F2F2F2;float: left;margin-top: 10px;">
                         <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span1}}</span>
                         <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 7px">实施任务</span>
                      </div>
                      <div class="implementation" style="position:relative;width: 80px;height: 60px;background-color: #0081FE;float: left;margin-top: 10px;">
                        <span class="implementation_span1" style="font-size: 30px;position: absolute;bottom: 23px;left: 27px;">{{span4}}</span>
                         <span class="implementation_span2" style="position: absolute;bottom: 5px;right: 14px">子计划</span>
                      </div>
                  </div>
                  <div class="nullbox"></div>
                     <el-divider></el-divider>
                    <span style="display: block;float: left;font-size: 14px;color:#AAAAAA;font-weight: 700;margin-left: 15px;">计划内容</span>
                    <br>
                  <div v-for="obj in item.classcontent">
                     <p style="color: #000000;font-size: 16px;margin-left: 15px;">{{obj}}</p>
                  </div>
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
                  <div class="comments" style="width: 120px;height:35px;margin-top:8px;background-color:#0081FE ;float: left;text-align: center;line-height: 35px;color: #ffffff;margin-left: 15px" @click="commentclick()">
                    <i class="el-icon-chat-square"></i>
                    <span>评论</span>
                  </div>
                  <el-input v-model="commentsinput" placeholder="请输入评论内容" style="float: left;width: 300px;margin-top:8px;"></el-input>
                 <br><br><br><br>
                  <span style="display: block;float: left;font-size: 14px;font-weight: 700;color:#AAAAAA;margin-left: 15px;">子计划</span>
                <br>
                <div class="sonplanboxnone" v-show="sonplanboxnoneshow"><span>暂无子计划</span></div>
                <div class="objjjj" v-for="obj in this.sonplanbox">
                  <a href="javascript:void(0)"><div class="smallplan" @click="jumpson(obj)">
                        <div class="round">{{obj.sonnum}}</div>
                        <div class="smallplan_box">
                            <div class="smallplan_box_top" style="width: 100%;height: 30px;margin-bottom: 15px">
                              <span class="sonplantitle">{{obj.title}}</span>
                              <div class="planstybox">{{obj.typename}}</div>
                            </div>
                          <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;" :title=obj.content>{{obj.content}}</span>
                          <br>
                          <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
                        </div>
                    </div></a>
                </div>
                <el-divider></el-divider>
                  <span style="display: block;float: left;font-size: 14px;font-weight: 700;color:#AAAAAA;margin-left: 15px;">实施任务</span>
                <br><br>
                <div class="sonplanboxnone" v-show="taskplanboxnoneshow"><span>暂无实施计划</span></div>
                <!--//status：-1未处理，0处理中，1完成-->
                <div class="objjjj" v-for="obj in this.taskplanbox">
                    <div class="smallplan" :class="{'nohave':(obj.onshow=='none')}">
                        <div class="round" >{{obj.sonnum}}</div>
                        <div class="smallplan_box">
                            <div class="smallplan_box_top"  style="width: 100%;height: 30px;margin-bottom: 15px">
                              <a href="javascript:void(0)"><span class="sonplantitle" @click="jumpfnc(obj)">{{obj.title}}</span></a>
                              <div class="planstybox" :class="{'timeouttask':(obj.timeout==1),'finishedtask':(obj.status==1)}">{{obj.typename}}</div>
                            </div>
                          <span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;" :title=obj.content>{{obj.content}}</span>
                          <br>
                          <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
                        </div>
                    </div>
                </div>
              </div>
          </div>
        </el-col>
      </el-row>
      <!--<div class="backtop" v-show="backtopshow" @click="backtopfnc">回到顶部</div>-->
    </div>
</template>

<script>
 import planindex from '../../components/planpage/index'
 import newplandialog from '../../components/creatnewplan/index'
  export default {
    name: 'yearsplan',
    components:{
      planindex,
      newplandialog
    },
    data() {
      return {
        currpage:1,
        infonum:0,
        pagesize:10,
        indexplanpage:1,
        pagingshow:false,
        reverse: true,
        progressnum:0,//进度条
        progressshow:false,
        planboxshow:true,
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
        activities: [],
        sonplanbox:[],
        span1:'',
        span2:"",
        span3:"",
        span4:"",
        indexspan:0,
        pushdata:"",
        thirdinfo:[],
        postdata:[],
        firstbox:[],
        fullscreenLoading:false,
        plansonloading:false,
        planboxshow_none:true,
        sonplanboxnoneshow:false,//子计划为空时显示的文字
        taskplanboxnoneshow:false,
        pageshowtitle:0,
        lastsonplanid:0,
        curHeight:0,
        scroll:'',
        backtopshow:false
      };
    },
    computed:{
      project_id() {
        return this.$store.state.project.project_id
      },
      plan_typeid(){
        return this.$store.state.plantypeid.count
      },
      sonplanid(){
        return this.$store.state.plantypeid.sonplanid
      },
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log("dsadas")
        this.pagingshow=false
        this.activities=[]
        this.progressnum=0
        this.planboxshow=false
        this.planboxshow_none=true
        this.getplan()
      },
      sonplanid(curVal){
        console.log("传输过来的sonplanid",curVal)
        this.lastsonplanid=curVal
        // console.log("传输过来的222222",this.activities)
      },
      plan_typeid(curVal, oldVal){
        this.planboxshow=false
        this.progressnum=0
        this.bannertitle=""
        this.pagingshow=false
        console.log("监听事件plan_typeid",curVal,this.sonplanid)
        if(curVal==1){
          this.firsttitletype="年计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==2){
          this.firsttitletype="月计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==3){
          this.firsttitletype="周计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==4){
          this.firsttitletype="日计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==5){
          this.firsttitletype="施工组织计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==6){
          this.firsttitletype="施工计划"
          this.activities=[]
          this.fullscreenLoading=true
        }
        if(curVal==0){
          this.firsttitletype="其他"
          this.activities=[]
          this.fullscreenLoading=true
        }
        this.planchangeid()
      }
    },
    mounted(){
      if (this.project_id !== null) {
        this.getplan()
      }
      window.addEventListener('scroll', this.menu)
    },
    methods:{
      onnewplanshowchangefnc(){//公共样式显示
        console.log("公共样式显示")
        this.$store.commit("newplanshowchange")
        this.$store.commit("titleboxchange",[])
      },
      releasetemplatefnc(index){//发布实施任务
        this.fullscreenLoading=false
        this.plansonloading=false
        console.log("发布实施任务",index)
        let box=this.firstactivities[0].content.split("\n")
        for(let i=0;i<box.length;i++){//{name:this.numbox[i],block:"have",blockshow1:true,blockshow2:false}
            box.splice(i,1,{name:box[i],block:"have",blockshow1:true,blockshow2:false})
          }
          this.$store.commit("fatheridchange",index.id)
          this.$store.commit("titleboxchange",box)
          this.$store.commit("leftshowfnc")
          this.$store.commit("newplanshowchange")
          // this.$router.push({path:'/newplan'})
      },
      planchangeid(){
        this.planchanidtype=this.plan_typeid
        this.fullscreenLoading=false
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
        this.$store.commit("titleboxchange",[])
        this.$store.commit("newplanshowchange")
      },
      jumpfnc(index){
        this.fullscreenLoading=true
        setTimeout(() => {
          this.fullscreenLoading=false
          if(this.pageshowtitle==0){
           this.$message('当前网络状态较差');
           return
          }
        }, 8000)
        console.log("跳转实施任务1-1",index.work_id)
        this.planindexworkid=index.work_id
        this.smalltaskfnc()
      },
      smalltaskfnc() {//获取任务列表接口
        console.log("跳转实施任务1-2")
        const _param = {
          method: 'query_task_all',
          project_id: this.project_id,
          limit:10000
        }
        this.$store.dispatch('Allpersondata', _param).then(data => {
          console.log("跳转实施任务1-3",data)
          this.firstbox=[]
          data.data.forEach(item=>{
            if (this.planindexworkid==item.workId){
              console.log("跳转实施任务1-3有任务---")
              this.firstbox.push(item)
              this.postdata=[]
              this.postdata.push(item.workId)
              this.secondfnc()
              this.thirdinterface()//配置列表
            }
          })
          this.mytaskbox=data
          console.log('我的任务',data)
        })
    },
      secondfnc(){
        console.log("跳转实施任务1-4",this.postdata)
        const _param = {
        method: 'get_nodes_users_list',
        project_id: this.project_id,
        work_ids:this.postdata
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
        this.pageshowtitle=""
        console.log("第二接口数据",data)
        let aaa=data.data
        let map1= new Map()
        for(var i in aaa){
          map1.set(i,aaa[i])
        }
        this.firstbox.forEach(item=>{
          console.log("---------item",item)
          let workId = item.workId
          item["state"]="1"
          item['obj']=map1.get(workId)
          item["flowId2"]=item.flowId.slice(0,item.flowId.length-2)
          item["getinfo"]=map1.get(workId).info.flowNode[0]
          if(this.thirdinfo[item.flowId2]!=""){ //item.flowId2--->PlanFlow
           let _config = this.thirdinfo[item.flowId2]//this.thirdinfo["PlanFlow"]
            let _node = _config[item.getinfo]
            if (_node !== undefined){
              item.state = _node.status
              item["statecolor"]=_node.color
            }else{
              item.state = "已完成"
            }
          }
        })
          const param = {
            show: true,
            data:this.firstbox[0]
          }
          this.$store.dispatch('SetInfoDialog', param).then((data) => {}).catch(() => {
            console.log("------打开页面返回信息",data)
          })
        this.pageshowtitle=1
        this.fullscreenLoading=false
      })
      },
      thirdinterface(){
        console.log("跳转实施任务1-5")
        const _param = {
          method: 'cfg_nodes',
          project_id: this.project_id,
        }
        this.$store.dispatch('Allinfodictionary', _param).then((data) => {
          this.thirdinfo=data
          console.log("第三接口",this.thirdinfo)
        })
      },
      jumpson(index){//子计划跳转
        this.lastsonplanid=0
        console.log("子计划",index)
        this.planchanidtype=index.type
        this.sonplanjump(index.id)
        this.$store.commit('sonplanchange',index.id)
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
            sort:"desc",
            page:this.indexplanpage,
            limit:10
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            this.beforeMount()
            console.log("plan111",data)
            this.infonum=data.count
            if(data.count==0){
              console.log("plan数据为空")
              this.planboxshow_none=true
              this.planboxshow=false
            }else {
              this.progressshow=true
              this.planboxshow_none=false
              this.pagingshow=true
              this.planboxshow=true
              this.progressnum=15
            }
            console.log('plan', data)
            data.data.forEach(item=>{
              item["classcontent"]=item.content.split("\n")
              item["datayear"]=item.start_date.slice(0,11)
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
                this.progressnum=30
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
            if(this.lastsonplanid==0){
              console.log("还没有传输数据",this.lastsonplanid)
            }
            if(this.lastsonplanid!==0){
              console.log("传输过来了数据",this.lastsonplanid)
              for(let i=0;i<this.activities.length;i++){
                if(this.lastsonplanid==this.activities[i].id){
                  console.log("子任务跳转过来的数据",this.activities[i])
                  this.showtitle(this.activities[i])
                }
              }
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
            this.progressnum=80
            console.log('plan22222', data)
            if(data.data.length==0){
              console.log('plan22222---count', data)
              this.sonplanboxnoneshow=true
            }
            else {
              this.sonplanboxnoneshow=false
            }
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
            // this.getalltask()
            this.progressnum=70
            console.log('实施任务', data)
            if(data.data.length==0){
              this.taskplanboxnoneshow=true
            }else {
              this.taskplanboxnoneshow=false
            }
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
            for(let o=0;o<this.taskplanbox.length;o++){
              console.log("实施任务时间",this.taskplanbox[o].end_date)//status  -1未处理  0处理中  1完成
              if(this.taskplanbox[o].status!==1){
                // console.log("超时实施任务",this.taskplanbox[o].finished_date)
                if(this.taskplanbox[o].finished_date==""){
                  let t1=new Date(this.taskplanbox[o].end_date).getTime()
                  let t2=new Date().getTime()
                  if(t1<t2){
                    this.taskplanbox[o]["timeout"]=1
                  }else {
                    this.taskplanbox[o]["timeout"]=0
                  }
                }
                if(this.taskplanbox[o].finished_date!==""){
                  let t1=new Date(this.taskplanbox[o].end_date).getTime()
                  let t2=new Date(this.taskplanbox[o].finished_date).getTime()
                  if(t1<t2){
                    this.taskplanbox[o]["timeout"]=1
                  }else {
                    this.taskplanbox[o]["timeout"]=0
                  }
                }
              }
            }
            console.log("实施任务有什么",this.taskplanbox)
            this.plansonloading=false
            this.progressnum=100
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
          this.span4=data.data.sub_count-data.data.sub_work_count    //子任务
          this.span1=data.data.sub_work_count//实施任务
          this.span2=data.data.sub_finished//完成任务
          this.span3=data.data.sub_timeout//超时任务
          this.progressnum=60
        })
      },
      showtitle(index){
        this.plansonloading=true
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
        setTimeout(() => {
          this.plansonloading=false
        }, 6000)
      },
      format(percentage) {
        return percentage === 100 ? ('加载已完成',this.progressshow=false ): `${percentage}%`;
      },
      pagechange(e){
        console.log("eeeee",e)
        this.indexplanpage=e
        this.getplan()
      },
      handleSizeChange(index){
        console.log("eeeindex",index)
      },
      beforeMount() {
        var h = document.documentElement.clientHeight || document.body.clientHeight;
        this.curHeight =h; //减去页面上固定高度height
        // console.log("浏览器屏幕高度",this.curHeight)
      },
       menu() {
        this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
        if(this.scroll<500){
          this.backtopshow=false
        }
        if(this.scroll>500){
          console.log("高度大于一百")
          this.backtopshow=true
         // document.querySelector('block').style.opacity="0.8";
        }
       },
      backtopfnc(){
        document.documentElement.scrollTop=0
        document.body.scrollTop=0
      }
    }
  }
</script>

<style scoped>
  .planstybox{
    width:110px;height: 30px;background-color: #1abc9c;text-align: center;line-height: 30px;float: right;color: #ffffff
  }
  .backtop{
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  .boxtop{
    width: 100%;
    height: 50px;
    background-color: #F5F5F5;
    overflow: hidden;
  }
  .positionbox{
    position: relative;
  }
  .boxtop_left{
    background-color:#0081FE ;
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
  height: 42px;
  margin-top: 20px;
  line-height: 30px;
  font-size: 15px;
  position: relative;
}
  .planbox{
    width: 81%;
    position: sticky;
    float: left;
    height: 665px;
    margin-left: 10px;
    overflow-y: auto;
    overflow-x:hidden;
  }
  .planboxtop{
    width: 100%;
    height: 100px;
  }
  .displayplanbox{
    width: 100%;
    height: 800px;
    line-height: 400px;
    text-align: center;
    font-size: 30px;
    color: #aaaaaa;
  }
  .blockall{
    float: left;
    width: 18%;
    height: 665px;
    position: relative;
    background-color: #F5F5F5;
    overflow: auto;
  }
  .block{
    float: left;
    width: 100%;
  }
  .fenyeclass{
    position: absolute;
    bottom: 0;
    margin: auto;
  }
    .active {
      background-color: #ffffff;
      padding-bottom: 35px;
      color: #0081FE;
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
  .el-progress-bar__inner{
    height: 10px;
  }
  .sonplanboxnone{
    width: 100%;
    height: 150px;
    font-size: 20px;
    text-align: center;
    line-height: 150px;
    color: #aaaaaa;
  }
  .round{
    margin-top: 25px;
    margin-right:15px;
    margin-left: 15px;
    width: 50px;
    height: 50px;
    background-color: #e5e5e5;
    border-radius: 25px;
    float:left;
    text-align: center;
    line-height: 50px;
    font-size: 20px;
  }
  .modelaaa{
      display: block;
    }
    .modelbbb{
      display: none;
    }
  .jindutiao{
    width: 500px;
    height: 10px;
    float: left;
    margin-top: 10px;
    margin-left: 15px
  }
  .smallplan_box{
    width: 90%;
    height: 100px;
    float: left;
    padding: 10px

  }
  .smallplan{
    width: 95%;
    height: 100px;
    background-color:#F5F5F5;
    margin-top: 10px;
    margin-left: 15px;
  }
  .finishedtask{
    background-color: #008525;
    color: #ffffff;
  }
  .timeouttask{
    background-color: #BC0000;
    color: #ffffff;
  }
  .sonplantitle{
    font-size: 16px;
    font-weight: 700;
    float: left;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    width: 650px;
  }
  .activitytitle{
  position: absolute;
    top: -6px;
    left: 25px;
    white-space: nowrap;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    width: 175px;
    font-weight: 800;
    font-size: 16px
  }
@media screen and (max-width: 1440px){
  .activitytitle{
    position: absolute;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    width: 160px;
    font-weight: 800;
    font-size: 16px
  }
}
  @media screen and (min-width: 2047px){
  .activitytitle{
    position: absolute;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    width: 330px;
    font-weight: 800;
    font-size: 16px
  }
}
  /*.active {*/
      /*background-color: #ffffff;*/
      /*padding-bottom: 35px;*/
      /*color: #0081FE;*/
    /*}*/
  @media screen and (min-width: 2559px){
    .block{
      float: left;
      background-color: #F5F5F5;
      width: 15%
    }
}
  @media screen and (max-width: 1280px){
     .planbox{
        width: 70%;
        position: sticky;
        float: left;
        margin-left: 10px;
      }
   .planstybox{
    width:110px;
     height: 30px;
     background-color: #1abc9c;
     text-align: center;
     line-height: 30px;
     float: right;
     color: #ffffff
  }
    .smallplan_box{
      width: 85%;
      height: 100px;
      float: left;
      padding: 10px
    }
    .sonplantitle{
      font-size: 16px;
      font-weight: 700;
      float: left;
      white-space: nowrap;
      overflow: hidden;
      display: inline-block;
      text-overflow: ellipsis;
      width: 450px;
    }
    .nullbox{
      width: 100%;
      height: 80px;
    }
    .modelaaa{
      display: none;
    }
    .modelbbb{
      display: block;
    }
    .boxtop{
      width: 1080px;
      height: 50px;
      background-color: #F5F5F5;
      overflow: hidden;
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
    .jindutiao{
      width: 300px;
      height: 10px;
      float: left;
      margin-top: 10px;
      margin-left: 15px;
      display: none;
    }
    /*.el-col-21{*/
      /*width: 1240px;*/
    /*}*/
  }
</style>
<!--<div class="objjjj" v-for="obj in this.taskplanbox">-->
  <!--<div class="smallplan" :class="{'nohave':(obj.onshow=='none'),'finishedtask':(obj.status==1),'timeouttask':(obj.timeout==1)}">-->
      <!--<div class="round" :class="{'finishedtask':(obj.status==1),'timeouttask':(obj.timeout==1)}">{{obj.sonnum}}</div>-->
      <!--<div class="smallplan_box" :class="{'finishedtask':(obj.status==1),'timeouttask':(obj.timeout==1)}">-->
          <!--<div class="smallplan_box_top"  style="width: 100%;height: 30px;margin-bottom: 15px">-->
            <!--<span style="font-size: 16px;font-weight: 700;float: left;white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 650px;" @click="jumpfnc(obj)">{{obj.title}}</span>-->
            <!--<div class="planstybox" :class="{'timeouttask':(obj.timeout==1)}">{{obj.typename}}</div>-->
          <!--</div>-->
        <!--<span class="smallplanspan" style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;" :title=obj.content>{{obj.content}}</span>-->
        <!--<br>-->
        <!--&lt;!&ndash;<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>&ndash;&gt;-->
      <!--</div>-->
  <!--</div>-->
<!--</div>-->
