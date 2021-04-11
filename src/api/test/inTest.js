// import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getQuestionList() {
  // to do: 修改requst_admin
  return request_admin({
    url: '/admin/test/question',
    method: 'get',
    params: null
  })
}
