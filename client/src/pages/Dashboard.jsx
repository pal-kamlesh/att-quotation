/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import { getQuotes } from "../redux/quote/quoteSlice";
import {
  getContracts,
  getDashboardData,
} from "../redux/contract/contractSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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
import { unwrapResult } from "@reduxjs/toolkit";

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
  const [barChartData, setBarChartData] = useState();
  useEffect(() => {
    async function fn() {
      const result = await dispatch(getDashboardData());
      const data = await unwrapResult(result);
      setBarChartData(data.data);
    }
    fn();
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

  const quoteContractConversionRatio = Number(
    (contractified / totalQuotations) * 100
  ).toFixed(2);
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
    {
      title: "Quote to Contract conversion ratio",
      value: quoteContractConversionRatio,
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
          <h2 className="text-2xl font-semibold mb-4">Quotations By Months</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#666" }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                payload={[
                  { value: "This Year", type: "rect", color: "#8884d8" },
                  { value: "Last Year", type: "rect", color: "#82ca9d" },
                ]}
              />
              <Bar
                dataKey="thisYear"
                fill="#8884d8"
                name="This Year"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="lastYear"
                fill="#82ca9d"
                name="Last Year"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Contracts By Months</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={barChartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis
                dataKey="name"
                tick={{ fill: "#666" }}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis />
              <Tooltip />
              <Legend
                wrapperStyle={{ paddingTop: "20px" }}
                payload={[
                  { value: "This Year", type: "rect", color: "#8884d8" },
                  { value: "Last Year", type: "rect", color: "#82ca9d" },
                ]}
              />
              <Bar
                dataKey="thisYear"
                fill="#8884d8"
                name="This Year"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="lastYear"
                fill="#82ca9d"
                name="Last Year"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
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
