// import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getQuestionList(testOptionId, userId) {
  return request_admin({
    url: '/exam/' + testOptionId + '/user/' + userId,
    method: 'put'
  })
}

export function submitAnswer(testId, result) {
  return request_admin({
  //  to do: 对接后端
    url: '/exam/' + testId + '/submit',
    method: 'post',
    data: result
  })
}
