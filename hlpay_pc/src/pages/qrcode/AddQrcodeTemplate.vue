<template>
  <q-dialog @hide="hideNowPage" v-model="addConfig" persistent position="top">
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.9) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.9) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row q-pa-sm items-center">
          <div class="text-subtitle2">{{ dataId > 0 ? '修改' : '新增' }}模板</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white q-px-xs full-height">
          <div class="row q-pa-sm fit">
            <q-scroll-area class=" full-height col-md-6">
              <q-form ref="templateFormRef" class=" row q-col-gutter-sm">
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    hide-bottom-space
                    v-model="templateData.name"
                    placeholder="请输入模板名称"
                    label="模板名称"
                    lazy-rules
                    :rules="[(val) => !!val || '模板名称不能为空']"
                    maxlength="100"
                  />
                </div>
                <!-- <div class="col-6">
              <q-select
                dense
                label="选择渲染模板"
                outlined
                v-model="templateData.type"
                disable
                :options="[
                  {
                    label: '模板一',
                    value: 'A',
                  },
                  {
                    label: '模板二',
                    value: 'B',
                  },
                ]"
              />
            </div> -->
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    hide-bottom-space
                    v-model="templateData.title"
                    placeholder="请输入欢迎词"
                    label="欢迎词"
                    lazy-rules
                    :rules="[(val) => !!val || '欢迎词不能为空']"
                    maxlength="6"
                    @change="returnPaintingView"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    label="是否显示商户号"
                    dense
                    outlined
                    v-model="templateData.show_mch_id"
                    :options="[
                      {
                        label: '显示',
                        value: '1',
                      },
                      {
                        label: '隐藏',
                        value: '0',
                      },
                    ]"
                    @input="returnPaintingView"
                    map-options
                    option-value="value"
                    option-label="label"
                    emit-value
                  />
                </div>
                <div class="col-6">
                  <q-input dense color="grey-3" readonly outlined v-model="templateData.bg_color" label="背景颜色">
                    <template v-slot:append>
                      <q-icon name="las la-palette" class="cursor-pointer">
                        <q-popup-proxy transition-show="scale" transition-hide="scale">
                          <q-color
                            @input="setPaintingBackground(templateData.bg_color)"
                            v-model="templateData.bg_color"
                            no-header
                            no-footer
                            default-view="palette"
                            class="my-picker"
                          />
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="col-6">
                  <q-img :src="templateData.logo" width="100px" height="100px">
                    <template v-if="!templateData.logo">
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
                      @click="deleteImage('logo')"
                    ></q-btn>
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                        <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                      </div>
                    </template>
                  </q-img>

                  <div class="q-my-sm text-grey-8">主logo显示在顶部， 建议尺寸： 340 X 120</div>

                  <q-btn unelevated color="primary" @click="uplodImgSubmit('logo')" label="上传图片" />
                </div>
                <div class="col-6">
                  <q-img :src="templateData.in_qrcode_logo" width="100px" height="100px">
                    <template v-if="!templateData.in_qrcode_logo">
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

                      @click="deleteImage('in_qrcode_logo')"
                    ></q-btn>
                    <template v-slot:error>
                      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                        <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                      </div>
                    </template>
                  </q-img>

                  <div class="q-my-sm text-grey-8">二维码上的logo建议尺寸： 100 X 100</div>

                  <q-btn unelevated color="primary" @click="uplodImgSubmit('in_qrcode_logo')" label="上传图片" />
                </div>
                <div class="col-10">
                  <q-card flat bordered class="full-width">
                    <q-card-section>
                      <div class="text-subtitle2">支付渠道</div>
                    </q-card-section>
                    <q-list separator bordered padding>
                      <q-item v-for="(item, key) in templateData.show_channel" :key="'channel' + key">
                        <q-item-section>
                          <q-select
                            outlined
                            label="选择支付渠道"
                            bottom-slots
                            v-model="item.pay_code"
                            :options="payCodeData"
                            dense
                            emit-value
                            map-options
                            hide-bottom-space
                          >
                          </q-select>
                        </q-item-section>
                        <q-item-section class="row justify-center">
                          <div class="text-center">
                            <q-img :src="item.image" width="60px" height="60px">
                              <template v-if="!item.image">
                                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                                  <q-icon name="wallpaper" color="grey" size="30px"> </q-icon>
                                </div>
                              </template>

                              <!-- <q-btn
                                round
                                size="md"
                                color="red"
                                v-else
                                :ripple="false"
                                flat
                                class="absolute-top-right"
                                icon="delete_forever"
                                @click="item.image = ''"
                              ></q-btn> -->
                              <template v-slot:error>
                                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                                  <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                                </div>
                              </template>
                            </q-img>
                          </div>

                          <div class="q-my-sm text-grey-8 text-center">支付渠道图标， 建议尺寸： 120 X 120</div>
                          <div class="text-center">
                            <q-btn unelevated color="primary" @click="uplodImgSubmit(null, key)" label="上传图片" />
                          </div>
                        </q-item-section>
                        <q-item-section side>
                          <q-btn flat round dense color="negative" @click="deletePayment(key)" icon="las la-trash" />
                        </q-item-section>
                      </q-item>
                    </q-list>
                    <q-card-actions align="center" v-if="templateData.show_channel && templateData.show_channel.length <= 5">
                      <q-btn unelevated color="primary" class="q-px-sm" @click="addChannel">新增</q-btn>
                    </q-card-actions>
                  </q-card>
                </div>

                <upload-img v-if="imageData" @imageData="getImageData" :multiple="false" @closeUpload="closeUpload"></upload-img>
              </q-form>
            </q-scroll-area>
            <div class="col-12 col-md-6 flex flex-center">
              <q-card flat>
                <img crossOrigin="anonymous" :src="templateData.base64_url"  style="max-width: 400px; max-height: 600px"  />
                <vue-canvas-poster :painting="painting" @success="success" @fail="fail"></vue-canvas-poster>
              </q-card>
            </div>
          </div>
        </div>
        <vue-qr  v-show="false" :logoSrc="templateData.in_qrcode_logo" :callback="getQrcodeUrl" text="演示" :size="800"></vue-qr>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated :disable="btnDisable" label="提交" @click="saveData()" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" @click="hideNowPage()" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import VueQr from 'vue-qr'
import { LocalStorage } from 'quasar'
export default {
  name: 'AddQrcodeTemplate',
  components: {
    VueQr
  },
  data () {
    return {
      chooseVisible: false,
      addConfig: false,
      dataId: 0,
      templateData: {
        name: '',
        title: '',
        type: 'A',
        show_mch_id: '1',
        bg_color: '#027be3',
        logo: '',
        in_qrcode_logo: '',
        show_channel: [],
        base64_url: '',
        poster_rule: ''
      },
      painting: {
        width: '400px',
        height: '500px',
        borderRadius: '30px',
        background: '#027be3',
        views: []
      },

      btnDisable: false,
      payCodeData: [],
      imageData: false,
      templateField: '',
      channelKey: -1,
      in_qrcode_logo: ''
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    getQrcodeUrl (dataUrl, id) {
      this.in_qrcode_url = dataUrl
      this.$nextTick(() => {
        this.returnPaintingView()
      })
    },
    closeUpload (v) {
      this.imageData = false
    },
    uplodImgSubmit (field, key = -1) {
      this.templateField = field
      this.channelKey = key
      this.imageData = true
    },
    getImageData (v) {
      this.imageData = false
      if (this.templateField) {
        if (v) {
          this.templateData[this.templateField] = v[0].base_url + `?timestamp=${Date.now()}`
        }
      } else {
        if (this.channelKey > -1) {
          this.templateData.show_channel[this.channelKey].image = v[0].base_url + `?timestamp=${Date.now()}`
        }
      }
      this.returnPaintingView()
    },
    success (src) {
      this.templateData.base64_url = src
    },
    fail (err) {
      console.log('fail', err)
    },
    getItem (id) {
      this.dataId = id
      this.addConfig = true

      if (LocalStorage.getItem('hlpay_enum_local')) {
        const enumAllData = LocalStorage.getItem('hlpay_enum_local')
        this.payCodeData = enumAllData && enumAllData.payCodeArr ? enumAllData.payCodeArr : []
      }

      if (id > 0) {
        this.$store.dispatch('qrcode/getItem', id).then((res) => {
          if (res.code == 200 && res.data) {
            this.templateData = res.data
            if (res.data.show_channel) {
              this.templateData.show_channel = JSON.parse(res.data.show_channel)
            }
            this.returnPaintingView()
          }
        })
      } else {
        this.returnPaintingView()
      }
    },
    saveData () {
      this.$refs.templateFormRef.validate().then((success) => {
        if (success) {
          this.btnDisable = true
          this.templateData.poster_rule = this.painting
          const obj = {
            ...this.templateData,
            id: this.dataId
          }
          this.$store
            .dispatch('qrcode/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}音箱成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.btnDisable = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.btnDisable = false
            })
        }
      })
    },

    addChannel () {
      if (this.templateData.show_channel && this.templateData.show_channel.length <= 5) {
        this.templateData.show_channel.push({
          pay_code: '',
          image: ''
        })
      }
      this.returnPaintingView()
    },

    deletePayment (key) {
      if (key > -1) {
        this.templateData.show_channel.splice(key, 1)
      }
      this.returnPaintingView()
    },

    computeImgPosition (channel) {
      const channelPosition = []
      if (channel && channel.length > 0) {
        const margin = (400 - channel.length * 50) / (channel.length + 1)
        for (let i = 1; i <= channel.length; i++) {
          channelPosition.push({
            left: margin * i + 50 * (i - 1) + 'px',
            image: channel[i - 1].image
          })
        }
      }
      return channelPosition
    },

    setPaintingBackground (value) {
      this.painting.background = value
    },

    returnPaintingView () {
      const that = this
      const viewData = [
        {
          type: 'rect',
          css: {
            top: '420px',
            left: '0',
            color: '#f2f2f2',
            width: '400px',
            height: '80px',
            borderRadius: '0px 0px 30px 30px'
          }
        },

        {
          type: 'rect',
          css: {
            top: '80px',
            left: '50px',
            color: '#ffffff',
            width: '300px',
            height: '300px'
          }
        },

        {
          type: 'image',
          url: this.in_qrcode_url,
          content: '演示',
          qrcode: 1,
          css: {
            top: '135px',
            left: '100px',
            color: '#000',
            width: '200px',
            height: '200px'
          }
        }
      ]

      if (parseInt(this.templateData.show_mch_id) == 1) {
        viewData.push({
          type: 'text',
          text: '商户号 No.220712010001',
          field: 'mch_id',
          css: [
            {
              top: '360px',
              left: '138px',
              fontSize: '10px',
              fontWeight: 'bold'
            }
          ]
        })
      }

      if (this.templateData.title) {
        viewData.push({
          type: 'text',
          text: this.templateData.title,
          css: [
            {
              top: '95px',
              left: '140px',
              fontSize: '20px',
              fontWeight: 'bold'
            }
          ]
        })
      }

      if (this.templateData.logo) {
        viewData.push({
          type: 'image',
          url: this.templateData.logo,
          css: {
            width: '300px',
            height: '50px',
            mode: 'aspectFill',
            top: '15px',
            left: '50px'
          }
        })
      }

      // if (this.templateData.in_qrcode_logo) {
      //   viewData.push({
      //     type: 'image',
      //     url: this.templateData.in_qrcode_logo,
      //     css: {
      //       width: '60px',
      //       height: '60px',
      //       mode: 'aspectFill',
      //       top: '200px',
      //       left: '170px',
      //       borderRadius: '15px',
      //       background: '#027be3'
      //     }
      //   })
      // }

      if (that.templateData.show_channel && this.templateData.show_channel.length > 0) {
        const channelPosition = that.computeImgPosition(that.templateData.show_channel)

        for (let i = 0; i < channelPosition.length; i++) {
          viewData.push({
            type: 'image',
            url: channelPosition[i].image + `?timestamp=${Date.now()}`,
            css: {
              width: '50px',
              height: '50px',
              mode: 'scaleToFill',
              top: '435px',
              left: channelPosition[i].left,
              borderRadius: '15px'
            }
          })
        }
      }
      this.setPaintingBackground(that.templateData.bg_color)
      this.setPaintingViews(viewData)
    },
    deleteImage (field) {
      this.templateData[field] = ''
      this.$nextTick(() => {
        this.returnPaintingView()
      })
    },

    setPaintingViews (views) {
      this.painting.views = views
    },
    // 关闭
    closeChooseGoods () {
      this.chooseVisible = false
      // this.addConfig = true;
    },
    hideNowPage () {
      this.$emit('getMethods')
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
