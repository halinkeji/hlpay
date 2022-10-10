<template>
  <div class="q-gutter-sm">
    <q-btn color="primary" unelevated label="详情" v-if="authorityMeta('detail')" @click="setData" />
    <q-btn color="negative" unelevated label="退款" v-if="authorityMeta('refund') && parseInt(params.data.state) > 1  && formatAmount(params.data.refund_amount) < formatAmount(params.data.amount) && parseInt(params.data.allot_receiver_state) < 2" @click="openRefundDialog" />
    <q-btn color="positive" unelevated label="分账" v-if="authorityMeta('allot') && parseInt(params.data.state) == 2 && parseInt(params.data.allot_receiver_state) == 1" @click="setAllot" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    setData () {
      this.dataId = this.params.data.id
      this.params.context.viewOrderDetail(this.dataId)
    },
    openRefundDialog () {
      this.dataId = this.params.data.id
      this.params.context.refundOrder(this.dataId)
    },
    setAllot () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定将订单号为 "${this.params.data.mch_order_no}" 的订单分账吗？`,
          cancel: true
        })
        .onOk(() => {
          this.setAllotOperate()
        })
        .onCancel(() => {})
    },

    setAllotOperate () {
      this.mchInfo = this.params.data && this.params.data.mch ? this.params.data.mch : {}
      if (!this.mchInfo.hl_token) {
        this.$q.notify({
          message: '失败',
          caption: '当前订单不允许分账',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      this.$store
        .dispatch('order/allotOperate', {
          orderIds: [this.params.data.id],
          channel: this.params.data.pay_code,
          // mch_id: this.params.data.mch_id
          hlToken: this.mchInfo.hl_token,
          way: this.params.data.way_code
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '分账成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.$nextTick(() => {
              this.params.context.getList()
            })
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
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
