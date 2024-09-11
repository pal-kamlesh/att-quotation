/* eslint-disable react/prop-types */
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { diff } from "deep-object-diff";
import { Loading, RevisionHistoryCard } from "./index.js";
import { archiveDataContract } from "../redux/contract/contractSlice.js";
import { Table } from "flowbite-react";

function HistoryPanelContract({ contractId }) {
  const dispatch = useDispatch();
  const [latest, setLatest] = useState({});
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRevision, setSelectedRevision] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const resultAction = await dispatch(archiveDataContract(contractId));
        const result = unwrapResult(resultAction);

        const { archive: history, ...rest } = result.result;
        const obj = {
          state: rest,
          message: "",
          author: rest.createdBy,
          _id: rest._id,
          timestamp: rest.updatedAt,
        };
        setLatest(rest);
        setArchive(() => [obj, ...(history?.revisions ?? [])]);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, contractId]);

  useEffect(() => {
    if (archive?.length > 0) {
      const modifiedKeys = getModifiedKeys(archive[0].state, latest);
      console.log(modifiedKeys);
    }
  }, [latest, archive]);

  function getModifiedKeys(oldObj, newObj) {
    const difference = diff(oldObj, newObj);
    return Object.keys(difference);
  }

  const handleCardClick = (revision) => {
    setSelectedRevision(revision);
  };

  const revisionDetails = selectedRevision || latest;
  return (
    <div className="p-4 flex h-screen overflow-hidden">
      {/* Left Side: Revision History Cards */}
      <div className="w-1/4 pr-4 overflow-y-auto h-[calc(100vh-2rem)]">
        {/* Adjust height and add overflow-y-auto */}
        <h2 className="text-lg font-semibold sticky top-0 bg-white pb-2">
          Revision History:
        </h2>
        {/* Make the header sticky */}
        <div className="mt-2 flex flex-col gap-4">
          {archive?.map((revision, index) => (
            <RevisionHistoryCard
              key={index}
              revision={revision}
              onClick={handleCardClick}
              active={
                revision.state.quotationNo === revisionDetails?.quotationNo
              }
            />
          ))}
        </div>
      </div>

      {/* Right Side: Details */}

      <div className="w-3/4 overflow-y-auto h-[calc(100vh-2rem)]">
        {/* Add overflow-y-auto and set height */}
        {loading && <Loading />}
        {/* Quotation Header */}
        <div className="bg-gray-200 p-4 rounded-t-lg top-0">
          {/* Make the header sticky */}
          <h1 className="text-xl font-bold">
            Contract No: {revisionDetails?.contractNo}
          </h1>
          <p className="text-gray-600">
            Date:
            {new Date(revisionDetails?.contractDate).toLocaleDateString(
              "en-GB"
            )}
          </p>
        </div>
        {/* Company & Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold">Bill To:</h2>
            <p>
              {revisionDetails?.billToAddress?.prefix}{" "}
              {revisionDetails?.billToAddress?.name}
            </p>
            <p>
              {revisionDetails?.billToAddress?.a1},{" "}
              {revisionDetails?.billToAddress?.a2}
            </p>
            <p>
              {revisionDetails?.billToAddress?.a3},{" "}
              {revisionDetails?.billToAddress?.a4}
            </p>
            <p>
              {revisionDetails?.billToAddress?.a5},{" "}
              {revisionDetails?.billToAddress?.city},{" "}
              {revisionDetails?.billToAddress?.pincode}
            </p>
            <div className="overflow-x-auto mt-2">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell>Sr.No</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Contact</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {revisionDetails.billToAddress?.kci.map((kci, idx) => (
                    <Table.Row
                      key={kci.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } dark:bg-gray-800`}
                    >
                      <Table.Cell>{idx + 1}</Table.Cell>
                      <Table.Cell>{kci.name}</Table.Cell>
                      <Table.Cell>{kci.contact}</Table.Cell>
                      <Table.Cell>{kci.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Ship To:</h2>
            <p>{revisionDetails?.shipToAddress?.projectName}</p>
            <p>
              {revisionDetails?.shipToAddress?.a1},{" "}
              {revisionDetails?.shipToAddress?.a2}
            </p>
            <p>
              {revisionDetails?.shipToAddress?.a3},{" "}
              {revisionDetails?.shipToAddress?.a4}
            </p>
            <p>
              {revisionDetails?.shipToAddress?.a5},{" "}
              {revisionDetails?.shipToAddress?.city},{" "}
              {revisionDetails?.shipToAddress?.pincode}
            </p>
            <div className="overflow-x-auto mt-2">
              <Table hoverable className="w-full">
                <Table.Head>
                  <Table.HeadCell>Sr.No</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Contact</Table.HeadCell>
                  <Table.HeadCell>Email</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {revisionDetails.shipToAddress?.kci.map((kci, idx) => (
                    <Table.Row
                      key={kci.id}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-100"
                      } dark:bg-gray-800`}
                    >
                      <Table.Cell>{idx + 1}</Table.Cell>
                      <Table.Cell>{kci.name}</Table.Cell>
                      <Table.Cell>{kci.contact}</Table.Cell>
                      <Table.Cell>{kci.email}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
        {/* Treatment & Specification Details */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Gst No:</h2>
          <p>{revisionDetails?.gstNo}</p>
          <h2 className="text-lg font-semibold mt-4">Work Order No:</h2>
          <p>{revisionDetails?.workOrderNo}</p>
          <h2 className="text-lg font-semibold mt-4">Work Order Date:</h2>
          <p>{revisionDetails?.workOrderDate}</p>
        </div>
        {/* Payment & Taxation Information */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Payment Terms:</h2>
          <p>{revisionDetails?.paymentTerms}</p>
          <h2 className="text-lg font-semibold mt-4">Taxation:</h2>
          <p>{revisionDetails?.taxation}</p>
        </div>
        {/* Quotation Details Table */}
        <div className="bg-white p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Quotation Details:</h2>
          <table className="w-full table-auto mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Work Area Type</th>
                <th className="border px-4 py-2">Work Area</th>
                <th className="border px-4 py-2">Chemical Rate</th>
                <th className="border px-4 py-2">Service Rate</th>
                <th className="border px-4 py-2">Apply Rate</th>
                <th className="border px-4 py-2">Chemical</th>
                <th className="border px-4 py-2">Chemical Quantity</th>
              </tr>
            </thead>
            <tbody>
              {revisionDetails?.quoteInfo?.map((info, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{info.workAreaType}</td>
                  <td className="border px-4 py-2">
                    {info.workArea} {info.workAreaUnit}
                  </td>
                  <td className="border px-4 py-2">
                    {info.chemicalRate
                      ? `${info.chemicalRate} ${info.chemicalRateUnit}`
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {info.serviceRate
                      ? `${info.serviceRate} ${info.serviceRateUnit}`
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {info.applyRate
                      ? `${info.applyRate} ${info.applyRateUnit}`
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">{info.chemical}</td>
                  <td className="border px-4 py-2">
                    {info.chemicalQuantity || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Footer */}
        <div className="bg-gray-200 p-4 rounded-b-lg flex justify-between items-center">
          <div>
            <p>
              Created By: {revisionDetails?.createdBy?.prefix}{" "}
              {revisionDetails?.createdBy?.username} (
              {revisionDetails?.createdBy?.initials})
            </p>
          </div>
          <div>
            <p>Approved: {revisionDetails?.approved ? "✓" : "✗"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HistoryPanelContract;
