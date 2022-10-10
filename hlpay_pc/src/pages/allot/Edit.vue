<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row items-center">
          {{ receiversId ? '编辑' : '修改' }}接收方
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="q-pa-sm full-height bg-white q-mt-xs">
          <q-scroll-area class="fit full-height">
            <q-form ref="receiversFormRef" class="row q-col-gutter-sm q-pa-sm">
              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  label="分账账号名称"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="receiversFormData.name"
                  placeholder="请输入分账账号名称"
                  maxlength="64"
                ></q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-select outlined label="状态" bottom-slots v-model="receiversFormData.state" :options="statusOptions" dense emit-value map-options>
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="分账接收账号类型"
                  bottom-slots
                  v-model="receiversFormData.receiver_type"
                  :options="receiverTypeOptions"
                  dense
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="选择服务商"
                  option-value="isv_id"
                  option-label="isv_name"
                  @input="getAllMch"
                  bottom-slots
                  v-model="receiversFormData.isv_id"
                  :rules="[(val) => !!val || '必填项']"
                  :options="isvListData"
                  dense
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="选择商户"
                  bottom-slots
                  v-model="receiversFormData.mch_id"
                  :options="mchAllList"
                  @input="getChannelAndMch"
                  dense
                  emit-value
                  map-options
                  option-label="mch_name"
                  :rules="[(val) => !!val || '必填项']"
                  option-value="mch_id"
                >
                </q-select>
              </div>
              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="支付渠道"
                  bottom-slots
                  v-model="receiversFormData.pay_code"
                  :options="channelListData"
                  dense
                  emit-value
                  map-options
                  option-label="name"
                  option-value="pay_code"
                >
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="分组"
                  bottom-slots
                  v-model="receiversFormData.allot_receiver_group_id"
                  :options="groupDataOptions"
                  dense
                  emit-value
                  map-options
                  option-label="name"
                  option-value="id"
                  @input="getAllotProfit"
                  :hint="`剩余分账比例 ${lastallotProfit} %`"
                >
                </q-select>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  label="分账比例"
                  :rules="[
                        (val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,6})?$/.test(val) && val >= 1 && val <= 100 : true) || '请输入正确的数值'
                  ]"
                  v-model="receiversFormData.allot_receiver_profit"
                  placeholder="请输入分账比例"
                  maxlength="64"
                  hint="保留小数点后 6 位"
                >
                  <template v-slot:append> % </template></q-input
                >
              </div>

              <!-- ,
                        (val) => val < lastallotProfit || '不能大于剩余分账比例' -->

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  disable
                  label="分账接收账号"
                  v-model="receiversFormData.receiver_id"
                  placeholder="请输入分账接收账号"
                  maxlength="64"
                ></q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-input
                  outlined
                  dense
                  label="分账接收账号名称"
                  disable
                  v-model="receiversFormData.receiver_name"
                  placeholder="请输入分账接收账号名称"
                  maxlength="64"
                ></q-input>
              </div>

              <div class="col-12 col-md-6">
                <q-select
                  outlined
                  label="选择关系类型"
                  bottom-slots
                  v-model="receiversFormData.relation_type"
                  :options="relationTypeOptions"
                  dense
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                >
                </q-select>
              </div>

              <div class="col-12 col-md-6" v-if="receiversFormData.relation_type == 'CUSTOM'">
                <q-input
                  outlined
                  dense
                  label="关系自定义名称"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="receiversFormData.relation_type_name"
                  placeholder="请输入关系自定义名称"
                  maxlength="64"
                ></q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-item>
                    <q-item-section>
                      <q-item-label>支付渠道绑定返回信息</q-item-label>
                      <q-item-label caption v-if="receiversFormData.bind_success_time"
                        >绑定成功时间{{ $q_date.formatDate(parseInt(receiversFormData.bind_success_time), 'YYYY-MM-DD HH:mm:ss') }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-separator />
                  <q-card-section>
                    <vue-json-viewer :value="receiversFormData.channel_bind_result"></vue-json-viewer>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered class="q-pa-sm">
                  <div class="row items-center">
                    支付渠道扩展参数
                    <q-space />
                    <q-btn color="primary" @click="addParams" label="添加参数" unelevated />
                  </div>

                  <div class="row items-center q-col-gutter-md" v-for="(item, key) in receiversFormData.channel_extra_param">
                    <div class="col">
                      <q-input outlined v-model="item.key" dense :rules="[(val) => !!val || '请输入参数名称']" label="参数名称" class="q-mt-md" />
                    </div>
                    <div class="col">
                      <q-input outlined v-model="item.value" dense :rules="[(val) => !!val || '请输入参数值']" label="参数值" class="q-mt-md" />
                    </div>
                    <div class="col-1">
                      <q-btn color="negative" dense round flat icon="las la-trash-alt" @click="deleteParams(key)" unelevated>
                        <q-tooltip> 删除 </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="保存" @click="saveData()" unelevated class="q-px-xl" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AllotGroupEdit',
  data () {
    return {
      receiversFormData: {
        name: '',
        allot_receiver_group_id: '',
        isv_id: '',
        mch_id: '',
        pay_code: '',
        receiver_type: '', //
        receiver_id: '',
        receiver_name: '',
        relation_type: '',
        relation_type_name: '',
        allot_receiver_profit: '',
        state: '1',
        channel_bind_result: {},
        channel_extra_param: [],
        bind_success_time: ''
      },

      dialogShow: false,
      receiversId: 0,
      isvListData: [],
      mchAllList: [],
      channelListData: [],
      groupDataOptions: [],
      relationTypeOptions: [],
      receiverTypeOptions: [
        { label: '商户(对公)', value: '1' },
        { label: '个人(对私)', value: '0' }
      ],
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      lastallotProfit: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (receiversId) {
      this.dialogShow = true

      if (LocalStorage.getItem('hlpay_enum_local')) {
        const enumAllData = LocalStorage.getItem('hlpay_enum_local')
        this.relationTypeOptions = enumAllData && enumAllData.relationTypeArr ? enumAllData.relationTypeArr : []
      }
      this.getAllIsvList()

      if (receiversId > 0) {
        this.receiversId = receiversId

        this.getItem()
      }
    },
    getAllIsvList () {
      this.$store
        .dispatch('isv/getAllIsv')
        .then((res) => {
          if (res.code == 200) {
            this.isvListData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    // 获取全部商户
    getAllMch () {
      if (!this.receiversFormData.isv_id) {
        return false
      }

      this.groupDataOptions = []
      this.channelListData = []
      this.mchAllList = []
      this.receiversFormData.pay_code = ''
      this.receiversFormData.allot_receiver_group_id = ''
      this.receiversFormData.mch_id = ''

      this.$store
        .dispatch('mch/getAllMch', {
          isv_id: this.receiversFormData.isv_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.mchAllList = res.data ? res.data : []
          }
        })
    },

    getChannelAndMch () {
      if (!this.receiversFormData.mch_id) {
        return false
      }

      this.receiversFormData.pay_code = ''
      this.receiversFormData.allot_receiver_group_id = ''
      this.groupDataOptions = []
      this.channelListData = []

      this.$store
        .dispatch('allot/getChannelAndGroup', {
          mch_id: this.receiversFormData.mch_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.groupDataOptions = res.data && res.data.groupData ? res.data.groupData : []
            this.channelListData = res.data && res.data.channelListData ? res.data.channelListData : []
          }
        })
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('allot/getReceiversItem', this.receiversId).then((res) => {
        if (res.code == 200) {
          if (res.data && res.data.info && res.data.info.id) {
            const receiversFormData = res.data.info
            this.receiversFormData = receiversFormData

            if (receiversFormData.channel_extra_param && receiversFormData.channel_extra_param) {
              this.receiversFormData.channel_extra_param = JSON.parse(receiversFormData.channel_extra_param)
            } else {
              this.receiversFormData.channel_extra_param = []
            }

            if (receiversFormData.channel_bind_result && receiversFormData.channel_bind_result) {
              this.receiversFormData.channel_bind_result = JSON.parse(receiversFormData.channel_bind_result)
            } else {
              this.receiversFormData.channel_bind_result = {}
            }
            this.groupDataOptions = res.data && res.data.groupData ? res.data.groupData : []
            this.channelListData = res.data && res.data.channelListData ? res.data.channelListData : []
            this.mchAllList = res.data && res.data.mchAllList ? res.data.mchAllList : []

            this.getAllotProfit()
          }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.receiversFormRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.receiversFormData,
            receiversId: this.receiversId
          }
          this.$store
            .dispatch('allot/saveReceiversData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功！',
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
        }
      })
    },

    addParams () {
      this.receiversFormData.channel_extra_param.push({
        key: '',
        value: ''
      })
    },

    deleteParams (key) {
      this.receiversFormData.channel_extra_param.splice(key, 1)
    },

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
    },

    getAllotProfit () {
      const that = this

      if (that.receiversFormData.allot_receiver_group_id) {
        const findIndex = _.findIndex(that.groupDataOptions, function (o) { return parseInt(o.id) == parseInt(that.receiversFormData.allot_receiver_group_id) })

        if (findIndex > -1) {
          that.lastallotProfit = that.groupDataOptions[findIndex].lastProportion
        }
      }
    }
  }
}
</script>
