import request from '@/utils/request'
import request_admin from "@/utils/request_admin";

export function getQuestionList() {
  return request_admin({
    url: '/admin/test/question',
    method: 'get',
    params: null
  })
}

export function changeQuestionById(question_id, question) {
  return request_admin({
    url: '/admin/test/question/' + question_id,
    method: 'post',
    data: question
  })
}

export function addQuestion(question) {
  return request_admin({
    url: 'admin/test/question',
    method: 'put',
    data: question
  })
}
export function deleteQuestionById(question_id) {
  return request_admin({
    url: '/admin/test/question',
    method: 'delete',
    params: question_id
  })
}

export function submitWordsDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加病例
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改病例
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}
