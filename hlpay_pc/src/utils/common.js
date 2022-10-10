import { Cookies, LocalStorage, Notify } from 'quasar'

// auth Config 值
// 替换成自己的配置信息即可

export const authConfig = {
  domain: '.halin.cc',
  login_uri: 'http://passport.halin.cc/login',
  redirect_uri: 'http://hlpay.halin.cc',
  appId: 'hlfOgC2fgCcps24256'
}


/* 判断localStorage token是否过期 */
export const isLocalStorageTokenExpir = () => {
  const expiredTime = parseInt(
    LocalStorage.getItem('hlpay_accessToken_info').expires
  )
  /* 获取本地时间 */
  const nowTime = parseInt(new Date().getTime() / 1000)
  /* 如果小于15分钟，则说明即将过期 */
  return expiredTime - nowTime < 60 * 15
}

/* 判断Cookies token是否过期 */
export const isCookiesTokenExpir = () => {
  const expiredTime = parseInt(Cookies.get('accessToken_info').expires)
  /* 获取本地时间 */
  const nowTime = parseInt(new Date().getTime() / 1000)
  /* 如果小于15分钟，则说明即将过期 */
  return expiredTime - nowTime < 60 * 15
}

// 判断Cookies是否有值
export const isAuthenticated = () => {
  return (
    LocalStorage.getItem('hlpay_loggedIn') &&
    Cookies.get('access_token') ===
      LocalStorage.getItem('hlpay_access_token')
  )
}

export const isCurrentApply = () => {
  const storageAccountInfo = LocalStorage.getItem('hlpay_account_info')
  if (storageAccountInfo && storageAccountInfo.apply_id) {
    if (storageAccountInfo.apply_id != 'hlpay') {
      return false
    }
  }

  const cookieAccountInfo = Cookies.get('account_info')
  if (cookieAccountInfo && storageAccountInfo) {
    if (cookieAccountInfo.user_id && storageAccountInfo.user_id && parseInt(cookieAccountInfo.user_id) != parseInt(storageAccountInfo.user_id)) {
      return false
    }
  }

  return true
}

// 设置 全局LocalStorage
export function setAllLocalStorage () {
  LocalStorage.set('hlpay_access_token', Cookies.get('access_token'))
  LocalStorage.set('hlpay_expires_in', Cookies.get('expires_in'))
  LocalStorage.set('hlpay_refresh_token', Cookies.get('refresh_token'))
  LocalStorage.set('hlpay_token_type', Cookies.get('token_type'))
  LocalStorage.set('hlpay_loggedIn', Cookies.get('loggedIn'))
  LocalStorage.set(
    'hlpay_accessToken_info',
    Cookies.get('accessToken_info')
  )
  LocalStorage.set('hlpay_user_info', Cookies.get('user_info'))
  LocalStorage.set('hlpay_account_info', Cookies.get('account_info'))
  if (Cookies.get('store_info')) {
    LocalStorage.set('hlpay_lib_local', {
      store: Cookies.get('store_info')
    })
  }
  return true
}

// 删除 Cookies
export const removeAllCookies = () => {
  Cookies.remove('access_token', { path: '/', domain: authConfig.domain })
  Cookies.remove('expires_in', { path: '/', domain: authConfig.domain })
  Cookies.remove('refresh_token', { path: '/', domain: authConfig.domain })
  Cookies.remove('token_type', { path: '/', domain: authConfig.domain })
  Cookies.remove('loggedIn', { path: '/', domain: authConfig.domain })
  Cookies.remove('accessToken_info', { path: '/', domain: authConfig.domain })
  Cookies.remove('user_info', { path: '/', domain: authConfig.domain })
  Cookies.remove('account_info', { path: '/', domain: authConfig.domain })
  if (Cookies.get('store_info')) {
    Cookies.remove('store_info', {
      path: '/',
      domain: authConfig.domain
    })
  }
}

// 删除 LocalStorage
export const removeAllLocalStorage = () => {
  LocalStorage.clear()
}

// 设置 全局Cookies
export function setAllCookies (tokenData) {
  Cookies.set('access_token', tokenData.access_token, { domain: authConfig.domain })
  Cookies.set('expires_in', tokenData.expires_in, { domain: authConfig.domain })
  Cookies.set('refresh_token', tokenData.refresh_token, { domain: authConfig.domain })
  Cookies.set('token_type', tokenData.token_type, { domain: authConfig.domain })
  Cookies.set('loggedIn', 'true', { domain: authConfig.domain })

  if (Cookies.has('access_token') && Cookies.has('expires_in') && Cookies.has('refresh_token') && Cookies.has('token_type') && Cookies.has('loggedIn')) {
    return true
  }

  // 开发环境Cookies
  // Cookies.set('access_token', tokenData.access_token, { domain: false })
  // Cookies.set('expires_in', tokenData.expires_in, { domain: false })
  // Cookies.set('refresh_token', tokenData.refresh_token, { domain: false })
  // Cookies.set('token_type', tokenData.token_type, { domain: false})
  // Cookies.set('loggedIn', 'true', { domain: false })

  return false
}

// 设置 指定信息的Cookies  ，比如user_info
export function setToCookies (data) {
  // 生产环境Cookies
  Cookies.set('accessToken_info', data.accessToken_info, { domain: authConfig.domain })
  Cookies.set('user_info', data.user_info, { domain: authConfig.domain })

  if (data.account_info) {
    Cookies.set('account_info', data.account_info, { domain: authConfig.domain })
  }
  if (data.store_info) {
    Cookies.set('store_info', data.store_info, { domain: authConfig.domain })
  }

  // 开发环境Cookies
  // Cookies.set('user_info', tokenData.user_info, { domain: false })

  return true
}

// notify提示
export function notifyError (errorMsg, timeout) {
  Notify.create({
    type: 'negative',
    message: errorMsg,
    timeout,
    position: 'bottom',
    closeBtn: '关闭'
  })
}
