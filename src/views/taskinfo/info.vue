<style lang="scss">
  @import "./personInfoDialog";
  @import "./info";

</style>
<template>
    <div class="detailed_information">
        <el-dialog top="0.5vh" width="770px" class="task_box_big" :lock-scroll="true" :close-on-click-modal="false"
          @open="openPersonFacePercentDetailDialogHandle" :visible.sync="taskInfoDialog.show" title="任务详情" @close="closeDialog"
        >
          <div class="infobox">
            <!--任务状态信息-->
            <div style="width: 100%;height: 30px">
               <div class="statebox_111" :class="{'statered':(taskInfoDialog.data.state==='待认领'),'stateyellow':(taskInfoDialog.data.state==='待处理'),'stategreen':(taskInfoDialog.data.state==='待质检'),'stategray':(taskInfoDialog.data.state==='已完成')}">{{taskInfoDialog.data.state}}</div>
            </div>
            <!--<div class="statebox_111" :class="{'statered':(taskInfoDialog.data.state==='待认领'),'stateyellow':(taskInfoDialog.data.state==='待处理'),'stategreen':(taskInfoDialog.data.state==='待质检'),'stategray':(taskInfoDialog.data.state==='已完成')}">{{taskInfoDialog.data.state}}</div>-->
            <!--图片1-->
              <div class="topimgbox">
                <div v-for="item in this.imgbanner" class="topimgbox_img">
                  <!--<span>{{item.src}}</span>-->
                  <img :src=item.onlineurl alt="" @click="imgURL(item.onlineurl)">
                </div>
              </div>

            <div class="title_div">
              <!--标题-->
              <span class="titleword">{{taskInfoDialog.data.title}}</span><br>
            </div>
             <!--发起人和发起时间-->
              <span class="faqiname">{{taskInfoDialog.data.originator}}      {{taskInfoDialog.data.created}}{{taskInfoDialog.data.sendTime}}</span>
            <div class="" style="margin-top: 10px;">
                <div class="audio_div" v-for="item in this.audiobox">
                  <!--语音文件-->
                  <audio :src=item.audiourl controls="controls" style="width: 450px"></audio>
                </div>
            </div>
            <!--<span>{{taskInfoDialog.data}}</span>-->
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
                <div class="person_right">
                  <div class="person_smallbox" @click="handleNameClick(item)" v-for="item in this.allpersonbox">
                    <span class="fontstyle" :class="{'greenword':item.state==='xxx'}">{{item.userName}}</span>
                  </div>
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
            <!--整改模块-->
            <div class="rectification" v-for="item in this.taskinfobox">
               <!--整改信息-->
              <div class="zhenggai">
                <div class="rectification_infobox">
                  <span style="line-height: 40px;display: block;float: left;font-size: 20px">第{{item[0].count}}条整改数据</span>
                  <span style="display: block;float: right;line-height: 40px;margin-right: 15px">{{item[0].date}}</span>
                </div>
                <!--处理人名字-->
                <div class="pername_box">
                  <div class="pername_ball">{{item.firstname}}</div>
                  <span style="float: left;display: block;line-height: 40px;font-size: 16px">{{taskInfoDialog.data.header}}</span>
                </div>
                <!--整改信息图片-->
                <div class="rectification_imgbox" v-show="item[1].tpshow_1" style="margin-bottom: 20px">
                  <div class="imgbox_img1" v-for="i in item[1].value" style="">
                    <img :src=i.imgurl111 @click="imgURL(i.imgurl111)" alt="">
                  </div>
                </div>
                <!--整改信息文字-->
                <span class="rectification_word">{{item[2].value}}</span>
                <!--整改信息显示评论-->
                <div class="zhenggai_pinglun_box" style="width: 100%;background-color:#F7F7F7;padding: 7px;margin-top: 5px" v-for="obj in item.index1">
                    <div class="zhenggai_pinglun_box_top" style="width: 100%;height: 30px;font-size: 16px;">
                      <span style="display: block;float: left">{{obj.person_name}}</span>
                      <span style="display: block;float: right">{{obj.created_time}}</span>
                    </div>
                    <span>{{obj.comment}}</span>
                </div>
                <!--整改信息评论-->
                <div class="commentsbox">
                  <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea1" class="comments_input" v-show="commentshow1"></el-input>
                  <input type="button" class="comments_btn" :value=commentvalue1 @click="commentfnc1(item[0].count)">
                </div>
              </div>


                <!--质检信息-->
              <div class="qualityBox" v-if="item.qualityshow">
                  <div class="rectification_infobox">
                    <span style="line-height: 40px;display: block;float: left;font-size: 20px">第{{item[3].count}}条质检信息</span>
                    <span style="display: block;float: right;line-height: 40px;margin-right: 15px">{{item[3].time}}</span>
                  </div>
                  <!--质检图片-->
                  <!--<div class="rectification_imgbox" v-show="item.tpshow">-->
                  <div class="rectification_imgbox" v-show="item[4].tpshow" style="margin-bottom: 20px">
                    <div class="imgbox_img1" v-for="o in item[4].value">
                      <img :src=o.imgurl111 @click="imgURL(o.imgurl111)" alt="" style="height: 100%;width: 100%">
                    </div>
                  </div>
                  <!--质检信息文字-->
                  <span class="rectification_word">{{item[5].value}}</span>
                  <!--质检信息显示评论-->
                  <div class="zhenggai_pinglun_box" style="width: 100%;background-color:#F7F7F7;padding: 7px;margin-top: 5px" v-for="npm in item.index2">
                      <div class="zhenggai_pinglun_box_top" style="width: 100%;height: 30px;font-size: 16px;">
                        <span style="display: block;float: left">{{npm.person_name}}</span>
                        <span style="display: block;float: right">{{npm.created_time}}</span>
                      </div>
                      <span>{{npm.comment}}</span>
                  </div>
                  <!--质检信息评论-->
                  <div class="commentsbox">
                    <el-input type="textarea" :rows="1" placeholder="请输入内容" v-model="textarea2" class="comments_input" v-show="commentshow2"></el-input>
                    <input type="button" class="comments_btn" :value=commentvalue2 @click="commentfnc2(item[3].count)">
                  </div>
              </div>
            </div>
            <!--待处理信息模块-->
            <div class="todoinfo" v-show="todoinfoshow">
              <el-input type="textarea" resize="none" :rows="3" placeholder="请输入内容" v-model="todotextarea" style="width: 100%;display: block;margin-bottom: 10px;"></el-input>
              <el-upload
                class="upload-demo"
                action="https://xcx.tddata.net/upload"
                :on-success="successupload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip" style="opacity: 0;font-size: 1px">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </div>
            <el-row :gutter="10" v-show="claimbtn">
              <el-col v-for="item in this.formdata" :span=item.spannum :key="item.actionData.workId">
                <div class="grid-content bg-purple"
                     :class="{'buttonred':(item.buttonName==='不合格')}"
                     v-loading.fullscreen.lock="fullscreenLoading" @click="tijiaofnc(item)">
                  {{item.buttonName}}</div></el-col>
            </el-row>
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
        imgbanner:[],
        audiobox:[],
        textarea: '',
        textarea1:'',//整改信息评论
        commentshow1:false,//整改信息输入框显示
        commentvalue1:'评论',//整改信息评论按钮文字
        textarea2:'',//质检信息评论
        commentshow2:false,//质检信息输入框显示
        commentvalue2:'评论',//质检信息评论按钮文字
        todotextarea:'',
        claimbtn:false,
        todoinfoshow:true,
        loginname:'',
        TaskdetailsBox:[],//整改信息数据盒子
        taskinfobox:[],//整改信息整理填充进
        commentsbox1:[],
        commentsbox2:[],
        formdata:[],//form表单返回数据
        pushdata:[],//------测试盒子
        photobox:[],//-------图片盒子
        comment_nodenum:'',//评论信息节点
        postpingluntextarea:'',//评论信息
        photosrc:[],
        nowtimedate:"",
        nowtimetime:"",
        numarr:[],
        btnform:[],
        btnsubid:'',
        btnworkid:'',
        btnformnode:[],
        pinglunarr:[],
        fullscreenLoading: false,
        dialogImageUrl: '',
        fileList: [],
        allpersonbox:[],
        alltaskpersonbox:[],
        personrow:0,
        browsepersonbox:[],
        dialogVisible: false,

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
      }
    },
    methods:{
      openPersonFacePercentDetailDialogHandle(){//打开窗口
        this.getpersonlist()
        this.getalltaskperson()
        this.getpersonprogress()
        let p = new Promise((resolve,reject) => {
            this.selectcomment()//显示评论
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
        this.imgbanner=[]
        console.log("this.commentsbox1",this.commentsbox1)
      },
      getalltaskperson(){
        const param = {
          method: 'get_flow_users',
          project_id: this.project_id,
          work_id:this.taskInfoDialog.data.workId,
        }
        this.$store.dispatch('Allpersondata', param).then((data) => {
          console.log("所有人员列表信息-------",data.data)
          this.alltaskpersonbox=[]
          this.alltaskpersonbox=data.data
        })
      },
      getpersonbrowsefnc(){//访问任务的人员
        const param = {
          method: 'get_visit_users',
          project_id: this.project_id,
          work_id:this.taskInfoDialog.data.workId
        }
        this.$store.dispatch('Allpersondata', param).then((data) => {
          this.allpersonbox=this.alltaskpersonbox
          this.browsepersonbox=data.data
          console.log("人员访问data",this.browsepersonbox)
          for(let i=0;i<this.allpersonbox.length;i++){
            this.browsepersonbox.forEach(item=>{
              if(item.person_id===this.allpersonbox[i].userId){
                this.allpersonbox[i]["state"]="xxx"
              }
            })
          }
          console.log("yongyou",this.allpersonbox)
        })
      },
      getpersonlist(){//人员列表信息接口
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          this.getpersonbrowsefnc()
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
        // console.log("接受回来的数据",this.taskInfoDialog)
        // console.log("11111111111111111",this.taskInfoDialog.data.subjectionId)
        return new Promise((resolve, reject) => {
          const _param = {
          method: 'get_flow_work',
          project_id: this.project_id,
          work_id:this.taskInfoDialog.data.workId,
          track_id:this.taskInfoDialog.data.trackId,
          subjectionId:this.taskInfoDialog.data.subjectionId
        }
        this.$store.dispatch('GetAllInstList', _param).then((data) => {
          console.log("form表单数据",data)
          this.btnform=data.form
          this.btnformnode=data.flowNode
          this.btnsubid=data.subjectionId
          this.btnworkid=data.workId
          this.formdata=data.flowButtons
          // 输入框的显示与不显示判断
          // if(this.person_info.person.name!==""){
          //   if(this.taskInfoDialog.data.header===this.person_info.person.name){
          //     this.todoinfoshow=true
          //   }
          //   if(this.taskInfoDialog.data.state==='已完成'||this.formdata[0].buttonName==="质检"){
          //     this.todoinfoshow=false
          //   }
          // }
          //输入框的显示与否
          if(data.subjectionId==""){
            this.claimbtn=false
            this.todoinfoshow=false
          }else {
            this.claimbtn=true
            let num=this.formdata.length
            this.formdata.forEach(item=>{
              item["spannum"]=24/num
            })
          }
          // 文章标题图片信息
          this.imgbanner=data.form.basic[0].value
          this.imgbanner.forEach(item=>{
            item["onlineurl"]="https://buskey.cn/api/oa/workflow/thumbnail.jpg?f="+item.src+"&w=220"
          })
          //文章音频信息   audiobox
          this.audiobox=data.form.basic[1].voicelst
          this.audiobox.forEach(item=>{
            item["audiourl"]="https://buskey.cn"+item.src
          })
          this.TaskdetailsBox=data.form.modify_check
          this.taskinfobox=[]
          console.log("this.TaskdetailsBox",this.TaskdetailsBox)
          for(var i=0;i<this.TaskdetailsBox.length;i++){
            let _index = this.TaskdetailsBox[i].count - 1
            if (this.taskinfobox[_index] === undefined){
              this.taskinfobox[_index] = []
            }
            this.taskinfobox[_index].push(this.TaskdetailsBox[i])
          }
          console.log("整改质检信息填充",this.taskinfobox)
          this.taskinfobox.forEach(item=>{
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
                  item[y]["tpshow_1"]=true
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
           console.log("taskinfobox",this.taskinfobox)
          resolve()
       })
      },
      async selectcomment(){//显示评论
        const _param = {
        method: 'query',
        project_id: this.project_id,
        work_id:this.taskInfoDialog.data.workId,
      }
      this.$store.dispatch('Postmomment', _param).then((data) => {//显示评论列表
        console.log("评论数据要分类",data.data)
        this.commentsbox1=data.data
        this.commentsbox2=[]
        this.pinglunarr=[]
        for(let i=0;i<this.commentsbox1.length;i++){
          // console.log(this.commentsbox1[i].comment_node)
          //截取返回评论节点最后一位数
          let strnum=this.commentsbox1[i].comment_node.substring(this.commentsbox1[i].comment_node.length-1,this.commentsbox1[i].comment_node.length)
          if(strnum!=="c" && strnum!=""){
            let strnum_num=parseInt(strnum)
            let _index=strnum_num-1
            if (this.pinglunarr[_index] === undefined){
              this.pinglunarr[_index] = []
            }
            this.pinglunarr[_index].push(this.commentsbox1[i])
            console.log("this.commentsbox1[i]",i,this.commentsbox1[i],)
          }
        // basic评论
          if(this.commentsbox1[i].comment_node==="basic"){
            this.commentsbox2.push(this.commentsbox1[i])
          }
        }
        console.log("---------<><><><><><",this.pinglunarr)
        console.log("显示评论列表",this.commentsbox2)
      })
        await this.taskspecificinfo()
      },
      postcomment(){//上传评论
        if(this.postpingluntextarea!=""){
         const _param = {
          method: 'comment',
          project_id: this.project_id,
          work_id:this.taskInfoDialog.data.workId,
          flow_id:this.taskInfoDialog.data.flowId,
          comment:this.postpingluntextarea,
          comment_node:this.comment_nodenum
        }
        this.$store.dispatch('Postmomment', _param).then((data) => {
          console.log("评论发送成功",data)
          this.selectcomment()
        })
        }else {
          console.log("评论内容不得为空")
        }
      },
      commentfnc(){
        this.comment_nodenum="basic"
        this.postpingluntextarea=this.textarea
        if(this.commentvalue==="评论"){
          this.commentvalue="发表"
          this.commentshow=true
          this.textarea=""
        } else {
          this.commentvalue="评论"
          this.commentshow=false
          let p = new Promise((resolve,reject) => {
            this.postcomment()
            console.log("评论上传成功")
            resolve('success')
          });
          p.then(result => {
            this.selectcomment()
            console.log("评论展示成功")
          });
        }
      },
      commentfnc1(index){//整改信息评论按钮
        this.postpingluntextarea=this.textarea1
        console.log("整改信息评论按钮",index)
        this.comment_nodenum="modify-"+index
        if(this.commentvalue1==="评论"){
          this.commentvalue1="发表"
          this.commentshow1=true
        } else {
          this.commentvalue1="评论"
          this.commentshow1=false
          this.postcomment()
          this.textarea1=""
        }
      },
      commentfnc2(index){//质检信息评论按钮
        console.log("质检信息评论按钮")
        this.postpingluntextarea=this.textarea2
        this.comment_nodenum="check-"+index
        if(this.commentvalue2==="评论"){
          this.commentvalue2="发表"
          this.commentshow2=true
          this.textarea2=""
        } else {
          this.commentvalue2="评论"
          this.commentshow2=false
          let p = new Promise((resolve,reject) => {
            this.postcomment()
            resolve('success')
          });
          p.then(result => {
            this.selectcomment()
          });
        }
      },
      handleNameClick(e) {//人物名字
        console.log("人物名字",e)
        for(let i=0;i<this.projectPersonList.length;i++){
          if(e.userId==this.projectPersonList[i].person_id){
            // this.personrow==this.projectPersonList[i]
            const param = {
              show: true,
              ...this.projectPersonList[i]
            }
            this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

            })
          }
        }
        console.log("sdasd",this.personrow)
      },
      imgURL(index){
        window.open(index)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      uploadBimItem(index){
        console.log("文件地址",index.file)

      },
      successupload(response){//图片样式更改
        console.log("图片信息返回",response.filename)
        this.photosrc.push(response.filename)
        if(this.photosrc.length>0&&this.photosrc.length<=3){//todoinfo

        }
        console.log(this.photosrc)
      },
      handleRemove(file, fileList) {
        console.log("文件地址2",file, fileList);
      },
      handlePreview(file) {
        console.log("文件地址3",file);
      },
      gettime(){//获取按钮点击时的当前时间          date: "2020-01-13 星期一"
        var myDate = new Date();
        var year = myDate.getFullYear(); //年
        var month = myDate.getMonth() + 1; //月
        var day = myDate.getDate(); //日
        var days = myDate.getDay();
        switch(days) {
            case 1:
                  days = '星期一';
                  break;
            case 2:
                  days = '星期二';
                  break;
            case 3:
                  days = '星期三';
                  break;
            case 4:
                  days = '星期四';
                  break;
            case 5:
                  days = '星期五';
                  break;
            case 6:
                  days = '星期六';
                  break;
            case 0:
                  days = '星期日';
                  break;
      }
        this.nowtimedate=year+"-"+month+"-"+day+"  "+days
        this.nowtimetime=year+"-"+month+"-"+day+"  "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds()
        console.log(this.nowtimetime)
      },
      zhijianfnc(index){
        var zjnum=(this.btnform.modify_check.length)/6+1
          console.log("这是提交质检按钮",zjnum,index)
          for(let i in this.photosrc){
            this.photobox.push({
              lx: "image",
              src: this.photosrc[i]
            })
          }
          this.pushdata.push({
            count: zjnum,
            date: this.nowtimedate,
            lable: index.buttonName,
            lx: "modify",
            time:this.nowtimetime,
            type: "title",
            value: "执行信息"
          },{
            count: zjnum,
            id: "questions_photo_modify",
            lable: "执行图片",
            lx: "modify",
            type: "multi_attach",
            upfiles: "",
            value: this.photobox
          },{
            count: zjnum,
            id: "questions_remark_modify",
            lable: "执行描述",
            lx: "modify",
            type: "multi_text",
            value:this.todotextarea ,
            voicelst: ""
          })
          console.log("this.pushdata",this.pushdata)
          for(let i in this.pushdata){
            this.btnform.modify_check.push(this.pushdata[i])
          }
          console.log("this.btnform",this.btnform)
      },
      hegefnc(index){
        console.log("这是不合格按钮和合格按钮",index.buttonName)
          var zjnum=(this.btnform.modify_check.length+3)/6
          console.log("这是不合格按钮",zjnum)
          for(let i in this.photosrc){
            this.photobox.push({
              lx: "image",
              src: this.photosrc[i]
            })
          }
          this.pushdata.push({
            btid: "reject",
            id: "quality_check",
            count: zjnum,
            date: this.nowtimedate,
            lable: index.buttonName,
            lx: "check",
            time:this.nowtimetime,
            type: "title",
            value: "质检信息"
          },{
            count: zjnum,
            btid: "reject",
            id: "questions_photo_reject",
            lable: "不合格图片",
            lx: "check",
            type: "multi_attach",
            value: this.photobox
          },{
            count: zjnum,
            id: "questions_remark_reject",
            lable: "不合格原因",
            lx: "check",
            type: "multi_text",
            value:this.todotextarea ,
            voicelst: ""
          })
        console.log("pushdate",this.pushdata)
          for(let i in this.pushdata){
            this.btnform.modify_check.push(this.pushdata[i])
          }
          console.log("this.btnform",this.btnform)
      },
      tijiaofnc(index){//提交按钮函数
        console.log("index",index,this.formdata)
        this.pushdata=[]
        this.gettime()
        if(index.buttonName=="提交质量检测"){
          this.zhijianfnc(index)
        }
        if(index.buttonName=="不合格"||index.buttonName=="合格"){
          this.hegefnc(index)
        }
         const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        // console.log("project_id",this.project_id)
        // console.log("buttonAction",index)
        // console.log("form",this.btnform)
        // console.log("subjectionId",this.btnsubid)
        // console.log("workId",this.btnworkid)
        // console.log("flowNode",this.btnformnode)
        const _param = {
          method: 'submit_work',
          project_id: this.project_id,
          buttonAction:index,
          form:this.btnform,
          subjectionId:this.btnsubid,
          workId:this.btnworkid,
          flowNode:this.btnformnode,
        }
        this.$store.dispatch('GetAllInstList', _param).then((data) => {
          console.log("按钮提交数据成功",data)
          console.log("2222222222222222222222222",this.btnsubid)
          this.todotextarea=""//输入框文本为空
          this.fileList=[]//上传按钮清空
          this.$router.go(0)
          // this.taskspecificinfo()//重新获取数据并且填充页面
          loading.close();
        })
      }
    }
  }
</script>
