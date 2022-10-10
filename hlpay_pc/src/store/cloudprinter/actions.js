import { api } from 'src/boot/axios'

export function getData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/cloud-printer', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, itemId) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/cloud-printer/view?id=' + itemId)
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
    let apiUrl = 'v1/cloud-printer/'
    apiUrl +=
      parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
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

export function delData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/cloud-printer/delete?id='
    apiUrl += item
    api
      .delete(apiUrl, item)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getDataList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/cloud-printer/lists', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function saveTemplate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/cloud-printer/save-template', params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getTemplate ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/cloud-printer/get-template', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function sendTest ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/cloud-printer/send-test', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
