import './App.css';
import Home from './page/home/Home';
import {BrowserRouter, Switch, Route, Redirect, Link} from 'react-router-dom'
import Login from './page/login/Login';
import Signup from './page/signup/Signup';
import { useAuth } from './hooks/useAuth';

function App() {

  const {user,isAuthReady} = useAuth()

  return (
    <div className="App">
      <BrowserRouter>
      <nav className="navbar__container">
        <div className="navbar">
          <div className="navbar__content">
              <div className="toggle__btn" id="toggle" >
                <img src="/svg/menu.svg" alt="menusvg" className="toggle" />
              </div>
              <Link to="/">
                <div className="logo">
                  <img src="/svg/logo.svg" alt="logosvg" className="logo__img" />
                  <div className="logo__name">Poster</div>
                </div>
              </Link>
          </div>
        </div>
      </nav>

      {isAuthReady && 
        <Switch>
          <Route path="/login" exact>
           {user && <Redirect to="/" />} 
           {!user && <Login />}
          </Route>
          <Route path="/signup" exact>
          {user && <Redirect to="/" />} 
           {!user && <Signup /> }
          </Route>
          <Route path="/">
          {!user && <Redirect to="/login" />} 
           {user && <Home /> }
          </Route>
          
        </Switch>
      }
      </BrowserRouter>

      
    </div>
  );
}

export default App;
