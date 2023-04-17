<script setup>
import { ref, onMounted } from 'vue';
import { useTask } from '~~/composables/useTask';

const tasks = ref([]);
const title = ref('');

const { createTask, loadTasks } = useTask();

onMounted(() => {
  loadTasks().then((loadedTasks) => {
    tasks.value = loadedTasks;
  });
});

const onSubmit = () => {
  const newTask = { title: title.value, completed: false };
  createTask(newTask).then(() => {
    // 新しいタスクが作成された後に全てのタスクを再読み込みする
    loadTasks().then((loadedTasks) => {
      tasks.value = loadedTasks;
    });
  });
  title.value = '';
};

</script>


<template>
  <div class="task-list">
    <h1>Tasks</h1>
    <div class="task-list__cards">
      <div v-for="task in tasks" :key="task.id" class="task-list__card">
        <div class="task-list__header">
          <label class="task-list__label">
            <input type="checkbox" v-model="task.completed" class="task-list__checkbox">
            {{ task.title }}
          </label>
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
  background-color: #007aff;
  color: white;
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
  border-radius: 50%;
  border: 2px solid #ffffff;
  outline: none;
  transition: all 0.3s ease;
}

.task-list__checkbox:checked {
  background-color: #ffffff;
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
