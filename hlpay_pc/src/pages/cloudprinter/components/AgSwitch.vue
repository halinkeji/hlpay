<template>
  <div>
    <q-toggle
      v-model="switchStore"
      :true-value="1"
      v-if="authorityMeta('edit')"
      :false-value="0"
      @input="statusBut()"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: 'AgOperating',
  data () {
    return {
      switchStore: 0
    }
  },

  mounted () {},
  created () {
    this.switchStore = this.params.data.cp_status == '1' ? 1 : 0
  },
  computed: {},
  methods: {
    // 修改状态
    statusBut () {
      const obj = {
        id: this.params.data.id,
        cp_status: this.switchStore
      }
      this.$store
        .dispatch('cloudprinter/setData', obj)
        .then(res => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '状态修改成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.params.context.getList()
            }, 100)
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
