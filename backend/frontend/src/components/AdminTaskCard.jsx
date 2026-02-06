import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import { MdOutlineDelete } from "react-icons/md";
import axios from 'axios'
import { IoMdPerson } from "react-icons/io";
import AppContext from "../context/AppContext";
import { useContext, useState } from "react";
import { toast, ToastContainer } from 'react-toastify';

export default function AdminTaskCard({task, onDelete, onEdit}){

    const [isDeleting, setIsDeleting] = useState(false)
    const {token, url} = useContext(AppContext)

    const handleDelete = async (id) => {
        setIsDeleting(true)
        try {
            const response = await axios.delete(`${url}/task/admin/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(response.status === 200 || response.status === 201){
                toast.success("Task deleted successfully");
                if(onDelete) onDelete(id)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete task')
        } finally {
            setIsDeleting(false)
        }
    }
    return(
        <div  key={task._id} className="sm:max-w-[340px] flex flex-col gap-2 bg-white rounded py-2 px-4">
            <div className="flex w-full justify-between items-center">
            <h3 className="text-[14px] sm:text-[15px]">{task.title}</h3> 
            <div className="flex items-center gap-2"> 
            <MdOutlineDelete onClick={() => {handleDelete(task._id)}} disabled={isDeleting} className="w-4 h-4 hover:text-red-600 cursor-pointer" />
            </div>
            </div>
            <p className="text-[11px]">{task.description}</p>
            <div className="flex items-center justify-between">
            <div className={`py-0.5 px-1.5 ${task.priority?.toLowerCase() === 'high' ? 'bg-red-200' : task.priority?.toLowerCase() === 'medium' ? 'bg-yellow-200' : 'bg-green-300' } rounded-md`}>
                <p className="text-[10px] capitalize">{task.priority}</p>
            </div>
            <p className={`text-[11px] capitalize ${task.status?.toLowerCase() === 'open' ? 'text-red-500' : task.status?.toLowerCase() === 'in progress' ? 'text-blue-600' : 'text-green-500' }`}>{task.status}</p>
            </div>
            {task?.createdBy?._id &&  <div className="flex items-center gap-2">
                <IoMdPerson className="w-3 h-3" />
                <p className="text-[10px]">{task.createdBy.name}</p>
            </div>}
            
            <ToastContainer position="bottom-right" autoClose={3000}/>
        </div>
    )
}