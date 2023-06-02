import React, { useState } from "react";
import './Log-Re.css';
import Login from "./Login";


import API_URL from "./api_url";
import root from ".";





export const Register = ({output=""}) => {

    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const handleSubmit = (e) => {
        e.preventDefault();
        
        const input_data = { name: name, password: pass };
        if(name.length >8 || pass.length >8){
            output = "User or password should be less than 9"
            return root.render(<Register output={output}/>)
        }
        async function fetchData() {
            const response = await fetch(API_URL + "/user/v1/", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input_data)
            });
            const api_data = await response.json();
            output = api_data;
            root.render(<Register output={output}/>)
        }

        fetchData();

    }
    const handleClick = (e) => {
        e.preventDefault();
        root.render(<Login />)


    }

    return (
        <header className="Log-Re">
            <div className=" w-[28rem] text-center">
                <p className=" font-bold text-6xl text-gray-600 mt-10 drop-shadow">Sign-up</p>
                <div className=" bg-pink-300 w-11/12 h-0.5 rounded-xl mt-8 m-auto drop-shadow-sm"></div>
                <div className="form-box w-11/12 m-auto mt-10 p-2 bg-pink-300 rounded-xl drop-shadow">
                    <form class="w-11/12 m-auto my-8" onSubmit={handleSubmit}>
                        <input className="textbox" value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Username" required id="name" name="name"></input>
                        <input className="textbox" value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="Password" required id="password" name="password"></input>
                        <button className="btn-submit w-11/12 mt-8 mb-6 p-2.5 m-2.5 bg-white rounded-xl text-lg font-semibold text-pink-600">Sign Up</button>
                        <button className="btn-signup text-white" onClick={handleClick}>Already have an account? Log-in here.</button>
                        <p>{output}</p>
                    </form>
                </div>
            </div>
        </header>
    )
}

export default Register;