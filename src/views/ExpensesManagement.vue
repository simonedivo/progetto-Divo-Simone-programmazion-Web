<template>
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="container">
                <div class="masthead clearfix">
                    <div class="container inner text-center">
                        <h3 class="masthead-brand"><strong>Aggiungi, modifica o elimina una spesa</strong></h3>
                        <nav class="nav-center">
                          <ul class="nav masthead-nav">
                            <li><router-link to="/home">Home</router-link></li>
                            <li><router-link to="/balance">Bilancio</router-link></li>
                            <li class="active"><router-link to="expenses-management">Management</router-link></li>
                            <li><a href="#" @click.prevent="showLogoutModal">Logout</a></li>
                          </ul>
                        </nav>
                    </div>
                </div>
                <div class="inner cover nav-pills-container">
                    <ul class="nav nav-pills fixed-header mt-2">
                      <li class="nav-item"><a class="nav-link" :class="{ active: activeTab === 'add' }" href="#" @click.prevent="activeTab = 'add'">Aggiungi</a></li>
                      <li class="nav-item"><a class="nav-link" :class="{ active: activeTab === 'modify' }" href="#" @click.prevent="activeTab = 'modify'">Modifica</a></li>
                      <li class="nav-item"><a class="nav-link" :class="{ active: activeTab === 'delete' }" href="#" @click.prevent="activeTab = 'delete'">Elimina</a></li>
                    </ul>
                </div>
                <div>
                  <div v-if="activeTab === 'add'">
                    <h1>Inserisci i dati per una nuova spesa</h1>
                    <form @submit.prevent="confirmAddTransaction" class="form-container">
                      <div class="form-group">
                        <label for="category">Categoria</label>
                        <input type="text" id="category" v-model="newTransaction.category" class="form-control" required>
                      </div>
                      <div class="form-group">
                        <label for="description">Descrizione</label>
                        <input type="text" id="description" v-model="newTransaction.description" class="form-control" required>
                      </div>
                      <div class="form-group">
                        <label for="cost">Importo in €</label>
                        <input type="number" id="cost" v-model="newTransaction.cost" class="form-control" required>
                      </div>
                      <button type="submit" class="btn btn-default">Aggiungi</button>
                    </form>
                  </div>
                  <div v-if="activeTab === 'contributorTab'">
                    <h1 class="mb-3">Aggiungi contribuenti</h1>
                    <div class="center-container">
                      <SimpleTypeahead
                      	id="typeahead_id"
                      	placeholder="Cerca utente"
                      	:items="filteredUsers"
                      	:minInputLength="1"
                        :itemProjection="filteredUsers => filteredUsers.username"
                      	@selectItem="selectUser"
                      	@onInput="updateSearchQuery"
                      ></SimpleTypeahead>
                      <div>
                        <div class="form-group">
                          <label for="share">Quota in €</label>
                          <input type="number" id="share" v-model="share" class="form-control" required>
                        </div>
                        <button @click="addContributor" class="btn btn-default">Aggiungi</button>
                      </div>
                      <div v-if="newTransaction.quotes.length > 0" class="contributors scrollable-div">
                        <h2>Quote attuali: {{ totalQuotes }} €, su un totale di {{ newTransaction.cost }} €</h2>
                        <ul style="list-style-type: none;">
                          <li v-for="(quote, index) in newTransaction.quotes" :key="index">
                            {{ quote.contributor}}: {{ quote.share }}
                          </li>
                        </ul>
                        <button v-if="checkTotalQuotes()" @click="addTransaction" class="btn btn-default">Conferma</button>  
                      </div>

                  </div>
                    </div>
                  <div v-if="activeTab === 'modify'">
                    <h1>Modifica roba</h1>
                  </div>
                  <div v-if="activeTab === 'delete'">
                    <h1>Elimina roba</h1>
                  </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isContributorModalVisible" class="modal">
        <div class="modal-content">
            <span class="close" @click="hideContributorModal">&times;</span>
            <p>Vuoi aggiungere altri contributori?</p>
            <button @click="showContributorTab">Sì</button>
            <button @click="hideAndConfirm">No</button>
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
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import SimpleTypeahead from 'vue3-simple-typeahead';
import 'vue3-simple-typeahead/dist/vue3-simple-typeahead.css';

export default {
    name: "ExpensesManagement",
    components: {
      SimpleTypeahead,
    },
    setup() {
      const router = useRouter();
      const users = ref([]);
      const filteredUsers = ref([]);
      const searchQuery = ref('');
      const selectedUser = ref(null);
      const isLogoutModalVisible = ref(false);
      const isContributorModalVisible = ref(false);
      const activeTab = ref('add');
      const share = ref(0);
      const newTransaction = ref({
        category: '',
        description: '',
        cost: 0,
        quotes: [],
      });

      const addTransaction = async () => {
        console.log(newTransaction.value);
        try {
          const currentDate = new Date();
          const currentYear = currentDate.getFullYear();
          const currentMonth = currentDate.getMonth() + 1;
          const currentDay = currentDate.getDate();
          const url = 'http://localhost:3000/api/budget/'+`/${currentYear}/${currentMonth}/${currentDay}`;
          const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTransaction.value),
          });
          if (response.ok) {
            console.log('Transaction added');
          } else {
            console.error('Failed to add transaction');
          }
        } catch (error) {
          console.error('Error adding transaction', error);
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

      const updateSearchQuery = (query) => {
        searchQuery.value = query.input;
        filterUsers();
      };

      const selectUser = (user) => {
        selectedUser.value = user;
      };

      const addContributor = () => {
        if (selectedUser.value && share.value > 0) {
        newTransaction.value.quotes.push({
          contributor: selectedUser.value.username,
          share: share.value,
        });
        selectedUser.value = null;
        share.value = 0;
        }
      };

      const totalQuotes = computed(() => {
        return newTransaction.value.quotes.reduce((acc, quote) => acc + quote.share, 0);
      });

      const checkTotalQuotes = () => {
        return totalQuotes.value === newTransaction.value.cost;
      };

      const hideAndConfirm = () => {
        isContributorModalVisible.value = false;
        addTransaction();
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

      const confirmAddTransaction = () => {
        isContributorModalVisible.value = true;
      };

      const showContributorTab = () => {
        isContributorModalVisible.value = false;
        activeTab.value = 'contributorTab';
      };

      const hideContributorModal = () => {
        isContributorModalVisible.value = false;
      };

      const showLogoutModal = () => {
          isLogoutModalVisible.value = true;
      };
      const hideLogoutModal = () => {
          isLogoutModalVisible.value = false;
      };

      onMounted(fetchUsers);

      return {
          activeTab,
          handleLogout,
          isLogoutModalVisible,
          isContributorModalVisible,
          showLogoutModal,
          hideLogoutModal,
          newTransaction,
          addTransaction,
          users,
          fetchUsers,
          filterUsers,
          searchQuery,
          filteredUsers,
          selectedUser,
          selectUser,
          confirmAddTransaction,
          hideContributorModal,
          hideAndConfirm,
          showContributorTab,
          addContributor,
          share,
          totalQuotes,
          checkTotalQuotes,
          updateSearchQuery,
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
.fixed-header {
    position: fixed;
    top: 140px;
    width: 100%;
    z-index: 1000;
    padding: 10px 0;
}
.nav-pills-container {
  width: 100%;
  display: flex;
  justify-content: center;
}
.nav-pills {
  display: flex;
  justify-content: center;
}
.nav-pills > li {
  margin: 0 15px;
}

.nav-pills > li > a {
  font-size: 18px;
  padding: 10px 20px;
}
.nav-pills > li > a.active {
  background-color: #007bff;
  color: white;
  border-radius: 5px;
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
  color: #fff;
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
#typeahead_id_wrapper {
  color: black;
}
.contributors {
  position: fixed;
  bottom: 0;
  margin-bottom: 200px;
  width: 100%;
  padding: 10px;
  align-items: center;
  text-align: center;
}
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.scrollable-div {
  max-height: 200px;
  overflow: auto;
}
</style>
