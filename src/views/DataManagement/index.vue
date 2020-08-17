<template>
  <div style>
    <el-row>
      <el-col :span="24">
        <!--头部开始-->
        <div class="top">
          <el-select
            v-model="value1"
            placeholder="请选择"
            @change="optionschange"
            style="width: 120px;margin-top: 7px;"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button
            type="primary"
            @click="uploadfnc"
            round
            style="float: right;margin-top: 7px;background-color: #409EFF;"
          >上传资料</el-button>
        </div>
        <el-dialog
          title="上传资料"
          :visible.sync="dialogVisible"
          width="670px"
          :modal-append-to-body="false"
        >
          <div class="uploadbox">
            <div
              class="uploadbox_left"
              style="width: 100px;float: left;line-height: 30px;text-align: center"
            >
              <span>上传文件:</span>
            </div>
            <el-upload action="#" list-type="picture-card" :auto-upload="false">
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleDownload(file)"
                  >
                    <i class="el-icon-download"></i>
                  </span>
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-dialog
              title="上传图片预览"
              :visible.sync="photodialogVisible"
              :modal-append-to-body="false"
            >
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </div>
          <div class="uploadbox">
            <div
              class="uploadbox_left"
              style="width: 100px;float: left;line-height: 30px;text-align: center"
            >
              <span>资料名称:</span>
            </div>
            <el-input v-model="datainput" placeholder="请输入内容" style="width: 400px;float: left"></el-input>
          </div>
          <br />
          <br />
          <br />
          <div class="uploadbox">
            <div
              class="uploadbox_left"
              style="width: 100px;float: left;line-height: 30px;text-align: center"
            >
              <span>类型:</span>
            </div>
            <el-cascader
              v-model="datavalue"
              :options="dataoptions"
              @change="dataoptionshandleChange"
            ></el-cascader>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span>
        </el-dialog>
        <!--标签页-->
        <el-tabs :tab-position="tabPosition" style="min-height: 200px" @tab-click="tabpanechange">
          <el-tab-pane v-for="obj in this.labelbox" :label="obj.label" :key="obj.id">
            <!--内容主体-->
            <!--搜索框-->
            <div style="margin-top: 15px;width: 320px;">
              <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                <el-button slot="append" @click="querybtnfnc" icon="el-icon-search"></el-button>
              </el-input>
            </div>
            <!--二级小tab-->
            <el-radio-group
              v-model="secondtab"
              v-show="secondtabshow"
              style="margin-bottom: 30px;margin-top: 20px"
            >
              <el-radio-button
                v-for="item in obj.btnbox"
                @click.native.prevent="radioclickfnc(item)"
                :label="item.prof_name"
                :key="item.id"
              >{{item.prof_name}}</el-radio-button>
            </el-radio-group>
            <!--表格-->
            <div class="tabeldiv">
              <!--国家标准表格   :cell-style="{'text-align':'center'}"-->
              <el-table
                ref="singleTable"
                v-show="tabledata1show"
                :data="tableData"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column
                  prop="fileid"
                  label="序号"
                  width="55"
                  :cell-style="{'text-align':'center'}"
                ></el-table-column>
                <el-table-column prop="file_name" label="资料名称" width="400"></el-table-column>
                <el-table-column label="操作" width="120" :cell-style="{'text-align':'center'}">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toviewtp(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="downloadfnc(scope.row)">下载</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <!--项目部资料表格-->
              <el-table
                ref="singleTable"
                v-show="tabledata2show"
                :data="projecttabledata"
                :header-cell-style="{'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="projectid" label="序号" width="55"></el-table-column>
                <el-table-column prop="title" label="名称" width="250"></el-table-column>
                <el-table-column prop="state" label="状态" width="100"></el-table-column>
                <el-table-column prop="originator" label="上传人" width="100"></el-table-column>
                <el-table-column prop="lasttime" label="归档日期" width="180"></el-table-column>
                <el-table-column label="操作" width="120" :cell-style="{'text-align':'center'}">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="toviewtpproject(scope.row)">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-dialog
                title="资料下载"
                :visible.sync="projectdialog"
                width="500px"
                :modal-append-to-body="false"
              >
                <span>点击下载，下载模板资料</span>
                <div class="projectsmall">
                  <span style="float: left">
                    <i class="el-icon-tickets" style="margin-right: 15px"></i>这是一个文件
                  </span>
                  <a href="javascript:void(0)">
                    <span style="float: right;color: #1bb1f4">下载</span>
                  </a>
                </div>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="projectdialog = false">确 定</el-button>
                </span>
              </el-dialog>
              <!--分页符-->
              <el-pagination
                background
                layout="prev, pager, next,total,jumper"
                :current-page="currpage"
                :total="infonum"
                :page-sizes="[1,2,3]"
                :page-size="pagesize"
                @current-change="pagechange"
                @size-change="handleSizeChange"
              ></el-pagination>
            </div>
            <!--表格结束-->
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
//Datamanagement 资料接口
import Vue from 'vue'
import { DropdownMenu, DropdownItem } from 'vant'

Vue.use(DropdownMenu)
Vue.use(DropdownItem)
// import dataindex from '../../components/publicdatamanagement/index'
export default {
  name: 'index',
  components: {
    // dataindex
  },
  data() {
    return {
      options: [
        //头部选择器
        { label: '国家资料', value: 0 },
        { label: '项目部资料', value: 1 },
      ],
      labelbox: [
        { label: '国家标准', id: 10 },
        { label: '行业标准', id: 11 },
        { label: '地方标准', id: 12 },
        { label: '企业标准', id: 13 },
        { label: '其他', id: 19 },
      ],
      gettablelevel: 10,
      positonname: '国家资料',
      value1: 0, //头部选择器的值
      datainput: '', //上传资料输入框
      dataoptions: [], //上传资料联级选择器
      datavalue: '', //资料值
      dialogVisible: false, //dialog状态
      tabPosition: 'left', //tab靠左
      input3: '', //搜索框
      secondtab: '建筑施工', //二级tab栏目
      secondtabshow: true, //
      buttonbox: [], //二级tab栏目盒子
      tabledata1show: true, //国家标准表格
      tabledata2show: false, //项目部资料表格
      questionid: '安全',
      tableData: [],
      projecttabledata: [],
      dialogImageUrl: '',
      photodialogVisible: false,
      disabled: false,
      tableid: 0,
      total: 0, //表格总数据
      currpage: 1,
      pagesize: 20,
      infonum: 0,
      limitnum: 0,
      sizenum: 20,
      postdata: [],
      listbox: [],
      thirdinfo: [], //第三接口配置信息
      projectdatapage: 1,
      projectdialog: false, //资料下载dialog
      datalistfrom: {
        //资料上传
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
    }
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log('curVal111111111', curVal, oldVal)
      this.getdata()
    },
  },
  mounted() {
    if (this.project_id !== null) {
      console.log('这里可以执行了啊..........', this.project_id)
      this.getdata()
    }
  },
  methods: {
    optionschange(index) {
      //项目部资料
      if (index == 1) {
        this.positonname = '项目部资料'
        this.secondtabshow = false
        this.tableData = []
        this.infonum = 0
        this.tabledata1show = false
        this.tabledata2show = true
        this.labelbox = [
          { label: '安全', id: '1', btnbox: this.buttonbox },
          { label: '质量', id: '2', btnbox: this.buttonbox },
          { label: '技术', id: '3', btnbox: this.buttonbox },
          { label: '施工', id: '4', btnbox: this.buttonbox },
          { label: '资料', id: '5', btnbox: this.buttonbox },
          { label: '财务', id: '6', btnbox: this.buttonbox },
          { label: '物资', id: '7', btnbox: this.buttonbox },
          { label: '劳务', id: '8', btnbox: this.buttonbox },
          { label: '法务预算', id: '9', btnbox: this.buttonbox },
          { label: '综合', id: '10', btnbox: this.buttonbox },
          { label: '平台技术', id: '11', btnbox: this.buttonbox },
        ]
        this.getprojectdata()
      } else {
        this.positonname = '国家资料'
        this.secondtabshow = true
        this.tabledata1show = true
        this.tabledata2show = false
        this.labelbox = [
          { label: '国家标准', id: 10, btnbox: this.buttonbox },
          { label: '行业标准', id: 11, btnbox: this.buttonbox },
          { label: '地方标准', id: 12, btnbox: this.buttonbox },
          { label: '企业标准', id: 13, btnbox: this.buttonbox },
          { label: '其他', id: 19, btnbox: this.buttonbox },
        ]
        this.getdata()
      }
    },
    getprojectdata() {
      //项目部资料
      console.log('--------', this.questionid)
      const param = {
        method: 'query_task_all_list',
        project_id: this.project_id,
        flow_id: 'Documents01',
        qtype: 'hasDone',
        page: this.projectdatapage,
        keyword: this.input3,
        questions_type: this.questionid,
      }
      this.$store.dispatch('Allpersondata', param).then((data) => {
        console.log('项目部数据', data)
        this.infonum = data.count
        this.thirdinterface()
        this.projecttabledata = data.data
        this.postdata = []
        this.projecttabledata.forEach((item) => {
          item['projectid'] =
            (this.projectdatapage - 1) * 20 +
            this.projecttabledata.indexOf(item) +
            1
          this.postdata.push(item.workId)
          item.imgurl =
            'https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=' +
            item.workId +
            '&w=220'
        })
        this.getlistinfo()
      })
    },
    getlistinfo() {
      const _param = {
        method: 'get_nodes_users_list',
        project_id: this.project_id,
        work_ids: this.postdata,
      }
      this.$store.dispatch('Allpersondata', _param).then((data) => {
        // console.log("第二接口返回成功",data.data)
        this.listbox = data.data
        let mar1 = []
        let map1 = new Map()
        for (var i in this.listbox) {
          map1.set(i, this.listbox[i]) //添加key值
        }
        // console.log(map1)
        let box = []
        this.projecttabledata.forEach((item) => {
          let workId = item.workId
          item['obj'] = map1.get(workId) //把接口2获取到的文档配置到数据中
          item['state'] = '1' //任务状态
          item['xian'] = false //负责人显示
          item['xian2'] = false //质检人显示
          item['xian3'] = false //第二类人物类型
          item['imgurl'] =
            'https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=' +
            item.workId +
            '&w=220'
          item['getinfo'] = map1.get(workId).info.flowNode[0] //获取到显示任务类型的配置数据
          item['originator'] = map1.get(workId).Start[0].userName //获取懂啊key值对应的数据   info.priority
          if (item.questions_type != '') {
            item['xian3'] = true
          }
          if (map1.get(workId).info != undefined) {
            item['value'] = map1.get(workId).info.priority //任务星级
          }
          if (item.obj.Node2 != undefined) {
            item['person_id1'] = item.obj.Node1[0].userId //发起人ID
          }
          if (item.flowId != null) {
            item['flowId2'] = item.flowId.slice(0, item.flowId.length - 2) //截取字符，判断任务类型，和接口文档匹配
          }
          if (item.obj.info.comment_count == 0) {
            item['imgboxyuanshow'] = false
          }
          if (item.obj.info.comment_count != 0) {
            item['imgboxyuanshow'] = true
          }
          if (item.obj.Node2 != undefined) {
            item['firstname'] = item.obj.Start[0].userName
            item['header'] = item.obj.Node2[0].userName //负责人
            item['person_id2'] = item.obj.Node2[0].userId //负责人ID
            item.xian = true
          } else {
            item.xian = false
          }
          if (item.obj.Node5 != undefined) {
            item['qualiter'] = item.obj.Node5[0].userName //质检人
            item['person_id3'] = item.obj.Node5[0].userId //负责人ID
            item.xian2 = true
          } else {
            item.xian2 = false
          }
          //和第三接口配置文档进行匹配
          if (this.thirdinfo[item.flowId2] != '') {
            let _config = this.thirdinfo[item.flowId2]
            let _node = _config[item.getinfo]
            if (_node !== undefined) {
              item.state = _node.status
              item['statecolor'] = _node.color
            } else {
              // item.state = item.getinfo
              item.state = '已完成'
            }
          }
          box.push(item)
        })
        this.projecttabledata = box
        console.log('最终信息', this.projecttabledata)
      })
    },
    thirdinterface() {
      const _param = {
        method: 'cfg_nodes',
        project_id: this.project_id,
      }
      this.$store.dispatch('Allinfodictionary', _param).then((data) => {
        this.thirdinfo = data
        console.log('第三接口', this.thirdinfo)
      })
    },
    getdata() {
      //二级tab获取
      const param = {
        method: 'query_doc_standard_pro',
        project_id: this.project_id,
      }
      this.$store.dispatch('Datamanagement', param).then((data) => {
        this.labelbox.forEach((item) => {
          item['btnbox'] = data.data
        })
        console.log('资料数据', data)
        this.buttonbox = data.data
        this.tableid = this.buttonbox[0].id
        this.gettable(this.tableid)
      })
    },
    tabpanechange(index) {
      //一级标题改变
      console.log('一级标题改变', index.label)
      // 国家资料功能
      this.tableData = []
      this.currpage = 1
      this.secondtab = this.buttonbox[0].prof_name
      this.tableid = this.buttonbox[0].id
      for (let i = 0; i < this.labelbox.length; i++) {
        if (this.labelbox[i].label == index.label) {
          this.gettablelevel = this.labelbox[i].id
          this.gettable()
        }
      }
      // 项目部资料
      if (this.positonname == '项目部资料') {
        console.log('这是什么', index.label)
        for (let i = 0; i < this.labelbox.length; i++) {
          if (this.labelbox[i].label == index.label) {
            this.questionid = this.labelbox[i].label
            this.getprojectdata()
          }
        }
      }
    },
    radioclickfnc(index) {
      //二级tab点击事件
      this.currpage = 1
      this.secondtab = index.prof_name
      this.tableid = index.id
      this.gettable()
    },
    gettable() {
      const param = {
        method: 'query_doc_standard',
        project_id: this.project_id,
        standard_level: this.gettablelevel, //一级标题
        standard_name: this.input3, //搜索框
        limit: this.limitnum,
        size: this.sizenum,
        standard_prof: this.tableid, //按钮
      }
      this.$store.dispatch('Datamanagement', param).then((data) => {
        console.log('表格', data)
        this.total = data.total
        this.tableData = data.data
        this.infonum = data.total
        this.tableData.forEach((item) => {
          item['fileid'] = this.limitnum + this.tableData.indexOf(item) + 1
        })
      })
    },
    querybtnfnc() {
      console.log('是什么资料', this.positonname)
      if (this.positonname == '项目部资料') {
        this.getprojectdata()
      }
      if (this.positonname == '国家资料') {
        this.getdata()
      }
    },
    uploadfnc() {
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      console.log('handleSelectionChange_val', val)
    },
    headClass() {
      return 'text-align: center;'
    },
    dataoptionshandleChange() {
      //上传资料联级列表
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.photodialogVisible = true
    },
    handleDownload(file) {
      console.log(file)
    },
    pagechange(e) {
      //每页多少条数据
      console.log('eeeeeeeee', this.currpage)
      if (this.positonname == '国家资料') {
        this.currpage = e
        this.limitnum = (e - 1) * 20
        this.gettable()
      }
      if (this.positonname == '项目部资料') {
        this.projectdatapage = e
        this.getprojectdata()
      }
    },
    handleSizeChange() {},
    toviewtp(index) {
      console.log('index', index.file_url)
      window.open('https://xcx.tddata.net/' + index.file_url)
    },
    downloadfnc(index) {
      window.open('https://xcx.tddata.net/' + index.file_url + '?t=download')
    },
    toviewtpproject() {
      this.projectdialog = true
    },
  },
}
</script>

<style scoped>
.top {
  width: 100%;
  height: 50px;
  padding: 0 30px;
}
.tabeldiv {
  padding-left: 100px;
}
.uploadbox {
  width: 100%;
  margin-bottom: 15px;
}
.projectsmall {
  width: 100%;
  height: 40px;
  margin-top: 10px;
  line-height: 40px;
  font-size: 16px;
}
</style>
