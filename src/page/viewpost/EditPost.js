import {useState} from 'react'
import {Link} from 'react-router-dom'
import { useEffect } from 'react/cjs/react.development'
import { usePost } from '../../hooks/usePost'

function EditPost({post, setEdit, error,postUserImg, initialPost, user, deletePost, pendingDelete}) {

    const [inputPost, setInputPost] = useState(initialPost)
    const {editPost,pending,success} = usePost()

    useEffect(()=>{
        if(success === true)
          setEdit(false)
    },[success,setEdit])

    const handleEdit = () => {
        editPost(inputPost,post.id,post.uid)
    }

    const handleDelete = () => {
        deletePost(post.id,post.uid)
    }

    if(post)
    return(
        <div className="post__edit">
        {error && <div className="error__msg">{error}</div>}
        <div className="post">
            <div className="user__img" >
            {postUserImg.photoURL && 
                <img src={postUserImg.photoURL} alt="userImg" />
            }
            {!postUserImg.photoURL &&
                <div className="user__initial">{post.initial}</div>
            }
            </div>
            <div className="post__content">
                <div className="post__user">
                    <Link to={`/${post.uid}`}>
                        <span className="user__displayName">
                        {post.displayName}</span>
                        </Link>
                        <span className="user__username">
                        @{post.username}
                        </span>
                </div>
                <textarea
                placeholder="Enter your post here"
                className="user__post"
                value={inputPost}
                onChange={({target}) => setInputPost(target.value)}
                required
                />

            </div>
        </div>
        
        {user.uid === post.uid && (
            <div className="btn__collection">

                {pending ? 
                <button className="btn btn--save" 
                disabled>
                    <img className="btn--save--loading" src="/svg/loading_icon.svg" alt="Loading" />
                </button>
                :
                <button className="btn btn--save" 
                    onClick={handleEdit}>Save</button>
                }

                <button className="btn btn--cancel" 
                    onClick={() => setEdit(false)}>Cancel</button>

                {pendingDelete ? 
                <button className="btn btn--delete" 
                disabled>
                    <img className="btn--delete--loading" src="/svg/loading_icon.svg" alt="Loading" />
                </button>
                :
                <button className="btn btn--delete" 
                onClick={handleDelete}>Delete</button>
                }
            </div>
            
        )}

    </div>
    
    )

    return(
        <div></div>
    )
}

export default EditPost
