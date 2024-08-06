<template>
    <div class="centered-container bigger-container">
        <div class="jumbotron text-center">
            <h1 class="display-1 mb-4">Register</h1>
        </div>
        <form>
          <MDBRow class="mb-4">
            <MDBCol>
              <MDBInput
                type="text"
                placeholder="First name"
                id="name"
                v-model="name"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="text"
                placeholder="Last name"
                id="surname"
                v-model="surname"
              />
            </MDBCol>
          </MDBRow>
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
          <MDBBtn color="primary" block class="mb-4 login-button" @click="handleRegister"> Iscriviti </MDBBtn>
          <MDBRow>
          <p>Già iscritto? <router-link to="/login" >Accedi</router-link></p>
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
  MDBCol,
  MDBInput,
  MDBBtn
} from "mdb-vue-ui-kit";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "Register",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
  },
  setup() {
    const name = ref("");
    const surname = ref("");
    const username = ref("");
    const password = ref("");
    const router = useRouter();
    const errorMessage = ref("");

    const handleRegister = () => {
      try{
        console.log("First name: ", name.value);
        console.log("Last name: ", surname.value);
        console.log("Username: ", username.value);
        console.log("Password: ", password.value);

        const response = fetch("http://localhost:3000/api/auth/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.value,
            surname: surname.value,
            username: username.value,
            password: password.value,
          }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }
        error.message = '';
        router.push('/login');
      } catch (error) {
        errorMessage.value = 'Inserisci tutti i campi e verifica che lo username non sia già stato utilizzato';
      }
    }

    return {
      name: name,
      surname: surname,
      username,
      password,
      handleRegister,
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