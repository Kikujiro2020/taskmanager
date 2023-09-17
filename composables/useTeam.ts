// Purpose: Composable for creating a team
import { getFirestore, collection, addDoc, serverTimestamp ,query,where,getDocs, arrayUnion, doc, updateDoc, getDoc, arrayRemove} from "firebase/firestore";
// Define a Team interface
export const useTeam = () => {
  interface Team {
    teamName: string;
    teamId?: string;
    leaderId: string;
    createdat?: object;
    members?: string[];
  }

  const db = getFirestore();
  const teamsRef = collection(db, 'teams');
  
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
      
      let team: Team = {
        teamName: doc.data().teamName,
        teamId: doc.id,
        leaderId: doc.data().leaderId,
        createdat: doc.data().createdat,
        members: doc.data().members,
      };
      myTeams.push(team);
     
    });
    return myTeams;
  };
  //チームを取得する
  const getTeam = async (teamId: string) => {
    const teamRef = doc(db, 'teams', teamId);
    const docSnap = await getDoc(teamRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    } 
  }
    
//チームにメンバーを追加する
  const addMember = async (teamId: string, userId: string) => {
    const teamRef = doc(db, 'teams', teamId);
    await updateDoc(teamRef, {
      members: arrayUnion(userId),
    });
  };
//チームからメンバーを削除する
  const deleteMember = async (teamId: string, userId: string) => {
    const teamRef = doc(db, 'teams', teamId);           
    await updateDoc(teamRef, {
      members: arrayRemove(userId),
    });
  };

//ユーザーの所属チームを変更する
  const changeTeam = async (teamId: string, userId: string) => {
    //usersコレクションのドキュメントのuidのフィールドをuserIdで検索
    const userRef = collection(db, 'users');
    const q = query(userRef, where('uid', '==', userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
   
      //ドキュメントのbelongsフィールドをteamIdに変更
      updateDoc(doc.ref, {
        belongs: teamId,
      });
    });
    //
  };

//チームメンバーに変更があればリアルタイムに反映する  
                                  
  
  return { makeTeam ,getMyTeam,useTeam,addMember,getTeam,changeTeam,deleteMember };
}
