import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-list', { params })
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
    api.get('v1/isv/view?id=' + isvId)
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
    let apiUrl = 'v1/isv/'
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
    api.post('v1/isv/delete-data', params)
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
    api.get('v1/isv/get-pay-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setPayConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/isv/set-pay-config', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getPayChannelList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-pay-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function delPayChannel ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/del-pay-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function setStoreHardwareLink ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/isv/set-store-hardware-config', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getStoreHardwareLink ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-store-hardware-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
export function getHardwareList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-hardware-list', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getAllIsv ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-all-isv', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getIsvOpenChannel ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-isv-open-channel', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChannelConfig ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/isv/get-channel-config', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
