<style lang="scss">
@import './indexplan';
</style>
<template>
  <div class="plan-index">
    <el-row
      :gutter="10"
      v-loading="fullscreenLoading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-col :span="3" style="padding:0px 0px 0px 5px;">
        <planindex></planindex>
      </el-col>
      <el-col :span="21">
        <!--顶部导航栏-->
        <el-row style="padding:0px 0px 10px 0px;background-color:#f5f5f5;">
          <newplandialog></newplandialog>
          <div class="boxtop_left">
            <span
              style="font-size:14px;margin-left: 15px;line-height: 35px;white-space: nowrap;display:inline-block;overflow: hidden;;text-overflow: ellipsis;width: 260px;"
            >{{this.firsttitletype}}>计划列表>{{this.bannertitle}}</span>
          </div>
          <!-- <el-progress
            v-show="progressshow"
            :percentage="progressnum"
            :format="format"
            class="jindutiao"
          ></el-progress>-->
          <!--<a href="javascript:void(0)"><div class="boxtop_right" @click="getnewplan">新增计划</div></a>-->
          <!-- <el-button
            type="primary"
            class="boxtop_right"
            @click="getnewplan"
            :loading="btnloding"
          >新增计划</el-button>-->
          <el-button
            type="primary"
            class="boxtop_right"
            @click="getnewplanV2"
            :loading="btnloding"
          >新增计划</el-button>
        </el-row>
        <!--添加定位属性-->
        <el-row class="displayplanbox" v-if="planboxshow_none">
          <span>{{searchPlanTips}}</span>
        </el-row>
        <el-row class="positionbox" v-show="!planboxshow_none">
          <!--时间线-->
          <el-col :span="4" class="blockall">
            <div class="block" style="padding-left: 0px">
              <Timeline
                :timeline-items="dataTimeline"
                :message-when-no-items="messageWhenNoItems"
                :unique-year="true"
                :unique-time-line="true"
                :show-day-and-month="false"
                order="desc"
                v-on:dataTimeClick="dataTimeClick"
              />
              <!-- <el-timeline :reverse="reverse">
                <el-timeline-item
                  v-for="(activity, index) in activities"
                  :key="index"
                  class="linespan"
                >
                  <span
                    class="activitytitle"
                    @click="showtitle(activity)"
                    :class="{active:indexspan==activity.id}"
                  >{{activity.title}}</span>
                  <span
                    style="position: absolute;top: 15px;left: 25px;font-size: 13px;color: #AAAAAA"
                  >{{activity.datayear}}</span>
                </el-timeline-item>
              </el-timeline>-->
              <!-- <el-pagination
                background
                layout="prev, pager, next"
                :current-page="currpage"
                :total="infonum"
                :page-sizes="[1,2,3]"
                :page-size="pagesize"
                @current-change="pagechange"
                @size-change="handleSizeChange"
                class="fenyeclass"
                v-show="pagingshow"
              ></el-pagination>-->
            </div>
          </el-col>
          <el-col :span="20">
            <!--计划信息栏-->
            <!-- <div class="displayplanbox" v-if="planboxshow_none">
              <span>暂无计划</span>
            </div>-->
            <van-skeleton title :row="20" v-if="skeletonshow" style="margin-top: 15px" />
            <div class="planbox" v-show="modelshow && !skeletonshow">
              <el-row>
                <div class="itemactovi" v-for="item in this.firstactivities" :key="item.id">
                  <el-row class="planboxtop">
                    <el-col
                      :span="14"
                      class="planboxtop_left"
                      style="width: 650px;height: 100%;float: left"
                    >
                      <div
                        class="planboxtop_left_1"
                        style="width: 100%;height: 50%;;overflow: hidden"
                      >
                        <el-button
                          type="primary"
                          class="taskbtn"
                          icon="el-icon-edit-outline"
                          :loading="btnloding"
                          @click="releasetemplatefnc(item)"
                          style="line-height: 10px;width: 145px;height:35px;margin-top:10px;background-color: #0081FE ;text-align: center;margin-left: 15px;border-radius: 5px;color: #ffffff;float: left"
                        >发布实施任务</el-button>
                        <h1 class="plan-title">{{item.title}}</h1>
                      </div>

                      <div
                        class="planboxtop_left_2"
                        style="width: 100%;height: 50%;overflow: hidden"
                      >
                        <span
                          style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"
                        >
                          <i class="el-icon-date"></i>
                          计划时间：{{item.start_date|formatTime}} - {{item.end_date|formatTime}}
                        </span>
                        <span
                          style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"
                        >
                          <i class="el-icon-coin"></i>
                          计划类别：{{item.firstlittertype}}
                        </span>
                        <span
                          style="line-height: 30px;display: block;float: left;margin-top: 10px;margin-left: 15px;font-size: 14px;"
                        >
                          <i class="el-icon-user"></i>
                          发布人：{{item.person_name}}
                        </span>
                      </div>
                    </el-col>
                    <el-col :lg="24" :xl="10" class="modelaaa">
                      <div
                        class="implementation"
                        style="position:relative;margin-left:5px;width: 130px;height: 60px;background-color: #0081FE;float: left;margin-top: 10px;;margin-bottom: 10px;color:#FFFFFF"
                      >
                        <div
                          class="implementation_span1"
                          style="font-size: 45px;line-height: 60px;width: 60px;text-align: center;height: 100%;float: left;"
                        >{{span4}}</div>
                        <div
                          class="implementation_span2"
                          style="float: left;margin: 30px 0px 0px 0px;"
                        >子计划</div>
                      </div>
                      <div
                        class="implementation"
                        style="position:relative;margin-left:5px;width: 130px;height: 60px;background-color: #F2F2F2;float: left;margin-top: 10px;"
                      >
                        <div
                          class="implementation_span1"
                          style="font-size: 45px;line-height: 60px;width: 60px;text-align: center;height: 100%;float: left;"
                        >{{span1}}</div>
                        <div
                          class="implementation_span2"
                          style="float: left;margin: 30px 0px 0px 0px;"
                        >实施任务</div>
                      </div>
                      <div
                        class="implementation"
                        style="position:relative;color:#fff;width: 130px;margin-left:5px;height: 60px;background-color: #008525;float: left;margin-top: 10px;"
                      >
                        <div
                          class="implementation_span1"
                          style="font-size: 45px;line-height: 60px;width: 60px;text-align: center;height: 100%;float: left;"
                        >{{span2}}</div>
                        <div
                          class="implementation_span2"
                          style="float: left;margin: 30px 0px 0px 0px;"
                        >完成任务</div>
                      </div>
                      <div
                        class="implementation"
                        style="position:relative;color:#fff;width: 130px;margin-left:5px;height: 60px;background-color: #BC0000;float: left;margin-top: 10px;"
                      >
                        <div
                          class="implementation_span1"
                          style="font-size: 45px;line-height: 60px;width: 60px;text-align: center;height: 100%;float: left;"
                        >{{span3}}</div>
                        <div
                          class="implementation_span2"
                          style="float: left;margin: 30px 0px 0px 0px;"
                        >超时任务</div>
                      </div>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-divider></el-divider>
                  </el-row>
                  <el-row style="display: block;padding-left:5px;">
                    <div class="plan-content-title">计划内容</div>
                    <div class="plan-content">
                      <div v-for="(obj,index) in item.classcontent" :key="index">
                        <p style>{{obj}}</p>
                      </div>
                    </div>
                  </el-row>
                </div>
              </el-row>
              <el-row>
                <el-divider></el-divider>
                <div class="plan-comment-area">
                  <!--显示评论-->
                  <div v-for="item in this.getcommentbox" :key="item.id" class="showcomment">
                    <span>{{item.person_name}}：</span>
                    <span>{{item.comment}}</span>
                  </div>
                  <!--上传评论-->
                  <el-input
                    v-model="commentsinput"
                    placeholder="请输入评论内容"
                    style="width: 300px;"
                    size="mini"
                  ></el-input>
                  <el-button
                    type="primary"
                    class="taskbtn"
                    icon="el-icon-chat-square"
                    @click="commentclick()"
                    size="mini"
                    style="margin-top:10px;"
                  >评论</el-button>
                </div>
              </el-row>
              <el-row v-show="!sonplanboxnoneshow">
                <el-divider></el-divider>
                <div class="plan-content-area">
                  <div class="plan-content-title">所属计划</div>
                  <div class="objjjj" v-for="obj in this.sonplanbox" :key="obj.id">
                    <a href="javascript:void(0)">
                      <div class="smallplan" @click="jumpson(obj)">
                        <div class="round">{{obj.sonnum}}</div>
                        <div class="smallplan_box">
                          <div class="smallplan_box_top">
                            <span class="sonplantitle">{{obj.title}}</span>
                            <div class="planstybox">{{obj.typename}}</div>
                          </div>
                          <span class="smallplanspan" :title="obj.content">{{obj.content}}</span>
                          <br />
                          <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </el-row>
              <el-row v-show="!taskplanboxnoneshow">
                <el-divider></el-divider>
                <div class="plan-content-area">
                  <div class="plan-content-title">实施任务</div>
                  <!--//status：-1未处理，0处理中，1完成-->
                  <div class="objjjj" v-for="obj in this.taskplanbox" :key="obj.id">
                    <div class="smallplan" :class="{'nohave':(obj.onshow=='none')}">
                      <div class="round">{{obj.sonnum}}</div>
                      <div class="smallplan_box">
                        <div class="smallplan_box_top">
                          <a href="javascript:void(0)">
                            <!-- <span
                              v-if="obj.content!==''"
                              class="sonplantitle"
                              @click="jumpfnc(obj)"
                            >{{obj.content}}</span>
                            <span
                              v-if="obj.content===''"
                              class="sonplantitle"
                              @click="jumpfnc(obj)"
                            >{{obj.title}}</span>-->
                            <span class="sonplantitle" @click="jumpfnc(obj)">{{obj.title}}</span>
                          </a>
                          <div
                            class="planstybox"
                            :class="{'timeouttask':(obj.timeout==1),'finishedtask':(obj.status==1)}"
                          >{{obj.typename}}</div>
                        </div>
                        <!-- <span
                          class="smallplanspan"
                          style="white-space: nowrap;overflow: hidden;display: inline-block;text-overflow: ellipsis;width: 700px;"
                          :title="obj.content"
                        >{{obj.content}}</span>-->
                        <!--<span style="display: block;margin-top: 10px"><i class="el-icon-folder-add" style="margin-right: 10px"></i>发布实施任务 <span style="margin-left: 10px;margin-right: 10px;color: #BABABA;">|</span> <i class="el-icon-chat-dot-square" style="margin-right: 10px"></i> 评论</span>-->
                      </div>
                    </div>
                  </div>
                </div>
              </el-row>
            </div>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <!--<div class="backtop" v-show="backtopshow" @click="backtopfnc">回到顶部</div>-->
  </div>
</template>

<script>
import Vue from 'vue'
import { Skeleton } from 'vant'
Vue.use(Skeleton)
import planindex from './planpage/index'
import newplandialog from '../../components/creatnewplan/index'
import Timeline from './components/Timeline'
import moment from 'moment'
import Cookies from 'js-cookie'
export default {
  name: 'yearsplan',
  components: {
    planindex,
    newplandialog,
    Timeline,
  },
  data() {
    return {
      searchPlanTips: '',
      btnloding: false, //按钮是否可以被点击
      skeletonshow: false,
      modelshow: false,
      currpage: 1,
      infonum: 0,
      pagesize: 1000,
      indexplanpage: 1,
      pagingshow: false,
      reverse: true,
      progressnum: 0, //进度条
      progressshow: false,
      planboxshow: true,
      idplan: [],
      mytaskbox: [],
      alltask: [],
      firsttitletype: '年计划',
      planchanidtype: 1,
      planindexworkid: 0,
      getcommentbox: [],
      commentsinput: '', //评论内容
      taskplanbox: [],
      bannertitle: '', //导航栏标题
      fatherid: 0,
      firstactivities: [],
      plan3id: '',
      activities: [],
      sonplanbox: [],
      span1: '',
      span2: '',
      span3: '',
      span4: '',
      indexspan: 0,
      pushdata: '',
      thirdinfo: [],
      postdata: [],
      firstbox: [],
      fullscreenLoading: false,
      plansonloading: false,
      planboxshow_none: true,
      sonplanboxnoneshow: false, //子计划为空时显示的文字
      taskplanboxnoneshow: false,
      pageshowtitle: 0,
      lastsonplanid: 0,
      curHeight: 0,
      scroll: '',
      backtopshow: false,

      messageWhenNoItems: '正在加载数据',
      dataTimeline: [],
    }
  },
  filters: {
    //局部过滤器
    formatTime: function (data) {
      return moment(data).format('YYYY年MM月D日')
    },
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    },
    // plan_typeid() {
    //   return this.$store.state.plantypeid.count
    // },
    plan_typeid: {
      get: function () {
        return this.$store.state.plantypeid.count
      },
      set: function (newValue) {
        this.$store.state.plantypeid.count = newValue
      },
    },
    sonplanid() {
      return this.$store.state.plantypeid.sonplanid
    },
    planindexfirstname() {
      return this.$store.state.plantypeid.planindexfirstname
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log('plan_typeid', this.plan_typeid)
      this.planchanidtype = 1
      this.modelshow = false
      this.firsttitletype = '年计划'
      this.bannertitle = ''
      this.pagingshow = false
      this.activities = []
      this.progressnum = 0
      this.planboxshow = false
      this.planboxshow_none = true
      this.getplan()
    },
    planindexfirstname(curVal) {
      console.log('*********', curVal)
      this.firsttitletype = curVal
    },
    sonplanid(curVal) {
      console.log('传输过来的sonplanid', curVal)
      this.lastsonplanid = curVal
      // console.log("传输过来的222222",this.activities)
    },
    plan_typeid(curVal, oldVal) {
      console.log('监听事件plan_typeid!!!!!', curVal)
      // this.idplan = []
      this.planboxshow_none = true
      this.planboxshow = false
      this.modelshow = false
      this.progressnum = 0
      this.bannertitle = ''
      this.pagingshow = false
      if (curVal == 1) {
        this.firsttitletype = '年计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 2) {
        this.firsttitletype = '月计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 3) {
        this.firsttitletype = '周计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 4) {
        this.firsttitletype = '日计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 5) {
        this.firsttitletype = '施工组织计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 7) {
        this.firsttitletype = '施工计划'
        this.activities = []
        this.fullscreenLoading = true
      }
      if (curVal == 0) {
        this.firsttitletype = '其他'
        this.activities = []
        this.fullscreenLoading = true
      }
      this.planchangeid()
    },
  },
  mounted() {
    if (this.project_id !== null) {
      this.getplan()
    }
    this.getwidthfnc()
    window.onresize = this.onWindowResize
  },
  methods: {
    onWindowResize() {
      this.getwidthfnc()
    },
    getwidthfnc() {
      // console.log(
      //   '获取浏览器的高度',
      //   document.documentElement.clientHeight - 85
      // )
      let blockall = document.querySelector('.blockall')
      let planbox = document.querySelector('.planbox')
      planbox.style.height = document.documentElement.clientHeight - 90 + 'px'
      blockall.style.height = document.documentElement.clientHeight - 90 + 'px'
    },
    onnewplanshowchangefnc() {
      //公共样式显示
      console.log('公共样式显示')
      this.$store.commit('newplanshowchange')
      this.$store.commit('titleboxchange', [])
    },
    releasetemplatefnc(planInfo) {
      console.log('releasetemplatefnc - 计划', planInfo)
      console.log('plan_typeid', this.plan_typeid)
      this.$router.push({
        path: '/plan/newplanV2',
        query: {
          plan_typeid: this.plan_typeid,
          plan_id: planInfo.id,
        },
      })

      //发布实施任务
      /*
      this.fullscreenLoading = false
      this.plansonloading = false
      console.log('发布实施任务', index)
      let box = this.firstactivities[0].content.split('\n')
      for (let i = 0; i < box.length; i++) {
        //{name:this.numbox[i],block:"have",blockshow1:true,blockshow2:false}
        box.splice(i, 1, {
          name: box[i],
          block: 'have',
          blockshow1: true,
          blockshow2: false,
        })
      }
      this.$store.commit('fatheridchange', index.id)
      this.$store.commit('titleboxchange', box)
      this.$store.commit('leftshowfnc')
      this.$store.commit('newplanshowchange')
      // this.$router.push({path:'/newplan'})
      */
    },
    planchangeid() {
      this.planchanidtype = this.plan_typeid
      this.fullscreenLoading = false
      this.getplan()
    },
    getcomment() {
      const param = {
        method: 'query',
        project_id: this.project_id,
        work_id: this.indexspan,
      }
      this.$store.dispatch('Postmomment', param).then((data) => {
        // console.log('获取评论', data)
        this.getcommentbox = data.data
        console.log('获取评论', this.getcommentbox)
      })
    },
    commentclick() {
      console.log('评论按钮', this.commentsinput, this.indexspan)
      const param = {
        method: 'comment',
        project_id: this.project_id,
        comment: this.commentsinput,
        work_id: this.indexspan,
        comment_node: 'plan',
        current_node: 0,
      }
      this.$store.dispatch('Postmomment', param).then((data) => {
        console.log('计划评论', data)
        this.commentsinput = ''
        this.getcomment()
      })
    },
    getnewplan() {
      this.$store.commit('leftnoshowfnc')
      this.$store.commit('titleboxchange', [])
      this.$store.commit('newplanshowchange')
    },
    getnewplanV2() {
      this.$router.push({
        path: '/plan/newplanV2',
        query: {
          plan_typeid: this.plan_typeid,
        },
      })
    },
    jumpfnc(index) {
      this.fullscreenLoading = true
      setTimeout(() => {
        this.fullscreenLoading = false
        if (this.pageshowtitle == 0) {
          this.$message('当前网络状态较差')
          return
        }
      }, 8000)
      console.log('跳转实施任务1-1', index.work_id)
      this.planindexworkid = index.work_id
      this.smalltaskfnc()
    },
    smalltaskfnc() {
      //获取任务列表接口
      console.log('跳转实施任务1-2')
      const _param = {
        method: 'query_task_all',
        project_id: this.project_id,
        limit: 10000,
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
        console.log('跳转实施任务1-3', data)
        this.firstbox = []
        data.data.forEach((item) => {
          if (this.planindexworkid == item.workId) {
            console.log('跳转实施任务1-3有任务---')
            this.firstbox.push(item)
            this.postdata = []
            this.postdata.push(item.workId)
            this.secondfnc()
            this.thirdinterface() //配置列表
          }
        })
        this.mytaskbox = data
        console.log('我的任务', data)
      })
    },
    secondfnc() {
      console.log('跳转实施任务1-4', this.postdata)
      const _param = {
        method: 'get_nodes_users_list',
        project_id: this.project_id,
        work_ids: this.postdata,
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
        this.pageshowtitle = ''
        console.log('第二接口数据', data)
        let aaa = data.data
        let map1 = new Map()
        for (var i in aaa) {
          map1.set(i, aaa[i])
        }
        this.firstbox.forEach((item) => {
          console.log('---------item', item)
          let workId = item.workId
          item['state'] = '1'
          item['obj'] = map1.get(workId)
          item['flowId2'] = item.flowId.slice(0, item.flowId.length - 2)
          item['getinfo'] = map1.get(workId).info.flowNode[0]
          if (this.thirdinfo[item.flowId2] != '') {
            //item.flowId2--->PlanFlow
            let _config = this.thirdinfo[item.flowId2] //this.thirdinfo["PlanFlow"]
            let _node = _config[item.getinfo]
            if (_node !== undefined) {
              item.state = _node.status
              item['statecolor'] = _node.color
            } else {
              item.state = '已完成'
            }
          }
        })
        const param = {
          show: true,
          data: this.firstbox[0],
        }
        this.$store
          .dispatch('SetInfoDialog', param)
          .then((data) => {})
          .catch(() => {})
        this.pageshowtitle = 1
        this.fullscreenLoading = false
      })
    },
    thirdinterface() {
      console.log('跳转实施任务1-5')
      const _param = {
        method: 'cfg_nodes',
        project_id: this.project_id,
      }
      this.$store.dispatch('Allinfodictionary', _param).then((data) => {
        this.thirdinfo = data
        console.log('第三接口', this.thirdinfo)
      })
    },
    jumpson(plan) {
      //子计划跳转
      console.log('子计划', plan)
      this.lastsonplanid = 0
      this.planchanidtype = plan.type
      this.sonplanjump(plan.id)
      this.$store.commit('sonplanchange', plan.id)
      this.$store.commit('planidchange', plan.type)
      Cookies.set('CurrentPlanType', plan.type)
      Cookies.set('CurrentPlanId', plan.id)
      // this.$router.push({ path: '/indexplan' })
      location.reload()
    },
    sonplanjump(idsss) {
      this.idplan = []
      this.idplan.push(idsss)
    },
    getplan() {
      // this.lastsonplanid = 0
      console.log('getplangetplangetplangetplan - 111')
      let cookiePlanType = Cookies.get('CurrentPlanType')
      if (cookiePlanType !== undefined) {
        this.planchanidtype = cookiePlanType
        this.plan_typeid = cookiePlanType
      }
      console.log('this.planchanidtype123', this.planchanidtype)

      let cookiePlanId = Cookies.get('CurrentPlanId')
      if (cookiePlanId !== undefined) {
        this.lastsonplanid = cookiePlanId
        this.sonplanjump(cookiePlanId)
      }
      // Cookies.remove('CurrentPlanType')
      // Cookies.remove('CurrentPlanId')
      this.messageWhenNoItems = '正在加载数据'
      this.searchPlanTips = '正在查询计划'
      const param = {
        method: 'plan_query',
        project_id: this.project_id,
        type: this.planchanidtype,
        sort: 'desc',
        page: this.indexplanpage,
        limit: this.pagesize,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        this.infonum = data.count
        if (data.count == 0) {
          console.log('plan数据为空')
          this.planboxshow_none = true
          this.planboxshow = false
          this.searchPlanTips = '当前没有' + this.firsttitletype
        } else {
          this.progressshow = true
          this.planboxshow_none = false
          this.pagingshow = true
          this.planboxshow = true
          this.progressnum = 15
        }
        console.log('plan', data)
        let planList = data.data
        console.log('planListplanList 123', planList)
        this.dataTimeline = []
        let _i = 0
        planList.forEach((item) => {
          item['classcontent'] = item.content.split('\n')
          // item['datayear'] = item.start_date.slice(0, 11)
          if (item.type == 1) {
            item['firstlittertype'] = '年计划'
          }
          if (item.type == 2) {
            item['firstlittertype'] = '月计划'
          }
          if (item.type == 3) {
            item['firstlittertype'] = '周计划'
          }
          if (item.type == 4) {
            item['firstlittertype'] = '日计划'
          }
          if (item.type == 5) {
            item['firstlittertype'] = '施工组织计划'
          }
          if (item.type == 7) {
            item['firstlittertype'] = '施工计划'
          }
          if (item.type == 0) {
            item['firstlittertype'] = '其他'
          }
          const _dateArray = item.start_date.split('-')

          let isSelected = _i === 0 ? 1 : 0
          let color = _i === 0 ? '' : '#cecece'
          this.dataTimeline.push({
            from: new Date(_dateArray[0], _dateArray[1] - 1, _dateArray[2]),
            title: `${item.title}`,
            // showDayAndMonth: false,
            description: item.start_date,
            data: item,
            isSelected: isSelected,
            color: color,
          })
          _i = _i + 1
        })

        for (let o = 0; o < planList.length; o++) {
          if (this.idplan[0] == planList[o].id) {
            this.progressnum = 30
            this.firstactivities = []
            this.activities = planList
            this.firstactivities.push(planList[o])
            this.indexspan = planList[o].id
            this.bannertitle = planList[o].title
            this.fatherid = planList[o].id
            this.plan3id = planList[o].id
            console.log('getplan2 - getplan2 -getplan2 -getplan2')
            this.getplan2() //子计划
            this.getplane3() //任务状态
            this.getcomment() //该计划的评论
            // this.idplan = []
          }
        }
        if (this.idplan.length == 0) {
          this.btnloding = false
          // this.skeletonshow=false
          console.log('idplan为空')
          this.firstactivities = []
          this.activities = planList
          if (this.activities.length > 0) {
            this.firstactivities.push(this.activities[0])
            this.indexspan = planList[0].id
            this.bannertitle = planList[0].title
            this.fatherid = planList[0].id
            this.plan3id = planList[0].id
            console.log('getplan2 - getplan2 -getplan2 -getplan2 11111')
            this.getplan2() //子计划
            this.getplane3() //任务状态
            this.getcomment() //该计划的评论
          } else {
            this.messageWhenNoItems = ''
          }
        }
        if (this.activities !== []) {
          console.log('这里是bu空的')
          this.skeletonshow = true
          let curVal = this.planchanidtype
          if (curVal == 1) {
            this.firsttitletype = '年计划'
          }
          if (curVal == 2) {
            this.firsttitletype = '月计划'
          }
          if (curVal == 3) {
            this.firsttitletype = '周计划'
          }
          if (curVal == 4) {
            this.firsttitletype = '日计划'
          }
          if (curVal == 5) {
            this.firsttitletype = '施工组织计划'
          }
          if (curVal == 7) {
            this.firsttitletype = '施工计划'
          }
          if (curVal == 0) {
            this.firsttitletype = '其他'
          }
        }
        if (this.lastsonplanid == 0) {
          console.log('还没有传输数据', this.lastsonplanid)
        }

        if (this.lastsonplanid !== 0) {
          console.log('传输过来了数据', this.lastsonplanid)
          console.log('传输过来了数据 this.activities', this.activities)
          for (let i = 0; i < this.activities.length; i++) {
            if (this.lastsonplanid == this.activities[i].id) {
              console.log('子任务跳转过来的数据', this.activities[i])
              // this.showtitle(this.activities[i])
              this.dataTimelineData(this.activities[i], true)
              // this.showtitle(this.activities[i])
            }
          }
        }
        Cookies.remove('CurrentPlanType')
        Cookies.remove('CurrentPlanId')
      })
    },
    getplan2() {
      console.log('getplan2getplan2 -123')
      const param = {
        method: 'plan_query',
        project_id: this.project_id,
        parent_id: this.fatherid,
      }
      this.sonplanbox = []
      this.$store.dispatch('Getplan', param).then((data) => {
        this.progressnum = 80
        if (data.data.length == 0) {
          this.sonplanboxnoneshow = true
        } else {
          this.sonplanboxnoneshow = false
        }
        console.log('sonplanboxnoneshow', this.sonplanboxnoneshow)
        this.sonplanbox = data.data
        this.sonplanbox.forEach((item) => {
          item['sonnum'] = this.sonplanbox.indexOf(item) + 1
          if (item.type == 1) {
            item['typename'] = '年计划'
          }
          if (item.type == 2) {
            item['typename'] = '月计划'
          }
          if (item.type == 3) {
            item['typename'] = '周计划'
          }
          if (item.type == 4) {
            item['typename'] = '日计划'
          }
          if (item.type == 5) {
            item['typename'] = '施工组织计划'
          }
          if (item.type == 6) {
            item['typename'] = '施工任务'
          }
          if (item.type == 7) {
            item['typename'] = '施工计划'
          }
          if (item.type == 0) {
            item['typename'] = '其他'
          }
        })
        this.gettaskplan()
      })
    },
    getalltask() {
      const _param = {
        method: 'get_todo_list',
        project_id: this.project_id,
        qtype: 'TodoList,BackLog,MatterRead',
      }
      this.$store.dispatch('GetAllInstList', _param).then((data) => {
        this.alltask = data
        console.log('所有任务', data)
      })
    },
    gettaskplan() {
      const param = {
        method: 'plan_query',
        project_id: this.project_id,
        type: 6,
        parent_id: this.fatherid,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        // this.getalltask()
        this.progressnum = 70
        console.log('实施任务', data)
        if (data.data.length == 0) {
          this.taskplanboxnoneshow = true
        } else {
          this.taskplanboxnoneshow = false
        }
        this.taskplanbox = []
        this.taskplanbox = data.data
        this.taskplanbox.forEach((item) => {
          item['sonnum'] = this.taskplanbox.indexOf(item) + 1
          if (item.type == 1) {
            item['typename'] = '年计划'
          }
          if (item.type == 2) {
            item['typename'] = '月计划'
          }
          if (item.type == 3) {
            item['typename'] = '周计划'
          }
          if (item.type == 4) {
            item['typename'] = '日计划'
          }
          if (item.type == 5) {
            item['typename'] = '施工组织计划'
          }
          if (item.type == 6) {
            item['typename'] = '施工任务'
          }
          if (item.type == 7) {
            item['typename'] = '施工计划'
          }
          if (item.type == 0) {
            item['typename'] = '其他'
          }
        })
        for (let i = 0; i < this.alltask.length; i++) {
          for (let j = 0; j < this.taskplanbox.length; j++) {
            if ((this.taskplanbox[j].work_id = this.alltask[i].workId)) {
              this.taskplanbox[j]['onshow'] = 'have'
            } else {
              this.taskplanbox[j]['onshow'] = 'none'
            }
          }
        }
        for (let o = 0; o < this.taskplanbox.length; o++) {
          console.log('实施任务时间', this.taskplanbox[o].end_date) //status  -1未处理  0处理中  1完成
          if (this.taskplanbox[o].status !== 1) {
            // console.log("超时实施任务",this.taskplanbox[o].finished_date)
            if (this.taskplanbox[o].finished_date == '') {
              let t1 = new Date(this.taskplanbox[o].end_date).getTime()
              let t2 = new Date().getTime()
              if (t1 < t2) {
                this.taskplanbox[o]['timeout'] = 1
              } else {
                this.taskplanbox[o]['timeout'] = 0
              }
            }
            if (this.taskplanbox[o].finished_date !== '') {
              let t1 = new Date(this.taskplanbox[o].end_date).getTime()
              let t2 = new Date(this.taskplanbox[o].finished_date).getTime()
              if (t1 < t2) {
                this.taskplanbox[o]['timeout'] = 1
              } else {
                this.taskplanbox[o]['timeout'] = 0
              }
            }
          }
        }
        console.log('实施任务有什么', this.taskplanbox)
        this.skeletonshow = false
        this.modelshow = true
        this.btnloding = false
        this.plansonloading = false
        this.progressnum = 100
      })
    },
    getplane3() {
      //任务状态
      const param = {
        method: 'plan_detail',
        project_id: this.project_id,
        id: this.plan3id,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        console.log('plan3333', data)
        this.span4 = data.data.sub_count - data.data.sub_work_count //子任务
        this.span1 = data.data.sub_work_count //实施任务
        this.span2 = data.data.sub_finished //完成任务
        this.span3 = data.data.sub_timeout //超时任务
        this.progressnum = 60
      })
    },
    showtitle(index) {
      this.skeletonshow = true
      this.modelshow = false
      this.plansonloading = true
      this.getcommentbox = []
      this.indexspan = index.id
      this.fatherid = index.id
      this.firstactivities.splice(0, 1)
      this.firstactivities.push(index)
      this.bannertitle = index.title
      this.plan3id = index.id
      console.log('showtitleshowtitleshowtitle 123')
      this.getplan2()
      this.getplane3()
      this.getcomment()
      setTimeout(() => {
        this.plansonloading = false
      }, 6000)
    },
    format(percentage) {
      return percentage === 100
        ? ('加载已完成', (this.progressshow = false))
        : `${percentage}%`
    },
    pagechange(e) {
      console.log('eeeee', e)
      this.indexplanpage = e
      this.getplan()
    },
    handleSizeChange(index) {
      console.log('eeeindex', index)
    },
    menu() {
      this.scroll =
        document.documentElement.scrollTop || document.body.scrollTop
      if (this.scroll < 500) {
        this.backtopshow = false
      }
      if (this.scroll > 500) {
        console.log('高度大于一百')
        this.backtopshow = true
        // document.querySelector('block').style.opacity="0.8";
      }
    },
    backtopfnc() {
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    },
    dataTimeClick(itemSelected) {
      console.log('dataTimeClick123', itemSelected)
      this.dataTimelineData(itemSelected.data, true)
    },
    dataTimelineData(itemData, isShowTitle) {
      this.dataTimeline.forEach((item) => {
        if (item.data.id === itemData.id) {
          item.isSelected = 1
          item.color = ''
          if (isShowTitle === true) {
            this.showtitle(item.data)
          }
        } else {
          item.isSelected = 0
          item.color = '#cecece'
        }
      })
    },
  },
}
</script>


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
