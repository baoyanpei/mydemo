<template>
    <div style="">
      <el-row>
        <el-col :span="24">
          <!--头部开始-->
          <div class="top">
            <el-select v-model="value1" placeholder="请选择" style="width: 120px;margin-top: 7px;">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" round style="float: right;margin-top: 7px;background-color: #409EFF;">上传资料</el-button>
          </div>
          <!--标签页-->
          <el-tabs :tab-position="tabPosition" style="height: 200px;">
            <el-tab-pane label="国家标准">
              <!--内容主体-->
              <!--搜索框-->
              <div style="margin-top: 15px;width: 320px;">
                <el-input placeholder="请输入内容" v-model="input3" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search"></el-button>
                </el-input>
              </div>
              <!--二级小tab-->
              <el-radio-group v-model="secondtab" style="margin-bottom: 30px;margin-top: 20px">
                <el-radio-button label="建筑施工">建筑施工</el-radio-button>
                <el-radio-button label="建筑设计">建筑设计</el-radio-button>
                <el-radio-button label="建筑结构">建筑结构</el-radio-button>
                <el-radio-button label="城建市政">城建市政</el-radio-button>
                <el-radio-button label="交通路桥">交通路桥</el-radio-button>
              </el-radio-group>
            </el-tab-pane>
            <el-tab-pane label="行业便准">配置管理</el-tab-pane>
          </el-tabs>
          <!--表格-->
          <div class="tabeldiv">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" :header-cell-style="headClass" style="width: 100%;border-collapse:collapse;" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column label="日期" width="120">
                <template slot-scope="scope">{{ scope.row.date }}</template>
              </el-table-column>
              <el-table-column prop="name" label="姓名" width="120"></el-table-column>
              <el-table-column prop="address" label="地址" width="200"></el-table-column>
            </el-table>
          </div>
            <!--表格结束-->
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import Vue from 'vue';
  import { DropdownMenu, DropdownItem } from 'vant';

  Vue.use(DropdownMenu);
  Vue.use(DropdownItem);
   // import dataindex from '../../components/publicdatamanagement/index'
  export default {
    name: 'index',
    components:{
      // dataindex
    },
    data(){
      return{
        options: [//头部选择器
          { label: '国家资料', value: 0 },
          { label: '项目部资料', value: 1 },
        ],
        value1:0,//头部选择器的值
        tabPosition: 'left',//tab靠左
        input3:"",//搜索框
        secondtab:"建筑施工",//二级tab栏目
        tableData: [{//表格
          date: '2016-05-03',
          name: '王小虎',
          address: '长江1号'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '长江2号'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '长江3号'
        }],
      }
    },
    methods:{
      handleSelectionChange(val) {
        console.log("handleSelectionChange_val",val)
      },
      headClass() {
        return 'text-align: center;'
      },
    }
  }
</script>

<style scoped>
  .top{
    width: 100%;
    height: 50px;
    padding: 0 30px;
  }
  .tabeldiv{
    padding-left: 100px;
    margin-top: -60px;
  }
</style>
