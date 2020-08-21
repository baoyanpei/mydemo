<style lang="scss">
@import './plantaskDialog';
</style>
<template>
  <div id="plan-task-dialog" class="plan-task-dialog">
    <el-dialog
      :modal="true"
      width="560px"
      top="10vh"
      left="80"
      :lock-scroll="true"
      :close-on-click-modal="false"
      :close-on-press-escape="true"
      :visible.sync="PlanTaskDialog.show"
      @opened="openedDialogHandle"
      @close="closeDialogHandle"
      :title="dialogTitle"
      v-el-drag-dialog
    >
      <div
        class="ding"
        v-show="dingshow"
        style="padding-top:20px;position: absolute;background-color: #fff;right: -290px;width: 250px;height: 400px;border: 1px solid #eeeeee;padding: 10px;"
      >
        <div style="padding:10px;">添加人员：</div>
        <el-cascader
          :props="props"
          :options="grouparr"
          :show-all-levels="false"
          @change="handleChange"
          size="mini"
          style="display: block;margin: auto;"
        ></el-cascader>
        <div
          class="bottom"
          style="position: absolute;bottom: 20px;text-align: center;width: 230px;"
        >
          <el-button type="success" @click="grouparrqueren" size="mini">关闭</el-button>
        </div>
      </div>
      <div class="fabudiv" style="width: 100%;margin-bottom: 15px;position: relative;">
        <!-- <iframe
          :src="iframeurl"
          v-show="iframeshow"
          frameborder="0"
          style="padding-top:20px;position: absolute;background-color: #ffffff;top: -65px;right: -420px;width: 400px;height: 400px;"
        ></iframe>-->
        <el-form ref="planTaskForm" :model="planTaskForm" label-width="100px">
          <el-form-item prop="taskContent" label="发布内容：" :rules="ruleTaskContent">
            <el-input
              type="textarea"
              name="taskContent"
              placeholder="请输入发布内容"
              v-model="planTaskForm.taskContent"
              maxlength="200"
              style="width: 400px"
              show-word-limit
            ></el-input>
          </el-form-item>
          <div v-if="shigongzuzhishow">
            <el-form-item label="组织计划：">
              <el-cascader
                style="width: 400px"
                :options="organizationarr"
                v-model="organizationvalue"
                @change="handleChangegetorganization"
                size="mini"
              ></el-cascader>
            </el-form-item>
          </div>
          <el-form-item label="添加附件：">
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
            >
              <el-button size="mini" type="success" @click="clickupload(2)">点击上传</el-button>
              <div slot="tip" class="el-upload__tip" style="display: none;">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
          <el-form-item prop="questions_type" label="类型：" :rules="ruleQuestionsType">
            <!-- <el-cascader
              :options="leibieoptions"
              @change="handleChangegetleixin"
              :show-all-levels="false"
              size="mini"
            ></el-cascader>-->

            <el-select
              name="questions_type"
              v-model="planTaskForm.questions_type"
              placeholder="请选择类型"
              size="mini"
            >
              <el-option
                v-for="item in leibieoptions"
                :key="item.value"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="建筑：">
            <el-cascader
              :options="building"
              @change="buildingchange"
              :show-all-levels="false"
              style="width:300px;"
              size="mini"
            ></el-cascader>
          </el-form-item>
          <div class="fabudiv" style="width: 100%;padding-bottom: 10px;">
            <el-form-item label="地点：">
              <el-cascader
                :options="didianarr"
                @change="didianarrchange"
                :show-all-levels="false"
                style="width:300px;"
                size="mini"
              ></el-cascader>
              <el-button type="primary" @click="findbim" size="mini">查看BIM</el-button>
            </el-form-item>
          </div>
          <el-form-item label="备注：">
            <el-input v-model="beizhuinput" placeholder="请输入备注" style="width:300px;" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="指定负责人：">
            <el-button type="success" @click="addperson()" size="mini">添加人员</el-button>
            <span v-for="item in this.fabu_people" :key="item.id">
              <span style="margin-right: 10px">{{item.name}}</span>
            </span>
          </el-form-item>
          <el-form-item label="重要性：">
            <el-rate v-model="zhongyaoxing" @change="startchange" :max="3" style="float: left"></el-rate>
          </el-form-item>

          <el-button
            type="success"
            :loading="loading"
            @click="plantaskSubmit()"
            style="width: 100%;margin-top: 20px;"
            size="mini"
          >发布</el-button>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let Base64 = require('js-base64').Base64

import { Loading } from 'element-ui'
import { getToken } from '@/utils/auth'
export default {
  components: {},
  directives: {},
  data() {
    const validateTaskContent = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入计划名称'))
      } else {
        callback()
      }
    }
    const validateQuestionsType = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择一个类型'))
      } else {
        callback()
      }
    }

    return {
      ruleTaskContent: [
        {
          required: true,
          trigger: 'blur',
          validator: validateTaskContent,
        },
      ],
      ruleQuestionsType: [
        {
          required: true,
          trigger: 'blur',
          validator: validateQuestionsType,
        },
      ],
      loadingFull: false,
      dialogTitle: '发布',
      tipMessage: '',

      didianarr: [],
      optionmodel: '',
      planindexworkid: 0,
      // oneparentid: 0,
      organizationarr: [],
      organizationvalue: '',
      shigongzuzhishow: false,
      structid: 0,

      plantextarea: '', //计划内容
      plantime: '',
      // plantypevalue: '',
      typetid: 0,
      loading: false,

      numbox: [],
      iframeurl: '',
      iframeshow: false,
      leibieoptions: [],
      didian: [],
      bimopen: [],

      datalistfrom: {
        title: '',
        modify_count: 0,
        check_count: 0,
        basic: [
          {
            lx: 'basic',
            id: 'questions_photo',
            lable: '现场拍摄',
            type: 'multi_attach',
            value: [],
          },
          {
            lx: 'basic',
            id: 'questions_photo',
            lable: '附件',
            type: 'files',
            value: [],
          },
          {
            id: 'questions_remark',
            lx: 'basic',
            lable: '问题描述',
            type: 'multi_text',
            value: '',
            voicelst: '',
          },
        ],
        time: '',
        address: '',
        receive: [],
        modify_check: [],
        receiver: '',
      },

      bimitemid: '',
      fabu_people: [],
      fabustartvalue: '',
      // fabuquestions_type: '',
      fabufncflowid: '',
      aaaa: [],
      grouparr: [],
      props: { multiple: true },
      dingshow: false,

      building_itemid: '',
      buildingMap: null,
      building: [],
      getcategory_flowid: '',
      zhongyaoxing: null,
      gettypearr: [],
      beizhuinput: '',
      fileList: [],
      // textareaindex: '',

      plan_id: 0,
      planInfo: null, //计划的信息
      planTaskForm: {
        taskContent: '',
        questions_type: '',
      },
    }
  },
  computed: {
    project_id: {
      get: function () {
        return this.$store.state.project.project_id
      },
      set: function (newValue) {
        this.$store.state.project.project_id = newValue
      },
    },
    PlanTaskDialog: {
      get: function () {
        return this.$store.state.plan.PlanTaskDialog
      },
      set: function (newValue) {
        this.$store.state.plan.PlanTaskDialog = newValue
      },
    },
    projectGroupList() {
      //组别
      return this.$store.state.project.projectGroupList
    },
    projectPersonList() {
      //人员列表信息
      return this.$store.state.project.projectPersonList
    },
  },
  props: {},
  created: function () {},
  mounted() {},
  watch: {},
  methods: {
    clearData() {
      this.plan_id = 0
      this.planInfo = null // 计划信息
      // this.fabuquestions_type = '' // 类型
      this.planTaskForm.taskContent = ''
      this.planTaskForm.questions_type = ''

      this.didianarr = []
      this.buildingMap = null
    },
    openedDialogHandle() {
      console.log('this.PlanTaskDialog1', this.PlanTaskDialog)
      this.planInfo = this.PlanTaskDialog.planInfo
      const item = this.PlanTaskDialog.item
      console.log('this.planInfo', this.planInfo)
      if (this.planInfo !== undefined) {
        this.typetid = this.planInfo.type
      }

      this.plan_id = this.PlanTaskDialog.plan_id
      if (item !== undefined) {
        this.planTaskForm.taskContent = item.name
      }

      //打开发布任务窗口
      console.log('施工组织计划', this.typetid)
      if (this.typetid == 5 || this.typetid == 7) {
        // 施工组织计划 - 5 施工计划 - 7
        //||this.structid==5||this.structid==7
        this.shigongzuzhishow = true
      } else {
        this.shigongzuzhishow = false
      }
      console.log('组别', this.projectGroupList)
      console.log('stuckid', this.structid)
      this.getcategory()
      this.gettype()
      this.getmodel()
      this.getpersonlist()
      this.getorganization()
    },
    closeDialogHandle() {
      this.clearData()
      this.dingshow = false
      // this.textareaindex = ''
      this.gettypearr = null
      this.leibieoptions = null
      this.building = null

      this.beizhuinput = ''
      this.fabu_people = []
      this.fileList = []
      this.zhongyaoxing = null
    },
    getcategory() {
      //类别
      this.leibieoptions = []
      console.log('flow_id', this.getcategory_flowid)
      const param = {
        method: 'get_questions_type',
        project_id: this.project_id,
        flow_id: this.getcategory_flowid,
      }
      this.$store
        .dispatch('SafeInspection', param)
        .then((data) => {
          console.log('要获取到的类别', data.data, typeof data.data)
          if (typeof data.data == 'object') {
            for (let i = 0; i < data.data.length; i++) {
              this.leibieoptions.push({ label: data.data[i], value: i })
            }
          }
          console.log('this.leibieoptions', this.leibieoptions)
        })
        .catch(() => {
          resolve()
        })
    },
    // handleChangegettypearr(index) {
    //   //更换类别
    //   console.log('index类别', index)
    //   this.getcategory_flowid = this.gettypearr[index].flowid
    //   this.fabufncflowid = this.gettypearr[index].flowid
    //   this.getcategory()
    // },
    getcategory() {
      //类别
      this.leibieoptions = []
      console.log('flow_id', this.getcategory_flowid)
      const param = {
        method: 'get_questions_type',
        project_id: this.project_id,
        flow_id: this.getcategory_flowid,
      }
      this.$store
        .dispatch('SafeInspection', param)
        .then((data) => {
          console.log('要获取到的类别', data.data, typeof data.data)
          if (typeof data.data == 'object') {
            for (let i = 0; i < data.data.length; i++) {
              this.leibieoptions.push({ label: data.data[i], value: i })
            }
          }
        })
        .catch(() => {
          resolve()
        })
    },
    getmodel() {
      //建筑模型
      const param = {
        method: 'project_items',
        project_id: this.project_id,
      }
      this.$store.dispatch('GetItemInfoListByItemIDs', param).then((data) => {
        console.log('建筑模型', data)
        var aaa = []
        this.buildingMap = new Map()
        //提出模型名字
        for (let i = 0; i < data.length; i++) {
          if (data[i].name != '') {
            aaa.push({ label: data[i].name, value: data[i].id })
            this.buildingMap.set(data[i].id, data[i])
          }
        }
        this.building = aaa
        console.log('建筑列表', this.building)
        console.log('this.buildingMap', this.buildingMap)
      })
    },
    buildingchange(index) {
      //更换建筑
      console.log('地点 - index', index)
      this.building_itemid = index[0]

      this.getdidian()
    },
    didianarrchange(index) {
      //更换地点
      this.bimopen = []
      console.log('地点index', index)
      this.bimitemid = index[1]
      console.log('aaaaaaaaaaa', this.bimitemid)
      console.log('didiandataarr123', this.didiandataarr)
      for (let i = 0; i < this.didiandataarr.length; i++) {
        if (index[1] == this.didiandataarr[i].id) {
          this.bimopen.push(
            this.didiandataarr[i].camera_info,
            this.didiandataarr[i].id,
            this.didiandataarr[i].name
          )
        }
      }
      console.log('bim-----', this.bimopen)
      console.log('this.didianarr123', this.didianarr)
      let address_id = `${this.building_itemid},${
        this.didianarr[index[0]].floor_name
      },${index[1]}`

      let address_value = `${this.buildingMap.get(this.building_itemid).name},${
        this.didianarr[index[0]].floor_name
      }楼,${this.bimopen[2]}`
      this.datalistfrom.address = {
        id: 'questions_address',
        lx: 'basic',
        lable: '地点',
        type: 'text',
        value: address_value,
        lat: '',
        lon: '',
        address: '',
        address_id: address_id,
        pvid: '',
      }
      console.log('this.datalistfrom.address', this.datalistfrom.address)
    },
    findbim() {
      console.log('this.bimopen', this.bimopen)
      if (this.bimopen.length === 0) {
        this.$message({
          message: '请先选择建筑，再选择地点',
          type: 'error',
        })
        return
      }
      const viewUrl = `/#/xcx/pvshow?projectid=${this.project_id}&pvid=${
        this.bimopen[1]
      }&token=${getToken()}`
      // console.log('viewUrl', viewUrl)
      window.open(viewUrl)
      // if (this.bimopen.length != 0) {
      //   this.iframeshow = !this.iframeshow
      //   this.iframeurl = viewUrl
      // }
    },
    // handleChangegetleixin(index) {
    //   console.log(
    //     'index获取到的类型',
    //     index,
    //     this.leibieoptions[index[0]].label
    //   )
    //   this.fabuquestions_type = this.leibieoptions[index[0]].label
    // },
    successupload(response, file, fileList) {
      //图片样式更改
      console.log('图片信息返回', response)
      // console.log("文件返回",response.filename)
      let typestr = file.raw.type.toString()
      let aaa = typestr.slice(0, 5)
      if (aaa === 'image') {
        this.datalistfrom.basic[0].value.push({
          localsrc: '',
          lx: 'image',
          src: response.filename,
        })
      } else {
        this.datalistfrom.basic[1].value.push({
          name: response.url,
          path: response.filename,
        })
      }
    },
    clickupload(e) {
      console.log('上传-------', e)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择8个文件，本次选择了 ${files.length} 个文件，共选择了 ${
          files.length + fileList.length
        } 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    gettype() {
      //类型
      return new Promise((resolve, reject) => {
        const param = {
          method: 'get_flow_list',
          project_id: this.project_id,
        }
        this.$store
          .dispatch('SafeInspection', param)
          .then((data) => {
            console.log('要获取到的类型', data.data)
            this.gettypearr = []
            for (let i = 0; i < data.data.length; i++) {
              if (data.data[i].flowId == 'PlanFlow01') {
                this.gettypearr.push({
                  label: '计划',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
              if (data.data[i].flowId == 'ProblemFindSolve01') {
                this.gettypearr.push({
                  label: '任务',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
              if (data.data[i].flowId == 'Meeting01') {
                this.gettypearr.push({
                  label: '会议',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
              if (data.data[i].flowId == 'Documents01') {
                this.gettypearr.push({
                  label: '资料',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
              if (data.data[i].flowId == 'Notice01') {
                this.gettypearr.push({
                  label: '通知',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
              if (data.data[i].flowId == 'SafetyInspection01') {
                this.gettypearr.push({
                  label: '安全',
                  value: i,
                  flowid: data.data[i].flowId,
                })
              }
            }
            console.log('getarr', this.gettypearr)
          })
          .catch(() => {
            resolve()
          })
      })
    },
    getdidian() {
      //地点     建筑---地点
      return new Promise((resolve, reject) => {
        const param = {
          method: 'GetViewPoints',
          item_id: this.building_itemid,
          project_id: this.project_id,
          type: 1,
        }
        this.$store
          .dispatch('GetViewPoints', param)
          .then((data) => {
            console.log('地点data', data)
            this.didiandataarr = data
            this.didianarr = []
            this.didian = []
            var aaa = []
            var newarr = []
            //提出楼层
            for (let i = 0; i < data.length; i++) {
              if (data[i].floor_name != '') {
                aaa.push(data[i].floor_name)
              }
            }
            for (let i = 0; i < aaa.length; i++) {
              if (newarr.indexOf(aaa[i]) == -1) {
                newarr.push(aaa[i])
              }
            }
            for (let j = 0; j < newarr.length; j++) {
              newarr.splice(j, 1, {
                label: '第' + newarr[j] + '层',
                value: j,
                floor_name: newarr[j],
                children: [],
              })
            }
            // 楼层提出结束
            for (let i = 0; i < data.length; i++) {
              if (data[i].floor_name != '') {
                for (let j = 0; j < newarr.length; j++) {
                  if (newarr[j].floor_name == data[i].floor_name) {
                    newarr[j].children.push({
                      label: data[i].name,
                      value: data[i].id,
                      itemid: '第' + data[i].floor_name + '层' + data[i].name,
                    })
                  }
                }
              }
            }
            this.didianarr = newarr
            console.log('地点数组', this.didianarr)
            // console.log("aaa",newarr)
          })
          .catch(() => {
            resolve()
          })
      })
    },
    addperson() {
      this.grouparr = []
      this.aaaa = []
      for (let i = 0; i < this.projectPersonList.length; i++) {
        this.grouparr.push([
          this.projectPersonList[i].group_name_level[0],
          this.projectPersonList[i].group_name_level[1],
        ]) //拿到全部人员
      }
      for (let j = 0; j < this.grouparr.length; j++) {
        // console.log("bianli---->",j,this.grouparr[j][0])
        if (this.aaaa.indexOf(this.grouparr[j][0]) == -1) {
          //去除重复数组
          this.aaaa.push(this.grouparr[j][0])
        }
      }
      for (let i = 0; i < this.grouparr.length; i++) {
        for (let j = 0; j < this.aaaa.length; j++) {
          if (this.aaaa[j] == this.grouparr[i][0]) {
            this.aaaa.splice(j, 1, {
              label: this.aaaa[j],
              value: j,
              children: [{ label: this.grouparr[i][1], value: '1' }],
            })
          }
        }
      }
      console.log('人员信息', this.projectPersonList)
      this.aaaa.forEach((item) => {
        item.children[0]['children'] = []
      })
      for (let i = 0; i < this.projectPersonList.length; i++) {
        for (let j = 0; j < this.aaaa.length; j++) {
          if (
            this.projectPersonList[i].group_name_level[1] ==
            this.aaaa[j].children[0].label
          ) {
            this.aaaa[j].children[0].children.push({
              label: this.projectPersonList[i].name,
              value: this.projectPersonList[i].person_id,
              personname: this.projectPersonList[i].name,
            })
          }
        }
      }
      this.grouparr = this.aaaa
      this.dingshow = true
      console.log('this.aaaa', this.aaaa)
      console.log('gettypearr', this.grouparr)
    },
    plantaskSubmit() {
      this.$refs.planTaskForm.validate((valid) => {
        console.log('plantaskSubmit', valid)
        if (valid) {
          //发布任务
          this.loading = true
          // console.log('父id', this.fatherid, this.oneparentid)
          // let firstdaytime = moment(this.plantime[0]).format('YYYY-MM-DD')
          // let endtime = moment(this.plantime[1]).format('YYYY-MM-DD')
          let namebox = ''
          for (let i = 0; i < this.fabu_people.length; i++) {
            namebox = namebox + '@' + this.fabu_people[i].name + ','
          }
          console.log('nameboxnamebox', namebox)
          this.datalistfrom.title = namebox + this.planTaskForm.taskContent
          this.datalistfrom.receiver = this.fabu_people
          const _param = {
            method: 'plan_start_issue',
            project_id: this.project_id,
            questions_type: this.planTaskForm.questions_type, //this.fabuquestions_type,
            title: namebox + this.planTaskForm.taskContent,
            flow_id: 'PlanFlow01',
            priority: this.fabustartvalue,
            form: this.datalistfrom,
            subjectionId: '',
            nosend: 1,
            type: 6, //this.plantypevalue[0],
            content: this.planTaskForm.taskContent,
            start_date: this.planInfo.start_date,
            end_date: this.planInfo.end_date,
            parent_id: this.plan_id,
            struct_id: this.structid,
          }
          console.log('_param - plan_start_issue', _param)
          // this.loading = false
          this.$store.dispatch('Getplan', _param).then((data) => {
            console.log('任务发布成功', data) //work_id
            this.loading = false
            // return
            // for (let i = 0; i < this.numbox.length; i++) {
            //   if (this.planTaskForm.taskContent == this.numbox[i].name) {
            //     this.numbox[i].block = 'donot' //blockshow1 blockshow2
            //     this.numbox[i].blockshow1 = false
            //     this.numbox[i].blockshow2 = true
            //   }
            // }
            // console.log('numbox__donot', this.numbox)
            // this.planindexworkid = data.work_id
            // this.smalltaskfnc()
            this.$store
              .dispatch('SetPlanAddTaskSuccess', {})
              .then((result) => {})
            this.fabusuccessfnc()
          })
        }
      })
    },
    fabusuccessfnc() {
      this.$message({
        message: '实施任务发布成功！',
        type: 'success',
      })
      this.textarea = ''
      this.gettypearr = null
      this.leibieoptions = null
      this.building = null
      this.didianarr = []
      this.beizhuinput = ''
      this.fabu_people = []
      this.fileList = []
      this.zhongyaoxing = null
      this.plantypevalue = ''
      this.plantextarea = ''
      this.closeThisDialog()
    },
    closeThisDialog() {
      const param = {
        show: false,
      }
      this.$store
        .dispatch('ShowPlanTaskDialog', param)
        .then(() => {})
        .catch(() => {})
    },
    grouparrqueren() {
      this.dingshow = false
    },
    handleChange(value) {
      //选择指定人员
      // this.grouparr    projectPersonList
      console.log('选择人员', value)
      this.fabu_people = []
      for (let i = 0; i < value.length; i++) {
        this.fabu_people.push({ name: '', id: value[i][2] })
      }
      for (let i = 0; i < this.fabu_people.length; i++) {
        for (let j = 0; j < this.projectPersonList.length; j++) {
          if (this.fabu_people[i].id == this.projectPersonList[j].person_id) {
            this.fabu_people[i].name = this.projectPersonList[j].name
          }
        }
      }
      console.log('获取到的ID', this.fabu_people)
    },
    startchange(index) {
      //改变星级
      console.log('改变星级别', index)
      this.fabustartvalue = index
    },
    getpersonlist() {
      //人员列表信息接口
      const param = {
        method: 'query_person_list',
        project_id: this.project_id,
      }
      this.$store
        .dispatch('QueryProjectPersons', param)
        .then(() => {
          console.log('人员信息projectPersonList', this.projectPersonList)
        })
        .catch(() => {})
    },
    handleChangegetorganization(val) {
      console.log('组织计划val', val)
      this.structid = val[1]
    },
    changeplangettypearr() {},
    getorganization() {
      const param = {
        method: 'plan_struct',
        project_id: this.project_id,
      }
      this.$store.dispatch('Getplan', param).then((data) => {
        console.log('获取组织计划', data.data)
        data.data.forEach((item) => {
          item['label'] = item.text
          item['value'] = item.id
          if (item.children.length == 0) {
            delete item.children
          }
          if (item.children !== undefined) {
            item.children.forEach((obj) => {
              obj['label'] = obj.text
              obj['value'] = obj.id
              if (obj.children.length == 0) {
                delete obj.children
              }
            })
          }
        })
        this.organizationarr = data.data
        console.log('this.organizationarr', this.organizationarr)
      })
    },
    // smalltaskfnc() {
    //   //获取任务列表接口
    //   const _param = {
    //     method: 'get_todo_list',
    //     project_id: this.project_id,
    //     qtype: 'TodoList,BackLog,MatterRead',
    //   }
    //   this.$store.dispatch('GetAllInstList', _param).then((data) => {
    //     for (let i = 0; i < data.length; i++) {
    //       if (this.planindexworkid == data[i].workId) {
    //         console.log('提取到对应的任务', data[i])
    //         const param = {
    //           show: true,
    //           data: data[i],
    //         }
    //         this.$store
    //           .dispatch('SetInfoDialog', param)
    //           .then(() => {})
    //           .catch(() => {})
    //       }
    //     }
    //     console.log('我的任务', data)
    //   })
    // },
  },
}
</script>
