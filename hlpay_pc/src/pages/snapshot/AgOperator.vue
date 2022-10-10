<template>
  <div class="q-gutter-xs">
     <q-btn color="primary"  label="详情"  v-if="authorityMeta('detail')"  unelevated @click="viewDetails">

    </q-btn>

  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      showCodeStatus: false
    }
  },
  mounted () {},
  computed: {

  },
  created () {

  },
  methods: {
    viewDetails () {
      this.params.context.viewOrderDetail(this.params.data.id)
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
