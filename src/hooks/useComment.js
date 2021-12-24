import {useState,useEffect} from 'react'
import {projectFirestore,timeStamp} from '../config/firebase'

function useComment() {
    
    const [pending, setPending] = useState(false)
    const [cancelled, setCancelled] = useState(false)
    const [error, setError] = useState(null)

    
    useEffect(()=>{
        return () => setCancelled(true)
    },[])

    const addComment = async (puid,pid,comment) => {

        setPending(true)
        setError(null)

        try{

            const createdAt = await timeStamp.fromDate(new Date())
            
            await projectFirestore.collection('followers').doc(puid).collection('posts').doc(pid).collection('comments').add({
                ...comment, createdAt
            })

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
        addComment,
        error
    }
}

export{
     useComment
}
