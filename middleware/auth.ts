
export default defineNuxtRouteMiddleware(async()=>{
    if(!process.server){
        const {checkAuthState,user} = useAuth()
        await checkAuthState()
        if(!user.value){
            return navigateTo('/',{replace: true})
        }
    }
}

)