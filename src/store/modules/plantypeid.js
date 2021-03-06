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
} from "@/api/person";
import Cookies from "js-cookie";
import hasPermissionToOperation from "@/utils/permissionUrl"; // 权限判断函数
const plantypeid = {
  state: {
    count: 1,
    titlebox: [],
    leftshow: "none",
    fatherid: 0,
    newplanshow: false,
    sonplanid: 0,
    planindexfirstname: ""
  },
  mutations: {
    planidchange(state, step) {
      console.log("stepstepstep", step);
      state.count = step;
    },
    sonplanchange(state, step) {
      state.sonplanid = step;
    },
    titleboxchange(state, step) {
      state.titlebox = step;
    },
    leftshowfnc(state) {
      state.leftshow = "have";
    },
    leftnoshowfnc(state) {
      state.leftshow = "none";
    },
    fatheridchange(state, step) {
      state.fatherid = step;
    },
    newplanshowchange(state, step) {
      state.newplanshow = true;
    },
    newplanshowchangefasle(state, step) {
      state.newplanshow = false;
    },
    planindexfirstnamefnc(state, step) {
      state.planindexfirstname = step;
    }
  }
};
export default plantypeid;
