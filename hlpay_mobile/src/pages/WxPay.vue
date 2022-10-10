<template>
  <q-page class="full-width column no-wrap justify-start items-center">
    <q-item class="items-center q-mt-md vertical-top">
      <q-item-section side>
        <q-btn round flat class="avatar-box-shadow">
          <q-avatar size="32px" v-if="storeInfo.logo">
            <img :src="storeInfo.logo" />
          </q-avatar>
          <q-avatar size="32px" color="primary" v-else>
            <q-icon size="20px" color="white" name="las la-store-alt" />
          </q-avatar>
        </q-btn>
      </q-item-section>
      <q-item-section>
        <q-item-label caption class="text-weight-light">付款给商户</q-item-label>
        <q-item-label class="text-subtitle2 text-weight-bold">{{ storeInfo.mch_name }}</q-item-label>
      </q-item-section>
    </q-item>
    <div class="vertical-middle q-my-md" :style="cssVars">
      <q-item class="items-center full-width q-mt-md q-px-md">
        <q-input readonly no-border outlined v-model="payMoneyAmount" placeholder="请输入金额" class="full-width input-box text-h5">
          <template v-slot:prepend>
            <div class="text-h4 text-weight-bold text-dark">¥</div>
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="payMoneyAmount = ''" class="cursor-pointer" />
          </template>
        </q-input>
      </q-item>
      <div class="full-width row items-center q-mt-md">
        <div class="col btn-num-box-center" @click="pressButton(1)">
          <div :class="parseInt(rippleKey) == 1 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">1</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(2)">
          <div :class="parseInt(rippleKey) == 2 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">2</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(3)">
          <div :class="parseInt(rippleKey) == 3 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">3</span>
          </div>
        </div>
      </div>
      <div class="full-width row items-center q-mt-md">
        <div class="col btn-num-box-center" @click="pressButton(4)">
          <div :class="parseInt(rippleKey) == 4 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">4</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(5)">
          <div :class="parseInt(rippleKey) == 5 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">5</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(6)">
          <div :class="parseInt(rippleKey) == 6 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">6</span>
          </div>
        </div>
      </div>
      <div class="full-width row items-center q-mt-md">
        <div class="col btn-num-box-center" @click="pressButton(7)">
          <div :class="parseInt(rippleKey) == 7 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">7</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(8)">
          <div :class="parseInt(rippleKey) == 8 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">8</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton(9)">
          <div :class="parseInt(rippleKey) == 9 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">9</span>
          </div>
        </div>
      </div>
      <div class="full-width row items-center q-mt-md">
        <div class="col btn-num-box-center" @click="pressButton(0)">
          <div :class="parseInt(rippleKey) == 0 ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">0</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton('.')">
          <div :class="rippleKey == '.' ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font">.</span>
          </div>
        </div>
        <div class="col btn-num-box-center" @click="pressButton('back')">
          <div :class="rippleKey == 'back' ? 'btn-num-box-active' : 'btn-num-box'">
            <span class="btn-num-box-font"><q-icon name="fa-solid fa-delete-left" class="btn-num-box-icon" /></span>
          </div>
        </div>
      </div>
    </div>
    <q-item class="items-center full-width q-mt-md vertical-bottom">
      <q-btn size="lg" @click="getChannel" class="full-width btn-submit-box" color="primary"> 确认支付 </q-btn>
    </q-item>
    <q-item class="items-center full-width q-mt-md vertical-bottom">
      <div class="col btn-num-box-center"><q-icon name="fa-solid fa-copyright" /> 2022 {{ storeInfo.mch_name }}</div>
    </q-item>

    <q-dialog v-model="selectPayCode" position="bottom">
      <q-card class="full-width q-pa-md">
        <q-list class="full-width">
          <q-item
            clickable
            class="full-width q-pa-md box-channel-border q-my-xs"
            :class="{ 'box-channel-border-show': currentChannel == item.pay_code }"
            @click="selectPayChannel(item)"
            :key="key"
            v-for="(item, key) in channelList"
          >
            <q-item-section avatar>
              <q-avatar v-if="item.icon">
                <q-img :ratio="1" :src="item.icon" />
              </q-avatar>
              <q-avatar v-else color="red" text-color="white" icon="directions" />
            </q-item-section>

            <q-item-section>{{ item.name }}</q-item-section>
          </q-item>
        </q-list>

         <q-item class="items-center full-width q-mt-md vertical-bottom">
          <q-btn size="lg" @click="payMoney" class="full-width btn-submit-box" color="primary"> 确认支付 </q-btn>
        </q-item>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { SessionStorage } from 'quasar'
const wurl = require('wurl')
export default {
  name: 'WxPay',
  components: {},
  data () {
    return {
      col: {
        width: this.$q.screen.width,
        left: (this.$q.screen.width / 3 - 70) / 2,
        right: 0
      },
      rippleKey: '',
      payMoneyAmount: '',
      storeInfo: {},
      channel_user: '',
      currentChannel: '',
      channelList: [],
      selectPayCode: false,
      channelWay: 'wx_jsapi',
      hlToken: '',
      currentChannelData: {},
      currentTitle: ''
    }
  },
  // meta () {
  //   return {
  //     title: this.current_title,
  //     titleTemplate: (title) => title
  //   }
  // },
  watch: {
    current_title (val) {
      this.currentTitle = val
    }
  },
  computed: {
    cssVars () {
      return {
        '--width': this.width,
        '--margin-left': this.col.left,
        '--margin-right': this.col.right
      }
    },
    current_title () {
      if (this.storeInfo) {
        console.log('this.storeInfo', this.storeInfo)
        if (parseInt(this.storeInfo.sy_code) == 1) {
          return this.storeInfo.mch_name ? this.storeInfo.mch_name : ''
        } else {
          return '哈林会员管理软件-哈林集群式框架管理系统- Powered by HLFramework HALIN.NET'
        }
      }
      return ''
    }
  },
  created () {
    this.getStoreCode()
    if (this.$route.query && this.$route.query.user) {
      this.channel_user = this.$route.query.user
    }

    const hlToken = SessionStorage.getItem('hlpay_hl_token')
    if (hlToken) {
      this.hlToken = hlToken
    }

    if (this.$route.query && this.$route.query.channel) {
      this.currentChannel = this.$route.query.channel
      this.payMoneyAmount = this.$route.query.money

      if (this.$route.query && this.$route.query.hlToken) {
        this.hlToken = this.$route.query.hlToken
      }
      if (this.$route.query.code) {
        this.getChannelUser(this.$route.query.code)
      } else {
        this.getWechatUserCode()
      }
    }
  },
  mounted () {},
  methods: {
    selectPayChannel (val) {
      this.currentChannel = val.pay_code
      this.channel_user = ''
      this.currentChannelData = val
    },

    getStoreCode () {
      this.$store
        .dispatch('pay/getStoreData', {})
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.storeInfo = res.data
            } else {
              this.$router.push({ name: 'warn' })
            }
          }
        })
        .catch((error) => {})
    },

    getChannel () {
      if (!/^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(this.payMoneyAmount)) {
        this.$q.notify({
          message: '失败',
          caption: '请输入正确的金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      if (this.payMoneyAmount == '0.00' || this.payMoneyAmount == 0.00) {
        this.$q.notify({
          message: '失败',
          caption: '请输入正确的金额',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.$store
        .dispatch('pay/getChannel')
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (res.data && res.data.length && res.data && res.data.length == 1) {
              this.currentChannel = res.data[0].pay_code
              const currentChannelData = res.data[0]
              if (currentChannelData && parseInt(currentChannelData.is_get_user_id) == 1) {
                if (!this.channel_user) {
                  this.getWechatUserCode()
                  return false
                }
              }
              this.$nextTick(() => {
                this.payMoney()
              })
            } else {
              this.selectPayCode = true
              this.channelList = res.data && res.data.length ? res.data : []
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: '发起支付失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    pressButton (key) {
      this.rippleKey = key
      if (key == 'back') {
        const value = this.payMoneyAmount

        // 如果没有输入，直接返回
        if (!value.length) return false
        // 否则删除最后一个
        this.payMoneyAmount = value.substring(0, value.length - 1)
        return false
      }

      if (key == '.') {
        if (this.payMoneyAmount.indexOf('.') > -1) {
          return false
        }
        if (!this.payMoneyAmount.length) {
          this.payMoneyAmount = '0.'
          return false
        }
      }

      if (this.payMoneyAmount.length > 10) {
        return false
      }

      if (this.payMoneyAmount) {
        const decimalValueArr = this.payMoneyAmount.split('.')
        if (decimalValueArr[1] && decimalValueArr[1].length >= 3) {
          return false
        }
      }

      this.payMoneyAmount += key
    },

    payMoney () {
      if (this.channelList && this.channelList.length > 1) {
        if (this.currentChannelData && parseInt(this.currentChannelData.is_get_user_id) == 1) {
          if (!this.channel_user) {
            this.getWechatUserCode()
            return false
          }
        }
      }

      const return_url = wurl('protocol') + '://' + wurl('hostname') + '/m/hlpay/success'
      const params = {
        total_fee: this.payMoneyAmount,
        channel_user: this.channel_user,
        channel: this.currentChannel,
        way: this.channelWay,
        body: '支付',
        return_url: return_url
      }

      this.$q.loading.show({
        message: '正在发起支付,请稍后...'
      })
      this.$store
        .dispatch('pay/getPayConfig', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            if (parseInt(res.data.is_web_url) == 1) {
              window.location.href = res.data.config
            } else {
              this.triggerWxpay(res.data.config, res.data.out_trade_no)
            }
          } else {
            this.$q.loading.hide()
            this.$q.notify({
              message: '失败',
              caption: '发起支付失败！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })

          this.$q.loading.hide()
        })
    },

    triggerWxpay (config, out_trade_no) {
      const that = this
      WeixinJSBridge.invoke('getBrandWCPayRequest', config, function (res) {
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          that.$q.loading.show({
            message: '支付查询中,请稍后...'
          })
          that.inquireOrderStatus(out_trade_no)
        } else {
          that.$q.loading.hide()
        }
      })
    },

    inquireOrderStatus (out_trade_no) {
      const params = {
        out_trade_no,
        channel: this.currentChannel,
        way: this.channelWay
      }

      this.$store
        .dispatch('pay/inquiryOrder', params)
        .then((res) => {
          if (parseInt(res.code) == 200 && out_trade_no) {
            this.$q.loading.hide()
            this.$nextTick(() => {
              this.$router.push({ name: 'success' })
            })
          } else if (parseInt(res.code) == 100) {
            this.inquireOrderStatus(out_trade_no)
          } else {
            this.$nextTick(() => {
              this.$router.push({ name: 'error' })
            })
          }
        })
        .catch((error) => {
          this.$nextTick(() => {
            this.$router.push({ name: 'error' })
          })
          this.$q.loading.hide()
        })
    },

    getWechatUserCode () {
      const params = {
        step: 'GetWechatUserCode',
        channel: this.currentChannel,
        way: 'wx_jsapi',
        hlToken: this.hlToken,
        callback: wurl('protocol') + '://' + wurl('hostname') + '/m/hlpay/wx-pay/?hlToken=' + this.hlToken + '&money=' + this.payMoneyAmount + '&channel=' + this.currentChannel
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
        hlToken: this.hlToken
      }

      this.$store
        .dispatch('pay/getUser', params)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.channel_user = res.data
            this.payMoney()
          } else {
            this.$router.push({ name: 'warn' })
          }
        })
        .catch((error) => {})
    }

  }
}
</script>

<style lang="scss">
.avatar-box-shadow {
  background: #f0f0f3;
  box-shadow: 2px 2px 50px rgba(174, 174, 192, 0.4), -10px -10px 30px #ffffff;
}
.input-box {
  border: 1px solid #0070ba;
  // box-sizing: border-box;
  box-shadow: 0px 0px 46px -16px rgba(21, 70, 160, 0.1);
  border-radius: 6px;
}
.btn-num-box-center {
  text-align: center;
}
.btn-num-box {
  margin-left: calc(var(--margin-left) * 1px);
  margin-right: calc(var(--margin-right) * 1px);
  width: 70px;
  height: 70px;
  box-shadow: 20px 32px 48px -16px rgba(21, 70, 160, 0.1);
  border-radius: 40px;
}
.btn-num-box-active {
  margin-left: calc(var(--margin-left) * 1px);
  margin-right: calc(var(--margin-right) * 1px);
  width: 70px;
  height: 70px;
  box-shadow: 1px 1px 5px 4px rgba(21, 70, 160, 0.1);
  border-radius: 40px;
}
.btn-num-box-font {
  width: 15px;
  height: 33px;
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 70px;
  /* identical to box height */

  text-align: center;

  /* Black */

  color: #243656;
}
.btn-num-box-icon {
  font-size: 24px;
  line-height: 33px;
  /* identical to box height */

  text-align: center;

  /* Black */

  color: #243656;
}
.btn-submit-box {
  /* Gradient */

  background: radial-gradient(122.27% 198.92% at -22.27% -27.38%, #0070ba 0%, #1546a0 100%)
    /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  box-shadow: 0px 24px 48px -18px rgba(21, 70, 160, 0.5);
  border-radius: 20px;
}
.box-channel-border {
  border: 1px solid #818181;
  border-radius: 10px;
}
.box-channel-border-show {
  border: 2px solid #027be3;
  border-radius: 10px;
}
</style>
