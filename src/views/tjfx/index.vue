<style lang="scss">
  @import "./index";
</style>
<template>
  <div class="tjfx-container" style="margin: 0px;">
    <el-row :gutter="10">
      <el-col :span="4">
        <TJFXMenu></TJFXMenu>
      </el-col>
      <el-col :span="20">
        <div class="grid-content bg-purple-light">
          <el-form ref="worktimeForm" :model="worktimeForm" label-width="80px" :inline="true">
            <el-form-item prop="InoutDaterange" label="时间范围" :rules="ruleInoutDaterange">
              <el-date-picker type="daterange" @change="dateChangeHandle" v-model="worktimeForm.InoutDaterange" name="InoutDaterange"
                :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="GroupList" label="部门">
              <el-cascader placeholder="请选择部门" style="width: 230px;" @change="groupChangeHandle" v-model="worktimeForm.GroupList"
                :options="optionGroups" filterable change-on-select size="mini"></el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="loading" icon="el-icon-search" @click.native.prevent="handleSubmit(false)"
                size="mini">查询</el-button>
              <el-button type="success" :loading="loading" icon="el-icon-download" @click.native.prevent="handleSubmit(true)"
                size="mini">导出Excel</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <div style="padding:10px;">进场人员走势：</div>
          <echart ref="echarts-jcryzs" :options="option" class="echarts-jcryzs" theme="infographic" style="width:100%"></echart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import TJFXMenu from "../layout/components/TJFXMenu.vue"
  import {
    Loading
  } from 'element-ui';
  export default {
    components: {
      TJFXMenu
    },
    data() {
      const validateInoutDaterange = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须选择时间范围'))
        } else {
          callback()
        }
      }
      return {
        loading: false,
        optionGroups: [], //部门选择的数据
        worktimeForm: {
          GroupList: ['all'], // 计划名称
          InoutDaterange: [], // 时间范围
        },
        ruleInoutDaterange: [{ //计划时间验证
          required: true,
          trigger: 'blur',
          validator: validateInoutDaterange
        }],
        option: {
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:'2%',
            containLabel: true
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          },
          yAxis: {
            type: 'value'
          },
          color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
          series: [{
            data: [820, 932, 901, 934, 1290, 1330, 1320],
            type: 'line',
            smooth: true,
            center: ['10%', '10%'],
          }]
        }
        //   option: {
        //     tooltip: {
        //       trigger: 'item',
        //       formatter: '{a} <br/>{b}: {c} ({d}%)'
        //     },
        //     legend: {
        //       orient: 'vertical',
        //       x: 'right',
        //       y: '25%',
        //       align: 'left',
        //       itemGap: 35,
        //       right: '10%'
        //     },
        //     color: ['#D16AAB', '#57A2D6', '#FBDB70', '#88DDE1', '#F3A386'],
        //     series: [{
        //       name: '',
        //       type: 'pie',
        //       radius: ['58%', '85%'],
        //       center: ['10%', '50%'],
        //       avoidLabelOverlap: false,
        //       label: {
        //         normal: {
        //           show: false,
        //           position: 'center'
        //         },
        //         emphasis: {
        //           show: true,
        //           textStyle: {
        //             fontSize: '15',
        //             fontWeight: 'bold'
        //           }
        //         }
        //       },
        //       labelLine: {
        //         normal: {
        //           show: false
        //         }
        //       },
        //       data: [{
        //           value: 0,
        //           name: '抽烟报警'
        //         },
        //         {
        //           value: 0,
        //           name: '接打电话报警'
        //         },
        //         {
        //           value: 0,
        //           name: '疲劳驾驶报警'
        //         },
        //         {
        //           value: 0,
        //           name: '前向碰撞报警'
        //         },
        //         {
        //           value: 0,
        //           name: '车道偏离报警'
        //         },
        //         {
        //           value: 0,
        //           name: '车距过近报警'
        //         },
        //         {
        //           value: 0,
        //           name: '行人碰撞报警'
        //         },
        //         {
        //           value: 0,
        //           name: '频繁变道报警'
        //         },
        //         {
        //           value: 0,
        //           name: '道路标识超限报警'
        //         },
        //         {
        //           value: 0,
        //           name: '障碍物报警'
        //         },
        //         {
        //           value: 0,
        //           name: '分神驾驶报警'
        //         },
        //         {
        //           value: 0,
        //           name: '驾驶员异常报警'
        //         }
        //       ]
        //     }]
        //   }
      };
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },

    },
    watch: {
      project_id(curVal, oldVal) {
        if (curVal !== null) {
          // this.reloadData()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {}

    },

    methods: {
      dateChangeHandle() {},
      groupChangeHandle() {},
    }

  };

</script>
