import request from '@/utils/request'
import request_admin from "@/utils/request_admin";
export function getAllUser() {
  return request_admin({
    url: '/admin/user/getAll',
    method: 'get',
    params: null
  })
}

export function addUserToOption(testOptionId, userIds) {
  return request_admin({
    url: '/admin/test/paper/' + testOptionId + '/addUser',
    method: 'put',
    data: userIds
  })
}

export function getAllPaper() {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'get',
    params: null
  })
}

export function getList() {
  return request_admin({
    url: '/admin/test/paper',
    method: 'get',
    params: null
  })
}

export function pickUserBytestOptionId(testOptionId) {
  return request_admin({
    url: '/admin/test/paper/' + testOptionId + '/parUsers',
    method: 'get',
  })
}

export function getPaperIdByTestOptionId(testOptionId) {
  return request_admin({
    url: '/admin/test/paper/' + testOptionId,
    method: 'get'
  })
}

export function getExamListByTestOptionId(testOptionId) {
  return request_admin({
    url: '/admin/test/examByOption',
    method: 'get',
    params: {
      testOptionId: testOptionId
    }
  })
}

export function getPaperNameByPaperId(paper_id) {
  return request_admin({
    url: '/admin/structure/examination/' + paper_id,
    method: 'get'
  })
}

export function changePaperById(paper_id, paper) {
  return request_admin({
    url: '/admin/test/paper/' + paper_id,
    method: 'post',
    data: paper
  })
}

export function addPaper(paper) {
  return request_admin({
    url: 'admin/test/paper',
    method: 'put',
    data: paper
  })
}

export function deletePaperById(paper_id) {
  return request_admin({
    url: '/admin/test/paper',
    method: 'delete',
    params: paper_id
  })
}


export function submitWordsDialogResult(params) {
  console.log(params)
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
