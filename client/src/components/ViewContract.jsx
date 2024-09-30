/* eslint-disable react/prop-types */
import { unwrapResult } from "@reduxjs/toolkit";
import { useReactToPrint } from "react-to-print";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { saprateQuoteInfo } from "../funtions/funtion.js";
import { Button } from "flowbite-react";
import { getSingleContract } from "../redux/contract/contractSlice.js";
import headerImage from "../images/header.png";

function longestKey() {
  return Math.max(
    "Date".length,
    "Subject".length,
    "Reference".length,
    "Specification".length,
    "Equipments".length,
    "Payment Terms".length,
    "Taxation".length,
    "Service Warranty".length
  );
}
// eslint-disable-next-line react/prop-types, react/display-name
const ViewContract = forwardRef((props) => {
  {
    // eslint-disable-next-line react/prop-types
    const { id, data } = props;
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
      if (id) {
        fn();
      } else {
        if (data?.docType) {
          data.docType === "standard"
            ? setStandard(data.quoteInfo)
            : data.docType === "supply/apply"
            ? setApplySupply(data.quoteInfo)
            : data.docType === "supply"
            ? setSupply(data.quoteInfo)
            : null;
        }
        setContract(data ? data : []);
      }
    }, [data, dispatch, id]);

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
        {loading && <Loading />}
        <div
          ref={componentRef}
          className="max-w-7xl mx-auto my-2 p-4 bg-white shadow-md rounded-lg"
        >
          <div className="w-full flex items-center justify-center">
            <div className="font-sans p-4">
              <div className="text-center">
                <img
                  src={headerImage}
                  width="600"
                  height="75"
                  alt=""
                  className="mx-auto w-full"
                />
              </div>
              <p className="text-center font-semibold text-lg mt-4 mb-4">
                PRE CONSTRUCTION ATT CONTRACT
              </p>
              <div className="border border-black w-full mb-1">
                <div className="flex">
                  <div className="border-r border-black p-2 w-1/2">
                    <p className="font-bold">CONTRACTEE INFORMATION</p>
                    <p>&nbsp;</p>
                    <p className="font-bold">
                      {`${contract?.billToAddress?.prefix} ${contract?.billToAddress?.name}`}
                    </p>
                    <p>{`${contract?.billToAddress?.a1} ${contract?.billToAddress?.a2},`}</p>
                    <p>{`${contract?.billToAddress?.a3},`}</p>
                    <p>{`${contract?.billToAddress?.a4},`}</p>
                    <p>{`${contract?.billToAddress?.city} - ${contract?.billToAddress?.pincode},`}</p>
                    <p>{`${contract?.billToAddress?.a5}.`}</p>
                    <p className="font-bold">
                      [{`GST No. ${contract?.gstNo ? contract?.gstNo : ""} `}]
                    </p>
                  </div>
                  <div className=" border border-black p-2 w-1/2">
                    <p className=" p-2 w-full">
                      <span className="font-bold text-sm mr-1">
                        Contract No:
                      </span>
                      <span className="font-bold text-xl">
                        {contract?.contractNo
                          ? contract.contractNo
                          : contract?._id}
                      </span>
                    </p>

                    <p>&nbsp;</p>
                    <p className="font-semibold p-2 w-full">
                      Contract Date:
                      {contract?.contractDate
                        ? new Date(contract?.contractDate).toLocaleDateString(
                            "en-GB"
                          )
                        : new Date(contract?.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                    </p>
                    <p>&nbsp;</p>
                    <p className="font-semibold p-2 w-full">
                      Work Order No: {contract?.workOrderNo}
                    </p>
                    <p>&nbsp;</p>
                    <p className="font-semibold p-2 w-full">
                      Work Order Date:
                      {contract?.workOrderDate
                        ? new Date(contract?.workOrderDate).toLocaleDateString(
                            "en-GB"
                          )
                        : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div className="border border-black w-full mb-4">
                <div className="grid grid-cols-3 bg-gray-300 border-b border-black">
                  <div className="border-r border-black p-1 text-center font-bold">
                    CONTACT PERSON
                  </div>
                  <div className="border-r border-black p-1 text-center font-bold">
                    TELEPHONE
                  </div>
                  <div className="border-r border-black p-1 text-center font-bold">
                    EMAIL
                  </div>
                </div>
                {contract?.billToAddress?.kci.map((kci, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 border-t border-black"
                  >
                    <div className="border-r border-black p-1 text-center">
                      {kci.name}
                    </div>
                    <div className="border-r border-black p-1 text-center">
                      {kci.phone}
                    </div>
                    <div className="border-r border-black p-1 text-center">
                      {kci.email}
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 mb-4 text-justify">
                To be paid by
                <strong>{` ${contract?.billToAddress?.prefix} ${contract?.billToAddress?.name} `}</strong>
                (Hereinafter called &lsquo;The Contractee&lsquo;) on the
                commencement of services to
                <strong> Messrs. EXPRESS PESTICIDES PVT. LTD.</strong>{" "}
                (Hereinafter called &lsquo;The Contractor&lsquo;) or their
                assignees, Administrators, representatives, and Authorized
                agents. The Contractor shall undertake to render the Pre
                Construction Anti Termite Treatment to the premises of the
                Contractee as per the particulars given below and additional
                terms printed overleaf.
              </p>
              <div className="border border-black w-full mb-4 p-2">
                <p className="flex">
                  <div
                    className="font-semibold mr-2"
                    style={{ minWidth: `${longestKey() + 2}ch` }}
                  >
                    <strong>Payment terms:</strong>
                  </div>
                  <span>
                    Within 15 days from the date of submission of bill
                  </span>
                </p>
                <p className="flex">
                  <div
                    className="font-semibold mr-2"
                    style={{ minWidth: `${longestKey() + 2}ch` }}
                  >
                    <strong>Taxation:</strong>
                  </div>
                  <span>GST @ 18% As Applicable.</span>
                </p>
                <p className="flex">
                  <div
                    className="font-semibold mr-2"
                    style={{ minWidth: `${longestKey() + 2}ch` }}
                  >
                    <strong>Service Warranty:</strong>
                  </div>
                  <span>10 Years</span>
                </p>

                <p className="ml-[170px] text-justify">
                  In case of subterranean or ground dwelling of termite
                  infestation during the guarantee period, we undertake to treat
                  the same and eradicate the termite infestation without any
                  extra cost to you. This guarantee will be forwarded on stamp
                  paper.
                </p>
                <p>&nbsp;</p>
                <p className="font-bold">Area details & Service Charges</p>

                {standard.length > 0 && (
                  <div>
                    <table className="min-w-full  border border-black">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="border border-black p-1 text-center font-bold">
                            Work Area Type
                          </th>
                          <th className="border border-black p-1 text-center font-bold">
                            Work Area
                          </th>
                          <th className="border border-black p-1 text-center font-bold">
                            Service Rate
                          </th>
                          <th className="border border-black p-1 text-center font-bold">
                            Chemical
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {standard.map((info) => (
                          <tr key={info._id} className="border-t border-black">
                            <td className="border border-black p-1 text-center">
                              {info.workAreaType}
                            </td>
                            <td className="border border-black p-1 text-center">{`${info.workArea} ${info.workAreaUnit}`}</td>
                            <td className="border border-black p-1 text-center">{`₹ ${info.serviceRate} ${info.serviceRateUnit}`}</td>
                            <td className="border border-black p-1 text-center">
                              {info.chemical}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {applySupply.length > 0 && (
                  <div>
                    <table className="min-w-full  border border-black">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="border border-black p-2 text-center font-bold">
                            Work Area Type
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Work Area
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Apply Rate
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical Quantity
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical Rate
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applySupply.map((info) => (
                          <tr key={info._id} className="border-t border-black">
                            <td className="border border-black p-2 text-center">
                              {info.workAreaType}
                            </td>
                            <td className="border border-black p-2 text-center">{`${info.workArea} ${info.workAreaUnit}`}</td>
                            <td className="border border-black p-2 text-center">{`₹ ${info.applyRate} ${info.applyRateUnit}`}</td>
                            <td className="border border-black p-2 text-center">{`${info.chemicalQuantity} Ltr.`}</td>
                            <td className="border border-black p-2 text-center">{`${info.chemicalRate} ${info.chemicalRateUnit}`}</td>
                            <td className="border border-black p-2 text-center">
                              {info.chemical}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {supply.length > 0 && (
                  <div>
                    <table className="min-w-full  border border-black">
                      <thead className="bg-gray-300">
                        <tr>
                          <th className="border border-black p-2 text-center font-bold">
                            Work Area Type
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical Quantity
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical Rate
                          </th>
                          <th className="border border-black p-2 text-center font-bold">
                            Chemical
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {supply.map((info) => (
                          <tr key={info._id} className="border-t border-black">
                            <td className="border border-black p-2 text-center">
                              {info.workAreaType}
                            </td>
                            <td className="border border-black p-2 text-center">{`${info.chemicalQuantity} Ltr.`}</td>
                            <td className="border border-black p-2 text-center">{`₹ ${info.chemicalRate} ${info.chemicalRateUnit}`}</td>
                            <td className="border border-black p-2 text-center">
                              {info.chemical}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="border border-black w-full mb-1">
                <div className="flex">
                  <div className="border-r border-black p-2 w-1/2 text-center font-bold">
                    Project Name & Address
                  </div>
                  <div className="border-l border-black p-2 w-1/2 text-center font-bold">
                    Type of Treatment
                  </div>
                </div>
                <div className="flex">
                  <div className="border-r border-t border-black p-2 w-1/2">
                    <p className="font-bold">
                      {contract?.shipToAddress?.projectName}
                    </p>
                    <p>{`${contract?.shipToAddress?.a1} ${contract?.shipToAddress?.a2},`}</p>
                    <p>{`${contract?.shipToAddress?.a3},`}</p>
                    <p>{`${contract?.shipToAddress?.a4},`}</p>
                    <p>{`${contract?.shipToAddress?.city} - ${contract?.shipToAddress?.pincode},`}</p>
                    <p>{`${contract?.shipToAddress?.a5}.`}</p>
                  </div>
                  <div className="border-l border-t border-black p-2 w-1/2 text-center">
                    Anti Termite Treatment
                  </div>
                </div>
              </div>
              <div className="border border-black w-full mb-4">
                <div className="grid grid-cols-3 bg-gray-300 border-b border-black">
                  <div className="border-r border-black p-1 text-center font-bold">
                    CONTACT PERSON
                  </div>
                  <div className="border-r border-black p-1 text-center font-bold">
                    TELEPHONE
                  </div>
                  <div className="border-r border-black p-1 text-center font-bold">
                    EMAIL
                  </div>
                </div>
                {contract?.shipToAddress?.kci.map((kci, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 border-t border-black"
                  >
                    <div className="border-r border-black p-1 text-center">
                      {kci.name}
                    </div>
                    <div className="border-r border-black p-1 text-center">
                      {kci.phone}
                    </div>
                    <div className="border-r border-black p-1 text-center">
                      {kci.email}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex w-full">
                <div className="w-1/2 p-2">
                  <p className="font-bold mb-4">
                    For EXPRESS PESTICIDES PVT. LTD.
                  </p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p className="font-bold mt-4">Authorized Signatory</p>
                  <p>
                    {`${contract?.createdBy?.initials}/
                    ${contract?.salesPerson?.initials}`}
                  </p>
                </div>
                <div className="w-1/2 p-2 text-right">
                  <p className="mb-4">We hereby confirm</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>&nbsp;</p>
                  <p>(CONTRACTEE)</p>
                </div>
              </div>
            </div>
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
