import { unwrapResult } from "@reduxjs/toolkit";
import { useReactToPrint } from "react-to-print";
import { forwardRef, useEffect, useRef, useState } from "react";
import { getSingleQuote } from "../redux/quote/quoteSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { saprateQuoteInfo } from "../funtions/funtion.js";
import { Button } from "flowbite-react";

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
const ViewQuote = forwardRef((props) => {
  {
    // eslint-disable-next-line react/prop-types
    const { quoteId } = props;
    const dispatch = useDispatch();
    const [quote, setQuote] = useState({});
    const [standard, setStandard] = useState([]);
    const [applySupply, setApplySupply] = useState([]);
    const [supply, setSupply] = useState([]);
    const { loading } = useSelector((state) => state.quote);
    const componentRef = useRef();

    useEffect(() => {
      async function fn() {
        const actionResult = await dispatch(getSingleQuote(quoteId));
        const result = unwrapResult(actionResult);
        setQuote(result.result);
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
    }, [dispatch, quoteId]);
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      onAfterPrint: async () => {
        // const resultAction = await dispatch(incPrintCount(id));
        // // eslint-disable-next-line no-unused-vars
        // const result = unwrapResult(resultAction);
        // close();
      },
    });
    console.log(supply);
    return (
      <>
        <div
          ref={componentRef}
          className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-md rounded-lg"
        >
          <div className="mb-6 flex justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Quotation</h1>
            </div>
            {loading && <Loading />}
            <div className="text-right">
              <p className="text-gray-600">
                <span
                  className="font-semibold mr-2"
                  style={{ minWidth: `${longestKey + 2}ch` }}
                >
                  Quotation No:
                </span>
                {quote.quotationNo}
              </p>
              <p className="text-gray-600">
                <span
                  className="font-semibold mr-2"
                  style={{ minWidth: `${longestKey + 2}ch` }}
                >
                  Date:
                </span>
                {new Date(quote.quotationDate).toLocaleDateString("en-GB")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
              <p className="text-gray-600">
                {quote.billToAddress?.frefix} {quote.billToAddress?.name}
              </p>
              <p className="text-gray-600">
                {quote.billToAddress?.a1}
                {quote.billToAddress?.a2}
              </p>
              <p className="text-gray-600">{quote.billToAddress?.a3}</p>
              <p className="text-gray-600">{quote.billToAddress?.a4}</p>
              <p className="text-gray-600">{quote.billToAddress?.a5}</p>
              <p className="text-gray-600">
                {quote.billToAddress?.city} - {quote.billToAddress?.pincode}
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Ship To:</h2>
              <p className="text-gray-600">
                {quote.shipToAddress?.projectName}
              </p>
              <p className="text-gray-600">
                {quote.shipToAddress?.a1}
                {quote.shipToAddress?.a2}
              </p>
              <p className="text-gray-600">{quote.shipToAddress?.a3}</p>
              <p className="text-gray-600">{quote.shipToAddress?.a4}</p>
              <p className="text-gray-600">{quote.shipToAddress?.a5}</p>
              <p className="text-gray-600">
                {quote.shipToAddress?.city} - {quote.shipToAddress?.pincode}
              </p>
            </div>
          </div>

          {quote.kindAttention === "NA" || quote.kindAttention === "" ? null : (
            <div className="mb-6 flex items-center">
              <div
                className="text-lg font-semibold mr-2"
                style={{ minWidth: `${longestKey() + 2}ch` }}
              >
                Kind Attention:
              </div>
              <p className="text-gray-600 whitespace-pre-line">
                {quote.kindAttentionPrefix} {quote.kindAttention}
              </p>
            </div>
          )}

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Subject:
            </div>
            <div className="w-2/3 text-gray-600">{quote.subject}</div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Reference:
            </div>
            <div className="w-2/3 text-gray-600">
              {quote?.reference?.map((ref, idx) => (
                <div key={idx}>
                  <span className=" font-bold ">{idx + 1}</span>
                  {ref}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Treatment Type:
            </div>
            <div className="w-2/3 text-gray-600">
              {quote.treatmentType + " [Sac-code ... 998531]"}
            </div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Specification:
            </div>
            <div className="w-2/3 text-gray-600">{quote.specification}</div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Equipments:
            </div>
            <div className="w-2/3 text-gray-600">{quote.equipments}</div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Payment Terms:
            </div>
            <div className="w-2/3 text-gray-600">{quote.paymentTerms}</div>
          </div>

          <div className="mb-6 flex">
            <div
              className="font-semibold mr-2"
              style={{ minWidth: `${longestKey() + 2}ch` }}
            >
              Taxation:
            </div>
            <div className="w-2/3 text-gray-600">{quote.taxation}</div>
          </div>

          {quote.note !== "" ? (
            <div className="mb-6">
              <div
                className="font-semibold mb-2"
                style={{ minWidth: `${longestKey() + 2}ch` }}
              >
                Note:
              </div>
              <p className="text-gray-600 whitespace-pre-line">{quote.note}</p>
            </div>
          ) : null}

          <div>
            <h2 className="text-lg font-semibold mb-4">Quote Information:</h2>
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

export default ViewQuote;
