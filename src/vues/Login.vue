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
        <MDBBtn color="primary" class="mb-2" block> Accedi </MDBBtn>
        <MDBRow>
          <p>Non sei ancora registrato? <router-link to="/register" class="hover-text" @mouseover="hoverText = 'Registrati ora'" @mouseleave="hoverText = 'Arrangiati'">{{ hoverText }}</router-link></p>
        </MDBRow>
      </form>
    </div>
</template>

<script>
import {
  MDBRow,
  MDBInput,
  MDBBtn,
} from "mdb-vue-ui-kit";
import { ref } from "vue";

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

    return {
      username,
      password,
      hoverText,
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
</style>