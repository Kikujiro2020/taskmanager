<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card mt-5">
            <div class="card-header">{{ user ? user.name : 'Guest' }}</div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-3">Email:</div>
                <div class="col-md-9">
                  <div v-show="showEmail">{{ user ? user.email : '' }}</div>
                </div>
                <div class="col-md-3">
                  <button class="btn btn-primary show-button" @click="showEmail = !showEmail">{{ showEmail ? 'Hide Email' : 'Show Email' }}</button>
                </div>
              </div>
              <div class="row">
                <div class="col-md-3">Username:</div>
                <div class="col-md-9">{{ user ? user.username : 'Guest' }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button @click="makeDummyAccount()">ダミーアカウント作成</button>
    </div>
  </template>
 
  <script setup>
  import { ref } from "vue";
  import { useAuth } from "@/composables/useAuth.ts";
  
  const showEmail = ref(false);
  const isAdministrator = ref(false);
  const { user, checkAuthState,isAdmin,createDummyAccount } = useAuth();
  
  const adminCheck = () => {
    //admin権限をチェック
    isAdministrator.value = isAdmin()
  };
  const makeDummyAccount = () => {
    //admin権限をチェック
    adminCheck()
    //admin権限がある場合のみダミーアカウントを作成
    if (isAdministrator.value === true) {
      createDummyAccount()
    }else{
      alert("管理者権限がありません")
    }
  }
  checkAuthState()
    .then(() => {
      console.log("認証状態を確認しました");
    })
    .catch((error) => {
      console.log(error.message);
    });
  </script>
  
  <style scoped>
  .hidden {
    display: none;
  }
  </style>