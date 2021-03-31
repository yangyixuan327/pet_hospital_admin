import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function fetchCaseList() {
  return request_admin({
    url: '/admin/case',
    method: 'get'
  })
}

export function deleteCaseById(caseId) {
  const params = {
    'caseId': caseId
  }
  // todo 修改api
  return request_admin({
    url: '/admin/case',
    method: 'delete',
    params: params
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

export function getImageById(caseId, type) {
  let url = '/admin/case/' + caseId + '/'
  if (type === 'jieZhen') {
    url = url + 'consult'
  } else if (type === 'zhenDuan') {
    url = url + 'diag'
  } else if (type === 'zhiLiao') {
    url = url + 'therapy'
  }
  return request_admin({
    url: url,
    method: 'get'
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
