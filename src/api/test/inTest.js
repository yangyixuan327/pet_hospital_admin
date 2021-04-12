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

export function submitAnswer(params) {
  return request_admin({
  //  to do: 对接后端
  //   url: '/admin/structure/hospitalize/',
  //   method: 'post',
  //   data: params
  })
}
