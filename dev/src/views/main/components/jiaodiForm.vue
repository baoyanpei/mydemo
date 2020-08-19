<style lang="scss">
  @import "./jiaodiForm";
</style>
<template>
  <div class="jiaodi-form">
    <el-form ref="jdhyForm" :model="jdhyForm" label-width="87px" style="height: 500px;padding:10px;overflow-y: auto;"
      :validate-on-rule-change="true">
      <el-form-item prop="JHMC" label="交底名称">
        <!-- <el-input placeholder="请填写计划名称" v-model="jdhyForm.JHMC" name="JHMC" size="mini"></el-input> -->
        <span class="jdhyForm-JHMC">{{jdhyForm.JHMC}}</span>
        <span v-if="jdhyForm.STATUS===-1" style="color:#FF0000;">（未完成）</span>
        <span v-if="jdhyForm.STATUS===0" style="color:#36BB9D;">（完成）</span>
      </el-form-item>
      <el-form-item prop="JHSJ" label="计划时间">
        {{ jdhyForm.JHSJ[0] }}至{{ jdhyForm.JHSJ[1] }}
      </el-form-item>
      <el-form-item prop="SJSJ" label="实际时间" :rules="ruleSJSJ">
        <el-date-picker type="daterange" v-model="jdhyForm.SJSJ" name="SJSJ" :editable="false" :clearable="false"
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" style="width: 100%">
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="JHFZR" label="交底负责人">
        <el-select v-model="jdhyForm.JHFZR" name="JHFZR" filterable placeholder="请填写负责人名字" size="mini">
          <el-option v-for="item in optionsProjectPersion" :key="item.id" :label="`${item.name}（${item.group_name}）`"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="JHDD" label="交底地点">
        <el-input placeholder="请填写交底地点" v-model="jdhyForm.JHDD" name="JHDD" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="资料" label-width="20"></el-form-item>
      <el-form-item label="" label-width="0">
        <div class="ry-table">
          <el-table :data="tableDataZiliao" height="50" border style="width: 100%" @row-click="RowClick">
            <el-table-column prop="name" label="资料名称" width="100">
            </el-table-column>
            <el-table-column prop="date" label="数量">
            </el-table-column>
            <el-table-column prop="address" label="最后上传时间">
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="人员" label-width="20"></el-form-item>
      <el-form-item label="" label-width="0">
        <div class="ry-table">
          <el-table :data="tableData3" height="100" border style="width: 100%" @row-click="RowClick">
            <el-table-column prop="name" label="姓名" width="60">
            </el-table-column>
            <el-table-column prop="date" label="电话">
            </el-table-column>
            <el-table-column prop="address" label="部门">
            </el-table-column>
            <el-table-column prop="gongzong" label="工种">
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="备注" label-width="20"></el-form-item>
      <el-form-item label-width="0">
        <el-input placeholder="请填写备注" v-model="jdhyForm.BZ" name="BZ" type="textarea" :rows="3" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="计划状态">
        <el-radio-group v-model="jdhyForm.STATUS">
          <el-radio :label="-1">未完成</el-radio>
          <el-radio :label="0">已完成</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div>
      <el-row :gutter="24" style="margin:10px;">
        <el-col :span="12">
          <el-button type="danger" :loading="loading" style="float: left;" @click.native.prevent="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="12">
          <el-button type="success" :loading="loading" style="float: right;" @click.native.prevent="handleSubmit">确定修改</el-button>
        </el-col>
      </el-row>
    </div>
    <el-dialog v-el-drag-dialog :modal="false" custom-class="ryxx-dialog" width="400px" top="8vh" :lock-scroll="true"
      :close-on-click-modal="false" :visible.sync="dialogRYXXVisible" title="人员信息">
      <RyxxFrom></RyxxFrom>
    </el-dialog>
  </div>

</template>

<script>
  import moment from 'moment'
  import RyxxFrom from './ryxxForm'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  export default {
    components: {
      RyxxFrom
    },
    directives: {
      elDragDialog
    },
    data() {
      //计划名称
      const validateJHMC = (rule, value, callback) => {
        if (value.length <= 1) {
          callback(new Error('必须填写交底名称'))
        } else {
          callback()
        }
      }

      //计划负责人
      const validateJHFZR = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须填写交底负责人'))
        } else {
          callback()
        }
      }
      //计划地点
      const validateJHDD = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须填写计划地点'))
        } else {
          callback()
        }
      }

      //实际时间
      const validateSJSJ = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('必须选择计划的时间范围'))
        } else {
          callback()
        }
      }

      return {
        dialogRYXXVisible: false,
        loading: false,
        jdhyForm: {
          ID: 0,
          PROJECT_ID: 0,
          JHMC: '', // 计划名称
          JHLX: '', // 计划类型
          JHFZR: '', // 计划负责人
          JHDD: '', // 计划地点
          JHSJ: [], // 计划时间
          SJSJ: [], // 实际时间
          BZ: '', // 计划备注
          STATUS: -1 //-1未执行完毕0,资料完成，计划执行完毕
        },
        ruleJHMC: [{ //计划名称
          required: true,
          trigger: 'blur',
          validator: validateJHMC
        }],
        ruleJHFZR: [{ //计划负责人
          required: true,
          trigger: 'blur',
          validator: validateJHFZR
        }],
        ruleJHDD: [{ //计划地点
          required: true,
          trigger: 'blur',
          validator: validateJHDD
        }],
        ruleSJSJ: [{ //实际时间
          required: true,
          trigger: 'blur',
          validator: validateSJSJ
        }],
        optionsProjectPersion: [],
        tableDataZiliao: [{
          "id": "1",
          date: '3',
          name: '交底资料>>',
          address: '2018年9月5日'
        }],
        tableData3: [{
          "id": "1",
          date: '18111111111',
          name: '王小虎',
          address: '技术部'
        }, {
          date: '18111111111',
          name: '王小虎',
          address: '技术部'
        }]
      }
    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      planDetail() {
        return this.$store.state.huiyi.planDetail
      },
      planDetailChange() {
        return this.$store.state.huiyi.planDetailChange
      },
      projectPersonList() {
        return this.$store.state.project.projectPersonList
      }
    },
    watch: {
      planDetailChange(curVal, oldVal) {
        this.getData()
      }
    },
    created: function () {


    },
    mounted() {

      this.getProjectPersons()
    },
    methods: {
      getData() {
        console.log("this.planDetail", this.planDetail)
        if (this.planDetail === undefined) {
          this.$message({
            message: '未查询到相关信息',
            type: 'error'
          })
          return
        } else {
          this.jdhyForm.JHMC = this.planDetail.title
          this.jdhyForm.JHLX = this.planDetail.plan_type
          this.jdhyForm.PROJECT_ID = this.planDetail.project_id
          this.jdhyForm.ID = this.planDetail.id
          this.jdhyForm.JHSJ = [moment(this.planDetail.plan_start_date, 'YYYY-MM-DD').format('YYYY年MM月DD日'), moment(
            this.planDetail.plan_end_date, 'YYYY-MM-DD').format('YYYY年MM月DD日')]
          if (this.planDetail.actual_start_time !== undefined && this.planDetail.actual_finished_time !== undefined) {
            this.jdhyForm.SJSJ = [this.planDetail.actual_start_time, this.planDetail.actual_finished_time]
          } else {
            this.jdhyForm.SJSJ = [this.planDetail.plan_start_date, this.planDetail.plan_end_date]
          }

          this.jdhyForm.JHFZR = this.planDetail.execute_user
          this.jdhyForm.JHDD = this.planDetail.plan_address
          this.jdhyForm.BZ = this.planDetail.plan_desc
          this.jdhyForm.STATUS = this.planDetail.status
          console.log("this.jdhyForm.STATUS", this.jdhyForm.STATUS)
        }

      },
      getProjectPersons() {
        const param = {
          method: 'query_person',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          console.log(this.projectPersonList)
          this.optionsProjectPersion = this.projectPersonList
          this.getData()
        }).catch(() => {

        })
      },
      handleSubmit() {

        if (this.jdhyForm.ID === 0) {
          this.$message({
            message: '未查询到相关数据，请重新查询！',
            type: 'error'
          })
          return
        }
        this.$refs.jdhyForm.validate(valid => {
          if (valid) {

            this.$confirm('确定后将修改该项目计划, 是否确定?', '确认是否修改该任务计划', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              // center: true
            }).then(() => {
              const sTime = moment(this.jdhyForm.SJSJ[0]).format('YYYY-MM-DD')
              const eTime = moment(this.jdhyForm.SJSJ[1]).format('YYYY-MM-DD')
              // -> store module ->api
              const submitData = {
                method: "add",
                id: this.jdhyForm.ID,
                plan_type: this.jdhyForm.JHLX,
                plan_name: this.jdhyForm.JHMC,
                project_id: this.jdhyForm.PROJECT_ID,
                actual_start_time: sTime,
                actual_finished_time: eTime,
                plan_address: this.jdhyForm.JHDD,
                plan_desc: this.jdhyForm.BZ,
                execute_user: this.jdhyForm.JHFZR,
                status: this.jdhyForm.STATUS

              }
              // console.log('submitData', submitData)
              // return
              this.loading = true
              this.$store.dispatch('HuiYiSubmit', submitData).then(() => {
                this.$message({
                  message: '修改会议计划成功！',
                  type: 'success'
                })
                this.loading = false
              }).catch(() => {
                this.loading = false
              })
            }).catch(() => {

            });

          }
        })

      },
      handleDelete() {
        const message = '确定后该任务计划将删除, 是否确定?' + '<br/><span style="color:#FF0000;">该任务计划已有人员参与，请确认是否删除！</span>';
        this.$confirm(message, '确认是否删除该任务计划', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          type: 'warning',
          // center: true
        }).then(() => {

        }).catch(() => {

        });
      },
      loadAll() {
        return [{
            "id": "1",
            "value": "三全鲜食（北新泾店）",
            "address": "长宁区新渔路144号"
          },
          {
            "id": "2",
            "value": "Hot honey 首尔炸鸡（仙霞路）",
            "address": "上海市长宁区淞虹路661号"
          },
          {
            "id": "3",
            "value": "新旺角茶餐厅",
            "address": "上海市普陀区真北路988号创邑金沙谷6号楼113"
          },
        ];
      },
      querySearchAsync(queryString, cb) {
        console.log("queryString", queryString)
        var restaurants = [];
        // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
        cb(restaurants);
        // clearTimeout(this.timeout);
        // this.timeout = setTimeout(() => {
        //   cb(results);
        // }, 3000 * Math.random());
      },
      handleSelect(item) {
        console.log(item);
      },
      RowClick(row, event, column) {
        console.log(row);
        this.dialogRYXXVisible = true;
      }
    }
  }

</script>
