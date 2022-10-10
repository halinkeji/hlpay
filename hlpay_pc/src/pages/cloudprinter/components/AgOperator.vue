<template>
  <div>
    <q-btn color="warning" class=" q-mt-sm q-mx-sm" unelevated label="打印测试" v-if="authorityMeta('edit')" @click="printerTest" />
    <q-btn color="primary" class=" q-mt-sm q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editPrinter" />
    <q-btn color="red" class=" q-mt-sm" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
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
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除打印机名称为 ${this.params.data.cp_name} 的打印机吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('cloudprinter/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除小票打印机成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getList()
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
    editPrinter () {
      this.params.context.openPrintEdit(this.params.data.id)
    },

    printerTest () {
      if (this.params.data.cp_shared == 'wuba') {
        if (this.params.data.cp_local_printer) {
          if (process.env.MODE === 'electron') {
            const cp_local_printer = this.params.data.cp_local_printer
            const { remote } = require('electron')
            const { PosPrinter } = remote.require('electron-pos-printer')

            try {
              console.log('cp_local_printer', cp_local_printer)
              PosPrinter.print(
                [
                  {
                    type: 'text',
                    value: '配置成功',
                    style: 'text-align:center;',
                    css: { 'font-weight': '700', 'font-size': '18px' }
                  }
                ],
                {
                  preview: false,
                  width: '170px',
                  margin: '0 0 0 0',
                  copies: 1,
                  printerName: cp_local_printer,
                  timeOutPerLine: 400,
                  silent: true,
                  dpi: 'vertical',
                  landscape: false
                  // pageSize: { height: 301000, width: 71000 } // page size
                }
              )
                .then(() => {
                  this.$q.notify({
                    message: '成功',
                    caption: '已发送打印数据',
                    color: 'green',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                })
                .catch((error) => {
                  console.log('error', error)
                  this.$q.notify({
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '配置失败1',
                    caption: error.message,
                    color: 'red'
                  })
                })
            } catch (err) {
              console.log('err', err)
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '配置失败2',
                caption: err.message,
                color: 'red'
              })
            }
          }
        }
      }

      if (this.params.data.cp_shared == 'yilianyun') {
        this.$store
          .dispatch('cloudprinter/sendTest', { printId: this.dataId })
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '发送打印指令成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
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
    }
  }
}
</script>
