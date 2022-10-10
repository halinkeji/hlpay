<template>
  <div v-if="authorityMeta('status')">
    <q-toggle color="green" :true-value="'1'" :false-value="'0'"  @input="updated" v-model="params.data.state" />
  </div>
</template>

<script>
export default {
  name: 'AgMode',
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    updated () {
      const obj = {
        state: this.params.data.state,
        id: this.params.data.id
      }
      this.$store
        .dispatch('isv/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '修改状态成功',
              color: 'green'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
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

<style scoped></style>
