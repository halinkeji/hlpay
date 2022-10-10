<template>
  <div class="row q-gutter-sm">
    <q-btn

      color="green"
      icon="las la-qrcode"
      unelevated
      label="绑定码"
      @click="showCodeStatus = true"
      v-if="!params.data.receiver_id && params.data.pay_code == 'wxpay' && authorityMeta('get-bind')"
    >
    </q-btn>
    <q-btn v-if="authorityMeta('get-edit')"  color="primary" unelevated label="修改" @click="editReceivers" />
    <q-btn v-if="authorityMeta('get-del')"  color="red" unelevated label="删除" @click="confirmDelete" />
    <q-dialog v-model="showCodeStatus">
      <q-card
        class="q-pa-md"
        :style="{
          width: $q.screen.width * 0.2 + 'px',
          'max-width': $q.screen.width * 0.2 + 'px',
        }"
      >
        <div class="full-width row">
          <q-space />
          <q-btn flat round dense color="dark" icon="close" @click="showCodeStatus = false" />
        </div>
        <div class="flex flex-center" v-if="entranceUrl">
          <qrcode-vue id="collectionCode" :value="entranceUrl" foreground="#027be3" :size="'200'" level="H" />
        </div>

        <div class="text-center">
          <q-btn color="primary" unelevated dense @click="downloadCollectionCode" label="下载二维码" icon="las la-download" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      showCodeStatus: false
    }
  },
  mounted () {},
  computed: {
    entranceUrl () {
      const that = this
      const systemLocal = this.$q.localStorage.getItem('hlpay_system_local')
      if (systemLocal && that.params.data.mch) {
        return (
          systemLocal.info.site_url + '/m/hlpay/wx-bind-allot-receiver?hlToken=' + that.params.data.mch.hl_token + '&allot_id=' + that.params.data.id
        )
      }
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    editReceivers () {
      this.dataId = this.params.data.id
      this.params.context.editReceivers(this.dataId)
    },
    confirmDelete () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.name}" 的接收方吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteReceiver(this.dataId)
        })
        .onCancel(() => {})
    },
    downloadCollectionCode () {
      const canvas = document.getElementById('collectionCode').getElementsByTagName('canvas')
      const a = document.createElement('a')
      a.href = canvas[0].toDataURL('img/png')
      a.download = ''
      a.click()
    },

    deleteReceiver (val) {
      this.$store
        .dispatch('allot/deteleReceiver', val)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除接收方成功',
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
