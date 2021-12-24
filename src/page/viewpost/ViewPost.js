import {useState, useEffect} from 'react'
import {Link, useParams, useHistory} from 'react-router-dom'
import { projectFirestore } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useLike } from '../../hooks/useLike'
import { useUser } from '../../hooks/useUser'
import { useBookmark } from '../../hooks/useBookmark'
import { usePost } from '../../hooks/usePost'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import EditPost from './EditPost'
import Comment from './Comment'
import '../post/Posts.css'
import './ViewPost.css'

function ViewPost() {

    const {id,uid} = useParams()
    const [post, setPost] = useState(null)
    const [pending, setPending] = useState(true)
    const [error, setError] = useState(null)
    const [like,setLike] = useState(false)
    const [bookmark, setBookmark] = useState(false)
    const [edit,setEdit] = useState(false)
    const [postExists, setPostExists] = useState(false)

    const {user} = useAuth()
    const {likePost,removePost,pending:likePending} = useLike()
    const {userInfo:postUserImg, pending: pendingPostUsr} = useUser(uid)
    const {userInfo, pending: pendingUserBK} = useUser(user.uid)
    const {deletePost, pendingDelete,successDelete} = usePost()

    const {addBookmark, removeBookmark, pending:pendingBK} = useBookmark()
    const history = useHistory()

    useEffect(()=>{
        if(successDelete===true)
           history.push('/')
    },[successDelete,history])

    useEffect(()=> {
        
        const unsub = projectFirestore.collection('followers').doc(uid).collection('posts').doc(id).onSnapshot(doc => {
            if(doc.data())
            {
                setPost({id:doc.id, ...doc.data()})
                setPostExists(true)
            }
            else
                setPostExists(false)
            setPending(false)
        })

        return () => unsub()
    },[uid,id])

    useEffect(()=>{
        if(post && post.like.includes(user.uid))
           setLike(true)
    },[post,user])
    
    
    useEffect(()=>{
        if(post && userInfo && userInfo.bookmark.includes(post.id))
            setBookmark(true)
        
    },[post,user,userInfo])
    
    const handleLike = () => {
        likePost(post.id, post.like,post.uid, user.uid)
        setLike(true)
    }

    const handleRemoveLike = () => {
        removePost(post.id, post.like,post.uid, user.uid)
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
        addBookmark(user.uid,post.id,minPost,userInfo.bookmark)
        setBookmark(true)
    }

    const handleRemoveBkMark = () => {

        removeBookmark(user.uid,post.id, userInfo.bookmark)
        setBookmark(false)
    }

    if(pending || pendingPostUsr ||pendingUserBK || pendingDelete)
      return(
        <div className="loading__container">
            <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
        </div>
      )
    
    if(!postExists)
    return(

        <div style={{'textAlign':'center','fontWeight':'700','margin':'10px', 'fontSize':'1.2rem'}}>
             Either the post is deleted or it does not exist
        </div>

    )

    if(!edit)
    return (
        <div className="posts">
            {post &&
                <div className="post__edit">
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
                            <span className="post__createdAt">
                                {formatDistanceToNow(post.createdAt.toDate())}
                            </span>
                    </div>
                    <p className="user__post">{post.post}</p>
                    </div>
                </div>
                <div className="post__btn">

                    {likePending ?  (<button onClick={handleLike}><img src="/svg/loading_icon.svg" alt="LK" disabled/></button>)
                    : (like ? 
                        <button 
                            className="btn--like"
                            onClick={handleRemoveLike}
                        >
                                <img src="/svg/like.svg" alt="LK" />
                        </button> :
                        <button onClick={handleLike}><img src="/svg/like.svg" alt="LK" /></button> )}

                        <button>
                            <img src="/svg/comment.svg" alt="CM" />
                        </button>

                        {pendingBK ?  (<button><img src="/svg/loading_icon.svg" alt="LK" disabled/></button>)
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

                {user.uid === post.uid && (
                    <div className="btn__collection">
                        <button className="btn btn--save" onClick={() => {
                            setEdit(true)
                        }}>Edit</button>
                    </div>
                )}

            </div>
            }
            <Comment post={post} userInfo={userInfo}/>
        </div>
    )

    if(edit)
    {
    return(
        <div className="posts">
            <EditPost 
                post={post} 
                setEdit={setEdit} 
                error={error} 
                setError={setError} 
                postUserImg={postUserImg} 
                initialPost={post.post} 
                user={user}
                useHistory={useHistory}
                deletePost={deletePost}
                pendingDelete={pendingDelete}
                />
        </div>

    )

    }
}

export default ViewPost
