import { getAuth, signInWithPopup,signInWithEmailAndPassword, GoogleAuthProvider, signOut, onAuthStateChanged, User, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, addDoc, getFirestore, getDocs, query, where } from "firebase/firestore"

export const useAuth = () => {

    const user = useState<User | null>('user', () => null)
    const errorMessage = ref('')
    //emailとpasswordでログイン
    async function logInWithEmailAndPassword(email: string, password: string) {
        const auth = getAuth();
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            user.value = result.user;
            console.log("User signed in!");
        } catch (error: any) {
            errorMessage.value = error.message
            console.error("Error signing in: ", error);
        }
    }
    //emailとpasswordで新規登録
    async function signupWithEmailAndPassword(email: string, password: string) {
        const auth = getAuth();
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            user.value = result.user;
            console.log("User signed in!");
        } catch (error: any) {
            errorMessage.value = error.message
            console.error("Error signing in: ", error);
        }
    }
    
    //Googleアカウントでログイン
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
                    photoURL: result.user?.photoURL,
                    belongs: "",
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
    //ダミー用アカウント一括作成 exmaple.comのドメインを持つアカウントを作成10個
    async function createDummyAccount() {
        //admin権限を持つアカウントのみ実行可能
        const auth = getAuth();
        //現在のuser情報を取得
        let user = auth.currentUser;
        if (user === null) {
            console.log("user is null")
            return
        }
        //emailが特定のアドレスでなければ実行しない
        //特定のアドレスを.envより取得
        const runtimeConfig = useRuntimeConfig()
        const adminEmail = runtimeConfig.public.VUE_APP_ADMIN_EMAIL
        if (user.email !== adminEmail) {
            console.log("user is not admin")
            return
        }
        //メールアドレスのドメイン部分
        const domain = "example.com"
        //パスワード
        const password = "password"
        //作成するアカウント数
        const accountNum = 10
        for (let i = 10; i < accountNum + 10; i++) {
            const email = `dummy${i}@${domain}`
            try {
                const result = await createUserWithEmailAndPassword(auth, email, password)
                user = result.user;
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
                        photoURL: result.user?.photoURL,
                        belongs: "",
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
    //admin権限を持つアカウントかどうかを判定する関数
    function isAdmin() {
        const auth = getAuth();
        //現在のuser情報を取得
        let user = auth.currentUser;
        if (user === null) {
            console.log("user is null")
            return false
        }
        //emailが特定のアドレスでなければ実行しない
        //特定のアドレスを.envより取得
        const runtimeConfig = useRuntimeConfig()
        const adminEmail = runtimeConfig.public.VUE_APP_ADMIN_EMAIL
        if (user.email !== adminEmail) {
            console.log("user is not admin")
            return false
        }
        return true
    }
    //user情報をfirestoreのusersコレクションから取得する関数
    async function getUserInfo() {
        const auth = getAuth();
        //現在のuser情報を取得
        let user = auth.currentUser;
        if (user === null) {
            console.log("user is null")
            return
        }
        const db = getFirestore()
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            // ドキュメントが存在しない場合は、新しいドキュメントを追加
            console.log("user is not exist")
            return
        } else {
            // ドキュメントが存在する場合は、情報を取得して返す
            const doc = querySnapshot.docs[0]
            console.log(doc.data())
            return doc.data()
        }
    }
    //すべてのユーザー情報を取得する関数ユーザー
    async function getAllUserInfo() {
        const db = getFirestore()
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            // ドキュメントが存在しない場合は、新しいドキュメントを追加
            console.log("user is not exist")
            return
        } else {
            //すべてのユーザー情報を取得して返す
            const users: any[] = []
            querySnapshot.forEach((doc) => {
                users.push(doc.data())
            }
            )
            return users
        }
    }
    //ユーザーの情報をユーザーIDから取得する関数
    async function getUserInfoFromId(userId: string) {
        const db = getFirestore()
        const q = query(collection(db, "users"), where("uid", "==", userId));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("user is not exist")
            return
        } else {
            // ドキュメントが存在する場合は、情報を取得して返す
            const doc = querySnapshot.docs[0]
            console.log(doc.data())
            return doc.data()
        }
    }
    //uidのリストからユーザー情報を配列で取得する関数
    async function getUserInfoFromIdList(userIdList: string[]) {
        const db = getFirestore()
        const users: any[] = []
        for (const userId of userIdList) {
            const q = query(collection(db, "users"), where("uid", "==", userId));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.empty) {
                console.log("user is not exist")
                return
            } else {
                // ドキュメントが存在する場合は、情報を取得して返す
                const doc = querySnapshot.docs[0]
                console.log(doc.data())
                users.push(doc.data())
            }
        }
        return users
    }
    
    return {
        signInWithGooglePopup,
        logOut,
        errorMessage,
        checkAuthState,
        user,
        createDummyAccount,
        isAdmin,
        logInWithEmailAndPassword,
        getUserInfo,
        getAllUserInfo,
        getUserInfoFromId,
        getUserInfoFromIdList,
    }
}