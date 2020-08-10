<template>
    <el-dialog title="添加新计划" :visible.sync="addnewplandialog" width="95%"  @close="closeneeplandialog" v-dialogDrag>
        <div>
          <el-row :gutter="10" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-col :span="24" style="background-color: #F9F9F9;">
               <!--<div class="boxtop">-->
                <!--<div class="boxtop_left" @click="comebackplan()">返回计划列表</div>-->
                <!--&lt;!&ndash;<div class="boxtop_right">新增计划</div>&ndash;&gt;-->
              <!--</div>-->
              <div class="plantoon" v-show="leftindexshow">
                <el-cascader v-model="jihuavalue" :options="optionstype" @change="handleChangetypetid" style="width: 150px;border: none;"></el-cascader>
                <el-input v-model="input" placeholder="请输入计划名称" style="width: 320px"></el-input>
                <div class="planstyle">
                  <el-date-picker
                    v-model="value1"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" style="width: 480px;margin-top: 20px">
                  </el-date-picker>
                </div>
                <el-input type="textarea" v-model="desc" :rows="10"></el-input>
                <div @click="releaseplan" style="width: 100%;height: 40px;text-align: center;line-height: 40px;background-color: #169BD5;color: #ffffff;margin-top: 20px;border-radius: 10px">
                  发布实施任务</div>
                <div style="width: 600px;margin-top: 10px;color: #34ba9c"><i class="el-icon-circle-plus-outline" style="float: left;display: block;margin-top: 10px;"></i><span style="float: left;display: block;margin-top: 7px" @click="sonplanshow">添加所属计划</span>
                  <el-cascader style="float: left;margin-left: 15px;width: 300px" v-show="plannewshow" v-model="plannewvalue" :options="plannewop" @change="plannewhandleChange"></el-cascader>
                </div>
                <!--<el-cascader-panel :options="plannewop"></el-cascader-panel>-->
              </div>
              <!--//暂无实施计划-->
              <div class="newplanxijie">
                <div class="nulldiv" v-show="planshow">
                  暂无计划内容
                </div>
                <!--有计划-->
                <!--<div class="newplanxijie_1_top" v-show="planshow2">新增实施计划</div>-->
                <div v-for="item in this.numbox">
                    <div class="newplanxijie_1" v-show="planshow2">
                      <div class="newplanxijie_1_box">
                        <span class="newplanxijie_1_box_span1">{{item.name}}</span>
                        <span style="display: block;color: #0a76a4;line-height: 70px">实施计划</span>
                        <!--<div class="jump" :class="{'classdonot':item.block=='donot'}" @click="releasefnc(item.name)">-->
                        <div class="jump"  @click="releasefnc(item.name)">
                          <i class="el-icon-right fabuimg" v-if="item.blockshow1" style="font-size: 30px;color: #ffffff"></i>
                          <span class="fabuon" v-if="item.blockshow2">已发布</span>
                        </div>
                      </div>
                    </div>
                </div>
                <div class="faqijihua" v-show="faqijihuashow" style="width: 100%;height: 80px;float: left;text-align: center;line-height: 50px;margin-top: 20px">
                    <div style=" box-shadow:0px 0px 30px #e5e5e5;width: 180px;color:#fff;border-radius:20px;height: 50px;background-color: #1ABC9C;margin: auto" @click="planinititate">发起计划</div>
                </div>
              </div>
            </el-col>
          </el-row>
          <!--<el-dialog title="添加新计划" :visible.sync="addnewplandialog" width="95%"  @close="closeneeplandialog" v-dialogDrag>-->
          <el-dialog title="发布" :visible.sync="dialogVisible" width="40%" :modal-append-to-body='false' @open="openeldialog" @close="closedialog">
            <div class="fabudiv" style="width: 100%;margin-bottom: 15px;position: relative;">
              <iframe :src="iframeurl" v-show="iframeshow"  frameborder="0" style="padding-top:20px;position: absolute;background-color: #ffffff;top: -65px;right: -420px;width: 400px;height: 400px;"></iframe>
              <div class="ding" v-show="dingshow" style="padding-top:20px;position: absolute;background-color: #fff;top: -20px;right: -270px;width: 250px;height: 400px;">
                <el-cascader :props="props" :options="grouparr" :show-all-levels="false" @change="handleChange" style="display: block;margin: auto;"></el-cascader>
                <div class="bottom" style="position: absolute;bottom: 20px;width:100%;">
                  <el-button style="margin-left: 25px">取消</el-button>
                  <el-button type="success" @click="grouparrqueren" style="float: right;margin-right: 25px">确认</el-button>
                </div>
              </div>

              <!--<span style="margin-right: 20px">选择类别:</span>-->
              <!--<el-cascader :options="gettypearr" @change="handleChangegettypearr" :show-all-levels="false"></el-cascader>-->
              <!--<br><br>-->
              <!--<span style="margin-right: 20px">计划类型:</span>-->
              <!--<el-cascader :options="plangettypearr" v-model="plantypevalue" @change="changeplangettypearr" :show-all-levels="false"></el-cascader>-->
              <!--<br><br>-->
              <!--<span style="margin-right: 20px">介绍内容:</span>-->
               <!--<el-input-->
                <!--type="textarea"-->
                <!--placeholder=""-->
                <!--v-model="plantextarea"-->
                <!--maxlength="200"-->
                <!--style="width: 400px"-->
                <!--show-word-limit>-->
              <!--</el-input>-->
              <!--<br><br>-->
              <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
              <span style="margin-right: 20px">发布标题:</span>
              <el-input
                type="textarea"
                placeholder="请输入200字以内的作品介绍"
                v-model="textareaindex"
                maxlength="200"
                style="width: 400px"
                show-word-limit>
              </el-input>
            </div>
              <div v-if="shigongzuzhishow">
                 <span style="margin-right: 20px">组织计划:</span>
                 <el-cascader style="width: 400px" :options="organizationarr" v-model="organizationvalue" @change="handleChangegetorganization"></el-cascader>
              </div>
              <br><br>
              <!--<div style="width: 100%;height: 40px;">-->
                 <!--<span class="plantoonspan" style="float: left">计划时间:</span>-->
                  <!--<el-date-picker-->
                    <!--v-model="plantime"-->
                    <!--type="daterange"-->
                    <!--range-separator="至"-->
                    <!--start-placeholder="开始日期"-->
                    <!--end-placeholder="结束日期" style="width: 350px;float: left;margin-left: 25px">-->
                  <!--</el-date-picker>-->
              <!--</div>-->

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
        </div>
     </el-dialog>
</template>

<script>
   import planindex from '../../components/planpage/index'
   import moment from 'moment'
  export default {
    name: 'index',
    data(){
      return{
        addnewplandialog:false,
        plannewvalue:'',
        leftindexshow:false,
        faqijihuashow:false,
        planindexworkid:0,
        oneparentid:0,
        plannewshow:false,
        organizationarr:[],
        organizationvalue:"",
        organizationshow:true,
        shigongzuzhishow:false,
        structid:0,
        plannewop:[
        {label:"年计划",
         value:1,
         children:[]
        },
          {label:"月计划",
         value:2,
         children:[]
        },
          {label:"周计划",
         value:3,
         children:[]
        },
          {label:"日计划",
         value:4,
         children:[]
        },
          {label:"施工组织计划",
         value:5,
         children:[]
        },
          {label:"施工任务",
         value:6,
         children:[]
        },
          {label:"施工计划",
         value:7,
         children:[]
        },
          {label:"其他",
         value:0,
         children:[]
        }],
        plantextarea:'',//计划内容
        plantime:'',
        plantypevalue:"",
        input:'',//标题名字
        jihuavalue: [],//计划类别
        value1:'',//日期
         optionstype: [{//计划下拉标签
          value: 'zhinan',
          label: '指南',}],
        desc:"",//内容
        typetid:0,
        loading:false,
        numbox:[],
        planshow:true,
        planshow2:false,
        dialogVisible:false,
        iframeurl:'',
        iframeshow:false,
        infonum2:0,
        currpage2:1,
        pagesize2:20,
        jinjianshow:false,
        textareaindex:'',
        fileList:[],
        beizhuinput:'',
        gettypearr:[],
        plangettypearr:[],
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
    computed:{
      project_id() {
        return this.$store.state.project.project_id
      },
      plan_typeid(){
        return this.$store.state.plantypeid.count
      },
      projectGroupList() {//组别
        return this.$store.state.project.projectGroupList
      },
      person_info(){
        return this.$store.state.person.personInfo
      },
      projectPersonList() {//人员列表信息
        return this.$store.state.project.projectPersonList
      },
      titlebox(){//页面传来的title
        return this.$store.state.plantypeid.titlebox
      },
      leftshow(){
        return this.$store.state.plantypeid.leftshow
      },
      fatherid(){
        return this.$store.state.plantypeid.fatherid
      },
      newplandialog() {
        return this.$store.state.plantypeid.newplanshow
      },
    },
    watch:{
      project_id(curVal, oldVal) {
        console.log('项目id改变',curVal,oldVal)
        this.getstyle()
      },
      titlebox(curVal){
        console.log('titlebox',curVal,this.leftshow,this.fatherid)
        if(curVal.length!==0){
          this.leftindexshow=false
          this.planshow=false
          this.planshow2=true
          this.numbox=this.titlebox
        }
        else {
          this.leftindexshow=true
          this.numbox=[]
        }
      },
      leftshow(index){
        this.leftshowfnc(index)
      },
      fatherid(curVal, oldVal){
        console.log("接受到父亲id改变",curVal, oldVal)
        this.fatheridchange()
      },
      plan_typeid(curVal, oldVal){
        console.log("监听事件plan_typeid",curVal)
        this.$router.push({path:'/indexplan'})
      },
      newplandialog(curVal, oldVal){
        console.log("公用样式组件",curVal,oldVal)
        this.addnewplandialog=curVal
      }
    },
    mounted(){
      if (this.project_id !== null) {
        this.getstyle()
        if(this.leftshow=="have"){
          this.leftindexshow=false
          this.planshow=false
          this.planshow2=true
          this.numbox=this.titlebox
        }
      if(this.leftshow=="none"){
          this.leftindexshow=true
        }
        console.log("leftshow的表现状态---大四----",this.leftshow)
        this.oneparentid=this.fatherid
      }
    },
    components:{
      planindex
    },
    methods: {
      closeneeplandialog(){
        this.$store.commit("newplanshowchangefasle")
      },
      planinititate(){
        this.$router.push({
            name: 'yearsplan',
          })
      },
      fatheridchange(){
        console.log("父级id变化",this.fatherid)
      },
      leftshowfnc(){
        // console.log("左边状态",this.leftshow)
      },
      handleChangetypetid(value) {
        console.log("ddddddd",value[0]);
        this.typetid=value[0]
      },
      sonplanshow(){
        this.loading=true
        this.getplan()
      },
      handleChangegetorganization(val){
        console.log("组织计划val",val)
        this.structid=val[1]
      },
      getplan(){
         const param = {
            method:'plan_query',
            project_id: this.project_id,
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log("下拉框data",data)
            for(let i=0;i<data.data.length;i++){
              if(data.data[i].type==1){
                this.plannewop[0].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==2){
                this.plannewop[1].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==3){
                this.plannewop[2].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==4){
                this.plannewop[3].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==5){
                this.plannewop[4].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==6){
                this.plannewop[5].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==7){
                this.plannewop[6].children.push({label:data.data[i].title,value:i})
              }
              if(data.data[i].type==0){
                this.plannewop[6].children.push({label:data.data[i].title,value:i})
              }
            }
            this.plannewshow=true
            this.loading=false
            console.log("plannewop",this.plannewop)
          })
      },
      plannewhandleChange(val){
        console.log("val",val)
        this.structid=val[0]
      },
      changeplangettypearr(){

      },
      getorganization(){
        const param = {
            method:'plan_struct',
            project_id: this.project_id,
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('获取组织计划', data.data)
            data.data.forEach(item=>{
              item["label"]=item.text
              item["value"]=item.id
              if(item.children.length==0){
                delete item.children
              }
              if(item.children!==undefined){
                item.children.forEach(obj=>{
                  obj["label"]=obj.text
                  obj["value"]=obj.id
                  if(obj.children.length==0){
                    delete obj.children
                  }
                })
              }
            })
            this.organizationarr=data.data
            console.log("this.organizationarr",this.organizationarr)
          })
      },
      getstyle(){//获取计划类型
        const param = {
            method:'plan_type',
            project_id: this.project_id,
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('planstyle', data.data)
            this.optionstype=data.data
            this.optionstype.forEach(item=>{
              item["label"]=item.name
              item["value"]=item.tid
            })
            this.plangettypearr=this.optionstype
          })
      },
      releaseplan(){//提交计划
        if(this.jihuavalue.length==0){
          this.$message({
            message: '计划类型不得为空',
            type: 'warning'
          });
        }else{
          console.log("有计划value")
                this.numbox=[]
          this.numbox=this.desc.split("\n")
          console.log("实施计划的盒子",this.numbox)
          for(let i=0;i<this.numbox.length;i++){
            // blockshow:true,blockshow:false
            this.numbox.splice(i,1,{name:this.numbox[i],block:"have",blockshow1:true,blockshow2:false})
          }
          console.log("新数组",this.numbox)
          this.faqijihuashow=true
        let firstdaytime=moment(this.value1[0]).format('YYYY-MM-DD')
        let endtime=moment(this.value1[1]).format('YYYY-MM-DD')
        this.loading=true
        const param = {
            method:'plan_add',
            project_id: this.project_id,
            title:this.input,
            content:this.desc,
            start_date:firstdaytime,
            end_date:endtime,
            type:this.typetid,
          }
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('新建计划提交状态', data)
            this.oneparentid=data.id
            this.loading=false
            this.numbox=[]
            this.numbox=this.desc.split("\n")
            for(let i=0;i<this.numbox.length;i++){
              this.numbox.splice(i,1,{name:this.numbox[i],block:"have",blockshow1:true,blockshow2:false})
            }
            this.planshow=false
            this.planshow2=true
          })
        }
      },
      releasefnc(index){//发布任务弹窗
        this.dialogVisible=true
        this.textareaindex=index
      },
      openeldialog(){//打开发布任务窗口
        console.log("施工组织计划",this.typetid)
        if(this.typetid==5||this.typetid==7){//||this.structid==5||this.structid==7
          this.shigongzuzhishow=true
        }else {
          this.shigongzuzhishow=false
        }
        console.log("组别",this.projectGroupList)
        console.log("stuckid",this.structid)
        this.getcategory()
        this.gettype()
        this.getmodel()
        this.getpersonlist()
        this.getorganization()
      },
      closedialog(){
        this.dingshow=false
        this.textareaindex=""
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
        this.loading=true
        console.log("父id",this.fatherid)
        let firstdaytime=moment(this.plantime[0]).format('YYYY-MM-DD')
        let endtime=moment(this.plantime[1]).format('YYYY-MM-DD')
        let namebox=""
        for(let i=0;i<this.fabu_people.length;i++){
          namebox=namebox+"@"+this.fabu_people[i].name
        }
        this.datalistfrom.title=namebox+this.textareaindex
        this.datalistfrom.receiver=this.fabu_people
        const _param = {
          method: 'plan_start_issue',
          project_id: this.project_id,
          questions_type:this.fabuquestions_type,
          title:namebox+this.textareaindex,
          flow_id:"PlanFlow01",
          priority: this.fabustartvalue,
          form:this.datalistfrom,
          subjectionId:"",
          nosend:1,
          type:this.plantypevalue[0],
          content:"",
          start_date:firstdaytime,
          end_date:endtime,
          parent_id:this.fatherid,
          struct_id:this.structid
        }
        this.$store.dispatch('Getplan', _param).then((data) => {
          console.log("任务发布成功",data)//work_id
           console.log("任务发布成功再随便打印点什么",data)//work_id
          this.loading=false
          for(let i=0;i<this.numbox.length;i++){
            if(this.textareaindex==this.numbox[i].name){
              this.numbox[i].block="donot"//blockshow1 blockshow2
              this.numbox[i].blockshow1=false
              this.numbox[i].blockshow2=true
            }
          }
        console.log("numbox__donot",this.numbox)
          this.planindexworkid=data.work_id
          this.smalltaskfnc()
          this.fabusuccessfnc()
        })
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
          console.log('我的任务',data)
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
        this.plantypevalue=""
        this.plantextarea=""
      },
      grouparrqueren(){
        this.dingshow=false
      },
      handleChange(value) {//选择指定人员
        console.log("选择人员",value);
        this.fabu_people=[]
        let newarr=[]
        for(let i=0;i<value.length;i++){
          newarr.push(value[i][2])
        }
        for(let i=0;i<this.projectPersonList.length;i++){
          for(let j=0;j<newarr.length;j++){
            if(this.projectPersonList[i].person_id==newarr[j]){
              this.fabu_people.push(this.projectPersonList[i])
              console.log("dsadsadsadasdasdas",this.projectPersonList[i])
            }
          }
        }
        // let peopleidarr=[]
        // for(let i=0;i<value.length;i++){
        //   this.fabu_people.push({name:'',id:value[i][2]})
        //   peopleidarr.push(value[i][2])
        // }
        // console.log("1111111111111",peopleidarr)
        // for(let o=0;o<this.projectPersonList.length;o++){
        //   for (let p=0;p<peopleidarr.length;p++){
        //     if(this.projectPersonList[o].person_id==peopleidarr[p]){
        //       peopleidarr[p].splice(p,1,{name:this.projectPersonList[o].name,id:peopleidarr[p]})
        //     }
        //   }
        // }
        // this.fabu_people=peopleidarr
        // console.log("222222222222",peopleidarr)
        // console.log("获取到的ID",this.fabu_people)
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
      this.allpersondata()
      },
      pagechange2(e){
        console.log("当前页数",e)
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
        const param = {
          show: true,
          data:index
        }
        this.$store.dispatch('SetInfoDialog', param).then(() => {}).catch(() => {
        })
      },
      mytaskfnc(){
        const _param = {
            method: 'get_todo_list',
            project_id: this.project_id,
            qtype:"TodoList,BackLog,MatterRead"
          }
          this.$store.dispatch('GetAllInstList', _param).then((data) => {
            console.log("我的任务",data)
            data.forEach(item=>{
              item["aaaid"]=data.indexOf(item)
            })
            this.secondtitle="我的任务("+data.length+")"
            this.infonum2=data.length
             this.boxinfo=[]
            this.boxinfo1=[]
            this.boxinfo=data
            this.events=[]
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
      },
      comebackplan(){
        this.$router.push({path:'/indexplan'})
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
    margin-left: 100px;
    line-height: 35px;
    text-align: center;
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
    background-color: #fff;
    float: left;
    margin-bottom: 15px;
    margin-top: 10px;
    margin-left: 100px;
    padding: 30px 0;
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
    float: right;
    position: absolute;
    top: 40px;
    right: 20px;
  }
  .classdonot{
    background-color: #ff6700;
  }
  .nulldiv{
    width: 700px;
    height: 560px;
    background-color: #fff;
    font-size: 30px;
    text-align: center;
    line-height: 560px;
    color: #e7e7e7;
  }
  .fabuimg{
    line-height: 40px;
    font-weight: 800;
    font-size: 20px;
  }
  .fabuon{
    color: #ffffff;
    font-size: 15px;
    font-weight: 500;
    line-height: 40px;
  }
</style>
