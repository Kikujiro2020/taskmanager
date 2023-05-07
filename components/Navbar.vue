<script setup lang="ts">
const { signInWithGooglePopup,errorMessage,logOut } = useAuth();
//ログイン方法の切り替えが必要　emailとpasswordでログインするか、Googleアカウントでログインするか

const signIn = async(useGoogleSignIn:boolean) => {
    //emailとpasswordでログインする場合
    if(!useGoogleSignIn){
        //emailとpasswordでログインする処理
        //login.vueにページ遷移する
    const router = useRouter();
    router.push("/login");
    }
    //Googleアカウントでログインする場合
    else{
        await signInWithGooglePopup();
        console.log(errorMessage.value);
    }
    //ログインに成功したら、errorMessage.valueが空になる
    if(errorMessage.value === ""){
        console.log("ログインに成功しました");
    }
    //ログインに失敗したら、errorMessage.valueにエラーメッセージが入る
    else{
        console.log(errorMessage.value);
    }

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
                    <NuxtLink class="nav-link" to="/teams" activeClass="active">Teams</NuxtLink>
                    <NuxtLink class="nav-link" to="/user" activeClass="active">User</NuxtLink>
                    <NuxtLink class="nav-link" to="/tasks" activeClass="active">Tasks</NuxtLink>
                    <button @click="signIn(true)">Googleアカウントでログイン</button>
                    <button @click="signIn(false)">メールアドレスでログイン</button>
                    <button type="button" class="btn btn-outline-secondary" @click="signOut">ログアウト</button>
                </div>
            </div>
        </nav>
    </div>
</template>



  