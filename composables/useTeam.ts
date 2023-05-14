// Purpose: Composable for creating a team
import { getFirestore, collection, addDoc, serverTimestamp ,query,where,getDocs} from "firebase/firestore";
// Define a Team interface
export const useTeam = () => {
  interface Team {
    teamName: string;
    teamId?: string;
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
        //documentIDをteamIdtとして保存
        console.log('Document written with ID: ', docRef.id);
        //router.push('/teams');
      })
      .catch((error) => {
        console.error('Error adding document: ', error);
      });
  };
  // 自分が作ったチームを取得する　userId(email)を引数にとる
  const getMyTeam = async (userId: string) => {
    let myTeams: Team[] = [];
    const q = query(teamsRef, where('leaderId', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, ' => ', doc.data());
      let team: Team = {
        teamName: doc.data().teamName,
        teamId: doc.id,
        leaderId: doc.data().leaderId,
        createdat: doc.data().createdat,
      };
      myTeams.push(team);
     
    });
    return myTeams;
  };


  return { makeTeam ,getMyTeam,useTeam};
}
