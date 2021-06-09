<template>
    <div>
        <div id="commentBox" style="scroll-behavior: smooth; width: 80%" :style="{'padding-left': `${depth * 5}%`}">
            <h4 style="color: red; word-wrap: break-word;">{{ node.Username }}<span style="word-wrap: break-word;" v-if="node.ReplyTo !== undefined">{{ ' ' + '>' + ' ' + node.ReplyTo }}</span></h4>
            <div :key="componentKeyEdit" style="flex-flow: row; justify-content: space-around; align-items: center">
                <p style="word-wrap:break-word; color: black;">{{ node.Comment }}</p>
            </div>
            <div class="commentOptions">
                <div :key="componentKey">
                    <span class="replyBtn" :id="node.CommentID" style="cursor: pointer" @click="replyTo($event)">Reply</span>
                </div>
                <div class="editAndDelete" style="min-width: 35%;" v-if="node.UserID === logedInUser">
                    <span class="editBtn" :key="componentKeyEdit" :id="node.CommentID" @click="editComment($event)">Edit</span>
                    <span class="deleteBtn" style="cursor: pointer; padding: 2% 0 0 0"><i @click="deleteComment($event)" :id="node.CommentID" class="fas fa-trash-alt"></i></span>
                </div>
            </div>
            <br>
            <form class="formReply" style="display: none; padding: 0 2% 0 2%">
                <input @input="validateComment($event)" style="margin-right: 3%" placeholder="Write a comment..." type="text" :name="node.CommentID" v-model="reply">
                <button style="display: none; width: 20%" @click.prevent="sendReply($event), getReply($event)">...</button>
            </form>
            <br v-if="!expanded && hasReply === 1" style="display: none;">
            <span :id="node.CommentID" style="cursor: pointer;" @click="setParentId($event), getReply()" v-if="hasReply === 1 || node.children" class="type">{{ expanded ? '' : 'View Replies' }}</span>
        </div>
        <div v-if="expanded">
            <Comments
                v-on="$listeners"
                v-for="child in node.children"
                :key="child.CommentID"
                :node="child"
                :depth="1"
            />
        </div>
    </div> 
</template>

<script>
import axios from 'axios';

export default {
    name: 'Comments',
    data() {
        return {
            componentKey: 0,
            componentKeyEdit: 0,
            reply: '',
            parentId: null,
            expanded: false,
            commentId: null,
            previousEditedComment: ''
        }
    },
    computed: {
        logedInUser() {
            return sessionStorage.getItem('userId')
        },
        hasReply() {
            return this.node.hasReply
        },
    },
    props: {
        node: Object,
        depth: {
            type: Number,
            default: 1,
        }
    },
    methods: {
        replyTo($event) {
            this.parentId = $event.target.id
            this.reply = ''
            let replyInput = document.getElementsByName($event.target.id)
            replyInput[0].parentElement.style.display = 'flex'
            if (replyInput[0].parentElement.nextSibling.tagName == 'BR' ) {
                replyInput[0].parentElement.nextSibling.style.display = 'inline'
            }
            replyInput[0].focus()
        },
        sendReply($event) {
            axios.post('http://localhost:3000/api/post/comment/' + this.$route.params.postId, { userId: sessionStorage.getItem('userId'), comment: this.reply, parentId: this.parentId, replyTo: $event.target.parentElement.parentElement.parentElement.childNodes[0].childNodes[0].textContent.split(" ").splice(0)[0]}, {
            headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json'  
                }
            },
            ).then((response) => {
                if (response.data.status === '201') {
                    let formComment = document.getElementsByClassName('formReply')
                    for (let i = 0; i < formComment.length; i++) {
                        formComment[i].style.display = 'none'
                    }
                    this.reply = ''
                    this.parentId = null
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                    this.reply = ''
                    this.parentId = null
                }      
            }).catch((err => {
                alert(err)
                this.reply = ''
                this.parentId = null
            }))
        },
        deleteComment($event) {
            axios.delete('http://localhost:3000/api/post/deletecomment/' + $event.target.id, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`
                },
            }).then((response) => {
                if (response.data.status === '200') {
                    this.expanded = false
                    $event.target.parentElement.parentElement.parentElement.parentElement.style.display = 'none'
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
        editComment($event) {
            $event.target.style.display = 'none'
            this.commentId = $event.target.id
            this.previousEditedComment = $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].textContent
            let textComment = $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0].textContent
            let textArea = document.createElement('textarea')
            textArea.style.border = '1px solid grey'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].replaceChild(textArea, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0])
            textArea.value = textComment
            textArea.style.width = '70%'
            textArea.addEventListener('input', () => {
                if (textArea.value.length < 1) {
                    editCommentButton.style.display = 'none'
                } else {
                editCommentButton.style.display = 'inline'
                }
            })
            let editCommentButton = document.createElement('i')
            editCommentButton.className = "fas fa-check"
            editCommentButton.style.color = 'greenyellow'
            editCommentButton.style.width = '10%'
            editCommentButton.style.padding = '0 0'
            editCommentButton.style.cursor = 'pointer'
            editCommentButton.addEventListener('click', ($event) => {
                axios.put('http://localhost:3000/api/post/editcomment', 
            { 
                commentId: this.commentId, 
                comment: $event.target.parentElement.childNodes[0].value 
            },
            { headers: {
                'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                'Content-Type': 'application/json' 
                }
            }
            ).then((response) => {
                if (response.data.status === '200') {
                    let editedComment = $event.target.parentElement.childNodes[0].value
                    let newComment = document.createElement('p')
                    newComment.style.color ='black'
                    newComment.style.fontWeight ='normal'
                    $event.target.parentElement.childNodes[1].style.display = 'none'
                    $event.target.parentElement.childNodes[2].style.display = 'none'
                    $event.target.parentElement.style.display = 'inline'
                    newComment.textContent = editedComment
                    newComment.style.wordWrap = 'break-word'
                    $event.target.parentElement.parentElement.childNodes[1].replaceChild(newComment, $event.target.parentElement.parentElement.childNodes[1].childNodes[0])
                    $event.target.parentElement.parentElement.childNodes[2].childNodes[1].childNodes[0].style.display = 'inline'
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    alert(response.data.message)
                }
            }).catch((err => {
                alert(err)
            }))
            })
            let cancelEditCommentButton = document.createElement('i')
            cancelEditCommentButton.className = "fas fa-times"
            cancelEditCommentButton.style.color = 'crimson'
            cancelEditCommentButton.addEventListener('click', () => {
                let previousComment = document.createElement('p')
                previousComment.style.color = 'black'
                previousComment.style.wordWrap = 'break-word'
                previousComment.textContent = this.previousEditedComment
                $event.target.parentElement.parentElement.parentElement.childNodes[1].replaceChild(previousComment, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[0])
                $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[1].style.display = 'none'
                $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2].style.display = 'none'
                $event.target.parentElement.parentElement.parentElement.childNodes[2].childNodes[1].childNodes[0].style.display = 'inline'
                $event.target.parentElement.parentElement.parentElement.childNodes[1].style.display = 'inline'
            })
            cancelEditCommentButton.style.cursor = 'pointer'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].style.display = 'flex'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].style.margin = '0 0 5% 0'
            $event.target.parentElement.parentElement.parentElement.childNodes[1].insertBefore(editCommentButton, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[1])
            $event.target.parentElement.parentElement.parentElement.childNodes[1].insertBefore(cancelEditCommentButton, $event.target.parentElement.parentElement.parentElement.childNodes[1].childNodes[2])
        },
        validateComment($event) {
            if ($event.target.value.length < 1) {
                $event.target.nextSibling.style.display = 'none'
            } else {
                $event.target.nextSibling.style.display = 'inline'
            }
        },
        getReply($event) {
            if ($event && !this.expanded) {
                this.$emit('getReply', this.parentId)
                setTimeout(() => { this.expanded = true }, 1500)
                setTimeout(() => { $event.target.parentElement.parentElement.parentElement.parentElement.childNodes[0].childNodes[1].lastElementChild.scrollIntoView() }, 1700)
                $event.target.parentElement.style.display = 'none'
            } else if ($event && this.expanded) {
                this.$emit('getLastComment', this.parentId)
                $event.target.parentElement.style.display = 'none'
                setTimeout(() => { this.forceRerender() }, 1500)    
                setTimeout(() => { $event.target.parentElement.parentElement.parentElement.parentElement.childNodes[0].childNodes[1].lastElementChild.scrollIntoView() }, 1400)
                $event.target.parentElement.style.display = 'none'
            } else {
                this.$emit('getReply', this.parentId)
                setTimeout(() => { this.expanded = true }, 1000)
            }
        },
        setParentId($event) {
            this.parentId = $event.target.id
        },
        forceRerender() {
            this.componentKey += 1;
        },
        forceRerenderEdit() {
            this.componentKeyEdit += 1;
        },
    },
    beforeMount() {
        document.addEventListener('keypress', ($event) => {
            if ($event.keyCode === 13) {
                $event.preventDefault()
            }
        })
    },
}
</script>

<style lang="scss">

#commentBox {
    border: 1px solid gray;
    background-color: rgba(211, 211, 211, 0.521);
    border-radius: 20px;
    padding: 20px;
    width: 25%;
    margin: 2% auto;
}

.commentOptions {
    display: block;
    margin: 3%;
    .replyBtn {
        font-size: 20px;
        color: Black;
        border: solid black 2px;
        cursor: pointer;
        text-decoration: none; 
        background-color: white; 
        border-radius: 10px; 
        padding: 1% 2%;
        &:hover {
            background-color: orangered;
            color: black;
        }
    }
    .editAndDelete {
        margin: 2% 0 0 0;
    }
}

.formReply {
    justify-content: space-around;
    padding: 3% 1% 7% 1%;
    input {
        width: 80%;
        border: solid black 2px;
        padding: 0.5%  
    }
    button {
        width: 15%;
        display: none;
        font-size: 100%; 
        padding: 0 0;
        min-width: 50px;
    }
}

.commentEdit {
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

</style>