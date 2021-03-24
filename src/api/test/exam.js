import request from '@/utils/request'

export function deleteExamById(exam_id) {
  const params = {
    'Exam_id': exam_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

