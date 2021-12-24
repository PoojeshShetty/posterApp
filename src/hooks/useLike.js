import {useState,useEffect} from 'react'
import {projectFirestore} from '../config/firebase'

function useLike() {

    
    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)
    const [success, setSuccess] = useState(null)

    useEffect(()=>{

        return () => setCancelled(true)
    },[])

    const likePost = async (postId,likeList,postuid,uid) => {

        setPending(true)
        setError(false)

        try{

            const newLikeList = likeList.concat(uid)
            await projectFirestore.collection('followers').doc(postuid).collection('posts').doc(postId).update({like:newLikeList})

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

    const removePost = async (postId,likeList,postuid,uid) => {

        setPending(true)
        setError(false)

        try{

            const newLikeList = likeList.filter(id => id!== uid)
            await projectFirestore.collection('followers').doc(postuid).collection('posts').doc(postId).update({like:newLikeList})

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

    return {
        likePost,
        removePost,
        success,
        error,
        pending
    }

}

export {
    useLike
} 
