import { useNavigate } from "react-router-dom"

export default function NotFound(){
    const navigate = useNavigate()
    return(
        <div className="min-h-screen w-full bg-neutral-100 flex justify-center items-center">
           <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-semibold text-gray-700">
                Not Found
              </h1>
              <p className="text-center text-lg text-gray-600">
                Currently we Don't have this page! Click the button to back to home
              </p>
              <button onClick={() => {navigate('/')}} className="min-w-[120px] border-0  py-1 cursor-pointer rounded-md px-2 bg-blue-500 text-white font-medium text-[18px]">
                    Click here!
              </button>
           </div>
        </div>
    )
}