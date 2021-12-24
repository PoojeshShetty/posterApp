import {useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import {projectAuth,projectFirestore} from '../config/firebase'

function useSignup() {

    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)
    const {dispatch} = useAuth()

    useEffect(()=>{
        return ()=> setCancelled(true)
    },[])

    const signup = async (displayName,email, password,username,initial) => {
        try{

            setError(null)
            setPending(true)
            
            const res = await projectAuth.createUserWithEmailAndPassword(email, password)

            const user = res.user

            await res.user.updateProfile({displayName})

            res.user.username = username
            
            await projectFirestore.collection('users').doc(user.uid).set({
                displayName:user.displayName,
                photoURL:null,
                username,
                initial,
                bio:null,
                coverURL:null,
                following:[],
                followers:[],
                bookmark:[]
            })

            await projectFirestore.collection('followers').doc(user.uid).set({followers:[user.uid]})

            dispatch({type:'LOGIN',payload:res.user})
        }catch(err)
        {
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>setError(null),6000)
            }
        }finally{
            if(!cancelled)
            setPending(false)
        }
    }

    return {
        signup,
        error,
        pending
    }
}

export{
    useSignup
}
