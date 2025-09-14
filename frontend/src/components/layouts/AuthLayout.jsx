import React from "react";
import card2 from "../../assets/images/card3.jpg";
import { TrendingUpDown } from "lucide-react"; // ✅ Correct import

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      {/* Left Section */}
      <div className="w-screen h-screen  md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg ml-6 font-medium text-gray-900">Expense Tracker</h2>
        {children}
      </div>

      {/* Right Section */}
      <div className="hidden md:block w-[40vw] h-screen bg-violet-50 bg-auth-bg-img bg-cover bg-no-repeat bg-center relative overflow-hidden justify-center p-8">
        {/* Decorative Shapes */}
        <div className="w-48 h-48 rounded-[40px] bg-purple-600 absolute -top-7 -left-5" />
        <div className="w-48 h-56 rounded-[40px] border-[20px] border-fuchsia-600 absolute top-[30%] -right-10" />
        <div className="w-48 h-48 rounded-[40px] bg-violet-500 absolute -bottom-7 -left-5" />

        {/* Stats Card overlay */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 w-[80%]">
          <StatsInfoCard
            icon={<TrendingUpDown  />}
            label="Track your income and expense"
            amount="400,000"
            color="bg-primary"
          />
        </div>

        {/* Background image */}
        <img
          src={card2}
          alt="card"
          className="w-64 lg:w-[90%] absolute bottom-10 shadow-lg shadow-blue-400/150 z-10"
        />
      </div>
    </div>
  );
};

export default AuthLayout;

const StatsInfoCard = ({ icon, label, amount, color }) => {
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-lg">
      {/* Icon Circle */}
      <div
        className={`w-12 h-12 flex items-center justify-center text-[26px] text-white ${color} rounded-full drop-shadow-xl`}
      >
        {icon}
      </div>

      {/* Text Info */}
      <div className="flex flex-col">
        <p className="text-sm text-gray-500">{label}</p>
        <span className="text-lg font-semibold text-gray-900">R{amount}</span>
      </div>
    </div>
  );
};
