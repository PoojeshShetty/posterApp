import {useState, useEffect}  from 'react'
import {projectFirestore} from '../config/firebase'

function useFollow() {
    
    const [pending,setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)

    useEffect(()=>{

        return () => setCancelled(true)
    },[])

    const followUser = async (authUser, userToFollow) => {
        
        setPending(true)
        setError(null)

        const minAuthUser = {
            uid:authUser.uid,
            displayName : authUser.displayName,
            username : authUser.username,
            photoURL : authUser.photoURL,
        }

        const minUserToFollow = {
            uid:userToFollow.id,
            displayName : userToFollow.displayName,
            username : userToFollow.username,
            photoURL : userToFollow.photoURL,
        }

        const authUserFollowing = authUser.following.concat({...minUserToFollow})

        const userToFollowFollowers = userToFollow.followers.concat({...minAuthUser})

        const userToFollowFollowersMap = userToFollowFollowers.map(user => user.uid).concat(userToFollow.id)
        try{

            await projectFirestore.collection('users').doc(authUser.uid).update({following:authUserFollowing})

            await projectFirestore.collection('users').doc(userToFollow.id).update({followers:userToFollowFollowers})

            await projectFirestore.collection('followers').doc(userToFollow.id).update({followers:userToFollowFollowersMap})

        }catch(err)
        {
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>{
                    setError(null)
                },7000)
            }
        }finally{
           setPending(false)
        }
        
    }  

    const unFollowUser = async (authUser, userToUnFollow) => {
        
        setPending(true)
        setError(null)

        const authUserID = authUser.uid
        const userToUnFollowID = userToUnFollow.id
        
        const authUserFollowing = authUser.following.filter(user => user.uid!==userToUnFollowID)

        const userToFollowFollowers = userToUnFollow.followers.filter(user => user.uid!==authUserID)

        const userToFollowFollowersMap = userToFollowFollowers.map(user => user.uid).concat(userToUnFollow.id)

        try{

            await projectFirestore.collection('users').doc(authUser.uid).update({following:authUserFollowing})

            await projectFirestore.collection('users').doc(userToUnFollow.id).update({followers:userToFollowFollowers})

            await projectFirestore.collection('followers').doc(userToUnFollow.id).update({followers:userToFollowFollowersMap})

        }catch(err)
        {
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>{
                    setError(null)
                },7000)
            }
        }finally{
           setPending(false)
        }
    }

    return {
        followUser,
        unFollowUser,
        pending,
        error
    }
}

export{
    useFollow
} 
