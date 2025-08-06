import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    return (
       <div
  onClick={() => navigate(`/description/${job._id}`)}
  className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-gray-200 shadow-md cursor-pointer 
             transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] transform 
             hover:scale-[1.03] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(0,0,0,0.15)] 
             hover:ring-2 hover:ring-blue-300 hover:rotate-[0.4deg]"
>

            <div>
                <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>Pakistan</p>
            </div>
            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary}PKR</Badge>
            </div>

        </div>
    )
}

export default LatestJobCards