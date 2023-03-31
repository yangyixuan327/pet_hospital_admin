import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'el-icon-s-home' }
    }]
  }
]

// 异步挂载的路由
// 动态需要根据权限加载的路由表
export const asyncRoutes = [
  {
    path: '/user_manage',
    component: Layout,
    name: 'UserManage',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'UserManageIndex',
        component: () => import('@/views/manage-user/index'),
        meta: {
          title: '用户管理',
          icon: 'user'
        }
      }
    ]
  },
  {
    path: '/test_manage',
    component: Layout,
    name: 'TestManage',
    meta: {
      title: '测试管理',
      icon: 'form',
      roles: ['admin']
    },
    children: [
      {
        path: 'question_manage',
        name: 'QuestionManage',
        component: () => import('@/views/manage-test/manage-question/index'),
        meta: { title: '试题管理' }
      },
      {
        path: 'paper_manage',
        name: 'PaperManage',
        component: () => import('@/views/manage-test/manage-paper/index'),
        meta: { title: '试卷管理' }
      },
      {
        path: 'select_questions',
        name: 'SelectQuestions',
        component: () => import('@/views/manage-test/manage-paper/selectQuestions'),
        meta: { title: '配置试卷题目' },
        hidden: true
      },
      {
        path: 'exam_manage',
        name: 'ExamManage',
        component: () => import('@/views/manage-test/manage-exam/index'),
        meta: { title: '考试管理' }
      }
    ]
  },
  {
    path: '/case_manage',
    component: Layout,
    name: 'CaseManage',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'CaseManageIndex',
        component: () => import('@/views/manage-case/index'),
        meta: { title: '病例管理', icon: 'el-icon-s-management' }
      }
    ]
  },
  {
    path: '/structure_manage',
    component: Layout,
    name: 'StructureManage',
    meta: {
      roles: ['admin']
    },
    children: [
      {
        path: 'index',
        name: 'StructureManageIndex',
        component: () => import('@/views/manage-structure/index'),
        meta: { title: '结构管理', icon: 'tree' }
      }
    ]
  },
  {
    path: '/test_user',
    component: Layout,
    name: 'TestUser',
    meta: { title: '进行考试', icon: 'el-icon-document-checked', roles: ['user'] },
    children: [
      {
        path: 'take_test',
        name: 'TakeTest',
        component: () => import('@/views/user-test/user-takeTest/index'),
        meta: { title: '参加考试' }
      },
      {
        path: 'check_result',
        name: 'CheckResult',
        component: () => import('@/views/user-test/user-checkResult/index'),
        meta: { title: '查看结果' }
      }
    ]
  },
  {
    path: '/test_user/inTest',
    component: () => import('@/views/user-test/user-takeTest/inTest')
  },
  {
    path: '/test_manage/exam_manage/pick_user',
    component: () => import('@/views/manage-test/manage-exam/pickUser')
  },
  {
    path: '/case_front',
    component: Layout,
    name: 'CaseFront',
    redirect: '/case_front',
    meta: { title: '病例学习', icon: 'el-icon-first-aid-kit' ,roles: ['user']},
    children: [
      {
        path: 'index',
        name: 'CaseFrontInner',
        component: () => import('@/views/front-case/index'),
        meta: { title: '病例学习', breadcrumb: false }
      },
      {
        path: 'detail/caseId/:caseId',
        name: 'CaseDetailInner',
        component: () => import('@/views/front-case/detail'),
        meta: { title: '病例详情', breadcrumb: true },
        hidden: true
      }
    ]
  },
  {
    path: '/hospital_navigation',
    component: Layout,
    name: 'HospitalNavigation',
    redirect: '/hospital_navigation/index',
    meta: { roles: ['user']},
    children: [
      {
        path: 'index',
        name: 'HospitalNavigationIndex',
        component: () => import('@/views/hospital_navigation/index'),
        meta: { title: '3D医院导览',icon:"el-icon-guide" }
      }
    ]
  },
  // 404一定要放在最后!
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
