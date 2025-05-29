<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NewLayout from '@/layouts/NewLayout.vue'

export default {
  components: {
    NewLayout
  },
  setup() {
    const route = useRoute()
    const layout = computed(() => {
      return route.meta.layout === 'newLayout' ? NewLayout : 'div'
    })

    return {
      layout
    }
  }
}
</script>
