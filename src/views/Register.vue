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
                id="firstName"
                v-model="firstName"
              />
            </MDBCol>
            <MDBCol>
              <MDBInput
                type="text"
                placeholder="Last name"
                id="lastName"
                v-model="lastName"
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

export default {
  name: "Register",
  components: {
    MDBRow,
    MDBCol,
    MDBInput,
    MDBBtn,
  },
  setup() {
    const firstName = ref("");
    const lastName = ref("");
    const username = ref("");
    const password = ref("");

    const handleRegister = () => {
      console.log("First name: ", firstName.value);
      console.log("Last name: ", lastName.value);
      console.log("Username: ", username.value);
      //Da fare: chiamata API per la registrazione
    }

    return {
      firstName,
      lastName,
      username,
      password,
      handleRegister,
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
</style>