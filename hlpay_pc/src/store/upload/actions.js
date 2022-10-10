
import { api } from 'src/boot/axios'

export function image ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api
      .post('/v1/file/images', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function cert ({ commit }, formData) {
  return new Promise((resolve, reject) => {
    api
      .post('/v1/file/cert', formData)
      .then(response => {
        resolve(response)
      })
      .catch(error => {
        reject(error)
      })
  })
}
