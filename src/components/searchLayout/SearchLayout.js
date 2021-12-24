import {useState,useEffect} from 'react'
import {projectFirestore} from '../../config/firebase'
import escapeStringRegexp from 'escape-string-regexp'
import { useAuth } from '../../hooks/useAuth'
import './SearchLayout.css'
import Avatar from './Avatar'
import { useUser } from '../../hooks/useUser'

function SearchLayout() {

    const [usersList, setUserList] = useState([])
    const [query, setQuery] = useState('')
    const [pending, setPending] = useState(false)
    const {user} = useAuth()
    const {userInfo, pending:userInfoPending} = useUser(user.uid)

    useEffect(()=>{
        const res = projectFirestore.collection('users')

        const unsub = res.onSnapshot(docs => {
            var result = []
            docs.forEach(doc => result.push({id:doc.id,...doc.data()}))
            setPending(false)
            setUserList(result.filter(fetchedUser => fetchedUser.id !== user.uid))
        },)

        return () => unsub()

    },[user])

    var queryList = []
    if(query && usersList.length > 0){
        const match = new RegExp(escapeStringRegexp(query),'i')
        queryList = usersList.filter(user => match.test(user.displayName))
    }

    return (
        <div className="layout__right">
          {!pending && !userInfoPending &&
            <div className="layout__content">
                <div className="search__content">
                    <input
                        placeholder="Search Users"
                        onChange={({target}) => setQuery(target.value)}
                        value={query}
                    />
                </div>
                <div className="search__result">
                    {queryList && queryList.length > 0 && 
                    queryList.map(usr => (
                        <Avatar user={usr} authUser={userInfo} key={usr.id}/>
                    ))}

                    {queryList.length === 0 &&
                        <div style={{'textAlign':'center','fontWeight':'700', 'fontSize':'0.9rem'}}>
                            No users found.
                        </div>
                    }
                </div>
            </div>
        }

        {(pending || userInfoPending) &&
                <div className="loading__container">
                    <img className="loading__svg" src="/svg/loading_icon.svg" alt="Loading" />
                </div>
        }

        </div>
    )
}

export default SearchLayout
