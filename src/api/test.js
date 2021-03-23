import request from '@/utils/request'

export function deleteQuestionById(question_id) {
  const params = {
    'Question_id': question_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

