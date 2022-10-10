<template>
  <div style="justify-content: center">
    <q-toggle
      @input="changeStatus($event)"
      v-model="params.data.status"
      :true-value="'1'"
      v-if="authorityMeta('edit')"
      :false-value="'0'"
      color="green"
    />
  </div>
</template>

<script>
export default {
  name: "AgStatus",
  data() {
    return {};
  },
  computed: {},
  methods: {
    changeStatus(event) {
      let payload = {
        id: parseInt(this.params.data.id),
        status: event
      };
      this.$store
        .dispatch("role/updateRoleData", payload)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: "成功",
              caption: "角色状态更新成功！",
              icon: "ion-checkmark-circle-outline",
              color: "green",
              timeout: 500,
              position: "top-right"
            });
          } else {
            this.$q.notify({
              message: "失败",
              caption: "角色状态更新失败，请联系管理员！",
              icon: "ion-close-circle-outline",
              color: "red",
              timeout: 500,
              position: "top-right"
            });
          }
        })
        .catch(error => {
          this.$q.notify({
            message: "失败",
            caption: "角色状态更新失败，请联系管理员！",
            icon: "ion-close-circle-outline",
            color: "red",
            timeout: 500,
            position: "top-right"
          });
        });
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        let new_arr = this.$route.meta.map(obj => {
          return obj.id;
        });
        if (new_arr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    }
  }
};
</script>
