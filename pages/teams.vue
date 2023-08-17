<template>
    <div class="container">
      <div class="team-list"></div>
      <div class="mb-3">
        <!--チーム一覧を表示する-->
        <h1>チーム一覧</h1>
        <div class="team-list-cards">
          <div v-for="(team,index) in teams">
            <div class="team-list-card card-body justify-content-between">
              <h2>{{ team.teamName }}</h2>
              <p>リーダー: {{ team.leaderId }}</p>
              <p>メンバー: {{ team.memberId }}</p>
              <p>チームID: {{ team.teamId }}</p>
              <p>チーム作成日: {{ team.createdat.toDate() }}</p>
              <p>チーム更新日: {{ team.updatedat }}</p>
              <button type="button" class="btn btn-primary m-1" @click="teamChange(team.teamId)" :disabled="isTeamJoined(team.teamId)"> {{ isTeamJoined(team.teamId) ? "参加中" : "変更" }}</button>
              <button type="button" class="btn btn-primary m-1" @click="customTeam(team.teamId)">設定</button>
            
            </div>
            
          </div> 
        </div>

      </div>
      <h2>新しいチームを作成する</h2>      
        <div class="mb-3">
          <label for="team-name" class="form-label">チーム名:</label>
          <input type="text" id="team-name" v-model="teamName" required class="form-control">
        </div>
        <div class="mb-3">
          <label for="leader-id" class="form-label">リーダーのID(email):</label>
          <input type="email" id="leader-id" v-model="leaderId" required class="form-control" readonly>
        </div>
        <button type="submit" class="btn btn-primary "  @click="createTeam(leaderId,teamName)">作成</button>      
      <p v-if="createdTeam">チーム{{ createdTeam }}を作成しました。</p>
    </div>
  </template>
  
  <script setup>
   definePageMeta(
        {middleware:"auth"}
    )
  import { ref } from 'vue';
  
  const { checkAuthState,user } = useAuth();
  checkAuthState()
  .then(() => {
    console.log("認証状態を確認しました");
  })
  .catch((error) => {
    console.log(error.message);
  });
  const teamName = ref('');
  const {makeTeam,changeTeam} = useTeam();
  const currentUser = user.value;
  const leaderId = ref(currentUser.email);
  const createdTeam = ref('');
  const router = useRouter();
  const teams = ref([]);
  let userInfo = reactive({});
  const belongs = ref(userInfo.belongs);
  const { getMyTeam } = useTeam();
  //ユーザー情報を取得する
  const { getUserInfo } = useAuth();
  getMyTeam(currentUser.email).then((res) => {
    teams.value = res;
    
  });

  await getUserInfo().then((res) => {
    userInfo = res;
    belongs.value = userInfo.belongs;
  });
  function customTeam(teamId) {
      console.log(teamId);
      router.push(`/team/${teamId}`);
  }
  //チームを変更する関数
  function teamChange(teamId) {
    console.log(teamId);
    changeTeam(teamId,userInfo.uid)
    userInfo.belongs = teamId;
    belongs.value = teamId;
   
  }
  //チームを作成する関数
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
  //ユーザーが指定したチームに参加しているかどうかを判定する関数
  
  function isTeamJoined(teamId) {
    return belongs.value === teamId; 
  }


  </script>
  
  <style scoped>
  .team-list {
    margin-bottom: 20px;
  }
  .team-list-card {
    margin-bottom: 20px;
  }
  .team-list-cards {
    display: flex;
    flex-wrap: wrap;
  }
  .team-list-card {
    width: 300px;
    margin-right: 20px;
  }
  .team-list-card:last-child {
    margin-right: 0;
  }
  .team-list-card h2 {
    font-size: 20px;
    margin-bottom: 10px;
  }
  .team-list-card p {
    margin-bottom: 5px;
  }
  .team-list-card button {
    margin-top: 10px;
  }
  
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
  