import request_admin from '@/utils/request_admin'

export function getAllPapers() {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'get',
    params: null
  })
}

export function addNewPaper(paper) {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'put',
    params: paper
  })
}

export function changePaperName(paperId, paperName) {
  return request_admin({
    url: '/admin/structure/examination/' + paperId,
    method: 'post',
    data: paperName
  })
}

export function deletePaperById(paperId) {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'delete',
    params: paperId
  })
}

export function getPaperQuestionsById(paperId) {
  return request_admin({
    url: '/admin/test/question/searchByTestOption',
    method: 'get',
    params: {
      testOptionId: paperId
    }
  })
}

export function addQuestionToPaper(paperId, quesIds) {
  return request_admin({
    url: '/admin/test/paper/' + paperId + '/addQues',
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

