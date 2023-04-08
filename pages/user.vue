<template>
    <div v-if="user">
      <p>現在ログインしているユーザー名: {{ user.displayName }}</p>
      <p>メールアドレス: {{ user.email }}</p>
      <p>プロフィール画像:</p>
      <img :src="user.photoURL" :alt="`${user.displayName}のプロフィール画像`" />
    </div>
    <div v-else>
      <p>ログインしていません。</p>
    </div>
  </template>
  
  <script setup>
  
  
  const { user, checkAuthState } = useAuth();
  
  // checkAuthState関数を呼び出し、認証状態を監視し、ユーザー情報を取得する
  checkAuthState().then(() => {
    console.log('認証状態を確認しました');
  });
  
  </script>
  