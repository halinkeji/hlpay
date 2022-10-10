<template>
  <q-page class="full-width fixed-center bg-grey-3">
    <div class="q-mt-md q-mx-xs">
      <q-list class="shadow-box q-pa-sm" v-if="bindStatus == 1">
        <q-separator class="q-my-sm" />

        <q-item>
          <q-item-section>
            <q-item-label>分账账号名称</q-item-label>
            <q-item-label caption>{{ receiverInfo.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon color="primary" name="link" />
          </q-item-section>
        </q-item>
        <!-- <q-input rounded outlined dense v-model="channel_user" label="用户标识" /> -->
        <q-input rounded outlined dense v-model="name" label="真实姓名" />

        <q-separator class="q-my-md" />

        <q-item class="items-center q-pb-xl">
          <q-btn size="lg" class="full-width btn-submit-box" @click="bindClient" color="primary"> 授 权 </q-btn>
        </q-item>
      </q-list>

      <q-list class="shadow-box q-pa-sm" v-else>
        <q-item>
          <q-item-section>
            <q-item-label>分账账号名称</q-item-label>
            <q-item-label caption>{{ receiverInfo.name }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-icon color="primary" name="link" />
          </q-item-section>
        </q-item>

        <q-separator class="q-my-sm" />

        <q-item class="box-center" v-if="bindStatus == 4">
          <q-icon name="fa-solid fa-circle-check" color="positive" size="64px" />
        </q-item>

        <q-item class="box-center" v-else>
          <q-icon name="warning" color="red" size="64px" />
        </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red" v-if="bindStatus == 2"> 绑定码缺失 </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red" v-if="bindStatus == 3"> 未找到接收方 </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-positive" v-if="bindStatus == 4"> 授权成功 </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red" v-if="bindStatus == 5"> 基础信息配置错误 </q-item>

        <q-item class="box-center text-h5 text-weight-bolder q-mt-lg text-red" v-if="bindStatus == 6"> 链接已过期 </q-item>

        <q-separator class="q-my-md" />

        <q-item class="items-center q-pb-xl">
          <q-btn size="lg" class="full-width btn-submit-box" color="primary" @click="closeCurrentWindow"> 关闭 </q-btn>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'

export default {
  name: 'PageIndex',
  components: {},
  data () {
    return {
      avatar: true,
      text: '',
      dense: false,

      rippleKey: '',
      payMoneyAmount: '',
      receiverInfo: {},
      channel_user: '',
      currentChannel: '',
      bindStatus: 1,
      name: ''
    }
  },
  computed: {},
  created () {
    const ua = window.navigator.userAgent
    if (ua.indexOf('MicroMessenger') > 0) {
      this.currentChannel = 'wxpay'
    }
    // 判断是不是支付宝
    // if (ua.indexOf('AlipayClient') > 0) {
    // }
    if (this.$route.query.hlToken) {
      this.hlToken = this.$route.query.hlToken
      this.switchClient()
    } else {
      this.$router.push({ name: 'warn' })
    }
  },
  mounted () {},
  methods: {
    getAllotReceiverInfo () {
      this.$store
        .dispatch('allot/getAllotReceiverInfo', this.$route.query.allot_id)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.receiverInfo = res.data
            } else {
              this.$router.push({ name: 'warn' })
            }
          }
        })
        .catch((error) => {})
    },

    switchClient () {
      switch (this.currentChannel) {
        case 'wxpay':
          if (this.$route.query.code) {
            this.getChannelUser(this.$route.query.code)
          } else {
            this.getWechatUserCode()
          }
          break
      }
    },

    switchClientPay (res) {
      switch (this.currentChannel) {
        case 'wxpay':
          this.triggerWxpay(res.config, res.out_trade_no)
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
            this.getAllotReceiverInfo()
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    },

    bindClient () {
      const params = {
        account: this.channel_user,
        channel: this.currentChannel,
        name: this.name,
        allot_id: this.$route.query.allot_id,
        hlToken: this.hlToken
      }

      this.$store
        .dispatch('allot/setAllotReceiverInfo', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.bindStatus = 4
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    },
    closeCurrentWindow () {
      setTimeout(function () {
        document.addEventListener(
          'WeixinJSBridgeReady',
          function () {
            this.WeixinJSBridge.call('closeWindow') // 安卓手机关闭代码
          },
          false
        )
        this.WeixinJSBridge.call('closeWindow') // 苹果手机关闭代码
      }, 300)
      // 以下是普通浏览器关闭代码
      window.opener = null
      window.open('about:blank', '_top').close()
    }
  }
}
</script>

<style lang="scss">
.shadow-box {
  width: 100%;
  height: auto;
  background: #fbfbfb;
  box-shadow: 0px 3px 10px rgba(27, 31, 68, 0.08);
  border-radius: 10px;
}
.box-center {
  text-align: center;
  display: block;
}
.btn-submit-box {
  /* Gradient */

  background: radial-gradient(122.27% 198.92% at -22.27% -27.38%, #0070ba 0%, #1546a0 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 24px 48px -18px rgba(21, 70, 160, 0.5);
  border-radius: 20px;
}
</style>
