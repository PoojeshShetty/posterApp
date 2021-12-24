import {useState,useEffect} from 'react'
import { useAuth } from '../../hooks/useAuth'
import { projectFirestore } from '../../config/firebase'
import { useBookmark } from '../../hooks/useBookmark'
import './Bookmark.css'
import { useUser } from '../../hooks/useUser'
import BookMarkPost from './BookmarkPost'

function Bookmark() {

    const {user} = useAuth()
    const [posts,setPosts] = useState(null)
    const {userInfo, pending} = useUser(user.uid)
    
    const bookmarkHook = useBookmark()

    useEffect(()=>{
        const unsub = projectFirestore.collection('bookmarks').doc(user.uid).collection('posts').onSnapshot(docs =>{
            let result = []
            docs.forEach(doc => result.push({id:doc.id, ...doc.data()}))
            result.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds)
            setPosts(result)
        })

        return ()=> unsub()
    },[user])

    if(!posts || pending )
    return(
        <div className="loading__container">
            <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
        </div>
    )

    if(posts.length === 0)
    return(
        <div style={{'textAlign':'center','fontWeight':'700','margin':'10px', 'fontSize':'1.2rem'}}>
            NO bookmarks to view
        </div>
    )
    return (
        <div>
            <div className="posts ">
                {posts.map(post => 
                  <BookMarkPost post={post} bookmarkHook={bookmarkHook} userInfo={userInfo} key={post.id}/>
                )}
            </div>
        </div>
    )
}

export default Bookmark
