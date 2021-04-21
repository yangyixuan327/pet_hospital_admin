// import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getTestOptionByUserId(user_id) {
  return request_admin({
    url: '/exam/paper/user/' + user_id,
    method: 'get'
  })
}

export function getQuestionList(testOptionId, userId) {
  return request_admin({
    url: '/exam/' + testOptionId + '/user/' + userId,
    method: 'put'
  })
}

export function submitAnswer(testId, params) {
  return request_admin({
    url: '/exam/' + testId + '/submit',
    method: 'post',
    data: params
  })
}
