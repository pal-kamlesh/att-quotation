import { unwrapResult } from "@reduxjs/toolkit";
import { useReactToPrint } from "react-to-print";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { saprateQuoteInfo } from "../funtions/funtion.js";
import { Button } from "flowbite-react";
import { getSingleContract } from "../redux/contract/contractSlice.js";

function longestKey() {
  return Math.max(
    "Quotation No".length,
    "Date".length,
    "Subject".length,
    "Reference".length,
    "Treatment Type".length,
    "Specification".length,
    "Equipments".length,
    "Payment Terms".length,
    "Taxation".length,
    "Kind Attention".length
  );
}
// eslint-disable-next-line react/prop-types, react/display-name
const ViewContract = forwardRef((props) => {
  {
    // eslint-disable-next-line react/prop-types
    const { id } = props;
    const dispatch = useDispatch();
    const [contract, setContract] = useState({});
    const [standard, setStandard] = useState([]);
    const [applySupply, setApplySupply] = useState([]);
    const [supply, setSupply] = useState([]);
    const { loading } = useSelector((state) => state.contract);
    const componentRef = useRef();

    useEffect(() => {
      async function fn() {
        const actionResult = await dispatch(getSingleContract(id));
        const result = unwrapResult(actionResult);
        setContract(result.result);
        if (result.result.docType) {
          result.result.docType === "standard"
            ? setStandard(result.result.quoteInfo)
            : result.result.docType === "supply/apply"
            ? setApplySupply(result.result.quoteInfo)
            : result.result.docType === "supply"
            ? setSupply(result.result.quoteInfo)
            : null;
        } else {
          const [a1, a2] = saprateQuoteInfo(result.result.quoteInfo);
          setStandard(a1);
          setApplySupply(a2);
        }
      }
      fn();
    }, [dispatch, id]);
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onAfterPrint: async () => {
        // const resultAction = await dispatch(incPrintCount(id));
        // // eslint-disable-next-line no-unused-vars
        // const result = unwrapResult(resultAction);
        // close();
      },
    });
    return (
      <>
        <div
          ref={componentRef}
          className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg"
        >
          <div className="mb-6 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Contract</h1>
            </div>
            {loading && <Loading />}
            <div className="text-right">
              <p className="text-gray-600">
                <span
                  className="font-semibold mr-2"
                  style={{ minWidth: `${longestKey + 2}ch` }}
                >
                  Contract No:
                </span>
                {contract.contractNo ? contract.contractNo : contract._id}
              </p>
              <p className="text-gray-600">
                <span
                  className="font-semibold mr-2"
                  style={{ minWidth: `${longestKey + 2}ch` }}
                >
                  Date:
                </span>
                {new Date(contract.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
              <p className="text-gray-600">
                {contract.billToAddress?.frefix} {contract.billToAddress?.name}
              </p>
              <p className="text-gray-600">
                {contract.billToAddress?.a1}
                {contract.billToAddress?.a2}
              </p>
              <p className="text-gray-600">{contract.billToAddress?.a3}</p>
              <p className="text-gray-600">{contract.billToAddress?.a4}</p>
              <p className="text-gray-600">{contract.billToAddress?.a5}</p>
              <p className="text-gray-600">
                {contract.billToAddress?.city} -{" "}
                {contract.billToAddress?.pincode}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Ship To:</h2>
              <p className="text-gray-600">
                {contract.shipToAddress?.projectName}
              </p>
              <p className="text-gray-600">
                {contract.shipToAddress?.a1}
                {contract.shipToAddress?.a2}
              </p>
              <p className="text-gray-600">{contract.shipToAddress?.a3}</p>
              <p className="text-gray-600">{contract.shipToAddress?.a4}</p>
              <p className="text-gray-600">{contract.shipToAddress?.a5}</p>
              <p className="text-gray-600">
                {contract.shipToAddress?.city} -{" "}
                {contract.shipToAddress?.pincode}
              </p>
            </div>
          </div>
          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Work Order No:
            </div>
            <div className="w-2/3 text-gray-600">{contract.workOrderNo}</div>
          </div>
          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Work Order Date:
            </div>
            <div className="w-2/3 text-gray-600">
              {new Date(contract.workOrderDate).toLocaleDateString("en-GB")}
            </div>
          </div>
          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              GST No:
            </div>
            <div className="w-2/3 text-gray-600">{contract.gstNo}</div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Payment Terms:
            </div>
            <div className="w-2/3 text-gray-600">{contract.paymentTerms}</div>
          </div>
          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Taxation:
            </div>
            <div className="w-2/3 text-gray-600">{contract.taxation}</div>
          </div>
          {contract.note !== "" ? (
            <div className="mb-6">
              <div
                className="font-semibold mb-2"
                style={{ minWidth: `${longestKey() + 2}ch` }}
              >
                Note:
              </div>
              <p className="text-gray-600 whitespace-pre-line">
                {contract.note}
              </p>
            </div>
          ) : null}
          <div>
            <h2 className="text-lg font-semibold mb-4">
              contract Information:
            </h2>
            {standard.length > 0 && (
              <div className="mb-6">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2">Work Area Type</th>
                        <th className="px-4 py-2">Work Area</th>
                        <th className="px-4 py-2">Service Rate</th>
                        <th className="px-4 py-2">Chemical</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standard.map((info) => (
                        <tr key={info._id} className="odd:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200">
                            {info.workAreaType}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {info.workArea} {info.workAreaUnit}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {`₹ ${info.serviceRate} ${info.serviceRateUnit}`}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {info.chemical}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {applySupply.length > 0 && (
              <div className="mb-6">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2">Work Area Type</th>
                        <th className="px-4 py-2">Work Area</th>
                        <th className="px-4 py-2">Apply Rate</th>
                        <th className="px-4 py-2">Chemical Quantity</th>
                        <th className="px-4 py-2">Chemical Rate</th>
                        <th className="px-4 py-2">Chemical</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applySupply.map((info) => (
                        <tr key={info._id} className="odd:bg-gray-50">
                          <td className="px-4  py-2 border-b border-gray-200">
                            {info.workAreaType}
                          </td>
                          <td className="px-4  py-2 border-b border-gray-200">
                            {info.workArea} {info.workAreaUnit}
                          </td>
                          <td className="px-4  py-2 border-b border-gray-200">
                            {`₹ ${info.applyRate} ${info.applyRateUnit}`}
                          </td>
                          <td className="px-4  py-2 border-b border-gray-200">
                            {`${info.chemicalQuantity} Ltr.`}
                          </td>
                          <td className="px-4  py-2 border-b border-gray-200">
                            {info.chemicalRate} {info.chemicalRateUnit}
                          </td>
                          <td className="px-4  py-2 border-b border-gray-200">
                            {info.chemical}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {supply.length > 0 && (
              <div className="mb-6">
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-4 py-2">Work Area Type</th>
                        <th className="px-4 py-2">Chemical Quantity</th>
                        <th className="px-4 py-2">Chemical Rate</th>
                        <th className="px-4 py-2">Chemical</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supply.map((info) => (
                        <tr key={info._id} className="odd:bg-gray-50">
                          <td className="px-4 py-2 border-b border-gray-200">
                            {info.workAreaType}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {`${info.chemicalQuantity} Ltr.`}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {`₹ ${info.chemicalRate} ${info.chemicalRateUnit}`}
                          </td>
                          <td className="px-4 py-2 border-b border-gray-200">
                            {info.chemical}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center mt-2">
          <Button gradientDuoTone="purpleToPink" onClick={() => handlePrint()}>
            <span className="mr-2">Print</span>
          </Button>
        </div>
      </>
    );
  }
});

export default ViewContract;
