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

export function getImageById(sectionId) {
  return request_admin({
    url: '/admin/structure/section/' + sectionId,
    method: 'get'
  })
}

export function deleteSectionById(section_id) {
  return request_admin({
    url: '/admin/structure/section',
    method: 'delete',
    params: section_id
  })
}

export function deleteMedicineById(medicine_id) {
  return request_admin({
    url: '/admin/structure/medicine',
    method: 'delete',
    params: medicine_id
  })
}

export function deleteFeeById(fee_id) {
  return request_admin({
    url: '/admin/structure/fee',
    method: 'delete',
    params: fee_id
  })
}

export function deleteExamById(exam_id) {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'delete',
    params: exam_id
  })
}

export function deleteVacById(vac_id) {
  return request_admin({
    url: '/admin/structure/vaccine',
    method: 'delete',
    params: vac_id
  })
}

export function deleteHosById(hos_id) {
  return request_admin({
    url: '/admin/structure/hospitalize',
    method: 'delete',
    params: hos_id
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

export function updateSection(sectionId, params) {
  return request_admin({
    url: '/admin/structure/section/' + sectionId,
    method: 'post',
    data: params
  })
}

export function newSection(sectionName) {
  return request_admin({
    url: '/admin/structure/section',
    method: 'put',
    params: sectionName
  })
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

export function updateMedicine(medId, params) {
  return request_admin({
    url: '/admin/structure/medicine/' + medId,
    method: 'post',
    data: params
  })
}

export function newMedicine(medName, medDescrip) {
  return request_admin({
    url: '/admin/structure/medicine',
    method: 'put',
    params: { medName, medDescrip }
  })
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

export function updateFee(feeId, params) {
  return request_admin({
    url: '/admin/structure/fee/' + feeId,
    method: 'post',
    data: params
  })
}

export function newFee(feeName, feePrice, feeDescrip) {
  return request_admin({
    url: '/admin/structure/fee',
    method: 'put',
    params: { feeName, feePrice, feeDescrip }
  })
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

export function updateExam(examId, params) {
  return request_admin({
    url: '/admin/structure/examination/' + examId,
    method: 'post',
    data: params
  })
}

export function newExam(examName, examDescrip) {
  return request_admin({
    url: '/admin/structure/examination',
    method: 'put',
    params: { examName, examDescrip }
  })
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

export function updateVaccine(vacId, params) {
  return request_admin({
    url: '/admin/structure/vaccine/' + vacId,
    method: 'post',
    data: params
  })
}

export function newVaccine(vacName, vacDescrip) {
  return request_admin({
    url: '/admin/structure/vaccine',
    method: 'put',
    params: { vacName, vacDescrip }
  })
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

export function updateHospitalize(hosId, params) {
  return request_admin({
    url: '/admin/structure/hospitalize/' + hosId,
    method: 'post',
    data: params
  })
}

export function newHospitalize(hosAnimalName, disease, inDate) {
  return request_admin({
    url: '/admin/structure/hospitalize',
    method: 'put',
    params: { hosAnimalName, disease, inDate }
  })
}
