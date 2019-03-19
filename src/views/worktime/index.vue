<style lang="scss">
  @import "./index";
</style>
<template>
  <div class="worktime-container" style="margin: 0px;">
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
          <el-table v-loading="loading" :data="personInoutList" height="350px" highlight-current-row @row-click="handleRowClick"
            style="width: 100%" size="mini" :show-header="true" header-align="center" :default-sort="{prop: 'name', order: 'ascending'}">
            <el-table-column fixed type="index" width="40">
            </el-table-column>
            <el-table-column fixed property="name" sortable label="姓名"  header-align="center">
            </el-table-column>

            <el-table-column property="group_name_level[0]" sortable label="部门" header-align="center">
            </el-table-column>
            <el-table-column property="group_name_level[1]" sortable label="专业" header-align="center">
            </el-table-column>
            <el-table-column property="inDay" sortable label="出勤天数"  align="center" header-align="center">
            </el-table-column>
            <el-table-column property="countDay" sortable label="休息天数" align="center" header-align="center">
            </el-table-column>
            <el-table-column property="mobile" label="工作时长"  header-align="center">
            </el-table-column>
          </el-table>
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
        personInoutList: []
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
          this.reloadData()
        }
      },
    },
    mounted() {
      if (this.project_id !== null) {
        this.getProjectGroups()
      }
      // 
      const start = moment().add('month', 0).format('YYYY-MM') + '-01'
      this.worktimeForm.InoutDaterange = [start, moment()]
    },

    methods: {
      reloadData() {
        this.getProjectGroups()
      },
      dateChangeHandle() {},
      groupChangeHandle() {},
      getProjectGroups() {
        console.log('project_id1', this.project_id)
        const param = {
          method: 'query_group',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectGroups', param).then(() => {
          console.log('this.projectGroupList1', this.projectGroupList)
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
        console.log("this.optionGroups", this.optionGroups)
      },
      handleSubmit(isExport) {
        // console.log('isExport', isExport)
        // this.loading = true
        this.$refs.worktimeForm.validate(valid => {
          if (valid) {
            // console.log(this.worktimeForm)
            const sTime = moment(this.worktimeForm.InoutDaterange[0]).format('YYYY-MM-DD 00:00:00')
            const eTime = moment(this.worktimeForm.InoutDaterange[1]).format('YYYY-MM-DD 23:59:59')
            // -> store module ->api
            // console.log(sTime, eTime)
            this.personInoutList = []
            this.totalPerson = 0
            const param = {
              method: 'query_person_in_hours',
              project_id: this.project_id,
              bt: sTime,
              et: eTime
            }
            console.log('param', param)
            // this.$store.dispatch('queryPersonWorktime', param).then((data) => {
            //   console.log('datadata', data)
            //   // console.log(this.projectPersonInoutList)
            //   // console.log('queryPersonWorktime', this.projectPersonInDay)
            //   // this.getProjectPersonInout(sTime, eTime, isExport)
            //   // console.log('this.personInoutList', this.personInoutList)
            // }).catch(() => {
            //   this.loading = false
            // })



          }
        })

      },
      handleRowClick(row, event, column) {

      },
    }

  };

</script>
