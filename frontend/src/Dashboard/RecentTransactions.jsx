import React from 'react'
import { LuArrowRight } from 'react-icons/lu'
import moment from 'moment'
import TransactionCard from '../components/cards/TransactionCard'

const RecentTransactions = ({ transactions = [], onSeeMore }) => {
  return (
    <div className='card p-4'>
      <div className='flex justify-between items-center mb-4'>
        <h4 className='text-lg font-semibold text-gray-800'>Recent Transactions</h4>
        <button className='card-btn flex items-center gap-1' onClick={onSeeMore}>
          See More <LuArrowRight className='text-base'/>
        </button>
      </div>

      <div className='mt-2 space-y-2'>
        {transactions.length > 0 ? (
          transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // ✅ sort mixed income + expense
            .slice(0, 5) // ✅ only show latest 5
            .map(item => (
              <TransactionCard
                key={item._id}
                title={item.source || item.category || 'Transaction'} // ✅ fallback if no source
                icon={item.icon}
                amount={item.amount}
                type={item.type} // ✅ backend must provide type: 'income' | 'expense'
                date={moment(item.date).format('DD MMM, YYYY')}
                hideDeleteButton
              />
            ))
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No recent transactions.</p>
        )}
      </div>
    </div>
  )
}

export default RecentTransactions
