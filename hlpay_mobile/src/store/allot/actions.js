import { api } from 'boot/axios'

export function getAllotReceiverInfo ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/receiver-base-info?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setAllotReceiverInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/allot-receiver/set-receiver', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
