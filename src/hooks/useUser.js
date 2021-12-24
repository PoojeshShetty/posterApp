import {useState,useEffect} from 'react'
import {projectFirestore} from '../config/firebase'

function useUser(userID) {

    const [error, setError] = useState(null)
    const [pending, setPending] = useState(true)
    const [userInfo, setUserInfo] = useState(null)
    
    useEffect(()=>{
        const unsub = userID && projectFirestore.collection('users').doc(userID).onSnapshot(doc =>{
            setUserInfo({uid:doc.id, ...doc.data()})
            setPending(false)
        },(err) => setError(err.message))

        return () => unsub()
    },[userID])

    return {
        userInfo,error , pending
    }
}

export {
    useUser
}
