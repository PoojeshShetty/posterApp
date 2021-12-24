import {useState,useEffect} from 'react'
import {projectFirestore} from '../config/firebase'

function useBookmark() {

    const [pending, setPending] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const [error, setError] = useState(null)

    useEffect(()=>{
        return () => setCancelled(true)
    },[])

    const addBookmark = async (uid,pid,post,bkList) => {

        setPending(true)
        setError(null)

        const newBkList = bkList.concat(pid)
        try{

            await projectFirestore.collection('bookmarks').doc(uid).collection('posts').doc(pid).set({...post})

            await projectFirestore.collection('users').doc(uid).update({bookmark:newBkList})

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

    
    const removeBookmark = async (uid,pid,bkList) => {

        setPending(true)
        setError(null)

        const newBkList = bkList.filter(bk => bk!==pid)
        try{

            await projectFirestore.collection('bookmarks').doc(uid).collection('posts').doc(pid).delete()

            await projectFirestore.collection('users').doc(uid).update({bookmark:newBkList})
            
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
        pending, 
        cancelled,
        error,
        addBookmark,
        removeBookmark
    }
}

export {
    useBookmark
}
