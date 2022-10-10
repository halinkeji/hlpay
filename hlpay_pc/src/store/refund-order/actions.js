import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/refund-order', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getItemData ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/refund-order/view?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
