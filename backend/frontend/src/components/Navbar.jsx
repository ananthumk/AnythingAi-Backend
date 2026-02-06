import { useContext } from "react";
import { IoPerson } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";

export default function Navbar(){
    const navigate = useNavigate()
    const { updateToken} = useContext(AppContext)
    const handleLogout = () => {
         updateToken('')
         localStorage.removeItem('token')
    }
    return (
        <div className="w-full bg-white py-3">
            <div className="w-[85%] mx-auto flex items-center justify-between">
                <h1 onClick={() => navigate('/')} className="text-2xl font-bold text-black">Task Tracker</h1>
                <button onClick={handleLogout} className="py-1 px-3 flex justify-center max-w-[150px]
                min-w-[120px] items-center text-md cursor-pointer rounded-md bg-blue-300">
                     Logout
                </button>
            </div>
        </div>
    )
}