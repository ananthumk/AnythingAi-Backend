
import Navbar from "../components/Navbar";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { RiAddLargeFill } from "react-icons/ri";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import Task from "../components/Task";
import EditTask from "../components/EditTask";
import { Oval } from 'react-loader-spinner'
import { jwtDecode } from 'jwt-decode'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import AdminTaskCard from "../components/AdminTaskCard";

export default function AdminDashBoard() {
   const [taskData, setTaskData] = useState([])
   const [totalPage, setTotalPage] = useState(null)
   const [filter, setFilter] = useState({
      status: '', priority: '', search: ''
   })
   const [errMsg, setErrMsg] = useState('')
   const [page, setPage] = useState(1)
   const [userRole, setUserRole] = useState('') 
   const [isLoading, setIsLoading] = useState(true) 
   
   const { url, token } = useContext(AppContext)

   useEffect(() => {
      if(errMsg) {
         toast.error(errMsg)
      }
   }, [errMsg])


   const [isEditModalOpen, setIsEditModalOpen] = useState(false)
   const [selectedTask, setSelectedTask] = useState(null)


   useEffect(() => {
      if (token) {
         try {
            const decoded = jwtDecode(token)
            setUserRole(decoded.role)
         } catch (error) {
            console.log('Error decoding token:', error)
         }
      }
   }, [token])

   const handleFiltering = (e) => {
      const { name, value } = e.target
      setFilter(prev => ({
         ...prev,
         [name]: value
      }))
   }

   const handlePaginationD = () => {
      if (page !== 1){
         setPage(prev => prev - 1)
      }
   }

   const handlePaginationI = () => {
      if(page < totalPage){
         setPage(prev => prev + 1)
      }
   }

   
   const handleCloseTaskModal = () => {
      setIsTaskModalOpen(false)
   }

   const handleOpenEditModal = (task) => {
      setSelectedTask(task)
      setIsEditModalOpen(true)
   }

   const handleCloseEditModal = () => {
      setIsEditModalOpen(false)
      setSelectedTask(null)
   }

   const handleRefreshTasks = () => {
      setPage(1)
      setFilter({ status: '', priority: '', search: '' })
   }

   console.log(url, token)
   useEffect(() => {
      const fetchData = async () => {
         if (!token) return
         setIsLoading(true)
         try {
            const urlString = `${url}/task/admin/tasks?status=${filter.status}&priority=${filter.priority}&search=${filter.search}&page=${page}`
            const response = await axios.get(urlString, {
               headers: {
                  'Authorization': `Bearer ${token}`
               }
            })
            if (response.data.tasks) {
               setTaskData(response.data.tasks)
               setTotalPage(response.data.totalPage)
               setErrMsg('')
            } else {
               setErrMsg(response.data.message || 'Failed to fetch tasks')
            }
         } catch (error) {
            setErrMsg(error.response?.data?.message || error.message)
         } finally {
            setIsLoading(false)
         }
      }

      fetchData()

   }, [url, token, filter, page])

  


   return (
    <>
      <div className="">
         <Navbar />
         <div className="w-full min-h-[90vh] flex flex-col py-6 gap-3 bg-neutral-100">
                <h1 className="text-2xl w-[85%] mx-auto mb-3 font-semibold text-gray-600">Admin Dashboard</h1>
            <div className="w-[85%] flex items-center gap-2 flex-wrap sm:gap-5 mx-auto rounded bg-white py-3 px-5">
                
               <div className="flex flex-col gap-1">
                  <label className="text-[12px]">Fliter by Search</label>
                  <input onChange={handleFiltering} type="search" name="search" placeholder="Search anything..." className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-1 sm:px-2" />
               </div>
               <div className="flex flex-col gap-1">
                  <label className="text-[12px]">Fliter by Status</label>
                  <select name="status" onChange={handleFiltering} className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-1 sm:px-2">
                     <option value='' className="text-[11px] py-0.5 px-2">All Status</option>
                     <option value='pending' className="text-[11px] py-0.5 px-2">Pending</option>
                     <option value='in progress' className="text-[11px] py-0.5 px-2">In Progress</option>
                     <option value='completed' className="text-[11px] py-0.5 px-2">Completed</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1">
                  <label className="text-[12px]">Fliter by Priority</label>
                  <select name="priority" onChange={handleFiltering} className="min-w-[100px] md:min-w-[250px] outline-0 text-[12px] rounded border border-gray-300 py-0.5 px-2">
                     <option value='' className="text-[11px] py-0.5 px-2">All Priority</option>
                     <option value='low' className="text-[11px] py-0.5 px-2">Low</option>
                     <option value='medium' className="text-[11px] py-0.5 px-2">Medium</option>
                     <option value='high' className="text-[11px] py-0.5 px-2">High</option>
                  </select>
               </div>
            </div>
            {isLoading ? (
               <div className="w-full flex justify-center items-center mt-20">
                  <Oval
                     height={50}
                     width={50}
                     color="#4fa94d"
                     visible={true}
                     ariaLabel="oval-loading"
                     secondaryColor="#4fa94d"
                     strokeWidth={2}
                     strokeWidthSecondary={2}
                  />
               </div>
            ) : taskData?.length === 0 ? (
               <div className="w-full flex flex-col justify-center items-center mt-20 gap-4">
                  <p className="text-lg text-gray-600 font-semibold">No tasks found</p>
                  
               </div>
            ) : (
               <div className="w-[85%] mx-auto">
                  <p className="text-[15px] sm:text-[19px] text-black">Tasks</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex-wrap gap-5 mt-3">
                     {taskData?.map(task => (
                        <AdminTaskCard key={task._id} task={task} onDelete={() => setTaskData(taskData.filter(t => t._id !== task._id))} onEdit={handleOpenEditModal} />
                     ))}
                  </div>
               </div>
            )}

               <div className="flex justify-center gap-2 items-center">
                   <BiSolidLeftArrow onClick={handlePaginationD} className="w-4 h-4 cursor-pointer" />
                   <h4 className="text-[18px] font-semibold">{page}</h4>
                   <BiSolidRightArrow onClick={handlePaginationI} className="w-4 h-4 cursor-pointer" />
               </div>
            
         </div>
      </div>
     
      <EditTask isOpen={isEditModalOpen} taskId={selectedTask?._id} task={selectedTask} onClose={handleCloseEditModal} onTaskUpdated={handleRefreshTasks} />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </>
   )
}