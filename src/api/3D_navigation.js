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










