import {useState} from 'react'
import { useLogin } from '../../hooks/useLogin'
import { Link } from 'react-router-dom'
import './Login.css'

function Login() {
    const [email ,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [formError, setFormError] = useState(null)
    const {login, error, pending} = useLogin()

    const guestCredentialClick = () => {
        setEmail('test@gmail.com')
        setPassword('test@gmail.com')
    }

    const formSubmit = (e) => {
        e.preventDefault()

        if(checkFormError())
        {
            setTimeout(()=> setFormError(null),7000)
            return
        }

        login(email,password)
    }

    const checkFormError = () => {
        if(password.length<10)
        {
            setFormError('Password length should be greater than or equal to 10 characters')
            return true
        }

        return false
    }

    return (
        <div className="login__container">
            <div className="login">
                <div className="login__img">
                    <img src="/svg/login_img.svg" alt="loginimg" />
                </div>
                <div className="login__form">
                    
                    <form onSubmit={(e) => formSubmit(e)}>
                        {formError && 
                        <div className="error__msg">
                            {formError}
                        </div>} 

                        {error &&
                        <div className="error__msg">
                            {error}
                        </div>}

                        <span className="form__title">Login</span>
                        
                        <div className="form__control">
                            <label>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={({target}) => setEmail(target.value)}
                                required
                            />
                        </div>
                        <div className="form__control">
                            <label>
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={({target}) => setPassword(target.value)}
                                required
                            />
                        </div>
                        
                        {!pending && <button className="btn">Login</button>}

                        {pending && <button className="btn btn__loading" disabled>
                            <img src="/svg/loading_icon.svg" alt="Loading" />
                        </button>}

                        <div className="form__link">
                            Don't have an account ? <Link to='/signup'>Sign up</Link>
                        </div>
                        
                        
                        <div className="form__link">
                            Fill Guest Credential ? <div className="btn btn--guest" onClick={guestCredentialClick}>Guest Credential</div>
                        </div>

                    </form>

                </div>
            </div>
        </div>
    )
}

export default Login
