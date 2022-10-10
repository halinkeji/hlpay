<template>
  <div class="row q-gutter-sm">

    <q-btn color="primary" unelevated v-if="authorityMeta('group-edit')" label="修改" @click="editGroupData" />
    <q-btn color="red" unelevated  v-if="authorityMeta('group-del')" label="删除" @click="confirmDelete" />

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
  computed: {

  },
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    editGroupData () {
      this.dataId = this.params.data.id
      this.params.context.editGroupData(this.dataId)
    },
    confirmDelete () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.name}" 的分组吗`,
          cancel: true
        })
        .onOk(() => {
          this.params.context.deleteGroup([this.dataId])
        })
        .onCancel(() => {})
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
