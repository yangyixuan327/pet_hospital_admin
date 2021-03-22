import request from '@/utils/request'

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
