import Vue from 'vue'

import Decimal from 'decimal.js'

import QrcodeVue from 'qrcode.vue'
Vue.component('qrcode-vue', QrcodeVue)

const _ = require('lodash')

import { date } from 'quasar'
Vue.prototype.$q_date = date

Vue.prototype.$q_decimal = Decimal

import uploadImg from '../components/upload-components/imgList.vue'
Vue.component('upload-img', uploadImg)

import fileUpload from '../components/upload-components/fileUpload.vue'
Vue.component('file-upload', fileUpload)

import hlMenuTree from '../components/hl-menu-tree/index.vue'
Vue.component('hl-menu-tree', hlMenuTree)

import JsonViewer from 'vue-json-viewer'

// Import JsonViewer as a Vue.js plugin
Vue.component('vue-json-viewer', JsonViewer)

import VueCanvasPoster from 'vue-canvas-poster'
// 注册组件库
Vue.use(VueCanvasPoster)
