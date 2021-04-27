import request_admin from '@/utils/request_admin'

export function getAllPapers() {
  return request_admin({
    url: '/admin/test/problemSet',
    method: 'get',
    params: null
  })
}

export function addNewPaper(paperName) {
  return request_admin({
    url: '/admin/test/problemSet',
    method: 'put',
    params: paperName
  })
}

export function changePaperName(paperId, paperName) {
  return request_admin({
    url: '/admin/test/problemSet/' + paperId,
    method: 'post',
    params: paperName
  })
}

export function deletePaperById(paperId) {
  return request_admin({
    url: '/admin/test/problemSet',
    method: 'delete',
    params: paperId
  })
}

export function getPaperQuestionsById(paperId) {
  return request_admin({
    url: '/admin/test/problemSet/' + paperId,
    method: 'get',
    params: null
  })
}

export function addQuestionToPaper(paperId, quesIds) {
  return request_admin({
    url: '/admin/test/problemSet/' + paperId + '/addQues',
    method: 'put',
    data: quesIds
  })
}

export function fetchQuesByUnionSearch(searchText) {
  return request_admin({
    url: '/admin/test/question/search',
    method: 'post',
    data: searchText
  })
}

