<style lang="scss">
  @import "./nowinForm";

</style>
<template>
  <div>
    <el-dialog :modal="false" custom-class="ryxx-dialog" width="800px" top="1vh" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonNowInDialogHandle" :visible.sync="personNowinDialog.show"
      title="场内人员清单">
      <div id="nowin-from" class="nowin-from">
        <el-form ref="personInoutForm" :model="personInoutForm" label-width="80px" :inline="true">
          <el-form-item prop="GroupList" label="部门">
            <el-cascader placeholder="请选择部门" style="width: 230px;" @change="groupChangeHandle"
              v-model="personInoutForm.GroupList" :options="optionGroups" filterable change-on-select size="mini">
            </el-cascader>
          </el-form-item>
          <br />
          <el-form-item prop="person_id" label="人员姓名">
            <el-select v-model="personInoutForm.person_id" name="person_id" @change="persionChangeHandle" filterable
              clearable placeholder="请填写人员名字（可选）" size="mini">
              <el-option v-for="item in optionsProjectPersion" :key="item.person_id" :label="`${item.name}`"
                :value="item.person_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" :loading="loading" icon="el-icon-search" @click.native.prevent="handleSubmit()"
              size="mini">查询场内人员</el-button>
            <el-button type="danger" :loading="loading" icon="el-icon-circle-close-outline"
              @click.native.prevent="personAllGoOutHandleSubmit()" size="mini">全部出场</el-button>
          </el-form-item>
        </el-form>
        <span class="table-title">人员名单</span><span class="table-total">共 {{ totalPerson }} 人</span>
        <hr class="hr1" />
        <el-table ref="personInoutTable" v-loading="loading" :data="personNowInList" height="400px"
          :empty-text="personInoutTableEmptyText" highlight-current-row @current-change="handleCurrentChange"
          style="width: 100%" size="mini" :show-header="true" header-align="center"
          :default-sort="{prop: 'name', order: 'ascending'}">
          <el-table-column type="index" width="40">
          </el-table-column>
          <el-table-column property="name" sortable label="姓名" width="80" header-align="center">
            <template slot-scope="scope">
              <el-button @click="handleNameClick(scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column property="mobile" label="电话" width="100" header-align="center">
          </el-table-column>
          <el-table-column property="group_name_level[0]" sortable label="部门" width="90" header-align="center">
          </el-table-column>
          <el-table-column property="group_name_level[1]" sortable label="专业" header-align="center">
          </el-table-column>
          <el-table-column property="last_in_time" sortable label="最后进场时间" width="140" header-align="center">
          </el-table-column>
          <el-table-column property="last_in_face_percent" sortable label="识别率" width="100" header-align="center">
            <template slot-scope="scope">
              <div style="text-align: center;cursor: pointer;" @click="openPersonFacePersonDialogHandle(scope.row)">
                <el-tooltip v-if="scope.row.last_in_log.compare === 2" class="item" effect="dark" content="已经确认是本人"
                  placement="top">
                  <i class="el-icon-circle-check" style="color:green;"></i>
                </el-tooltip>

                <el-tooltip v-if="scope.row.last_in_log.compare === 3" class="item" effect="dark" content="已经确认不是本人"
                  placement="top">
                  <i class="el-icon-circle-close" style="color:red;"></i>
                </el-tooltip>
                <span style="padding-bottom: 1px;border-bottom: 1px dashed #999999;">

                  <span v-if="scope.row.last_in_face_percent>=50">
                    {{scope.row.last_in_face_percent}}%
                  </span>
                  <span v-else-if="scope.row.last_in_face_percent>=0">
                    <span class="shibielvdi">
                      {{scope.row.last_in_face_percent}}%
                    </span>
                  </span>
                  <span v-else>
                    <span class="weishibie">未识别</span>
                  </span>
                </span>

              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="warning" icon="el-icon-circle-close-outline"
                @click="handlePersonGoout(scope.$index, scope.row)">手动出场</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'

  export default {
    components: {

    },
    directives: {},
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },
      projectPersonList() {
        return this.$store.state.project.projectPersonList
      },
      personNowinDialog: {
        get: function () {
          return this.$store.state.project.personNowinDialog
        },
        set: function (newValue) {
          this.$store.state.project.personNowinDialog = newValue
        }
      },
      projectPersonNowInList() {
        return this.$store.state.project.projectPersonNowInList
      },
      personNowinChanged() {
        return this.$store.state.project.personNowinChanged
      }
    },
    data() {

      return {
        personInoutForm: {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
        },
        loading: false,
        optionGroups: [], //部门选择的数据
        optionsProjectPersion: [],
        personNowInList: [],
        personInoutTableEmptyText: '请点击查询按钮进行查询',
        totalPerson: 0
      }
    },
    created: function () {

    },
    watch: {
      personNowinChanged(curVal, oldVal) {
        console.log("personNowinChanged")
        this.getProjectPersonInout()
      }
    },
    methods: {
      // 打开窗口
      openPersonNowInDialogHandle() {
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#nowin-from'
        // });
        this.getProjectPersonInout()
        this.getProjectGroups()
        this.getProjectPersons()
      },
      getProjectGroups() {
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
      getProjectPersons() {
        const param = {
          method: 'query_person_list',
          project_id: this.project_id
        }
        this.$store.dispatch('QueryProjectPersons', param).then(() => {
          // console.log(this.projectPersonList)
          this.optionsProjectPersion = this.projectPersonList
          this.loadingInstance.close();
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
        // console.log("this.optionGroups", this.optionGroups)
      },
      checkPerson(person) {
        // console.log('person', person)
        this.isMatchPerson = false
        if (this.personInoutForm.person_id !== '') {
          if (person.person_id.toString() === this.personInoutForm.person_id.toString()) {
            this.isMatchPerson = true
          }
        } else {
          this.isMatchPerson = true
        }
        // console.log('this.isMatchPerson', this.isMatchPerson)
        if (this.isMatchPerson === true) {
          this.personNowInList.push(person)
        }
      },
      handleCurrentChange(data) { //点击下级部门的分组
        // console.log('data', data)
      },
      handleNameClick(row) {
        console.log('row', row)
        const sTime = moment().add('day', -5).format('YYYY-MM-DD 00:00:00')
        const eTime = moment().format('YYYY-MM-DD 23:59:59')
        const param = {
          show: true,
          sTime: sTime,
          eTime: eTime,
          ...row
        }
        this.$store.dispatch('SetInOutPersonDialog', param).then(() => {}).catch(() => {

        })
      },
      getProjectPersonInout() {
        this.loading = true
        const param = {
          method: 'query_person_inout',
          project_id: this.project_id,
          in_status: 1
        }
        this.personNowInList = []
        this.totalPerson = 0
        this.$store.dispatch('QueryProjectPersonNowIn', param).then(() => {
          // console.log('this.projectPersonNowInList', this.projectPersonNowInList)
          this.projectPersonNowInList.forEach(item => {
            // console.log('item1', item)
            let groupMatch = []
            if (this.personInoutForm.GroupList[0] === 'all') {
              // console.log('this.personInoutForm.GroupList[0]', this.personInoutForm.GroupList[0])
              this.checkPerson(item)
            } else if (this.personInoutForm.GroupList.length === 1) {
              // intersection取交集
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length > 0) {
                this.checkPerson(item)
              }
            } else if (this.personInoutForm.GroupList.length > 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              // union 取并集
              const groupMatch2 = lodash.union(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length === groupMatch2.length) {
                this.checkPerson(item)
              }
            }


          })
          this.totalPerson = this.personNowInList.length;
          this.loading = false
          // console.log('this.personInoutList', this.personInoutList)
        }).catch(() => {
          this.loading = false
        })
      },
      handlePersonGoout(index, row) {
        console.log(index, row);
        const param = {
          show: true,
          type: 'single',
          person: row
          // personInfo: this.personInfo,
          // compare: compare
        }
        this.$store.dispatch('SetPersonGoOutDialog', param).then(() => {}).catch(() => {})
        /*
        this.$confirm(`是否要将场${row.name}手动出场？`, '手动出场', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定出场',
            cancelButtonText: '取消'
          })
          .then(() => {

            const param = {
              method: 'person_goout',
              project_id: this.project_id,
              person_id: row.person_id
            }
            this.personNowInList = []
            this.$store.dispatch('QueryProjectPersonGoOut', param).then(() => {
              this.getProjectPersonInout()
              this.$message({
                message: `${row.name}手动出场成功！`,
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
            })



          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel' ?
            //     '放弃保存并离开页面' : '停留在当前页面'
            // })
          });
          */
      },
      persionChangeHandle(value) {
        // if (value !== '') {
        //   let _person = {};
        //   _person = this.projectPersonList.find((item) => { //这里的userList就是上面遍历的数据源
        //     return item.person_id === value; //筛选出匹配数据
        //   });
        //   this.personInoutForm.person_name = _person.name
        //   // console.log('_person', _person)
        //   // console.log(_person.name); //我这边的name就是对应label的
        // } else {
        //   this.personInoutForm.person_name = ''
        // }
      },
      handleSubmit() {
        this.getProjectPersonInout()
      },
      personAllGoOutHandleSubmit() {

        const param = {
          show: true,
          type: 'all',
          person: null
          // personInfo: this.personInfo,
          // compare: compare
        }
        this.$store.dispatch('SetPersonGoOutDialog', param).then(() => {}).catch(() => {})
        /*
        this.$confirm('是否要将场内的人员全部手动出场？', '全部出场', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定出场',
            cancelButtonText: '取消'
          })
          .then(() => {


            const param = {
              method: 'person_goout',
              project_id: this.project_id
            }
            this.personNowInList = []
            this.$store.dispatch('QueryProjectPersonGoOut', param).then(() => {
              this.getProjectPersonInout()
              this.$message({
                message: '全部出场成功！',
                type: 'success'
              })
            }).catch(() => {
              this.loading = false
            })



          })
          .catch(action => {
            // this.$message({
            //   type: 'info',
            //   message: action === 'cancel' ?
            //     '放弃保存并离开页面' : '停留在当前页面'
            // })
          });
          */

      },
      groupChangeHandle() {},
      //识别率详细窗口
      openPersonFacePersonDialogHandle(data) {
        console.log('openPersonFacePersonDialogHandle', data)
        const param = {
          show: true,
          ...data
        }
        this.$store.dispatch('SetPersonFacePersonDialog', param).then(() => {}).catch(() => {

        })
      }
    },
    mounted() {

    }
  }

</script>
