import { api } from 'src/boot/axios'

export function getData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/settings')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}

export function setData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v3/settings/'
    apiUrl += parseInt(item.id) > 0 ? 'update?id=' + parseInt(item.id) : 'create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function addPrefix ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/settings/addprefix', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getPrefixData ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.get('v3/settings/prefix')
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function addSet ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/settings/addset', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getConsumeSet ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/settings/consumeset', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getIndexCount ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/settings/count', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getErpSet ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/settings/get-erp-set', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function addErpSet ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api.post('v3/settings/add-erp-set', item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
export function getParams ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v3/settings/get-params', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => { reject(error) })
  })
}
