// import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getTestList(userId) {
  return request_admin({
    url: '/admin/test/exams/user/' + userId,
    method: 'get'
  })
}

export function getTestOption(userId) {
  return request_admin({
    url: '/exam/paper/user/' + userId,
    method: 'get'
  })
}
