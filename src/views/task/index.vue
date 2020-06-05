<style lang="scss">
  @import "./index";
</style>
<template>
<div>
  <div class="left">
    <el-button type="success" class="Release_task" @click="releasefnc">发布任务</el-button>
    <el-dialog
      title="发布"
      :visible.sync="dialogVisible"
      width="40%"
    @open="openeldialog" @close="closedialog">
      <div class="fabudiv" style="width: 100%;margin-bottom: 15px;position: relative;">
        <iframe :src="iframeurl" v-show="iframeshow"  frameborder="0" style="padding-top:20px;position: absolute;background-color: #ffffff;top: -65px;right: -420px;width: 400px;height: 400px;"></iframe>
        <div class="ding" v-show="dingshow" style="padding-top:20px;position: absolute;background-color: #fff;top: -20px;right: -270px;width: 250px;height: 400px;">
          <el-cascader :props="props" :options="grouparr" :show-all-levels="false" @change="handleChange" style="display: block;margin: auto;"></el-cascader>
          <div class="bottom" style="position: absolute;bottom: 20px;width:100%;">
            <el-button style="margin-left: 25px">取消</el-button>
            <el-button type="success" @click="grouparrqueren" style="float: right;margin-right: 25px">确认</el-button>
          </div>
        </div>

        <span style="margin-right: 20px">选择类别:</span>
        <el-cascader :options="gettypearr" @change="handleChangegettypearr" :show-all-levels="false"></el-cascader>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 20px">发布内容:</span>
        <el-input
          type="textarea"
          placeholder="请输入200字以内的作品介绍"
          v-model="textarea"
          maxlength="200"
          style="width: 400px"
          show-word-limit>
        </el-input>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 20px;">
        <span style="margin-right: 20px;float: left;">添加附件:</span>
        <el-upload
          class="upload-demo"
          action="https://xcx.tddata.net/upload"
          :on-success="successupload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
            multiple
          :limit="8"
          :on-exceed="handleExceed"
          :file-list="fileList"
        style="width: 500px;">
          <el-button size="small" type="primary" @click="clickupload(2)">点击上传</el-button>
          <div slot="tip" class="el-upload__tip" style="display: none;">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 50px">类型:</span>
        <el-cascader :options="leibieoptions" @change="handleChangegetleixin" :show-all-levels="false"></el-cascader>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 50px">建筑:</span>
        <el-cascader :options="building" @change="buildingchange" :show-all-levels="false" style="width:350px;"></el-cascader>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 50px">地点:</span>
        <el-cascader :options="didianarr" @change="didianarrchange" :show-all-levels="false" style="width:350px;"></el-cascader>
        <el-button type="primary" @click="findbim">查看BIM</el-button>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 50px;opacity: 0;">地点:</span>
        <el-input v-model="beizhuinput" placeholder="请输入备注信息" style="width:400px;"></el-input>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right: 10px;">指定负责人:</span>
        <el-button type="primary" @click="addperson()">添加人员</el-button>
        <span v-for="item in this.fabu_people">
          <span style="margin-right: 10px">{{item.name}}</span>
        </span>
      </div>
      <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
        <span style="margin-right:40px;float: left">重要性:</span>
        <el-rate v-model="zhongyaoxing" @change="startchange" :max="3" style="float: left"></el-rate>
      </div>
      <el-button type="primary" @click="fabufnc()" style="width: 100%;margin-top: 20px;">发布</el-button>
    </el-dialog>
    <el-tabs type="border-card" v-model="activeName" @tab-click="mytask">
      <!--任务大厅-->
      <el-tab-pane :label="bannertitle" name="first" style="height: 700px; overflow:scroll;">
        <div class="taskbox1">
          <el-input v-model="chaxuninput" placeholder="请输入姓名，标题搜索" clearable style="width: 420px;margin-left: 20px">
            <el-button slot="append" @click="queryFun" style="background-color:#409EFF;width: 100px;color: #fff;">查询</el-button>
          </el-input>
          <span style="font-size: 14px;margin-left: 50px" @click="jinjianclick">精简筛选条件&nbsp;&nbsp;<i class="el-icon-arrow-down"></i></span>
          <div style="width: 100%;height: 10px;background-color: #fff"></div>
          <div v-show="jinjianshow">
              <span style="margin-left: 20px">类别:</span>
              <template>
              <el-select v-model="value" @change="jinjianleibie" placeholder="所有" style="width: 120px" class="btn1">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
              </el-select>
              </template>

              <span style="margin-left: 35px">类型:</span>
              <template>
              <el-select v-model="value2" @change="jinjianleixing" placeholder="所有" style="width: 120px" class="btn1">
                <el-option v-for="item in options2" :key="item.value2" :label="item.label2" :value="item.label2"></el-option>
              </el-select>
              </template>

              <span style="margin-left: 20px">状态:</span>
              <template>
              <el-select v-model="value3" @change="jinjianzhuangtai" placeholder="所有" style="width: 120px" class="btn1">
                <el-option v-for="item in options3" :key="item.value3" :label="item.label" :value="item.label"></el-option>
              </el-select>
              </template>
          </div>

          <div class="details" v-for="(item,index) in boxinfo1" :key="index" @click="infoshow(item)"> <!--任务信息模块-->
            <div class="details_top">
              <img src="/static/icon/BrowserPreview_tmp%20(2).png" alt="" style="width: 25px;height: 25px;margin-left: 10px;margin-top: 5px;float: left;">
              <span class="details_top_span">{{item.stateall}}</span><span class="details_top_span">—</span><span class="details_top_span">{{item.questions_type}}</span>
              <div class="statebox" :class="{'statered':(item.statecolor==='red'),'stateyellow':(item.statecolor==='yellow'),'stategreen':(item.statecolor==='green'),'stategray':(item.statecolor==='gray')}">{{item.state}}</div>
            </div>
            <div class="imgbox">
              <img :src=item.imgurl alt="">
              <div class="imgbox_yuan" v-show="item.imgboxyuanshow">{{item.obj.info.comment_count}}</div>
            </div>
            <div class="imgbox_right">
              <span class="titleword" @click="infoshow(item)">{{item.title}}</span>
              <div class="peoplebox">
                <span class="originator_span">发起人: <span style="color: #383838" @click="handleNameClick(item.person_id1)">{{item.originator}}</span></span>
                <!--header   负责人-->
                 <span class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian>负责人:<span style="color: #383838" @click="handleNameClick(item.person_id2)">{{item.header}}</span></span>
                <!--qualiter   质检人-->
                 <span  class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian2>质检人:<span style="color: #383838" @click="handleNameClick(item.person_id3)">{{item.qualiter}}</span></span>
              </div>
              <span class="created_time">发布时间:<span style="color: #383838">{{item.created}}</span></span>
              <div class="imgbox_right_bottom">
                <div class="logobox" :class="{'yellow':item.stateall==='任务','zise':item.stateall==='会议','lvse':item.stateall==='通知','anquan':item.stateall==='安全巡检','ziliao':item.stateall==='资料'}">{{item.stateall}}</div>
                <div class="logobox" v-show=item.xian3>{{item.questions_type}}</div>
                <div class="star_block"><el-rate v-model="item.value" disabled :max=3></el-rate></div>
              </div>
            </div>
          </div>
          <!--@current-change当前页数///////@size-change每页多少条数据-->
          <el-pagination background
           layout="prev, pager, next,total,jumper"
           :current-page="currpage"
           :total="infonum"
           :page-sizes='[1,2,3]'
           :page-size="pagesize"
            @current-change='pagechange'
            @size-change='handleSizeChange'>
          </el-pagination>
    </div>
      </el-tab-pane>

      <!--我的任务-->
      <el-tab-pane :label="secondtitle" name="second" style="height: 700px; overflow:scroll;">
        <div class="taskbox1">
          <div class="details" v-for="(item,index) in boxinfo1" :key="index" @click="infoshow(item)"> <!--任务信息模块-->
            <div class="details_top">
              <img src="/static/icon/BrowserPreview_tmp%20(2).png" alt="" style="width: 25px;height: 25px;margin-left: 10px;margin-top: 5px;float: left;">
              <span class="details_top_span">{{item.stateall}}</span><span class="details_top_span">—</span><span class="details_top_span">{{item.questions_type}}</span>
              <div class="statebox" :class="{'statered':(item.statecolor==='red'),'stateyellow':(item.statecolor==='yellow'),'stategreen':(item.statecolor==='green'),'stategray':(item.statecolor==='gray')}">{{item.state}}</div>
            </div>
            <div class="imgbox">
              <img :src=item.imgurl alt="">
              <div class="imgbox_yuan" v-show="item.imgboxyuanshow">{{item.obj.info.comment_count}}</div>
            </div>
            <div class="imgbox_right">
              <span class="titleword" @click="infoshow(item)">{{item.title}}</span>
              <div class="peoplebox">
                <span class="originator_span">发起人: <span style="color: #383838" @click="handleNameClick(item.person_id1)">{{item.originator}}</span></span>
                <!--header   负责人-->
                 <span class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian>负责人:<span style="color: #383838" @click="handleNameClick(item.person_id2)">{{item.header}}</span></span>
                <!--qualiter   质检人-->
                 <span  class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian2>质检人:<span style="color: #383838" @click="handleNameClick(item.person_id3)">{{item.qualiter}}</span></span>
              </div>
              <span class="created_time">发布时间:<span style="color: #383838">{{item.sendTime}}</span></span>
              <div class="imgbox_right_bottom">
                <div class="logobox" :class="{'yellow':item.stateall==='任务','zise':item.stateall==='会议','lvse':item.stateall==='通知','anquan':item.stateall==='安全巡检','ziliao':item.stateall==='资料'}">{{item.stateall}}</div>
                <div class="logobox" v-show=item.xian3>{{item.questions_type}}</div>
                <div class="star_block"><el-rate v-model="item.value" disabled :max=3></el-rate></div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div class="rilitop">
    <div class="taskstate" style="background-color: #1abc9c;">
      <span class="taskstatespan1">5</span>
      <span class="taskstatespan2">进行中</span>
      <img src="../../../static/taskindex/进行中.png" alt="">
    </div>
    <div class="taskstate" style="background-color: #bc1a1a">
      <span class="taskstatespan1">2</span>
      <span class="taskstatespan2">待认领</span>
      <img src="../../../static/taskindex/待认领.png" alt="" style="width: 55px;height: 60px;margin-top: 20px">
    </div>
    <div class="taskstate" style="background-color: #3692ff">
       <span class="taskstatespan1">2</span>
      <span class="taskstatespan2">已发布</span>
      <img src="../../../static/taskindex/发布.png" alt="" style="width: 55px;height: 55px;margin-top: 20px">
    </div>
  </div>
  <div class="rili">
    <full-calendar :config="config" @event-selected="eventClick()" @dateClick="nowdayfnc()" :events="events"></full-calendar>
  </div>
</div>
</template>

<script>
  import 'fullcalendar/dist/locale/zh-cn'
  import { getToken } from '@/utils/auth'
  export default {
    name: 'index',
    data() {
      return {
        jinjianshow:false,
        iframeurl:'',
        iframeshow:false,
        bannertitle:'任务大厅(0)',
        dialogVisible:false,
        textarea:'',
        fileList:[],
        beizhuinput:'',
        gettypearr:[],
        zhongyaoxing:null,
        getcategory_flowid:'',
        building:[],
        buileding_fowlid:'',
        didianarr:[],
        optionmodel:'',
        dingshow:false,
        optionGroups:[],
        props:{ multiple: true},
        grouparr:[],
        aaaa:[],
        fabufncflowid:'',
        fabuquestions_type:'',
        fabustartvalue:'',
        fabu_people:[],
        bimitemid:'',
        datalistfrom: {
          title: "",
          modify_count: 0,
          check_count: 0,
          basic: [{
            lx:"basic",
            id:"questions_photo",
            lable:"现场拍摄",
            type:"multi_attach",
            value:[]
            },{
            lx:"basic",
            id:"questions_photo",
            lable:"附件",
            type:"files",
            value:[]
            },{
            id:"questions_remark",
            lx:"basic",
            lable:"问题描述",
            type:"multi_text",
            value:"",
            voicelst:""
            }],
          time: "",
          address: "",
          receive: [],
          modify_check: [],
          receiver:""
        },
        fabuadress:'',
        secondtitle:"我的任务(0)",
        fullscreenLoading: false,//页面加载
        activeName:'second',
        chaxuninput:'',
        personlist:'',
        bimopen:[],
        mybox:[],//我的任务
        flow_word:'',
        qtype_word:"",
        loginname:'',
        currpage:1,
        pagesize: 20,
        boxinfo1:[],
        thirdinfo:[],
        infonum:0,
        listbox:[],
        boxinfo:[{
          maxnum:3,
          title:'',
          imgurl:'',
          originator:'',
          flowId:'',
          xian:false,
          xian2:false,
          xian3:true,
          stateall:'11111',
          didiandataarr:[],
          workId:'',
          questions_type:'资料',
          created:'2019年9月2日 13:09:30',
          endtime:'2019年11月2日 13:09:30',
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          value:2,
        }],
        didian: [],
        leibieoptions:[],
        options: [{ value: '选项1', label: '任务' }, { value: '选项2', label: '通知' }, { value: '选项3', label: '会议' },
          { value: '选项4', label: '资料' },{ value: '选项5', label: '安全' },{ value: '选项6', label: '计划'}],
        value: '',
        options2: [{ value2: '1', label2: '安全' }, { value2: '2', label2: '质量' }, { value2: '3', label2: '技术' },
          { value2: '4', label2: '施工' }, { value2: '5', label2: '资料' }, { value2: '6', label2: '财务' },
          { value2: '7', label2: '物资' }, { value2: '8', label2: '劳务' }, { value2: '9', label2: '法务预算' },
          { value2: '10', label2: '综合' }, { value2: '11', label2: '平台技术' }],
        value2:'',
         options3: [{ value3: '选项1', label: '进行中' }, { value3: '选项2', label: '已完成' }, { value3: '选项3', label: '超时' }],
        value3:'',
        options4: [{ value4: '选项1', label: '待办' }, { value4: '选项2', label: '完成' }, { value4: '选项3', label: '我的发布' }],
        value4:'',
        postdata:[],
        events: [],
        config: {
          buttonText: { today: '今天', month: '月', week: '周', day: '日' },
          locale: 'zh-cn',
          editable: false, // 是否允许修改事件
          selectable: false,
          eventLimit: 4, // 事件个数
          allDaySlot: false, // 是否显示allDay
          defaultView: 'month', // 显示默认视图
          eventClick: this.eventClick, // 点击事件
          dayClick: this.dayClick // 点击日程表上面某一天
        }
      }
    },
    created:function (){
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {//组别
        return this.$store.state.project.projectGroupList
      },
      person_info(){
        return this.$store.state.person.personInfo
      },
      projectPersonList() {//人员列表信息
        return this.$store.state.project.projectPersonList
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal',curVal,oldVal)
        this.currpage = 1
        this.thirdinterface()
        this.mytaskfnc()
        // this.allpersondata()
        // console.log("this.person_info",this.person_info)
      },
    },
    mounted(){
      if (this.project_id !== null) {
        this.currpage = 1
        this.mytaskfnc()
        this.getPerson()
        this.thirdinterface()
        // this.allpersondata()
        this.getpersonlist()
      }
    },
    methods:{
      openeldialog(){//打开发布任务窗口
        console.log("组别",this.projectGroupList)
        // console.log("token=====",getToken())
        this.getcategory()
        this.gettype()
        this.getmodel()
        this.getpersonlist()
        // this.getdidian()
      },
      closedialog(){
        this.dingshow=false
        this.textarea=""
        this.gettypearr=null
        this.leibieoptions=null
        this.building=null
        this.didianarr=null
        this.beizhuinput=""
        this.fabu_people=[]
        this.fileList=[]
        this.zhongyaoxing=null
      },
      eventClick(event){
        console.log("日历点击成功",event)
      },
      nowdayfnc(data){
        console.log("当天",data)
      },
      jinjianclick(){//精简条件显示开关
        this.jinjianshow=!this.jinjianshow
      },
      jinjianleibie(){
        this.queryFun()
      },
      jinjianleixing(){
        this.queryFun()
      },
      jinjianzhuangtai(){
        this.queryFun()
      },
      clickupload(e){
        console.log("上传-------",e)
      },
      gettype() {//类型
        return new Promise((resolve, reject) => {
          const param = {
            method:'get_flow_list',
            project_id: this.project_id
          }
          this.$store.dispatch('SafeInspection', param).then((data) => {
            console.log('要获取到的类型',data.data)
            this.gettypearr=[]
            for (let i=0;i<data.data.length;i++){
              if(data.data[i].flowId=="PlanFlow01"){
                this.gettypearr.push({ label:"计划", value:i,flowid:data.data[i].flowId })
              }
              if(data.data[i].flowId=="ProblemFindSolve01"){
                this.gettypearr.push({ label:"任务", value:i,flowid:data.data[i].flowId })
              }
              if(data.data[i].flowId=="Meeting01"){
                this.gettypearr.push({ label:"会议", value:i,flowid:data.data[i].flowId })
              }
              if(data.data[i].flowId=="Documents01"){
                this.gettypearr.push({ label:"资料", value:i,flowid:data.data[i].flowId })
              }
              if(data.data[i].flowId=="Notice01"){
                this.gettypearr.push({ label:"通知", value:i,flowid:data.data[i].flowId })
              }
              if(data.data[i].flowId=="SafetyInspection01"){
                this.gettypearr.push({ label:"安全", value:i,flowid:data.data[i].flowId })
              }
            }
            console.log("getarr",this.gettypearr)
          }).catch(() => {
            resolve()
          })
        })
      },
      gettypearrchange(index){
        this.getcategory_flowid=this.gettypearr[index].flowid
        console.log("getcategory_flowid",this.getcategory_flowid,index)
        this.getcategory()
      },
      getcategory(){//类别
        this.leibieoptions=[]
        console.log("flow_id",this.getcategory_flowid)
          const param = {
            method:'get_questions_type',
            project_id: this.project_id,
            flow_id:this.getcategory_flowid
          }
          this.$store.dispatch('SafeInspection', param).then((data) => {
            console.log('要获取到的类别',data.data,typeof data.data)
            if(typeof data.data=='object'){
              for(let i=0;i<data.data.length;i++){
                this.leibieoptions.push({label:data.data[i],value:i})
              }
            }
          }).catch(() => {
            resolve()
          })
      },
      getmodel(){//建筑模型
        const param = {
            method:'project_items',
            project_id: this.project_id
          }
          this.$store.dispatch('GetItemInfoListByItemIDs', param).then((data) => {
            console.log("建筑模型",data)
            var aaa=[]
            //提出模型名字
            for(let i=0;i<data.length;i++){
              if(data[i].name!=""){
                aaa.push({label:data[i].name,value:data[i].file_id})
              }
            }
            this.building=aaa
             console.log("建筑列表",this.building)
          })
      },
      getdidian(){//地点     建筑---地点
        return new Promise((resolve, reject) => {
          const param = {
            method:'GetViewpointsByFileId',
            file_id:this.buileding_fowlid,
            project_id: this.project_id
          }
          this.$store.dispatch('GetItemInfoListByItemIDs', param).then((data) => {
            console.log("地点data",data)
            this.didiandataarr=data
            this.didianarr=[]
            this.didian=[]
            var aaa=[]
            var newarr=[]
            //提出楼层
            for(let i=0;i<data.length;i++){
              if(data[i].floor_name!=""){
                aaa.push(data[i].floor_name)
              }
            }
            for(let i=0;i<aaa.length;i++){
              if(newarr.indexOf(aaa[i])==-1){
                newarr.push(aaa[i])
              }
            }
            for(let j=0;j<newarr.length;j++){
              newarr.splice(j,1,{label:newarr[j],value:j,children:[]})
            }
            // 楼层提出结束
            for(let i=0;i<data.length;i++){
              if(data[i].floor_name!=""){
                for(let j=0;j<newarr.length;j++){
                  if(newarr[j].label==data[i].floor_name){
                    newarr[j].children.push({label:data[i].name,value:data[i].id,itemid:"第"+data[i].floor_name+"层"+data[i].name})
                  }
                }
              }
            }
            this.didianarr=newarr
            console.log("地点数组",this.didianarr)
            // console.log("aaa",newarr)
          }).catch(() => {
            resolve()
          })
        })
      },
      addperson(){
        this.grouparr=[]
        this.aaaa=[]
        for(let i=0;i<this.projectPersonList.length;i++){
            this.grouparr.push([this.projectPersonList[i].group_name_level[0],this.projectPersonList[i].group_name_level[1]])//拿到全部人员
        }
        for(let j=0;j<this.grouparr.length;j++){
          // console.log("bianli---->",j,this.grouparr[j][0])
          if(this.aaaa.indexOf(this.grouparr[j][0]) == -1){//去除重复数组
            this.aaaa.push(this.grouparr[j][0])
          }
        }
        for(let i=0;i<this.grouparr.length;i++){
          for(let j=0;j<this.aaaa.length;j++){
            if(this.aaaa[j]==this.grouparr[i][0]){
              this.aaaa.splice(j,1,{label:this.aaaa[j],value:j,children:[{label:this.grouparr[i][1],value:"1"}]})
            }
          }
        }
        console.log("人员信息",this.projectPersonList)
          this.aaaa.forEach(item=>{
            item.children[0]["children"]=[]
          })
        for(let i=0;i<this.projectPersonList.length;i++){
          for (let j=0;j<this.aaaa.length;j++){
            if(this.projectPersonList[i].group_name_level[1]==this.aaaa[j].children[0].label){
              this.aaaa[j].children[0].children.push({label:this.projectPersonList[i].name,value:this.projectPersonList[i].person_id,personname:this.projectPersonList[i].name})
            }
          }
        }
        this.grouparr=this.aaaa
        this.dingshow=true
        console.log("this.aaaa",this.aaaa)
        console.log("gettypearr",this.grouparr)
      },
      fabufnc(){//发布任务
        let namebox=""
        for(let i=0;i<this.fabu_people.length;i++){
          namebox=namebox+"@"+this.fabu_people[i].name
        }
        this.datalistfrom.title=namebox+this.textarea
        this.datalistfrom.receiver=this.fabu_people
        console.log("发布任务",this.datalistfrom)
        this.fabusuccessfnc()
        const _param = {
          method: 'start_issue',
          project_id: this.project_id,
          questions_type:this.fabuquestions_type,
          title:namebox+this.textarea,
          flow_id:this.fabufncflowid,
          priority: this.fabustartvalue,
          form:this.datalistfrom,
          subjectionId:"",
          nosend:1
        }
        this.$store.dispatch('GetAllInstList', _param).then((data) => {
          console.log("任务发布成功",data)
          this.fabusuccessfnc()
        })
      },
      fabusuccessfnc(){
        this.$alert('发布成功', '', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${ action }`
            });
          }
        })
        this.textarea=""
        this.gettypearr=null
        this.leibieoptions=null
        this.building=null
        this.didianarr=null
        this.beizhuinput=""
        this.fabu_people=[]
        this.fileList=[]
        this.zhongyaoxing=null
      },
      grouparrqueren(){
        this.dingshow=false
      },
      handleChange(value) {//选择指定人员
        // this.grouparr    projectPersonList
        console.log("选择人员",value);
        for(let i=0;i<value.length;i++){
          this.fabu_people.push({name:'',id:value[i][2]})
        }
        for(let i=0;i<this.fabu_people.length;i++){
          for(let j=0;j<this.projectPersonList.length;j++){
            if(this.fabu_people[i].id==this.projectPersonList[j].person_id){
              this.fabu_people[i].name=this.projectPersonList[j].name
            }
          }
        }
        console.log("获取到的ID",this.fabu_people)
      },
      handleChangegettypearr(index){//更换类别
        console.log("index类别",index)
        this.getcategory_flowid=this.gettypearr[index].flowid
        this.fabufncflowid=this.gettypearr[index].flowid
        this.getcategory()
      },
      handleChangegetleixin(index){
        console.log("index获取到的类型",index,this.leibieoptions[index[0]].label)
        this.fabuquestions_type=this.leibieoptions[index[0]].label
      },
      buildingchange(index){//更换建筑
        console.log("地点index",index[0])
        this.buileding_fowlid=index[0]
        this.getdidian()
      },
      didianarrchange(index){//更换地点
        this.bimopen=[]
        console.log("地点index",index[1])
        this.bimitemid=index[1]
        console.log("aaaaaaaaaaa",this.bimitemid)
        for(let i=0;i<this.didiandataarr.length;i++){
          if(index[1]==this.didiandataarr[i].id){
            this.bimopen.push(this.didiandataarr[i].camera_info,this.didiandataarr[i].id)
          }
        }
        console.log("bim-----",this.bimopen)
        this.datalistfrom.address={
          id:"questions_address",
          lx:"basic",
          lable:"地点",
          type:"text",
          value:index[1],
          lat:"",
          lon:"",
          address:"",
          address_id:"",
          pvid:""
        }
      },
      findbim(){
        console.log("this.projectid",this.bimopen)
        if(this.bimopen.length!=0){
          this.iframeshow=!this.iframeshow
          this.iframeurl="https://xcx.tddata.net/smz/#/xcx/pvshow?projectid="+this.project_id+"&"+"pvid="+this.bimopen[1]+"&"+"token="+getToken()
        }
      },
      pagechange (e) {//每页多少条数据
      this.currpage = e
      // console.log(this.currpage)
      this.allpersondata()
        // this.secondpage()
      },
      startchange(index){//改变星级
        console.log("改变星级别",index)
        this.fabustartvalue=index
      },
      getpersonlist(){//人员列表信息接口
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          console.log("人员信息projectPersonList",this.projectPersonList)
        }).catch(() => {

        })
      },
      secondpage(){
        this.boxinfo1=this.boxinfo
        // console.log('页面渲染页面数据',this.boxinfo1)
        //整理筛选出需要传递的参数
        this.postdata=[]
        this.boxinfo1.forEach(item=>{
          this.postdata.push(item.workId)
           item.imgurl='https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id='+item.workId+'&w=220'
        })
        //调用接口
        this.getlistinfo()
      },
    handleSizeChange (e) {
      this.pagesize = e
    },
      getPerson() {
        return new Promise((resolve, reject) => {
          const param = {
            method: 'query'
          }
          this.$store.dispatch('QueryPersonInfo', param).then((data) => {
            console.log('当前登陆人员',data.person.name)
            this.loginname=data.person.name
          }).catch(() => {
            resolve()
          })
        })
      },
    allpersondata() {
      const _param = {
        method: 'query_task_all',
        project_id: this.project_id,
        page:this.currpage
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
        console.log("第一接口返回成功",data)
        console.log('第一接口数据Allpersondata',data.data)
        console.log("++++",this.events)
        this.getpersonlist()
        this.infonum=data.count
        this.bannertitle="任务大厅("+data.count+")"
        this.boxinfo=[]
        this.boxinfo1=[]
        this.boxinfo=data.data
        this.events=[]
        //事件监听flowid,判断任务类型
        this.boxinfo.forEach(item=>{
          if(item.flowId==="Meeting01"){
            item.stateall='会议'
          }
          if(item.flowId==="ProblemFindSolve01"){
            item.stateall='任务'
          }
          if(item.flowId==="SafetyInspection01"){
            item.stateall='安全巡检'
          }
          if(item.flowId==="Notice01"){
            item.stateall='通知'
          }
          if(item.flowId==="Documents01"){
            item.stateall='资料'
          }
           if(item.flowId==="PlanFlow01"){
            item.stateall='计划'
          }
        })
        //页面刷新自动去第一页
        this.secondpage()
      })
    },
      handleNameClick(row) {//人物名字
        console.log("人物列表",this.projectPersonList)
        this.projectPersonList.forEach(item=>{
          if(row==item.person_id){
            this.personlist=item
            console.log("符合的ID人",item.name)
          }
        })
        const param = {
          show: true,
          ...this.personlist
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      getlistinfo(){
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        const _param = {
        method: 'get_nodes_users_list',
        project_id: this.project_id,
        work_ids:this.postdata
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
         // console.log("第二接口返回成功",data.data)
        this.listbox=data.data
        let mar1=[]
        let map1= new Map()
        for(var i in this.listbox){
          map1.set(i,this.listbox[i])//添加key值
        }
        // console.log(map1)
        let box = []
        this.boxinfo1.forEach(item=>{
          let workId = item.workId
          // console.log('------info',map1.get(workId).info)
          item['obj']=map1.get(workId)//把接口2获取到的文档配置到数据中
          item["state"]="1"//任务状态
          item["xian"]=false//负责人显示
          item["xian2"]=false//质检人显示
          item["xian3"]=false//第二类人物类型
          item["imgurl"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id='+item.workId+'&w=220'
          item["getinfo"]=map1.get(workId).info.flowNode[0]//获取到显示任务类型的配置数据
          item["originator"] = map1.get(workId).Start[0].userName//获取懂啊key值对应的数据   info.priority
          if(item.questions_type!=""){
            item["xian3"]=true
          }
          if(map1.get(workId).info!=undefined){
            item["value"]=map1.get(workId).info.priority//任务星级
          }
          if(item.obj.Node2!=undefined){
            item["person_id1"]=item.obj.Node1[0].userId//发起人ID
          }
          if(item.flowId!=null){
            item["flowId2"]=item.flowId.slice(0,item.flowId.length-2)//截取字符，判断任务类型，和接口文档匹配
          }
            if(item.obj.info.comment_count==0){
              item["imgboxyuanshow"]=false
            }
            if(item.obj.info.comment_count!=0){
              item["imgboxyuanshow"]=true
            }
          if(item.obj.Node2!=undefined){
            item["firstname"]=item.obj.Start[0].userName
            item["header"]=item.obj.Node2[0].userName//负责人
            item["person_id2"]=item.obj.Node2[0].userId//负责人ID
            item.xian=true
          }else {
            item.xian=false
          }
          if(item.obj.Node5!=undefined){
            item["qualiter"]=item.obj.Node5[0].userName//质检人
            item["person_id3"]=item.obj.Node5[0].userId//负责人ID
            item.xian2=true
          }else {
            item.xian2=false
          }
          //和第三接口配置文档进行匹配
          if(this.thirdinfo[item.flowId2]!=""){
           let _config = this.thirdinfo[item.flowId2]
            let _node = _config[item.getinfo]
            if (_node !== undefined){
              item.state = _node.status
              item["statecolor"]=_node.color
            }else{
              // item.state = item.getinfo
              item.state = "已完成"
            }
            loading.close();
          }
          box.push(item)
        })
        if(this.boxinfo.length==20){
            for (let i=0;i<this.boxinfo.length;i++){//我的任务日历渲染
          if(this.boxinfo[i].statecolor=="red"){
            this.events.push({
            title: this.boxinfo[i].title, // 事件内容
            start: this.boxinfo[i].created, // 事件开始时间
            end: this.boxinfo[i].created, // 事件结束时间
            color: '#FF0000', // 事件的显示颜色
            })
          }
          if(this.boxinfo[i].statecolor=="yellow"){
            this.events.push({
            title: this.boxinfo[i].title, // 事件内容
            start: this.boxinfo[i].created, // 事件开始时间
            end: this.boxinfo[i].created, // 事件结束时间
            color: '#9ACD32' // 事件的显示颜色
            })
          }
          if(this.boxinfo[i].statecolor=="green"){
            this.events.push({
            title: this.boxinfo[i].title, // 事件内容
            start: this.boxinfo[i].created, // 事件开始时间
            end: this.boxinfo[i].created, // 事件结束时间
            color: '#008000' // 事件的显示颜色
            })
          }
          if(this.boxinfo[i].statecolor=="gray"){
            this.events.push({
            title: this.boxinfo[i].title, // 事件内容
            start: this.boxinfo[i].created, // 事件开始时间
            end: this.boxinfo[i].created, // 事件结束时间
            color: '#BABABA' // 事件的显示颜色
            })
          }
        }
        }else {
            for (let i=0;i<this.boxinfo.length;i++){//我的任务日历渲染
            if(this.boxinfo[i].statecolor=="red"){
              this.events.push({
              title: this.boxinfo[i].title, // 事件内容
              start: this.boxinfo[i].sendTime, // 事件开始时间
              end: this.boxinfo[i].sendTime, // 事件结束时间
              color: '#FF0000' // 事件的显示颜色
              })
            }
            if(this.boxinfo[i].statecolor=="yellow"){
              this.events.push({
              title: this.boxinfo[i].title, // 事件内容
              start: this.boxinfo[i].sendTime, // 事件开始时间
              end: this.boxinfo[i].sendTime, // 事件结束时间
              color: '#9ACD32' // 事件的显示颜色
              })
            }
            if(this.boxinfo[i].statecolor=="green"){
              this.events.push({
              title: this.boxinfo[i].title, // 事件内容
              start: this.boxinfo[i].sendTime, // 事件开始时间
              end: this.boxinfo[i].sendTime, // 事件结束时间
              color: '#008000' // 事件的显示颜色
              })
            }
            if(this.boxinfo[i].statecolor=="gray"){
              this.events.push({
              title: this.boxinfo[i].title, // 事件内容
              start: this.boxinfo[i].sendTime, // 事件开始时间
              end: this.boxinfo[i].sendTime, // 事件结束时间
              color: '#BABABA' // 事件的显示颜色
              })
            }
          }
        }
        this.boxinfo1 = box
      })
      },
      thirdinterface(){
        const _param = {
          method: 'cfg_nodes',
          project_id: this.project_id,
        }
        this.$store.dispatch('Allinfodictionary', _param).then((data) => {
          this.thirdinfo=data
          this.activeName="second"
          console.log("第三接口",this.thirdinfo)
        })
      },

      queryFun(){
        console.log("查询按钮获取信息",this.value,this.value2,this.value3)//flow_word
        if(this.value=="任务"){//任务，通知，会议，资料,安全,计划
          this.flow_word="ProblemFindSolve01"
        }
        if(this.value=="会议"){
          this.flow_word="Meeting01"
        }
        if(this.value=="通知"){
          this.flow_word="Notice01"
        }
        if(this.value=="资料"){
          this.flow_word="Documents01"
        }
        if(this.value=="安全"){
          this.flow_word="SafetyInspection01"
        }
        if(this.value=="计划"){
          this.flow_word="PlanFlow01"
        }
        if(this.value3=="进行中"){
          this.qtype_word="inProgress"
        }
        if(this.value3=="已完成"){
          this.qtype_word="hasDone"
        }
        console.log("更改选择条件",this.qtype_word,this.flow_word)
        const _param = {
        method: 'query_task_all_list',
        project_id: this.project_id,
        flow_id:this.flow_word,//value
        qtype:this.qtype_word,//完成未完成
        questions_type:this.value2,//安全，技术平台
        keyword:this.chaxuninput,//输入框
        page:this.currpage
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
          console.log("查询按钮",data)
          this.infonum=data.count
          this.bannertitle="任务大厅("+data.count+")"
        this.boxinfo1=[]
        this.boxinfo=data.data
        //事件监听flowid,判断任务类型
        this.boxinfo.forEach(item=>{
          if(item.flowId==="Meeting01"){
            item.stateall='会议'
          }
          if(item.flowId==="ProblemFindSolve01"){
            item.stateall='任务'
          }
          if(item.flowId==="SafetyInspection01"){
            item.stateall='安全巡检'
          }
          if(item.flowId==="Notice01"){
            item.stateall='通知'
          }
          if(item.flowId==="Documents01"){
            item.stateall='资料'
          }
          if(item.flowId==="PlanFlow01"){
            item.stateall='计划'
          }
        })
        //页面刷新自动去第一页
        this.secondpage()
      })
      },
      infoshow(index){
        console.log("详情页面展示信息",index)
        // console.log(this.boxinfo1.indexOf(index))   获取到当前元素的索引
        const param = {
          show: true,
          data:index
        }
        this.$store.dispatch('SetInfoDialog', param).then(() => {}).catch(() => {
        })
      },
      releasefnc(){
        this.dialogVisible=true
      },
      mytaskfnc(){
        const _param = {
            method: 'get_todo_list',
            project_id: this.project_id,
            qtype:"TodoList,BackLog,MatterRead"
          }
          this.$store.dispatch('GetAllInstList', _param).then((data) => {
            console.log("我的任务",data)
            this.secondtitle="我的任务("+data.length+")"
             this.boxinfo=[]
            this.boxinfo1=[]
            this.boxinfo=data
            this.events=[]
            // console.log("日历提取父容器",this.boxinfo)
            //我的任务日历
            // console.log("我的任务日历",this.events)
            //事件监听flowid,判断任务类型
            this.boxinfo.forEach(item=>{
              if(item.flowId==="Meeting01"){
                item.stateall='会议'
              }
              if(item.flowId==="Documents01"){
                item.stateall='资料'
              }
              if(item.flowId==="PlanFlow01"){
                item.stateall='计划'
              }
              if(item.flowId==="ProblemFindSolve01"){
                item.stateall='任务'
              }
              if(item.flowId==="SafetyInspection01"){
                item.stateall='安全巡检'
              }
              if(item.flowId==="Notice01"){
                item.stateall='通知'
              }
            })
            //页面刷新自动去第一页
            this.secondpage()
          })
      },
      //我的任务
      mytask(tab, event){
        if(tab.name=='second'){
          this.mytaskfnc()
        }else {
          this.allpersondata()
        }
      },
      successupload(response,file, fileList){//图片样式更改
        console.log("图片信息返回",response)
        // console.log("文件返回",response.filename)
        let typestr=file.raw.type.toString()
        let aaa=typestr.slice(0,5)
        if(aaa==="image"){
          this.datalistfrom.basic[0].value.push({localsrc:"",lx:"image", src:response.filename})
        }else {
          this.datalistfrom.basic[1].value.push({name:response.url,path:response.filename})
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择8个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      }
    }
  }
</script>

<style scoped>
  .left{
    width: 650px;
    margin-left: 15px;
    margin-top: 25px;
    box-shadow:0px 0px 30px #4a4c4b;
    position: relative;
    float: left;
  }
  .rilitop{
    width: 750px;
    height: 80px;
    margin-left: 15px;
    margin-top: 25px;
    float: left;
  }
  .taskstate{
    width: 160px;
    height: 100%;
    border-radius: 15px;
    margin-right: 15px;
    float: left;
  }
  .taskstate img{
    float: right;
    width: 55px;
    height: 80px;
    margin-top: 0px;
  }
  .taskstatespan1{
    line-height: 80px;
    font-size: 40px;
    margin-left: 20px;
    font-weight: 800;
    color: #ffffff;
  }
  .taskstatespan2{
    line-height: 100px;
    font-size: 18px;
    color: #ffffff;
  }
  .rili{
    width: 750px;
    padding: 10px;
    box-shadow:0px 0px 30px #4a4c4b;
    margin-left: 15px;
    margin-top: 25px;
    float: left;
  }
  .Release_task{
    position: absolute;
    right: 10px ;
    top: 5px;
    z-index: 10;
    height: 30px;
    line-height: 10px;
  }
  .taskbox1{
    width: 100%;
    height: 100%;
    margin-top: 10px;
  }
  .taskbox1 span{
    margin-left: 5px;
  }
  .btn1{
    border: none;
    margin-right: 10px;
  }
  .details{
    width: 580px;
    height: 180px;
    border: 1px solid #e7e7e7;
    margin:25px auto;
    position: relative;
  }
  .details_top{
    width: 100%;
    height: 35px;
    border-bottom: 1px solid #e7e7e7;
    margin-bottom: 25px;
  }
  .details_top_span{
    display: block;
    float: left;
    line-height: 35px;
    font-weight: 800;
    font-size: 14px;
  }
  .imgbox{
    position: relative;
    width: 122px;
    height: 102px;
    display: inline-block;
    float: left;
    margin-left: 10px;
    background-color: #3A71A8;
  }
  .imgbox img{
    width: 100%;
    height: 100%;
    display: block;
    float: left;
  }
  .imgbox_right{
    width: 440px;
    height: 102px;
    float: left;
    padding-left: 12px;
    position: relative;
  }
  .imgbox_yuan{
    position: absolute;
    right: -8px;
    top:-8px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    font-size: 14px;
    text-align: center;
    line-height: 20px;
    color: #EBEEF5;
    background-color: red;
  }
  .star_block{
    position: absolute;
    top: 5px;
    right: 0;
  }
  .titleword{
    display: block;
    font-size: 15px;
    font-weight: 500;
    float: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .peoplebox{
    width: 430px;
    height: 30px;
    float: left;
  }
  .statebox{
    width: 60px;
    height: 20px;
    background-color: #BABABA;
    color: #fff;
    float: right;
    margin-right: -5px;
    margin-top: 7px;
    font-size: 13px;
    text-align: center;
    line-height: 20px;
  }
  .originator_span{
    display: block;
    margin-top: 7px;
     margin-left: 10px;
    font-size: 13px;
    font-weight: 500;
    float: left;
    color: #a8a8a8;
    width: 100px;
  }
  h2{
    margin-left: 10px;
    font-size: 13px;
    font-weight: 500;
    float: left;
    color: #a8a8a8;
    width: 100px;
  }
  .created_time{
    display: block;
    margin-left: 10px;
    margin-top: -2px;
    width: 350px;
    font-size: 13px;
    font-weight: 500;
    float: left;
    color: #a8a8a8;
  }
  h4{
    display: block;
    margin-left: 10px;
    margin-top: -8px;
    width: 350px;
    font-size: 13px;
    font-weight: 500;
    float: left;
    color: #aaaab2;
    margin-bottom: 5px;
  }
  .imgbox_right_bottom{
    width: 97%;
    height: 30px;
    position: absolute;
    bottom: 0;
  }
  .logobox{
    float: left;
    width: 60px;
    margin-left: 5px;
    margin-top: 10px;
    height: 20px;
    border: 1px solid #1abc9c;
    font-size: 12px;
    text-align: center;
    line-height: 18px;
    color: #1abc9c;
  }
  .ziliao{
     border: 1px solid #3498DB;
    color: #3498DB;
  }
  .yellow{
    border: 1px solid #1ABC9C;
    color: #1ABC9C;
  }
  .zise{
    border: 1px solid #F04844;
    color: #F04844;
  }
  .anquan{
    border: 1px solid #657180;
    color: #657180;
         }
  .lvse{
    border: 1px solid #FFA847;
    color: #FFA847;
  }

  /*状态信息颜色*/
  .statered{
    background-color: red;
  }
  .stategray{
    background-color: #BABABA;
  }
  .stateyellow{
    background-color: yellowgreen;
  }
  .stategreen{
    background-color: green;
  }
  /*人物详情页面*/
  .personinfo{
    position: absolute;
    left: 300px;
    width: 50px;
    height: 50px;
    background-color: #1abc9c;
  }
</style>
