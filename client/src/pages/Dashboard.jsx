import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitials } from "../redux/user/userSlice";
import { getQuotes } from "../redux/quote/quoteSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getInitials());
    dispatch(getQuotes());
  }, [dispatch]);
  const { totalQuotations, todayQuotations, approvePending, approvedCount } =
    useSelector((state) => state.quote);

  return (
    <div className="max-w-7xl mx-auto min-h-screen p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Quotations */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Total Quotations</h2>
          <p className="text-3xl font-bold text-blue-500">{totalQuotations}</p>
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
      {/* <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Recent Quotations</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Quotation No</th>
                <th className="px-4 py-2 border">Author</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Q12345</td>
                <td className="border px-4 py-2">John Doe</td>
                <td className="border px-4 py-2">2024-07-10</td>
                <td className="border px-4 py-2">Pending</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Q12346</td>
                <td className="border px-4 py-2">Jane Smith</td>
                <td className="border px-4 py-2">2024-07-09</td>
                <td className="border px-4 py-2">Approved</td>
              </tr>
             
            </tbody>
          </table>
        </div>
      </div> */}
    </div>
  );
}
