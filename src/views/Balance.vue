<template>
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="container">
                <div class="masthead clearfix">
                    <div class="container inner text-center">
                        <h3 class="masthead-brand"><strong>Bilancio</strong></h3>
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
                  <div class="typeahead-container">
                    <SimpleTypeahead
                      class="inline typeahead"
                      id="typeahead_id"
                      placeholder="Cerca bilancio con utente"
                      :items="filteredUsers"
                      :minInputLength="1"
                      :itemProjection="filteredUsers => filteredUsers.username"
                      @selectItem="getBalanceWithUser"
                      @input="handleInput"
                    ></SimpleTypeahead>
                  </div>
                  <div v-if="isBalanceWithUserVisible">
                    <h1 class="inline">Il tuo bilancio con {{ selectedUser.username }} è </h1>
                    <h1 class="inline" :style="{ color: balance < 0 ? 'red' : 'green' }">{{ balance }}</h1>
                    <h1 class="inline">€</h1>
                  </div>
                  <div v-else>
                    <h1 class="inline">Il tuo bilancio generale è </h1>
                    <h1 class="inline" :style="{ color: balance < 0 ? 'red' : 'green' }">{{ balance }}</h1>
                    <h1 class="inline">€</h1>
                  </div>
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
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css';

export default {
    name: "Balance",
    components: {
        SimpleTypeahead,
    },
    setup() {
    const router = useRouter();
    const isLogoutModalVisible = ref(false);
    const balance = ref(0);
    const users = ref([]);
    const filteredUsers = ref([]);
    const isBalanceWithUserVisible = ref(false);
    const selectedUser = ref(null);


    const getBalance = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/balance', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data);
                balance.value = -data.balance;
            } else {
                console.error('Failed to get balance');
            }
        } catch (error) {
            console.error('Error getting balance', error);
        }
    };

    const getBalanceWithUser = async (user) => {
      const url = `http://localhost:3000/api/balance/${user._id}`;
      console.log(url);
        try {
            const response = await fetch(`http://localhost:3000/api/balance/${user._id}`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                balance.value = -data.balance;
                selectedUser.value = user;
                isBalanceWithUserVisible.value = true;
            } else {
                console.error('Failed to get balance with user');
            }
        } catch (error) {
            console.error('Error getting balance with user', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/budget/all', {
                method: 'GET',
                credentials: 'include',
            });
            users.value = await response.json();
            filteredUsers.value = users.value;
        } catch (error) {
            console.error('Error fetching users', error);
        }
    };

    const filterUsers = () => {
        const query = searchQuery.value.toString().toLowerCase();
        filteredUsers.value = users.value.filter(user => user.username.toLowerCase().includes(query));
    };

    const handleInput = (event) => {
      if (event.target.value === '') {
        selectedUser.value = null;
        isBalanceWithUserVisible.value = false;
        getBalance();
      }
    };

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

    onMounted(() => {
        getBalance();
        fetchUsers();
        isBalanceWithUserVisible.value = false;
        selectedUser.value = null;
    });

    return {
        handleLogout,
        isLogoutModalVisible,
        showLogoutModal,
        hideLogoutModal,
        balance,
        getBalance,
        users,
        fetchUsers,
        filteredUsers,
        filterUsers,
        getBalanceWithUser,
        isBalanceWithUserVisible,
        selectedUser,
        handleInput,
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
.inline{
  display: inline-block;
  margin-right: 10px;
}

.typeahead-container {
  position: fixed;
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  vertical-align: middle;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
  padding: 10px;
  width: 100%;
  border-bottom: 1px solid #ccc;
}

.typeahead {
    width: 300px;
    margin-left: 10px;
}

.btn-default,
.btn-default:hover,
.btn-default:focus {
  color: #333;
  text-shadow: none;
  background-color: #fff;
  border: 1px solid #fff;
}

#typeahead_id_wrapper {
  color: black;
  width: auto;
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
.masthead {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
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
