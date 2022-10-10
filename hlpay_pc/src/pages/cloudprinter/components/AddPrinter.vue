<template>
  <q-dialog v-model="printerDialogStatus" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.6) + 'px',
        'max-width': parseInt($q.screen.width * 0.6) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          {{ $route.query.id > 0 ? '修改' : '新增' }}打印机
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-form ref="printerDataRef" class="q-gutter-md">
              <div class="text-subtitle2 q-ml-md">基础信息</div>
              <q-separator />
              <!-- 基础设置第一行 -->
              <div class="row q-col-gutter-xs">
                <div class="col-12 col-md-4">
                  <q-input
                    outlined
                    dense
                    v-model="printerData.cp_name"
                    label="打印机名称"
                    maxlength="255"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '打印机名称不能为空']"
                  />
                </div>

                <div class="col-12 col-md-4">
                  <q-select
                    outlined
                    label="状态"
                    bottom-slots
                    v-model="printerData.cp_status"
                    :options="[
                      { label: '开启', value: '1' },
                      { label: '关闭', value: '0' },
                    ]"
                    dense
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>

                <div class="col-12 col-md-4">
                  <q-select
                    outlined
                    label="打印机类型"
                    bottom-slots
                    v-model="printerData.cp_model"
                    :options="printerModlData"
                    dense
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
                <div class="col-12 col-md-4">
                  <q-select
                    outlined
                    label="打印机属性"
                    bottom-slots
                    v-model="printerData.cp_property"
                    :options="printerPropertyData"
                    dense
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
              </div>
              <div class="text-subtitle2 q-ml-md">参数设置</div>
              <q-separator />

              <div class="row">
                <div class="col-12 col-md-6">
                  <q-select
                    outlined
                    label="选择打印机品牌"
                    @input="changePrinterShared"
                    bottom-slots
                    v-model="printerData.cp_shared"
                    option-label="label"
                    option-value="value"
                    :options="printerSharedData"
                    dense
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
              </div>

              <div v-if="printerData.cp_shared == 'yilianyun'">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-4">
                    <q-input
                      outlined
                      dense
                      v-model="printerData.cp_machinecode"
                      label="终端编号"
                      lazy-rules
                      maxlength="255"
                      :rules="[(val) => (val && val.length > 0) || '打印机终端编号不能为空']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      outlined
                      dense
                      v-model="printerData.cp_msign"
                      label="终端密钥"
                      lazy-rules
                      maxlength="255"
                      :rules="[(val) => (val && val.length > 0) || '终端密钥不能为空']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      outlined
                      dense
                      v-model="printerData.cp_partner"
                      label="用户ID"
                      lazy-rules
                      maxlength="255"
                      :rules="[(val) => !!val || '请填写用户ID', (val) => /^[0-9]*$/.test(val) || '请填写正确的ID']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input
                      outlined
                      dense
                      v-model="printerData.cp_apikey"
                      label="apiKey"
                      lazy-rules
                      maxlength="255"
                      :rules="[(val) => (val && val.length > 0) || 'apiKey不能为空']"
                    />
                  </div>
                  <div class="col-12 col-md-4">
                    <q-input outlined dense v-model="printerData.cp_apiurl" disable label="URL" :error="false" />
                  </div>
                </div>
              </div>
              <div v-if="printerData.cp_shared == 'wuba'">
                <div class="row q-col-gutter-sm">
                  <div class="col-12 col-md-6">
                    <q-select
                      outlined
                      label="选择打印机"
                      bottom-slots
                      v-model="printerData.cp_local_printer"
                      option-label="displayName"
                      option-value="displayName"
                      :options="localPrintData"
                      dense
                      emit-value
                      map-options
                    >
                    </q-select>
                  </div>
                </div>
              </div>

            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-md q-mt-xs text-center q-gutter-md">
          <q-btn label="提交" unelevated @click="saveData()" color="primary" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddCloudPrinter',
  components: {},
  data () {
    return {
      printerDialogStatus: false,
      printerData: {
        cp_type: 1,
        cp_status: '1',
        cp_codeQR: 2,
        cp_barcode: 2,
        cp_msign: '',
        cp_partner: '',
        cp_apiurl: 'http://open.10ss.net:8888',
        cp_times: '',
        cp_apikey: '',
        cp_name: '',
        cp_model: '',
        cp_property: '',
        cp_machinecode: '',
        cp_invoiceBottomContent: '',
        cp_bindType: [],
        cp_phone: 1,
        cp_shared: '',
        cp_local_printer: ''
      },

      printerModlData: this.$store.state.cloudprinter.printerModlData,
      printerPropertyData: this.$store.state.cloudprinter.printerPropertyData,
      printerSharedData: this.$store.state.cloudprinter.printerSharedData,
      localPrintData: []

    }
  },
  mounted () {},
  computed: {},
  created () {
    this.changePrinterShared()
  },
  methods: {

    init (id) {
      this.printerDialogStatus = true
      if (id > 0) {
        this.printerId = id
        this.getItem()
      }
    },
    getItem () {
      this.$store.dispatch('cloudprinter/getItem', this.printerId).then((res) => {
        if (res.code == 200) {
          const data = res.data

          data.cp_bindType = data.cp_bindType ? JSON.parse(data.cp_bindType) : []

          this.printerData = data
        }
      })
    },
    saveData () {
      this.$refs.printerDataRef.validate().then((success) => {
        if (success) {
          const printerData = this.printerData

          if (printerData.cp_bindType) {
            printerData.cp_bindType = JSON.stringify(printerData.cp_bindType)
          }
          const obj = {
            id: this.$route.query.id,
            ...printerData
          }
          this.$store
            .dispatch('cloudprinter/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.query.id > 0 ? '修改' : '新增'}` + '打印机信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.$emit('closeDialog')
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },

    changePrinterShared () {
      if (process.env.MODE === 'electron') {
        const { remote } = require('electron')
        const webContents = remote.getCurrentWebContents()
        this.localPrintData = webContents.getPrinters() // list the printers
      }
    },

    hideNowPage () {
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
