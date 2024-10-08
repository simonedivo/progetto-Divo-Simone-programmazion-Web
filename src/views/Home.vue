<template>
    <div class="site-wrapper">
        <div class="site-wrapper-inner">
            <div class="container">
                <div class="masthead clearfix">
                    <div class="container inner text-center">
                        <h3 class="masthead-brand">Home page di <strong>{{ user.username }}</strong></h3>
                        <nav class="nav-center">
                          <ul class="nav masthead-nav">
                            <li class="active"><router-link to="/home">Home</router-link></li>
                            <li><router-link to="/balance">Bilancio</router-link></li>
                            <li><router-link to="/expenses-management">Management</router-link></li>
                            <li><a href="#" @click.prevent="showLogoutModal">Logout</a></li>
                          </ul>
                        </nav>
                    </div>
                </div>
                <div class="inner cover">
                    <h1 class="cover-heading fixed-header mb-4">Le tue spese: filtrabili per mese, anno e id oppure per descrizione</h1>
                    <div class="inline forms-container">
                      <form class="fixed-form" @submit.prevent="fetchExpenses">
                        <label for="year">Anno: </label>
                        <input type="number" v-model="year" id="year" min="2000" max="2100" />
                        <label for="month">Mese: </label>
                        <input type="number" v-model="month" id="month" min="1" max="12" />
                        <label for="id">ID: </label>
                        <input type="number" v-model="id" id="id" min="1" />
                        <button type="submit" class="btn btn-lg btn-default">Filtra</button>
                      </form>
                      <form class="fixed-form" @submit.prevent="fetchExpenses">
                        <label for="description">Oppure cerca per descrizione: </label>
                        <input type="text" v-model="description" id="description" @input="filterByDescription" />
                      </form>
                    </div>
                    <div class="scrollable-div">
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
                        </li>
                      </ul>
                      <h1 v-else>Nessuna spesa trovata</h1>
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

export default {
    name: "Home",
    setup() {
    const user = ref({ username: '' });
    const expenses = ref([]);
    const year = ref(null);
    const month = ref(null);
    const id = ref(null);
    const router = useRouter();
    const isLogoutModalVisible = ref(false);
    const description = ref('');

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

    const fetchExpenses = async () => {
      try {
          let url = 'http://localhost:3000/api/budget';
          if (year.value) {
            url += `/${year.value}`;
            if (month.value) {
              url += `/${month.value}`;
              if (id.value) {
                url += `/${id.value}`;
              }
            }
          }
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

    const filterByDescription = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/budget/search?q=${encodeURIComponent(description.value)}`, {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          expenses.value = data;
          console.log('Filtered Expenses', expenses.value);
        } else {
          console.error('Failed to fetch filtered expenses', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching filtered expenses', error);
      }
    };

    onMounted(() => {
      fetchUserData();
      fetchExpenses();
    });

    return {
        user,
        expenses,
        year,
        month,
        id,
        handleLogout,
        isLogoutModalVisible,
        showLogoutModal,
        hideLogoutModal,
        fetchExpenses,
        description,
        filterByDescription,
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
.forms-container {
  position: fixed;
  top: 200px;
  z-index: 1000;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-wrap: nowrap;
  gap: 10px;
}
.fixed-header {
    position: fixed;
    top: 140px;
    width: auto;
    z-index: 1000;
    padding: 10px 0;
}
.fixed-form {
    display: flex;
    align-items: center;
    top: 210px;
    width: 100%;
    z-index: 1000;
    padding: 10px 0;
    flex-wrap: nowrap;
    gap: 10px;
}
.fixed-form input {
  flex: 1;
  min-width: 0;
  height: 30px;
  vertical-align: middle;
  display: inline-flex;
  align-items: center;
}

.btn-default,
.btn-default:hover,
.btn-default:focus {
  color: #333;
  text-shadow: none;
  background-color: #fff;
  border: 1px solid #fff;
  height: 30px;
  padding: 0 10px;
  font-size: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}
.inner.cover {
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.scrollable-div {
  max-height: 400px;
  overflow-y: auto;
  margin-top: 20px;
  width: 100%;
}
</style>