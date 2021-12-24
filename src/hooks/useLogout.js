import { projectAuth } from '../config/firebase'
import { useAuth } from './useAuth'
import { useState,useEffect } from 'react'

function useLogout() {

    const [pending ,setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)

    const { dispatch } = useAuth()

    useEffect(()=>{
        return ()=> setCancelled(true)
    })

    const logout = async () => {

        setError(null)
        setPending(true)

        try{
            
            await projectAuth.signOut()

            dispatch({type:'LOGOUT'})

        }catch(err)
        {
            if(!cancelled)
                setError(err.message)
        }finally{
            if(!cancelled)
                setPending(false)
        }

    }

    return {
        logout,
        error,
        pending
    }
}

export {
    useLogout
} 
