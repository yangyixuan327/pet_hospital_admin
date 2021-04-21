import request from '@/utils/request'
import request_admin from '@/utils/request_admin'

export function getSectionsInfo() {
  return request_admin({
    url: '/admin/structure/section',
    method: 'get'
  })
}
export function getSectionInfo(sectionId) {
  return request_admin({
    url: '/admin/structure/section/' + sectionId,
    method: 'get'
  })
}

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








