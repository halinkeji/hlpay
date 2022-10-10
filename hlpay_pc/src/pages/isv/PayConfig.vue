<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" full-height persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          支付配置
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-scroll-area class="fit full-height">
            <q-form ref="isvFromRef" class="row q-col-gutter-sm q-pa-sm">
              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  label="选择支付渠道"
                  bottom-slots
                  v-model="payChannelFrom.pay_code"
                  :options="payCodeData"
                  dense
                  emit-value
                  map-options
                  :disable="!!configId"
                  @input="getChannelConfig"
                  :rules="[(val) => !!val || '请选择支付渠道']"
                >
                </q-select>
              </div>

              <div class="col-12 col-md-3">
                <q-input
                  outlined
                  dense
                  label="支付渠道名称"
                  :rules="[(val) => !!val || '必填项']"
                  v-model="payChannelFrom.name"
                  placeholder="请输入支付渠道名称"
                  maxlength="255"
                ></q-input>
              </div>

              <div class="col-12 col-md-3">
                <q-select outlined label="状态" bottom-slots v-model="payChannelFrom.state" :options="stateOptions" dense emit-value map-options>
                </q-select>
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  label="是否支持普通商户模式"
                  bottom-slots
                  v-model="payChannelFrom.is_mch_mode"
                  :options="modeOptions"
                  dense
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  label="是否支持服务商子商户模式"
                  bottom-slots
                  v-model="payChannelFrom.is_isv_mode"
                  :options="modeOptions"
                  dense
                  emit-value
                  map-options
                >
                </q-select>
              </div>

              <div class="col-12 col-md-3">
                <q-img :src="payChannelFrom.icon" width="100px" height="100px">
                  <template v-if="!payChannelFrom.icon">
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>

                  <q-btn
                    round
                    size="md"
                    color="red"
                    v-else
                    :ripple="false"
                    flat
                    class="absolute-top-right"
                    icon="delete_forever"
                    @click="payChannelFrom.icon = ''"
                  ></q-btn>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                    </div>
                  </template>
                </q-img>

                <div class="q-my-sm text-grey-8">支付图标， 建议尺寸： 100 X 100</div>

                <q-btn unelevated color="primary" @click="imageData = true" label="上传图片" />
              </div>

              <div class="col-12 col-md-6">
                <q-input outlined dense label="备注" v-model="payChannelFrom.remark" placeholder="请输入备注" type="textarea" :rows="2"></q-input>
              </div>

              <div class="col-12">
                <label> 支持支付方式：</label>

                <q-checkbox
                  v-model="payChannelFrom.pay_way_codes"
                  checked-icon="las la-check-square"
                  :key="key"
                  v-for="(item, key) in waysCodeData"
                  unchecked-icon="las la-stop"
                  :val="item.value"
                  :label="item.label"
                />
              </div>

              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'wxpay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="微信支付API证书（apiclient_cert.pem）"
                  :valuePath="payChannelFrom.wx_api_cert_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.wx_api_cert_file = val;
                    }
                  "
                ></file-upload>
              </div>
              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'wxpay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="微信支付API私钥文件（apiclient_key.pem）"
                  :valuePath="payChannelFrom.wx_api_pem_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.wx_api_pem_file = val;
                    }
                  "
                ></file-upload>
              </div>
              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'ysfpay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="云闪付服务商私钥文件"
                  :valuePath="payChannelFrom.isv_private_cert_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.isv_private_cert_file = val;
                    }
                  "
                ></file-upload>
              </div>
              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'alipay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="支付宝应用公钥证书"
                  :valuePath="payChannelFrom.alipay_app_public_cert_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.alipay_app_public_cert_file = val;
                    }
                  "
                ></file-upload>
              </div>
              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'alipay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="支付宝公钥证书"
                  :valuePath="payChannelFrom.alipay_public_cert_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.alipay_public_cert_file = val;
                    }
                  "
                ></file-upload>
              </div>
              <div class="col-12 col-md-6" v-if="payChannelFrom.pay_code == 'alipay'">
                <file-upload
                  :relatedId="payChannelFrom.related_id"
                  cardTitle="支付宝根证书"
                  :valuePath="payChannelFrom.alipay_root_cert_file"
                  @filePath="
                    (val) => {
                      payChannelFrom.alipay_root_cert_file = val;
                    }
                  "
                ></file-upload>
              </div>

              <div class="col-12 col-md-6 q-pa-sm"  v-if="parseInt(payChannelFrom.is_isv_mode) == 1">
                <q-card flat bordered class="q-pa-sm">
                  <div class="row items-center">
                    ISV接口配置
                    <q-space />
                    <q-btn color="primary" @click="addParams('isv')" label="添加参数" unelevated />
                  </div>

                  <div class="row items-center q-col-gutter-md" v-for="(item, key) in payChannelFrom.isv_params">
                    <div class="col">
                      <q-input
                        outlined
                        v-model="item.key"
                        :disable="item.type == 'default'"
                        dense
                        :rules="[(val) => !!val || '请输入参数名称']"
                        label="参数名称"
                        class="q-mt-md"
                      />
                    </div>
                    <div class="col">
                      <q-input outlined v-model="item.value" dense :rules="[(val) => !!val || '请输入参数值']" label="参数值" class="q-mt-md" />
                    </div>
                    <div class="col-1">
                      <q-btn
                        color="negative"
                        :disable="item.type == 'default'"
                        dense
                        round
                        flat
                        icon="las la-trash-alt"
                        @click="deleteParams(key, 'isv')"
                        unelevated
                      >
                        <q-tooltip> 删除 </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </div>

              <div class="col-12 col-md-6 q-pa-sm" v-if="parseInt(payChannelFrom.is_mch_mode) == 1">
                <q-card flat bordered class="q-pa-sm">
                  <div class="row items-center">
                    ISV普通商户接口配置
                    <q-space />
                    <q-btn color="primary" @click="addParams('mch')" label="添加参数" unelevated />
                  </div>

                  <div class="row items-center q-col-gutter-md" v-for="(item, key) in payChannelFrom.normal_mch_params">
                    <div class="col">
                      <q-input
                        outlined
                        v-model="item.key"
                        :disable="item.type == 'default'"
                        dense
                        :rules="[(val) => !!val || '请输入参数名称']"
                        label="参数名称"
                        class="q-mt-md"
                      />
                    </div>
                    <div class="col">
                      <q-input outlined v-model="item.value" dense :rules="[(val) => !!val || '请输入参数值']" label="参数值" class="q-mt-md" />
                    </div>
                    <div class="col-1">
                      <q-btn
                        color="negative"
                        :disable="item.type == 'default'"
                        dense
                        round
                        flat
                        icon="las la-trash-alt"
                        @click="deleteParams(key, 'mch')"
                        unelevated
                      >
                        <q-tooltip> 删除 </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </div>

              <!-- <div class="col-12 col-md-6 q-pa-sm" v-if="parseInt(payChannelFrom.is_isv_mode) == 1">
                <q-card flat bordered class="q-pa-sm">
                  <div class="row items-center">
                    特约商户接口配置
                    <q-space />
                    <q-btn color="primary" @click="addParams('subMch')" label="添加参数" unelevated />
                  </div>

                  <div class="row items-center q-col-gutter-md" v-for="(item, key) in payChannelFrom.isvsub_mch_params">
                    <div class="col">
                      <q-input
                        outlined
                        v-model="item.key"
                        :disable="item.type == 'default'"
                        dense
                        :rules="[(val) => !!val || '请输入参数名称']"
                        label="参数名称"
                        class="q-mt-md"
                      />
                    </div>
                    <div class="col">
                      <q-input outlined v-model="item.value" dense :rules="[(val) => !!val || '请输入参数值']" label="参数值" class="q-mt-md" />
                    </div>
                    <div class="col-1">
                      <q-btn
                        color="negative"
                        :disable="item.type == 'default'"
                        dense
                        round
                        flat
                        icon="las la-trash-alt"
                        @click="deleteParams(key, 'subMch')"
                        unelevated
                      >
                        <q-tooltip> 删除 </q-tooltip>
                      </q-btn>
                    </div>
                  </div>
                </q-card>
              </div> -->
            </q-form>
          </q-scroll-area>
        </div>
        <upload-img v-if="imageData" @imageData="getImageData" :multiple="false" @closeUpload="imageData = false"></upload-img>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="保存" @click="saveData()" unelevated class="q-px-xl" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'

export default {
  name: 'PayConfig',
  data () {
    return {
      payChannelFrom: {
        type: '',
        related_id: '',
        pay_code: '',
        name: '',
        is_mch_mode: '',
        is_isv_mode: '',
        normal_mch_params: [],
        isvsub_mch_params: [],
        isv_params: [],
        pay_way_codes: [],
        rate: '',
        isv_private_cert_file: '',
        alipay_app_public_cert_file: '',
        alipay_public_cert_file: '',
        alipay_root_cert_file: '',
        wx_api_cert_file: '',
        wx_api_pem_file: '',
        icon: '',
        state: '',
        remark: ''
      },
      stateOptions: [
        { label: '正常', value: '1' },
        { label: '停用', value: '0' }
      ],
      modeOptions: [
        { label: '支持', value: '1' },
        { label: '不支持', value: '0' }
      ],

      dialogShow: false,
      relatedId: 0,

      payCodeData: [],
      waysCodeData: [],
      configId: 0,
      defaultMchParams: {},
      isvParams: {},
      isvsubMchParams: {},
      imageData: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (configId, type, relatedId) {
      this.payChannelFrom.type = type
      this.payChannelFrom.related_id = relatedId

      if (LocalStorage.getItem('hlpay_enum_local')) {
        const enumAllData = LocalStorage.getItem('hlpay_enum_local')
        this.payCodeData = enumAllData && enumAllData.payCodeArr ? enumAllData.payCodeArr : []
      }

      this.dialogShow = true
      if (configId > 0) {
        this.configId = configId
        this.getItem()
      }
    },

    addParams (type) {
      switch (type) {
        case 'isv':
          this.payChannelFrom.isv_params.push({
            key: '',
            value: '',
            type: 'customize'
          })
          break
        case 'mch':
          this.payChannelFrom.normal_mch_params.push({
            key: '',
            value: '',
            type: 'customize'
          })
          break
        case 'subMch':
          this.payChannelFrom.isvsub_mch_params.push({
            key: '',
            value: '',
            type: 'customize'
          })
          break
      }
    },

    deleteParams (key, type) {
      switch (type) {
        case 'isv':
          this.payChannelFrom.isv_params.splice(key, 1)
          break
        case 'mch':
          this.payChannelFrom.normal_mch_params.splice(key, 1)
          break
        case 'subMch':
          this.payChannelFrom.isvsub_mch_params.splice(key, 1)
          break
      }
    },

    // 获取单条
    getItem () {
      this.$store
        .dispatch('isv/getPayConfig', {
          configId: this.configId
        })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.payChannelFrom = res.data
                ? res.data
                : {
                    type: '',
                    related_id: '',
                    pay_code: '',
                    name: '',
                    is_mch_mode: '',
                    is_isv_mode: '',
                    normal_mch_params: [],
                    isvsub_mch_params: [],
                    isv_params: [],
                    pay_way_codes: [],
                    rate: '',
                    isv_private_cert_file: '',
                    alipay_app_public_cert_file: '',
                    alipay_public_cert_file: '',
                    alipay_root_cert_file: '',
                    wx_api_cert_file: '',
                    wx_api_pem_file: '',
                    icon: '',
                    state: '',
                    remark: ''
                  }

              if (res.data && res.data.isv_params && res.data.isv_params) {
                this.payChannelFrom.isv_params = JSON.parse(res.data.isv_params)
              } else {
                this.payChannelFrom.isv_params = []
              }
              if (res.data && res.data.isvsub_mch_params && res.data.isvsub_mch_params) {
                this.payChannelFrom.isvsub_mch_params = JSON.parse(res.data.isvsub_mch_params)
              } else {
                this.payChannelFrom.isvsub_mch_params = []
              }
              if (res.data && res.data.normal_mch_params && res.data.normal_mch_params) {
                this.payChannelFrom.normal_mch_params = JSON.parse(res.data.normal_mch_params)
              } else {
                this.payChannelFrom.normal_mch_params = []
              }

              if (res.data && res.data.pay_way_codes && res.data.pay_way_codes) {
                this.payChannelFrom.pay_way_codes = JSON.parse(res.data.pay_way_codes)
              } else {
                this.payChannelFrom.pay_way_codes = []
              }
              this.getChannelConfig()
            }
          }
        })
    },

    // 提交
    saveData () {
      this.$refs.isvFromRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.payChannelFrom,
            configId: this.configId
          }
          this.$store
            .dispatch('isv/setPayConfig', obj)
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

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
    },

    getChannelConfig () {
      this.$store
        .dispatch('isv/getChannelConfig', {
          channel: this.payChannelFrom.pay_code
        })
        .then((res) => {
          if (res.code == 200) {
            this.waysCodeData = res.data && res.data.wayCodeData ? res.data.wayCodeData : []
            this.defaultMchParams = res.data && res.data.defaultMchParams ? res.data.defaultMchParams : {}
            this.isvParams = res.data && res.data.isvParams ? res.data.isvParams : {}
            this.isvsubMchParams = res.data && res.data.isvsubMchParams ? res.data.isvsubMchParams : {}
            this.setMchParams()
            this.setIsvParams()
            this.setIsvSubMchParams()
          }
        })
        .catch((err) => {
          console.log('err', err)
        })
    },

    setMchParams () {
      const that = this

      if (that.defaultMchParams && !_.isEmpty(that.defaultMchParams)) {
        for (var i in that.defaultMchParams) {
          const paramsIndex = _.findIndex(that.payChannelFrom.normal_mch_params, function (o) {
            return o.key == i
          })

          if (paramsIndex < 0) {
            that.payChannelFrom.normal_mch_params.push({
              key: i,
              value: '',
              type: 'default'
            })
          }
        }
      }
    },

    setIsvParams () {
      const that = this

      if (that.isvParams && !_.isEmpty(that.isvParams)) {
        for (var i in that.isvParams) {
          const paramsIndex = _.findIndex(that.payChannelFrom.isv_params, function (o) {
            return o.key == i
          })

          if (paramsIndex < 0) {
            that.payChannelFrom.isv_params.push({
              key: i,
              value: '',
              type: 'default'
            })
          }
        }
      }
    },

    setIsvSubMchParams () {
      const that = this

      if (that.isvsubMchParams && !_.isEmpty(that.isvsubMchParams)) {
        for (var i in that.isvsubMchParams) {
          const paramsIndex = _.findIndex(that.payChannelFrom.isvsub_mch_params, function (o) {
            return o.key == i
          })

          if (paramsIndex < 0) {
            that.payChannelFrom.isvsub_mch_params.push({
              key: i,
              value: '',
              type: 'default'
            })
          }
        }
      }
    },

    getImageData (v) {
      this.imageData = false
      if (v) {
        this.payChannelFrom.icon = v[0].base_url
      }
    }
  }
}
</script>
