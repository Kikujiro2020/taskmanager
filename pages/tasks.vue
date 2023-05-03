<script setup>
definePageMeta(
  { middleware: "auth" }
)
import { ref, onMounted } from 'vue';
import { useTask } from '~~/composables/useTask';
import { useAuth } from '~~/composables/useAuth';
const tasks = ref([]);
const title = ref('');

const isEditing = ref(false);
const { checkAuthState } = useAuth();
checkAuthState()
  .then(() => {
    console.log("認証状態を確認しました");
  })
  .catch((error) => {
    console.log(error.message);
  });
const { createTask, loadTasks, deleteTask, updateTask } = useTask();

onMounted(async () => {
  // Firestoreからタスク一覧を取得
  await loadTasks().then((loadedTasks) => {
    tasks.value = loadedTasks;
    console.log(tasks.value)
  });
});


const onSubmit = () => {
  // タスクのタイトルが空欄の場合は処理を中断する
  if (!title.value) return;
  // タスクの作成時刻を取得する　firestoreのタイムスタンプを取得する
    const newTask = { title: title.value, completed: false, isEditing: false };
  // タスクを追加した後に、titleを空欄に設定する
  title.value = '';
  // Firestoreに新しいタスクを追加
  createTask(newTask).then(() => {
    // Firestoreに書き込みが完了した後に、Vueのデータプロパティに新しいタスクを追加する
    loadTasks().then((loadedTasks) => {
      tasks.value = loadedTasks;
    });
  });
};

// タスクの完了状態を更新する
const completedTask = async(index) => {
  console.log(tasks.value[index].id)                                           
  //composables/useTask.tsのupdateTaskを呼び出す
  await updateTask(tasks.value[index])
  // Firestoreからタスク一覧を取得
  await loadTasks().then((loadedTasks) => {
    tasks.value = loadedTasks;
  });
};
const delTask = (index) => {
  //composables/useTask.tsのdeleteTaskを呼び出す
  deleteTask(tasks.value[index])

};
//updateTask
const saveChange = (index, task) => {
  //composables/useTask.tsのupdateTaskを呼び出す
  updateTask(tasks.value[index])
  task.isEditing = false
  //編集を終えてタイトルを更新
  loadTasks().then((loadedTasks) => {
    tasks.value = loadedTasks;
  });
};
//cancel
const saveCancel = (task) => {
  task.isEditing = false
  // 編集前のタイトルに戻す
  loadTasks().then((loadedTasks) => {
    tasks.value = loadedTasks;
  });
};


</script>

<template>
  <div class="task-list">
    <h1>Tasks</h1>
    <div class="task-list__cards">
      <div v-for="(task, index) in tasks" :key="index" class="task-list__card card-body justify-content-between">
        <div class="task-list__header">
          <label class="task-list__label">
            <input type="checkbox" v-model="task.completed" class="task-list__checkbox" @change="completedTask(index)">
            <span v-if="!task.isEditing"> {{ task.title }}</span>
            <input v-else type="text" v-model="task.title" class="task-list__input">
            <button v-if="task.isEditing" class="task-list__button" @click="saveChange(index, task)">保存</button>
            <button v-if="task.isEditing" class="task-list__button" @click="saveCancel(task)">キャンセル</button>
          </label>

          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-pen mx-3"
            viewBox="0 0 16 16" @click="task.isEditing = !task.isEditing">
            <path
              d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z" />
          </svg>
          <div class="ms-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x mx-3"
              viewBox="0 0 16 16" @click="delTask(index)">
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
            </svg>
          </div>

        </div>
      </div>
    </div>
    <form @submit.prevent="onSubmit" class="task-list__form">
      <div class="task-list__form-group">
        <input type="text" v-model="title" class="task-list__input" placeholder="Add a new task">
        <button type="submit" class="task-list__button">Add task</button>
      </div>
    </form>
  </div>
</template>

<style>
.task-list {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: #ffffff;
}

.task-list h1 {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.task-list__cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}

.task-list__card {
  display: flex;
  flex-direction: column;
  border: 1px solid lightgray;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.task-list__header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #ffffff;
  color: black;
  font-size: 24px;
}

.task-list__label {
  display: flex;
  align-items: center;
  margin-right: 15px;
  cursor: pointer;
}

.task-list__checkbox {
  margin-right: 10px;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 25%;
  border: 2px solid #000000;
  outline: none;
  transition: all 0.3s ease;
}

.task-list__checkbox:checked {
  background-color: #9caddc;
  border-color: #007aff;
}

.task-list__body {
  padding: 16px;
}

.task-list__form-group {
  display: flex;
  margin-bottom: 20px;
}

.task-list__input,
.task-list__textarea {
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  outline: none;
  margin-right: 10px;
  flex-grow: 1;
}

.task-list__button {
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #007aff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.task-list__button:hover {
  background-color: #0062cc;
}

@media (max-width: 600px) {
  .task-list__cards {
    grid-template-columns: 1fr;
  }
}
</style>
