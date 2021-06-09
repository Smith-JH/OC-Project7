<template>
    <div @scroll="handleScroll($event)" class="postPage" style="scrollbar-width: none;">
        <div v-if="sortPostsDifferentUser.length < 1">
            <h1>There are currently no posts in the system.<br><br><router-link to="/addpost">Be the first to start sharing!</router-link></h1>
        </div>
        <div v-else id="postContainer" v-for="post in sortPostsDifferentUser" :key="post.postID">
            <router-link id="postLink" :to="{ name: 'singlepost', params: { postId: post.PostID }}">
                <span id="postTitle" style="margin-bottom: 4%; word-wrap:break-word;">{{ post.Title }}</span>
            </router-link>
            <p id="postText" style="margin-bottom: 4%; word-wrap:break-word;">{{ post.Text }}</p>
            <h3 id="postAuther">Posted by: <span>{{ post.Username }}</span></h3>
            <div class="commentsContainer">
                <div :key="componentKey" class="commentsBox">
                    <router-link id="postLink" :to="{ name: 'singlepost', params: { postId: post.PostID }}">
                        <span>C<i @click="markPostAsRead($event)" id="bubble" class="far fa-comment-dots"></i>mments...</span>
                    </router-link>
                </div>
                <div @click="markPostAsRead($event)" :id="post.PostID" class="readButton">
                    <span v-if="post.UserID !== logedInUser && !getLocalStorage.hasOwnProperty(post.PostID)"><i @click="markPostAsRead($event)" :id="post.PostID" class="fas fa-bell"> Mark as read?</i></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PostList',
    data() {
        return {
            posts: [],
            scrolled: false,
            componentKey: 0
        }
    },
    computed: {
        sortPostsFromCurrentUser() {
            return [...this.posts]
            .filter(s => s.UserID === sessionStorage.getItem('userId') || Object.prototype.hasOwnProperty.call(this.getLocalStorage, s.PostID))
            .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
        },
        sortPostsDifferentUser() {
            return [...this.posts]
            .filter(s => s.UserID !== sessionStorage.getItem('userId') && !Object.prototype.hasOwnProperty.call(this.getLocalStorage, s.PostID))
            .sort((a, b) => new Date(b.DateTime) - new Date(a.DateTime))
            .concat(this.sortPostsFromCurrentUser)
        },
        logedInUser() {
            return sessionStorage.getItem('userId')
        },
        getLocalStorage() {
            return JSON.parse(localStorage.getItem(sessionStorage.getItem('userId'))) || 0 
        },
    },
    methods: {
        getPosts() {
            axios.get('http://localhost:3000/api/post',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                } //do something with params here..? OR change the previous (addPost back to 'Content-Type': 'multipart/form-data')
            }).then((response) => {
                if (response.data.status === '200') {
                    this.posts = response.data.data
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
        },
        forceRerender() {
            this.componentKey += 1;
        },
        handleScroll () {
              let postHeight = document.querySelectorAll('.icons2')
              for ( let i = 0; i < postHeight.length; i++) {
                if (postHeight[i].getBoundingClientRect().bottom < (window.innerHeight - 35)) {
                    postHeight[i].style.visibility = 'hidden'
                    let readPost = localStorage.getItem(sessionStorage.getItem('userId'))
                    readPost = JSON.parse(readPost)
                    readPost = {
                        ...readPost,
                        [postHeight[i].id]: postHeight[i].id
                    }
                    localStorage.setItem(sessionStorage.getItem('userId'), JSON.stringify(readPost));
                }
            }
        },
        markPostAsRead($event) {
                $event.target.style.visibility = 'hidden'
                let readPost = localStorage.getItem(sessionStorage.getItem('userId'))
                readPost = JSON.parse(readPost)
                readPost = {
                    ...readPost,
                    [$event.target.id]: $event.target.id
                }
                localStorage.setItem(sessionStorage.getItem('userId'), JSON.stringify(readPost))
            }
        },
    beforeMount() {
        this.getPosts()
    },
}
</script>

<style lang="scss">
.postPage {
    width: 90%;
    display: flex;
    flex-flow: column;
    margin: auto;
    overflow-x: hidden;
}
#postContainer {
    min-width: 300px;
    width: 75%;
    margin: auto auto 5% auto;
    background-color: white;
    color: black;
    border: solid black 2px;
    border-radius: 15px;
    box-sizing: border-box;
    padding: 1.5% 2%;
    #postLink {
        text-decoration: none;
        #postTitle {
            color: black;
            background: orangered;
            width: auto;
            margin: 1rem auto;
            padding: 0.75% 1.5%;
            border-radius: 15px;
            font-size: large;
        }
    }
    #postText {
        height: 2.65rem;
        margin: 5% 0;
        padding: 1% 2%;
        border-radius: 5px;
        background: rgba(255, 68, 0, 0.15);
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: small;
        text-align: left;
    }
    #postAuther {
        font-size: 75%;
        span {
            font-size: 150%;
            font-style: italic;
            text-decoration: underline;
        }
    }
    .readButton {
        padding-top: 1.5%;
        font-size: 75%;
        i {
            &:hover {
                color: orangered;
                cursor: pointer;
                font-size: 150%;
            }
        }
    }
}

.commentsContainer {
    display: flex;
    margin: auto;
    font-size: 130%;
    #bubble {
        font-size: 75%;
    }
}

.commentsBox {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 60%;
    padding: 1% 0;
}

.readButton {
    display: flex;
    flex-flow: row;
    justify-content: space-around;
    width: 50%;
    padding: 1% 0;
}

::-webkit-scrollbar {
    width: 0px;
    background: transparent;
    scrollbar-width: none;
}

@media only screen and (min-width: 760px) {
  .postContainer {
    width: 70%;
  }
}

@media only screen and (min-width: 1025px) {
  .postContainer {
    width: 40%;
  }
}
</style>