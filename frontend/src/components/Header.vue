<template>
    <div id="headingContainer">
        <div id="nav">
            <div class="logo">         
                <router-link to="/"><img src="../assets/Groupomania_Logos/icon-left-font-narrow.png" alt="Company Logo"></router-link>
            </div>
            <div id="linkcontainer">
                <router-link v-if="$route.name === 'register' || $route.name === 'login'" to="/">Login</router-link>
                <router-link v-if="$route.name === 'register' || $route.name === 'login'" to="/register">Register</router-link>
                <router-link v-if="$route.name !== 'register' && $route.name !== 'login' && $route.name !== '/postlist'" to="/postlist">Home</router-link>
                <router-link v-if="$route.name !== 'register' && $route.name !== 'login'" :to="{ name: 'profile', params: { userId: getUserId }}">Profile</router-link>
                <router-link v-if="$route.name !== 'register' && $route.name !== 'login'" to="/addpost">Write</router-link>
                <router-link v-if="$route.name !== 'register' && $route.name !== 'login'" to="/"><span @click="logout">Logout</span></router-link>
            </div>
        </div>
        <h1 id="heading">Groupomania Internal-Media</h1>
    </div>
</template>

<script>
export default {
    name: 'Header',
    computed: {
        getUserId() {
            return sessionStorage.getItem('userId')
        }
    },
    methods: {
        logout() {
            this.$store.commit('logout')
        }
    }
}
</script>

<style lang="scss" >
#headingContainer {
    width: 95%;
    margin: 0.75rem auto;
}

#nav {
    padding: 0.75rem;
    background-color: gray;
    display: flex;
    @media only screen and (max-width: 1024px) {
        flex-flow: column;
        padding: 2% 2%;
    }
    .logo {
        text-align: left;
        padding-left: 3%;
        img {
            width: 40%;
            border-radius: 10px;
        }
    }
    #linkcontainer {
        width: 50%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        @media only screen and (max-width: 1024px) {
            margin: 3% 0 0 0;
            width: 100%;
        }
        a {
            color: white;
            text-decoration: none;
            font-size: 1.8rem;
            opacity: 0.8;
             @media only screen and (max-width: 460px) {
                 font-size: 1.3rem;
             }

            @media only screen and (max-width: 360px) {
                font-size: 1rem;
             }

            &.router-link-exact-active {
                background-color: white;
                color: orangered;
                border-radius: 15px;
                padding: 2%% 3%;
                opacity: 1;
            }

        }
    }
}
#heading {
    width: 95%;
    margin: 0.75rem auto;
    color: orangered;
    background: rgb(30, 30, 30);
    padding: 10px;
}    
</style>