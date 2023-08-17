<template>
  <div class="team-details">

    <h1>Team ID: {{ teamId }}</h1>
    <h2>Team Name: {{ team.teamName }}</h2>
    <h2>Team Leader: {{ team.leaderId }}</h2>
    <h2>Team Members:</h2>
    <div v-for="(member, index) in team.members">
      <div>
        {{ member }}
      </div>
    </div>
    <h2>ユーザーリスト:</h2>
    <div class="user-list">
      <div v-for="(user, index) in users" class="user-item">
        <div>
          {{ user.email }}
          <svg v-if="!team.members.includes(user.uid)" @click="addTeamMember(user.uid)" xmlns="http://www.w3.org/2000/svg"
            width="16" height="16" fill="currentColor" class="bi bi-person-fill-add" viewBox="0 0 16 16">
            <path
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path
              d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-person-fill-x text-danger" viewBox="0 0 16 16" @click="deleteTeamMember(user.uid)">
            <path
              d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z" />
            <path
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup>
definePageMeta(
  { middleware: "auth" }
)
const route = useRoute()
const teamId = computed(() => route.params.id)
//getTeam
const { getTeam } = useTeam();
const team = ref([]);
getTeam(teamId.value).then((res) => {
  team.value = res;
  console.log(team.value);
});

const { getAllUserInfo } = useAuth();
const users = ref([]);
getAllUserInfo().then((res) => {

  users.value = res;

});

const { addMember } = useTeam();
//チームにメンバーを追加する関数
function addTeamMember(uid) {
  addMember(teamId.value, uid);
  team.value.members.push(uid);
}
//チームからメンバーを削除する関数
const { deleteMember } = useTeam();
function deleteTeamMember(uid) {
  deleteMember(teamId.value, uid);
  team.value.members = team.value.members.filter((member) => member != uid);
};

</script>

<style scoped>
.team-details {
  padding: 20px;
}

.user-list {
  margin-top: 20px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.bi-person-fill-add,
.bi-person-fill-x {
  width: 16px;
  height: 16px;
  cursor: pointer;
  margin-left: 10px;
}

.bi-person-fill-x {
  fill: red;
  /* 赤い色 */
}

.user-item:hover {
  background-color: #f5f5f5;
}
</style>