<style lang="scss">
  @import "./personListDialog";

</style>
<template>
  <el-dialog :modal="false" width="820px" top="1vh" :lock-scroll="true" :close-on-click-modal="false"
    @open="openPersonListDialogHandle" :visible.sync="personListDialog.show" title="人员信息">
    <div id="person-list-from" class="person-list-from">
      <el-form ref="personInoutForm" :model="personInoutForm" label-width="80px" :inline="true">
        <div>
          <el-form-item prop="GroupList" label="部门">
            <el-cascader placeholder="请选择部门" style="width: 230px;" @change="groupChangeHandle"
              v-model="personInoutForm.GroupList" :options="optionGroups" filterable change-on-select size="mini">
            </el-cascader>
            <el-tooltip placement="right">
              <div slot="content">外部单位包括：<br />建设单位代表、监理单位代表、VIP等
                <br />不选择此项则只包含项目部人员
              </div>
              <el-checkbox v-model="checkedPersonType" style="margin-left:10px; ">
                包括外部单位
              </el-checkbox>
            </el-tooltip>
          </el-form-item>
        </div>
        <div>
          <el-form-item prop="person_id" label="人员姓名">
            <el-select v-model="personInoutForm.person_id" name="person_id" @change="persionChangeHandle" filterable
              clearable placeholder="请填写人员名字（可选）" size="mini">
              <el-option v-for="item in optionsProjectPersion" :key="item.person_id" :label="`${item.name}`"
                :value="item.person_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" :loading="loading" icon="el-icon-search"
              @click.native.prevent="handleSubmit(false)" size="mini">查询</el-button>
            <el-button type="success" :loading="loading" icon="el-icon-download"
              @click.native.prevent="handleSubmit(true)" size="mini">导出Excel</el-button>
          </el-form-item>
        </div>


      </el-form>
      <!-- <hr class="hr1" /> -->
      <span class="table-title">人员名单</span><span class="table-total">共 {{ totalPerson }} 人</span>
      <hr class="hr1" />
      <el-table ref="personInoutTable" v-loading="loading" :data="personInoutList" height="400px"
        :empty-text="personInoutTableEmptyText" highlight-current-row @row-click="handleRowClick" style="width: 100%"
        size="mini" :show-header="true" header-align="center" :default-sort="{prop: 'name', order: 'ascending'}">
        <el-table-column type="index" width="40">
        </el-table-column>
        <el-table-column property="name" sortable align="center" label="姓名" width="80" header-align="center">
          <template slot-scope="scope">
            <el-button @click="handleNameClick(scope.row)" type="text" size="small">{{scope.row.name}}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column property="mobile" label="电话" width="100" header-align="center">
              </el-table-column> -->
        <el-table-column property="group_name_level[0]" align="center" sortable label="部门" width="90"
          header-align="center">
        </el-table-column>
        <el-table-column property="group_name_level[1]" align="center" sortable label="专业" width="100"
          header-align="center">
        </el-table-column>
        <el-table-column property="project_pos_name" align="center" sortable label="工种" width="80"
          header-align="center">
        </el-table-column>
        <el-table-column property="education" align="center" sortable label="学历" width="80" header-align="center">
        </el-table-column>
        <el-table-column property="created_time" sortable align="left" label="入职时间" width="120" header-align="center">
          <template slot-scope="scope">
            {{trantime(scope.row.created_time)}}
          </template>
        </el-table-column>
        <el-table-column property="status" sortable align="center" label="人员状态" width="100" header-align="center">
          <template slot-scope="scope">
            <p v-html="statusName(scope.row.status,true)"></p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="warning" @click="handleOperClick(scope.row)">操作</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
  import moment from 'moment'
  import lodash from 'lodash'
  import {
    getGroupFromGroupsByGroupID
  } from '@/utils/project'
  import {
    Loading
  } from 'element-ui';
  // import Mock from 'mockjs'
  export default {
    components: {},
    directives: {},
    filters: {

    },
    computed: {
      project_id() {
        return this.$store.state.project.project_id
      },
      projectGroupList() {
        return this.$store.state.project.projectGroupList
      },
      personListDialog: {
        get: function () {
          return this.$store.state.project.personListDialog
        },
        set: function (newValue) {
          this.$store.state.project.personListDialog = newValue
        }
      },
      projectPersonList() {
        return this.$store.state.project.projectPersonList
      },
      personListChanged() {
        return this.$store.state.project.personListChanged
      }
    },
    data() {
      return {
        loadingInstance: null,
        loading: false,
        optionGroups: [], //部门选择的数据
        optionsProjectPersion: [],
        personInoutList: [],
        personInoutForm: {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
        },
        isMatchPerson: false, // 是否匹配人员名称
        personInoutTableEmptyText: '请点击查询按钮进行查询',
        checkedPersonType: false, //false 只有项目部
        totalPerson: 0
        // list: []
      }
    },
    created: function () {


    },
    watch: {
      loading(curVal, oldVal) {
        if (curVal === false) {} else {

        }
      },
      personListDialog: {
        handler: function (newVal, oldVal) {
          console.info('value changed2 ', newVal)
          if (newVal.show === true) {
            // console.log('personListDialog - show')
            this.initData()
            this.getProjectGroups()
            this.getProjectPersons()
            this.getProjectPersonInout(false)
          } else {
            this.initData()
          }

        },
        deep: true
      },
      personListChanged(curVal, oldVal) {
        this.handleSubmit(false)
      },
    },
    methods: {
      trantime: (time) => {
        return moment(time).format('YYYY-MM-DD')
      },
      statusName: (value, isHTML) => {
        // 人员状态 0正常2辞职4开除10是默认值
        let _statusName = ''
        switch (value) {
          case 0:
            _statusName = '正常'
            if (isHTML) {
              _statusName = '<span class="statu0">' + _statusName + '</span>'
            }
            break;
          case 2:
            _statusName = '辞职'
            if (isHTML) {
              _statusName = '<span class="statu2">' + _statusName + '</span>'
            }
            break;
          case 4:
            _statusName = '开除'
            if (isHTML) {
              _statusName = '<span class="statu4">' + _statusName + '</span>'
            }
            break;
          case 10:
            _statusName = ''
            break;
          default:
            _statusName = value
            break
        }
        return _statusName
      },
      initData() {
        this.personInoutList = []
        this.totalPerson = 0

        this.optionGroups = [] //部门选择的数据
        this.optionsProjectPersion = []
        this.personInoutForm = {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
        }
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
      getProjectPersonInout(isExport) {
        this.loading = true

        const param = {
          method: 'query_person_list',
          project_id: this.project_id,
          // in_status: 1,
          // bt: bt,
          // et: et
        }
        // const countDay = moment(et).diff(moment(bt), 'days') + 1
        // console.log('countDay', countDay)
        this.$store.dispatch('QueryProjectPersons', param).then((personList) => {
          console.log('personList', personList)
          console.log('personInoutForm', this.personInoutForm)
          personList.forEach(item => {
            // item.countDay = countDay
            let groupMatch = []
            if (this.personInoutForm.GroupList[0] === 'all') {
              this.checkPerson(item)
            } else if (this.personInoutForm.GroupList.length === 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length > 0) {
                this.checkPerson(item)
              }
            } else if (this.personInoutForm.GroupList.length > 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutForm.GroupList)
              const groupMatch2 = lodash.union(item.group_id_level, this.personInoutForm.GroupList)
              if (groupMatch.length === groupMatch2.length) {
                this.checkPerson(item)
              }
            }

          })
          console.log('this.personInoutList', this.personInoutList)
          this.totalPerson = this.personInoutList.length;
          this.loading = false
          if (this.personInoutList.length === 0) {
            this.personInoutTableEmptyText = "没有查询到符合条件的数据，请更换条件后再进行查询"
          }
          if (isExport === true) {
            this.exportExcelSubmit()
          }
          // console.log('this.personInoutList', this.personInoutList)
        }).catch(() => {
          this.loading = false
        })
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
        if (this.checkedPersonType === false) { // 不显示外部单位 只显示项目部，就是persontype=1的
          //person_type 账号类型 1项目部2建设单位代表3监理单位代表,4VIP
          if (person.person_type !== 1) {
            this.isMatchPerson = false
          }
        }
        // console.log('this.isMatchPerson', this.isMatchPerson)
        if (this.isMatchPerson === true) {
          this.personInoutList.push(person)
        }




      },
      // 打开窗口
      openPersonListDialogHandle() {
        //打开窗口的mask
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#person-list-from'
        // });

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
      handleSubmit(isExport) {
        // console.log('isExport', isExport)

        // console.log(this.personInoutForm)
        // -> store module ->api
        // console.log(sTime, eTime)
        this.personInoutList = []
        this.totalPerson = 0
        this.getProjectPersonInout(isExport)
      },
      exportExcelSubmit() {
        let filename = '人员信息'
        if (this.personInoutForm.GroupList[0] !== 'all') {
          // console.log('GroupList', this.personInoutForm.GroupList)
          if (this.personInoutForm.GroupList.length === 1) {
            let group0 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[0])
            // console.log('group0_name',group0_name)
            filename = `${filename}_${group0.group_name}`
          } else {
            let group0 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[0])
            let group1 = getGroupFromGroupsByGroupID(this.projectGroupList, this.personInoutForm.GroupList[1])
            filename = `${filename}_${group0.group_name}_${group1.group_name}`
          }
        } else {
          filename = `${filename}_所有部门`
        }

        if (this.personInoutForm.person_name !== '') {
          filename = `${filename}_${this.personInoutForm.person_name}`
        }

        filename = `${filename}_${moment().format('YYYYMMDDHHmmss')}`

        // if (this.personInoutForm.person_id !== '') {
        //     filename = `${filename}_${this.personInoutForm.GroupList[0]}`
        // }
        import('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['序号', '姓名', '电话', '部门', '专业', '工种',
            '学历', '入职时间', '人员状态'
          ]
          const filterVal = ['xuhao', 'name', 'mobile', 'group0', 'group1', 'project_pos_name', 'education',
            'created_time', 'statusName'
          ]
          let list = []
          let xuhao = 0
          this.personInoutList.forEach(person => {
            list.push({
              xuhao: ++xuhao, //序号
              name: person.name,
              mobile: person.mobile,
              group0: person.group_name_level[0],
              group1: person.group_name_level[1],
              project_pos_name: person.project_pos_name,
              education: person.education,
              created_time: moment(person.created_time).format('YYYY-MM-DD'),
              statusName: this.statusName(person.status)
            })
          })
          // const list = this.personInoutList
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: filename,
            autoWidth: this.autoWidth
          })
          this.downloadLoading = false
        })
      },
      handleCurrentChange(data) { //点击下级部门的分组
        console.log('data', data)


      },
      handleRowClick(row, event, column) {

      },
      handleNameClick(row) {
        const param = {
          show: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      handleOperClick(row) {
        const param = {
          show: true,
          opShow: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      persionChangeHandle(value) {
        // console.log(';value', value)
        if (value !== '') {

          let _person = {};
          _person = this.projectPersonList.find((item) => { //这里的userList就是上面遍历的数据源
            return item.person_id === value; //筛选出匹配数据
          });
          this.personInoutForm.person_name = _person.name
          // console.log('_person', _person)
          // console.log(_person.name); //我这边的name就是对应label的
        } else {
          this.personInoutForm.person_name = ''
        }
        // console.log('this.personInoutForm.person_name', this.personInoutForm.person_name)
      },
      groupChangeHandle() {}
    },
    mounted() {
      console.log('project_id', this.project_id)

    }
  }

</script>
