<style lang="scss">
  @import "./nowinDialog";

</style>
<template>
  <div>
    <el-dialog :modal="false" custom-class="ryxx-dialog" width="600px" top="1vh" :lock-scroll="true"
      :close-on-click-modal="false" @open="openPersonNowInDialogHandle" :visible.sync="personNowinDialog.show"
      title="场内人员清单">
      <div id="nowin-dialog" class="nowin-dialog">
        <el-form ref="personInoutDialog" :model="personInoutDialog" label-width="80px" :inline="true">
          <el-form-item prop="GroupList" label="部门">
            <el-cascader placeholder="请选择部门" style="width: 230px;" @change="groupChangeHandle"
              v-model="personInoutDialog.GroupList" :options="optionGroups" filterable change-on-select size="mini">
            </el-cascader>
          </el-form-item>
          <br />
          <el-form-item prop="person_id" label="人员姓名">
            <el-select v-model="personInoutDialog.person_id" name="person_id" @change="persionChangeHandle" filterable
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
        <div class="personItemList">
          <div v-for="(item,index) in personNowInMapList" class="group-item">
            <div class="group-name">{{item.group_name}}</div>
            <div class="group-content">
              <div v-for="(person_item,index) in item.person_list" class="personItem">
                <div>
                  <img :src="person_item.idcard_pic" style="height:100px;" />
                </div>
                <div>
                  <el-button @click="handleNameClick(person_item)" class="btnName" type="text" size="small">
                    {{person_item.name}}</el-button>
                </div>
                <div>入场时间:{{trantime(person_item.last_in_time)}}</div>
                <div>识别率:
                  <span style="text-align: center;cursor: pointer;"
                    @click="openPersonFacePersonDialogHandle(person_item)">
                    <el-tooltip v-if="person_item.last_in_log.compare === 2" class="item" effect="dark"
                      content="已经确认是本人" placement="top">
                      <i class="el-icon-circle-check" style="color:green;"></i>
                    </el-tooltip>

                    <el-tooltip v-if="person_item.last_in_log.compare === 3" class="item" effect="dark"
                      content="已经确认不是本人" placement="top">
                      <i class="el-icon-circle-close" style="color:red;"></i>
                    </el-tooltip>
                    <span style="padding-bottom: 1px;border-bottom: 1px dashed #999999;">

                      <span v-if="person_item.last_in_face_percent>=50">
                        {{person_item.last_in_face_percent}}%
                      </span>
                      <span v-else-if="person_item.last_in_face_percent>=0">
                        <span class="shibielvdi">
                          {{person_item.last_in_face_percent}}%
                        </span>
                      </span>
                      <span v-else>
                        <span class="weishibie">未识别</span>
                      </span>
                    </span>
                  </span>
                </div>
                <div style="margin-top: 5px;">
                  <el-button size="mini" type="warning" icon="el-icon-circle-close-outline"
                    @click="handlePersonGoout(person_item)">手动出场</el-button>
                </div>
                <div style="clear: both;"></div>
              </div>
              <div style="clear: both;"></div>
            </div>
            <div style="clear: both;"></div>
          </div>
        </div>
        <hr class="hr1" />
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

    data() {

      return {
        personInoutDialog: {
          GroupList: ['all'], // 计划名称
          person_id: '', // 人员
          person_name: '',
        },
        loading: false,
        optionGroups: [], //部门选择的数据
        optionsProjectPersion: [],
        personNowInList: [],
        personInoutTableEmptyText: '请点击查询按钮进行查询',
        totalPerson: 0,
        personNowInMap: new Map(),
        personNowInMapList: []
      }
    },
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
      //   projectPersonNowInList() {
      //     return this.$store.state.project.projectPersonNowInList
      //   },
      personNowinChanged() {
        return this.$store.state.project.personNowinChanged
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
      trantime: (time) => {
        return moment(time).format('HH:mm:ss')
      },
      // 打开窗口
      openPersonNowInDialogHandle() {
        // this.loadingInstance = Loading.service({
        //   // fullscreen: true,
        //   target: '#nowin-dialog'
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
          // this.personInoutDialog.GroupList =[10030]
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
        if (this.personInoutDialog.person_id !== '') {
          if (person.person_id.toString() === this.personInoutDialog.person_id.toString()) {
            this.isMatchPerson = true
          }
        } else {
          this.isMatchPerson = true
        }
        // console.log('this.isMatchPerson', this.isMatchPerson)
        if (this.isMatchPerson === true) {
          if (person.idcard_pic === null || person.idcard_pic === '') {
            person.idcard_pic = '/static/photo_no.jpg'
          }
          this.personNowInList.push(person)

          let group_id
          let group_name

          if (person.group_id_level.length > 1) {
            group_id = person.group_id_level[1]
            group_name = person.group_name_level[1]
          } else if (person.group_id_level.length == 1) {
            group_id = person.group_id_level[0]
            group_name = person.group_name_level[0]
          } else {
            group_id = 0
            group_name = '其他'
          }
          if (this.personNowInMap.has(group_id) === false) {
            this.personNowInMap.set(group_id, {
              group_id: group_id,
              group_name: group_name,
              person_list: [person]
            })
          } else {
            let _groupInfo = this.personNowInMap.get(group_id)
            _groupInfo.person_list.push(person)
          }

        }
      },
      handleCurrentChange(data) { //点击下级部门的分组
        // console.log('data', data)
      },
      handleNameClick(row) {
        console.log('row', row)
        const param = {
          show: true,
          ...row
        }
        this.$store.dispatch('SetPersonInfoDialog', param).then(() => {}).catch(() => {

        })
      },
      getProjectPersonInout() {
        this.loading = true
        this.personNowInMap = new Map()
        this.personNowInMapList = []
        const param = {
          method: 'query_person_inout',
          project_id: this.project_id,
          in_status: 1
        }
        this.personNowInList = []
        this.totalPerson = 0
        this.$store.dispatch('QueryProjectPersonNowIn', param).then((personNowInDataList) => {
          personNowInDataList.forEach(item => {
            let groupMatch = []
            if (this.personInoutDialog.GroupList[0] === 'all') {
              // console.log('this.personInoutDialog.GroupList[0]', this.personInoutDialog.GroupList[0])
              this.checkPerson(item)
            } else if (this.personInoutDialog.GroupList.length === 1) {
              // intersection取交集
              console.log('this.personInoutDialog.GroupList', this.personInoutDialog.GroupList)
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutDialog.GroupList)
              if (groupMatch.length > 0) {
                this.checkPerson(item)
              }
            } else if (this.personInoutDialog.GroupList.length > 1) {
              groupMatch = lodash.intersection(item.group_id_level, this.personInoutDialog.GroupList)
              // union 取并集
              const groupMatch2 = lodash.union(item.group_id_level, this.personInoutDialog.GroupList)
              if (groupMatch.length === groupMatch2.length) {
                this.checkPerson(item)
              }
            }


          })
          this.personNowInMap.forEach(item => {
            this.personNowInMapList.push(item)
          })
          console.log('this.personNowInMap', this.personNowInMapList)
          this.totalPerson = this.personNowInList.length;
          this.loading = false
          // console.log('this.personInoutList', this.personInoutList)
        }).catch(() => {
          this.loading = false
        })
      },
      handlePersonGoout(row) {
        console.log(row);
        const param = {
          show: true,
          type: 'single',
          person: row
          // personInfo: this.personInfo,
          // compare: compare
        }
        this.$store.dispatch('SetPersonGoOutDialog', param).then(() => {}).catch(() => {})

      },
      persionChangeHandle(value) {

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
