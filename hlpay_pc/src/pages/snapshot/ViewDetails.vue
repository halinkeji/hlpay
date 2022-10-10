<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="viewDetails" persistent>
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.9) + 'px',
          'max-width': parseInt($q.screen.width * 0.9) + 'px',
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
              <div class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>商户支付请求数据</q-item-label>
                        <q-item-label caption>{{ valueTimeFormat(invoiceData.mch_request_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="invoiceData.mch_request_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-3">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>支付渠道发起支付请求数据</q-item-label>
                        <q-item-label caption>{{ valueTimeFormat(invoiceData.channel_request_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="invoiceData.channel_request_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-3">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>支付渠道响应支付请求时间</q-item-label>
                        <q-item-label caption>{{ valueTimeFormat(invoiceData.channel_response_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="invoiceData.channel_response_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
                </div>
                <div class="col-3">
                  <q-card flat bordered>
                    <q-item>
                      <q-item-section>
                        <q-item-label>商户支付请求响应数据</q-item-label>
                        <q-item-label caption>{{ valueTimeFormat(invoiceData.mch_resp_time) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-separator />
                    <q-card-section>
                      <vue-json-viewer :value="invoiceData.mch_resp_data"></vue-json-viewer>
                    </q-card-section>
                  </q-card>
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
export default {
  name: 'ViewDetails',
  data () {
    return {
      invoiceData: {},

      viewDetails: false,

      invoiceId: ''
    }
  },
  components: {},
  mounted () {},

  computed: {},
  methods: {

    getViewData (id) {
      this.viewDetails = true
      this.invoiceId = id

      if (id > 0) {
        this.$store
          .dispatch('snapshot/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.invoiceData = res.data ? res.data : {}
              this.invoiceData.mch_request_data = res.data && res.data.mch_request_data ? JSON.parse(res.data.mch_request_data) : {}
              this.invoiceData.channel_request_data = res.data && res.data.channel_request_data ? JSON.parse(res.data.channel_request_data) : {}
              this.invoiceData.channel_response_data = res.data && res.data.channel_response_data ? JSON.parse(res.data.channel_response_data) : {}
              this.invoiceData.mch_resp_data = res.data && res.data.mch_resp_data ? JSON.parse(res.data.mch_resp_data) : {}
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
    valueTimeFormat (val) {
      if (parseInt(val)) {
        return this.$q_date.formatDate(val, 'YYYY-MM-DD HH:mm:ss')
      }
      return ''
    }

  }
}
</script>
