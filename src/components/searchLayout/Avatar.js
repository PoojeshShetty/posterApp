import React from 'react'
import {Link} from 'react-router-dom'
import {useFollow} from '../../hooks/useFollow'

function Avatar({user, authUser}) {

    const {pending, followUser, unFollowUser} = useFollow()

    const handleFollow = (e) => {
        e.preventDefault()

        followUser(authUser, user)
    }

    const handleUnFollow = (e) => {
        e.preventDefault()

        unFollowUser(authUser, user)
    }   

    return (
        <div className="user__avatar">

            <div className="user__img">
                {user.photoURL && 
                    <img src={user.photoURL} alt="userImg" />
                }
                {!user.photoURL &&
                    <div>{user.initial}</div>
                }
            </div>

            <div className="user__info">
                <Link to={`/${user.id}`} className="user__displayname">
                    {user.displayName}
                </Link>
                <span className="user__username">@{user.username}</span>
            </div>

            <div className="user__follow">
                {!pending && (user.followers.map(user => user.uid).includes(authUser.uid) ?
                    <button className="btn" onClick={(e)=> handleUnFollow(e)}>Unfollow</button>
                 :
                    <button className="btn" onClick={(e) => handleFollow(e)}>Follow</button>)
                }

                {pending &&
                    <button className="btn btn__loading" disabled>
                            <img src="/svg/loading_icon.svg" alt="Loading" />
                        </button>}
            </div>
            
        </div>
    )
}

export default Avatar
