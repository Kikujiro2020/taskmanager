<template>
    <div class="container">
      <h2>新しいチームを作成する</h2>      
        <div class="mb-3">
          <label for="team-name" class="form-label">チーム名:</label>
          <input type="text" id="team-name" v-model="teamName" required class="form-control">
        </div>
        <div class="mb-3">
          <label for="leader-id" class="form-label">リーダーのID(email):</label>
          <input type="email" id="leader-id" v-model="leaderId" required class="form-control" readonly>
        </div>
        <button type="submit" class="btn btn-primary"  @click="createTeam(leaderId,teamName)">作成</button>      
      <p v-if="createdTeam">チーム{{ createdTeam }}を作成しました。</p>
    </div>
  </template>
  
  <script setup>
   definePageMeta(
        {middleware:"auth"}
    )
  import { ref } from 'vue';
  import { useAuth } from '~~/composables/useAuth';
  const { checkAuthState,user } = useAuth();
  checkAuthState()
  .then(() => {
    console.log("認証状態を確認しました");
  })
  .catch((error) => {
    console.log(error.message);
  });
  const teamName = ref('');
  const {makeTeam} = useTeam();
  const currentUser = user.value;
  const leaderId = ref(currentUser.email);
  const createdTeam = ref('');
  const router = useRouter();
  function createTeam(leaderId,teamName) {
    //composablesのmakeTeamを呼び出す
    const team = {
      leaderId: leaderId,
      teamName: teamName,
    };
    makeTeam(team).then((res) => {
      createdTeam.value = res.teamName;
      //router.push('/teams');
    });
  }
  </script>
  
  <style scoped>
  form {
    max-width: 500px;
    margin: auto;
  }
  
  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
  }
  
  .btn-primary:hover {
    background-color: #0069d9;
    border-color: #0062cc;
  }
  
  .form-control:focus {
    border-color: #80bdff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
  </style>
  