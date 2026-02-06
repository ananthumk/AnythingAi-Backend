import { useContext } from "react"
import AppContext from "../context/AppContext"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({element}){
    const {token} = useContext(AppContext)
    
   if(!token){
     return <Navigate to='/login' replace />
   }
   return element
}