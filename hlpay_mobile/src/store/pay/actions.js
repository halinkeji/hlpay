import { api } from 'boot/axios'

export function getStoreData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/name', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getUser ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/channel-user/oauth', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPayConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/pay/do', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function inquiryOrder ({ commit }, params) {
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

export function getChannel ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/mch-channel', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getClientChannel ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-client-channel', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
