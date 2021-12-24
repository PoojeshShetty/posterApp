import {useState,useEffect} from 'react'
import { useAuth } from '../../hooks/useAuth'
import {projectFirestore} from '../../config/firebase'
import { Link,useParams } from 'react-router-dom'
import Post from '../post/Post'
import './Profile.css'
import { useBookmark } from '../../hooks/useBookmark'
import { useLike } from '../../hooks/useLike'

function Profile({uid}) {

    const {user} = useAuth()
    const [profile,setProfile] = useState(null)
    const [posts, setPosts] = useState(null)
    const [pending, setPending] = useState(true)
    const {userid} = useParams()
    const profileId = userid ? userid : uid;
    const bookmarkHook = useBookmark()
    const likeHook = useLike()

    useEffect(()=>{
        const unsub = projectFirestore.collection('users').doc(profileId).onSnapshot(doc => {
            const obj = {id:doc.id, ...doc.data()}
            if(doc.data())
            setProfile(obj)
            setPending(false)
        })

        return ()=> unsub()

    },[profileId])

    useEffect(()=>{
        const unsub = projectFirestore.collection('followers').doc(profileId).collection('posts').onSnapshot(docs => {
            let result = []
            docs.forEach(doc => result.push({id:doc.id,...doc.data()}))
            result.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)
            setPosts(result)
        })

        return ()  => unsub()
    },[profileId])

    if(pending)
    return(
        <div className="loading__container">
            <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
        </div>
    )

    if(!profile)
    return(
        <div style={{'textAlign':'center','fontWeight':'700','margin':'10px', 'fontSize':'1.2rem'}}>
             No user of specific id
        </div>
    )
    return (
        <div className="profile">
            {profile && 
            <div className="profile__container">
                <div className="profile__cover">
                    {profile.coverURL && <img 
                        src={profile.coverURL} 
                        alt="coverimg" />}
                </div>
                <div className="profile__content">
                    <div className="profile__header">
                        <div className="profile__img">
                            {profile.photoURL ?
                                <img 
                                src={profile.photoURL}
                                alt="profileImg" /> :
                                <span className="profile--initial">{profile.initial}</span>
                            }
                        </div>
                        {user.uid === uid &&
                        <div className="btn--edit">
                            <Link to="/editprofile">
                                Edit Profile
                            </Link>
                        </div>
                        }
                    </div>
                    <div className="profile__info">
                        <span className="profile__displayname">{profile.displayName}</span>
                        <span className="profile__username">@{profile.username}</span>

                        <p className="profile__bio">
                            {profile.bio}
                        </p>

                        <div className="follow">
                            <span className="profile__follow">
                                <span className="follow__info">
                                    <span className="follow--number">
                                        {profile.followers.length}
                                    </span>
                                    <span className="type--followers">
                                        followers
                                    </span>
                                </span>
                                <span className="follow__info">
                                    <span className="follow--number">
                                        {profile.following.length}
                                    </span>
                                    <span className="type--following">
                                        following
                                    </span>
                                </span>
                                
                            </span>
                        </div>
                    </div>
                </div>
                
            </div>}


            {posts && profile &&
            <div className="posts cursor--pointer">
                { posts.map(post=> (
                    <Post post={post} key={post.id} bookmarkHook={bookmarkHook} likeHook={likeHook}/>
                ))}
            </div>}
            
        
        </div>

    )
}

export default Profile
