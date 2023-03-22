<script setup>
import { async } from '@firebase/util';


const { signInWithGooglePopup,errorMessage,logOut } = useAuth();
const signIn = async() => {
    await signInWithGooglePopup();
    console.log(errorMessage.value);
};

const signOut = async()=> {
    await logOut();
    console.log(errorMessage.value);
}
</script>

<template>
    <div>

        <nav class="navbar navbar-expand-lg navbar-light bg-light mx-2">
            <NuxtLink to="/" class="navbar-brand">TaskManager</NuxtLink>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <div class="navbar-nav">
                    <NuxtLink class="nav-link" to="/" activeClass="active" aria-current="page">Home</NuxtLink>
                    <NuxtLink class="nav-link" to="/about" activeClass="active">About</NuxtLink>
                    <button @click="signIn">ログイン</button>
                    <button type="button" class="btn btn-outline-secondary" @click="signOut">ログアウト</button>
                </div>
            </div>
        </nav>
    </div>
</template>



  