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
          <el-form ref="tjfxForm" :model="tjfxForm" label-width="80px" :inline="true">
            <el-form-item prop="InoutDaterange" label="时间范围" :rules="ruleInoutDaterange">
              <el-date-picker type="daterange" @change="dateChangeHandle" v-model="tjfxForm.InoutDaterange"
                name="InoutDaterange" :editable="false" :clearable="false" range-separator="至" start-placeholder="开始日期"
                end-placeholder="结束日期" size="mini">
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="GroupList" label="部门">
              <el-cascader placeholder="请选择部门" style="width: 230px;" @change="groupChangeHandle"
                v-model="tjfxForm.GroupList" :options="optionGroups" filterable change-on-select size="mini">
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button type="success" :loading="loading" icon="el-icon-search"
                @click.native.prevent="handleSubmit(false)" size="mini">查询</el-button>
            </el-form-item>
          </el-form>
          <hr class="hr1" />
          <el-row :gutter="10">
            <div style="padding:10px;">进场人员走势：</div>
          </el-row>
          <el-row :gutter="10">
            <EchartsJcryzs ref="EchartJcryzs"></EchartsJcryzs>
          </el-row>
          <el-row :gutter="10" style="padding-top:20px;">
            <el-col :span="12">
              <div style="padding:10px;">年龄分析：</div>
              <EchartsNlfx ref="EchartNlfx"></EchartsNlfx>
            </el-col>
            <el-col :span="12">
              <div style="padding:10px;">人员来源地区分布：</div>
              <EchartsRylydqfb ref="EchartRylydqfb"></EchartsRylydqfb>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import TJFXMenu from "../layout/components/TJFXMenu.vue"
  import EchartsJcryzs from "./echart-jcryzs.vue"
  import EchartsNlfx from "./echart-nlfx.vue"
  import EchartsRylydqfb from "./echart-rylydqfb.vue"
  import {
    Loading
  } from 'element-ui';
  export default {
    components: {
      TJFXMenu,
      EchartsJcryzs,
      EchartsNlfx,
      EchartsRylydqfb
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
        tjfxForm: {
          GroupList: ['all'], // 计划名称
          InoutDaterange: [], // 时间范围
        },
        ruleInoutDaterange: [{ //计划时间验证
          required: true,
          trigger: 'blur',
          validator: validateInoutDaterange
        }],


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
          this.reloadData()
        }
      },
    },
    mounted() {
      const start = moment().add('month', 0).format('YYYY-MM') + '-01'
      this.tjfxForm.InoutDaterange = [start, moment()]
      if (this.project_id !== null) {
        this.reloadData()
      }
      // 



    },

    methods: {
      reloadData() {
        this.getProjectGroups()
        this.loadEchart()
      },
      dateChangeHandle() {},
      groupChangeHandle() {},
      getProjectGroups() {
        // console.log('project_id1', this.project_id)
        const param = {
          method: 'query_group',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectGroups', param).then(() => {
          // console.log('this.projectGroupList1', this.projectGroupList)
          this.appendGroupData()
        }).catch(() => {

        })
      },
      appendGroupData() {
        const rootGroup = this.projectGroupList.group
        this.optionGroups = []
        // console.log("teim", item)
        this.optionGroups.push({
          label: '所有部门',
          value: 'all'
        })
        if (rootGroup !== undefined && rootGroup.length > 0) {
          //1为管理部门 0为施工部门3为建设单位4为监理单位5为外部单位 grouptype类型说明
          // console.log("item.group.groups_type", item.group)
          rootGroup.forEach(item1 => {
            if (item1.groups_type === 0 || item1.groups_type === 1) {
              // console.log('item1', item1)
              let children = []
              if (item1.group !== undefined && item1.group.length > 0) {
                item1.group.forEach(item2 => {
                  children.push({
                    label: `${item2.group_name}`,
                    value: item2.id,
                    // children: []
                  })
                })

              }
              this.optionGroups.push({
                label: `${item1.group_name}`,
                value: item1.id,
                children: children
              })
            }
          });
        }
      },
      handleSubmit(isExport) {
        // console.log('isExport', isExport)
        // this.loading = true
        this.$refs.tjfxForm.validate(valid => {
          if (valid) {

            this.loadEchart()


          }
        })

      },
      loadEchart() {
        // console.log(this.tjfxForm)
        const sTime = moment(this.tjfxForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
        const eTime = moment(this.tjfxForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
        // -> store module ->api
        // console.log(sTime, eTime)
        this.personInoutList = []
        this.totalPerson = 0
        const param = {
          // method: 'query_person_in_hours',
          project_id: this.project_id,
          bt: sTime,
          et: eTime
        }
        // console.log('param1', param)
        console.log('personInoutForm.GroupList', this.tjfxForm.GroupList)
        this.$refs.EchartJcryzs.reloadData(param);
        this.$refs.EchartNlfx.reloadData(param);
        this.$refs.EchartRylydqfb.reloadData(param);
      }
    }

  };

</script>
