import { useEffect,useState } from 'react'
import { projectFirestore } from '../../config/firebase'
import { useAuth } from '../../hooks/useAuth'
import { useBookmark } from '../../hooks/useBookmark'
import { useLike } from '../../hooks/useLike'
import Post from './Post'
import './Posts.css'

function ViewPosts() {

  const [viewPosts, setViewPosts] = useState([]) 
  const [cancelled, setCancelled] = useState(false)
  const [pending, setPending] = useState(true)
  const {user} = useAuth()

  const bookmarkHook = useBookmark()
  const likeHook = useLike()

  useEffect(() => {
    const readPosts = async (ids) => {
      const reads = await ids.map(id =>projectFirestore.collection(`followers/${id}/posts`)
                          .get())
      const results = await Promise.all(reads)

      const data = await results.reduce((init,posts)=> {
          return init.concat(posts.docs.reduce((initial,post)=>{
                return initial.concat([{id:post.id,...post.data()}])
          },[]))
      },[])

      if(!cancelled){
        setViewPosts(data.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds ))
        setPending(false)
      }
    }

    const getPosts = async (user) => {
      
      const ids = await projectFirestore.collection('followers').where('followers','array-contains',user)
                  .get()
      
      const result = await ids.docs.map(id => id.id)
      readPosts(result)

    }

    if(user)
    getPosts(user.uid)

    return () => setCancelled(true)
  },[user,cancelled])

  return (
      <div className="posts cursor--pointer">
       
       {viewPosts.length > 0 && 
        viewPosts.map(post => 
            <Post post={post} key={post.id} bookmarkHook={bookmarkHook} likeHook={likeHook} />
          )
        }

        {!pending && viewPosts.length === 0 &&
          <div className="post" style={{'textAlign':'center','fontWeight':'700', 'fontSize':'1.2rem'}}>
              No post to see. Follow users to see post.
        </div>
          }

        {pending && 
                <div className="loading__container">
                    <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
                </div>
            }
      </div>

    )
}

export default ViewPosts
