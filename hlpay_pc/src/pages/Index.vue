<template>
  <q-page class="fit q-pt-md">
    <div class="full-width row">
      <div class="col-8 row">
        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder"> {{ formatAmount(orderCountData.todayOrderAmount * 0.01) }} </q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">今日交易金额</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-money-bill" class="text-negative" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="negative">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">今日交易金额</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ formatAmount(orderCountData.yesterDayOrderAmount * 0.01) }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">昨日交易金额</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-money-bill-wave" class="text-primary" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="primary">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">昨日交易金额</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ formatAmount(orderCountData.totalOrderAmount * 0.01) }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">截止当前日期</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-wallet" class="text-positive" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="positive">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">交易总金额</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ orderCountData.totalIsvCount }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">截止当前汇总</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-users" class="text-orange" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="orange">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">服务商总数</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ orderCountData.todayOrderCount }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">今日交易笔数</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-file-invoice-dollar" class="text-negative" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="negative">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">今日交易笔数</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ formatAmount(orderCountData.sevenDayOrderAmount * 0.01) }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">近七天交易金额</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-donate" class="text-primary" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="primary">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">近七天交易金额</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ orderCountData.totalOrderCount }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">截止当前日期</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-chart-bar" class="text-positive" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="positive">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">交易总笔数</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-3 q-pa-md">
          <q-card class="shadow-1">
            <q-card-section :class="$q.dark.isActive ? 'theme_color' : ''" class="q-pa-none">
              <q-item class="q-pb-none q-pt-xs">
                <q-item-section>
                  <q-item-label class="text-h5 text-weight-bolder">{{ orderCountData.totalMchCount }}</q-item-label>
                  <q-item-label class="text-dark text-weight-thin text-overline">截止当前汇总</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-icon name="las la-store-alt" class="text-orange" size="60px"></q-icon>
                </q-item-section>
              </q-item>
              <q-ribbon class="q-pb-md text-center q-mt-md" leaf-position="top" size="full" background-color="orange">
                <div :class="!$q.dark.isActive ? 'text-blue-1 text-subtitle1' : 'text-white text-subtitle1'">商户总数</div>
              </q-ribbon>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="col-4 full-height">
        <q-card bordered flat class="total-radius">
          <q-card-section>
            <div class="text-center">支付接口统计-近七天消费汇总</div>
          </q-card-section>

          <div class="q-px-md">

            <q-select
              outlined
              multiple
              @input="getPayCodeOrderCount"
              use-chips
              label="选择支付渠道"
              v-model="payTab"
              :options="payCodeData"
              dense
              emit-value
              map-options
              option-label="label"
              option-value="value"
            >
            </q-select>
          </div>
          <div class="q-px-md q-mt-md">
            <template-way-count :sevenSummary="sevenWayCodeChartData" />
          </div>
        </q-card>
      </div>
    </div>
    <div class="row full-wdith q-pa-sm">
      <div class="col-12">
        <q-card bordered flat class="total-radius">
          <q-card-section>
            <div class="text-center">支付接口统计-近七天消费汇总</div>
          </q-card-section>
          <template-count :sevenSummary="sevenPayCodeChartData" />
        </q-card>
      </div>
    </div>
    <q-dialog v-model="endTimeStatus" persistent transition-show="scale" transition-hide="scale">
      <q-card style="width: 300px">
        <q-card-section class="text-center">
          <div class="text-h6">
            <q-icon class="q-mx-sm" name="report_problem" color="red"></q-icon>

            到期提醒
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="text-center">
          <div class="text-subtitle2 text-red">当前店铺使用授权已过期</div>
        </q-card-section>

        <q-separator />
        <q-card-actions align="center">
          <q-btn flat class="full-width" @click="logoutAccount">关闭店铺</q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import TemplateCount from './templet-count.vue'
import TemplateWayCount from './templet-way-count.vue'
import { LocalStorage } from 'quasar'
import { removeAllCookies, removeAllLocalStorage } from '@/utils/common'
export default {
  name: 'PageIndex',
  components: {
    TemplateCount,
    TemplateWayCount
  },
  data () {
    return {
      endTimeStatus: false,
      orderCountData: {},
      sevenPayCodeChartData: {},
      sevenWayCodeChartData: {},
      payCodeData: [],
      payTab: []
    }
  },
  created () {
    this.getOrderCount()
    this.isEndTime()

    if (LocalStorage.getItem('hlpay_enum_local')) {
      const enumAllData = LocalStorage.getItem('hlpay_enum_local')
      this.payCodeData = enumAllData && enumAllData.payCodeArr ? enumAllData.payCodeArr : []
      this.waysCodeData = enumAllData && enumAllData.wayCodeArr ? enumAllData.wayCodeArr : []

      if (this.waysCodeData && this.waysCodeData.length > 0) {
        this.$nextTick(() => {
          this.getPayCodeOrderCount()
        })
      }
    }
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  methods: {
    getOrderCount () {
      const obj = {}
      this.$store
        .dispatch('order/getCountData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.orderCountData = res.data ? res.data : {}
            this.sevenPayCodeChartData = res.data ? res.data.sevenPayCodeChartData : {}
            // this.sevenWayCodeChartData = res.data ? res.data.sevenWayCodeChartData : {}
          }
        })
        .catch((error) => {})
    },
    getPayCodeOrderCount () {
      const obj = {
        payCode: this.payTab
      }
      this.$store
        .dispatch('order/getPayCodeCountData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.sevenWayCodeChartData = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    isEndTime () {
      const lib_local_info = this.$q.localStorage.getItem('hlpay_lib_local')
      if (lib_local_info && lib_local_info.store) {
        const store_info = lib_local_info.store
        const nowTime = parseInt(new Date().getTime() / 1000)
        if (parseInt(store_info.end_time) < nowTime) {
          this.endTimeStatus = true
        }
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
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
    },
    authorityMeta (key) {
      const routerData = LocalStorage.getItem('hlpay_router_local')
      const indexKey = _.findIndex(routerData, function (o) {
        return o.name == 'index'
      })
      if (indexKey > -1 && routerData[indexKey] && routerData[indexKey].meta) {
        const new_arr = routerData[indexKey].meta.map((obj) => {
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
<style>
.total-radius {
  border-radius: 10px;
}
</style>
