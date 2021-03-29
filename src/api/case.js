import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function fetchCaseList() {
  return request_admin({
    url: '/admin/case',
    method: 'get',
    params: null
  })
}

export function deleteCaseById(case_id) {
  const params = {
    'case_id': case_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getVideoById(case_id) {
  const params = {
    'case_id': case_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function getImageById(case_id) {
  const params = {
    'case_id': case_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function submitWordsDialogResult(params) {
  console.log(params)
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加病例
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改病例
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}
