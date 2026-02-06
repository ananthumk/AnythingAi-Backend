import { useState, useContext } from "react";
import { RxCross2 } from "react-icons/rx";
import AppContext from "../context/AppContext";
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function Task({ isOpen, onClose, onTaskCreated }) {
    const [taskDetails, setTaskDetails] = useState({
        title: '', description: '', priority: 'low', status: 'open', dueDate: ''
    })

    const handleChanges = (e) => {
        const {name, value} = e.target 
        setTaskDetails(prev => ({
            ...prev,
            [name]: value
        }))
    }
    
    const {url, token} = useContext(AppContext)

    const handleSubmit = async (e) => {
       e.preventDefault()
       try {
          const urlString = `${url}/task`
          const response = await axios.post(urlString, taskDetails, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          })
          if(response.status === 200 || response.status === 201){
            toast.success('Task created successfully!')
            setTaskDetails({ title: '', description: '', priority: 'low', status: 'open', dueDate: '' })
            setTimeout(() => {
                onTaskCreated && onTaskCreated()
                onClose()
            }, 500);
          }
       } catch (error) {
         toast.error(error.response?.data?.message || error.message || 'Error creating task')
       }
    }

    const handleClose = () => {
        setTaskDetails({ title: '', description: '', priority: 'low', status: 'open', dueDate: '' })
        onClose()
    }

    if(!isOpen) return null
    
    return (
        <div className="w-full z-50 min-h-screen fixed top-0 left-0 bg-[rgba(0,0,0,0.5)] flex justify-center items-center">
            <div className="bg-white rounded w-[90%] sm:w-[80%] md:min-w-[300px] max-w-[400px] p-3 md:p-5 flex flex-col justify-center gap-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center">
                  <h1 className="text-lg sm:text-xl font-bold">Add New Task</h1>
                  <RxCross2 onClick={handleClose} className="w-5 h-5 cursor-pointer hover:text-red-500" />
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-light">Task Title</label>
                        <input required name="title" value={taskDetails.title} onChange={handleChanges} type="text" className="w-full text-[13px] py-3 px-6 border border-gray-300 rounded-md" placeholder="Enter task title" />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-light">Description</label>
                        <textarea name="description" value={taskDetails.description} onChange={handleChanges} className="w-full text-[13px] py-2 px-6 min-h-[70px] border border-gray-300 rounded-md" placeholder="Enter task description" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-light">Priority</label>
                            <select name="priority" value={taskDetails.priority} onChange={handleChanges} className="p-2 text-[11px] border rounded outline-0 border-gray-300">
                                <option className="p-2 text-[11px]" value="low">LOW</option>
                                <option className="p-2 text-[11px]" value="medium">MEDIUM</option>
                                <option className="p-2 text-[11px]" value="high">HIGH</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[12px] font-light">Status</label>
                            <select name="status" value={taskDetails.status} onChange={handleChanges} className="p-2 text-[11px] rounded border outline-0 border-gray-300">
                                <option className="p-2 text-[11px]" value="pending">PENDING</option>
                                <option className="p-2 text-[11px]" value="in progress">IN PROGRESS</option>
                                <option className="p-2 text-[11px]" value="completed">COMPLETED</option>
                            </select>
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-2 min-h-[30px] gap-6">
                        <button type="submit" className="py-2 text-[13px] bg-blue-600 text-white cursor-pointer rounded hover:bg-blue-700">
                             Create Task
                        </button>
                        <button type="button" onClick={handleClose} className="py-2 text-[13px] text-gray-900 bg-gray-300 cursor-pointer rounded hover:bg-gray-400">
                             Cancel
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer position="bottom-right" autoClose={3000} />
        </div>
    )
}