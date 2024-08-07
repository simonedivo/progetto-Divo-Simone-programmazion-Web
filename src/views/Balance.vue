<template>
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="container">
                <div class="masthead clearfix">
                    <div class="container inner text-center">
                        <h3 class="masthead-brand">Il tuo bilancio</h3>
                        <nav class="nav-center">
                          <ul class="nav masthead-nav">
                            <li><router-link to="/home">Home</router-link></li>
                            <li class="active"><router-link to="/balance">Bilancio</router-link></li>
                            <li><router-link to="expenses-management">Management</router-link></li>
                            <li><a href="#" @click.prevent="showLogoutModal">Logout</a></li>
                          </ul>
                        </nav>
                    </div>
                </div>
                <div class="inner cover">
                    <h1 class="cover-heading">Balle</h1>
                    <p class="lead">
                        <a href="#" class="btn btn-lg btn-default">PISO</a>
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isLogoutModalVisible" class="modal">
        <div class="modal-content">
            <span class="close" @click="hideLogoutModal">&times;</span>
            <p>Sei sicuro di voler effettuare il logout?</p>
            <button @click="handleLogout">Sì</button>
            <button @click="hideLogoutModal">No</button>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
    name: "Balance",
    setup() {
    const router = useRouter();
    const isLogoutModalVisible = ref(false);

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/auth/logout', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                router.push('/login');
            } else {
                console.error('Failed to logout');
            }
        } catch (error) {
            console.error('Error logging out', error);
        }
    };
    const showLogoutModal = () => {
        isLogoutModalVisible.value = true;
    };
    const hideLogoutModal = () => {
        isLogoutModalVisible.value = false;
    };
    return {
        handleLogout,
        isLogoutModalVisible,
        showLogoutModal,
        hideLogoutModal,
    };
  },
};
</script>

<style scoped>
a,
a:focus,
a:hover {
  color: #fff;
}

.text-center {
  text-align: center;
}
.nav-center {
  display: flex;
  justify-content: center;
}


.btn-default,
.btn-default:hover,
.btn-default:focus {
  color: #333;
  text-shadow: none;
  background-color: #fff;
  border: 1px solid #fff;
}

html,
body {
  height: 100%;
}
body {
  color: #fff;
  text-align: center;
  text-shadow: 0 1px 3px rgba(0,0,0,.5);
}

.site-wrapper {
  display: table;
  width: 100%;
  height: 600px;
}
.site-wrapper-inner {
  display: table-cell;
  vertical-align: top;
}
.cover-container {
  margin-right: auto;
  margin-left: auto;
}

.inner {
  padding: 30px;
}

.masthead-brand {
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 40px;
}

.masthead-nav > li {
  display: inline-block;
}
.masthead-nav > li + li {
  margin-left: 20px;
}
.masthead-nav > li > a {
  padding-right: 0;
  padding-left: 0;
  font-size: 16px;
  font-weight: bold;
  color: #fff; /* IE8 proofing */
  color: rgba(255,255,255,.75);
  border-bottom: 2px solid transparent;
}
.masthead-nav > li > a:hover,
.masthead-nav > li > a:focus {
  background-color: transparent;
  border-bottom-color: #a9a9a9;
  border-bottom-color: rgba(255,255,255,.25);
}
.masthead-nav > .active > a,
.masthead-nav > .active > a:hover,
.masthead-nav > .active > a:focus {
  color: #fff;
  border-bottom-color: #fff;
}
.cover {
  padding: 0 20px;
}
.cover .btn-lg {
  padding: 10px 20px;
  font-weight: bold;
}
@media (min-width: 768px) {
  .masthead {
    position: fixed;
    top: 0;
  }
  .site-wrapper-inner {
    vertical-align: middle;
  }
}
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  background-color: var(--color-background);
  margin: auto;
  padding: 20px;
  border: 1px solid var(--color-border);
  width: 80%;
  max-width: 300px;
  text-align: center;
  color: var(--color-text);
  font-family: var(--font-family);
}

.close {
  color: var(--color-text);
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: var(--color-heading);
  text-decoration: none;
  cursor: pointer;
}

button {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

button:hover {
  background-color: var(--color-background-mute);
  color: var(--color-heading);
}
</style>
