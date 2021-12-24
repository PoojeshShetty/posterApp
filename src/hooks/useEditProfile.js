import {useState,useEffect} from 'react'
import {projectFirestore, projectStorage } from '../config/firebase'
import { useAuth } from './useAuth'

function useEditProfile() {

    const [pending, setPending] = useState(false)
    const [error, setError] = useState(null)
    const [cancelled, setCancelled] = useState(false)
    const [success, setSuccess] = useState(null)
    const {user} = useAuth()

    useEffect(()=>{
        return () => setCancelled(true)
    },[])

    const saveprofile = async (uid, displayName, bio, userprofile, coverprofile) => {

        setPending(true)
        setError(null)

        try{

            const photoupload = await checkNUploadPhoto(`/thumbnail/${uid}/photourl.jpeg`, userprofile)
            
            var photoURL = null
            var coverURL = null

            if(photoupload)
            {
                photoURL = await photoupload.ref.getDownloadURL()
                await user.updateProfile({photoURL})
            }
           
            const coverupload = await checkNUploadPhoto(`/thumbnail/${uid}/coverurl.jpeg`, coverprofile)
            
            if(coverupload)
            {
                coverURL = await coverupload.ref.getDownloadURL()
            }

            const updateProfile = {}

            if(displayName)
                updateProfile.displayName = displayName
            if(bio)
                updateProfile.bio = bio
            if(photoURL)
                updateProfile.photoURL = photoURL
            if(coverURL)
                updateProfile.coverURL = coverURL


            await projectFirestore.collection('users').doc(uid).update({...updateProfile})

            if(!cancelled)
            setSuccess(true)
            
        }catch(err)
        {
            if(!cancelled)
            {
                setError(err.message)
                setTimeout(()=>{
                    setError(null)
                },600)
            }
        }finally{
            if(!cancelled)
                setPending(false)
        }
    }

    const checkNUploadPhoto = async (url, uploadPhoto) => {
        if(!uploadPhoto)
           return null;
        
        const imgurl = await projectStorage.ref(url).put(uploadPhoto)
        return imgurl
    }

    return {
        saveprofile,
        pending,
        error,
        success
    }
}

export {
    useEditProfile
} 
