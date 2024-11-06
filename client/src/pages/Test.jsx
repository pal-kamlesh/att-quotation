import { Button } from "flowbite-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Test = () => {
  const componentRef = useRef();

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
        className="max-w-5xl bg-slate-100 mx-auto p-6 rounded-lg border border-gray-300 shadow-lg print:max-w-none print:bg-white"
      >
        <div className="border border-gray-400 p-6 bg-white shadow-md rounded-md">
          <p className="flex justify-end mb-4 text-gray-700">
            <span className="font-semibold">Warranty Number:</span>
            <span className="ml-2 text-lg">PRE/71/2024/SW/123</span>
          </p>
          <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-6">
            Pre-Construction Anti-Termite Treatment Service Warranty
          </h1>
          <p className="mb-4 text-gray-700">
            <span className="font-semibold">Issue Date:</span>
            <span className="ml-2">12/08/2024</span>
          </p>
          <div className="grid grid-cols-12 border-b pb-6 mb-6">
            <div className="col-span-6 border-r pr-6">
              <p className="font-semibold text-lg text-gray-800 mb-1">To,</p>
              <p className="font-semibold text-md text-gray-900">
                M/s. L&T Constructions
              </p>
              <p>Oberoi Realty Project, Pokharn Road No. 2</p>
              <p>Thane (W) - 400604</p>
              <p>Near Gandhi Nagar Bus Stop & Unnathi Gardens.</p>
            </div>
            <div className="col-span-6 flex flex-col justify-center items-start pl-6">
              <p className="font-semibold text-lg text-gray-800 mb-1">
                &rdquo;Project Detail&rdquo;
              </p>
              <p className="font-semibold text-md text-gray-900">
                Oberoi Realty Project
              </p>
              <p>Oberoi Realty Project, Pokharn Road No. 2</p>
              <p>Thane (W) - 400604</p>
              <p>Near Gandhi Nagar Bus Stop & Unnathi Gardens.</p>
            </div>
          </div>
          <div className="grid grid-cols-12 mb-6">
            <div className="col-span-6 flex flex-col">
              <p className="font-semibold text-lg">
                <span>*</span> Service Warranty Period:
              </p>
              <p className="ml-2">From: 12/08/2024</p>
              <p className="ml-2">Upto: 12/08/2034</p>
            </div>
            <div className="col-span-6 flex justify-center items-center text-lg font-semibold">
              <span>Chemical Name: Imidachloprid 30.5% SC</span>
            </div>
          </div>
          <p className="text-justify text-gray-700 leading-relaxed mb-6">
            This service warranty is provided in accordance of the guidelines
            laid for the best practices in Anti Termite Treatment as in
            accordance of ISTM 2024 “Indian Standard of Termite Management”
            whereby the document is used by the accredited Professional Pest
            Management Company.
          </p>
          <div className="mt-6 mb-6">
            <table className="min-w-full border border-gray-500">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border border-gray-500 p-2 text-center font-semibold">
                    Type of Structure
                  </th>
                  <th className="border border-gray-500 p-2 text-center font-semibold">
                    Area Treated
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-500 p-2 text-center">
                    Basement
                  </td>
                  <td className="border border-gray-500 p-2 text-center">
                    50 Sq.mts
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-justify text-gray-700 leading-relaxed mb-6">
            <span className="ml-4 text-justify">Hereby</span> certified that the
            structure described in “Project Detail” has been treated against
            subterranean termite and is treated as per mutually agreed
            application standard, for managing termite escalations in the
            treated area, for a period as specified above<span>*</span>. In the
            event if the said structure is found infested with subterranean
            termites at any time during the period of service warranty, we
            undertake to carry out needed treatment using the same chemicals as
            used during the service, such treatment as may be necessary will be
            implemented by us to render the said structure free from termite
            infestation at no extra cost for such treatment to the owner of the
            said premises.
          </p>
          <p className="text-justify text-gray-700 leading-relaxed mb-6">
            <span className="ml-4 text-justify">This</span> Service warranty
            does not cover any responsibility towards the termite infestation
            which would have entered the structure through any future additions
            or extensions made to the structure post our initial treatment or
            through untreated areas. It is in the interest of the owner to
            ensure that any future additions or extensions to the structure and
            any soil matter brought or placed inside the structure are promptly
            treated against termites and covered by a separate Service Warranty.
          </p>
          <div className="flex items-center mt-10">
            <div>
              <p>
                For
                <span className="font-bold">EXPRESS PESTICIDES PVT.LTD.</span>
              </p>
              <p className="mt-16">Authorized Signatory</p>
            </div>
            <div className="ml-auto relative flex justify-center items-center w-36 h-36 border-2 border-gray-800 rounded-full">
              <p className="absolute text-center text-lg">Warranty Seal</p>
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
};

export default Test;
