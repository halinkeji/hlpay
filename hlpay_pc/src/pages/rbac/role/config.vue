<template>
  <q-page class="q-pa-sm">
    <q-page-sticky position="bottom-right" class="z-top" :offset="[18, 18]" v-if="authorityMeta('save')">
      <q-btn unelevated color="primary" @click="saveRoleData" label="保存" />
    </q-page-sticky>

    <div class="row">
      <div class="col-12">
        <q-tabs v-model="tab" class="text-grey" active-color="primary" indicator-color="primary" :ripple="false" align="justify" :breakpoint="0">
          <q-tab :key="k" v-for="(i, k) in clientMenu" :name="i.type" :label="i.name" />
        </q-tabs>
      </div>
      <div class="col-12" v-for="(i, k) in clientMenu">
        <q-card-section v-if="tab == i.type">
          <q-tree default-expand-all ref="menuTreeRef" :nodes="i.nowMenuData" node-key="label" label-key="title" :selected.sync="selected">
            <template v-slot:default-header="prop">
              <div class="row items-center justify-between full-width">
                <div class="col-5">
                  <div class="text-dark">
                    <q-icon name="edit" color="primary"></q-icon>
                    {{ prop.node.title }}

                    <q-popup-edit v-model="prop.node.title">
                      <template
                        v-slot="{
                          initialValue,
                          value,
                          emitValue,
                          validate,
                          set,
                          cancel,
                        }"
                      >
                        <q-input autofocus dense :value="prop.node.title" @input="emitValue">
                          <template v-slot:after>
                            <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel"> </q-btn>
                            <q-btn
                              flat
                              dense
                              color="positive"
                              icon="check_circle"
                              @click.stop="
                                selected = ''
                                set()
                              "
                              :disable="!value || initialValue === value"
                            />
                          </template>
                        </q-input>
                      </template>
                    </q-popup-edit>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:default-body="prop">
              <div class="row" v-if="prop.node.meta">
                <div class="col-auto q-px-sm text-dark" v-for="(item, key) in prop.node.meta">
                  <q-icon name="filter_frames" color="primary"></q-icon>
                  {{ item.title }}
                  <q-popup-edit v-model="item.title">
                    <template
                      v-slot="{
                        initialValue,
                        value,
                        emitValue,
                        validate,
                        set,
                        cancel,
                      }"
                    >
                      <q-input autofocus dense :value="item.title" @input="emitValue">
                        <template v-slot:after>
                          <q-btn flat dense color="negative" icon="cancel" @click.stop="cancel" />
                          <q-btn
                            flat
                            dense
                            color="positive"
                            icon="check_circle"
                            @click.stop="
                              selected = ''
                              set()
                            "
                            :disable="!value || initialValue === value"
                          />
                        </template>
                      </q-input>
                    </template>
                  </q-popup-edit>
                </div>
              </div>
            </template>
          </q-tree>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      tab: '',

      selected: '',
      applyDataList: [],
      // nowMenuData: [],
      ticked: {},
      selectedData: [],
      clientMenu: []
    }
  },

  mounted () {
    this.getRoleInfo()
  },
  created () {},
  computed: {},
  methods: {
    getRoleInfo () {
      this.$store
        .dispatch('role/config')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.clientMenu = res.data.clientMenu ? res.data.clientMenu : []
            if (this.clientMenu.length > 0) {
              this.tab = this.clientMenu[0].type
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: '获取权限菜单失败',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    saveRoleData () {
      const payload = {
        clientMenu: this.clientMenu
      }
      this.$store
        .dispatch('role/setConfig', payload)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '权限配置保存成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            setTimeout(() => {
              this.getRoleInfo()
            }, 1000)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: '权限配置保存失败',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
