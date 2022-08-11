import React from 'react'
import {signOut,getAuth } from 'firebase/auth';
import {app} from '../firebase';

// const auth = getAuth(app);

// const logoutHandler = ()=>{
//     signOut(auth);
//   }
const AdminArea = (props) => {
    

  return (
    <div>
        {/* <button onClick={logoutHandler} style={{backgroundColor:'red', color:'white'}}>Logout</button> */}
        AdminArea
        
        </div>
  )
}

export default AdminArea