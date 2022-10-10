<template>
  <q-dialog v-model="refundDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.3) + 'px',
        'max-width': parseInt($q.screen.width * 0.3) + 'px',
      }"
    >
      <q-card-section>
        <div class="text-h6">退款</div>
      </q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label class="text-primary text-weight-bold">{{ invoiceData.mch_order_no }}</q-item-label>
          <q-item-label caption lines="2">商户订单号</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-primary text-weight-bold"
            >¥ {{ formatAmount((invoiceData.amount - invoiceData.refund_amount) / 100) }}</q-item-label
          >
          <q-item-label caption lines="2">可退款金额</q-item-label>
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-primary text-weight-bold">¥ {{ formatAmount(invoiceData.amount / 100) }}</q-item-label>
          <q-item-label caption lines="2">支付金额</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="refund_amount" outlined label="请输入退款金额" autofocus>
          <template v-slot:prepend>
            <span class="text-dark text-caption"> ¥</span>
          </template>
        </q-input>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-input dense v-model="refund_reason" outlined label="请输入退款原因" autofocus type="textarea" />
      </q-card-section>

      <q-card-actions align="center" class="row q-gutter-sm">
        <q-btn unelevated label="关闭" color="grey" v-close-popup class="q-px-xl" />
        <q-btn unelevated label="退款" @click="orderRefund" color="negative" class="q-px-xl" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Refund',
  data () {
    return {
      invoiceData: {},
      refundDialogStatus: false,
      refund_amount: '',
      refund_reason: '',
      mchInfo: {}
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {
    init (id) {
      this.refundDialogStatus = true
      this.invoiceId = id
      if (id > 0) {
        this.$store
          .dispatch('order/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data ? res.data : {}
              this.mchInfo = res.data && res.data.mch ? res.data.mch : {}
            }
          })
          .catch((error) => {})
      }
    },

    // 提交
    orderRefund () {
      if (!this.mchInfo.hl_token) {
        this.$q.notify({
          message: '失败',
          caption: '当前订单不允许退款',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      const obj = {
        hlToken: this.mchInfo.hl_token,
        order_id: this.invoiceData.id,
        pay_order_no: this.invoiceData.pay_order_no,
        channel_pay_order_no: this.invoiceData.channel_order_no,
        pay_amount: this.invoiceData.amount,
        refund_amount: this.refund_amount,
        refund_reason: this.refund_reason,
        channel: this.invoiceData.pay_code
      }
      this.$store
        .dispatch('refund/orderRefund', obj)
        .then((res) => {
          if (res.code == 200 || res.code == 100) {
            this.$q.notify({
              message: '成功',
              caption: '发起退款请求成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })

            this.hideNowPage()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },

    hideNowPage () {
      this.refundDialogStatus = false
      this.$emit('closeDialog')
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
