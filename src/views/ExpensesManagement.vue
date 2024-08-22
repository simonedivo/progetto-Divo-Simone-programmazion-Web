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
                  <div v-if="activeTab === 'add'" class="center-div">
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
                        <label for="description">Data</label>
                        <input type="date" id="date" v-model="transactionDate" class="form-control" required>
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
                          <input type="number" id="share" v-model="share" class="form-control" :min="-Infinity">
                        </div>
                        <button @click="addContributor" class="btn btn-default">Aggiungi</button>
                      </div>
                      <div v-if="newTransaction.quotes.length > 0" class="contributors scrollable-div">
                        <h2>Quote attuali: {{ totalQuotes }} €, su un totale di {{ newTransaction.cost }} €</h2>
                        <ul style="list-style-type: none;">
                          <li v-for="(quote, index) in newTransaction.quotes" :key="index">
                            {{ quote.contributor}}: {{ quote.share }}
                            <button @click="removeContributor(index)" class="remove-btn">X</button>
                          </li>
                        </ul>
                        <button v-if="checkTotalQuotes()" @click="addTransaction" class="btn btn-default">Conferma</button>  
                      </div>

                  </div>
                    </div>
                  <div v-if="activeTab === 'modify'" class="scrollable-div">
                    <ul v-if="expenses.length > 0">
                      <li v-for="expense in expenses" :key="expense._id">
                        <p class="inline">ID: {{ expense.id }} |</p>
                        <p class="inline">Descrizione: {{ expense.description }} |</p>
                        <p class="inline">Costo: {{ expense.cost }} € |</p>
                        <p class="inline">Categoria: {{ expense.category }} |</p>
                        <p class="inline">Creato da: {{ expense.createdBy }} |</p>
                        <p class="inline">Data: {{ new Date(expense.date).toLocaleDateString() }} |</p>
                        <p class="inline">Quote:
                          <ul class="inline">
                            <li v-for="quote in expense.quotes" :key="quote.contributors" class="inline">
                              Contribuente: {{ quote.username }}, Quota: {{ quote.share }} €
                            </li>
                          </ul>
                        </p>
                        <button v-if="expense.createdBy === user.username"  @click="showModifyModal(expense)"  class="modify-expense-btn inline">  Modify</button>
                      </li>
                    </ul>
                    <h1 v-else>Nessuna spesa trovata</h1>
                  </div>
                  <div v-if="activeTab === 'delete'" class="scrollable-div">
                    <ul v-if="expenses.length > 0">
                      <li v-for="expense in expenses" :key="expense._id">
                        <p class="inline">ID: {{ expense.id }} |</p>
                        <p class="inline">Descrizione: {{ expense.description }} |</p>
                        <p class="inline">Costo: {{ expense.cost }} € |</p>
                        <p class="inline">Categoria: {{ expense.category }} |</p>
                        <p class="inline">Creato da: {{ expense.createdBy }} |</p>
                        <p class="inline">Data: {{ new Date(expense.date).toLocaleDateString() }} |</p>
                        <p class="inline">Quote:
                          <ul class="inline">
                            <li v-for="quote in expense.quotes" :key="quote.contributors" class="inline">
                              Contribuente: {{ quote.username }}, Quota: {{ quote.share }} €
                            </li>
                          </ul>
                        </p>
                        <button v-if="expense.createdBy === user.username"  @click="showDeleteModal(expense)"  class="remove-btn inline">  X</button>
                      </li>
                    </ul>
                    <h1 v-else>Nessuna spesa trovata</h1>
                  </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="isDeleteModalVisible" class="modal">
      <div class="modal-content">
        <span class="close" @click="hideDeleteModal">&times;</span>
        <p>Sei sicuro di voler eliminare questa spesa?</p>
        <button @click="deleteExpense">Sì</button>
        <button @click="hideDeleteModal">No</button>
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

    <div v-if="isModifyModalVisible" class="modal-overlay">
      <div class="modal-content">
        <h2>Modifica la spesa</h2>
        <form @submit.prevent="modifyExpense">
          <label for="description">Descrizione:</label>
          <input type="text" v-model="modifiedExpense.description" id="description" />

          <label for="category">Categoria:</label>
          <input type="text" v-model="modifiedExpense.category" id="category" />

          <button type="submit" class="btn btn-primary">Salva</button>
          <button type="button" @click="isModifyModalVisible = false" class="btn btn-secondary">Annulla</button>
        </form>
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
      const transactionDate = ref('');
      const user = ref({username : ''});
      const expenses = ref([]);
      const isModifyModalVisible = ref(false);
      const modifiedExpense = ref({});
      const isDeleteModalVisible = ref(false);
      const expenseToDelete = ref({});

      const addTransaction = async () => {
        console.log(newTransaction.value);
        try {
          const date = new Date(transactionDate.value);
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          const url = 'http://localhost:3000/api/budget/'+`/${year}/${month}/${day}`;
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
            router.push('/home');
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
        if (selectedUser.value && share.value !== 0) {
        newTransaction.value.quotes.push({
          contributor: selectedUser.value.username,
          share: share.value,
        });
        selectedUser.value = null;
        share.value = 0;
        }
      };

      const removeContributor = (index) => {
        newTransaction.value.quotes.splice(index, 1);
      };

      const totalQuotes = computed(() => {
        return newTransaction.value.quotes.reduce((acc, quote) => acc + quote.share, 0);
      });

      const checkTotalQuotes = () => {
        return totalQuotes.value === newTransaction.value.cost;
      };

      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/budget/whoami', {
            method: 'GET',
            credentials: 'include',
          });
          if (response.ok) {
            user.value = await response.json();
          } else {
            console.error('Failed to fetch user data');
          }
        } catch (error) {
          console.error('Error fetching user data', error);
        }
      };

      const fetchExpenses = async () => {
        try {
            let url = 'http://localhost:3000/api/budget';
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const data = await response.json();
                expenses.value = data;
            } else {
                console.error('Failed to fetch expenses');
            }
        } catch (error) {
          console.error('Error fetching expenses', error);
        }
      };

      const showModifyModal = (expense) => {
        modifiedExpense.value = expense;
        isModifyModalVisible.value = true;
      };

      const modifyExpense = async (expense) => {
        try {
          const {id} = modifiedExpense.value;
          const date = new Date(modifiedExpense.value.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const response = await fetch(`http://localhost:3000/api/budget/${year}/${month}/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(modifiedExpense.value),
          });
          if (response.ok) {
            isModifyModalVisible.value = false;
            fetchExpenses();
          }
        } catch (error) {
          console.error('Error modifying expense', error);
        }
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
      
      const showDeleteModal = (expense) => {
        expenseToDelete.value = expense;
        isDeleteModalVisible.value = true;
      };
      const hideDeleteModal = () => {
        isDeleteModalVisible.value = false;
      };
      const deleteExpense = async () => {
        try {
          const {id} = expenseToDelete.value;
          const date = new Date(expenseToDelete.value.date);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const response = await fetch(`http://localhost:3000/api/budget/${year}/${month}/${id}`, {
            method: 'DELETE',
            credentials: 'include',
          });
          if (response.ok) {
            isDeleteModalVisible.value = false;
            fetchExpenses();
          }
        } catch (error) {
          console.error('Error deleting expense', error);
        }
      };
      

      onMounted(() => {
        fetchUserData();
        fetchUsers();
        fetchExpenses();
      });

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
          removeContributor,
          share,
          totalQuotes,
          checkTotalQuotes,
          updateSearchQuery,
          user,
          fetchUserData,
          expenses,
          fetchExpenses,
          isModifyModalVisible,
          modifiedExpense,
          showModifyModal,
          modifyExpense,
          isDeleteModalVisible,
          showDeleteModal,
          hideDeleteModal,
          expenseToDelete,
          deleteExpense,
          transactionDate,
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
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
  z-index: 1001;
}

.modal-content form label,
.modal-content form input,
.modal-content form button {
  display: block;
  width: 100%;
  margin-bottom: 10px;
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
  margin-bottom: 60px;
  width: 100%;
  align-items: center;
  text-align: center;
}
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
.scrollable-div {
  max-height: 300px;
  overflow: auto;
}
.remove-btn {
  background: none;
  border: none;
  color: red;
  cursor: pointer;
  margin-left: 10px;
}
.inline{
  display: inline-block;
  margin-right: 10px;
}
.modify-expense-btn {
  background-color: transparent;
  color: orange;
  border: 2px solid orange;
  padding: 5px 10px;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 3px;
  transition: background-color 0.3s, color 0.3s;
}

.modify-expense-btn:hover {
  background-color: orange;
  color: white;
}
</style>
