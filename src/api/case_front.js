import request_admin from '@/utils/request_admin'

export function fetchCaseJieZhen(caseId) {
  return request_admin({
    url: '/admin/case/' + caseId + '/consult',
    method: 'get'
  })
}

export function fetchCaseZhenDuan(caseId) {
  return request_admin({
    url: '/admin/case/' + caseId + '/diag',
    method: 'get'
  })
}

export function fetchCaseZhiLiao(caseId) {
  return request_admin({
    url: '/admin/case/' + caseId + '/therapy',
    method: 'get'
  })
}

export function fetchCaseBySearch(searchText) {
  return request_admin({
    url: '/admin/case/search',
    method: 'get',
    params: {
      searchParam: searchText
    }
  })
}

export function fetchCaseByType(type) {
  return request_admin({
    url: '/admin/case/tag/' + type,
    method: 'get',
  })
}
