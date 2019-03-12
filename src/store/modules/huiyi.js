import {
  huiyiSubmit,
  planTypeQuery,
  planQuery
} from '@/api/huiyi'

const huiyi = {
  state: {
    planType: [], // 计划类型
    planList: [], // 计划列表
    planListChange: 0, // 计划列表发生了变化
    planDetail: null, // 当前查询的计划详情数据
    planDetailChange: 0, // 当前查询的计划详情数据发生了变化
    showHuiyiFullCalendar: false // 是否显示计划日历窗口
  },
  mutations: {
    // 设置计划类型
    SET_PLAN_TYPE: (state, data) => {
      state.planType = data
    },
    // 设置计划列表数据
    SET_PLAN_LIST: (state, data) => {
      state.planList = data
    },
    // 设置当前的计划详情数据
    SET_PLAN_DETAIL: (state, data) => {
      state.planDetailChange++ // 当前查询的计划详情数据发生了变化
      state.planDetail = data[0]
    },
    // 设置计划列表已经发生变化
    SET_PLAN_LIST_CHANGE: (state) => {
      state.planListChange++ // 计划列表发生了变化
    },
    SET_SHOW_RILI_FULLCALENDER: (state, is_show) => {
      state.showHuiyiFullCalendar = is_show
    }
  },

  actions: {
    // 用户名登录
    HuiYiSubmit({
      commit
    }, huiyiInfo) {
      console.log('store huiyi', huiyiInfo)
      return new Promise((resolve, reject) => {
        huiyiSubmit(huiyiInfo).then(response => {
          commit('SET_PLAN_LIST_CHANGE')
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 查询计划类型
    PlanTypeQuery({
      commit
    }, {}) {
      return new Promise((resolve, reject) => {
        planTypeQuery().then(response => {
          commit('SET_PLAN_TYPE', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //查询计划列表
    PlanListQuery({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        planQuery(param).then(response => {
          console.log("SET_PLAN_LIST", response.data)
          commit('SET_PLAN_LIST', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //查询某一个计划
    PlanDetailQuery({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        planQuery(param).then(response => {
          // console.log("SET_PLAN_DETAIL", response.data)
          commit('SET_PLAN_DETAIL', response.data)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    SetHuiyiFullCalendarDialog({
      commit
    }, param) {
      return new Promise((resolve, reject) => {
        commit('SET_SHOW_RILI_FULLCALENDER', param.isShow)
        resolve()
      })
    }

  }
}

export default huiyi
