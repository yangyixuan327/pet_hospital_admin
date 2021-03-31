import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getStructureInfo(command) {
  if (command === 'section') {
    return request_admin({
      url: '/admin/structure/section',
      method: 'get'
    })
  } else if (command === 'medicine') {
    return request_admin({
      url: '/admin/structure/medicine',
      method: 'get'
    })
  } else if (command === 'fee') {
    return request_admin({
      url: '/admin/structure/fee',
      method: 'get'
    })
  } else if (command === 'examination') {
    return request_admin({
      url: '/admin/structure/examination',
      method: 'get'
    })
  } else if (command === 'vaccine') {
    return request_admin({
      url: '/admin/structure/vaccine',
      method: 'get'
    })
  } else if (command === 'hospitalize') {
    return request_admin({
      url: '/admin/structure/hospitalize',
      method: 'get'
    })
  }
}

export function getImageById(section_id) {
  const params = {
    'section_id': section_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteSectionById(section_id) {
  const params = {
    'section_id': section_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteMedicineById(medicine_id) {
  const params = {
    'medicine_id': medicine_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteFeeById(fee_id) {
  const params = {
    'fee_id': fee_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteExamById(exam_id) {
  const params = {
    'exam_id': exam_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteVacById(vac_id) {
  const params = {
    'vac_id': vac_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function deleteHosById(hos_id) {
  const params = {
    'hos_id': hos_id
  }
  // todo 修改api
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}

export function submitSectionWordsDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加科室
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改科室
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

export function submitMedicineDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

export function submitFeeDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加收费项目
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改收费项目
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

export function submitExamDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

export function submitVacDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

export function submitHosDialogResult(params) {
  if (params.changeMode != null) {
    if (params.changeMode === 'add') {
      // 添加药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    } else {
      // 修改药品
      return request({
        url: '/vue-admin-template/table/list',
        method: 'get',
        params
      })
    }
  }
}

