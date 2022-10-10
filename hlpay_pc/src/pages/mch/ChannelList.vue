<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" full-height persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt($q.screen.width * 0.8) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          支付渠道
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <div class="row q-gutter-xs q-mb-xs">
            <q-btn unelevated label="添加" color="primary" @click="setPayConfig(0, type, related_id)" />

            <q-btn icon="las la-question-circle" round dense flat color="warning">
              <q-tooltip> 每种支付渠道只能配置一次 </q-tooltip>
            </q-btn>
          </div>

          <q-table
            :data="payChannelList"
            :columns="columns"
            row-key="name"
            hide-bottom
            flat
            bordered
            separator="cell"
            :pagination="{
              rowsPerPage: 0,
            }"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="pay_code" :props="props">
                  {{ payCodeObject[props.row.pay_code] }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>

                <q-td key="is_mch_mode" :props="props">
                  <div v-if="authorityMeta('channel-edit')">

                  <q-radio v-if="props.row.isv && props.row.isv.is_mch_mode && parseInt(props.row.isv.is_mch_mode) == 1" v-model="props.row.is_mch_mode" false-value="0" true-value="1" val="1" @input="updatePayConfig(props.row.id, 'is_mch_mode', props.row.is_mch_mode,props.row)" label="普通商户" />
                  <q-radio v-if="props.row.isv && props.row.isv.is_mch_mode && parseInt(props.row.isv.is_isv_mode) == 1" v-model="props.row.is_isv_mode" false-value="0" true-value="1" val="1" @input="updatePayConfig(props.row.id, 'is_isv_mode', props.row.is_isv_mode,props.row)" label="服务商子商户" />
            </div>
                </q-td>

                <q-td key="pay_way_codes" :props="props">
                  <div class="row q-gutter-xs" v-if="props.row.pay_way_codes">
                    <q-badge color="primary" :key="`badge-${key}`" v-for="(item, key) in JSON.parse(props.row.pay_way_codes)">
                      {{ wayCodeObject[item] }}
                    </q-badge>
                  </div>
                </q-td>
                <!-- <q-td key="rate" :props="props">
                  {{ props.row.rate }}
                </q-td> -->
                <q-td key="icon" :props="props">
                   <q-img :src="props.row.icon" ratio="1" width="40px" />
                </q-td>

                <q-td key="state" :props="props">
                  <q-toggle
                    @input="updatePayConfig(props.row.id, 'state', props.row.state)"
                    v-model="props.row.state"
                    false-value="0"
                    true-value="1"
                    v-if="authorityMeta('channel-edit')"
                  />
                </q-td>
                <q-td key="is_get_user_id" :props="props">
                  <q-toggle
                    @input="updatePayConfig(props.row.id, 'is_get_user_id', props.row.is_get_user_id)"
                    v-model="props.row.is_get_user_id"
                    false-value="0"
                    true-value="1"
                    v-if="authorityMeta('channel-edit')"
                  />
                </q-td>

                <q-td key="id" :props="props">
                  <q-btn
                    v-if="authorityMeta('channel-ratio')"
                    color="positive"
                    icon="las la-percentage"
                    round
                    dense
                    flat
                    unelevated
                    @click="setRateConfig(props.row.type, props.row.related_id, props.row.pay_code)"
                  >
                    <q-tooltip> 设置费率 </q-tooltip>
                  </q-btn>
                  <q-btn round @click="setPayConfig(props.row.id, props.row.type, props.row.related_id)" v-if="authorityMeta('channel-edit')" flat color="primary" icon="las la-edit">
                    <q-tooltip> 编辑 </q-tooltip>
                  </q-btn>
                  <q-btn @click="delPayChannel(props.row)" v-if="authorityMeta('channel-del')" round flat color="negative" icon="las la-trash">
                    <q-tooltip> 删除 </q-tooltip>
                  </q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </div>
      </div>
      <rate-config ref="rateConfigRef" @closeDialog="closeDialog" v-if="ratePoppupStatus" />
      <pay-config ref="payConfig" @closeDialog="closeDialog" v-if="payConfigPoppupStatus" />
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'
import PayConfig from './PayConfig.vue'
import RateConfig from './RateConfig.vue'
export default {
  name: 'ChannelList',
  components: {
    PayConfig,
    RateConfig
  },
  data () {
    return {
      columns: [
        {
          name: 'pay_code',
          label: '支付渠道标识',
          align: 'center',
          field: 'pay_code',
          width: '10%'
        },
        {
          name: 'name',
          label: '支付渠道名称',
          align: 'center',
          field: 'name',
          width: '10%'
        },
        {
          name: 'is_mch_mode',
          label: '支持模式',
          align: 'center',
          field: 'is_mch_mode',
          width: '10%'
        },

        {
          name: 'pay_way_codes',
          label: '支持支付方式',
          align: 'center',
          field: 'pay_way_codes',
          width: '10%'
        },
        // {
        //   name: 'rate',
        //   label: '支付渠道费率',
        //   align: 'center',
        //   field: 'rate',
        //   width: '10%'
        // },
        {
          name: 'icon',
          label: '支付图标',
          align: 'center',
          field: 'icon',
          width: '10%'
        },

        {
          name: 'state',
          label: '状态',
          align: 'center',
          field: 'state',
          width: '10%'
        },
        {
          name: 'is_get_user_id',
          label: '是否获取用户ID',
          align: 'center',
          field: 'is_get_user_id',
          width: '10%'
        },

        {
          name: 'id',
          label: '操作',
          align: 'center',
          field: 'id',
          width: '10%'
        }
      ],
      dialogShow: false,
      type: '',
      related_id: '',
      payChannelList: [],
      payConfigPoppupStatus: false,
      payCodeObject: [],
      wayCodeObject: {},
      ratePoppupStatus: false,
      isvId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (type, relatedId, isvId) {
      this.dialogShow = true

      this.type = type
      this.related_id = relatedId

      this.isvId = isvId

      if (LocalStorage.getItem('hlpay_enum_local')) {
        const enumAllData = LocalStorage.getItem('hlpay_enum_local')
        this.payCodeObject = enumAllData && enumAllData.payCodeObject ? enumAllData.payCodeObject : []
        this.wayCodeObject = enumAllData && enumAllData.wayCodeObject ? enumAllData.wayCodeObject : {}
      }
      this.$nextTick(() => {
        this.getList()
      })
    },
    getList () {
      this.$store
        .dispatch('isv/getPayChannelList', {
          type: this.type,
          related_id: this.related_id
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.payChannelList = res.data ? res.data : []
            }
          }
        })
    },
    delPayChannel (data) {
      this.$q
        .dialog({
          title: '确认删除',
          message: '确认删除支付渠道名称为' + data.name + '的信息吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$store
            .dispatch('isv/delPayChannel', {
              configId: data.id
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功！',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.getList()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '删除失败！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
        })
        .onCancel(() => {
          // console.log('Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },
    updatePayConfig (channelId, filed, value) {
      const params = {}
      params.configId = channelId
      if (filed == 'is_mch_mode') {
        params.is_isv_mode = 0
      } else if (filed == 'is_isv_mode') {
        params.is_mch_mode = 0
      }
      params[filed] = value
      this.$store.dispatch('isv/setPayConfig', params).then((res) => {
        if (res.code == 200) {
          this.$nextTick(() => {
            this.getList()
          })
        }
      })
    },
    setPayConfig (configId, type, relatedId) {
      this.payConfigPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.payConfig.init(configId, type, relatedId, this.isvId)
      })
    },
    closeDialog () {
      this.ratePoppupStatus = false
      this.payConfigPoppupStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    setRateConfig (type, relatedId, payCode) {
      this.ratePoppupStatus = true
      this.$nextTick(() => {
        this.$refs.rateConfigRef.init(type, relatedId, payCode)
      })
    },

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
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
