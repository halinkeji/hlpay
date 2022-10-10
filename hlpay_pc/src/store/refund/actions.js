import { api } from 'src/boot/axios'

export function orderRefund ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/refund/do', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
