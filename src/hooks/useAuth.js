import {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'

function useAuth() {

    const context = useContext(AuthContext)
 
    return (
        context
    )
}

export {
    useAuth
} 
