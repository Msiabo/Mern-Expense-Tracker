import React from 'react'
import { LuTrash, LuUtensils, LuTrendingUp, LuTrendingDown } from 'react-icons/lu'
import { API_BASE_URL } from '../../utils/apiPaths' // make sure path is correct

const TransactionCard = ({ title, icon, amount, type, date, hideDeleteButton }) => {

  const getAmountStyles = () => 
    type === 'income' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500';

  return (
    <div className='group relative flex items-center gap-4 mt-2 p-3 rounded-lg hover:bg-gray-100 transition'>
      
      {/* Icon */}
      <div className='w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full text-xl text-gray-600'>
        {icon ? (
          <img 
            src={icon.startsWith('http') ? icon : `${API_BASE_URL}${icon}`} 
            alt={title} 
            className='w-6 h-6 object-cover rounded-full' 
          />
        ) : (
          <LuUtensils className='w-6 h-6' />
        )}
      </div>

      {/* Title and Date */}
      <div className='flex-1 flex items-center justify-between'>
        <div>
          <p className='text-sm text-gray-700 font-medium'>{title}</p>
          <p className='text-xs text-gray-400 mt-1'>{date}</p>
        </div>
      </div>

      {/* Amount */}
      <div className='flex items-center gap-2'>
        <div className={`flex items-center gap-1 rounded-sm px-3 py-1.5 ${getAmountStyles()}`}>
          <span className='text-xs font-medium'>
            {type === 'income' ? "+" : "-"} R{Number(amount).toLocaleString()}
          </span>
          {type === 'income' ? <LuTrendingUp /> : <LuTrendingDown />}
        </div>
      </div>

    </div>
  )
}

export default TransactionCard
