import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import { getQuotes } from "../redux/quote/quoteSlice";
import { getContracts } from "../redux/contract/contractSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getInitials());
    dispatch(getQuotes());
    dispatch(getContracts());
  }, [dispatch]);
  const {
    totalQuotations,
    todayQuotations,
    approvePending,
    approvedCount,
    contractified,
  } = useSelector((state) => state.quote);
  const {
    totalContracts,
    todayContracts,
    approvedCount: acContract,
    approvePending: apContract,
  } = useSelector((state) => state.contract);

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Quotations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Quotations</h2>
          <p className="text-3xl font-bold text-blue-500">{totalQuotations}</p>
        </div>
        {/* Contractified Quotes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Contractified</h2>
          <p className="text-3xl font-bold text-blue-500">{contractified}</p>
        </div>

        {/* Today's Quotations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">
            Today&apos;s Quotations
          </h2>
          <p className="text-3xl font-bold text-green-500">{todayQuotations}</p>
        </div>

        {/* Placeholder for Additional Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Approved</h2>
          <p className="text-3xl font-bold text-red-500">{approvedCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Aprovel</h2>
          <p className="text-3xl font-bold text-yellow-500">{approvePending}</p>
        </div>
      </div>

      {/* Recent Quotations Section */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quotations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Contracts</h2>
          <p className="text-3xl font-bold text-blue-500">{totalContracts}</p>
        </div>

        {/* Today's Quotations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Today&apos;s Contracts</h2>
          <p className="text-3xl font-bold text-green-500">{todayContracts}</p>
        </div>

        {/* Placeholder for Additional Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Approved</h2>
          <p className="text-3xl font-bold text-red-500">{acContract}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Pending Aprovel</h2>
          <p className="text-3xl font-bold text-yellow-500">{apContract}</p>
        </div>
      </div>
    </div>
  );
}
