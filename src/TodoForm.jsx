import './List.css';
import React, { useState, useEffect, useRef } from 'react';
import API_URL from './api_url';

import List_reload from './list_reload';
export const TodoForm = ({day}) => {
    const [input, setInput] = useState('');
    
    const inputRef = useRef(null)

    useEffect(() => {
        inputRef.current.focus()
    })

    const handleChange = e => {
        setInput(e.target.value);
    };
    
    const handleSubmit = e => {
        e.preventDefault();
        
                const input_data = { UID:sessionStorage.getItem("UID"), day: day,description:input};
        
                  async function fetchData() {
                     await fetch(API_URL+"/to_do_list/insert/v1", {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(input_data)
                      });}
                  fetchData();
                  List_reload(day);
    };

    return(
        <div className='todoForm drop-shadow-sm'>
            <div className=" bg-pink-200 w-11/12 h-0.5 rounded-full mb-4"></div>
            <form className='mt-5 mb-5 p-1 bg-pink-300 rounded-3xl' onSubmit={handleSubmit}>
                <input className='todo-input pl-2 p-1 rounded-l-2xl' type='text' placeholder='Lets add a todo' 
                name='text' value={input} onChange={handleChange} ref={inputRef}></input>
                <button className='todo-btn pl-2 p-1 bg-pink-300 rounded-r-2xl pr-2 hover:text-white'>Add todo</button>
            </form>
        </div>
    );
};

export default TodoForm;