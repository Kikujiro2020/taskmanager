import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";
export const useAuth = () => {

    const user = useState('user', () => null)
    const errorMessage = ref('')
    async function signInWithGooglePopup() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            user.value = result.user;
            errorMessage.value="ログインしました。"
        } catch (error) {
            console.log(error);
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
    async function checkAuthState(){
        return await new Promise<void>((resolve,reject)=>{
            if(process.server) return resolve()
            const auth = getAuth();
            onAuthStateChanged(
                auth,
                (changeUser) => {
                    if(changeUser){
                        user.value = changeUser;
                        resolve()
                    }else {
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
