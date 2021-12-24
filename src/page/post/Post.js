import {useState,useEffect} from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useUser } from '../../hooks/useUser'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function Post({post,bookmarkHook, likeHook}) {

    const history = useHistory()
    const {user} = useAuth()
    const [like,setLike] = useState(false)
    const [bookmark, setBookmark] = useState(false)
    const {userInfo, pending:pendingUsr} = useUser(user.uid)
    const {userInfo:postUserImg, pending: pendingPostUsr} = useUser(post.uid)

    useEffect(()=>{  
        if(post.like && post.like.includes(user.uid))
           setLike(true)
        
    },[post,user])
    
    useEffect(()=>{
        if(userInfo && post)
            if(userInfo.bookmark.includes(post.id))
                setBookmark(true)
    },[post,userInfo])

    const handleLike = () => {
        likeHook.likePost(post.id, post.like, post.uid, user.uid)
        setLike(true)
    }

    const handleRemoveLike = () => {
        likeHook.removePost(post.id, post.like, post.uid, user.uid)
        setLike(false)
    }

    const handleBkMark = () => {
        const minPost = {
            id:post.id,
            displayName:post.displayName,
            username: post.username,
            photoURL: postUserImg.photoURL,
            initial: post.initial,
            createdAt: post.createdAt,
            like: post.like,
            post: post.post,
            uid:post.uid
        }
        bookmarkHook.addBookmark(user.uid,post.id,minPost,userInfo.bookmark)
        setBookmark(true)
    }

    const handleRemoveBkMark = () => {

        bookmarkHook.removeBookmark(user.uid,post.id, userInfo.bookmark)
        setBookmark(false)
    }

    if(pendingUsr || pendingPostUsr)
    return(
        <div className="loading__container">
                    <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
                </div>
    )

    return (
        <>
        <div className="post">
            <div className="user__img" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>
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
                    <span className="user__username" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>
                    @{post.username}
                    </span>
                    <span className="post__createdAt">
                        {formatDistanceToNow(post.createdAt.toDate())}
                    </span>
            </div>
            <p className="user__post" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>{post.post}</p>
            </div>
        </div>
            <div className="post__btn">

                {likeHook.pending ?  (<button><img src="/svg/loading_icon.svg" alt="LK" disabled/></button>)
                  : (like ? 
                <button className="btn--like"
                    onClick={handleRemoveLike}><img src="/svg/like.svg" alt="LK" 
                    />
                </button> :
                <button onClick={handleLike}>
                    <img src="/svg/like.svg" alt="LK" />
                </button> 
                )}

                <button onClick={()=> history.push(`/viewpost/${post.id}/${post.uid}`)}>
                    <img src="/svg/comment.svg" alt="CM" />
                </button>
                
                {bookmarkHook.pending ?  (<button><img src="/svg/loading_icon.svg" alt="LK" disabled/></button>)
                  : (bookmark ? 
                <button
                    onClick={handleRemoveBkMark}><img src="/svg/addedBookmark.svg" alt="LK" 
                    />
                </button> :
                <button onClick={handleBkMark}>
                    <img src="/svg/bookmark.svg" alt="LK" />
                </button> 
                )}

            </div>
        </>
    )
}

export default Post
