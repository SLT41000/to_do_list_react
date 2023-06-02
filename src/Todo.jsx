import './List.css';

import { CgCloseO } from 'react-icons/cg';
import React from 'react';

import List_reload from './list_reload';
import API_URL from './api_url';
export const Todo = ({ api_data,date}) => {
    


    
 
    
        
        
          
    const  delData = (id) => {
       
        
        const input_data = { log : id};
          fetch(API_URL+"/to_do_list/del/v1", {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(input_data)
           });
         
         try{
         
        List_reload(date);
         
         }
         catch(error){console.log(";)")}; 
       }
       
       


    
    
    return api_data.map((tmp) => (
        <div className='Todo'>
            <div className={ 'todo-row bg-pink-300 drop-shadow-sm'} key={tmp.log}>
                <div key={tmp.log} onClick={() => ""}>
                    {tmp.description}
                </div>
                <div className='icons'>
                    
                    <CgCloseO className='delete-icon text-xl hover:text-white' onClick={() => delData(tmp.log)}/>
                </div>
            </div>
        </div>
    )) 
}
export default Todo;