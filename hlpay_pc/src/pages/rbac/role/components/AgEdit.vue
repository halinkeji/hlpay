<template>
  <div class="flex flex-wrap">
    <q-btn unelevated color="primary" flat v-if="authorityMeta('edit')" round :to="{ name: 'roleEdit', query: { id: params.data.id } }" icon="las la-edit">
      <q-tooltip>
        修改
      </q-tooltip>
    </q-btn>
    <q-btn unelevated color="negative" flat round v-if="authorityMeta('del')" @click="confirmDeleteRecord" icon="las la-trash-alt">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgEdit',
  data () {
    return {
      user_data: {
        password: '',
        confirmPassword: '',
        id: 0
      },
      updatePasswordPopup: false,
      clickBtnDisabled: false,
      dialogWidth: '500px'
    }
  },
  mounted () {},
  computed: {
    confirmPassword () {
      if (this.user_data.password != this.user_data.confirmPassword) {
        return true
      }
      return false
    }
  },
  methods: {
    editRecord () {
      setTimeout(() => {
        this.params.context.addOrUpdate(this.params.data.id)
      }, 500)
    },

    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `确定删除 ${this.params.data.name} 该角色?删除后不可恢复。`,
          ok: {
            push: true,
            color: 'negative'
          },
          cancel: {
            push: true,
            color: 'primary'
          },
          persistent: true
        })
        .onOk(() => {
          if (parseInt(this.params.data.id) <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '删除权限角色失败，请联系管理员！',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }

          const payload = {
            id: parseInt(this.params.data.id),
            status: -1
          }

          this.$store
            .dispatch('role/delOneData', payload)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除权限角色成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                setTimeout(() => {
                  this.params.context.getRoleDataList()
                }, 500)
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '删除权限角色失败，请联系管理员！',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: '删除权限角色失败，请联系管理员！',
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
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
