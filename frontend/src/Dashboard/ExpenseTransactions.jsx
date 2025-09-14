import moment from 'moment';
import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionCard from '../components/cards/TransactionCard';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg text-gray-800">Expenses</h5>

        <button className="card-btn" onClick={onSeeMore}>
          See More <LuArrowRight className="text-base" />
        </button>
      </div>

      <div className="mt-6">
        {transactions?.slice(0, 5)?.map((expense) => (
          <TransactionCard
            key={expense._id}
            title={expense.source} // <-- use 'source' instead of 'category'
            icon={expense.icon}
            amount={expense.amount}  
            date={moment(expense.date).format('DD MM YYYY')}
            type="expense"
            hideDeleteBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
