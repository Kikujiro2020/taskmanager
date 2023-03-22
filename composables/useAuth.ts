import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
export const useAuth = () => {

    const user = useState('user', () => null)
    const errorMessage = ref('')
    async function signInWithGooglePopup() {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
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
    return {
        signInWithGooglePopup,
        logOut,
        errorMessage
    }
}
