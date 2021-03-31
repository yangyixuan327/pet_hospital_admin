import request from '@/utils/request'
import request_admin from "@/utils/request_admin";

export function getUserList() {
  return request_admin({
    url: '/admin/user/getNormal',
    method: 'get'

  })
}
export function getAdminList() {
  return request_admin({
    url: '/admin/user/getAdmins',
    method: 'get'

  })
}
export function getList() {
  return request_admin({
    url: '/admin/user/getAll',
    method: 'get'
  })
}
export function getUser(userId) {
  return request_admin({
    url: '/admin/user/getById',
    method: 'get',
    params: userId
  })
}
export function newUser(user) {
  return request_admin({
    url: '/admin/user/newUser',
    method: 'put',
    data: user //user
  })
}
export function updateUser(user) {
  return request_admin({
    url: '/admin/user/updateInfo',
    method: 'post',
    data: user // userId用于验证用户是否存在
  })
}
export function deleteUser(userId) {
  return request_admin({
    url: '/admin/user/delete',
    method: 'delete',
    params: userId
  })
}
export function changeRole(data) {
  return request_admin({
    url: '/admin/user/updateInfo',
    method: 'post',
    params: data // userId + role
  })
}
export function login(data) {
  return request({
    url: '/vue-admin-template/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
export function submitEditDialogResult(params) {
  console.log(params)
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加账户
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改账户
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}
