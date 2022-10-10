import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/order', { params })
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
    api.get('v1/order/view?id=' + id)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getCountData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/order/count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getPayCodeCountData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/order/pay-code-count', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function allotOperate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/allot-receiver/allot-order', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function queryOrder ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/query/do', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
