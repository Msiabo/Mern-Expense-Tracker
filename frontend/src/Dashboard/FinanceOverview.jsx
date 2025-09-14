import React from 'react'
import CustomePieChart from '../components/Charts/CustomePieChart';

const COLORS = {
    income: '#34D399',    // green-400
    expense: '#F87171',   // red-400
    balance: '#60A5FA'    // blue-400
};

const FinanceOverview = ({totalBalance,totalIncome,totalExpense}) => {

    const balanceData = [
        {name: 'Total Balance', amount: totalBalance, type: 'balance'},
        {name: 'Total Income', amount: totalIncome, type: 'income'},
        {name: 'Total Expense', amount: totalExpense, type: 'expense'},
    ];
  return (
    <div className='card'>
        <div className='flex justify-between items-center mb-4'>
            <h5 className='text-lg font-semibold text-gray-800'>Finance Overview</h5>
        </div>
    

    <CustomePieChart data={balanceData} label='Total Balance' totalAmount={`R${totalBalance}`}
    colors={COLORS} showTextAnchor />
    </div>
  )
}

export default FinanceOverview