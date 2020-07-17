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
    count:1,
    titlebox:[],
    leftshow:"none"
  },
  mutations:{
    planidchange(state,step){
        state.count=step
      },
    titleboxchange(state,step){
      state.titlebox=step
    },
    leftshowfnc(state){
      state.leftshow="have"
    },
    leftnoshowfnc(state){
       state.leftshow="none"
    }
  }
}
export default plantypeid;
