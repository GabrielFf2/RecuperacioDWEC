<template>
  <q-layout view="lHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="@/assets/imgs/logo.jpg">
          </q-avatar>
          Score Finder
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item clickable @click="navigateTo('/score-list')">
          <q-item-section avatar>
            <q-icon name="library_music" />
          </q-item-section>
          <q-item-section>Partitures</q-item-section>
        </q-item>
        <q-item clickable @click="navigateTo('/piano')">
          <q-item-section avatar>
            <q-icon name="piano" />
          </q-item-section>
          <q-item-section>Piano</q-item-section>
        </q-item>
        <q-item clickable @click="navigateTo('/logout')">
          <q-item-section avatar>
            <q-icon name="power_settings_new" />
          </q-item-section>
          <q-item-section>Sortir</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export default {
  setup () {
    const leftDrawerOpen = ref(false)
    const router = useRouter()

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value
    }

    const navigateTo = (path) => {
      router.push(path)
    }

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      navigateTo
    }
  }
}
</script>
