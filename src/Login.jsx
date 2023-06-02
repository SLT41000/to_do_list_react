import React, { useState } from "react";

import './Log-Re.css'
import Register from "./Register";
// import API_URL from "./api_url";
import root from ".";
import App from "./App";
import API_URL from "./api_url";




export const Login = ({output=""}) => {

    const [name, setName] = useState('');
    const [pass, setPass] = useState('');

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        // send a POST request to the FastAPI server

        const input_data = { name: name, password: pass };
        async function fetchData() {
            const response = await fetch(API_URL + "/check_user/v2/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input_data)
            });
            const api_data = await response.json();
            try {
                sessionStorage.setItem("UID", api_data[0].UID);
                root.render(<App />)
            }
            catch (error) { output="Wrong User or password";
            
            root.render(<Login output={output}/>) }
        }
        fetchData();






    }

    const handleClick = (e) => {
        e.preventDefault();
        root.render(<Register />)
    }


    return (
        <header className="Log-Re">
            <div className=" w-[28rem] text-center">
                <p className=" font-bold text-6xl text-gray-600 mt-10 drop-shadow">Login</p>
                <div className=" bg-pink-300 w-11/12 h-0.5 rounded-xl m-auto mt-8 drop-shadow-sm"></div>
                <div className="form-box w-11/12 m-auto mt-10 p-2 bg-pink-300 rounded-xl drop-shadow">
                    <form class="w-11/12 m-auto my-8" onSubmit={handleSubmit} >
                        <input className="textbox" onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" ></input>
                        <input className="textbox" onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" ></input>
                        <p className=" text-red-600 mt-2">{output}</p>
                        <button className="btn-submit w-11/12 mt-8 mb-6 p-2.5 m-2.5 bg-white rounded-xl text-lg font-semibold text-pink-600">Login</button>

                        <button className="btn-signup text-white" onClick={handleClick}>Don't have an account? Sign-up here.</button>
                    </form>

                </div>
            </div>
        </header>
    )
}

export default Login;
