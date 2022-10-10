<template>
  <q-page class="full-width column no-wrap justify-start items-center flex flex-center">
    <q-spinner-pie color="primary" size="2em" />
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'

export default {
  name: 'PageIndex',
  components: {},
  data () {
    return {

      channel_user: '',
      currentChannel: '',
      currentClient: ''
    }
  },
  computed: {

  },
  created () {
    const ua = window.navigator.userAgent
    if (ua.indexOf('MicroMessenger') > 0) {
      this.currentClient = 'wechat'
    }
    // 判断是不是支付宝
    // if (ua.indexOf('AlipayClient') > 0) {
    // }
    if (this.$route.query.hlToken) {
      this.hlToken = this.$route.query.hlToken
      this.getClientChannel()
    } else {
      this.$router.push({ name: 'warn' })
    }
  },
  mounted () {},
  methods: {

    getClientChannel () {
      const params = {
        currentClient: this.currentClient,
        hlToken: this.hlToken
      }

      this.$store
        .dispatch('pay/getClientChannel', params)
        .then((res) => {
          if (res.code == 100) {
            SessionStorage.set('hlpay_hl_token', this.hlToken)
            this.switchGoClientPayPage()
          } else if (res.code == 200) {
            this.currentChannel = res.data
            this.switchClient()
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    },

    switchClient () {
      switch (this.currentClient) {
        case 'wechat':
          if (this.$route.query.code) {
            this.getChannelUser(this.$route.query.code)
          } else {
            this.getWechatUserCode()
          }
          break
      }
    },

    switchGoClientPayPage () {
      switch (this.currentClient) {
        case 'wechat':
          this.$router.push({ name: 'wxPay', query: { user: this.channel_user } })
          break
      }
    },

    getWechatUserCode () {
      const params = {
        step: 'GetWechatUserCode',
        channel: this.currentChannel,
        way: 'wx_jsapi',
        hlToken: this.hlToken,
        callback: window.location.href
      }

      this.$store
        .dispatch('pay/getUser', params)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              window.location.href = res.data
            }
          } else if (res.code == 100) {
            SessionStorage.set('hlpay_hl_token', this.hlToken)
            this.switchGoClientPayPage()
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    },

    getChannelUser (code) {
      const params = {
        code: code,
        step: 'GetWechatOpenid',
        channel: this.currentChannel,
        way: 'wx_jsapi',
        hlToken: this.hlToken,
        callback: window.location.href
      }

      this.$store
        .dispatch('pay/getUser', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.channel_user = res.data
            SessionStorage.set('hlpay_hl_token', this.hlToken)

            this.switchGoClientPayPage()
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    }

  }
}
</script>
