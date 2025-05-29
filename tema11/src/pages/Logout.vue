<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Tancar sessió</div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'UserLogout',
  setup () {
    const router = useRouter()

    onMounted(() => {
      localStorage.removeItem('token')
      router.push('/login')
    })

    return {}
  }
}
</script>
