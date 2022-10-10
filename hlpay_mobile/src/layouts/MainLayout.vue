<template>
  <q-layout view="lHh Lpr lFf" class="layout-bg">

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  components: {
  },
  data () {
    return {
      nav: {
        width: this.$q.screen.width
      }
    }
  },

  computed: {
    cssVars () {
      return {
        '--width': this.nav.width
      }
    }

  }
}
</script>
