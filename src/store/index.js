import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import errorLog from './modules/errorLog'
import permission from './modules/permission'
import tagsView from './modules/tagsView'
import user from './modules/user'
import huiyi from './modules/huiyi'
import project from './modules/project' // 项目
import person from './modules/person' // person
import model3d from './modules/model3d' // person
import msg from './modules/msg' // person
import loT from './modules/loT' // 物联网
import datum from './modules/datum' // 物联网
import workflow from './modules/workflow' // 工作流
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
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
    workflow
  },
  getters
})

export default store
