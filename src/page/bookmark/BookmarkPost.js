import { Link,useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

function BookMarkPost({post, bookmarkHook,userInfo}) {

    const history = useHistory()
    const {user} = useAuth()

    const handleRemoveBkMark = (postId) => {
        bookmarkHook.removeBookmark(user.uid,postId, userInfo.bookmark)
    }

    return (
        <>
                 <div className="post">
                     <div className="user__img cursor--pointer" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>
                     {(post.photoURL)?
                         <img src={post.photoURL} alt={post.initial} 
                             onError = {({target}) => {
                                target.src = '/img/default_profile.png'
                             }}
                        />
                     :
                         <div className="user__initial">{post.initial}</div>
                     }
                     </div>
                     <div className="post__content cursor--pointer">
                     <div className="post__user">
                         <Link to={`/${post.uid}`}>
                             <span className="user__displayName">
                             {post.displayName}</span>
                             </Link>
                             <span className="user__username" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>
                             @{post.username}
                             </span>
                     </div>
                     <p className="user__post" onClick={() => history.push(`/viewpost/${post.id}/${post.uid}`)}>{post.post}</p>
                     </div>
                 </div>
                     <div className="post__btn">
                         <button onClick={()=> history.push(`/viewpost/${post.id}/${post.uid}`)}>
                             <img src="/svg/comment.svg" alt="CM" />
                         </button>
                         
                         {bookmarkHook.pending ?  (<button><img src="/svg/loading_icon.svg" alt="LK" disabled/></button>)
                           : 
                         <button
                             onClick={() => handleRemoveBkMark(post.id)}><img src="/svg/addedBookmark.svg" alt="LK" 
                             />
                         </button>
                         }
         
                     </div>
                 </>
    )
}

export default BookMarkPost
