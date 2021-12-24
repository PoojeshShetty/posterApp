import {useState} from 'react'
import { useComment } from '../../hooks/useComment'
import ViewComment from './ViewComment'

function Comment({post, userInfo}) {

    const [comment, setComment] = useState('')
    const {addComment, pending} = useComment()

    const handleAddComment = (e) => {
        e.preventDefault()
        
        const commentObj ={
            displayName : userInfo.displayName,
            username : userInfo.username,
            uid : userInfo.uid,
            comment
        }

        addComment(post.uid,post.id,commentObj)
        setComment('')
    }

    return (
        <div className="comment__container">
            <form className="comment__form" onSubmit={(e) => handleAddComment(e)}>
                <textarea 
                    type="text"
                    placeholder="comment"
                    value={comment}
                    onChange={({target}) => setComment(target.value)}
                    required 
                />
                {pending ?
                    <button className="btn btn--comment" disabled>Comment</button>
                    :
                    <button className="btn btn--comment">Comment</button>
                }
            </form>

            <ViewComment post={post} userInfo={userInfo} />
        </div>
    )
}

export default Comment
