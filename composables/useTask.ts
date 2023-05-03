import { getAuth } from "firebase/auth";
import { serverTimestamp ,getFirestore, collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, query,where, DocumentData, updateDoc } from "firebase/firestore";
export const useTask = () => {

  // Define a Task interface
  interface Task {
    completed: string;
    title: string;
    id?: string;
    createdat?: object;
    uid?: string;
  }

  // Create a new task in Firestore
  async function createTask(task: Task): Promise<void> {
    // Get a reference to the tasks collection in Firestore
    const db = getFirestore();
    const tasksRef = collection(db, "tasks");
    //taskにcreatedatを追加
    task.createdat = serverTimestamp();   
    //taskを追加した際のuserのidを取得して、taskに追加
    const auth = getAuth();
    const user = auth.currentUser;  
    if (user !== null) {
      task.uid = user.uid;
    } else {
      console.log("user is null");
    }
    // Use the addDoc function to add a new document to the tasks collection
    try {
      await addDoc(tasksRef, task);
      console.log("Task added!");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  }
  async function loadTasks() {
    try {
      const db = getFirestore();
      // Get a reference to the tasks collection in Firestore  
      const tasksRef = query( collection(db, "tasks"),where("completed", "==", false));
      // Get all documents from the tasks collection without completed tasks
      const snapshot = await getDocs(tasksRef);
      
      // Create an array of Task objects from the documents in the snapshot
      let loadedTasks: Task[] = [];
      snapshot.forEach((doc) => {
        //完了したタスクを除外する
        let task: Task = {
          id: doc.id,
          title: doc.data().title,
          completed: doc.data().completed,
          createdat: doc.data().createdat,
        };
        loadedTasks.push(task);
      });
      //
      console.log("Tasks loaded!");
      return loadedTasks;
    } catch (error) {
      console.error("Error loading tasks: ", error);
    }
  }
  //deleteTaskを追加
  async function deleteTask(task: Task): Promise<void> {
    try {
      const db = getFirestore();
      // taskのidを参照して、そのidのドキュメントを削除する
      const tasksCol = collection(db, "tasks");
      const taskRef = doc(tasksCol, task.id);
      await deleteDoc(taskRef);
      console.log("Task deleted!");
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  }
  //make a function to update the task
  async function updateTask(task: Task): Promise<void> {
    try {
      const db = getFirestore();
      // taskのidを参照して、そのidのドキュメントを更新する
      const updatedTask = { ...task };
      const tasksCol = collection(db, "tasks");
      const taskRef = doc(tasksCol, task.id);
      await updateDoc(taskRef, updatedTask);
      console.log("Task updated!");
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  }


  // Return the functions to be used in the component
  return { createTask, loadTasks, deleteTask, updateTask };
}

