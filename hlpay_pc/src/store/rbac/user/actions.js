import { api } from 'src/boot/axios'

export function getUserList ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/user', {
        params: item
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function setUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    let apiUrl = 'v1/user'
    apiUrl += parseInt(item.id) > 0 ? '/update?id=' + parseInt(item.id) : '/create'
    const requestType = parseInt(item.id) > 0 ? 'put' : 'post'
    api[requestType](apiUrl, item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/user/view?id=' + item)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function delUserInfo ({ commit }, item) {
  return new Promise((resolve, reject) => {
    api
      .delete(`v1/user/delete?id=${item}`)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function roleInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/user/role', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
export function getUserAllData ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/user/lists', {
        params
      })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function getMobileInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .get('v1/user/get-mobile', { params })
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function setMobileInfo ({ commit }, params) {
  return new Promise((resolve, reject) => {
    api
      .post('v1/user/set-mobile', params)
      .then((response) => {
        resolve(response)
      })
      .catch((error) => {
        reject(error)
      })
  })
}
