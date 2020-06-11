import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'
import Layout2 from '@/views/layout/Layout2'
import Layout3 from '@/views/layout/Layout3'
/* Router Modules */
// import componentsRouter from './modules/components'
// import chartsRouter from './modules/charts'
// import tableRouter from './modules/table'
// import nestedRouter from './modules/nested'

/** note: submenu only apppear when children.length>=1
 *  detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 **/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [{
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/screen/:project_id?',
    name: 'screen',
    component: () => import('@/views/screen2/indexRed'),
    hidden: true
  },
  {
    path: '/screen3/:project_id?',
    name: 'screen3',
    component: () => import('@/views/screen3/index'),
    hidden: true
  },
  // {
  //   path: '/screen1',
  //   name: 'screen1',
  //   component: Layout,
  //   component: () => import('@/views/screen/indexGold'),
  //   hidden: true
  // },
  {
    path: '/wxbindtip',
    name: 'wxbindtip',
    component: () => import('@/views/login/wxbindTip'),
    hidden: true
  },
  {
    path: '/qrcode',
    name: 'qrcode',
    component: () => import('@/views/login/qrcode_r'),
    hidden: true
  },
  {
    path: '/authredirect',
    name: 'authredirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'main',
    children: [{
        path: 'main',
        component: () => import('@/views/main/index'),
        name: 'Main',
        meta: {
          title: 'main',
          icon: 'dashboard',
          noCache: true
        }
      }, {
        path: 'kqtj',
        component: () => import('@/views/worktime/index'),
        name: 'kqtj',
        meta: {
          title: 'kqtj',
          icon: 'dashboard',
          noCache: true
        }
      }, {
        path: 'task',
        component: () => import('@/views/task/index'),
        name: 'task',
        meta: {
          title: 'task',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'safety-inspection',
        component: () => import('@/views/safety/rixunjian'),
        name: 'safety-inspection',
        meta: {
          title: 'safety-inspection',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'xjgl',
        component: () => import('@/views/safety/index'),
        name: 'xjgl',
        meta: {
          title: 'xjgl',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'elebox',
        component: () => import('@/views/safety/electricbox'),
        name: 'elebox',
        meta: {
          title: 'elebox',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'ercode',
        component: () => import('@/views/safety/ercode'),
        name: 'ercode',
        meta: {
          title: 'ercode',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'carstatistical',
        component: () => import('@/views/carstatistical/index'),
        name: 'carstatistical',
        meta: {
          title: 'carstatistical',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'tjfx',
        component: () => import('@/views/tjfx/index'),
        name: 'tjfx',
        meta: {
          title: 'tjfx',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'gztz',
        component: () => import('@/views/gztz/index'),
        name: 'gztz',
        meta: {
          title: 'gztz',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'gzbsz',
        component: () => import('@/views/gzb/index'),
        name: 'gzbsz',
        meta: {
          title: 'gzbsz',
          icon: 'dashboard',
          noCache: true
        }
      }
    ]
  },
  {
    path: '/tongxunlu',
    component: Layout,
    redirect: '/tongxunlu/index',
    children: [{
      path: 'index',
      component: () => import('@/views/tongxunlu/index'),
      name: 'TongXunLu',
      meta: {
        title: 'tongxunlu',
        icon: 'dashboard',
        noCache: true,
        requireAuth: true, // 是否需要信息验证
        CheckCode: 'tongxunlu_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  // {
  //   path: '/lot',
  //   name: 'lot',
  //   component: Layout,
  //   redirect: '/loT/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/loT/index'),
  //     name: 'lot-index',
  //     meta: {
  //       title: '物联网',
  //       icon: 'building',
  //       noCache: true,
  //       requireAuth: false, // 是否需要信息验证
  //       CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
  //     }
  //   }]
  // },
  // {
  //   path: '/lot2',
  //   name: 'lot2',
  //   component: Layout,
  //   redirect: '/loT2/index',
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/loT/index2'),
  //     name: 'lot2-index',
  //     meta: {
  //       title: '物联网',
  //       icon: 'building',
  //       noCache: true,
  //       requireAuth: false, // 是否需要信息验证
  //       CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
  //     }
  //   }]
  // },
  {
    path: '/lot3',
    name: 'lot3',
    component: Layout,
    redirect: '/loT3/index',
    children: [{
      path: 'index',
      component: () => import('@/views/loT3/index'),
      name: 'lot3-index',
      meta: {
        title: '物联网V3',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/lot4',
    name: 'lot4',
    component: Layout,
    redirect: '/loT4/index',
    children: [{
      path: 'index',
      component: () => import('@/views/loT4/index'),
      name: 'lot4-index',
      meta: {
        title: '物联网V4',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/lot5', // 此版本为模型从bim2轻量化平台获取
    name: 'lot5',
    component: Layout,
    redirect: '/loT5/index',
    children: [{
      path: 'index',
      component: () => import('@/views/loT5/index'),
      name: 'lot5-index',
      meta: {
        title: '物联网V5',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/modelSelect',
    name: 'modelSelect',
    component: Layout,
    redirect: '/modelSelect/index',
    children: [{
      path: 'index',
      component: () => import('@/views/modelSelect/index'),
      name: 'model-select-index',
      meta: {
        title: '选择建筑',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/modelDisplay',
    name: 'modelDisplay',
    component: Layout2,
    redirect: '/modelDisplay/index',
    children: [{
      path: 'index/:pid?/:flist?', //pid:projectid,flist:floorlist
      component: () => import('@/views/modelDisplay/index'),
      name: 'modelDisplay-index',
      meta: {
        title: 'BIM模型',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/modelLotSetting',
    name: 'modelLotSetting',
    component: Layout2,
    redirect: '/modelLotSetting/index',
    children: [{
      path: 'index/:pid?/:flist?', //pid:projectid,flist:floorlist
      component: () => import('@/views/modelDisplay/lotSetting'),
      name: 'model-lot-setting',
      meta: {
        title: 'BIM模型 物联网设置',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/lotPVSetting',
    name: 'lotPVSetting',
    component: Layout2,
    redirect: '/lotPVSetting/index',
    children: [{
      path: 'index/:pid?/:flist?', //pid:projectid,flist:floorlist
      component: () => import('@/views/modelDisplay/lotPVSetting'),
      name: 'model-lot-setting',
      meta: {
        title: '物联网用的模型视点设置',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/cesiumSelect',
    name: 'cesiumSelect',
    component: Layout,
    redirect: '/cesiumSelect/index',
    children: [{
      path: 'index',
      component: () => import('@/views/cesiumSelect/index'),
      name: 'cesium-select-index',
      meta: {
        title: '选择倾斜摄影',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/cadSelect',
    name: 'cadSelect',
    component: Layout,
    redirect: '/cadSelect/index',
    children: [{
      path: 'index',
      component: () => import('@/views/cadSelect/index'),
      name: 'cad-select-index',
      meta: {
        title: '选择CAD',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/sketchupSelect',
    name: 'sketchupSelect',
    component: Layout,
    redirect: '/sketchupSelect/index',
    children: [{
      path: 'index',
      component: () => import('@/views/sketchupSelect/index'),
      name: 'sketchup-select-index',
      meta: {
        title: '选择sketchup',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
      }
    }]
  },
  {
    path: '/xcx',
    name: 'xcx',
    component: Layout3,
    children: [{
        path: 'pvshow',
        component: () => import('@/views/pointView/xcxShow'),
        name: 'xcx-pointview-show',
        meta: {
          title: 'BIM模型视点查看(小程序)',
          icon: 'building',
          noCache: true,
          requireAuth: false, // 是否需要信息验证
          // CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
        }
      },
      {
        path: 'model',
        component: () => import('@/views/modelDisplay/xcx'),
        name: 'xcx-model-display',
        meta: {
          title: 'BIM模型查看(小程序)',
          icon: 'building',
          noCache: true,
          requireAuth: false, // 是否需要信息验证
          // CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
        }
      },
      {
        path: 'cesium',
        component: () => import('@/views/cesiumDisplay/xcx'),
        name: 'xcx-cesium-display',
        meta: {
          title: '倾斜摄影查看(小程序)',
          icon: 'building',
          noCache: true,
          requireAuth: false, // 是否需要信息验证
          // CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
        }
      },
      {
        path: 'cad',
        component: () => import('@/views/cadDisplay/xcx'),
        name: 'xcx-cad-display',
        meta: {
          title: 'CAD查看(小程序)',
          icon: 'building',
          noCache: true,
          requireAuth: false, // 是否需要信息验证
          // CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
        }
      },
      {
        path: 'sketchup',
        component: () => import('@/views/sketchupDisplay/xcx'),
        name: 'xcx-sketchup-display',
        meta: {
          title: 'sketchup查看(小程序)',
          icon: 'building',
          noCache: true,
          requireAuth: false, // 是否需要信息验证
          // CheckCode: 'model3d_index_admin', // 权限Code,通过服务器验证
        }
      },
    ]
  },


]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/index',
  //   alwaysShow: true, // will always show the root menu
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ['admin', 'editor'] // you can set roles in root nav
  //   },
  //   children: [{
  //       path: 'page',
  //       component: () => import('@/views/permission/page'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['admin'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import('@/views/permission/directive'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission'
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     }
  //   ]
  // },

  // {
  //   path: '/icon',
  //   component: Layout,
  //   children: [{
  //     path: 'index',
  //     component: () => import('@/views/svg-icons/index'),
  //     name: 'Icons',
  //     meta: {
  //       title: 'icons',
  //       icon: 'icon',
  //       noCache: true
  //     }
  //   }]
  // },

  /** When your routing table is too long, you can split it into small modules**/
  // componentsRouter,
  // chartsRouter,
  // nestedRouter,
  // tableRouter,

  {
    path: '/error',
    component: Layout,
    redirect: 'noredirect',
    name: 'ErrorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [{
        path: '401',
        component: () => import('@/views/errorPage/401'),
        name: 'Page401',
        meta: {
          title: 'page401',
          noCache: true
        }
      },
      {
        path: '404',
        component: () => import('@/views/errorPage/404'),
        name: 'Page404',
        meta: {
          title: 'page404',
          noCache: true
        }
      }
    ]
  },

  {
    path: '/error-log',
    component: Layout,
    redirect: 'noredirect',
    children: [{
      path: 'log',
      component: () => import('@/views/errorLog/index'),
      name: 'ErrorLog',
      meta: {
        title: 'errorLog',
        icon: 'bug'
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
