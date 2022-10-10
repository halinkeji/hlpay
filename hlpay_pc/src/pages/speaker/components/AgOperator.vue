<template>
  <div class="row q-gutter-sm">
    <!-- <q-btn
      color="positive"
      v-if="authorityMeta('bind') && params.data.psc_model == 'feiyu' && parseInt(params.data.psc_bind_status) != 1"
      class="q-mt-sm q-mx-sm"
      unelevated
      label="绑定"
      @click="bindAndUntie(1)"
    />
    <q-btn
      color="blue-grey"
      v-if="authorityMeta('untie') && params.data.psc_model == 'feiyu' && parseInt(params.data.psc_bind_status) == 1"
      class="q-mt-sm q-mx-sm"
      unelevated
      label="解绑"
      @click="bindAndUntie(0)"
    /> -->
    <q-btn color="primary" v-if="authorityMeta('edit')"  unelevated label="修改" @click="updateConfig()" />
    <q-btn color="red" v-if="authorityMeta('del')"  unelevated label="删除" @click="deleteConfig()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    updateConfig () {
      this.dataId = this.params.data.id
      this.params.context.addSpeakerData(this.dataId)
    },
    deleteConfig () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.psc_name}" 的音箱吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('speaker/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除音箱成功',
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
            message: '失败',
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
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },

    bindAndUntie (val) {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定${parseInt(this.params.data.psc_model) == 1 ? '解绑' : '绑定'}名称为 "${this.params.data.psc_name}" 的音箱吗？`,
          cancel: true
        })
        .onOk(() => {
          this.$store.dispatch('speaker/bindAndUntie', {
            speakerId: this.dataId,
            bindStatus: val
          })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${parseInt(this.params.data.psc_model) == 1 ? '解绑' : '绑定'}音箱成功`,
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
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        })
    }
  }
}
</script>
