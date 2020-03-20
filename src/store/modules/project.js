import {
  queryProjectPerson,
  queryProjectGroup,
  queryProjectCount,
  queryProjectGatePerson,
  queryProjectUser,
  queryProjectPersonInout,
  queryProjectPersonGoOut,
  queryLogsPersonComfirm,
  queryVehicleGate,
  queryProjectPersonInDay,
  queryInOutDetail,
  queryPersonWorktime,
  queryProjectWorktime,
  queryPersonDatum,
  setCardOpera,
  setQuitLeft,
  queryDutyWeek,
  queryDutyDay,
  updateDutyWeek
} from '@/api/person'
import Cookies from 'js-cookie'
import hasPermissionToOperation from '@/utils/permissionUrl' // 权限判断函数
const project = {
  state: {
    indexed_ver: '10',
    project_id: null, // project_id
    project_name: "", // 项目名字
    project_list: [],
    project_option: [], //项目下拉列表的选项
    org_name: "", //机构名称
    projectPersonList: [], // 人员列表
    projectPersonInfoByFacePercent: null, //用于识别率显示的人员信息
    projectGroupList: [], //分组列表
    projectCount: {
      "登记人数": 0,
      "all_count_in": 0,
      "业主人数": 0,
      "监理人员": 0,
      "VIP人员": 0,
      "项目经理部": 0,
      "基础施工班": 0,
      "土建施工班": 0,
      "安装施工班": 0,
      "装修施工班": 0,
      "特种作业班": 0,
      "技工施工班": 0,
      "临时人员": 0,
      group: {
        "土建施工班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "基础施工班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "安装施工班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "技工施工班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "特种作业班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "装修施工班": {
          0: 0,
          1: 1,
          "all": 0
        },
        "项目经理部": {
          0: 0,
          1: 1,
          "all": 0
        }
      }
    }, // 项目人员统计
    projectGatePerson: {},
    projectPersonInoutList: [], // 人员进出清单
    projectPersonNowInList: [], // 人员进清单
    projectPersonInDay: [], // 人员进清单
    personInfoDialog: { //personInfo窗口
      refresh: 0,
      show: false,
      data: {}
    },
    personInOutDetailDialog: { //person inout detail窗口
      refresh: 0,
      show: false,
      data: {}
    },
    personQuitLeftDialog: { //person辞退、辞职窗口
      refresh: 0,
      show: false,
      data: {}
    },
    worktimeFullCalendarDialog: { // 人员上工日历dialog
      refresh: 0,
      show: false,
      data: {},
      dialogTitle: '上工时间'
    },
    taskInfoDialog:{//任务大厅，任务详情
      refresh: 0,
      show: false,
      data: {}
    },
    personInoutDialog: { //person进出窗口
      show: false,
      data: {}
    },
    personListDialog: { //person管理窗口
      show: false,
      data: {}
    },
    personListChanged: 0, // 数据发生变化
    personInfoChanged: 0, // 数据发生变化
    personNowinDialog: { //person在场内窗口
      show: false,
      data: {}
    },
    personNowinChanged: 0, // 数据发生变化
    personFullCalenderDialog: { //person日历窗口
      show: false,
      data: {}
    },
    personFacePercentDialog: { //识别率相信信息
      refresh: 0,
      show: false,
      data: {}
    },
    personInOutPercentDialog: { //人员考勤person 窗口
      refresh: 0,
      show: false,
      data: {}
    }
  },
  mutations: {
    SET_PROJECT_INFO: (state, data) => {
      const __PROJECT_ID = Cookies.get('PROJECT_ID')
      const projects = data.project
      state.project_list = projects
      let initProjectID = 0
      let initProjectName = ''

      projects.forEach(project => {
        // console.log("__PROJECT_ID", __PROJECT_ID, project.project_id)
        // console.log("project", project)
        state.project_option.push({
          value: project.project_id,
          label: project.project_name,
        })
        if (__PROJECT_ID !== undefined && __PROJECT_ID.toString() === project.project_id.toString()) {
          initProjectID = project.project_id
          initProjectName = project.project_name
        }
      })
      if (initProjectID !== 0) {
        state.project_id = initProjectID
        state.org_name = initProjectName
      } else if (projects.length > 0) {
        state.project_id = projects[0].project_id
        state.org_name = projects[0].org_name
        Cookies.set('PROJECT_ID', projects[0].project_id)
      }
      // console.log("state.project_option", state.project_option)
      // state.projectPersonList = data
    },
    // 设置人员列表
    SET_PROJECT_PERSON_LIST: (state, data) => {
      state.projectPersonList = data
    },
    // 用于识别率显示而回去的数据
    SET_PROJECT_PERSON_INFO_BY_FACE_PERCENT: (state, data) => {
      state.projectPersonInfoByFacePercent = data
    },
    SET_PROJECT_GROUP_LIST: (state, data) => {
      state.projectGroupList = data
    },
    SET_PROJECT_COUNT: (state, data) => {
      state.projectCount = data
    },
    SET_PROJECT_GATE_PERSON: (state, data) => {
      state.projectGatePerson = data
    },
    SET_PERSON_INFO_DIALOG: (state, data) => {
      // console.log('SET_PERSON_INFO_DIALOG', data)
      state.personInfoDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      if (data.opShow === undefined) {
        // 是否显示操作按钮
        state.personInfoDialog.opShow = false
      }
      state.personInfoDialog.refresh = genRandom(1, 1000)
    },
    SET_PERSON_INOUT_DETAIL_DIALOG: (state, data) => {
      // console.log('SET_PERSON_INOUT_DETAIL_DIALOG', data)
      state.personInOutDetailDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      if (data.opShow === undefined) {
        // 是否显示操作按钮
        state.personInOutDetailDialog.opShow = false
      }
      state.personInOutDetailDialog.refresh = genRandom(1, 1000)
    },
    SET_PERSON_QUIT_LEFT_DIALOG: (state, data) => {
      // console.log('SET_PERSON_QUIT_LEFT_DIALOG', data)
      state.personQuitLeftDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      // console.log('opShow', data.opShow)
      if (data.opShow === undefined) {
        // 是否显示操作按钮
        state.personQuitLeftDialog.opShow = false
      }
      state.personQuitLeftDialog.refresh = genRandom(1, 1000)
    },
    SET_WORKTIME_FULLCALENDAR_DIALOG: (state, data) => {
      // console.log('SET_WORKTIME_FULLCALENDAR_DIALOG', data)
      state.worktimeFullCalendarDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.worktimeFullCalendarDialog.dialogTitle = data.name + ' - 上工时间'
      state.worktimeFullCalendarDialog.refresh = genRandom(1, 1000)
      // console.log('SET_WORKTIME_FULLCALENDAR_DIALOG', data)

    },

    SET_INFO_DIALOG: async (state, data) => { // 任务大厅，任务详情
      state.taskInfoDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.taskInfoDialog.refresh = genRandom(1, 1000)
    },
    SET_RELEASE_DIALOG: async (state, data) => { //任务发布
      console.log("任务发布SetRelease")
    },


    SET_PERSON_INOUT_DIALOG: async (state, data) => { // 人员考勤
      if (data.show === true) {
        const _hasPermission = await hasPermissionToOperation({
          project_id: state.project_id,
          url: 'huamingce_admin'
        })
        // console.log("_hasPermission", _hasPermission)
        if (_hasPermission.result === true) {
          state.personInoutDialog = data
        }
      } else {
        state.personInoutDialog = data
      }
    },
     SET_PERSON_LIST_DIALOG: async (state, data) => { // 人员信息
      if (data.show === true) {
        const _hasPermission = await hasPermissionToOperation({
          project_id: state.project_id,
          url: 'huamingce_admin'
        })
        if (_hasPermission.result === true) {
          state.personListDialog = data
        }
      } else {
        state.personListDialog = data
      }
    },
    SET_CESHI_DIALOG: async (state, data) => { // 测试
      if (data.show === true) {
        const _hasPermission = await hasPermissionToOperation({
          project_id: state.project_id,
          url: 'huamingce_admin'
        })
        if (_hasPermission.result === true) {
          state.personListDialog = data
        }
      } else {
        state.personListDialog = data
      }
    },
    SET_PERSON_NOW_IN_DIALOG: async (state, data) => { // 场内人员
      //show:true false
      if (data.show === true) {
        const _hasPermission = await hasPermissionToOperation({
          project_id: state.project_id,
          url: 'changneiyuanyuan_admin'
        })
        // console.log("_hasPermission", _hasPermission)
        if (_hasPermission.result === true) {
          state.personNowinDialog = data
        }
      } else {
        state.personNowinDialog = data
      }

    },
    SET_PERSON_FULLCALENDER_DIALOG: async (state, data) => { // 日历窗口
      //show:true false
      // console.log('SET_PERSON_FULLCALENDER_DIALOG')

      if (data.show === true) {
        const _hasPermission = await hasPermissionToOperation({
          project_id: state.project_id,
          url: 'rili_admin'
        })
        // console.log("_hasPermission", _hasPermission)
        if (_hasPermission.result === true) {
          state.personFullCalenderDialog = data
        }
      } else {
        state.personFullCalenderDialog = data
      }


    },
    SET_PERSON_FACE_PERSON_DIALOG: (state, data) => {
      //show:true false
      console.log('SET_PERSON_FACE_PERSON_DIALOG')
      state.personFacePercentDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

      state.personFacePercentDialog.refresh = genRandom(1, 1000)
      // console.log('dasdasd', data)
    },

    SET_IN_OUT_PERSON_DIALOG: (state, data) => {
      //show:true false
      console.log('SET_IN_OUT_PERSON_DIALOG', data)
      state.personInOutPercentDialog = data
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;

      state.personInOutPercentDialog.refresh = genRandom(1, 1000)
      // console.log('dasdasd', data)
    },

    SET_PERSON_NOW_IS_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.personNowinChanged = genRandom(1, 1000)
    },
    SET_PERSON_LIST_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.personListChanged = genRandom(1, 1000)
    },
    SET_PERSON_INFO_CHANGED: (state) => {
      const genRandom = (min, max) => (Math.random() * (max - min + 1) | 0) + min;
      state.personInfoChanged = genRandom(1, 1000)
    },

    SET_PROJECT_PERSION_INOUT_LIST: (state, data) => {
      state.projectPersonInoutList = data
    },
    SET_PROJECT_PERSION_NOW_IN_LIST: (state, data) => {
      state.projectPersonNowInList = data
    },
    SET_PROJECT_PERSON_IN_DAY: (state, data) => {
      state.projectPersonInDay = data
    },


  },

  actions: {
    // 查询人员
    QueryProjectPerson({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPerson(param).then(response => {
          // commit('SET_PROJECT_PERSON_LIST', response.data)
          // console.log('responseresponse', response)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 查询项目组人员
    QueryProjectPersons({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPerson(param).then(response => {
          commit('SET_PROJECT_PERSON_LIST', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询入场识别率的人员
    QueryProjectPersonsByFacePercent({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPerson(param).then(response => {
          commit('SET_PROJECT_PERSON_INFO_BY_FACE_PERCENT', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 查询项目分组
    QueryProjectGroups({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectGroup(param).then(response => {
          const _data = response.data
          // console.log("_data", _data.group)
          let group_list = []
          if (_data.group !== undefined) {
            group_list = _data.group
          }
          // console.log("group_list", group_list)
          commit('SET_PROJECT_GROUP_LIST', _data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询项目分组
    QueryProjectCount({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectCount(param).then(response => {
          const _data = response.data
          commit('SET_PROJECT_COUNT', _data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询获取最新的进出person
    QueryProjectGatePerson({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectGatePerson(param).then(response => {
          const _data = response.data
          commit('SET_PROJECT_GATE_PERSON', _data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetPersonInfoDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_INFO_DIALOG', param)
        resolve()
      })
    },
    SetPersonInoutDetailDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_INOUT_DETAIL_DIALOG', param)
        resolve()
      })
    },
    SetPersonQuitLeftDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_QUIT_LEFT_DIALOG', param)
        resolve()
      })
    },
    SetWorktimeFullCalenderDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_WORKTIME_FULLCALENDAR_DIALOG', param)
        resolve()
      })
    },
    SetPersonInoutDialog({
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_INOUT_DIALOG', param)
        resolve()

      })
    },
    SetInfoDialog({
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        console.log(param)
        commit('SET_INFO_DIALOG', param)
        resolve()

      })
    },
    SetRelease({//发布任务
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        console.log("任务发布")
        console.log(param)
        commit('SET_RELEASE_DIALOG', param)
        resolve()

      })
    },
    SetPersonListDialog({
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('project_id111111', rootState.project.project_id)
        commit('SET_PERSON_LIST_DIALOG', param)
        resolve()

      })
    },
    ceshipro({
      commit,
      rootState
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('测试管理', rootState.project.project_id)
        commit('SET_CESHI_DIALOG', param)
        resolve()

      })
    },

    SetPersonNowInDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('param', param)
        commit('SET_PERSON_NOW_IN_DIALOG', param)
        resolve()

      })
    },

    // 日历窗口
    SetPersonFullCalenderDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        console.log('param', param)
        commit('SET_PERSON_FULLCALENDER_DIALOG', param)
        resolve()

      })
    },

    // 识别率窗口
    SetPersonFacePersonDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {

        commit('SET_PERSON_FACE_PERSON_DIALOG', param)
        // console.log('param123123', param)
        resolve()

      })
    },

    // 人员考勤person详细窗口
    SetInOutPersonDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {

        commit('SET_IN_OUT_PERSON_DIALOG', param)
        // console.log('param123123', param)
        resolve()

      })
    },

    SetPersonNowinChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_NOW_IS_CHANGED')
        resolve()
      })
    },
    SetPersonListChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_LIST_CHANGED')
        resolve()
      })
    },
    SetPersonInfoChanged({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_PERSON_INFO_CHANGED')
        resolve()
      })
    },
    // 查询项目进出人员列表
    QueryProjectPersonInout({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPersonInout(param).then(response => {
          // console.log('paramparamparam', param)
          const _data = response.data
          // console.log('_data_data_data', _data)
          commit('SET_PROJECT_PERSION_INOUT_LIST', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询项目场内人员列表
    QueryProjectPersonNowIn({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPersonInout(param).then(response => {
          const _data = response.data
          commit('SET_PROJECT_PERSION_NOW_IN_LIST', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询一段时间内用户在场天数
    QueryProjectPersonInDay({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPersonInDay(param).then(response => {
          const _data = response.data
          commit('SET_PROJECT_PERSON_IN_DAY', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 清场
    QueryProjectPersonGoOut({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectPersonGoOut(param).then(response => {
          const _data = response.data
          console.log('QueryProjectPersonGoOut', _data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置人证校验是否为本人
    queryLogsPersonComfirm({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryLogsPersonComfirm(param).then(response => {
          const _data = response.data
          // console.log('queryLogsPersonComfirm', _data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 进出车辆日志查询
    QueryVehicleGate({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryVehicleGate(param).then(response => {
          const _data = response.data
          // console.log('queryLogsPersonComfirm', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 设置人证校验是否为本人
    setProjectInfo({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        // console.log("paramparamparam", param)
        commit('SET_PROJECT_INFO', param)
      })
    },
    // 查询项目人员进出记录
    queryInOutDetail({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryInOutDetail(param).then(response => {
          const _data = response.data
          console.log('queryInOutDetail', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询项目人员进出记录
    queryPersonWorktime({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryPersonWorktime(param).then(response => {
          const _data = response.data
          console.log('queryPersonWorktime', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询项目人员进出记录
    queryProjectWorktime({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryProjectWorktime(param).then(response => {
          const _data = response.data
          // console.log('queryProjectWorktime', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 根据用户ID信息查询档案资料
    QueryPersonDatum({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryPersonDatum(param).then(response => {
          const _data = response.data
          // console.log('queryPersonDatum', _data)
          resolve(_data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetCardOpera({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        setCardOpera(param).then(response => {
          // const _data = response.data
          console.log('setCardOpera', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetQuitLeft({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        setQuitLeft(param).then(response => {
          // const _data = response.data
          console.log('setQuitLeft', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    QueryDutyWeek({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryDutyWeek(param).then(response => {
          // const _data = response.data
          console.log('queryDutyWeek', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    QueryDutyDay({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        queryDutyDay(param).then(response => {
          // const _data = response.data
          // console.log('queryDutyDay', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    UpdateDutyWeek({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        updateDutyWeek(param).then(response => {
          // const _data = response.data
          console.log('updateDutyWeek', response)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default project
