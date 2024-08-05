<template>
    <div class="centered-container bigger-container">
        <div class="jumbotron text-center">
            <h1 class="display-1 mb-4">Login</h1>
        </div>
      <form>
        <MDBInput
          type="text"
          placeholder="Username"
          id="username"
          v-model="username"
          wrapperClass="mb-4"
        />
        <MDBInput
          type="password"
          placeholder="Password"
          id="password"
          v-model="password"
          wrapperClass="mb-4"
        />
        <MDBBtn color="primary" class="mb-2 login-button" block @click="handleLogin"> Accedi </MDBBtn>
        <MDBRow>
          <p>Non sei ancora registrato? <router-link to="/register" class="hover-text" @mouseover="hoverText = 'Registrati ora'" @mouseleave="hoverText = 'Arrangiati'">{{ hoverText }}</router-link></p>
        </MDBRow>
        <div v-if="errorMessage" class="error-message">
          <p>{{ errorMessage }}</p>
        </div>
      </form>
    </div>
</template>

<script>
import {
  MDBRow,
  MDBInput,
  MDBBtn,
} from "mdb-vue-ui-kit";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Login",
  components: {
    MDBRow,
    MDBInput,
    MDBBtn,
  },
  setup() {
    const username = ref("");
    const password = ref("");
    const hoverText = ref("Arrangiati");
    const errorMessage = ref("");
    const router = useRouter();

    const handleLogin = async () => {
      try {
        console.log('Login attempt', username.value, password.value);
        const response = await fetch('http://localhost:3000/api/auth/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
          username: username.value,
          password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error('Login failed');
        }
      
        const data = await response.json();
        console.log('Login successful', data);
        errorMessage.value = '';
        router.push('/home');
      } catch (error) {
        errorMessage.value = 'Invalid username or password!';
      }
    };

    const checkAuthentication = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/verifyToken', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          router.push('/home');
        }
      } catch (error) {
        console.error('No token found', error);
      }   
    };

    onMounted(() => {
      checkAuthentication();
    });

    return {
      username,
      password,
      hoverText,
      handleLogin,
      errorMessage,
    };
  },
};
</script>

<style scoped>
.centered-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
.jumbotron {
    width: 100%;
    max-width: 500px;
}
.bigger-container {
    transform: scale(1.3);
    transform-origin: center;
}
.hover-text {
    display: inline-block;
    width: 100px;
    text-align: center;
}
.login-button {
    width: 100%;
    max-width: 100px;
    height: 40px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>