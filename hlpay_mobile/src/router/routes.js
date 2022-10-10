
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },

      {
        path: '/wx-pay',
        name: 'wxPay',
        component: () => import('pages/WxPay.vue'),
        meta: { auth: true, title: '微信公众号支付' }
      },
      {
        path: '/wx-bind-allot-receiver',
        name: 'wxBindAllotReceiver',
        component: () => import('pages/WxBindAllotReceiver.vue'),
        meta: { auth: true, title: '微信支付绑定分账接收方' }
      },

      {
        path: '/success',
        name: 'success',
        component: () => import('pages/Success.vue'),
        meta: { auth: true, title: '支付成功' }
      },
      {
        path: '/error',
        name: 'error',
        component: () => import('pages/Error.vue'),
        meta: { auth: true, title: '支付失败' }
      },
      {
        path: '/warn',
        name: 'warn',
        component: () => import('pages/Warn.vue'),
        meta: { auth: true, title: '错误' }
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
