import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { collection, addDoc, getFirestore, getDocs, query, where } from "firebase/firestore"
export const useAuth = () => {

    const user = useState<User | null>('user', () => null)
    const errorMessage = ref('')
    async function signInWithGooglePopup() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            user.value = result.user;
            const db = getFirestore()
            // if user information isn't at Firestore users collection, add user information to Firestore users collection
            const usersRef = collection(db, "users");

            let isUserExist = false
            const q = query(collection(db, "users"), where("uid", "==", result.user.uid));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                // ドキュメントが存在しない場合は、新しいドキュメントを追加
                await addDoc(usersRef, {
                    uid: result.user?.uid,
                    name: result.user?.displayName,
                    email: result.user?.email,
                    photoURL: result.user?.photoURL
                });
            } else {
                // ドキュメントが存在する場合は、何もせず終了
                isUserExist = true;
            }

        }
        
        catch (error: any) {
            errorMessage.value = error.message
        }
    }
        async function logOut() {
            const auth = getAuth();
            await signOut(auth).then(() => {
                // Sign-out successful.
                user.value = null;
                errorMessage.value = "ログアウトしました"
            }).catch((error) => {
                // An error happened.
                errorMessage.value = error.message
            });
        }
        async function checkAuthState() {
            return await new Promise<void>((resolve, reject) => {
                if (process.server) return resolve()
                const auth = getAuth();
                onAuthStateChanged(
                    auth,
                    (changeUser) => {
                        if (changeUser) {
                            user.value = changeUser;
                            resolve()
                        } else {
                            user.value = null
                            resolve()
                        }
                    }
                )
            })
        }
        return {
            signInWithGooglePopup,
            logOut,
            errorMessage,
            checkAuthState,
            user
        }
    }