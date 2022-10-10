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

                  <q-separator />

                  <q-item  v-if="invoiceData.pay_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.pay_order_no }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.mch_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_order_no }}</q-item-label>
                    </q-item-section>
                  </q-item>

                   <q-item  v-if="invoiceData.success_time">
                    <q-item-section>
                      <q-item-label class="text-grey-8">订单支付成功时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ timeFormatDate(invoiceData.success_time) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                   <q-item  v-if="invoiceData.expired_time">
                    <q-item-section>
                      <q-item-label class="text-grey-8">订单失效时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ timeFormatDate(invoiceData.expired_time) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付金额</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">¥ {{ formatAmount(invoiceData.amount / 100) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.mch_fee_rate">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户手续费费率</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_fee_rate }} % </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.mch_fee_amount">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商户手续费</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">¥ {{ formatAmount(invoiceData.mch_fee_amount / 100) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.currency">
                    <q-item-section>
                      <q-item-label class="text-grey-8">货币代码</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ currencyCodeObject[invoiceData.currency] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.state">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付状态</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payOrderStateObject[invoiceData.state] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.notify_state">
                    <q-item-section>
                      <q-item-label class="text-grey-8">向商户回调状态</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ notifyStateObject[invoiceData.notify_state] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.mch_type">
                    <q-item-section>
                      <q-item-label class="text-grey-8">类型</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ mchTypeObject[invoiceData.mch_type] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.client_ip">
                    <q-item-section>
                      <q-item-label class="text-grey-8">客户端IP</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"> {{ invoiceData.client_ip }}</q-item-label>
                    </q-item-section>
                  </q-item>

                </div>
                <div class="col-6">
                  <q-item  v-if="invoiceData.subject">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商品标题</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.subject }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.body">
                    <q-item-section>
                      <q-item-label class="text-grey-8">商品描述信息</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.body }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item  v-if="invoiceData.notify_url">
                    <q-item-section>
                      <q-item-label class="text-grey-8">异步通知地址</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.notify_url }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item  v-if="invoiceData.return_url">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付成功页面跳转地址</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.return_url }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item  v-if="invoiceData.pay_code">
                    <q-item-section>
                      <q-item-label class="text-grey-8">支付渠道标识</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payCodeObject[invoiceData.pay_code] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.way_code">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付方式标识</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ wayCodeObject[invoiceData.way_code] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.channel_extra">
                    <q-item-section>
                      <q-item-label class="text-grey-8">特定渠道额外支付参数</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"> {{ invoiceData.channel_extra }}</q-item-label>
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
                  <q-item v-if="invoiceData.channel_order_no">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道订单号</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.channel_order_no }}</q-item-label>
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

                  <q-item v-if="invoiceData.mch_extra_param">
                    <q-item-section>
                      <q-item-label class="text-grey-8">渠道支付错误描述</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ invoiceData.mch_extra_param }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item v-if="invoiceData.allot_receiver_mode">
                    <q-item-section>
                      <q-item-label class="text-grey-8">订单分账模式</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ allotReceiverModeObject[invoiceData.allot_receiver_mode] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.allot_receiver_last_time">
                    <q-item-section>
                      <q-item-label class="text-grey-8">最新分账时间</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ timeFormatDate(invoiceData.allot_receiver_last_time) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator />
                  <q-item v-if="invoiceData.refund_state">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款状态</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2">{{ payOrderRefundStateObject[invoiceData.refund_state] }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="invoiceData.refund_times">
                    <q-item-section>
                      <q-item-label class="text-grey-8">退款次数</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-dark" lines="2"> {{ invoiceData.refund_times }}</q-item-label>
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
      currencyCodeObject: {},
      mchTypeObject: {},
      payOrderStateObject: {},
      notifyStateObject: {},
      payOrderRefundStateObject: {},
      allotReceiverModeObject: {},
      allotReceiverStateObject: {}
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
        this.currencyCodeObject = enumLocal.currencyCodeObject
        this.mchTypeObject = enumLocal.mchTypeObject
        this.notifyStateObject = enumLocal.notifyStateObject
        this.payOrderRefundStateObject = enumLocal.payOrderRefundStateObject
        this.allotReceiverModeObject = enumLocal.allotReceiverModeObject
        this.allotReceiverStateObject = enumLocal.allotReceiverStateObject

        this.payOrderStateObject = enumLocal.payOrderStateObject
      }

      if (id > 0) {
        this.$store
          .dispatch('order/getItemData', id)
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
    },
    printBut () {
      const obj = {
        id: this.invoiceId
      }
      this.$store
        .dispatch('invoice/getInvoicePrint', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '补打成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
