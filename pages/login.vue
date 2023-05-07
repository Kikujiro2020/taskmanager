<template>
    <div class="login">
      <h1>ログイン</h1>
  
      <form @submit.prevent="loginUser">
        <div class="form-group">
          <label for="email">メールアドレス</label>
          <input type="email" id="email" v-model="email" required>
        </div>
  
        <div class="form-group">
          <label for="password">パスワード</label>
          <input type="password" id="password" v-model="password" required>
        </div>
  
        <button type="submit">ログイン</button>
      </form>
  
      <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';

  const { logInWithEmailAndPassword } = useAuth();
  
  const email = ref('');
  const password = ref('');
  const errorMessage = ref('');
  
  const loginUser = async () => {
    try {
      await logInWithEmailAndPassword(email.value, password.value);
    } catch (error:any ) {
      errorMessage.value = error.message;
    }
  };
  </script>
  
  <style scoped>
  .login {
    max-width: 400px;
    margin: 0 auto;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
  }
  
  input[type='email'],
  input[type='password'] {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
  }
  
  button[type='submit'] {
    background-color: #007bff;
    color: white;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .error {
    color: red;
  }
  </style>
  
  