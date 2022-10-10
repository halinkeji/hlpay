<template>
  <div class="q-gutter-sm">

    <q-btn color="warning" icon="las la-share-alt" v-if="authorityMeta('channel')" round dense flat unelevated @click="setPayConfig">
      <q-tooltip> 支付渠道 </q-tooltip>
    </q-btn>
    <q-btn color="primary" icon="lar la-edit" v-if="authorityMeta('edit')" round dense flat unelevated @click="setData">
      <q-tooltip> 修改 </q-tooltip>
    </q-btn>
    <q-btn color="red" icon="las la-trash" v-if="authorityMeta('del')" round dense flat unelevated @click="confirmDeleteRecord">
      <q-tooltip> 删除 </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    setPayConfig () {
      this.params.context.setPayConfig(1, this.params.data.isv_id)
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
          message: `确定删除编号为 "${this.params.data.isv_id}" 的服务商信息吗？`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('isv/deleteData', [this.dataId])
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
