import request from '@/utils/request'

export function getStructureInfo(params) {
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
