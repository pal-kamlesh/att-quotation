/* eslint-disable react/prop-types */
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import { getQuotes } from "../redux/quote/quoteSlice";
import { getContracts } from "../redux/contract/contractSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  MdDescription,
  MdAssignment,
  MdToday,
  MdCheckCircle,
  MdHourglassEmpty,
} from "react-icons/md";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const StatCard = ({ title, value, icon, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p
          className={`text-3xl font-bold ${color.replace("border-", "text-")}`}
        >
          {value ?? 0}
        </p>
      </div>
      <div className={`text-4xl ${color.replace("border-", "text-")}`}>
        {icon}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getInitials());
    dispatch(getQuotes());
    dispatch(getContracts());
  }, [dispatch]);

  const quoteData = useSelector((state) => state.quote) || {};
  const contractData = useSelector((state) => state.contract) || {};

  const {
    totalQuotations = 0,
    todayQuotations = 0,
    approvePending = 0,
    approvedCount = 0,
    contractified = 0,
  } = quoteData;

  const {
    totalContracts = 0,
    todayContracts = 0,
    approvedCount: approvedContracts = 0,
    approvePending: pendingContracts = 0,
    contractWithoutQuote = 0,
  } = contractData;

  const quotePieData = useMemo(
    () => [
      { name: "Approved", value: approvedCount },
      { name: "Pending", value: approvePending },
      { name: "Contractified", value: contractified },
    ],
    [approvedCount, approvePending, contractified]
  );

  const barChartData = useMemo(
    () => [
      { name: "Quotations", total: totalQuotations, today: todayQuotations },
      { name: "Contracts", total: totalContracts, today: todayContracts },
    ],
    [totalQuotations, todayQuotations, totalContracts, todayContracts]
  );

  const stats = [
    {
      title: "Total Quotations",
      value: totalQuotations,
      icon: <MdDescription />,
      color: "border-blue-500",
    },
    {
      title: "Total Contractified",
      value: contractified,
      icon: <MdAssignment />,
      color: "border-green-500",
    },
    {
      title: "Today's Quotations",
      value: todayQuotations,
      icon: <MdToday />,
      color: "border-purple-500",
    },
    {
      title: "Approved Quotes",
      value: approvedCount,
      icon: <MdCheckCircle />,
      color: "border-indigo-500",
    },
    {
      title: "Pending Approval",
      value: approvePending,
      icon: <MdHourglassEmpty />,
      color: "border-yellow-500",
    },
  ];

  const contractStats = [
    {
      title: "Total Contracts",
      value: totalContracts,
      icon: <MdAssignment />,
      color: "border-blue-500",
    },
    {
      title: "Today's Contracts",
      value: todayContracts,
      icon: <MdToday />,
      color: "border-green-500",
    },
    {
      title: "Approved Contracts",
      value: approvedContracts,
      icon: <MdCheckCircle />,
      color: "border-indigo-500",
    },
    {
      title: "Pending Contracts",
      value: pendingContracts,
      icon: <MdHourglassEmpty />,
      color: "border-yellow-500",
    },
    {
      title: "Direct Contracts",
      value: contractWithoutQuote,
      icon: <MdHourglassEmpty />,
      color: "border-yellow-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Quotations Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">
            Quotations vs Contracts
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" name="Total" />
              <Bar dataKey="today" fill="#82ca9d" name="Today" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Quotation Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={quotePieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {quotePieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Contracts Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {contractStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </div>
  );
}
