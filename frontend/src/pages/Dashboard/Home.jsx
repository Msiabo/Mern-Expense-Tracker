import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import useUserAuth from '../../hooks/useUserAuth';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { IoMdCard } from 'react-icons/io';
import InfoCard from '../../components/cards/InfoCard';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import { addThousandsSeperator } from '../../utils/helper';
import RecentTransactions from '../../Dashboard/RecentTransactions';
import FinanceOverview from '../../Dashboard/FinanceOverview';
import ExpenseTransactions from '../../Dashboard/ExpenseTransactions';
import RecentIncomeWithChart from '../../Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DASHBOARD_DATA);
      if (response.data) setDashboardData(response.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ✅ Extract totals correctly from backend response
  const totals = dashboardData?.totals || { balance: 0, income: 0, expense: 0 };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeperator(totals.balance)}
            bgColor="bg-purple-400"
            textColor="text-white"
          />
          <InfoCard
            icon={<LuHandCoins />}
            label="Total Income"
            value={addThousandsSeperator(totals.income)}
            bgColor="bg-blue-400"
            textColor="text-white"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Expense"
            value={addThousandsSeperator(totals.expense)}
            bgColor="bg-red-400"
            textColor="text-white"
          />
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Recent Transactions (income + expense) */}
          <RecentTransactions
            transactions={dashboardData?.recentTransactions || []}
            onSeeMore={() => navigate('/transactions')}
          />

          {/* Finance Overview */}
          <FinanceOverview
            totalBalance={totals.balance}
            totalIncome={totals.income}
            totalExpense={totals.expense}
          />

          {/* Last 30 days expenses */}
          <ExpenseTransactions
            transactions={dashboardData?.dashboardData?.last30Days?.recentExpenses || []}
            onSeeMore={() => navigate('/expense')}
          />

          {/* Recent income chart */}
          <RecentIncomeWithChart
            data={dashboardData?.dashboardData?.last60Days?.recentIncomes?.slice(0, 4) || []}
            totalIncome={totals.income}
          />

          {/* Recent incomes */}
          <RecentIncome
            transactions={dashboardData?.dashboardData?.last60Days?.recentIncomes || []}
            onSeeMore={() => navigate('/income')}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;
