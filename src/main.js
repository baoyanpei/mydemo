import Vue from "vue";

import VueWorker from "vue-worker";
import "./directives.js"; //窗口拖動
import "normalize.css/normalize.css"; // A modern alternative to CSS resets

import Element from "element-ui";
import "element-ui/lib/theme-chalk/index.css";

import "@/styles/index.scss"; // global css

import App from "./App";
import router from "./router";
import store from "./store";

import i18n from "./lang"; // Internationalization
import "./icons"; // icon
import "./errorLog"; // error log
import "./permission"; // permission control
// import './mock' // simulation data
// 在不关心打包体积时一次引入全部图标
import "vue-awesome/icons";
import Icon from "vue-awesome/components/Icon";
import hasPermissionToOperation from "@/utils/permissionUrl"; // 权限判断函数
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import ECharts from "vue-echarts/components/ECharts";

import "echarts";
import "echarts/theme/infographic";

import VueClipboard from "vue-clipboard2";

// 百度地图
import BaiduMap from "vue-baidu-map";
Vue.use(BaiduMap, {
  ak: "Ck9tcoakuY1GT18k7KONFBl6I5a2tGX9"
});
// 拖拽弹窗
import elDragDialog from "./directive/el-dragDialog/index";

Vue.use(elDragDialog);

import "../node_modules/timeline-vuejs/dist/timeline-vuejs.css";

import {
  faUser,
  faCoffee,
  faUserSecret,
  faCalendarAlt,
  faBookOpen,
  faAddressCard,
  faCalendarCheck,
  faCalendarPlus,
  faStreetView,
  faListAlt,
  faQrcode,
  faChartBar,
  faMobileAlt,
  faHome,
  faChartLine,
  faUserCog,
  faDesktop,
  faNetworkWired,
  faMagic,
  faCrosshairs,
  faLongArrowAltUp,
  faSignature,
  faFont,
  faSyncAlt,
  faLayerGroup,
  faMarker,
  faMapMarked,
  faClipboardCheck,
  faTimesCircle,
  faStethoscope,
  faTrashAlt,
  faSearchLocation,
  faArrowsAlt,
  faLightbulb,
  faShareSquare,
  faTv,
  faPaperclip
} from "@fortawesome/free-solid-svg-icons";

import {
  faCircle,
  faSquare,
  faSave,
  faPlusSquare,
  faBell
} from "@fortawesome/free-regular-svg-icons";

// 图标来源
// https://fontawesome.com/icons?d=gallery&s=solid&m=free
library.add(
  faQrcode,
  faTrashAlt,
  faLightbulb,
  faTv,
  faPaperclip,
  faDesktop,
  faShareSquare,
  faMagic,
  faArrowsAlt,
  faSearchLocation,
  faTimesCircle,
  faStethoscope,
  faBell,
  faCircle,
  faPlusSquare,
  faSquare,
  faMapMarked,
  faClipboardCheck,
  faLongArrowAltUp,
  faSignature,
  faSyncAlt,
  faLayerGroup,
  faMarker,
  faFont,
  faSave,
  faNetworkWired,
  faCalendarCheck,
  faUser,
  faCrosshairs,
  faHome,
  faUserCog,
  faChartLine,
  faChartBar,
  faMobileAlt,
  faCoffee,
  faUserSecret,
  faCalendarAlt,
  faBookOpen,
  faAddressCard,
  faCalendarCheck,
  faCalendarPlus,
  faStreetView,
  faListAlt
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("icon", Icon);
Vue.use(VueWorker);
Vue.component("echart", ECharts);
import FullCalendar from "vue-full-calendar";
Vue.use(FullCalendar);
import "fullcalendar/dist/fullcalendar.css";
// import VueDragResize from 'vue-drag-resize'

// Vue.component('vue-drag-resize', VueDragResize)

import * as filters from "./filters"; // global filters
Vue.use(VueClipboard);
Vue.use(Element, {
  size: "medium", // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
});

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

router.beforeEach(async (to, from, next) => {
  console.log("to, from 123", to, from, to.query);

  if (to.meta.requireAuth) {
    // console.log("to.meta.requireAuth", to.meta.requireAuth, to.meta.CheckCode)
    // console.log("TongXunLu", store.state.project.project_id)
    const _hasPermission = await hasPermissionToOperation({
      project_id: store.state.project.project_id,
      url: to.meta.CheckCode
    });
    if (_hasPermission.result === true) {
      next();
    } else {
      if (from.name === null) {
        // 如果来源为直接刷新
        window.location.href = "/";
      }
    }
    // console.log("_hasPermission_hasPermission", _hasPermission.result)
  } else {
    next();
  }
  // next()
  //判断是否需要登录拦截

  if (to.name === "TongXunLu") {
  } else {
  }
});

new Vue({
  el: "#app",
  router,
  store,
  i18n,
  render: h => h(App)
});
