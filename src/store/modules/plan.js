import Cookies from "js-cookie";
import hasPermissionToOperation from "@/utils/permissionUrl"; // 权限判断函数

const plan = {
  state: {
    PlanTaskDialog: {
      // 计划任务
      refresh: 0,
      show: false,
      data: {}
    },
    PlanAddTaskSuccess: {
      refresh: 0,
      data: {}
    } // 数据发生变化
  },
  mutations: {
    SHOW_PLAN_TASK_DIALOG: (state, data) => {
      state.PlanTaskDialog = data;
      const genRandom = (min, max) =>
        ((Math.random() * (max - min + 1)) | 0) + min;
      state.PlanTaskDialog.refresh = genRandom(1, 1000);
    },
    SET_PLAN_ADD_TASK_SUCCESS: (state, data) => {
      state.PlanAddTaskSuccess = data;
      const genRandom = (min, max) =>
        ((Math.random() * (max - min + 1)) | 0) + min;
      state.PlanAddTaskSuccess.refresh = genRandom(1, 1000);
    }
  },
  actions: {
    ShowPlanTaskDialog({ commit }, param) {
      return new Promise((resolve, reject) => {
        commit("SHOW_PLAN_TASK_DIALOG", {
          ...param
        });
        resolve();
      });
    },
    SetPlanAddTaskSuccess({ commit }, param) {
      return new Promise((resolve, reject) => {
        commit("SET_PLAN_ADD_TASK_SUCCESS", param);
        resolve();
      });
    }
  }
};

export default plan;
