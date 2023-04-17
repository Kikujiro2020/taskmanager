import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
export const useTask =()=>{

    // Define a Task interface
    interface Task {
      title: string;
      description: string;
      dueDate: Date;
    }
    
    // Create a new task in Firestore
    async function createTask(task: Task): Promise<void> {
      // Get a reference to the tasks collection in Firestore
      const db = getFirestore();
      const tasksRef = collection(db, "tasks");
    
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
          const tasksRef = collection(db, "tasks");
          const snapshot = await getDocs(tasksRef);
          let loadedTasks: Task[] = [];
          snapshot.forEach((doc) => {
            loadedTasks.push(doc.data() as Task);
          });
          console.log("Tasks loaded!");
          return loadedTasks;
        } catch (error) {
          console.error("Error loading tasks: ", error);
        }
      }
    
      return { createTask, loadTasks };
}

