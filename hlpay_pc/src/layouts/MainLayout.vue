<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn
          flat
          v-if="$q.screen.gt.xs"
          dense
          round
          @click="leftDrawerOpenAll = !leftDrawerOpenAll"
          :icon="`${leftDrawerOpenAll ? 'menu_open' : 'menu'}`"
          aria-label="Menu"
          color="white"
          size="sm"
        />
        <q-btn flat v-else dense round @click="leftDrawerOpen = !leftDrawerOpen" :icon="`${leftDrawerOpen ? 'menu_open' : 'menu'}`" aria-label="Menu" color="white" size="sm" />
        <q-avatar class="q-mb-sm" size="md" v-if="$q.screen.gt.sm">
          <q-img ratio="1" :src="`${$q.localStorage.getItem('hlpay_system_local').attachment.cdn_url}` + store_info.logo">
            <template v-if="!store_info.logo">
              <q-skeleton type="QAvatar" />
            </template>
          </q-img>
        </q-avatar>

        <span class="text-h6 q-px-md" v-if="$q.screen.gt.sm">
          {{ store_info.name || '哈林单店' }}
        </span>

        <q-space />
        <span v-if="$q.screen.gt.sm">
          {{ nowTimeComputed }}
        </span>

        <q-btn v-if="$q.screen.gt.sm" flat round dense @click="$q.fullscreen.toggle()" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'" class="q-mr-xs">
          <q-tooltip content-class="grey-3" :offset="[10, 10]">
            全屏
          </q-tooltip>
        </q-btn>

        <q-btn v-if="$q.screen.gt.sm" flat round dense size="sm" icon="fas fa-headset" class="q-mr-xs">
          <q-menu fit>
            <q-card class="full-width" flat bordered>
              <q-card-section class="text-center q-pb-xs">
                <div class="text-subtitle2">售后客服</div>
              </q-card-section>
              <q-separator inset />
              <q-card-section class="flex flex-center">
                <q-avatar square size="100px" v-if="sy_serve_qrcode"> <img :src="`${$q.localStorage.getItem('hlpay_system_local').attachment.cdn_url}` + sy_serve_qrcode" />x </q-avatar>
                <q-icon v-else name="contact_support" size="50px" color="grey" />
              </q-card-section>
              <q-separator inset />
              <q-card-section>
                <div class="q-mr-xs">联系电话 : {{ sy_serve_mobile ? sy_serve_mobile : '待分配' }}</div>
                <div class=" text-grey text-caption">到期时间 : {{ storeEndTime }}</div>
              </q-card-section>
            </q-card>
          </q-menu>
        </q-btn>

        <q-btn flat :label="userName">
          <q-avatar color="grey-1" text-color="primary" icon="las la-user" size="36px" />
          <q-menu transition-show="scale" transition-hide="scale">
            <div class="row no-wrap q-pa-md">
              <div class="column items-center">
                <q-avatar color="grey-1" text-color="primary" icon="las la-user" size="72px" />

                <div class="text-subtitle1 q-mt-md q-mb-xs">{{ userName }}</div>

                <q-btn color="primary" :label="'退出'" push size="sm" v-close-popup @click="logoutAccount()" />
              </div>
            </div>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container class="main-page-container">
      <div class="main-page-sidebar full-height" ref="pageSidebar" v-show="sidebarVisibility" :style="`width: ${!$q.screen.gt.xs ? 0 : !sidebarLeftOpen ? sidebarMinimize : sidebar}px`">
        <div class="sidebar-body">
          <q-scroll-area class="fit">
            <hl-menu-tree v-model="sidebarLeftOpen" :menuData="linksData"></hl-menu-tree>
          </q-scroll-area>
        </div>
        <div class="sidebar-footer row items-center" v-if="$q.screen.gt.xs">
          <q-btn
            flat
            dense
            round
            @click="sidebarLeftOpen = !sidebarLeftOpen"
            :icon="`${sidebarLeftOpen ? 'format_indent_decrease' : 'format_indent_increase'}`"
            aria-label="Menu"
            color="primary"
            size="sm"
          />
        </div>
      </div>

      <q-drawer v-model="leftDrawerOpen" side="left" overlay bordered :width="240">
        <hl-menu-tree :menuData="linksData" :minimize="true" v-model="leftDrawerOpen"></hl-menu-tree>
      </q-drawer>
      <div class="main-page-body bg-blue-grey-1 " ref="pageBody" :style="`left: ${!$q.screen.gt.xs || !sidebarVisibility || !leftDrawerOpenAll ? 0 : !sidebarLeftOpen ? sidebarMinimize : sidebar}px`">
        <div class="full-height scroll">
          <router-view />
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'

export default {
  name: 'MainLayout',
  components: {},
  data () {
    return {
      title: '',
      sy_icon: '',
      sy_serve_qrcode: '',
      sy_serve_mobile: '',
      userName: '',
      leftDrawerOpen: false,
      linksData: [],
      store_info: {},
      sidebar: 240,
      sidebarMinimize: 55,
      sidebarVisibility: true,
      sidebarLeftOpen: true,
      nowTimeComputed: '',
      leftDrawerOpenAll: true
    }
  },
  meta () {
    return {
      title: this.current_title,
      titleTemplate: (title) => `${title}`,
      sy_icon: this.sy_icon,
      link: {
        material: { rel: 'icon', type: 'image/png', sizes: '96x96', href: this.sy_icon }
      }
    }
  },
  beforeDestroy () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },

  watch: {
    menuData (v) {
      this.getMenuData()
    },

    sidebarLeftOpen (val) {
      if (this.sidebarVisibility) {
        this.$refs.pageSidebar.setAttribute('style', 'width: ' + (val ? this.sidebar : this.sidebarMinimize) + 'px')
        this.$refs.pageBody.setAttribute('style', 'left: ' + (val ? this.sidebar : this.sidebarMinimize) + 'px')
      }
    },
    '$q.screen.gt.sm' (val) {
      if (this.sidebarVisibility) {
        this.sidebarLeftOpen = val
      }
    },
    '$q.screen.gt.xs' () {
      if (this.sidebarVisibility) {
        this.sidebarLeftOpen = false
      }
    }
  },
  computed: {
    menuData () {
      return this.$store.state.settings.menuData
    },
    storeEndTime () {
      const lib_local_info = this.$q.localStorage.getItem('hlpay_lib_local')
      if (lib_local_info && lib_local_info.store) {
        const store_info = lib_local_info.store
        return this.$q_date.formatDate(store_info.end_time * 1000, 'YYYY年MM月DD日')
      }
      return '错误'
    },
    current_title () {
      if (LocalStorage.getItem('hlpay_system_local')) {
        const systemLocal = LocalStorage.getItem('hlpay_system_local')
        if (systemLocal && systemLocal.copyright) {
          if (parseInt(systemLocal.copyright.sy_code) == 1) {
            return this.store_info ? this.store_info.name : ''
          } else {
            return (this.store_info ? this.store_info.name : '') + ' - Powered by HLFramework HALIN.NET'
          }
        } else {
          return ' 哈林会员管理软件-哈林集群式框架管理系统- Powered by HLFramework HALIN.NET'
        }
      }
      return ''
    }
  },
  created () {
    if (LocalStorage.getItem('hlpay_system_local')) {
      const copyright = LocalStorage.getItem('hlpay_system_local').copyright
      if (copyright) {
        this.sy_icon = LocalStorage.getItem('hlpay_system_local').attachment.cdn_url + copyright.sy_icon

        this.sy_serve_qrcode = copyright.sy_serve_qrcode
        this.sy_serve_mobile = copyright.sy_serve_mobile
      }
    }
    this.getMenuData()
    const user_info = LocalStorage.getItem('hlpay_user_info')
    this.userName = user_info ? user_info.username : '未知'

    const lib_local_info = this.$q.localStorage.getItem('hlpay_lib_local')
    if (lib_local_info && lib_local_info.store) {
      this.store_info = lib_local_info.store
    }
  },
  mounted () {
    const that = this
    that.timer = setInterval(function () {
      that.nowTime()
    }, 1000)
    this.getMenuData()
  },
  methods: {
    nowTime () {
      const that = this
      that.nowTimeComputed = that.$q_date.formatDate(new Date(), 'YYYY-MM-DD  HH:mm:ss')
    },
    getMenuData () {
      const hlpay_left_menu_navigate_local = LocalStorage.getItem('hlpay_left_menu_navigate_local')

      this.linksData = hlpay_left_menu_navigate_local
    },
    logoutAccount () {
      this.$q.loading.show({
        message: '正在保存数据,请稍后...'
      })

      removeAllLocalStorage()
      removeAllCookies()

      setTimeout(() => {
        this.$q.loading.hide()

        if (this.$route.name == 'PageIndex') {
          location.reload()
        } else {
          this.$router.push({ name: 'PageIndex' })
        }
      }, 1500)
    }
  }
}
</script>
<style lang="sass" scoped>
.main-page-container
  position: absolute
  left: 0
  top: 50px
  right: 0
  bottom: 0
  overflow: hidden
  padding-top: 0px !important
.main-page-sidebar
  position: absolute
  border-right: 1px solid #eaebec
  background-color: #fff
  & .sidebar-body
    position: absolute
    top: 0
    left: 0
    right: 0
    bottom: 45px
  & .sidebar-footer
    position: absolute
    left: 0
    right: 0
    bottom: 0
    height: 45px
    padding-left: 13.5px
.main-page-body
  position: absolute
  top: 0
  right: 0
  bottom: 0
  overflow-x: hidden
</style>
<style scoped>
.storeListClass i {
  color: white;
}
</style>
