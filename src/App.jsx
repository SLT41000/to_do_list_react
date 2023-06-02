import React from 'react';
import Calendar from './Calendar';
import Login from './Login';


const App = () => {
  if(sessionStorage.getItem("UID")!=null){
    return <Calendar/>
  }else{

    return <Login/>
  }

    
};

export default App;







