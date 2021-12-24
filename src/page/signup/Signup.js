import {useState} from 'react'
import { useSignup } from '../../hooks/useSignup'
import { Link } from 'react-router-dom'
import './Signup.css'

function Signup() {
    const [firstname,setFirstName] = useState('')
    const [lastname,setLastname] = useState('')
    const [username,setUsername] = useState('')
    const [email ,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [confirmPass,setConfirmPass] = useState('')
    const [formError, setFormError] = useState(null)
    const {signup, pending, error} = useSignup()

    const formSubmit = (e) => {
        e.preventDefault()

        if(checkFormError())
        {
            setTimeout(()=> setFormError(null),7000)
            return
        }

        setFormError(null)
        const displayName = firstname + ' ' + lastname
        const initial = (firstname[0] + lastname[0]).toUpperCase()
        
        signup(displayName,email,password,username,initial)
        
    }

    const checkFormError = () => {
        if(password.length<10)
        {
            setFormError('Password length should be greater than or equal to 10 characters')
            return true
        }

        if(password !== confirmPass)
        {
            setFormError('Password does not match')
            return true
        }
        return false
    }

    return (
        <div className="signup__container">
            <div className="signup">
                <div className="signup__img">
                    <img src="/svg/signup_img.svg" alt="signupimg" />
                </div>
                <div className="signup__form">
                    {formError && 
                    <div className="error__msg">
                        {formError}
                    </div>}

                    {error && 
                     <div className="error__msg">
                        {error}
                    </div>}

                    <form onSubmit={(e) => formSubmit(e)}>
                        <span className="form__title">Sign Up</span>
                        <div className="form__control">
                            <label>
                                First Name
                            </label>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstname}
                                onChange={({target}) => setFirstName(target.value.trim())}
                                required
                            />
                        </div>

                        <div className="form__control">
                            <label>
                                Last Name
                            </label>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastname}
                                onChange={({target}) => setLastname(target.value.trim())}
                                required
                            />
                        </div>

                        <div className="form__control">
                            <label>
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={({target}) => setUsername(target.value.trim())}
                                required
                            />
                        </div>

                        <div className="form__control">
                            <label>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={({target}) => setEmail(target.value.trim())}
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
                                onChange={({target}) => setPassword(target.value.trim())}
                                required
                            />
                        </div>
                        <div className="form__control">
                            <label>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPass}
                                onChange={({target}) => setConfirmPass(target.value.trim())}
                                required
                            />
                        </div>

                        {!pending && <button className="btn">Signup</button>}

                        {pending && <button className="btn btn__loading" disabled>
                            <img src="/svg/loading_icon.svg" alt="Loading" />
                        </button>}

                        <div className="form__link">
                            Have an account ? <Link to="/login">Login</Link>
                        </div>

                    </form>
                    
                </div>
            </div>
        </div>
    )
}

export default Signup
