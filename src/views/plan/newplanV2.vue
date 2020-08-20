<style lang="scss">
@import './newplanV2';
</style>
<template>
  <div class="new-plan-v2">
    <el-row
      :gutter="10"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      style="height:100%"
    >
      <el-col :span="3" style="padding:0px 0px 0px 5px;height: 100%;background-color:#FFFFFF;">
        <planindex></planindex>
      </el-col>
      <el-col :span="21" style="background-color: #F9F9F9;">
        <el-row style="padding:0px 0px 10px 0px;background-color:#f5f5f5;">
          <div class="boxtop_left">
            <span class="label_op_type" v-if="isNewPlan">新增计划</span>
            <span class="label_op_type" v-if="!isNewPlan">发布实施任务</span>
          </div>
        </el-row>
        <!-- <div class="boxtop">
          <div class="boxtop_left" @click="comebackplan()">返回计划列表</div>
        </div>-->
        <el-row style="position:relative;" class="main-area">
          <div class="plantoon" v-show="leftindexshow">
            <el-form ref="planForm" :model="planForm" size="mini" :inline="false">
              <el-row>
                <div class="item-label">计划名称:</div>
                <el-form-item prop="planTitle" :rules="rulePlanTitle">
                  <el-input
                    v-model="planForm.planTitle"
                    name="planTitle"
                    placeholder="请输入计划名称"
                    :disabled="!isNewPlan"
                  ></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <div class="item-label">计划类型:</div>
                  <el-form-item>
                    <!-- <el-cascader
                      v-model="planForm.planType"
                      :options="optionstype"
                      @change="handleChangetypetid"
                      style="width: 220px;"
                      size="mini"
                    ></el-cascader>-->

                    <el-select
                      v-model="planForm.planType"
                      placeholder="请选择类型"
                      size="mini"
                      @change="handleChangetypetid"
                      :disabled="!isNewPlan"
                    >
                      <el-option
                        v-for="item in optionstype"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <div class="item-label">计划时间:</div>
                  <el-form-item prop="planTimeRange" :rules="rulePlanTimeRange">
                    <el-date-picker
                      v-model="planForm.planTimeRange"
                      name="planTimeRange"
                      type="daterange"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style="width: 230px;"
                      size="mini"
                      :disabled="!isNewPlan"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <div class="item-label">计划内容:</div>
                <el-form-item prop="planContent" :rules="rulePlanContent">
                  <el-input
                    type="textarea"
                    v-model="planForm.planContent"
                    name="planContent"
                    :rows="10"
                    :disabled="!isNewPlan"
                  ></el-input>
                </el-form-item>
              </el-row>
              <el-row>
                <!-- <div
                @click="submitPlan"
                style="width: 100%;height: 36px;text-align: center;line-height: 36px;background-color: #169BD5;color: #ffffff;margin-top: 5px;border-radius: 5px;font-size:14px;cursor:pointer;"
                >发布实施任务</div>-->

                <el-button
                  v-show="isNewPlan"
                  type="primary"
                  :loading="loading"
                  @click.native.prevent="submitPlan()"
                  class="btn-submit-plan"
                >发布实施任务</el-button>
              </el-row>
              <el-row v-show="isNewPlan">
                <div style="width: 600px;margin-top: 10px;color: #34ba9c">
                  <i
                    class="el-icon-circle-plus-outline"
                    style="float: left;display: block;margin-top: 7px;"
                  ></i>
                  <span
                    style="float: left;display: block;margin-top: 7px;cursor:pointer;font-size:14px;"
                    @click="sonplanshow"
                  >添加所属计划</span>
                  <el-cascader
                    style="float: left;margin-left: 15px;width: 260px"
                    v-show="plannewshow"
                    v-model="plannewvalue"
                    :options="plannewop"
                    @change="plannewhandleChange"
                    size="mini"
                  ></el-cascader>
                </div>
              </el-row>
            </el-form>

            <!--<el-cascader-panel :options="plannewop"></el-cascader-panel>-->
          </div>

          <!--//暂无实施计划-->
          <div class="newplanxijie">
            <div class="nulldiv" v-show="planshow">暂无计划内容</div>
            <!--有计划-->
            <!--<div class="newplanxijie_1_top" v-show="planshow2">新增实施计划</div>-->
            <div class="plan-task-area" v-show="planshow2">
              <div style="text-align:right;margin-bottom: 5px;">
                <el-button type="primary" @click="newPlanTask()">新增实施计划</el-button>
              </div>
              <div class="plan-task-list">
                <div v-for="(item,index) in this.numbox" :key="index">
                  <div class="newplanxijie_1">
                    <div class="newplanxijie_1_box">
                      <span class="newplanxijie_1_box_span1">{{item.name}}</span>
                      <span
                        style="display: block;color: #0a76a4;line-height: 50px;font-size:14px;"
                      >实施计划</span>
                      <!--<div class="jump" :class="{'classdonot':item.block=='donot'}" @click="releasefnc(item.name)">-->
                      <div class="jump" @click="releasefnc(item)" v-if="item.blockshow1">
                        <i class="el-icon-right fabuimg" style="font-size: 30px;color: #ffffff"></i>
                      </div>
                      <div class="labelIsTask" v-if="item.blockshow2">
                        <span class="fabuon">已发布</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-row>
        <div
          class="faqijihua"
          style="width: 100%;height: 80px;float: left;text-align: center;line-height: 50px;margin-top: 20px"
        >
          <!-- <div
            style=" box-shadow:0px 0px 30px #e5e5e5;width: 180px;color:#fff;border-radius:20px;height: 50px;background-color: #1ABC9C;margin: auto"
            @click="planinititate"
          >发起计划</div>-->

          <el-button type="success" @click="planinititate()" round style="width:160px;">发起计划</el-button>
        </div>
      </el-col>
    </el-row>
    <PlantaskDialog></PlantaskDialog>
  </div>
</template>

<script>
import planindex from './planpage/index'
import moment from 'moment'
import PlantaskDialog from '@/views/plan/plantaskDialog'
import Cookies from 'js-cookie'
export default {
  name: 'newplan',
  data() {
    const validatePlanTitle = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入计划名称'))
      } else {
        callback()
      }
    }
    const validatePlanTimeRange = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择计划时间'))
      } else {
        callback()
      }
    }
    const validatePlanContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入计划内容'))
      } else {
        callback()
      }
    }

    return {
      rulePlanTitle: [
        {
          required: true,
          trigger: 'blur',
          validator: validatePlanTitle,
        },
      ],
      rulePlanTimeRange: [
        {
          required: true,
          trigger: 'blur',
          validator: validatePlanTimeRange,
        },
      ],

      rulePlanContent: [
        {
          required: true,
          trigger: 'blur',
          validator: validatePlanContent,
        },
      ],
      plannewvalue: '',
      leftindexshow: true,
      faqijihuashow: false,

      oneparentid: 0,
      plannewshow: false,

      // organizationshow: true,

      structid: 0,
      plannewop: [
        { label: '年计划', value: 1, children: [] },
        { label: '月计划', value: 2, children: [] },
        { label: '周计划', value: 3, children: [] },
        { label: '日计划', value: 4, children: [] },
        { label: '施工组织计划', value: 5, children: [] },
        { label: '施工任务', value: 6, children: [] },
        { label: '施工计划', value: 7, children: [] },
        { label: '其他', value: 0, children: [] },
      ],
      planForm: {
        planTitle: '1111', // 计划标题
        planType: 1,
        planTimeRange: '',
        planContent: '222222',
      },
      planInfo: null,
      // input: '', //标题名字
      // jihuavalue: [], //计划类别
      // value1: '', //日期
      optionstype: [],
      // desc: '', //内容
      typetid: 0,
      loading: false,
      numbox: [],
      planshow: true,
      planshow2: false,
      // dialogVisible: false,

      // infonum2: 0,
      // currpage2: 1,
      // pagesize2: 20,
      // jinjianshow: false,
      // textareaindex: '',

      plangettypearr: [],

      isNewPlan: true, // 是否显示"发布实施任务"的按钮

      // optionmodel: '',
      // dingshow: false,
      // optionGroups: [],

      // fabuadress: '',
      // secondtitle: '我的任务(0)',
      // fullscreenLoading: false, //页面加载
      // activeName: 'second',
      // chaxuninput: '',
      // personlist: '',

      // mybox: [], //我的任务
      // flow_word: '',
      // qtype_word: '',
      // loginname: '',
      // currpage: 1,
      // pagesize: 20,
      // boxinfo1: [],
      // thirdinfo: [],
      // infonum: 0,
      // listbox: [],
      // boxinfo: [
      //   {
      //     maxnum: 3,
      //     title: '',
      //     imgurl: '',
      //     originator: '',
      //     flowId: '',
      //     xian: false,
      //     xian2: false,
      //     xian3: true,
      //     stateall: '11111',
      //     didiandataarr: [],
      //     workId: '',
      //     questions_type: '资料',
      //     created: '2019年9月2日 13:09:30',
      //     endtime: '2019年11月2日 13:09:30',
      //     colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      //     value: 2,
      //   },
      // ],

      // options: [
      //   { value: '选项1', label: '任务' },
      //   { value: '选项2', label: '通知' },
      //   { value: '选项3', label: '会议' },
      //   { value: '选项4', label: '资料' },
      //   { value: '选项5', label: '安全' },
      //   { value: '选项6', label: '计划' },
      // ],
      // value: '',
      // options2: [
      //   { value2: '1', label2: '安全' },
      //   { value2: '2', label2: '质量' },
      //   { value2: '3', label2: '技术' },
      //   { value2: '4', label2: '施工' },
      //   { value2: '5', label2: '资料' },
      //   { value2: '6', label2: '财务' },
      //   { value2: '7', label2: '物资' },
      //   { value2: '8', label2: '劳务' },
      //   { value2: '9', label2: '法务预算' },
      //   { value2: '10', label2: '综合' },
      //   { value2: '11', label2: '平台技术' },
      // ],
      // value2: '',
      // options3: [
      //   { value3: '选项1', label: '进行中' },
      //   { value3: '选项2', label: '已完成' },
      //   { value3: '选项3', label: '超时' },
      // ],
      // value3: '',
      // options4: [
      //   { value4: '选项1', label: '待办' },
      //   { value4: '选项2', label: '完成' },
      //   { value4: '选项3', label: '我的发布' },
      // ],
      // value4: '',
      // postdata: [],
      // events: [],
      // config: {
      //   buttonText: { today: '今天', month: '月', week: '周', day: '日' },
      //   locale: 'zh-cn',
      //   editable: false, // 是否允许修改事件
      //   selectable: false,
      //   eventLimit: 4, // 事件个数
      //   allDaySlot: false, // 是否显示allDay
      //   defaultView: 'month', // 显示默认视图
      //   eventClick: this.eventClick, // 点击事件
      //   dayClick: this.dayClick, // 点击日程表上面某一天
      // },
    }
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    },
    plan_typeid() {
      return this.$store.state.plantypeid.count
    },

    // person_info() {
    //   return this.$store.state.person.personInfo
    // },

    titlebox() {
      //页面传来的title
      return this.$store.state.plantypeid.titlebox
    },
    // leftshow() {
    //   return this.$store.state.plantypeid.leftshow
    // },
    fatherid() {
      return this.$store.state.plantypeid.fatherid
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log('项目id改变', curVal, oldVal)
      // this.getstyle()
      this.init()
    },
    titlebox(curVal) {
      console.log('titlebox', curVal)
    },
    leftshow(index) {
      this.leftshowfnc(index)
    },
    fatherid(curVal, oldVal) {
      console.log('接受到父亲id改变', curVal, oldVal)
      this.fatheridchange()
    },
    plan_typeid(curVal, oldVal) {
      console.log('监听事件plan_typeid', curVal)
      this.$router.push({ path: '/indexplan' })
    },
  },
  mounted() {
    if (this.project_id !== null) {
      this.init()
    }
  },
  components: {
    planindex,
    PlantaskDialog,
  },
  methods: {
    async init() {
      this.planInfo = null
      console.log('mounted - V2')
      this.numbox = []
      console.log('_plan_id_plan_id1', this.$route.query)
      const _plan_typeid = this.$route.query.plan_typeid // 类别
      console.log('_plan_typeid', _plan_typeid)
      if (_plan_typeid !== undefined) {
        this.planForm.planType = parseInt(_plan_typeid)
      }
      const _plan_id = this.$route.query.plan_id // 类别

      if (_plan_id !== undefined) {
        this.isNewPlan = false
        console.log('_plan_id_plan_id', _plan_id)
        await this.getPlanByPlanId(_plan_id)
        this.getPlanTaskShow(_plan_id)
      }

      this.getstyle()
      // if (this.leftshow == 'have') {
      //   // this.leftindexshow = false
      //   this.planshow = false
      //   this.planshow2 = true
      //   this.numbox = this.titlebox
      // }
      // if (this.leftshow == 'none') {
      //   // this.leftindexshow = true
      // }
      // console.log('leftshow的表现状态', this.fatherid)
      // this.oneparentid = this.fatherid
    },
    planinititate() {
      // this.$router.push({
      //   name: 'yearsplan',
      //   // query: {
      //   //   taskid:index.id
      //   // }
      // })
      if (this.planInfo !== null) {
        console.log('this.oneparentidthis.oneparentid', this.oneparentid)
        Cookies.set('CurrentPlanType', this.planInfo.type)
        Cookies.set('CurrentPlanId', this.oneparentid)
      }
      this.$router.push({ path: '/indexplan' })
    },
    fatheridchange() {
      console.log('父级id变化', this.fatherid)
    },
    // leftshowfnc() {
    //   // console.log("左边状态",this.leftshow)
    // },
    handleChangetypetid(value) {
      console.log('ddddddd', value)
      this.typetid = value
    },
    sonplanshow() {
      // 添加所属计划
      this.loading = true
      this.getplan()
    },
    getPlanByPlanId(planId) {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'plan_query',
          project_id: this.project_id,
          ids: [planId],
        }
        this.$store.dispatch('Getplan', param).then((data) => {
          console.log('plan_data1', data)
          const _planInfo = data.data[0]

          console.log('_planInfo123', _planInfo)
          this.planInfo = {
            project_id: this.project_id,
            title: _planInfo.title,
            content: _planInfo.content, //this.desc
            start_date: _planInfo.start_date,
            end_date: _planInfo.end_date,
            type: _planInfo.type, //this.typetid
          }
          resolve()
        })
      })
    },
    getplan() {
      const param = {
        method: 'plan_query',
        project_id: this.project_id,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        console.log('下拉框data', data)
        for (let i = 0; i < data.data.length; i++) {
          if (data.data[i].type == 1) {
            this.plannewop[0].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 2) {
            this.plannewop[1].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 3) {
            this.plannewop[2].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 4) {
            this.plannewop[3].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 5) {
            this.plannewop[4].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 6) {
            this.plannewop[5].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 7) {
            this.plannewop[6].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
          if (data.data[i].type == 0) {
            this.plannewop[6].children.push({
              label: data.data[i].title,
              value: i,
            })
          }
        }
        this.plannewshow = true
        this.loading = false
        console.log('plannewop', this.plannewop)
      })
    },
    getPlanTask(planId) {
      return new Promise((resolve, reject) => {
        const param = {
          method: 'plan_query',
          project_id: this.project_id,
          type: 6,
          parent_id: planId,
        }
        this.$store.dispatch('Getplan', param).then((data) => {
          // this.getalltask()
          console.log('实施任务 - data', data)
          const _taskList = data.data
          console.log('_taskList', _taskList)
          resolve(_taskList)
        })
      })
    },
    async getPlanTaskShow(plan_id) {
      let taskList = await this.getPlanTask(plan_id)
      let taskMap = new Map()
      taskList.forEach((task) => {
        taskMap.set(task.content, task)
        taskMap.set(task.title, task)
      })
      console.log('_planInfo345', this.planInfo)
      console.log('taskMap', taskMap)
      this.planForm = {
        planTitle: this.planInfo.title, // 计划标题
        planType: this.planInfo.type,
        planTimeRange: [this.planInfo.start_date, this.planInfo.end_date],
        planContent: this.planInfo.content,
      }
      this.oneparentid = plan_id
      this.numbox = this.planForm.planContent.split('\n')
      console.log('实施计划的盒子1122', this.numbox)
      let planContentMap = new Map()
      for (let i = 0; i < this.numbox.length; i++) {
        // blockshow:true,blockshow:false
        let hasTask = false
        let _name = this.numbox[i]
        if (taskMap.get(_name) !== undefined) {
          hasTask = true
        }
        this.numbox.splice(i, 1, {
          name: _name,
          block: 'have',
          blockshow1: !hasTask,
          blockshow2: hasTask,
        })
        planContentMap.set(_name, i)
      }
      console.log('planContentMap', planContentMap)
      taskList.forEach((task) => {
        if (
          planContentMap.get(task.content) === undefined &&
          planContentMap.get(task.title) === undefined
        ) {
          this.numbox.push({
            name: task.content !== '' ? task.content : task.title,
            block: 'have',
            blockshow1: false,
            blockshow2: true,
          })
        }
      })
      this.planshow = false
      this.planshow2 = true
    },
    plannewhandleChange(val) {
      console.log('val', val)
      this.structid = val[0]
    },

    getstyle() {
      //获取计划类型
      const param = {
        method: 'plan_type',
        project_id: this.project_id,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        console.log('planstyle', data.data)
        this.optionstype = data.data
        this.optionstype.forEach((item) => {
          item['label'] = item.name
          item['value'] = parseInt(item.tid)
        })
        console.log('this.optionstype', this.optionstype)
        this.plangettypearr = this.optionstype
      })
    },
    submitPlan() {
      this.$refs.planForm.validate((valid) => {
        console.log('valid', valid)
        if (valid) {
          //提交计划
          this.numbox = []
          this.numbox = this.planForm.planContent.split('\n')
          console.log('实施计划的盒子', this.numbox)
          for (let i = 0; i < this.numbox.length; i++) {
            // blockshow:true,blockshow:false
            this.numbox.splice(i, 1, {
              name: this.numbox[i],
              block: 'have',
              blockshow1: true,
              blockshow2: false,
            })
          }
          console.log('新数组', this.numbox)

          this.faqijihuashow = true
          let startDate = moment(this.planForm.planTimeRange[0]).format(
            'YYYY-MM-DD'
          )
          let endDate = moment(this.planForm.planTimeRange[1]).format(
            'YYYY-MM-DD'
          )
          this.loading = true
          const param = {
            method: 'plan_add',
            project_id: this.project_id,
            title: this.planForm.planTitle, //this.input
            content: this.planForm.planContent, //this.desc
            start_date: startDate,
            end_date: endDate,
            type: this.planForm.planType, //this.typetid
          }
          this.planInfo = param
          console.log('plan_add - param:', param)
          // this.loading = false
          // this.planshow = false
          // this.planshow2 = true
          // return
          this.$store.dispatch('Getplan', param).then((data) => {
            console.log('新建计划提交状态', data)
            this.oneparentid = data.id
            this.loading = false
            this.numbox = []
            this.numbox = this.planForm.planContent.split('\n')
            for (let i = 0; i < this.numbox.length; i++) {
              this.numbox.splice(i, 1, {
                name: this.numbox[i],
                block: 'have',
                blockshow1: true,
                blockshow2: false,
              })
            }
            console.log('this.numboxthis.numboxthis.numbox', this.numbox)
            this.planshow = false
            this.planshow2 = true
          })
        }
      })
    },
    releasefnc(item) {
      //发布任务弹窗
      // this.dialogVisible = true
      // this.textareaindex = index

      const param = {
        show: true,
        item: item,
        planInfo: this.planInfo,
        plan_id: this.oneparentid,

        // position: this.currentDevicePosition,
        // rotate: this.currentDeviceRotate
      }
      console.log('paramparam', param)
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowPlanTaskDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    newPlanTask() {
      const param = {
        show: true,
        plan_id: this.oneparentid,
        planInfo: this.planInfo,
        // position: this.currentDevicePosition,
        // rotate: this.currentDeviceRotate
      }
      console.log('paramparam', param)
      // this.$store.dispatch('SetVideoDialog', param).then(() => {}).catch(() => {})
      this.$store
        .dispatch('ShowPlanTaskDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    // eventClick(event) {
    //   console.log('日历点击成功', event)
    // },
    // nowdayfnc(data) {
    //   console.log('当天', data)
    // },
    // jinjianclick() {
    //   //精简条件显示开关
    //   this.jinjianshow = !this.jinjianshow
    // },
    // jinjianleibie() {
    //   this.queryFun()
    // },
    // jinjianleixing() {
    //   this.queryFun()
    // },
    // jinjianzhuangtai() {
    //   this.queryFun()
    // },

    // gettypearrchange(index) {
    //   this.getcategory_flowid = this.gettypearr[index].flowid
    //   console.log('getcategory_flowid', this.getcategory_flowid, index)
    //   this.getcategory()
    // },

    // pagechange(e) {
    //   //每页多少条数据
    //   this.currpage = e
    //   this.allpersondata()
    // },
    // pagechange2(e) {
    //   console.log('当前页数', e)
    // },

    // secondpage() {
    //   this.boxinfo1 = this.boxinfo
    //   // console.log('页面渲染页面数据',this.boxinfo1)
    //   //整理筛选出需要传递的参数
    //   this.postdata = []
    //   this.boxinfo1.forEach((item) => {
    //     this.postdata.push(item.workId)
    //     item.imgurl =
    //       'https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=' +
    //       item.workId +
    //       '&w=220'
    //   })
    //   //调用接口
    //   this.getlistinfo()
    // },
    // handleSizeChange(e) {
    //   this.pagesize = e
    // },
    // getPerson() {
    //   return new Promise((resolve, reject) => {
    //     const param = {
    //       method: 'query',
    //     }
    //     this.$store
    //       .dispatch('QueryPersonInfo', param)
    //       .then((data) => {
    //         console.log('当前登陆人员', data.person.name)
    //         this.loginname = data.person.name
    //       })
    //       .catch(() => {
    //         resolve()
    //       })
    //   })
    // },
    // allpersondata() {
    //   const _param = {
    //     method: 'query_task_all',
    //     project_id: this.project_id,
    //     page: this.currpage,
    //   }
    //   this.$store.dispatch('Allpersondata', _param).then((data) => {
    //     console.log('第一接口返回成功', data)
    //     console.log('第一接口数据Allpersondata', data.data)
    //     console.log('++++', this.events)
    //     this.getpersonlist()
    //     this.infonum = data.count
    //     this.bannertitle = '任务大厅(' + data.count + ')'
    //     this.boxinfo = []
    //     this.boxinfo1 = []
    //     this.boxinfo = data.data
    //     this.events = []
    //     //事件监听flowid,判断任务类型
    //     this.boxinfo.forEach((item) => {
    //       if (item.flowId === 'Meeting01') {
    //         item.stateall = '会议'
    //       }
    //       if (item.flowId === 'ProblemFindSolve01') {
    //         item.stateall = '任务'
    //       }
    //       if (item.flowId === 'SafetyInspection01') {
    //         item.stateall = '安全巡检'
    //       }
    //       if (item.flowId === 'Notice01') {
    //         item.stateall = '通知'
    //       }
    //       if (item.flowId === 'Documents01') {
    //         item.stateall = '资料'
    //       }
    //       if (item.flowId === 'PlanFlow01') {
    //         item.stateall = '计划'
    //       }
    //     })
    //     //页面刷新自动去第一页
    //     this.secondpage()
    //   })
    // },
    // handleNameClick(row) {
    //   //人物名字
    //   console.log('人物列表', this.projectPersonList)
    //   this.projectPersonList.forEach((item) => {
    //     if (row == item.person_id) {
    //       this.personlist = item
    //       console.log('符合的ID人', item.name)
    //     }
    //   })
    //   const param = {
    //     show: true,
    //     ...this.personlist,
    //   }
    //   this.$store
    //     .dispatch('SetPersonInfoDialog', param)
    //     .then(() => {})
    //     .catch(() => {})
    // },
    // getlistinfo() {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: 'Loading',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(0, 0, 0, 0.7)',
    //   })
    //   const _param = {
    //     method: 'get_nodes_users_list',
    //     project_id: this.project_id,
    //     work_ids: this.postdata,
    //   }
    //   this.$store.dispatch('Allpersondata', _param).then((data) => {
    //     // console.log("第二接口返回成功",data.data)
    //     this.listbox = data.data
    //     let mar1 = []
    //     let map1 = new Map()
    //     for (var i in this.listbox) {
    //       map1.set(i, this.listbox[i]) //添加key值
    //     }
    //     // console.log(map1)
    //     let box = []
    //     this.boxinfo1.forEach((item) => {
    //       let workId = item.workId
    //       // console.log('------info',map1.get(workId).info)
    //       item['obj'] = map1.get(workId) //把接口2获取到的文档配置到数据中
    //       item['state'] = '1' //任务状态
    //       item['xian'] = false //负责人显示
    //       item['xian2'] = false //质检人显示
    //       item['xian3'] = false //第二类人物类型
    //       item['imgurl'] =
    //         'https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=' +
    //         item.workId +
    //         '&w=220'
    //       item['getinfo'] = map1.get(workId).info.flowNode[0] //获取到显示任务类型的配置数据
    //       item['originator'] = map1.get(workId).Start[0].userName //获取懂啊key值对应的数据   info.priority
    //       if (item.questions_type != '') {
    //         item['xian3'] = true
    //       }
    //       if (map1.get(workId).info != undefined) {
    //         item['value'] = map1.get(workId).info.priority //任务星级
    //       }
    //       if (item.obj.Node2 != undefined) {
    //         item['person_id1'] = item.obj.Node1[0].userId //发起人ID
    //       }
    //       if (item.flowId != null) {
    //         item['flowId2'] = item.flowId.slice(0, item.flowId.length - 2) //截取字符，判断任务类型，和接口文档匹配
    //       }
    //       if (item.obj.info.comment_count == 0) {
    //         item['imgboxyuanshow'] = false
    //       }
    //       if (item.obj.info.comment_count != 0) {
    //         item['imgboxyuanshow'] = true
    //       }
    //       if (item.obj.Node2 != undefined) {
    //         item['firstname'] = item.obj.Start[0].userName
    //         item['header'] = item.obj.Node2[0].userName //负责人
    //         item['person_id2'] = item.obj.Node2[0].userId //负责人ID
    //         item.xian = true
    //       } else {
    //         item.xian = false
    //       }
    //       if (item.obj.Node5 != undefined) {
    //         item['qualiter'] = item.obj.Node5[0].userName //质检人
    //         item['person_id3'] = item.obj.Node5[0].userId //负责人ID
    //         item.xian2 = true
    //       } else {
    //         item.xian2 = false
    //       }
    //       //和第三接口配置文档进行匹配
    //       if (this.thirdinfo[item.flowId2] != '') {
    //         let _config = this.thirdinfo[item.flowId2]
    //         let _node = _config[item.getinfo]
    //         if (_node !== undefined) {
    //           item.state = _node.status
    //           item['statecolor'] = _node.color
    //         } else {
    //           // item.state = item.getinfo
    //           item.state = '已完成'
    //         }
    //         loading.close()
    //       }
    //       box.push(item)
    //     })
    //     if (this.boxinfo.length == 20) {
    //       for (let i = 0; i < this.boxinfo.length; i++) {
    //         //我的任务日历渲染
    //         if (this.boxinfo[i].statecolor == 'red') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].created, // 事件开始时间
    //             end: this.boxinfo[i].created, // 事件结束时间
    //             color: '#FF0000', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'yellow') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].created, // 事件开始时间
    //             end: this.boxinfo[i].created, // 事件结束时间
    //             color: '#9ACD32', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'green') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].created, // 事件开始时间
    //             end: this.boxinfo[i].created, // 事件结束时间
    //             color: '#008000', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'gray') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].created, // 事件开始时间
    //             end: this.boxinfo[i].created, // 事件结束时间
    //             color: '#BABABA', // 事件的显示颜色
    //           })
    //         }
    //       }
    //     } else {
    //       for (let i = 0; i < this.boxinfo.length; i++) {
    //         //我的任务日历渲染
    //         if (this.boxinfo[i].statecolor == 'red') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].sendTime, // 事件开始时间
    //             end: this.boxinfo[i].sendTime, // 事件结束时间
    //             color: '#FF0000', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'yellow') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].sendTime, // 事件开始时间
    //             end: this.boxinfo[i].sendTime, // 事件结束时间
    //             color: '#9ACD32', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'green') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].sendTime, // 事件开始时间
    //             end: this.boxinfo[i].sendTime, // 事件结束时间
    //             color: '#008000', // 事件的显示颜色
    //           })
    //         }
    //         if (this.boxinfo[i].statecolor == 'gray') {
    //           this.events.push({
    //             title: this.boxinfo[i].title, // 事件内容
    //             start: this.boxinfo[i].sendTime, // 事件开始时间
    //             end: this.boxinfo[i].sendTime, // 事件结束时间
    //             color: '#BABABA', // 事件的显示颜色
    //           })
    //         }
    //       }
    //     }
    //     this.boxinfo1 = box
    //   })
    // },
    // thirdinterface() {
    //   const _param = {
    //     method: 'cfg_nodes',
    //     project_id: this.project_id,
    //   }
    //   this.$store.dispatch('Allinfodictionary', _param).then((data) => {
    //     this.thirdinfo = data
    //     this.activeName = 'second'
    //     console.log('第三接口', this.thirdinfo)
    //   })
    // },

    // queryFun() {
    //   console.log('查询按钮获取信息', this.value, this.value2, this.value3) //flow_word
    //   if (this.value == '任务') {
    //     //任务，通知，会议，资料,安全,计划
    //     this.flow_word = 'ProblemFindSolve01'
    //   }
    //   if (this.value == '会议') {
    //     this.flow_word = 'Meeting01'
    //   }
    //   if (this.value == '通知') {
    //     this.flow_word = 'Notice01'
    //   }
    //   if (this.value == '资料') {
    //     this.flow_word = 'Documents01'
    //   }
    //   if (this.value == '安全') {
    //     this.flow_word = 'SafetyInspection01'
    //   }
    //   if (this.value == '计划') {
    //     this.flow_word = 'PlanFlow01'
    //   }
    //   if (this.value3 == '进行中') {
    //     this.qtype_word = 'inProgress'
    //   }
    //   if (this.value3 == '已完成') {
    //     this.qtype_word = 'hasDone'
    //   }
    //   console.log('更改选择条件', this.qtype_word, this.flow_word)
    //   const _param = {
    //     method: 'query_task_all_list',
    //     project_id: this.project_id,
    //     flow_id: this.flow_word, //value
    //     qtype: this.qtype_word, //完成未完成
    //     questions_type: this.value2, //安全，技术平台
    //     keyword: this.chaxuninput, //输入框
    //     page: this.currpage,
    //   }
    //   this.$store.dispatch('Allpersondata', _param).then((data) => {
    //     console.log('查询按钮', data)
    //     this.infonum = data.count
    //     this.bannertitle = '任务大厅(' + data.count + ')'
    //     this.boxinfo1 = []
    //     this.boxinfo = data.data
    //     //事件监听flowid,判断任务类型
    //     this.boxinfo.forEach((item) => {
    //       if (item.flowId === 'Meeting01') {
    //         item.stateall = '会议'
    //       }
    //       if (item.flowId === 'ProblemFindSolve01') {
    //         item.stateall = '任务'
    //       }
    //       if (item.flowId === 'SafetyInspection01') {
    //         item.stateall = '安全巡检'
    //       }
    //       if (item.flowId === 'Notice01') {
    //         item.stateall = '通知'
    //       }
    //       if (item.flowId === 'Documents01') {
    //         item.stateall = '资料'
    //       }
    //       if (item.flowId === 'PlanFlow01') {
    //         item.stateall = '计划'
    //       }
    //     })
    //     //页面刷新自动去第一页
    //     this.secondpage()
    //   })
    // },
    // infoshow(index) {
    //   console.log('详情页面展示信息', index)
    //   const param = {
    //     show: true,
    //     data: index,
    //   }
    //   this.$store
    //     .dispatch('SetInfoDialog', param)
    //     .then(() => {})
    //     .catch(() => {})
    // },
    // mytaskfnc() {
    //   const _param = {
    //     method: 'get_todo_list',
    //     project_id: this.project_id,
    //     qtype: 'TodoList,BackLog,MatterRead',
    //   }
    //   this.$store.dispatch('GetAllInstList', _param).then((data) => {
    //     console.log('我的任务', data)
    //     data.forEach((item) => {
    //       item['aaaid'] = data.indexOf(item)
    //     })
    //     this.secondtitle = '我的任务(' + data.length + ')'
    //     this.infonum2 = data.length
    //     this.boxinfo = []
    //     this.boxinfo1 = []
    //     this.boxinfo = data
    //     this.events = []
    //     //事件监听flowid,判断任务类型
    //     this.boxinfo.forEach((item) => {
    //       if (item.flowId === 'Meeting01') {
    //         item.stateall = '会议'
    //       }
    //       if (item.flowId === 'Documents01') {
    //         item.stateall = '资料'
    //       }
    //       if (item.flowId === 'PlanFlow01') {
    //         item.stateall = '计划'
    //       }
    //       if (item.flowId === 'ProblemFindSolve01') {
    //         item.stateall = '任务'
    //       }
    //       if (item.flowId === 'SafetyInspection01') {
    //         item.stateall = '安全巡检'
    //       }
    //       if (item.flowId === 'Notice01') {
    //         item.stateall = '通知'
    //       }
    //     })
    //     //页面刷新自动去第一页
    //     this.secondpage()
    //   })
    // },
    //我的任务
    // mytask(tab, event) {
    //   if (tab.name == 'second') {
    //     this.mytaskfnc()
    //   } else {
    //     this.allpersondata()
    //   }
    // },

    comebackplan() {
      this.$router.push({ path: '/indexplan' })
    },
  },
}
</script>
