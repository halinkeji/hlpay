const routes = [
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        name: 'PageIndex',
        path: '/',
        component: () => import('pages/Index.vue'),
        meta: { auth: true }
      }

    ]
  },
  {
    path: '',
    component: () => import('layouts/MainLayout.vue'),
    children: [
    ]
  },
  {
    path: '*',
    name: 'error404',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
