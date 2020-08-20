<template>
  <div>
    <el-dialog
      title="资料下载"
      :visible.sync="projectdialog"
      width="800px"
      :modal-append-to-body="false"
      @close="qkZwshow()"
    >
      <div style="font-size:20px;margin-bottom:10px">附件</div>
      <span>点击下载，下载模板资料</span>
      <div class="projectsmall" v-for="item in getFlowWorkData" :key="item.id">
        <div v-show="item.name !== undefined">
          <div>
            <i class="el-icon-tickets" style="margin-right: 15px"></i>
            {{item.name}}
            <a href="javascript:void(0)">
              <span
                style="float: right;color: #1bb1f4;margin-bottom:10px"
                @click="downZiliao(item.path)"
              >下载</span>
            </a>
          </div>
        </div>
      </div>
      <div v-if="this.zwShow == 1" class="zwShow">该资料暂未上传附件</div>
      <div style="font-size:20px;margin-bottom:10px">图片和视频</div>
      <span v-for="(item,index) in getFlowWorkImg" :key="index">
        <el-image
          v-if="item.lx == 'image'"
          style="width: 300px; height: 300px;margin-bottom:20px"
          :src="'https://xcx.tddata.net'+item.src"
          :preview-src-list="imgFdlist"
        ></el-image>
        <video v-if="item.lx == 'video'" controls>
          <source :src="'https://xcx.tddata.net'+item.video" type="video/mp4" />
        </video>
      </span>
      <div v-if="this.imgShow == 1" class="zwShow">该资料暂未上传图片和视频</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="projectdialog = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-row>
      <el-col :span="12">
        <el-select
          v-model="value1"
          placeholder="请选择资料类型"
          @change="optionschange"
          style="width: 120px;margin-top: 7px;margin-left:10px"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="12">
        <el-button
          type="primary"
          round
          style="margin:10px;float:right"
          @click="scButton"
          v-show="shangchuanshow"
        >上传资料</el-button>
      </el-col>
    </el-row>
    <div class="grid-content bg-purple">
      <el-tabs :tab-position="tabPosition" style="height: 100%;" @tab-click="tabpanechange">
        <div style="margin:10px 0;width:300px">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="querybtnfnc"></el-button>
          </el-input>
        </div>
        <!-- 标签页 -->
        <el-tab-pane v-for="item in labelbox" :key="item.id" :label="item.label">
          <!-- 二级tab选择 -->
          <el-radio-group v-model="secondtab" v-show="secondtabshow" style="margin-bottom: 30px;">
            <el-radio-button
              v-for="item in buttonbox"
              :key="item.id"
              :label="item.prof_name"
              @click.native="radioclickfnc(item)"
            >{{item.prof_name}}</el-radio-button>
          </el-radio-group>
          <!-- 国家资料展示 -->
          <el-table :data="tableData" style="width: 100%" v-show="tabledata1show">
            <el-table-column prop="fileid" label="序号" width="100"></el-table-column>
            <el-table-column prop="file_name" label="名称" width="500"></el-table-column>
            <el-table-column prop="serial_no" label="标准" width="200"></el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <el-button @click="downloadfnc(scope.row)" type="text" size="small">下载</el-button>
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
          >
            <el-table-column prop="projectid" label="序号" width="55"></el-table-column>
            <el-table-column prop="title" label="名称" width="500"></el-table-column>
            <el-table-column prop="state" label="状态" width="100"></el-table-column>
            <el-table-column prop="originator" label="上传人" width="100"></el-table-column>
            <el-table-column prop="lasttime" label="归档日期" width="180"></el-table-column>
            <el-table-column label="操作" width="120" :cell-style="{'text-align':'center'}">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="toviewtpproject(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <el-pagination
        background
        hide-on-single-page
        layout="prev, pager, next"
        :total="infonum"
        :current-page="currpage"
        :page-sizes="[1,2,3]"
        :page-size="sizenum"
        @current-change="pagechange"
        class="pagination"
      ></el-pagination>
      <!-- 上传弹窗 -->
      <el-dialog title="资料上传" :visible.sync="dialogFormVisible">
        <el-row style="margin:10px">
          <el-col :span="4">
            <div style="margin-top:10px">上传文件:</div>
          </el-col>
          <el-col :span="20">
            <el-upload
              class="upload-demo"
              drag
              action="https://xcx.tddata.net/upload"
              multiple
              ref="upload"
              :on-success="successUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传jpg,png,jepg,word,ppt,pdf</div>
            </el-upload>
          </el-col>
        </el-row>
        <el-row style="margin:10px">
          <el-col :span="4">
            <div style="margin-top:10px">资料名称:</div>
          </el-col>
          <el-col :span="20">
            <el-input
              type="textarea"
              v-model="textarea"
              placeholder="请输入内容"
              :autosize="{ minRows: 4, maxRows: 8}"
            ></el-input>
          </el-col>
        </el-row>
        <el-row style="margin:10px">
          <el-col :span="4">
            <div style="margin-top:10px">类型:</div>
          </el-col>
          <el-col :span="20">
            <el-cascader v-model="value2" :options="leibieoptions" style="float:left"></el-cascader>
          </el-col>
        </el-row>
        <el-row style="margin:10px"></el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="uploadZiliao">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog width="30%" title="资料下载" :visible.sync="innerVisible2" append-to-body>
        <div style="font-size:16px">点击下载，下载模板资料</div>
        <el-row>
          <el-col :span="22">
            <el-upload
              class="upload-demo"
              action="https://jsonplaceholder.typicode.com/posts/"
              :file-list="fileList"
            ></el-upload>
          </el-col>
          <el-col :span="2">
            <div style="margin-top:15px;margin-left:10px">
              <el-button type="text">下载</el-button>
            </div>
            <div>
              <el-button type="text" style="margin-left:10px">下载</el-button>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click="innerVisible2 = false">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  name: "index",
  data() {
    return {
      fileList: [
        {
          name: "安全教育登记卡.pdf",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
        {
          name: "安全注意事项.word",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100",
        },
      ],
      tabPosition: "left",
      options: [
        //头部选择器
        { label: "国家资料", value: 0 },
        { label: "项目部资料", value: 1 },
      ],
      leibieoptions: [],
      value1: 0, //头部选择器的值
      tableData: [],
      dialogFormVisible: false,
      innerVisible: false,
      innerVisible2: false,
      labelbox: [
        { label: "国家标准", id: 10 },
        { label: "行业标准", id: 11 },
        { label: "地方标准", id: 12 },
        { label: "企业标准", id: 13 },
        { label: "其他", id: 19 },
      ],
      buttonbox: [],
      tableid: 0,
      secondtab: "建筑施工",
      total: 0,
      infonum: 0,
      gettablelevel: 10, //一级标签切换默认值
      sizenum: 8, //每页多少个
      projectdatapage: 1,
      limitnum: 0,
      currpage: 1,
      projectdialog: false,
      positonname: "国家资料",
      input: "",
      secondtabshow: true,
      shangchuanshow: false,
      tabledata1show: true,
      tabledata2show: false,
      projecttabledata: [],
      textarea: "",
      value2: "",
      value: "",
      dialogImageUrl: "",
      dialogVisible: "",
      editableTabsValue: "",
      questionid: "安全",
      workId: "",
      trackId: "",
      getFlowWorkData: [],
      getFlowWorkImg: [],
      imgFdlist: [],
      datalistfrom: {
        title: "",
        modify_count: 0,
        check_count: 0,
        basic: [
          {
            lx: "basic",
            id: "questions_photo",
            lable: "现场拍摄",
            type: "multi_attach",
            value: [],
          },
          {
            lx: "basic",
            id: "questions_photo",
            lable: "附件",
            type: "files",
            value: [],
          },
          {
            id: "questions_remark",
            lx: "basic",
            lable: "问题描述",
            type: "multi_text",
            value: "",
            voicelst: "",
          },
        ],
        time: "",
        address: "",
        receive: [],
        modify_check: [],
        receiver: "",
      },
      zwShow: 0,
      imgShow: 0,
    };
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id;
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      this.infonum = 0;
      console.log("curVal111111111", curVal, oldVal);
      if (this.positonname == "国家资料") {
        this.getdata();
      } else {
        this.getprojectdata();
      }
    },
  },
  mounted() {
    console.log(window.innerHeight);
    if (window.innerHeight > 1200) {
      this.sizenum = 16;
    }
    if (this.project_id !== null) {
      console.log("这里可以执行了啊..........", this.project_id);
      this.getdata();
    }
  },
  methods: {
    scButton() {
      this.dialogFormVisible = true;
      this.clearFiles();
      this.getcategory();
    },

    //资料上传成功
    successUpload(res) {
      console.log("资料返回值", res);
      this.datalistfrom.basic[1].value.push({
        name: res.url,
        path: res.filename,
      });
      console.log("cs资料返回值", this.datalistfrom);
    },

    clearFiles() {
      this.$refs.upload.clearFiles();
    },

    //上传资料
    uploadZiliao() {
      this.datalistfrom.title = this.textarea;
      const _param = {
        method: "start_issue",
        project_id: this.project_id,
        questions_type: this.value2.toString(),
        title: this.textarea,
        flow_id: "Documents01",
        form: this.datalistfrom,
        subjectionId: "",
      };
      this.$store.dispatch("GetAllInstList", _param).then((data) => {
        console.log("任务发布成功", data);
        this.fabusuccessfnc();
      });
    },

    //获取类别
    getcategory() {
      this.leibieoptions = [];
      console.log("flow_id", this.getcategory_flowid);
      const param = {
        method: "get_questions_type",
        project_id: this.project_id,
        flow_id: this.getcategory_flowid,
      };
      this.$store.dispatch("SafeInspection", param).then((data) => {
        console.log("要获取到的类别", data.data, typeof data.data);
        if (typeof data.data == "object") {
          for (let i = 0; i < data.data.length; i++) {
            this.leibieoptions.push({
              label: data.data[i],
              value: data.data[i],
            });
          }
        }
        console.log("获取到的类别", this.leibieoptions);
      });
    },

    fabusuccessfnc() {
      this.$alert("发布成功,资料审核后将保存至资料管理>项目部资料", "", {
        confirmButtonText: "确定",
        callback: (action) => {
          this.dialogFormVisible = false;
          this.textarea = "";
          (this.value2 = ""),
            (this.datalistfrom = {
              title: "",
              modify_count: 0,
              check_count: 0,
              basic: [
                {
                  lx: "basic",
                  id: "questions_photo",
                  lable: "现场拍摄",
                  type: "multi_attach",
                  value: [],
                },
                {
                  lx: "basic",
                  id: "questions_photo",
                  lable: "附件",
                  type: "files",
                  value: [],
                },
                {
                  id: "questions_remark",
                  lx: "basic",
                  lable: "问题描述",
                  type: "multi_text",
                  value: "",
                  voicelst: "",
                },
              ],
              time: "",
              address: "",
              receive: [],
              modify_check: [],
              receiver: "",
            });
        },
      });
    },

    //下载资料
    downZiliao(i) {
      window.open("https://xcx.tddata.net/" + i + "?t=download");
    },
    tabpanechange(index) {
      //一级标题改变
      console.log("一级标题改变", index.label);
      // 国家资料功能
      this.tableData = [];
      this.currpage = 1;
      this.secondtab = this.buttonbox[0].prof_name;
      this.tableid = this.buttonbox[0].id;
      for (let i = 0; i < this.labelbox.length; i++) {
        if (this.labelbox[i].label == index.label) {
          this.gettablelevel = this.labelbox[i].id;
          this.gettable();
        }
      }
      // 项目部资料
      if (this.positonname == "项目部资料") {
        console.log("这是什么", index.label);
        for (let i = 0; i < this.labelbox.length; i++) {
          if (this.labelbox[i].label == index.label) {
            this.questionid = this.labelbox[i].label;
            this.getprojectdata();
          }
        }
      }
    },
    //搜索
    querybtnfnc() {
      console.log("是什么资料", this.positonname);
      if (this.positonname == "项目部资料") {
        this.getprojectdata();
      }
      if (this.positonname == "国家资料") {
        this.getdata();
      }
    },
    optionschange(index) {
      //项目部资料
      if (index == 1) {
        this.getcategory();
        console.log(this.leibieoptions);
        this.labelbox = this.leibieoptions;
        this.positonname = "项目部资料";
        this.secondtabshow = false;
        this.shangchuanshow = true;
        this.tableData = [];
        this.infonum = 0;
        this.tabledata1show = false;
        this.tabledata2show = true;
        console.log("项目资料", this.labelbox);
        this.getprojectdata();
      } else {
        this.positonname = "国家资料";
        this.secondtabshow = true;
        this.shangchuanshow = false;
        this.tabledata1show = true;
        this.tabledata2show = false;
        this.labelbox = [
          { label: "国家标准", id: 10, btnbox: this.buttonbox },
          { label: "行业标准", id: 11, btnbox: this.buttonbox },
          { label: "地方标准", id: 12, btnbox: this.buttonbox },
          { label: "企业标准", id: 13, btnbox: this.buttonbox },
          { label: "其他", id: 19, btnbox: this.buttonbox },
        ];
        this.getdata();
      }
    },
    //下载
    downloadfnc(index) {
      window.open("https://xcx.tddata.net/" + index.file_url + "?t=download");
    },
    pagechange(e) {
      //每页多少条数据
      console.log("eeeeeeeee", this.currpage);
      if (this.positonname == "国家资料") {
        this.currpage = e;
        this.limitnum = (e - 1) * this.sizenum;
        this.gettable();
      }
      if (this.positonname == "项目部资料") {
        this.projectdatapage = e;
        this.getprojectdata();
      }
    },

    //二级tab点击事件
    radioclickfnc(index) {
      this.secondtab = index.prof_name;
      this.tableid = index.id;
      this.gettable();
    },

    //获取国家资料表格
    gettable() {
      this.infonum = 0;
      const param = {
        method: "query_doc_standard",
        project_id: this.project_id,
        standard_level: this.gettablelevel, //一级标题
        standard_name: this.input, //搜索框
        limit: this.limitnum,
        size: this.sizenum,
        standard_prof: this.tableid, //按钮
      };
      this.$store.dispatch("Datamanagement", param).then((data) => {
        console.log("表格", data);
        this.total = data.total;
        this.tableData = data.data;
        this.infonum = data.total;
        this.tableData.forEach((item) => {
          item["fileid"] = this.limitnum + this.tableData.indexOf(item) + 1;
        });
        console.log("表格2", this.tableData);
      });
    },

    //从接口获取二级tab
    getdata() {
      const param = {
        method: "query_doc_standard_pro",
        project_id: this.project_id,
      };
      this.$store.dispatch("Datamanagement", param).then((data) => {
        this.labelbox.forEach((item) => {
          item["btnbox"] = data.data;
        });
        console.log("资料数据", data);
        this.buttonbox = data.data;
        this.tableid = this.buttonbox[0].id;
        this.gettable(this.tableid);
      });
    },

    //项目部资料
    getprojectdata() {
      console.log("--------", this.questionid);
      const param = {
        method: "query_task_all_list",
        project_id: this.project_id,
        flow_id: "Documents01",
        qtype: "hasDone",
        page: this.projectdatapage,
        keyword: this.input,
        questions_type: this.questionid,
        limit: this.sizenum,
      };
      this.$store.dispatch("Allpersondata", param).then((data) => {
        this.infonum = data.count;
        this.thirdinterface();
        this.projecttabledata = data.data;
        this.postdata = [];
        this.projecttabledata.forEach((item) => {
          item["projectid"] =
            (this.projectdatapage - 1) * 8 +
            this.projecttabledata.indexOf(item) +
            1;
          this.postdata.push(item.workId);
          item.imgurl =
            "https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=" +
            item.workId +
            "&w=220";
        });
        console.log("项目部数据", this.projecttabledata);
        this.getlistinfo();
      });
    },

    thirdinterface() {
      const _param = {
        method: "cfg_nodes",
        project_id: this.project_id,
      };
      this.$store.dispatch("Allinfodictionary", _param).then((data) => {
        this.thirdinfo = data;
        console.log("第三接口", this.thirdinfo);
      });
    },

    //打开下载项目部资料弹窗
    toviewtpproject(index) {
      console.log(index.workId);
      this.projectdialog = true;
      this.workId = index.workId;
      this.trackId = index.trackId;
      this.getFlowWork();
    },

    //获取资料详情页面
    getFlowWork() {
      const _param = {
        method: "get_flow_work",
        project_id: this.project_id,
        work_id: this.workId,
        track_id: this.trackId,
      };
      this.$store.dispatch("Allpersondata", _param).then((data) => {
        this.getFlowWorkData = [];
        this.getFlowWorkImg = [];
        data.data.form.basic.forEach((val) => {
          if (val.type == "files") {
            this.getFlowWorkData = val.value;
          }
          if (val.type == "multi_attach") {
            this.getFlowWorkImg = val.value;
          }
        });
        this.getFlowWorkImg.forEach((val) => {
          this.imgFdlist.push("https://xcx.tddata.net" + val.src);
        });
        console.log("图片列表", this.getFlowWorkImg);
        console.log("图片预览", this.imgFdlist);
        console.log("附件列表", this.getFlowWorkData);
        if (this.getFlowWorkData[0] == undefined) {
          this.zwShow = 1;
        }
        if (this.getFlowWorkImg[0] == undefined) {
          this.imgShow = 1;
        }
      });
    },
    //情况资料详情状态
    qkZwshow() {
      this.zwShow = 0;
      this.imgShow = 0;
    },
    getlistinfo() {
      const _param = {
        method: "get_nodes_users_list",
        project_id: this.project_id,
        work_ids: this.postdata,
      };
      this.$store.dispatch("Allpersondata", _param).then((data) => {
        // console.log("第二接口返回成功",data.data)
        this.listbox = data.data;
        let mar1 = [];
        let map1 = new Map();
        for (var i in this.listbox) {
          map1.set(i, this.listbox[i]); //添加key值
        }
        // console.log(map1)
        let box = [];
        this.projecttabledata.forEach((item) => {
          let workId = item.workId;
          item["obj"] = map1.get(workId); //把接口2获取到的文档配置到数据中
          item["state"] = "1"; //任务状态
          item["xian"] = false; //负责人显示
          item["xian2"] = false; //质检人显示
          item["xian3"] = false; //第二类人物类型
          item["imgurl"] =
            "https://buskey.cn/api/oa/workflow/thumbnail.jpg?work_id=" +
            item.workId +
            "&w=220";
          item["getinfo"] = map1.get(workId).info.flowNode[0]; //获取到显示任务类型的配置数据
          item["originator"] = map1.get(workId).Start[0].userName; //获取懂啊key值对应的数据   info.priority
          if (item.questions_type != "") {
            item["xian3"] = true;
          }
          if (map1.get(workId).info != undefined) {
            item["value"] = map1.get(workId).info.priority; //任务星级
          }
          if (item.obj.Node2 != undefined) {
            item["person_id1"] = item.obj.Node1[0].userId; //发起人ID
          }
          if (item.flowId != null) {
            item["flowId2"] = item.flowId.slice(0, item.flowId.length - 2); //截取字符，判断任务类型，和接口文档匹配
          }
          if (item.obj.info.comment_count == 0) {
            item["imgboxyuanshow"] = false;
          }
          if (item.obj.info.comment_count != 0) {
            item["imgboxyuanshow"] = true;
          }
          if (item.obj.Node2 != undefined) {
            item["firstname"] = item.obj.Start[0].userName;
            item["header"] = item.obj.Node2[0].userName; //负责人
            item["person_id2"] = item.obj.Node2[0].userId; //负责人ID
            item.xian = true;
          } else {
            item.xian = false;
          }
          if (item.obj.Node5 != undefined) {
            item["qualiter"] = item.obj.Node5[0].userName; //质检人
            item["person_id3"] = item.obj.Node5[0].userId; //负责人ID
            item.xian2 = true;
          } else {
            item.xian2 = false;
          }
          //和第三接口配置文档进行匹配
          if (this.thirdinfo[item.flowId2] != "") {
            let _config = this.thirdinfo[item.flowId2];
            let _node = _config[item.getinfo];
            if (_node !== undefined) {
              item.state = _node.status;
              item["statecolor"] = _node.color;
            } else {
              // item.state = item.getinfo
              item.state = "已完成";
            }
          }
          box.push(item);
        });
        this.projecttabledata = box;
        console.log("最终信息", this.projecttabledata);
      });
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import "./mixin";
.pagination {
  @include cl;
  margin-top: 10px;
  margin-bottom: 10px;
}
.projectsmall {
  margin-top: 10px;
  font-size: 18px;
  margin-right: 10px;
  margin-bottom: 20px;
}
.zwShow {
  @include cl;
  font-size: 18px;
}
</style>