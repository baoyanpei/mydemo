<template>
  <div style="padding-top: 20px">
    <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
        <div class="top">
          <div class="block">
            <span class="demonstration">请选择查询日期:</span>
            <el-date-picker
              v-model="value"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </div>
        </div>
        <div class="neirong">
          <el-table :data="dataList" style="width: 100%" max-height="800">
            <el-table-column fixed prop="name" label="名称" width="600"></el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button @click="deleteRow(scope.$index, dataList)" type="text" size="small">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import TJFXMenu from "../layout/components/XUGLMenu.vue";
import { async } from "q";
export default {
  components: {
    TJFXMenu,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      value: "",
      dataList: [],
    };
  },
  computed: {
    project_id() {
      return this.$store.state.project.project_id;
    },
  },
  watch: {
    project_id(curVal, oldVal) {
      console.log("curVal", curVal, oldVal);
      this.getform();
    },
    value() {
      this.getform();
    },
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    const test = [];
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
    console.log("当前时间", start, end);
    test.push(start);
    test.push(end);
    console.log("获取当前时间", test);
    if (this.project_id !== null) {
      console.log("you");
      this.value = test;
      this.getform();
    }
  },
  methods: {
    seach() {
      this.getform();
    },
    deleteRow(index, dataList) {
      window.open(dataList[index].url);
    },
    getform() {
      const param = {
        method: "worklog_query_days",
        project_id: this.project_id,
        // page: this.currpage,
        keywords: this.input,
        bt: this.value[0],
        et: this.value[1],
      };
      this.$store
        .dispatch("Getplan", param)
        .then((data) => {
          this.dataList = [];
          var e = data.data;
          for (let index in e) {
            this.dataList.push({
              name: index + "施工日志",
              url: "http://admin.yidebim.com" + e[index].url + "?t=download",
            });
          }
          console.log("获得数据日志打印", this.dataList);
        })
        .catch(() => {});
    },
  },
};
</script>