import {useEffect,useState} from 'react'
import { projectFirestore } from '../../config/firebase'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

function ViewComment({post}) {

    const [comments, setComments] = useState(null)

    useEffect(()=>{
        const unsub = projectFirestore.collection('followers').doc(post.uid).collection('posts').doc(post.id)
                        .collection('comments').onSnapshot(docs => {

                            let result = []

                            docs.forEach(doc => result.push({id:doc.id,...doc.data()}))
                            result.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)

                            setComments(result)
                     })
        return () => unsub()
    },[post])

    if(!comments)
    return(
        <div className="loading__container">
            <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
        </div>
    )

    if(comments.length===0)
    return (
        <div></div>
    )
    if(comments.length > 0)
    return (
        <div className="viewcomments__container">
            {comments.map(comment => 
            <div className="viewcomment" key={comment.id}>
                <div className="viewcomment__comment">
                    {comment.comment}
                </div>
                <div className="viewcomment__info">
                    <div className="viewcomment__user">
                        <span className="user__displayName"> - {comment.displayName}</span>
                        <span className="user__username">@{comment.username}</span>
                    </div>
                    <div className="viewcomment__time">
                        {formatDistanceToNow(comment.createdAt.toDate())}
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}

export default ViewComment
