<template>
  <div class="q-gutter-xs">
    <q-btn color="accent" icon="las la-link" v-if="authorityMeta('link-set')" round dense flat unelevated @click="setHardwareLink">
      <q-tooltip> 关联设置 </q-tooltip>
    </q-btn>
    <q-btn color="green" icon="las la-qrcode" v-if="authorityMeta('qrcode')" round dense flat unelevated @click="openQrcode">
      <q-tooltip> 码牌 </q-tooltip>
    </q-btn>
    <q-btn color="warning" icon="las la-share-alt" v-if="authorityMeta('channel')" round dense flat unelevated @click="setPayConfig">
      <q-tooltip> 支付渠道 </q-tooltip>
    </q-btn>

    <q-btn color="secondary" icon="las la-store-alt" v-if="authorityMeta('store')" round dense flat unelevated @click="setBindStore">
      <q-tooltip> 绑定门店 </q-tooltip>
    </q-btn>
    <q-btn color="primary" icon="lar la-edit" v-if="authorityMeta('edit')" round dense flat unelevated @click="setData">
      <q-tooltip> 修改 </q-tooltip>
    </q-btn>
    <q-btn color="red" icon="las la-trash" v-if="authorityMeta('del')" round dense flat unelevated @click="confirmDeleteRecord">
      <q-tooltip> 删除 </q-tooltip>
    </q-btn>

    <q-dialog v-model="showCodeStatus">
      <q-card
        class="q-pa-md"
        :style="{
          width: $q.screen.width * 0.3 + 'px',
          'max-width': $q.screen.width * 0.3 + 'px',
        }"
      >
        <div class="full-width row justify-center">
          <div class="text-subtitle2">
            码牌
          </div>
          <q-space />
          <q-btn flat round dense color="dark" icon="close" @click="showCodeStatus = false" />
        </div>

        <q-select
          outlined
          label="关联码牌"
          bottom-slots
          v-model="hardwareConfig.qrcode_template_id"
          :options="qrcodeTemplateList"
          dense
          emit-value
          map-options
          option-value="id"
          option-label="name"
          class="full-width"
          fill-input
          @clear="clearQrcode"
          @input="createQrcode"
          @filter="filterQrcodeTemplate"
          ref="qrcodeTemplateRef"
          clearable
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey"> 空 </q-item-section>
            </q-item>
          </template>
        </q-select>
        <q-card-section class="row justify-center">
           <img crossOrigin="anonymous" :src="hardwareConfig.qrcode_url" id="collectionCode" style="max-width: 400px; max-height: 600px"  />
          <vue-canvas-poster :painting="hardwareConfig.qrcode_rule" id="payCodePosterRef" @success="success" @fail="fail"></vue-canvas-poster>
        </q-card-section>
        <vue-qr  v-show="false" :logoSrc="currentTemplate.in_qrcode_logo" :callback="getQrcodeUrl" :text="entranceUrl" :size="800"></vue-qr>
        <div class="justify-center q-gutter-sm row">
          <q-btn color="positive" unelevated  @click="downloadCollectionCode(hardwareConfig.qrcode_url)" label="下载二维码"  />
           <q-btn color="primary" unelevated  @click="setStoreHardwareLink" label="保存"  />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
export default {
  name: 'AgOperator',
  components: {
    VueQr
  },
  data () {
    return {
      dataId: 0,
      showCodeStatus: false,
      qrcodeTemplateList: [],
      allTemplateListData: [],
      hardwareConfig: {
        qrcode_template_id: '',
        qrcode_url: '',
        qrcode_rule: {}
      },
      in_qrcode_url: '',
      currentTemplate: {}
    }
  },
  mounted () {},
  computed: {
    entranceUrl () {
      const that = this
      const systemLocal = this.$q.localStorage.getItem('hlpay_system_local')
      if (systemLocal) {
        return systemLocal.info.site_url + '/m/hlpay/?hlToken=' + that.params.data.hl_token
      }
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    getQrcodeUrl (dataUrl, id) {
      this.in_qrcode_url = dataUrl
    },
    setBindStore () {
      this.params.context.setBindStore(this.params.data.mch_id, this.params.data.isv_id, this.params.data.mch_name, this.params.data.app_id, this.params.data.app_secrect)
    },
    setPayConfig () {
      this.params.context.setPayConfig(2, this.params.data.mch_id, this.params.data.isv_id)
    },

    setHardwareLink () {
      this.params.context.setHardwareLink(this.params.data.mch_id)
    },

    setData () {
      this.dataId = this.params.data.id
      this.params.context.addNewData(this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除编号为 "${this.params.data.isv_id}" 的商户信息吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('mch/deleteData', [this.dataId])
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
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    downloadCollectionCode (imgUrl) {
      const that = this
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      if (window.navigator.msSaveOrOpenBlob) {
        const bstr = atob(imgUrl.split(',')[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        const blob = new Blob([u8arr])
        window.navigator.msSaveOrOpenBlob(blob, that.params.data.mch_id + '.' + 'png')
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a')
        a.href = imgUrl
        a.setAttribute('download', that.params.data.mch_id)
        a.click()
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
    },

    createQrcode () {
      const that = this
      const templateIndex = _.findIndex(that.qrcodeTemplateList, function (o) {
        return o.id == that.hardwareConfig.qrcode_template_id
      })
      if (templateIndex > -1) {
        const currentTemplate = that.qrcodeTemplateList[templateIndex]
        const posterRuleData = currentTemplate && currentTemplate.poster_rule ? JSON.parse(currentTemplate.poster_rule) : {}
        const qrcodeIndex = _.findIndex(posterRuleData.views, function (o) {
          return o.qrcode > 0
        })
        this.currentTemplate = currentTemplate

        const mchidIndex = _.findIndex(posterRuleData.views, function (o) {
          return o.field == 'mch_id'
        })
        if (mchidIndex > 0) {
          posterRuleData.views[mchidIndex].text = '商户号 No.' + that.params.data.mch_id
        }

        if (qrcodeIndex > -1) {
          setTimeout(() => {
            posterRuleData.views[qrcodeIndex].url = this.in_qrcode_url
            that.hardwareConfig.qrcode_rule = posterRuleData
          }, 1000)
        }
      }
    },
    clearQrcode () {
      this.hardwareConfig.qrcode_url = ''
      this.hardwareConfig.qrcode_rule = {}
    },
    openQrcode () {
      this.showCodeStatus = true
      this.$store.dispatch('mch/getQrcodeConfig', { mch_id: this.params.data.mch_id }).then((res) => {
        if (res.code == 200) {
          this.qrcodeTemplateList = res.data && res.data.templateList ? res.data.templateList : []
          this.allTemplateListData = res.data && res.data.templateList ? res.data.templateList : []

          if (res.data && res.data.hardwareConfig) {
            this.hardwareConfig.qrcode_template_id = res.data.hardwareConfig.qrcode_template_id
            this.hardwareConfig.qrcode_url = res.data.hardwareConfig.qrcode_url
            this.hardwareConfig.qrcode_rule = res.data.hardwareConfig.qrcode_rule ? JSON.parse(res.data.hardwareConfig.qrcode_rule) : {}
          }
        }
      })
    },
    setStoreHardwareLink () {
      this.hardwareConfig.mch_id = this.params.data.mch_id
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
            this.showCodeStatus = false
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
    success (src) {
      this.hardwareConfig.qrcode_url = src
    },
    fail (err) {
      console.log('fail', err)
    },
    filterQrcodeTemplate (val, update, abort) {
      if (val === '') {
        update(() => {
          this.qrcodeTemplateList = this.allTemplateListData
        })
        return
      }

      update(() => {
        this.qrcodeTemplateList = _.filter(this.allTemplateListData, function (o) {
          return o.name.indexOf(val) > -1
        })
      })
    }
  }
}
</script>
