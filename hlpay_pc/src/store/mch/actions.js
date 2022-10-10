import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getIsvData ({ commit }, isvId) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/view?id=' + isvId)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/mch/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deleteData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/mch/delete-data', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getApplyData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-apply-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getStoreData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-store-data', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPayCodeRateData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-pay-code-rate', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setPayCodeRateData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/mch/set-pay-code-rate', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAllMch ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-all-mch', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getMchChannel ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-mch-channel', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function setStoreRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/mch/set-store-relation', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getStoreRelation ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-store-relation', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getQrcodeConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/mch/get-qrcode-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
