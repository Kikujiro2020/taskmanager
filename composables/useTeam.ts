// Purpose: Composable for creating a team
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";
// Define a Team interface
export const useTeam = () => {
  interface Team {
    teamName: string;
    leaderId: string;
    createdat?: object;
  }

  const db = getFirestore();
  const teamsRef = collection(db, 'teams');
  const router = useRouter();
  const createdTeam = ref('');
  // Define a makeTeam function
  const makeTeam = async (team: Team) => {
    //teamにcreatedatを追加
    team.createdat = serverTimestamp();
    // Use the addDoc function to add a new document to the teams collection
    
    await addDoc(teamsRef, team)
      .then((docRef) => {
        console.log('Document written with ID: ', docRef.id);
        //router.push('/teams');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  }
  return { makeTeam };
}