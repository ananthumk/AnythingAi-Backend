import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RiAddLargeFill } from "react-icons/ri";
import { MdInsights, MdSignalCellularNull } from "react-icons/md";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import TaskCard from "../components/TaskCard";
import { Oval } from 'react-loader-spinner'
import { jwtDecode } from 'jwt-decode'

export default function UserDashboard() {
   const navigate = useNavigate()
   const [taskData, setTaskData] = useState([])
   const [totalPage, setTotalPage] = useState(null)
   const [insightData, setInsightData] = useState({})
   const [filter, setFilter] = useState({
      status: '', priority: '', search: ''
   })
   const [errMsg, setErrMsg] = useState('')
   const [page, setPage] = useState(1)
   const [userRole, setUserRole] = useState('') 
   const { url, token } = useContext(AppContext)


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

   console.log(url, token)
   useEffect(() => {
      const fetchData = async () => {
         if (!token) return
         try {
            const urlString = `${url}/tasks?status=${filter.status}&priority=${filter.priority}&search=${filter.search}&page=${page}`
            console.log(urlString)
            const options = {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
                  "Authorization": `Bearer ${token}`
               }
            }
            const response = await fetch(urlString, options)
            const data = await response.json()
            console.log(data)
            if (response.ok) {
               setTaskData(data.tasks)
               setTotalPage(data.totalPage)
               console.log(data)
               setErrMsg('')
            } else {
               setErrMsg(data.message)
            }
         } catch (error) {
            setErrMsg(error.message)
         }
      }

      fetchData()

   }, [url, token, filter, page])

  
   useEffect(() => {
      if (userRole === 'admin') return 
      
      const fetchInsight = async () => {
         if (!token) return

         const urlString = `${url}/insight`
         const options = {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
         }
         try {
            const response = await fetch(urlString, options)
            const data = await response.json()

            if (response.ok) {
               setErrMsg('')
               console.log('in', data)
               setInsightData(data)
            } else {
               setErrMsg(data.message)
            }
         } catch (error) {
            setErrMsg(error.message)
         }
      }

      fetchInsight()
   }, [url, token, userRole]) 

   return (
      <div className="">
         <Navbar />
         <div className="w-full min-h-[90vh] flex flex-col py-6 gap-3 bg-neutral-100">

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
            {taskData?.length === 0 ? <div className="w-full flex justify-center items-center mt-20">
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
            </div> :
               <div className="w-[85%] mx-auto">
                  <p className="text-[15px] sm:text-[19px] text-black">Tasks</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 flex-wrap gap-5 mt-3">
                     {taskData?.map(task => (
                        <TaskCard key={task._id} task={task} />
                     ))}
                  </div>
               </div>}

               <div className="flex justify-center gap-2 items-center">
                   <BiSolidLeftArrow onClick={handlePaginationD} className="w-4 h-4 cursor-pointer" />
                   <h4 className="text-[18px] font-semibold">{page}</h4>
                   <BiSolidRightArrow onClick={handlePaginationI} className="w-4 h-4 cursor-pointer" />
               </div>
            <div onClick={() => { navigate('/task') }} style={{ zIndex: 1000 }} className="w-10 h-10 cursor-pointer fixed bottom-3 md:bottom-10 right-3 md:right-12 flex justify-center items-center rounded-full bg-blue-800">
               <RiAddLargeFill className="w-5 h-5 text-white" />
            </div>
         </div>
      </div>
   )
}