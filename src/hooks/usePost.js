import {useState, useEffect} from 'react'
import {projectFirestore,timeStamp} from '../config/firebase'

function usePost() {

    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)
    const [success, setSuccess] = useState(null)
    const [pendingDelete, setPendingDelete] = useState(false)
    const [successDelete, setSuccessDelete] = useState(null)

    useEffect(()=>{

        return () => {
            setCancelled(true)
        }
    },[])

    const addPost = async (post, uid) => {

        setPending(true)
        setError(false)

        try{
            const createdAt = await timeStamp.fromDate(new Date())

            await projectFirestore.collection('followers').doc(uid).collection('posts').add({
                ...post,
                createdAt
            })

            if(!cancelled)
            setSuccess(true)

        }catch(err){
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>setError(null), 7000)
            }
        }finally{
            if(!cancelled)
                setPending(false)
        }
    }
    
    const editPost = async (post, postId, uid) => {

        setPending(true)
        setError(false)

        try{
            
            await projectFirestore.collection('followers').doc(uid).collection('posts').doc(postId).update({
                post
            })

            if(!cancelled)
            setSuccess(true)

        }catch(err){
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>setError(null), 7000)
            }
        }finally{
            if(!cancelled)
                setPending(false)
        }
    }

        
    const deletePost = async ( postId, uid) => {

        setPendingDelete(true)
        setError(false)

        try{
            
            await projectFirestore.collection('followers').doc(uid).collection('posts').doc(postId).delete()

            if(!cancelled)
            setSuccessDelete(true)

        }catch(err){
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>setError(null), 7000)
            }
        }finally{
            if(!cancelled)
                setPendingDelete(false)
        }
    }

    return {
        addPost,
        editPost,
        deletePost,
        success,
        error,
        pending,
        pendingDelete,
        successDelete
    }

}

export {
    usePost
} 
