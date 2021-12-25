import './Sidebar.css'
import { useLogout } from '../hooks/useLogout'
import {Link } from 'react-router-dom'

function Sidebar() {

    const {logout, pending} = useLogout()

    return (
        <div className= "sidebar" id="sidebar">
          <div className="sidebar__content" >
            <div className="sidebar__options" id="sidebar__options">
              
              <Link to="/">
                <div className="sidebar__item">
                  <img src="/svg/home_icon.svg" alt="homesvg" className="item__icon" />
                  <div className="icon__text">Home</div>
                </div>
              </Link>
              
              <Link to="/profile">
                <div className="sidebar__item">
                  <img src="/svg/profile.svg" alt="profilesvg" className="item__icon" />
                  <div className="icon__text">Profile</div>
                </div>
              </Link>
              
              <Link to="/bookmark">
                <div className="sidebar__item">
                  <img src="/svg/bookmark.svg" alt="bookmarksvg" className="item__icon" />
                  <div className="icon__text">Bookmark</div>
                </div>
              </Link>
              
              <Link to="/search">
                <div className="sidebar__item">
                  <img src="/svg/search.svg" alt="searchsvg" className="item__icon" />
                  <div className="icon__text">Search</div>
                </div>
              </Link>
              
              <div className="sidebar__item" onClick={logout} >
                {!pending && 
                  <>
                  <img src="/svg/logout.svg" alt="logoutsvg" className="item__icon" />
                  <div className="icon__text">Logout</div>
                  </>
                }
                {pending && 
                    <img src="/svg/loading_icon.svg" alt="Loading" />
                }
              </div>
              
              <Link to="/addpost">
              <div className="sidebar__item icon--post">
                <img src="/svg/post.svg" alt="postsvg" className="item__icon " />
                <div className="icon__text ">Post</div>
              </div>
              </Link>
                
            </div>
          </div>
        </div>
    )
}

export default Sidebar
