import {asyncRoutes, constantRoutes, userRoutes} from '@/router'
import { getRoutes} from "@/api/auth";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }
function hasPermission(roles, route) {
  if (route.meta && route.meta.role) {
    return roles.some(role => route.meta.role.indexOf(role) >= 0)
  } else {
    return false
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: constantRoutes,
  addRoutes: [],
  accessedRoutes:[]
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.accessedRoutes = state.routes
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let res = getRoutes()
      let accessedRoutes // 用于存放可以访问的路由
      if (roles.includes('admin')) { //判断当前角色是否包含admin
        accessedRoutes = res || [] //所有路由都可以被访问
      } else {
        accessedRoutes = userRoutes || []
      }
      //提交路由
      commit('SET_ROUTES', accessedRoutes)
      return accessedRoutes
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
