import './List.css';
import TodoForm from './TodoForm';
import Todo from './Todo';
import { IoMdArrowRoundBack } from 'react-icons/io';
import React from 'react';

import rollback from './roalback';

export const List = ({ api_data, date }) => {






    return (
        <>
            <div className='list'>
                <div className=" w-[28rem] text-center">
                    <div className=' w-full text-left rounded-b-2xl pb-5 pl-7 inline'>
                        <p onClick={rollback} className='text-gray-600 text-4xl font-bold mt-6 ml-5 drop-shadow'> 
                        <IoMdArrowRoundBack className='back-icon text-3xl absolute bg-pink-200 rounded-full hover:text-white' /> {date}</p>
                        <p className='text-gray-400 text-base w-max ml-5'>What's the Plan for Today?</p>
                    </div>
                    <TodoForm api_data={api_data} day={date} />
                    <Todo api_data={api_data} date={date} />
                </div>
            </div>
        </>
    );

};

export default List;