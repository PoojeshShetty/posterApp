import {useState,useEffect} from 'react'
import {projectAuth, projectFirestore} from '../config/firebase'
import { useAuth} from './useAuth'

function useLogin() {

    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)
    const { dispatch} = useAuth()

    useEffect(()=>{

        return () => setCancelled(true)
    },[])

    const login = async (email,password) => {

        try{
            setError(null)
            setPending(true)

            const res = await projectAuth.signInWithEmailAndPassword(email,password)
            const userInfo = await projectFirestore.collection('users').doc(res.user.uid).get()
            const userObj = {...userInfo.data()}
            res.user.username = userObj.username
            dispatch({type:'LOGIN',payload:res.user})

        }catch(err)
        {
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>setError(null),7000)
            }
        }finally{
            if(!cancelled)
                setPending(false)
        }
    }
    return {
        login,
        error,
        pending
    }
}

export{
 useLogin
}
