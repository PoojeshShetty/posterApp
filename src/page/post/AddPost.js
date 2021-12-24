import { useState,useEffect } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { usePost } from '../../hooks/usePost'
import { useUser } from '../../hooks/useUser'
import { useHistory } from 'react-router-dom'

function AddPost() {

    const [post, setPost] = useState('')
    const {user} =useAuth()
    const {userInfo, pending:userInfoPending} = useUser(user.uid)
    const { addPost,pending:addPostPending,success } = usePost()
    const history = useHistory()

    useEffect(()=>{
        
        if(success === true)
            history.push('/')

    },[success,history])

    const postSubmit = (e) => {
        e.preventDefault()

        const postObj = {
            displayName:userInfo.displayName,
            initial:userInfo.initial,
            photoURL:userInfo.photoURL,
            coverURL: userInfo.coverURL,
            username: userInfo.username,
            uid:userInfo.uid,
            like:[],
            post
        }

        addPost(postObj, userInfo.uid)
    }

    return (
        <div className="posts">
          {!userInfoPending && <div className="post__form">
              <h2>Add Post</h2>
              <div className="post__content">
                <div className="user__img">
                    {user.photoURL && 
                        <img src={userInfo.photoURL} alt="userImg" />
                    }
                    {!user.photoURL &&
                        <div className="user__initial">{userInfo.initial}</div>
                    }
                </div>
                <form className="addpost__form" onSubmit={(e) => postSubmit(e)}>
                    <textarea 
                        placeholder="Post your thought"
                        value={post} 
                        onChange={({target}) => setPost(target.value)}
                        cols="30" rows="10"
                        required
                        />

                    {!addPostPending && <button className="btn">Post</button>}

                    {addPostPending && <button className="btn btn__loading" disabled>
                        <img src="/svg/loading_icon.svg" alt="Loading" />
                    </button>}

                </form>
            </div>
          </div>}

          {userInfoPending && 
                <div className="loading__container">
                    <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
                </div>
            }
        </div>
    )
}

export default AddPost
