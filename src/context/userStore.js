import React, { useEffect, useState } from 'react'
import { UserContext } from './user'
function UserStore({children}) {
    let [users,setUser]=useState(false)
    
  return (
    <UserContext.Provider value={[users,setUser]}>
        {children}
    </UserContext.Provider>
  )
}

export default UserStore; 
