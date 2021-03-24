import request from '@/utils/request'

export function deletePaperById(paper_id) {
  const params = {
    'Paper_id': paper_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

