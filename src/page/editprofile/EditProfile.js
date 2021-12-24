import {useState} from 'react'
import './EditProfile.css'
import {projectFirestore} from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useEffect } from 'react/cjs/react.development'
import { useEditProfile } from '../../hooks/useEditProfile'
import {useHistory} from 'react-router-dom'

function EditProfile() {

    const {user} = useAuth()
    const [displayName, setDisplayName] = useState(null)
    const [inputDisplayName, setInputDisplayName] = useState('')
    const [bio,setBio] = useState('')
    const [userprofile, setUserProfile] = useState(null)
    const [coverprofile, setCoverProfile] = useState(null)
    const [formError, setFormError] = useState(null)
    const {saveprofile, pending, error, success} = useEditProfile()
    const history = useHistory()

    useEffect(()=>{
        const unsub = projectFirestore.collection('users').doc(user.uid).onSnapshot(doc=>{
            const obj = {id:doc.id, ...doc.data()}
            setDisplayName(obj.displayName)
            setInputDisplayName(obj.displayName)
            if(obj.bio)
                setBio(obj.bio)
        })

        return ()=> unsub()
    },[user])

    useEffect(()=>{
        const pushHistory = () => {
            if(success === true)
                history.push('/profile')
        }

        pushHistory()
    },[success, history])

    const formSubmit = async (e) => {
        e.preventDefault()

        if(checkFormError())
        {
            setTimeout(()=>{
                setFormError(null)
            },6000)
            return
        }
       
        saveprofile(
            user.uid,
            inputDisplayName,
            bio,
            userprofile,
            coverprofile
        )
        
    }

    const checkFormError = () => {
        setFormError(null)

        const displayArr = inputDisplayName.split(" ").filter(val => val!== "")

        if(displayArr.length !== 2)
        {
            setFormError("displayName should only have first name and last name")
            return true
        }

        if(displayArr[0]===" " || displayArr[1]===" " || displayArr[0].length>10 || displayArr[1].length>10 )
        {
            setFormError("displayName character length should be less than or equal to 10")
            return true
        }
        if(userprofile && !userprofile.type.includes('image') && !userprofile.type.includes('svg'))
        {
            setFormError("The type of file should be an image")
            return true
        }

        if(userprofile && userprofile.size>2000000)
        {
            setFormError("The size of file should be less than 2 mb")
            return true
        }

        if(coverprofile && !coverprofile.type.includes('image') &&  !coverprofile.type.includes('svg'))
        {
            setFormError("The type of file should be an image")
            return true
        }
        
        if(coverprofile && coverprofile.size>2000000)
        {
            setFormError("The size of file should be less than 2 mb")
            return true
        }

        return false
    }

    return (
        <div className="editprofile">
            {displayName && 
            <div className="editprofile__form">
                <form onSubmit={(e)=>formSubmit(e)}>
                    <span className="form__title">Edit Profile</span>
                    <div className="form__control">
                    {formError && 
                        <div className="error__msg">
                            {formError}
                        </div>}
                    
                    {error && 
                     <div className="error__msg">
                        {error}
                    </div>}

                        <label>Display Name</label>
                        <input 
                            type="text" 
                            placeholder="Display Name"
                            value={inputDisplayName}
                            onChange={({target})=>setInputDisplayName(target.value)}
                            required
                        />

                    </div>

                    <div className="form__control">
                        <label>Bio</label>
                        <textarea 
                            placeholder="Bio"
                            value={bio}
                            onChange={({target})=>setBio(target.value)}
                        />
                    </div>

                    <div className="form__control">
                        <label>User photo</label>
                        <input 
                            type="file" 
                            onChange={({target}) => setUserProfile(target.files[0])}
                        />
                    </div>

                    <div className="form__control">
                        <label>Background photo</label>
                        <input 
                            type="file" 
                            onChange={({target}) => setCoverProfile(target.files[0])}
                        />
                    </div>
                    
                    {!pending && <button className="btn">Save</button>}

                    {pending && <button className="btn btn__loading" disabled>
                        <img src="/svg/loading_icon.svg" alt="Loading" />
                    </button>}

                </form>
            </div>
            }

            {!displayName && 
                <div className="loading__container">
                    <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
                </div>
            }
        </div>
    )
}

export default EditProfile
