<template>
    <form>
        <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden>
        <div v-if="loggingIn == false" class="container">
            
            <div>
                <h1 id="register">Register</h1>
            </div>

            <div>
              <label for="username"><b>Username</b></label>
              <input class="regInput" v-model="username" @blur="check"  @input="check($event); enableSubmitButton();" type="text" placeholder="Enter Username" name="username" pattern="^[a-zA-Z0-9]{1,}$" required>
              <p class="alert" hidden>Invalid Input. (Alphanumeric characters only)</p>
            </div>
            <div>
              <label for="email"><b>Email</b></label>
              <input class="regInput" v-model="email" @blur="check"  @input="check($event), enableSubmitButton()" type="text" placeholder="Enter Email" name="email" pattern="^\S[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$" required>
              <p class="alert" hidden>Invalid Input. Must be a valid E-mail format.</p>
            </div>
            <div>
              <label for="password"><b>Password</b></label>
              <input class="regInput" v-model="password" @blur="check" @input="check($event), enableSubmitButton()" type="password" placeholder="Enter Password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>
              <p class="alert" hidden>Invalid Input. Passwords must be 8+ characters, and include 1+ capital letters and 1+ numbers.</p>
            </div>
            <div>
              <label for="password"><b>Confirm Password</b></label>
              <input class="regInput" v-model="confirm" @input="checkPassword($event), enableSubmitButton()" type="password" placeholder="Retype Password" name="confirm" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" required>
              <p class="alert" hidden>Invalid Input. Passwords are not the same.</p>
            </div>
            <button id="reg-btn" class="broken-button btn-outline-success" type="submit" @click.prevent="register" disabled>Register</button>
            <p class="SubmissionFailed alert" hidden>Please ensure all fields are correctly filled in.</p>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
  name: 'RegistrationForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      confirm: '',
      loggingIn: false
    }
  },
  methods: {
    check($event) {
      if (this.$route.name === 'register') {
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
    checkPassword($event) {
      if (this.password === this.confirm) {
          $event.target.classList.remove('border-danger');
          $event.target.classList.add('border-success');
          $event.target.nextSibling.setAttribute('hidden', true)
      } else if (this.password == '' || this.confirm == '') {
          $event.target.classList.remove('border-success', 'border-danger');
          $event.target.nextSibling.setAttribute('hidden', true)
      } else {
          $event.target.classList.remove('border-success');
          $event.target.classList.add('border-danger');
          $event.target.nextSibling.removeAttribute('hidden');
      }
    },
    enableSubmitButton() {
      let userInput = document.querySelectorAll('input');
      let submitButton = document.getElementsByTagName('button')[0];
      if (this.$route.name === 'register') {
          for (let i = 0; i < userInput.length; i++) {
              if (userInput[0].value.match(userInput[0].pattern) && userInput[1].value.match(userInput[1].pattern) && userInput[2].value.match(userInput[2].pattern)) {
                  submitButton.removeAttribute('disabled');
                  submitButton.nextSibling.setAttribute('hidden', true)
                  submitButton.classList.remove('broken-button');
                  submitButton.classList.add('btn-outline-success');
              } else {
                  submitButton.nextSibling.removeAttribute('hidden')
                  submitButton.classList.remove('btn-outline-success');
                  submitButton.classList.add('broken-button');
                  submitButton.setAttribute('disabled', true);
              }
          }   
      }
    },
    register() {
      this.loggingIn = true
      document.getElementById('loadingGif').removeAttribute('hidden')
      axios.post('http://localhost:3000/api/auth/signup',
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
          if (response.data.status === '201') {
            setTimeout(() => { this.login() }, 1000)
          } else if (response.data.status === '409' && response.data.message === 'Username already used!' ) {
            document.getElementById('loadingGif').setAttribute('hidden', true);
            this.loggingIn = false
            alert(response.data.message);
            setTimeout(() => {
              let usernameInput = document.getElementsByName('username')
              usernameInput[0].style.borderColor = 'crimson';
            }, 400)
          } else if (response.data.status === '409' && response.data.message === 'Email already used!' ) {
            document.getElementById('loadingGif').setAttribute('hidden', true);
            this.loggingIn = false
            alert(response.data.message);
            setTimeout(() => {
              let emailInput = document.getElementsByName('email')
              emailInput[0].style.borderColor = 'crimson';
            }, 1000)
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
    },
      login() {
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
    border-radius: 20px;
    padding: 20px;
    width: 25%;
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    margin: 10% auto 10% auto;
}

#register {
  text-align: center;
  color: orangered;
  margin: auto auto 5% auto;
}

form {
  display: flex;
  justify-content: center;
}

.regInput {
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

.alert {
  text-align: center;
  color:  #842029;
  background-color: #f8d7da;
  margin-top: 0;
  font-size: 14px;
}

#reg-btn {
  font-size: 120%;
  margin: 10% auto 2% auto;
  padding: 10px;
  border-radius: 15px;
  width: 50%;
  outline: none;
  &:active{
    background-color: lightgrey;
    color: orangered;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
      background-color: orangered;
      color: white;
    }
  }
  &:disabled {
    cursor: default;
    opacity: 0.5;
    color: #fff;
    background-color: rgb(200, 200, 200);
    border-color: rgb(150, 150, 150);
  }
}

.btn-outline-success {
  background-color: lightgrey;
  color: orangered;
  &:hover {
    opacity: 0.8;
    background-color: orangered;
    color: white;
  }
}

.border-danger {
  border: #dc3545 3px solid;
}
.border-success {
  border: #198754 3px solid;
}

.container > div {
  margin-top: 5px;
}

.container:not(:root:root){ 
    margin: 0 0 0 0;
}

@media only screen and (max-width: 460px) {
  .container {
    width: 70%;
    margin: 30px 0;
  }
}

@media only screen and (min-width: 461px) and (max-width: 1024px) {
  .container {
    width: 45%;
  }
  .container > div {
    font-size: 1.5em;
  }
  input::-webkit-input-placeholder {
    font-size: 1.5em;
  }
}
</style>