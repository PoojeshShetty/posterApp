import {createContext,useReducer} from 'react'
import { useEffect } from 'react'
import { projectAuth } from '../config/firebase'

const initialState = {
    user:null,
    isAuthReady:false
}

const authReducer = (state, action) => {
    switch(action.type)
    {
        case 'LOGIN':
            return {...state, user:action.payload}
        case 'AUTH_IS_READY':
            return {...state, user:action.payload,isAuthReady:true}
        case 'LOGOUT' :
            return {...state, user:null}
        default:
            return state
    }
}

export const AuthContext = createContext()

function AuthContextProvider({children}) {

    const [state, dispatch] = useReducer(authReducer,initialState)

    useEffect(()=>{
        const unsub = projectAuth.onAuthStateChanged(user => {
            dispatch({type:'AUTH_IS_READY',payload:user})
            
            unsub()
        })
    },[])

    return (
        <AuthContext.Provider value={{...state,dispatch}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider
