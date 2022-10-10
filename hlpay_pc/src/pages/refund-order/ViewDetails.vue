<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.6) + 'px',
          'max-width': parseInt($q.screen.width * 0.6) + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs row">
            <span class="text-h6 q-px-md"> 单据详情 </span>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </div>

          <div class="col-shrink q-pa-sm full-height bg-white">
            <q-scroll-area class="fit full-height">
              <div class="row">
                <div class="col-6">
                  <q-item v-if="invoiceData.isv_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">服务商号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.isv_id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_name">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户名称</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_type">
                    <q-item-section>
                      <q-item-label class="text-grey-8">类型</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ mchTypeObject[invoiceData.mch_type] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item v-if="invoiceData.refund_order_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.refund_order_id }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.mch_refund_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户退款单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_refund_no }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.channel_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道退款订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.channel_order_no }}</q-item-label>
                    </q-item-section>
                  </q-item>
                   <q-item v-if="invoiceData.success_time">
                    <q-item-section>
                      <q-item-label class="text-grey-8">订单退款成功时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ timeFormatDate(invoiceData.success_time) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.refund_reason">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款原因</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.refund_reason }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.refund_amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款总金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">¥ {{ formatAmount(invoiceData.refund_amount / 100) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.currency">
                    <q-item-section>
                      <q-item-label class="text-grey-8">货币代码</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ currencyCodeObject[invoiceData.currency] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.state">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款状态</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payRefundOrderStateObject[invoiceData.state] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.notify_state">
                    <q-item-section>
                      <q-item-label class="text-grey-8">向商户回调状态</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payMchNotifyRecordStateObject[invoiceData.notify_state] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.client_ip">
                    <q-item-section>
                      <q-item-label class="text-grey-8">客户端IP</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.client_ip }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.channel_extra">
                    <q-item-section>
                      <q-item-label class="text-grey-8">特定渠道额外支付参数</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.channel_extra }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.channel_user">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道用户标识</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.channel_user }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.err_code">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付错误码</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.err_code }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.err_msg">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付错误描述</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.err_msg }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.mch_extra_param">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户扩展参数</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_extra_param }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.notify_url">
                    <q-item-section>
                      <q-item-label class="text-grey-8">异步通知地址</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.notify_url }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.expired_time">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款失效时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ timeFormatDate(invoiceData.expired_time) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                </div>
                <div class="col-6">
                  <q-item v-if="invoiceData.isv_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">服务商号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.isv_id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_id">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_id }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_name">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户名称</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_name }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.mch_type">
                    <q-item-section>
                      <q-item-label class="text-grey-8">类型</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ mchTypeObject[invoiceData.mch_type] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item v-if="invoiceData.pay_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.pay_order_no }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.channel_pay_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.channel_pay_order_no }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.pay_amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">¥ {{ formatAmount(invoiceData.pay_amount / 100) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.pay_code">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付渠道标识</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payCodeObject[invoiceData.pay_code] }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="invoiceData.way_code">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付方式</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ wayCodeObject[invoiceData.way_code] }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-scroll-area>
          </div>
          <hl-local-printer ref="localPrinterRef" />
          <div class="col-shrink bg-white q-mt-xs q-py-sm text-center q-gutter-sm">
            <q-btn class="q-px-xl" unelevated label="关闭" @click="hideNowPage" color="grey" />
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'ViewDetails',
  data () {
    return {
      invoiceData: {
        user: {}
      },

      viewDetails: false,

      invoiceId: '',
      payCodeObject: {},
      wayCodeObject: {},
      mchTypeObject: {},
      currencyCodeObject: {},
      payRefundOrderStateObject: {},
      payMchNotifyRecordStateObject: {}
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {
    timeFormatDate (time) {
      if (parseInt(time)) {
        return this.$q_date.formatDate(parseInt(time), 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    },
    getViewData (id) {
      this.viewDetails = true
      this.invoiceId = id

      const enumLocal = LocalStorage.getItem('hlpay_enum_local')
      if (enumLocal && enumLocal.payCodeObject) {
        this.payCodeObject = enumLocal.payCodeObject
        this.wayCodeObject = enumLocal.wayCodeObject
        this.mchTypeObject = enumLocal.mchTypeObject
        this.payRefundOrderStateObject = enumLocal.payRefundOrderStateObject
        this.payMchNotifyRecordStateObject = enumLocal.payMchNotifyRecordStateObject

        this.currencyCodeObject = enumLocal.currencyCodeObject
      }

      if (id > 0) {
        this.$store
          .dispatch('refundOrder/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data ? res.data : {}
            }
          })
          .catch((error) => {})
      }
    },
    hideNowPage () {
      this.viewDetails = false
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
