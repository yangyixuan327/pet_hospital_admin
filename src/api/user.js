import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/admin/user/getNormal',
    method: 'get'

  })
}
export function getAdminList() {
  return request({
    url: '/admin/user/getAdmins',
    method: 'get'

  })
}
export function getList() {
  return request({
    url: '/admin/user/getAll',
    method: 'get'
  })
}
export function getUser(data) {
  return request({
    url: '/admin/user/getById',
    method: 'get',
    data //userId
  })
}
export function newUser(data) {
  return request({
    url: '/admin/user/newUser',
    method: 'put',
    data //user
  })
}
export function updateUser(data) {
  return request({
    url: '/admin/user/updateInfo',
    method: 'post',
    data // userId用于验证用户是否存在
  })
}
export function deleteUser(data) {
  return request({
    url: '/admin/user/delete',
    method: 'delete',
    data // userId
  })
}
export function changeRole(data) {
  return request({
    url: '/admin/user/updateInfo',
    method: 'post',
    data // userId + role
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
