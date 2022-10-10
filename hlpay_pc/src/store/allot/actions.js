import { api } from 'src/boot/axios'

export function getListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/view?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function deteleGroup ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.post('v1/allot-manage/detele-group', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/allot-manage/'
    apiUrl += parseInt(params.groupId) > 0 ? 'update?id=' + parseInt(params.groupId) : 'create'
    const requestType = parseInt(params.groupId) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getReceiversListData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/receivers', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getReceiversItem ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/view-receiver?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function saveReceiversData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/allot-manage/'
    apiUrl += parseInt(params.receiversId) > 0 ? 'update-receiver?id=' + parseInt(params.receiversId) : 'create-receiver'
    const requestType = parseInt(params.receiversId) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, params)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function getChannelAndGroup ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/get-channel-and-group', { params })
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function deteleReceiver ({ commit }, id) {
  return new Promise((resolve, reject) => {
    api.delete('v1/allot-manage/detele-receiver?id=' + id)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getRecordList ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api.get('v1/allot-manage/get-record-list', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
