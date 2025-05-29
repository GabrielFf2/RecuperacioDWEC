<template>
  <q-page class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">Registra't</div>
      </q-card-section>
      <q-card-section>
        <q-form @submit.prevent="handleSignup">
          <q-input v-model="usuari" label="Usuari" outlined required />
          <q-input v-model="password" label="Contrasenya" type="password" outlined required />
          <q-input v-model="email" label="Correu electrònic" type="email" outlined required />
          <q-btn type="submit" label="Registrar-se" color="primary" class="q-mt-md" />
          <q-banner v-if="errorMessage" class="q-mt-md" color="negative">
            {{ errorMessage }}
          </q-banner>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { LoginService} from "src/services/LoginService.js";

export default {
  name: "SignupPage",
  data() {
    return {
      usuari: "",
      password: "",
      email: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleSignup() {
      try {
        await LoginService.signup(this.usuari, this.password, this.email);
        this.$router.push("/login");
      } catch {
        this.errorMessage = "Error en el registre. Revisa les dades introduïdes.";
      }
    },
  },
};
</script>

<style scoped>

</style>
