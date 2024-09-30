/* eslint-disable react/prop-types */
import { unwrapResult } from "@reduxjs/toolkit";
import { useReactToPrint } from "react-to-print";
import { forwardRef, useEffect, useRef, useState } from "react";
import { docxData } from "../redux/quote/quoteSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "./Loading";
import { saprateQuoteInfo } from "../funtions/funtion.js";
import { Button } from "flowbite-react";
import headerImage from "../images/header.png";
import footerImage from "../images/footer.png";
import stamp from "../images/stamp.png";

// eslint-disable-next-line react/prop-types, react/display-name
const ViewQuote = forwardRef((props) => {
  {
    // eslint-disable-next-line react/prop-types
    const { quoteId, data } = props;
    const dispatch = useDispatch();
    const [quote, setQuote] = useState({});
    const [standard, setStandard] = useState([]);
    const [applySupply, setApplySupply] = useState([]);
    const [supply, setSupply] = useState([]);
    const { loading } = useSelector((state) => state.quote);
    const componentRef = useRef();

    useEffect(() => {
      async function fn() {
        const actionResult = await dispatch(docxData(quoteId));
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
      if (quoteId) {
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
        setQuote(data ? data : []);
      }
    }, [data, dispatch, quoteId]);
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
          className="max-w-7xl mx-auto my-1 p-4 bg-white shadow-md rounded-lg flex items-center justify-center border"
        >
          <div className="word-section1 p-4 w-full">
            {/* Header Image */}
            <div className="flex justify-center">
              <img src={headerImage} alt="Header Image" className="w-full " />
            </div>

            {/* Quotation Title */}
            <p className="text-center text-lg font-bold mt-4">Quotation</p>

            {/* Quotation Information */}
            <div className="mt-4">
              <p className="text-sm font-bold">Quotation No: EPPL/ATT/QTN/26</p>
              <p className="text-sm font-bold">Date: 28/09/2024</p>
            </div>

            {/* Bill To and Ship To Information */}
            <div className="mt-4 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-2">
                <p className="font-bold">Bill To:</p>
                <p className="font-bold">
                  {`${quote?.billToAddress?.prefix} ${quote?.billToAddress?.name}`}
                </p>
                <p>{`${quote?.billToAddress?.a1} ${quote?.billToAddress?.a2},`}</p>
                <p>{`${quote?.billToAddress?.a3},`}</p>
                <p>{`${quote?.billToAddress?.a4},`}</p>
                <p>{`${quote?.billToAddress?.city} - ${quote?.billToAddress?.pincode},`}</p>
                <p>{`${quote?.billToAddress?.a5}.`}</p>
              </div>
              <div className="w-full md:w-1/2 p-2">
                <p className="font-bold">Ship To:</p>
                <p className="font-bold">{quote?.shipToAddress?.projectName}</p>
                <p>{`${quote?.shipToAddress?.a1} ${quote?.shipToAddress?.a2},`}</p>
                <p>{`${quote?.shipToAddress?.a3},`}</p>
                <p>{`${quote?.shipToAddress?.a4},`}</p>
                <p>{`${quote?.shipToAddress?.city} - ${quote?.shipToAddress?.pincode},`}</p>
                <p>{`${quote?.shipToAddress?.a5}.`}</p>
              </div>
            </div>

            {/* Kind Attention */}
            <div className="mt-4">
              <p className="font-bold">
                Kind Attention:{" "}
                {`${quote?.kindAttentionPrefix} ${quote?.kindAttention}`}
              </p>
            </div>

            {/* Quotation Description */}
            <div className="mt-4">
              <p className="font-bold">
                {quote?.salesPerson?.initials === "SALES"
                  ? "We thank you for your enquiry and the opportunity given to us to quote our rates, Further to your instructions, we are pleased to submit our quotation as below"
                  : `We thank for your enquiry & the time given to our Representative ${quote?.salesPerson?.prefix} ${quote?.salesPerson?.username}`}
              </p>
            </div>

            {/* Quotation Details Table */}
            <table className="w-full mt-4">
              <tbody>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Subject:</td>
                  <td className="w-3/4 p-2 ">{quote?.subject}</td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Reference:</td>
                  <td className="w-3/4 p-2 ">
                    {quote?.reference?.map((ref, idx) => (
                      <div key={idx}>
                        <span className=" font-bold ">
                          {quote.reference.length > 1 && idx + 1}
                        </span>
                        {ref}
                      </div>
                    ))}
                  </td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Treatment Type:</td>
                  <td className="w-3/4 p-2 ">
                    {quote?.treatmentType + " [Sac-code ... 998531]"}
                  </td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Specification:</td>
                  <td className="w-3/4 p-2 ">{quote?.specification}</td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Payment Terms:</td>
                  <td className="w-3/4 p-2 ">
                    {String(quote?.paymentTerms)
                      .split(".")
                      .filter((v) => v.trim() !== "")
                      .map((ref, idx) => (
                        <div key={idx}>
                          <span className=" font-bold ">
                            {String(quote.paymentTerms)
                              .split(".")
                              .filter((v) => v.trim() !== "").length > 1 &&
                              idx + 1}
                          </span>
                          {ref}
                        </div>
                      ))}
                  </td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Taxation:</td>
                  <td className="w-3/4 p-2 ">{quote?.taxation}</td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Equipments:</td>
                  <td className="w-3/4 p-2 ">{quote?.equipments}</td>
                </tr>
                <tr className="">
                  <td className="w-1/4 p-2  font-bold">Service Warranty:</td>
                  <td className="w-3/4 p-2 text-justify ">
                    10 Years In case of subterranean or ground dwelling of
                    termite infestation during the guarantee period, we
                    undertake to treat the same and eradicate the termite
                    infestation without any extra cost to you. This guarantee
                    will be forwarded on stamp paper.
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Quote Information */}
            <div className="mt-4">
              <p className="font-bold">Quote Information:</p>
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

            {/* Closing Notes */}
            <div className="mt-4">
              <p>
                We hope you will accept the same and will give us the
                opportunity to be of service to you.
              </p>
              <p className=" text-xs">
                Please call us for clarification if any.
              </p>
            </div>

            {/* Signature */}
            <div className="mt-4">
              <p>Thanking you,</p>
              <p>Yours faithfully,</p>
              <p>For EXPRESS PESTICIDES PVT. LTD.</p>
              <div className="mt-1 flex justify-start">
                <img src={stamp} alt="Signature" className="w-12 h-10" />
              </div>
              <p>Authorized Signatory</p>
              <p>{`${quote?.createdBy?.initials}/
                    ${quote?.salesPerson?.initials}`}</p>
            </div>

            {/* Footer Image */}
            <div className="flex justify-center mt-4">
              <img
                src={footerImage}
                alt="Footer Image"
                className="w-full max-w-lg"
              />
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

export default ViewQuote;
