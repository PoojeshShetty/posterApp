import {useEffect} from 'react'

import Sidebar from '../../components/Sidebar'
import Bookmark from '../bookmark/Bookmark'
import {Route,Switch} from 'react-router-dom'
import ViewPosts from '../post/ViewPosts'
import Profile from '../profile/Profile'
import AddPost from '../post/AddPost'
import EditProfile from '../editprofile/EditProfile'
import SearchLayout from '../../components/searchLayout/SearchLayout'
import ViewPost from '../viewpost/ViewPost'
import { useAuth } from '../../hooks/useAuth'
import SearchPage from '../search/SearchPage'

function Home() {

  const {user} = useAuth()

  useEffect(()=> {
    var toggle = document.getElementById('toggle')
    var sidebar = document.getElementById('sidebar')
    var sidebar__options = document.getElementById('sidebar__options')

    const showSidebar = () => {
      sidebar.classList.toggle('show__sidebar')
    }

    const removeSidebar = () => {
      sidebar.classList.remove('show__sidebar')
    }

    toggle.addEventListener('click', showSidebar )
    sidebar__options.addEventListener('click', removeSidebar )

    return ()=> 
      toggle.removeEventListener('click',showSidebar)
    
  },[])

    return (
        <div className="container">
          
        <Sidebar />
        
        <Switch>
        <Route path="/" exact>
            <ViewPosts />
        </Route>

        <Route path="/bookmark">
            <Bookmark />
        </Route>
        
        <Route path="/profile">
            <Profile uid={user.uid}/>
        </Route>
        
        <Route path="/addpost">
            <AddPost />
        </Route>

        <Route path="/editprofile">
            <EditProfile />
        </Route>

        <Route path="/search">
            <SearchPage />
        </Route>

        <Route path="/:userid" exact>
             <Profile />
        </Route>

        <Route path="/viewpost/:id/:uid" exact>
            <ViewPost />
        </Route>

        
        <Route path="/:userid/*" exact>
          <div style={{'textAlign':'center','fontWeight':'700','margin':'10px', 'fontSize':'1.2rem'}}>
              Either the post is deleted or it does not exist
          </div>
        </Route>

        </Switch> 
        <SearchLayout />

      </div>
    )
}

export default Home
