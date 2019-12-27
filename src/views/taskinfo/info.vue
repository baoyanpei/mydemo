<style lang="scss">
  @import "./personInfoDialog";
  .topimgbox{
    width: 100%;
    margin-bottom: 10px;
  }
  .topimgbox img{
    width: 30%;
    height: 150px;
  }
  .infobox{
    position: relative;
  }
  .statebox_111{
    position: absolute;
    left: -18px;
    top: -5px;
    width: 100px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 18px;
    background-color: red;
    color: #e5e5e5;
  }
  .titleword{
    font-size: 16px;
    font-weight: 600;
  }
  .personbox{
    margin-top: 10px;
    width: 100%;
    max-height: 100px;
    overflow-y: scroll;
  }
  .person_left{
    width: 8%;
    padding-left: 12px;
    float: left;
  }
  .person_right{
    width: 92%;
    float: left;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap
  }
  .person_left i{
    font-size: 30px;
    display: block;
    margin:0 auto;
  }
  .rectification_infobox{
    margin-top: 10px;
    width: 100%;
    height: 40px;
    border: 1px solid #000;
  }
  .pername_box{
    margin-top: 10px;
    width: 100%;
    height: 40px;
  }
  .pername_ball{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    float: left;
    background-color: lime;
    margin-right: 10px;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
  }
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
  .commentsbox{
    margin-top: 10px;
    width: 100%;
    height: 30px;
  }
  .comments_btn{
    width: 15%;
    height: 30px;
    font-size: 18px;
    text-align: center;
    line-height: 30px;
    float: right;
    background-color:yellowgreen ;
    color: #fff;
    font-weight: 300;
    margin: 0;
    padding: 0;
    border: 1px solid transparent;  //自定义边框
    outline: none;    //消除默认点击蓝色边框效果
  }
  .comments_input{
    width: 85%;
    height: 20px;
  }
  .receive_btn{
    margin-top: 15px;
    width: 100%;
    height: 40px;
    background-color: yellowgreen;
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    color: #fff;
  }
  .person_smallbox{
    width: 60px;
    height: 25px;
    text-align: center;
    line-height: 25px;
    margin-right: 5px;
    float: left;
  }
  /*显示评论*/
  .Displays_comment{
    margin-top: 10px;
    width: 100%;
    height: 60px;
    background-color: paleturquoise;
    padding: 8px;
  }
  .displays_name{
    float: left;
    display: block;
    line-height: 20px;
  }
  .displays_time{
    float: right;
  }
  /*.detailed_information{*/
    /*max-height: 600px;*/
    /*overflow-y: scroll;*/
  /*}*/
  .task_box_big{
    max-height: 700px;
    overflow-y: scroll;
  }
  /*待处理信息*/
  .todoinfo{
    width: 100%;
    height: 130px;
    border: 1px solid #e5e5e5;
    margin-top: 10px;
  }
  .input1{
    width: 80%;
    display: block;
    float: left;
  }
  .todobtn1{
    width: 10%;
    height: 75px;
    margin-left: 0;
    background-color: #F2F6FC;
    border: 1px solid #e5e5e5;
    float: left;
    text-align: center;
    line-height: 75px;
    font-size: 30px;
  }
  .submitbtn{
    background-color: yellowgreen;
    margin-top: 10px;
    margin-right: 15px;
    float: right;
  }
  .rectification_word{
    display: block;
    margin-top: 10px;
    font-size: 16px;
    line-height: 20px;
  }
  .imgbox_img1{
    width: 200px;
    height: 140px;
    background-color: lightblue;
    float: left;
  }
  .rectification_imgbox{
    margin-top: 10px;
    width: 100%;
    height: 140px;
  }
  .rectification{
    /*height: 100%;*/
  }
  .statebox222{
    margin-top: 10px;
    width: 100%;
    height: 80px;
    border-radius: 15px;
    border: 1px solid #e5e5e5;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
  }
  .yuan{
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 50%;
    border: 1px solid #e5e5e5;
    color: #e5e5e5;
    float: left;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    float: left;
  }
  .span_name{
    width: 60px;
    height: 40px;
    margin-top: 30px;
    text-align: center;
    font-size: 14px;
    float: left;
    margin-left: 10px;
  }
  .line_div{
    width: 70px;
    height: 2px;
    margin-top: 39px;
    background-color: #e5e5e5;
    float: left;
  }
  .status_box{
  }
  .green{
    border: 1px solid #1abc9c;
    color: #1abc9c;
  }
  .spangreen{
    color: #1abc9c;
  }
  .bggreen{
    background-color: #1abc9c;
  }
</style>
<template>
    <div class="detailed_information">
        <el-dialog top="0.5vh" width="770px" class="task_box_big" :lock-scroll="true" :close-on-click-modal="false"
          @open="openPersonFacePercentDetailDialogHandle" :visible.sync="taskInfoDialog.show" title="任务详情" @close="closeDialog"
        >
          <div class="infobox">
            <!--任务状态信息-->
            <div class="statebox_111" :class="{'statered':(taskInfoDialog.data.state==='待认领'),'stateyellow':(taskInfoDialog.data.state==='待处理'),'stategreen':(taskInfoDialog.data.state==='待质检'),'stategray':(taskInfoDialog.data.state==='已完成')}">{{taskInfoDialog.data.state}}</div>
            <!--图片1-->
              <div class="topimgbox">
                <img :src=taskInfoDialog.data.imgurl alt="" @click="imgURL(taskInfoDialog.data.imgurl)">
              </div>
            <!--标题-->
              <span class="titleword">{{taskInfoDialog.data.title}}</span>
            <!--状态-->
              <div class="statebox222">
                <div class="status_box" v-for="item in this.progressbox">
                  <div class="yuan" :class="{'green':item.aaa!=='aaa'}">{{item.index}}</div>
                  <div class="span_name" :class="{'spangreen':item.aaa!=='aaa'}">{{item.status}}<br>{{item.name}}</div>
                  <div class="line_div" :class="{'bggreen':item.aaa!=='aaa'}" v-show="item.show_line"></div>
                </div>
              </div>
              <!--名字合集-->
              <div class="personbox">
                <div class="person_left"><i class="el-icon-view"></i></div>
                <div class="person_right">
                  <div class="person_smallbox" @click="handleNameClick(item)" v-for="item in this.projectPersonList">{{item.name}}</div>
                </div>
              </div>
            <!--显示评论-->
            <div class="Displays_comment" v-for="item in this.commentsbox2">
              <div style="width: 100%;height:20px;margin-bottom: 7px">
                <span class="displays_name">{{item.person_name}}</span>
                <span class="displays_time">{{item.created_time}}</span>
              </div>
              <span class="displays_neirong">{{item.comment}}</span>
            </div>
            <!--上传评论-->
            <div class="commentsbox">
              <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea" class="comments_input" v-show="commentshow"></el-input>
              <input type="button" class="comments_btn" :value=commentvalue @click="commentfnc()">
            </div>
            <div class="receive_btn" v-show="claimbtn">认领:我来处理任务</div>
            <!--待处理信息模块-->
            <div class="todoinfo" v-show="todoinfoshow">
              <el-input type="textarea" :rows="3" class="input1" placeholder="请输入内容" v-model="todotextarea"></el-input>
              <div class="todobtn1"><i class="el-icon-plus"></i></div>
              <div class="todobtn1"><i class="el-icon-link"></i></div>
             <el-button type="primary" class="submitbtn">提交质检</el-button>
            </div>
            <!--整改模块-->
            <div class="rectification" v-for="item in this.taskinfobox">
               <!--整改信息-->
                <div class="rectification_infobox">
                  <span style="line-height: 40px;display: block;float: left;font-size: 20px;margin-left: 15px">第{{item[0].count}}条整改数据</span>
                  <span style="display: block;float: right;line-height: 40px;margin-right: 15px">{{item[0].date}}</span>
                </div>
                <!--处理人名字-->
                <div class="pername_box">
                  <div class="pername_ball">{{item.firstname}}</div>
                  <span style="float: left;display: block;line-height: 40px;font-size: 16px">{{taskInfoDialog.data.header}}</span>
                </div>
                <!--图片集合2-->
                <div class="rectification_imgbox" v-show="item[1].tpshow_1">
                  <div class="imgbox_img1" v-for="i in item[1].value">
                    <img :src=i.imgurl111 alt="" style="height: 100%;width: 100%">
                  </div>
                </div>
                <!--整改信息文字-->
                <span class="rectification_word">{{item[2].value}}</span>
              <!--整改信息显示评论-->
              <div class="zhenggai_pinglun_box" style="width: 100%;background-color:paleturquoise;padding: 7px;margin-top: 5px" v-for="obj in item.index1">
                  <div class="zhenggai_pinglun_box_top" style="width: 100%;height: 30px;font-size: 16px;">
                    <span style="display: block;float: left">{{obj.person_name}}</span>
                    <span style="display: block;float: right">{{obj.created_time}}</span>
                  </div>
                  <span>{{obj.comment}}</span>
              </div>
                <!--整改信息评论-->
                <div class="commentsbox">
                  <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea1" class="comments_input" v-show="commentshow1"></el-input>
                  <input type="button" class="comments_btn" :value=commentvalue1 @click="commentfnc1()">
                </div>
                <!--质检信息-->
              <div class="qualityBox" v-if="item.qualityshow">
                  <div class="rectification_infobox">
                    <span style="line-height: 40px;display: block;float: left;font-size: 20px;margin-left: 15px">第{{item[3].count}}条质检信息</span>
                    <span style="display: block;float: right;line-height: 40px;margin-right: 15px">{{item[3].time}}</span>
                  </div>
                  <!--质检图片-->
                  <!--<div class="rectification_imgbox" v-show="item.tpshow">-->
                  <div class="rectification_imgbox" v-show="item[4].tpshow">
                    <div class="imgbox_img1" v-for="o in item[4].value">
                      <img :src=o.imgurl111 alt="" style="height: 100%;width: 100%">
                    </div>
                  </div>
                  <!--质检信息文字-->
                  <span class="rectification_word">{{item[5].value}}</span>
                  <!--质检信息显示评论-->
                  <div class="zhenggai_pinglun_box" style="width: 100%;background-color:paleturquoise;padding: 7px;margin-top: 5px" v-for="npm in item.index2">
                      <div class="zhenggai_pinglun_box_top" style="width: 100%;height: 30px;font-size: 16px;">
                        <span style="display: block;float: left">{{npm.person_name}}</span>
                        <span style="display: block;float: right">{{npm.created_time}}</span>
                      </div>
                      <span>{{npm.comment}}</span>
                  </div>
                  <!--质检信息评论-->
                  <div class="commentsbox">
                    <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea2" class="comments_input" v-show="commentshow2"></el-input>
                    <input type="button" class="comments_btn" :value=commentvalue2 @click="commentfnc2()">
                  </div>
              </div>
            </div>
          </div>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'info',
    data() {
      return{
        commentshow:false,
        commentvalue:"评论",
        progressbox:[],
        workid:'',
        progress_1:"待认领",
        progress_1_msg:"",
        progress_2:"待处理",
        progress_2_msg:"",
        progress_3:"待质检",
        progress_3_msg:"",
        progress_4:"待完成",
        progress_4_msg:"",
        textarea: '',
        textarea1:'',//整改信息评论
        commentshow1:false,//整改信息输入框显示
        commentvalue1:'评论',//整改信息评论按钮文字
        textarea2:'',//质检信息评论
        commentshow2:false,//质检信息输入框显示
        commentvalue2:'评论',//质检信息评论按钮文字
        todotextarea:'',
        claimbtn:false,
        todoinfoshow:false,
        loginname:'',
        TaskdetailsBox:[],//整改信息数据盒子
        taskinfobox:[],//整改信息整理填充进
        commentsbox1:[],
        commentsbox2:[],
        numarr:[],
        pinglunarr:[]
      }
    },
    computed:{
      project_id() {
        return this.$store.state.project.project_id
      },
      person_info(){
        return this.$store.state.person.personInfo
      },
      taskInfoDialog: {
        get: function () {
          return this.$store.state.project.taskInfoDialog
        },
        set: function (newValue) {
          this.$store.state.project.taskInfoDialog = newValue
          console.log(newValue)
        }
      },
      taskInfoChanged() {
        return this.$store.state.project.taskInfoDialog.refresh
      },
      projectPersonList() {//人员列表信息
        return this.$store.state.project.projectPersonList
      }
    },
    watch: {
      taskInfoDialog: {
        handler: function (newVal, oldVal) {
          if (newVal.show === true) {
            // this.getPerson()
          } else {
          }

        },
        deep: true
      },
    },
    mounted(){
      if (this.project_id !== null) {
        // this.getpersonlist()
      }
    },
    methods:{
      openPersonFacePercentDetailDialogHandle(){//打开窗口
        this.getpersonlist()
        this.getpersonprogress()
        let p = new Promise((resolve,reject) => {
            this.selectcomment()//显示数组
            resolve('success')
          });
          p.then(result => {
            this.taskspecificinfo()//填充数组
          });
      },
      closeDialog(){//关闭窗口事件
        console.log("关闭成功")
        this.taskinfobox=[]
        this.commentsbox1=[]
        this.commentsbox2=[]
        this.pinglunarr=[]
        console.log("this.commentsbox1",this.commentsbox1)
      },
      getpersonlist(){//人员列表信息接口
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          console.log("projectPersonList",this.projectPersonList)
        }).catch(() => {

        })
      },
      getpersonprogress(){//获取多个流程实例各节点操作的用户名列表
        const param = {
          method: 'get_nodes_users',
          project_id: this.project_id,
          work_id:this.taskInfoDialog.data.workId
        }
        this.$store.dispatch('GetAllInstList', param).then((data) => {
          if(data.info.status_list.length!=0){
            this.progressbox=data.info.status_list
            console.log("任务进度",this.progressbox)
            let len_num=this.progressbox.length
            this.progressbox.forEach(item=>{
              item["index"]=this.progressbox.indexOf(item)+1
              item["status"]=item[0]
              item["show_line"]=true
              item["aaa"]="aaa"
              if(item[1]!=""){
                item["name"]=item[1][0][0]
              }else {
                item["name"]=""
              }
              if (item[1].length!=0){
                item["aaa"]="bbb"
              }
              if(this.progressbox.indexOf(item)+1==len_num){
                item["show_line"]=false
              }
            })
          }
        }).catch(() => {

        })
      },
       taskspecificinfo(){//任务详细信息
        const _param = {
        method: 'get_flow_work',
        project_id: this.project_id,
        work_id:this.taskInfoDialog.data.workId,
        track_id:'',
        subjectionId:''
      }
      this.$store.dispatch('GetAllInstList', _param).then((data) => {
        console.log("form表单数据",data)
        this.TaskdetailsBox=data.form.modify_check
        for(var i=0;i<this.TaskdetailsBox.length;i++){
          let _index = this.TaskdetailsBox[i].count - 1
          if (this.taskinfobox[_index] === undefined){
            this.taskinfobox[_index] = []
          }
          this.taskinfobox[_index].push(this.TaskdetailsBox[i])
        }

        this.taskinfobox.forEach(item=>{
          console.log("寻找图片地址",item)
          if(item.length==6){
            item["qualityshow"]=true
            for (var i in item){
              if(i==1){
                item[i]["tpshow_1"]=true
                if(item[i].value.length==0){
                  item[i]["tpshow_1"]=false
                }
                item[i].value.forEach(obj=>{
                  obj["imgurl111"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?f='+obj.src+'&w=220'
                })
              }
              if(i==4){
                item[i]["tpshow"]=true
                if(item[i].value.length==0){//如果没有图片就隐藏图片盒子
                  item[i]["tpshow"]=false
                }else {
                  item[i].value.forEach(npm=>{
                    npm["imgurl111"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?f='+npm.src+'&w=220'
                  })
                }
              }
            }
          }else {
            item["qualityshow"]=false
            for(var y in item){
              if(y==1){
                item[y].value.forEach(obj=>{
                  obj["imgurl111"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?f='+obj.src+'&w=220'
                })
              }
            }
            if(i==1){
                item[i].value.forEach(obj=>{
                  obj["imgurl111"]='https://buskey.cn/api/oa/workflow/thumbnail.jpg?f='+obj.src+'&w=220'
                })
            }
          }
          item["zjpl"]=this.pinglunarr[this.taskinfobox.indexOf(item)]
          item["name"]=data.person_name
          item["firstname"]=this.taskInfoDialog.data.header.slice(0,1)
        })
        console.log("-------->",this.taskinfobox)
        this.taskinfobox.forEach(obj=>{
          let _index="modify-"+(this.taskinfobox.indexOf(obj)+1)
          let __index2="check-"+(this.taskinfobox.indexOf(obj)+1)
          obj[_index]=[]
          obj[__index2]=[]
          if(obj.zjpl!==undefined){
            for(let i=0;i<obj.zjpl.length;i++){
              if(obj.zjpl[i].comment_node==_index){
                obj[_index].push(obj.zjpl[i])
              }
              if(obj.zjpl[i].comment_node==__index2){
                obj[__index2].push(obj.zjpl[i])
              }
            }
          }
          obj["index1"]=obj[_index]
          obj["index2"]=obj[__index2]
          // console.log("objjjjjjjjjjj",obj)
        })
      })
      },
      selectcomment(){//显示评论
        const _param = {
        method: 'query',
        project_id: this.project_id,
        work_id:this.taskInfoDialog.data.workId,
      }
      this.$store.dispatch('Postmomment', _param).then((data) => {//显示评论列表
        console.log("评论数据要分类",data.data)
        this.commentsbox1=data.data
        this.commentsbox2=[]
        for(let i=0;i<this.commentsbox1.length;i++){
          // console.log(this.commentsbox1[i].comment_node)
          //截取返回评论节点最后一位数
          let strnum=this.commentsbox1[i].comment_node.substring(this.commentsbox1[i].comment_node.length-1,this.commentsbox1[i].comment_node.length)
          // console.log("-----strnum",strnum,typeof strnum)
          if(strnum!=="c" && strnum!=""){
            let strnum_num=parseInt(strnum)
            let _index=strnum_num-1
            if (this.pinglunarr[_index] === undefined){
              this.pinglunarr[_index] = []
            }
            this.pinglunarr[_index].push(this.commentsbox1[i])
            // this.numarr.push(strnum_num)
            // console.log("strnum22",this.numarr)
          }
          if(this.commentsbox1[i].comment_node==="basic"){
            this.commentsbox2.push(this.commentsbox1[i])
          }
        }
        console.log("---------<><><><><><",this.pinglunarr)
        console.log("显示评论列表",this.commentsbox2)
        if(this.taskInfoDialog.data.state==="待认领"){
          this.claimbtn=true
        }else {
          this.claimbtn=false
        }
        if(this.person_info.person.name!==""){
          // console.log("____________",this.taskInfoDialog.data.header===this.person_info.person.name)
          if(this.taskInfoDialog.data.header===this.person_info.person.name){
            this.todoinfoshow=true
          }else {
            this.todoinfoshow=false
          }
        }
      })
      },
      postcomment(){//上传评论
        const _param = {
        method: 'comment',
        project_id: this.project_id,
        work_id:this.taskInfoDialog.data.workId,
        flow_id:this.taskInfoDialog.data.flowId,
        comment:this.textarea,
        comment_node:"basic"
      }
      this.$store.dispatch('Postmomment', _param).then((data) => {
        console.log("评论发送成功",data)
        this.selectcomment()
      })
      },
      commentfnc(){
        if(this.commentvalue==="评论"){
          this.commentvalue="发表"
          this.commentshow=true
        } else {
          this.commentvalue="评论"
          this.commentshow=false
          let p = new Promise((resolve,reject) => {
            this.postcomment()
            resolve('success')
          });
          p.then(result => {
            this.selectcomment()
          });
          console.log(this.textarea)
        }
      },
      commentfnc1(){//整改信息评论按钮
        console.log("整改信息评论按钮")
      },
      commentfnc2(){//质检信息评论按钮
        console.log("质检信息评论按钮")
      },
      handleNameClick(row) {//人物名字
        const param = {
          show: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      imgURL(index){
        window.open(index)
      }
    }
  }
</script>
