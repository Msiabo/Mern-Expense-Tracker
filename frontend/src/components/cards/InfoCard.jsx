import React from 'react'

const InfoCard = ({ icon, label, value, bgColor, textColor }) => {
  return (
    <div className='flex gap-6 bg-white rounded-2xl shadow-md shadow-gray-100 border border-gray-200 p-5'>
      <div className={`flex w-14 h-14 items-center justify-center text-[26px] rounded-full drop-shadow-xl ${bgColor} ${textColor}`}>
        {icon}
      </div>
      <div>
        <h6 className='text-sm text-gray-400 mb-1'>{label}</h6>
        <span className='text-[22px] font-semibold'>{value}</span>
      </div>
    </div>
  )
}

export default InfoCard
