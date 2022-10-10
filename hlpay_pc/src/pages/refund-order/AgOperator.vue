<template>
  <div class="q-gutter-sm">
    <q-btn color="primary" unelevated label="详情" v-if="authorityMeta('detail')" @click="setData" />
    <q-btn color="warning" unelevated v-if="['snappay','sqbpay'].indexOf(params.data.pay_code) > -1 && parseInt(params.data.state) == 1" label="更新订单状态"  @click="updateOrderStatus" />
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

    updateOrderStatus () {
      this.mchInfo = this.params.data && this.params.data.mch ? this.params.data.mch : {}
      if (!this.mchInfo.hl_token) {
        this.$q.notify({
          message: '失败',
          caption: '更新订单错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      this.$store
        .dispatch('order/queryOrder', {
          out_trade_no: this.params.data.mch_refund_no,
          channel: this.params.data.pay_code,
          // mch_id: this.params.data.mch_id
          hlToken: this.mchInfo.hl_token,
          way: this.params.data.way_code,
          quueryType: 'refund'
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '更新成功！',
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
