<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" full-height persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.5) + 'px',
        'max-width': parseInt($q.screen.width * 0.5) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md q-pa-sm q-px-md">
          <div class="text-subtitle1">关联设置</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white row q-px-xs q-pb-md q-pa-sm q-px-md row q-col-gutter-sm">
          <div class="col-6">
            <q-select
              outlined
              label="关联打印机"
              bottom-slots
              v-model="hardwareConfig.printer_id"
              :options="printerListData"
              dense
              emit-value
              map-options
              option-value="id"
              option-label="cp_name"
              class="full-width"
              use-chips
              multiple
              use-input
              fill-input
              @input="clearPrinterInput"
              @filter="filterPrinter"
              ref="printerRef"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> 空 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div class="col-6">
            <q-select
              outlined
              label="关联语音音响"
              bottom-slots
              v-model="hardwareConfig.speaker_id"
              :options="speakerListData"
              dense
              emit-value
              map-options
              option-value="id"
              option-label="psc_name"
              class="full-width"
              use-chips
              multiple
              use-input
              fill-input
              @input="clearSpeakerInput"
              @filter="filterSpeaker"
              ref="speakerRef"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> 空 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white">
          <div class="fit row no-wrap items-stretch content-stretch no-scroll">
            <div class="col-4">
              <q-scroll-area class="fit full-height">
                <div class="printtop">
                  <div v-for="(item, index, key) in templateData">
                    <div v-if="item.status">
                      <div class="text-center" v-if="index == 'logo' || index == 'qrcode'">
                        <q-img
                          :src="`${$q.localStorage.getItem('hlpay_system_local').attachment.cdn_url}` + item.value"
                          width="60px"
                          height="60px"
                        >
                          <template v-if="!item.value">
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                            </div>
                          </template>

                          <template v-slot:error>
                            <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                              <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                            </div>
                          </template>
                        </q-img>
                      </div>

                      <div class="text-center text-h6" v-else-if="index == 'title'">
                        {{ item.value }}
                      </div>
                      <div class="text-center" v-else-if="index == 'foot'">
                        {{ item.value }}
                      </div>

                      <div class="text-center q-my-sm" v-else-if="index == 'brcode'">
                        <q-img width="60%" src="https://cdn.halin.net/download/brcode.png"></q-img>
                      </div>
                      <div class="q-pl-xl" v-else-if="index == 'memberNumber'">
                        {{ item.label }} : {{ parseInt(item.value) == 1 ? '8888****888' : '88888888888' }}
                      </div>
                      <div class="q-pl-xl" v-else>{{ item.label }} : {{ item.value }}</div>
                    </div>
                  </div>
                </div>
                <div class="printfootr"></div>
              </q-scroll-area>
            </div>
            <div class="col-8 full-height">
              <q-form ref="printTemplateFormRef" class="fit">
                <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
                  <q-scroll-area class="fit full-height">
                    <q-card class="q-mt-sm items-center q-pa-md" bordered flat>
                      <div class="row items-start items-center">
                        <div class="col-2">基础设置</div>
                        <div class="col">
                          <q-input
                            outlined
                            dense
                            :rules="[(val) => (val && val > 0 && /(^[1-9]\d*$)/.test(val)) || '请输入正整数']"
                            v-model="hardwareConfig.printer_quantity"
                            label="打印联数"
                            hide-bottom-space
                          />
                        </div>
                        <div class="col q-ml-sm">
                          <q-select
                            outlined
                            dense
                            v-model="hardwareConfig.printer_page_width"
                            :options="['48mm', '58mm', '76mm', '80mm', '88mm', '110mm', 'A4']"
                            label="纸张"
                            hide-bottom-space
                          />
                        </div>
                      </div>
                    </q-card>
                    <q-card class="q-mt-sm items-center row q-pa-md" :key="key" bordered flat v-for="(item, index, key) in templateData">
                      <div class="col-2">
                        {{ item.label }}
                      </div>
                      <div class="col-10 row items-center">
                        <div class="col-2">
                          <q-checkbox label="状态" v-model="item.status" :true-value="1" :false-value="0" />
                        </div>
                        <div class="col-3">
                          <q-input
                            outlined
                            dense
                            :rules="[(val) => /^[0-9]*$/.test(val) || '请输入整数']"
                            @change="sortCompute(templateData)"
                            v-model="item.sort"
                            label="排序"
                            hide-bottom-space
                          />
                        </div>
                        <div class="col-7 q-pl-xs">
                          <div class="row" v-if="index == 'title'">
                            <q-input outlined dense v-model="item.value" label="标题" />
                          </div>
                          <div class="row" v-if="index == 'telephone'">
                            <q-input outlined dense v-model="item.value" label="商家电话" />
                          </div>
                          <div class="row" v-if="index == 'foot'">
                            <q-input outlined dense v-model="item.value" label="自定义脚注" />
                          </div>
                          <div class="row" v-if="index == 'memberNumber'">
                            <q-checkbox label="隐藏部分卡号" v-model="item.value" :true-value="1" :false-value="0" />
                          </div>
                        </div>
                      </div>
                    </q-card>
                  </q-scroll-area>
                </div>
              </q-form>
            </div>

          </div>
        </div>
        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
          <q-btn class="q-px-xl" unelevated label="保存" @click="setStoreHardwareLink" color="primary" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'LinkConfig',
  components: {},
  data () {
    return {
      relatedId: '',
      dialogShow: false,
      hardwareConfig: {
        speaker_id: [],
        printer_id: [],
        printer_template: {},
        mch_id: '',
        printer_quantity: '',
        printer_page_width: '',
        qrcode_template_id: '',
        qrcode_url: '',
        qrcode_rule: {}
      },
      templateData: {
        title: {
          label: '标题',
          name: 'title',
          sort: '1',
          status: 1,
          value: ''
        },

        billcode: {
          label: '单据号',
          name: 'billcode',
          sort: '3',
          status: 1,
          value: 'ZC11164586387010xxxxx974'
        },
        date: {
          label: '日期',
          name: 'date',
          sort: '4',
          status: 1,
          value: '2022年1月1日 20:00:00'
        },

        payType: {
          label: '支付方式',
          name: 'payType',
          sort: '6',
          status: 1,
          value: '90'
        },

        realpay: {
          label: '支付金额（¥）',
          name: 'realpay',
          sort: '8',
          status: 1,
          value: '90'
        },

        // note: {
        //   label: '备注',
        //   name: 'note',
        //   sort: '15',
        //   status: 1,
        //   value: '消费收银'
        // },
        telephone: {
          label: '商家电话',
          name: 'telephone',
          sort: '16',
          status: 1,
          value: ''
        },
        foot: {
          label: '自定义脚注',
          name: 'foot',
          sort: '17',
          status: 1,
          value: ''
        },
        // qrcode: {
        //   label: '二维码',
        //   name: 'qrcode',
        //   sort: '18',
        //   status: 1
        // },
        brcode: {
          label: '订单条形码',
          name: 'brcode',
          sort: '19',
          status: 1
        }
      },
      printerListData: [],
      speakerListData: [],
      allPrinterListData: [],
      allSpeakerListData: []

    }
  },
  created () {},
  mounted () {},
  computed: {

  },
  methods: {

    clearPrinterInput () {
      this.$refs.printerRef.updateInputValue('')
    },

    clearSpeakerInput () {
      this.$refs.speakerRef.updateInputValue('')
    },
    init (relatedId) {
      this.dialogShow = true
      this.getConfigList()
      this.relatedId = relatedId
      this.$nextTick(() => {
        this.getItem()
      })
    },

    filterPrinter (val, update, abort) {
      if (val === '') {
        update(() => {
          this.printerListData = this.allPrinterListData
        })
        return
      }

      update(() => {
        this.printerListData = _.filter(this.allPrinterListData, function (o) {
          return o.cp_name.indexOf(val) > -1
        })
      })
    },
    filterSpeaker (val, update, abort) {
      if (val === '') {
        update(() => {
          this.speakerListData = this.allSpeakerListData
        })
        return
      }

      update(() => {
        this.speakerListData = _.filter(this.allSpeakerListData, function (o) {
          return o.psc_name.indexOf(val) > -1
        })
      })
    },

    getConfigList () {
      this.$store.dispatch('isv/getHardwareList').then((res) => {
        if (res.code == 200) {
          this.printerListData = res.data && res.data.printerList ? res.data.printerList : []
          this.allPrinterListData = res.data && res.data.printerList ? res.data.printerList : []

          this.speakerListData = res.data && res.data.speakerList ? res.data.speakerList : []

          this.allSpeakerListData = res.data && res.data.speakerList ? res.data.speakerList : []

          this.qrcodeTemplateList = res.data && res.data.qrcodeTemplateList ? res.data.qrcodeTemplateList : []
          this.allTemplateListData = res.data && res.data.qrcodeTemplateList ? res.data.qrcodeTemplateList : []
        }
      })
    },

    getItem () {
      this.$store
        .dispatch('isv/getStoreHardwareLink', {
          relatedId: this.relatedId
        })
        .then((res) => {
          if (res.code == 200) {
            this.hardwareConfig = res.data
              ? res.data
              : {
                  speaker_id: [],
                  printer_id: [],
                  printer_template: {},
                  mch_id: '',
                  printer_quantity: '',
                  printer_page_width: ''
                }

            for (const i in this.templateData) {
              const data = this.hardwareConfig.printer_template[i] ? this.hardwareConfig.printer_template[i] : {}

              if (data.sort) {
                this.templateData[i].sort = data.sort
              }
              if (data.sort) {
                this.templateData[i].status = data.status
              }
              if (data.value) {
                this.templateData[i].value = data.value
              }
            }
          }
        })
    },

    sortCompute (templateParams) {
      const info = []
      for (const i in templateParams) {
        info.push({
          sort: templateParams[i].sort,
          key: i
        })
      }
      const newTemplate = info.sort(this.compare('sort'))
      this.templateData = {}
      if (newTemplate && newTemplate.length > 0) {
        for (let i = 0; i < newTemplate.length; i++) {
          this.templateData[newTemplate[i].key] = templateParams[newTemplate[i].key]
        }
      }
    },

    compare (property) {
      return function (a, b) {
        const value1 = a[property]
        const value2 = b[property]
        return value1 - value2
      }
    },

    setStoreHardwareLink () {
      this.hardwareConfig.mch_id = this.relatedId

      this.hardwareConfig.printer_template = this.templateData

      this.$store
        .dispatch('isv/setStoreHardwareLink', {
          ...this.hardwareConfig
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '保存成功！',
              color: 'green'
            })
            this.hideNowPage()
          } else {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '保存失败',
              color: 'red'
            })
          }
        })
    },

    hideNowPage () {
      this.dialogShow = false
      this.$emit('closeDialog')
    }

  }
}
</script>
<style>
.printtop {
  width: 100%;
  min-height: 140px;
  height: auto;
  padding-top: 50px;
  background: url(https://img.yunvip123.com/CmemberFile/Image/Printtop-ico.png);
  background-position: center top;
  background-repeat: no-repeat;
  background-size: contain;
}
.printfootr {
  width: 100%;
  height: 35px;
  background: url(https://img.yunvip123.com/CmemberFile/Image/Printfootr-ico.png);
  background-position: center top;
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
