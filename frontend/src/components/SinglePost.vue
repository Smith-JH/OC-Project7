<template>
    <div class="singleContainer" >
        <div class="singlePostContainer">
            <h2 id="singleTitle" style="word-wrap:break-word;">{{ post.Title }}</h2>
            <h2 id="singleText" style="word-wrap:break-word;">{{ post.Text }}</h2>
            <div class="editAndDelete" v-if="post.UserID === logedInUser">
                <router-link class="editBtn" :to="{ name: 'editpost', params: { postId: post.PostID }}">Edit your post?</router-link>
                <span class="deleteBtn" v-if="post.UserID === logedInUser"><i @click="deletePost" class="fas fa-trash-alt"></i></span>
            </div>
        </div>
        <div v-for="comment in comments" :key="comment.CommentID">
            <Comments :node="comment" @getLastComment="getLastComment" @getReply="getReply"></Comments>
        </div>
        <form>
            <input @input="validateComment($event)" placeholder="Write a comment..." type="text" name="comment" v-model="comment">
            <button id="commentBtn" @click.prevent="postComment($event)" type="submit">Comment...</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';
import Comments from './Comments'

export default {
    name: 'SinglePost',
    components: {
        Comments
    },
    data() {
        return {
            post: [],
            componentKey: 0,
            comment: '',
            comments: [],
            parentId: 0,
            replyParentId: ''
        }
    },
    computed: {
        logedInUser() {
            return sessionStorage.getItem('userId')
        },
    },
    methods: {
        getSinglePost() {
            axios.get('http://localhost:3000/api/post/singlepost/' + this.$route.params.postId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200' && response.data.data.length === 1) {
                    this.post = response.data.data[0]
                } else if (response.data.status === '200' && response.data.data.length < 1) {
                    this.$router.push('/notfound')
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
        getComments() {
            axios.get('http://localhost:3000/api/post/comments/' + this.$route.params.postId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    this.comments = response.data.data
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
        getReply(replyParentId) {
            axios.get('http://localhost:3000/api/post/comments/' + this.$route.params.postId + '/' + replyParentId,
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {   
                    let parentComment = this.findById(this.comments, JSON.parse(replyParentId))
                    setTimeout(() => { parentComment.children = response.data.data }, 50)
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
        getLastComment(replyParentId) {
            axios.get('http://localhost:3000/api/post/getlastcomment',
            { headers:
                {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`, 
                }
            }).then((response) => {
                if (response.data.status === '200') {
                    let parentComment = this.findById(this.comments, JSON.parse(replyParentId))
                    setTimeout(() => { 
                        if (!parentComment.children) {
                            parentComment.children = response.data.data
                        } else {
                            parentComment.children = [...parentComment.children, response.data.data[0]] 
                        }   
                    }, 50)
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
        postComment($event) {
            axios.post('http://localhost:3000/api/post/comment/' + this.$route.params.postId, { userId: sessionStorage.getItem('userId'), comment: this.comment, parentId: this.parentId}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '201') {
                    for (let i = 0; i < response.data.data[2].length; i++) {
                        this.comments.push(response.data.data[2][i])
                    }
                    this.comment = ''
                    this.parentId = 0
                    $event.target.style.display = 'none'
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                    this.comment = ''
                    this.parentId = 0
                    this.forceRerender()
                }      
            }).catch((err => {
                alert(err)
                this.comment = ''
                this.parentId = 0
            }))
        },
        deletePost() {
            axios.delete('http://localhost:3000/api/post/deletepost/' + this.$route.params.postId, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.$router.push('/postlist')
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
        findById(data, id) {
            const iter = (a) => {
                if (a.CommentID === id) {
                    result = a;
                    return true;
                }
                return Array.isArray(a.children) && a.children.some(iter);
            }
            var result;
            data.some(iter);
            return result
        },
        validateComment($event) {
            if ($event.target.value.length < 1) {
                $event.target.nextSibling.style.display = 'none'
            } else {
                $event.target.nextSibling.style.display = 'inline'
            }
        },
    },
    beforeMount() {
        this.getSinglePost(),
        this.getComments()
    },
}
</script>

<style lang="scss">

.singleContainer {
    margin: auto auto 3%;
    border: 1px solid gray;
    background-color: white;
    border-radius: 20px;
    padding: 20px;
    width: 60%;
    height: fit-content;
    .singlePostContainer {
        width: 100%;
        height: fit-content;
        margin: auto;
        background-color: lightgrey;
        color: black;
        border: solid black 2px;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 1.5% 2%;
        #singleTitle {
            color: black;
            background: orangered;
            width: fit-content;
            margin: 1rem auto;
            padding: 1% 2.5%;
            border-radius: 10px;
            font-size: large;
        }
        #singleText {
            height: fit-content;
            margin: 5% 0;
            padding: 1% 2%;
            border-radius: 5px;
            background: rgba(255, 68, 0, 0.15);
            font-size: medium;
            text-align: left;
        }
    }
    .editAndDelete {
        width: 100%;
        display: inline-flex;
        width: 40%;
        .editBtn {
            width: fit-content;
            height: fit-content;
            font-size: 20px;
            color: Black;
            border: solid black 2px;
            cursor: pointer;
            text-decoration: none; 
            background-color: white; 
            border-radius: 10px; 
            padding: 2% 4%;
            margin: auto;
            &:hover {
                background-color: orangered;
                color: black;
            }
        }
        .deleteBtn {
            cursor: pointer; 
            font-size: 200%;
            justify-self: center;
            margin: auto;
            color: black;
            &:hover {
                background-color: rgba(0, 0, 0, 0);
                border-radius: 10px;
                color: orangered;
            }
        }
    }
    form {
        justify-content: space-around;
        padding: 3% 1% 7% 1%;
        input {
            width: 80%;
            border: solid black 2px;
            padding: 0.5%  
        }
        #commentBtn {
            width: 15%;
            display: none;
            font-size: 100%; 
            padding: 0 0;
        }
    }
}

@media only screen and (min-width: 760px) {
  .singlepostcontainer {
    width: 70%;
  }
}

@media only screen and (min-width: 1025px) {
  .singlepostcontainer {
    width: 40%;
  }
}

</style>