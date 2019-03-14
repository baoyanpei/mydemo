import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

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
      },
      {
        path: 'main1',
        component: () => import('@/views/main/index01'),
        name: 'Main1',
        meta: {
          title: 'main',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'main2',
        component: () => import('@/views/main/index02'),
        name: 'Main2',
        meta: {
          title: 'main2',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: 'main3',
        component: () => import('@/views/main/index03'),
        name: 'Main3',
        meta: {
          title: 'main3',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: '720yun01',
        component: () => import('@/views/720yun/index01'),
        name: '720yun01',
        meta: {
          title: '720yun01',
          icon: 'dashboard',
          noCache: true
        }
      },
      {
        path: '720yun02',
        component: () => import('@/views/720yun/index02'),
        name: '720yun02',
        meta: {
          title: '720yun02',
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
  {
    path: '/model3d',
    component: Layout,
    redirect: '/model3d/index',
    children: [{
      path: 'index',
      component: () => import('@/views/model3D/index'),
      name: 'model3d-index',
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
    path: '/glTF',
    component: Layout,
    redirect: '/glTF/test',
    children: [{
      path: 'test',
      component: () => import('@/views/glTF/test'),
      name: 'glTF-test',
      meta: {
        title: 'glTFTest',
        icon: 'building',
        noCache: true,
        requireAuth: false, // 是否需要信息验证
        CheckCode: 'glTF_test', // 权限Code,通过服务器验证
      }
    }]
  }
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