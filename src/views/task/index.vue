<style lang="scss">
  @import "./index";
</style>
<template>
<div>
  <div class="left">
    <el-tabs type="border-card">
      <el-tab-pane :label="bannertitle">
        <div class="taskbox1">
          <span>类别:</span>
          <template>
          <el-select v-model="value" placeholder="所有" style="width: 80px" class="btn1">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.label"></el-option>
          </el-select>
          </template>

          <span>类型:</span>
          <template>
          <el-select v-model="value2" placeholder="所有" style="width: 110px" class="btn1">
            <el-option v-for="item in options2" :key="item.value2" :label="item.label2" :value="item.label2"></el-option>
          </el-select>
          </template>

          <span>状态:</span>
          <template>
          <el-select v-model="value3" placeholder="所有" style="width: 100px" class="btn1">
            <el-option v-for="item in options3" :key="item.value3" :label="item.label" :value="item.label"></el-option>
          </el-select>
          </template>
          <el-button type="primary" @click="queryFun">查询</el-button>

          <div class="details" v-for="item in boxinfo1" :key="item.workId"> <!--任务信息模块-->
            <img :src=item.imgurl alt="">
            <span class="titleword" @click="infoshow(item)">{{item.title}}</span>
            <div class="statebox" :class="{'statered':(item.statecolor==='red'),'stateyellow':(item.statecolor==='yellow'),'stategreen':(item.statecolor==='green'),'stategray':(item.statecolor==='gray')}">{{item.state}}</div>
            <!--<div class="statebox">{{item.state}}</div>-->
            <div class="star_block"><el-rate v-model="item.value" disabled :max=3></el-rate></div>
            <br>
            <div class="peoplebox">
              <span class="originator_span">发起人: <span style="color: #383838">{{item.originator}}</span></span>
              <!--header   负责人-->
               <span class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian>负责人:<span style="color: #383838">{{item.header}}</span></span>
              <!--qualiter   质检人-->
               <span  class="originator_span" style="border-left: 1px solid #a8a8a8;padding-left: 10px;" v-show=item.xian2>质检人:<span style="color: #383838">{{item.qualiter}}</span></span>
            </div>
            <span class="created_time">发布时间:<span style="color: #383838">{{item.created}}</span></span>
            <!--<h4>计划完成时间:{{item.endtime}}</h4>-->
            <br>
            <div class="logobox" :class="{'yellow':item.stateall==='任务','zise':item.stateall==='会议','lvse':item.stateall==='通知','anquan':item.stateall==='安全巡检','ziliao':item.stateall==='资料'}">{{item.stateall}}</div>
            <!--<div class="logobox">{{item.stateall}}</div>-->
            <div class="logobox" v-show=item.xian3>{{item.questions_type}}</div>
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

      <el-tab-pane label="我的任务()">
        <div class="taskbox1">
          <span>类别:</span>
          <template>
          <el-select v-model="value" placeholder="所有" style="width: 80px" class="btn1">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </template>

      <span>类型:</span>
      <template>
      <el-select v-model="value2" placeholder="所有" style="width: 110px" class="btn1">
        <el-option v-for="item in options2" :key="item.value2" :label="item.label" :value="item.value2"></el-option>
      </el-select>
    </template>

      <span>状态:</span>
      <template>
      <el-select v-model="value4" placeholder="所有" style="width: 100px" class="btn1">
        <el-option v-for="item in options4" :key="item.value4" :label="item.label" :value="item.value4"></el-option>
      </el-select>
      </template>
      <el-button type="primary">查询</el-button>

        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
  export default {
    name: 'index',
    data() {
      return {
        bannertitle:'任务大厅(0)',
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
          workId:'',
          questions_type:'资料',
          created:'2019年9月2日 13:09:30',
          endtime:'2019年11月2日 13:09:30',
          colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
          value:2,
        }],
        options: [{ value: '选项1', label: '任务' }, { value: '选项2', label: '通知' }, { value: '选项3', label: '会议' },
          { value: '选项4', label: '资料' },{ value: '选项5', label: '安全' }],
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
        postdata:[]
      }
    },
    created:function (){
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      person_info(){
        return this.$store.state.person.personInfo
      }
    },
    watch: {
      project_id(curVal, oldVal) {
        console.log('curVal',curVal,oldVal)
        this.currpage = 1
        this.thirdinterface()
        this.allpersondata()
        // console.log("this.person_info",this.person_info)
      }
    },
    mounted(){
      if (this.project_id !== null) {
        this.currpage = 1
        this.getPerson()
        this.thirdinterface()
        this.allpersondata()

      }
    },
    methods:{
      pagechange (e) {//每页多少条数据
      this.currpage = e
      // console.log(this.currpage)
      this.allpersondata()
        // this.secondpage()
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
        // console.log("第一接口返回成功")
        console.log('第一接口数据Allpersondata',data.data)
        this.infonum=data.count
        this.bannertitle="任务大厅("+data.count+")"
        this.boxinfo=[]
        this.boxinfo1=[]
        this.boxinfo=data.data
        //事件监听flowid,判断任务类型
        this.boxinfo.forEach(item=>{
          // if(item.questions_type===''){
          //   console.log('第二列表',item)
          // }
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
        })
        //页面刷新自动去第一页
        this.secondpage()
      })
    },
      getlistinfo(){
        const _param = {
        method: 'get_nodes_users_list',
        project_id: this.project_id,
        work_ids:this.postdata
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
         // console.log("第二接口返回成功",data.data)
        this.listbox=data.data
        // console.log("第二接口数据",this.listbox)
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
          // console.log(item.getinfo)
          if(item.questions_type!=""){
            item["xian3"]=true
          }
          if(map1.get(workId).info!=undefined){
            item["value"]=map1.get(workId).info.priority//任务星级
          }
          if(item.flowId!=null){
            item["flowId2"]=item.flowId.slice(0,item.flowId.length-2)//截取字符，判断任务类型，和接口文档匹配
          }
          // console.log("-----node5username",item.obj.Node2[0])
          if(item.obj.Node2!=undefined){
            item["header"]=item.obj.Node2[0].userName//负责人
            item.xian=true
          }else {
            item.xian=false
          }
          if(item.obj.Node5!=undefined){
            item["qualiter"]=item.obj.Node5[0].userName//质检人
            item.xian2=true
          }else {
            item.xian2=false
          }
          //和第三接口配置文档进行匹配
          if(this.thirdinfo[item.flowId2]!=""){
           let _config = this.thirdinfo[item.flowId2]
            let _node = _config[item.getinfo]
            // console.log('this.thirdinfo',_config,_node)
            if (_node !== undefined){
              // console.log('--->',_node)
              item.state = _node.status
              item["statecolor"]=_node.color
            }else{
              // item.state = item.getinfo
              item.state = "已完成"
            }
          }
                                //配置结束
          // console.log(item)
          box.push(item)
        })
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
          console.log("第三接口",this.thirdinfo)
          // for(var i in this.thirdinfo){
          //   console.log('---------',i,this.thirdinfo[i])
          // }
        })
      },

      queryFun(){
        console.log("查询按钮获取信息",this.value,this.value2,this.value3)//flow_word
        if(this.value=="任务"){//任务，通知，会议，资料,安全
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
        if(this.value3=="进行中"){
          this.qtype_word="inProgress"
        }
        if(this.value3=="已完成"){
          this.qtype_word="hasDone"
        }
        console.log("this.qtype_word",this.qtype_word)
        const _param = {
        method: 'query_task_all_list',
        project_id: this.project_id,
        flow_id:this.flow_word,//value
        qtype:this.qtype_word,//完成未完成
        questions_type:this.value2,//安全，技术平台
        keyword:"",//输入框
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
          // if(item.questions_type===''){
          //   console.log('第二列表',item)
          // }
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
      // typechange(event){
      //   console.log("value2值为",this.value2)
      //   this.options2.forEach(item => {
      //     if (item.value2 === this.value2){
      //       console.log(item.label2)
      //     }
      //   })
      // }
    }
  }
</script>

<style scoped>
  .left{
    width: 650px;
    margin-left: 15px;
    margin-top: 25px;
    box-shadow:0px 0px 30px #4a4c4b;
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
    width: 520px;
    height: 140px;
    border: 1px solid #e7e7e7;
    border-radius: 5px;
    margin:15px auto;
    position: relative;
  }
  .details img{
    width: 122px;
    height: 102px;
    margin-top: 19px;
    margin-left: 10px;
    display: block;
    float: left;
    border: 1px solid #000;
  }
  .star_block{
    position: absolute;
    top: 35px;
    right: 0;
  }
  .titleword{
    display: block;
    margin-top: 18px;
    font-size: 15px;
    font-weight: 500;
    width: 290px;
    margin-left: 10px;
    float: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .statebox{
    width: 60px;
    height: 20px;
    border-radius: 10px;
    background-color: #BABABA;
    color: #fff;
    float: right;
    margin-right: 10px;
    margin-top: 10px;
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
    margin-top: 7px;
    margin-left: 10px;
    margin-bottom: 7px;
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
  .logobox{
    float: left;
    width: 60px;
    margin-left: 5px;
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
