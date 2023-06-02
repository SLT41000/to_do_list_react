import root from ".";

import Login from "./Login";
const  logout = () => {
    
    sessionStorage.setItem("UID",null);
    
    root.render(<Login />);

    
   
}
export default logout ;