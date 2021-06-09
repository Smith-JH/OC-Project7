<template>
    <form>
        <img src="../assets/7plQ.gif" alt="" id="loadingGif" hidden>
        <div class="container upload">
            <h1 id="addPost">Write an article</h1>
            <div>
                <label for="title"><b>Title:</b></label>
                <input id="titleInfo" class="writePost postTitle" @input="validateFileInput($event)" v-model="title" placeholder="Give your article a title..." type="text" name="title">
            </div>
            <div>
                <label for="text"><b>Share your thoughts here:</b></label>
                <textarea class="writePost" id="articleText" @input="validateFileInput($event)" v-model="text" placeholder="Give your article a body..." type="text" name="text"/>
            </div>
            <button id="addBtn" type="submit" @click.prevent="uploadFile($event)" disabled>Upload</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios';

export default {
    name: 'addPost',
    data () {
        return {
            userId: sessionStorage.getItem('userId'),
            title: '',
            text: ''
        }
    },
    methods: {
        uploadFile() {
            document.getElementsByClassName('upload')[0].style.display = 'none'
            document.getElementById('loadingGif').removeAttribute('hidden')
            axios.post('http://localhost:3000/api/post',
                { userId: this.userId,
                  title: this.title,
                  text: this.text, },                
                { headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json' 
                    } 
            }).then((response) => {
                if (response.data.status === '201') {
                    this.$router.push('/postlist')
                } else if (response.data.status === '401') {
                    alert(response.data.message)
                    this.$store.commit('logout')
                } else {
                    document.getElementById('loadingGif').setAttribute('hidden', true);
                    document.getElementsByClassName('upload')[0].style.display = 'initial'
                    alert(response.data.message)
                }
            }).catch((err => {
                document.getElementById('loadingGif').setAttribute('hidden', true);
                document.getElementsByClassName('upload')[0].style.display = 'initial'
                alert(err)
            }))
        },
        validateFileInput() {
            let a = document.getElementById('titleInfo');
            let b = document.getElementById('articleText');
            let submitButton = document.getElementsByTagName('button')[0];
            if (a.value.length > 1 && b.value.length > 10) {
                submitButton.removeAttribute('disabled');
            } else {
                submitButton.setAttribute('disabled', true)
            }
        }
    }
}
</script>

<style lang="scss">
#imagepreview {
    padding: 5% 0 0 0;
}
#addPost {
    text-align: center;
    color: orangered;
    margin: auto;
}
.upload {
    display: flex;
    flex-flow: column;
    margin: 0 0 5% 0;
    width: 80%;
    label {
        display: block;
        margin-top: 1%;
    }
}
.writePost {
  width: 80%;
  margin: 10px;
  background-color: lightgrey;
  color: black;
  border-radius: 10px;
  outline: none;
  box-sizing: border-box;
  border: solid black 2px;
}
.writePost.postTitle {
    padding: 12px 20px;
    margin-bottom: 1.5%;
}
#articleText {
    margin-top: 2%;
    height: 30vh;
    vertical-align: top;
    overflow-wrap: break-word;
    padding: 10px 15px;
    font-family: Arial, sans-serif;
    letter-spacing: 0.8px;
}
#addBtn {
  font-size: 120%;
  margin: 2% auto;
  padding: 10px;
  border-radius: 15px;
  width: 50%;
  outline: none;
}
#addBtn:active {
    background-color: lightgrey;
    color: orangered;
}
#addBtn:hover {
      opacity: 0.8;
      background-color: orangered;
      color: white;
      cursor: pointer;
}
#addBtn:disabled {
    cursor: default;
    opacity: 0.5;
    color: #fff;
    background-color: rgb(200, 200, 200);
    border-color: rgb(150, 150, 150);
}

@media only screen and (min-width: 461px) {
    .uploadContainer {
        width: 60%;
    }
}
@media only screen and (min-width: 1025px) {
    .uploadContainer {
        width: 40%;
    }
}
</style>