import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import errorLog from "./modules/errorLog";
import permission from "./modules/permission";
import tagsView from "./modules/tagsView";
import user from "./modules/user";
import huiyi from "./modules/huiyi";
import project from "./modules/project"; // 项目
import plantypeid from "./modules/plantypeid"; //计划id
import person from "./modules/person"; // person
import model3d from "./modules/model3d"; // person
import msg from "./modules/msg"; // person
import loT from "./modules/loT"; // 物联网
import datum from "./modules/datum"; // 物联网
import workflow from "./modules/workflow"; // 工作流
import bim from "./modules/bim"; // BIM
import viewPoint from "./modules/viewPoint"; // 视点
import bindBim from "./modules/bindBim"; // 绑定BIM
import health from "./modules/health"; // 健康信息
import tools from "./modules/tools"; // tools
import getters from "./getters";
import componentLibrary from "./modules/componentLibrary";
import device from "./modules/device"; // 物联网设备
import logs from "./modules/logs"; // 物联网
import plan from "./modules/plan"; // 计划

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    plantypeid,
    errorLog,
    permission,
    tagsView,
    user,
    huiyi,
    project,
    person,
    model3d,
    msg,
    loT,
    datum,
    workflow,
    bim,
    viewPoint,
    bindBim,
    health,
    tools,
    componentLibrary,
    device,
    logs,
    plan
  },
  getters
});

export default store;
