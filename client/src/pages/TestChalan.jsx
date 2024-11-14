/* eslint-disable react/prop-types */
import { FaScissors } from "react-icons/fa6";

function TestChalan({ selectedDc, contract }) {
  return (
    <div className="max-w-2xl mx-auto overflow-hidden m-2">
      <Chalan
        selectedDc={selectedDc}
        contract={contract}
        copyFor="Office Copy"
      />
      <div className="flex justify-center items-center">
        <FaScissors />
        <span>- - - - - - - - - - - - - - - - - - </span>
        <FaScissors />
        <span>- - - - - - - - - - - - - - - - - - </span>
        <FaScissors />
      </div>
      <Chalan
        selectedDc={selectedDc}
        contract={contract}
        copyFor="Client Copy"
      />
    </div>
  );
}

function Chalan({ selectedDc, contract, copyFor }) {
  return (
    <div className="p-3 border border-black max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <p className="font-bold">{copyFor}</p>
        <div className="p-1">
          <p className="text-sm  text-center">MATERIAL CHALLAN</p>
        </div>
        <p className="font-semibold">
          NO <span>{selectedDc.dcCount}</span>
        </p>
      </div>

      <p className=" text-center ml-8 text-3xl font-semibold mb-2">EPCORN</p>
      <p className="text-sm text-center mb-4 border-b border-b-black"></p>

      <div className="mb-4 grid grid-cols-12 w-full border ">
        <p className="font-semibold col-span-8 border h-full border-black p-2">
          <span className="mr-1">Ship To: </span>
          <br />
          <span>
            {contract?.shipToAddress.a1}
            {contract?.shipToAddress.a2},{contract?.shipToAddress.a3}
            {contract?.shipToAddress.a4},{contract?.shipToAddress.a5}
            {contract?.shipToAddress.city}-{contract?.shipToAddress.pincode}
          </span>
        </p>
        <div className="text-sm mt-1 col-span-4 p-4">
          <p className="mb-[30px]">
            <span className="mr-1">Date:</span>
            <span>{new Date(selectedDc?.createdAt).toLocaleDateString()}</span>
          </p>
          <p className="mt-[30px]">
            <span className="mr-1">S.C:</span>
            <span>{contract?.contractNo}</span>
          </p>
        </div>
      </div>

      <p className="mb-4 mt-4 text-xs text-justify">
        We are sending with our man the following mentioned material for the
        Anti Termite works on a returnable basis.
      </p>

      <table className="w-full border border-black text-sm mb-4">
        <thead>
          <tr className="border-b border-black">
            <th className="border-r border-black p-2 text-left">Sr No</th>
            <th className="border-r border-black p-2 text-center">
              <p>Chemical Name</p>
              <p>Batch No</p>
            </th>
            <th className="border-r border-black p-2 text-left">Packaging</th>
            <th className="border-r border-black p-2 text-left">
              QUANTITY (KGS/LTR)
            </th>
            <th className="p-2 text-left">TOTAL QUANTITY</th>
          </tr>
        </thead>
        <tbody>
          {selectedDc?.dcObj?.map((dc, idx) => (
            <tr key={dc.chemical} className="border-b border-black">
              <td className="border-r border-black p-2">{idx + 1}</td>
              <td className="border-r border-black p-2 text-center">
                <p>{dc?.chemical}</p>
                <p>{dc?.batchNo}</p>
              </td>
              <td className="border-r border-black p-2">{dc?.packaging}</td>
              <td className="border-r border-black p-2">{dc?.chemicalqty}</td>
              <td className="border-r border-black p-2">
                {qunatyCalculator(dc?.packaging, dc?.chemicalqty)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className=" flex justify-between items-end">
        <div className=" mt-4 text-sm">
          <p>For EPCORN</p>
          <br />
          <br />
          <p>ATT Service Dept</p>
        </div>
        <p>Receiver Signature</p>
      </div>
    </div>
  );
}

export default TestChalan;

function qunatyCalculator(packaging, quantity) {
  const [num, unit] = packaging.split(" ");
  console.log(num);
  console.log(quantity);
  return `${Number(num) * Number(quantity)} ${unit}`;
}
