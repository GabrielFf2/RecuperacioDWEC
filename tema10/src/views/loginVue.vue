<template>
  <div class="login-container">
    <form @submit.prevent="handleLogin" class="login-form">
      <h2>Inicia sessió</h2>
      <label for="usuari">Usuari</label>
      <input type="text" id="usuari" v-model="usuari" required />
      <label for="password">Contrasenya</label>
      <input type="password" id="password" v-model="password" required />
      <button type="submit">Entrar</button>
      <span class="error" v-if="errorMessage">{{ errorMessage }}</span>
    </form>
  </div>
</template>

<script>
import { LoginService } from "@/services/LoginService";

export default {
  name: "LoginView",
  data() {
    return {
      usuari: "",
      password: "",
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        await LoginService.login(this.usuari, this.password);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = "Error d'autenticació. Revisa les teves credencials.";
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin-bottom: 5px;
}

.login-form input {
  margin-bottom: 15px;
  padding: 8px;
  font-size: 14px;
}

.login-form button {
  padding: 10px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.login-form button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: 14px;
  margin-top: 10px;
}
</style>