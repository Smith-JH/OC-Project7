<template>
    <form>
        <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden>
        <div v-if="loggingIn == false" class="container">
            <div>
                <h1 id="login">Login</h1>
            </div>
            <label for="username"><b>Username</b></label>
            <input class="loginInput" v-model="username" @input="check($event)" type="text" placeholder="Enter Username" name="username" pattern="^[a-zA-Z0-9]{1,15}$" required>
            <p class="alert" hidden>Invalid Input</p>
            <label for="password"><b>Password</b></label>
            <input class="loginInput" v-model="password" @input="check($event)" type="password" placeholder="Enter Password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>
            <p class="alert" hidden>Invalid Input</p>
            <button id="btn" type="submit" @click.prevent="login">Login</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginForm',
  data() {
    return {
      username: '',
      password: '',
      loggingIn: false
    }
  },
  methods: {
    check($event) {
      if (this.$route.name === 'login') {
        if ($event.target.value.length > 0 && $event.target.value.match($event.target.pattern)) {
            $event.target.classList.remove('border-danger');
            $event.target.classList.add('border-success');
            $event.target.nextSibling.setAttribute('hidden', true)
        } else {
            $event.target.classList.remove('border-success');
            $event.target.classList.add('border-danger');
            $event.target.nextSibling.removeAttribute('hidden')
        }
      }
    },
    login() {
      document.getElementById('loadingGif').removeAttribute('hidden')
      this.loggingIn = true
      axios.post('http://localhost:3000/api/auth/login',
        {
        username: this.username,
        email: this.email,
        password: this.password,
        },
        { headers:
          {
            'Content-Type': 'application/json' 
          }
        }
      ).then((response) => {
        if (response.data.status === '200') {
          this.$store.commit('login', response)
          this.$router.push("/postlist")
        } else if (response.data.status === '404') {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(response.data.message)
        } else if (response.data.status === '401') {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(response.data.message)
          this.$store.commit('logout')
        } else {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(response.data.message)
        }
      }).catch((err => {
          document.getElementById('loadingGif').setAttribute('hidden', true);
          this.loggingIn = false
          alert(err)
        })
      )
    }
  }
}

</script>

<style lang="scss">
.container {
    border: 1px solid gray;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    width: 25%;
    margin: auto;
}

.alert {
  text-align: center;
  color:  #842029;
  background-color: #f8d7da;
  margin-top: 0;
}

#login {
  text-align: center;
  color: orangered;
  margin: auto auto 5% auto;
}

form {
  display: flex;
  justify-content: center;
  margin-top: 1%;
  margin-bottom: 2%;
}

.loginInput {
  width: 100%;
  padding: 12px 20px;
  margin: 10px 0;
  background-color: lightgrey;
  color: black;
  display: inline-block;
  box-sizing: border-box;
  border-radius: 10px;
  outline: none;
}

#btn {
  background-color: lightgrey;
  color: orangered;
  font-size: 120%;
  margin: 10% auto 2% auto;
  padding: 10px;
  border-radius: 15px;
  cursor: pointer;
  width: 50%;
  border-radius: 15px;
  outline: none;
  &:hover {
    opacity: 0.8;
    background-color: orangered;
    color: white;
  }
  &:disabled {
    opacity: 0.5;
  }
}

.border-danger {
  border: #dc3545 3px solid;
}
.border-success {
  border: #198754 3px solid;
}

@media only screen and (max-width: 460px) {
  .container {
    width: 70%;
    margin: 30px 0;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  .container {
    width: 35%;
  }
  .container > label {
  font-size: 1.7em;
  }
}
</style>