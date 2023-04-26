import request_admin from '@/utils/request_admin'
import axios from 'axios'

export function fetchCaseList() {
  return request_admin({
    url: '/admin/case',
    method: 'get'
  })
}

export function deleteCaseById(caseId) {
  const params = {
    'caseId': caseId
  }
  // todo 修改api
  return request_admin({
    url: '/admin/case',
    method: 'delete',
    params: params
  })
}

export function getInfoByIdAndType(caseId, type) {
  let url = '/admin/case/' + caseId + '/'
  if (type === 'jieZhen') {
    url = url + 'consult'
  } else if (type === 'zhenDuan') {
    url = url + 'diag'
  } else if (type === 'zhiLiao') {
    url = url + 'therapy'
  }
  return request_admin({
    url: url,
    method: 'get'
  })
}

export function updateCaseWordsInfo(params) {
  const caseId = params.caseId
  // 修改病例名称
  const baseUrl = '/admin/case/'
  const caseName = request_admin({
    url: baseUrl + caseId,
    method: 'post',
    params: {
      caseName: params.caseName
    }
  })
  // 修改病例文字描述
  const caseDescriptions = request_admin({
    url: baseUrl + caseId + '/descrip',
    method: 'post',
    data: {
      consultDescrip: params.jieZhen,
      diagDescrip: params.zhenDuan,
      therapyDescrip: params.zhiLiao
    }
  })
  return axios.all([caseName, caseDescriptions])
}

export function addNewCase(params) {
  return request_admin({
    url: '/admin/case',
    method: 'put',
    params: {
      caseName: params.caseName,
      caseTag: params.caseTag
    }
  })
}

export function addNewCaseInfo(params) {
  const caseId = params.caseId
  const baseUrl = '/admin/case/'
  // 修改病例文字描述
  const jieZhen = request_admin({
    url: baseUrl + caseId + '/consult',
    method: 'put',
    params: {
      descrip: params.jieZhen
    }
  })
  const zhenDuan = request_admin({
    url: baseUrl + caseId + '/diag',
    method: 'put',
    params: {
      descrip: params.zhenDuan
    }
  })
  const zhiLiao = request_admin({
    url: baseUrl + caseId + '/therapy',
    method: 'put',
    params: {
      descrip: params.zhiLiao
    }
  })
  return axios.all([jieZhen, zhenDuan, zhiLiao])
}
